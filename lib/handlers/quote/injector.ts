import {
  AlphaRouter,
  AlphaRouterConfig,
  ID_TO_CHAIN_ID,
  IRouter,
  LegacyRoutingConfig,
  setGlobalLogger,
  setGlobalMetric,
  V3HeuristicGasModelFactory,
} from '@uniswap/smart-order-router'
import { Protocol } from '@uniswap/router-sdk'
import {
  convertStringRouterVersionToEnum,
  URVersionsToProtocolVersions,
} from '../../util/supportedProtocolVersions'
import { MetricsLogger } from 'aws-embedded-metrics'
import { APIGatewayProxyEvent, Context } from 'aws-lambda'
import { default as bunyan, default as Logger } from 'bunyan'
import { BigNumber } from 'ethers'
import { ContainerInjected, InjectorSOR, RequestInjected } from '../injector-sor'
import { AWSMetricsLogger } from '../router-entities/aws-metrics-logger'
import { StaticGasPriceProvider } from '../router-entities/static-gas-price-provider'
import { QuoteQueryParams } from './schema/quote-schema'
export class QuoteHandlerInjector extends InjectorSOR<
  IRouter<AlphaRouterConfig | LegacyRoutingConfig>,
  QuoteQueryParams
> {
  public async getRequestInjected(
    containerInjected: ContainerInjected,
    _requestBody: void,
    requestQueryParams: QuoteQueryParams,
    _event: APIGatewayProxyEvent,
    context: Context,
    log: Logger,
    metricsLogger: MetricsLogger
  ): Promise<RequestInjected<IRouter<AlphaRouterConfig | LegacyRoutingConfig>>> {
    const {
      tokenInAddress,
      tokenInChainId,
      tokenOutAddress,
      amount,
      type,
      algorithm,
      gasPriceWei,
      quoteSpeed,
      intent,
      gasToken,
      enableDebug,
      protocols: protocolsStr,
    } = requestQueryParams

    const { dependencies, activityId } = containerInjected

    const requestId = context.awsRequestId
    const quoteId = requestId.substring(0, 5)
    // Sample 10% of all requests at the INFO log level for debugging purposes.
    // All other requests will only log warnings and errors.
    // Note that we use WARN as a default rather than ERROR
    // to capture Tapcompare logs in the smart-order-router.
    const logLevel = enableDebug ? bunyan.DEBUG : Math.random() < 0.1 ? bunyan.INFO : bunyan.WARN

    log = log.child({
      serializers: bunyan.stdSerializers,
      level: logLevel,
      requestId,
      quoteId,
      tokenInAddress,
      chainId: tokenInChainId,
      tokenOutAddress,
      amount,
      type,
      algorithm,
      gasToken,
      activityId: activityId,
    })
    setGlobalLogger(log)

    metricsLogger.setNamespace('Uniswap')
    metricsLogger.setDimensions({ Service: 'RoutingAPI' })
    const metric = new AWSMetricsLogger(metricsLogger)
    setGlobalMetric(metric)

    // Today API is restricted such that both tokens must be on the same chain.
    const chainId = tokenInChainId
    const chainIdEnum = ID_TO_CHAIN_ID(chainId)

    if (!dependencies[chainIdEnum]) {
      // Request validation should prevent reject unsupported chains with 4xx already, so this should not be possible.
      throw new Error(`No container injected dependencies for chain: ${chainIdEnum}`)
    }

    const universalRouterVersion = convertStringRouterVersionToEnum(
      _event.headers?.['x-universal-router-version'],
      chainIdEnum
    )

    let protocols: Protocol[] | undefined = undefined
    if (protocolsStr) {
      const requestedProtocols = Array.isArray(protocolsStr) ? protocolsStr : [protocolsStr]
      protocols = []
      for (const protocolStr of requestedProtocols) {
        switch (protocolStr.toUpperCase()) {
          case Protocol.V2:
            if (URVersionsToProtocolVersions[universalRouterVersion].includes(Protocol.V2)) {
              protocols.push(Protocol.V2)
            }
            break
          case Protocol.V3:
            if (URVersionsToProtocolVersions[universalRouterVersion].includes(Protocol.V3)) {
              protocols.push(Protocol.V3)
            }
            break
          case Protocol.V4:
            if (URVersionsToProtocolVersions[universalRouterVersion].includes(Protocol.V4)) {
              protocols.push(Protocol.V4)
            }
            break
          case Protocol.MIXED:
            protocols.push(Protocol.MIXED)
            break
        }
      }
    }

    const onlyV4Requested = protocols?.length === 1 && protocols[0] === Protocol.V4

    const {
      provider,
      v4PoolProvider,
      v4SubgraphProvider,
      v3PoolProvider,
      multicallProvider,
      tokenProvider,
      tokenListProvider,
      v3SubgraphProvider,
      blockedTokenListProvider,
      v2PoolProvider,
      tokenValidatorProvider,
      tokenPropertiesProvider,
      v2QuoteProvider,
      v2SubgraphProvider,
      gasPriceProvider: gasPriceProviderOnChain,
      simulator,
      routeCachingProvider,
      v2Supported,
      v4Supported,
      mixedSupported,
      mixedCrossLiquidityV3AgainstV4Supported,
      v4PoolParams,
      cachedRoutesCacheInvalidationFixRolloutPercentage,
      deleteCacheEnabledChains,
    } = dependencies[chainIdEnum]!

    let onChainQuoteProvider = dependencies[chainIdEnum]!.onChainQuoteProvider
    let gasPriceProvider = gasPriceProviderOnChain
    if (gasPriceWei) {
      const gasPriceWeiBN = BigNumber.from(gasPriceWei)
      gasPriceProvider = new StaticGasPriceProvider(gasPriceWeiBN)
    }

    if (onlyV4Requested) {
      log.info(
        {
          chainId,
          protocols,
        },
        `Only V4 requested - keeping V3 providers for gas estimation, but V4 should be used for routing`
      )
    }

    let router
    switch (algorithm) {
      case 'alpha':
      default:
        router = new AlphaRouter({
          chainId,
          provider,
          v4SubgraphProvider,
          v4PoolProvider,
          v3SubgraphProvider,
          multicall2Provider: multicallProvider,
          v3PoolProvider,
          onChainQuoteProvider,
          gasPriceProvider,
          v3GasModelFactory: new V3HeuristicGasModelFactory(provider),
          blockedTokenListProvider,
          tokenProvider,
          v2PoolProvider: onlyV4Requested ? undefined : v2PoolProvider,
          v2QuoteProvider: onlyV4Requested ? undefined : v2QuoteProvider,
          v2SubgraphProvider: onlyV4Requested ? undefined : v2SubgraphProvider,
          simulator,
          routeCachingProvider,
          tokenValidatorProvider,
          tokenPropertiesProvider,
          v2Supported,
          v4Supported,
          mixedSupported,
          mixedCrossLiquidityV3AgainstV4Supported,
          v4PoolParams,
          cachedRoutesCacheInvalidationFixRolloutPercentage,
          deleteCacheEnabledChains,
        })
        break
    }

    return {
      chainId: chainIdEnum,
      id: quoteId,
      log,
      metric,
      router,
      v4PoolProvider,
      v3PoolProvider,
      v2PoolProvider,
      tokenProvider,
      tokenListProvider,
      quoteSpeed,
      intent,
    }
  }
}
