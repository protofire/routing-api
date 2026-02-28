/**
 * Local HTTP server wrapping the Lambda quote handler for debugging.
 *
 * Usage:
 *   WEB3_RPC_GATEWAY_111557560=https://rpc.testnet.cyber.co npx ts-node -P tsconfig.cdk.json --files local-server.ts
 */

import * as http from 'http'
import * as url from 'url'
import * as crypto from 'crypto'
import { APIGatewayProxyEvent, Context } from 'aws-lambda'

// Minimal env defaults so the handler doesn't crash on missing AWS resources
process.env.POOL_CACHE_BUCKET_3 = process.env.POOL_CACHE_BUCKET_3 || ''
process.env.POOL_CACHE_GZIP_KEY = process.env.POOL_CACHE_GZIP_KEY || ''
process.env.TOKEN_LIST_CACHE_BUCKET = process.env.TOKEN_LIST_CACHE_BUCKET || ''
process.env.ROUTES_TABLE_NAME = process.env.ROUTES_TABLE_NAME || ''
process.env.ROUTES_CACHING_REQUEST_FLAG_TABLE_NAME = process.env.ROUTES_CACHING_REQUEST_FLAG_TABLE_NAME || ''
process.env.CACHED_ROUTES_TABLE_NAME = process.env.CACHED_ROUTES_TABLE_NAME || ''
process.env.AWS_LAMBDA_FUNCTION_NAME = process.env.AWS_LAMBDA_FUNCTION_NAME || 'local'
process.env.V2_PAIRS_CACHE_TABLE_NAME = process.env.V2_PAIRS_CACHE_TABLE_NAME || ''
process.env.CACHING_ROUTING_LAMBDA_FUNCTION_NAME = process.env.CACHING_ROUTING_LAMBDA_FUNCTION_NAME || ''

const PORT = process.env.PORT || 3000

// Parse CHAIN_IDS env var, defaulting to Cyber Testnet only
const CHAIN_IDS = (process.env.CHAIN_IDS || '111557560').split(',').map(Number)

async function main() {
  console.log('Loading modules...')

  // Override GlobalRpcProviders to only configure the requested chains
  const { GlobalRpcProviders } = require('./lib/rpc/GlobalRpcProviders')

  // Build a local-only prod config with only the chains we have RPC URLs for
  const localProdConfig = CHAIN_IDS
    .filter((chainId: number) => {
      const gatewayKey = `WEB3_RPC_GATEWAY_${chainId}`
      const rpcKey = `WEB3_RPC_${chainId}`
      return process.env[gatewayKey] || process.env[rpcKey]
    })
    .map((chainId: number) => {
      const gatewayKey = `WEB3_RPC_GATEWAY_${chainId}`
      return {
        chainId,
        useMultiProviderProb: 1,
        latencyEvaluationSampleProb: 0,
        healthCheckSampleProb: 0,
        providerInitialWeights: [1],
        providerUrls: [gatewayKey],
        providerNames: ['WEB3_RPC_GATEWAY'],
      }
    })

  console.log(`Local RPC config for chains: ${localProdConfig.map((c: any) => c.chainId).join(', ')}`)

  // Monkey-patch getGlobalUniRpcProviders to always pass our local config
  const originalGetGlobal = GlobalRpcProviders.getGlobalUniRpcProviders.bind(GlobalRpcProviders)
  GlobalRpcProviders.getGlobalUniRpcProviders = (log: any, uniConfig?: any, singleConfig?: any, _prodConfigJson?: any) => {
    return originalGetGlobal(log, uniConfig, singleConfig, localProdConfig)
  }

  // Override SUPPORTED_CHAINS to only include our target chains
  const injectorSor = require('./lib/handlers/injector-sor')
  const { ChainId } = require('@uniswap/sdk-core')

  const targetChains = CHAIN_IDS.map((id: number) => {
    const entry = Object.entries(ChainId).find(([_, v]) => v === id)
    if (!entry) {
      console.warn(`ChainId ${id} not found in @uniswap/sdk-core`)
      return id
    }
    return id
  })

  // Monkey-patch SUPPORTED_CHAINS to only our target chains
  injectorSor.SUPPORTED_CHAINS.length = 0
  for (const chainId of targetChains) {
    injectorSor.SUPPORTED_CHAINS.push(chainId)
  }
  console.log(`SUPPORTED_CHAINS set to: [${injectorSor.SUPPORTED_CHAINS.join(', ')}]`)

  // Now load and initialize the handler
  const { QuoteHandlerInjector } = require('./lib/handlers/quote/injector')
  const { QuoteHandler } = require('./lib/handlers/quote/quote')

  console.log('Initializing chain dependencies (this may take a moment)...')
  const quoteInjectorPromise = new QuoteHandlerInjector('quoteInjector').build()
  const quoteHandlerInstance = new QuoteHandler('quote', quoteInjectorPromise)
  const handler = quoteHandlerInstance.handler

  await quoteInjectorPromise
  console.log('Handler loaded and dependencies initialized.')

  const server = http.createServer(async (req, res) => {
    const parsed = url.parse(req.url!, true)

    if (parsed.pathname !== '/quote') {
      res.writeHead(404, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'Not found. Use /quote' }))
      return
    }

    const event = {
      httpMethod: 'GET',
      path: '/quote',
      queryStringParameters: parsed.query as { [key: string]: string },
      headers: (req.headers || {}) as { [key: string]: string },
      body: null,
      isBase64Encoded: false,
      pathParameters: null,
      stageVariables: null,
      requestContext: {} as any,
      multiValueHeaders: {} as any,
      multiValueQueryStringParameters: null,
      resource: '/quote',
    } as APIGatewayProxyEvent

    const context = {
      awsRequestId: crypto.randomUUID(),
      functionName: 'local-quote',
      functionVersion: '$LATEST',
      invokedFunctionArn: '',
      memoryLimitInMB: '5120',
      logGroupName: '',
      logStreamName: '',
      getRemainingTimeInMillis: () => 60000,
      callbackWaitsForEmptyEventLoop: true,
      done: () => {},
      fail: () => {},
      succeed: () => {},
    } as Context

    try {
      console.log(`\n[${new Date().toISOString()}] Quote request:`, JSON.stringify(parsed.query))
      const startTime = Date.now()
      const result = await handler(event, context)
      const duration = Date.now() - startTime
      console.log(`[${new Date().toISOString()}] Response status: ${result.statusCode} (${duration}ms)`)
      if (result.statusCode !== 200) {
        console.log(`[${new Date().toISOString()}] Response body: ${result.body}`)
      }

      res.writeHead(result.statusCode, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        ...(result.headers || {}),
      })
      res.end(result.body)
    } catch (err: any) {
      console.error('Unhandled error:', err)
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: err.message, stack: err.stack }))
    }
  })

  server.listen(PORT, () => {
    console.log(`\nLocal routing-api server running on http://localhost:${PORT}`)
    console.log(`\nTest URL:\nhttp://localhost:${PORT}/quote?tokenInAddress=0xc51328c878a01e9bec626b0970713e77785b323a&tokenInChainId=111557560&tokenOutAddress=0xBba2097918f7467b4D6764dac7577620bC02C892&tokenOutChainId=111557560&amount=56780000000000&type=exactIn&slippageTolerance=0.5&enableUniversalRouter=true&source=unknown&protocols=v4&enableDebug=true`)
  })
}

main().catch((err) => {
  console.error('Failed to start:', err)
  process.exit(1)
})
