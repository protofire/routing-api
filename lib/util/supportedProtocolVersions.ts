import { Protocol } from '@uniswap/router-sdk'
import { UniversalRouterVersion } from '@uniswap/universal-router-sdk'
import { ChainId } from '@uniswap/sdk-core'

export const SUPPORTED_PROTOCOL_VERSIONS = [Protocol.V2, Protocol.V3, Protocol.V4]

const V4_ONLY_CHAINS = [ChainId.CYBER_TESTNET]

export function convertStringRouterVersionToEnum(routerVersion?: string, chainId?: ChainId): UniversalRouterVersion {
  const validVersions = Object.values(UniversalRouterVersion)
  const parsedVersion = validVersions.find((v) => v === routerVersion)
  if (parsedVersion) {
    return parsedVersion
  }
  if (chainId && V4_ONLY_CHAINS.includes(chainId)) {
    return UniversalRouterVersion.V2_0
  }
  return UniversalRouterVersion.V1_2
}

export type URVersionsToProtocolVersionsMapping = {
  readonly [universalRouterVersion in UniversalRouterVersion]: Array<Protocol>
}

export const URVersionsToProtocolVersions: URVersionsToProtocolVersionsMapping = {
  [UniversalRouterVersion.V1_2]: [Protocol.V2, Protocol.V3],
  [UniversalRouterVersion.V2_0]: [Protocol.V2, Protocol.V3, Protocol.V4],
  [UniversalRouterVersion.V2_1]: [Protocol.V2, Protocol.V3, Protocol.V4]
}

export function protocolVersionsToBeExcludedFromMixed(universalRouterVersion: UniversalRouterVersion): Protocol[] {
  return SUPPORTED_PROTOCOL_VERSIONS.filter(
    (protocol) => !URVersionsToProtocolVersions[universalRouterVersion].includes(protocol)
  )
}
