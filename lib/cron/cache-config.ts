import { Protocol } from '@uniswap/router-sdk'
import { V2SubgraphProvider, V3SubgraphProvider, V4SubgraphProvider } from '@uniswap/smart-order-router'
import { ChainId } from '@uniswap/sdk-core'
import { EulerSwapHooksSubgraphProvider } from '@uniswap/smart-order-router/'
import {
  ZORA_CREATOR_HOOK_ON_BASE_v1,
  ZORA_CREATOR_HOOK_ON_BASE_v1_0_0_1,
  ZORA_CREATOR_HOOK_ON_BASE_v1_1_1,
  ZORA_CREATOR_HOOK_ON_BASE_v1_1_1_1,
  ZORA_CREATOR_HOOK_ON_BASE_v1_1_2,
  ZORA_CREATOR_HOOK_ON_BASE_v2_2,
  ZORA_CREATOR_HOOK_ON_BASE_v2_2_1,
  ZORA_POST_HOOK_ON_BASE_v1,
  ZORA_POST_HOOK_ON_BASE_v1_0_0_1,
  ZORA_POST_HOOK_ON_BASE_v1_0_0_2,
  ZORA_POST_HOOK_ON_BASE_v1_1_1,
  ZORA_POST_HOOK_ON_BASE_v1_1_1_1,
  ZORA_POST_HOOK_ON_BASE_v1_1_2,
  ZORA_POST_HOOK_ON_BASE_v2_2,
  ZORA_POST_HOOK_ON_BASE_v2_2_1,
  ZORA_POST_HOOK_ON_BASE_v2_3_0,
  CLANKER_DYNAMIC_FEE_HOOKS_ADDRESS_ON_BASE,
  CLANKER_STATIC_FEE_HOOKS_ADDRESS_ON_BASE,
  CLANKER_DYNAMIC_FEE_HOOKS_ADDRESS_ON_BASE_v2,
  CLANKER_STATIC_FEE_HOOKS_ADDRESS_ON_BASE_v2,
  CLANKER_DYNAMIC_FEE_HOOKS_ADDRESS_ON_ARBITRUM,
  CLANKER_STATIC_FEE_HOOKS_ADDRESS_ON_ARBITRUM,
  CLANKER_DYNAMIC_FEE_HOOKS_ADDRESS_ON_UNICHAIN,
  CLANKER_STATIC_FEE_HOOKS_ADDRESS_ON_UNICHAIN,
  CLANKER_STATIC_FEE_HOOKS_ADDRESS_ON_MAINNET,
  CLANKER_STATIC_FEE_HOOKS_ADDRESS_ON_MONAD,
} from '../util/hooksAddressesAllowlist'

// during local cdk stack update, the env vars are not populated
// make sure to fill in the env vars below
// we have two alchemy accounts to split the load, v3 and v4 subgraphs are on
// the second account while v2 is on the first
// process.env.ALCHEMY_QUERY_KEY = ''
// process.env.ALCHEMY_QUERY_KEY_2 = ''
// process.env.GRAPH_BASE_V4_SUBGRAPH_ID = ''
// process.env.GRAPH_BEARER_TOKEN = ''
// process.env.GOLDSKY_BEARER_TOKEN = ''
// process.env.GOLDSKY_API_KEY = ''
// // Goldsky V2 subgraph IDs
// process.env.GOLD_SKY_ETHEREUM_V2_ID = ''
// process.env.GOLD_SKY_ARBITRUM_V2_ID = ''
// process.env.GOLD_SKY_POLYGON_V2_ID = ''
// process.env.GOLD_SKY_OPTIMISM_V2_ID = ''
// process.env.GOLD_SKY_AVALANCHE_V2_ID = ''
// process.env.GOLD_SKY_BNB_V2_ID = ''
// process.env.GOLD_SKY_BLAST_V2_ID = ''
// process.env.GOLD_SKY_BASE_V2_ID = ''
// process.env.GOLD_SKY_WORLDCHAIN_V2_ID = ''
// process.env.GOLD_SKY_ASTROCHAIN_SEPOLIA_V2_ID = ''
// process.env.GOLD_SKY_MONAD_TESTNET_V2_ID = ''
// process.env.GOLD_SKY_UNICHAIN_V2_ID = ''
// process.env.GOLD_SKY_SONEIUM_V2_ID = ''
// process.env.GOLD_SKY_ETHEREUM_SEPOLIA_V2_ID = ''
// // Goldsky V3 subgraph IDs
// process.env.GOLD_SKY_ETHEREUM_V3_ID = ''
// process.env.GOLD_SKY_ARBITRUM_V3_ID = ''
// process.env.GOLD_SKY_POLYGON_V3_ID = ''
// process.env.GOLD_SKY_OPTIMISM_V3_ID = ''
// process.env.GOLD_SKY_AVALANCHE_V3_ID = ''
// process.env.GOLD_SKY_BNB_V3_ID = ''
// process.env.GOLD_SKY_BLAST_V3_ID = ''
// process.env.GOLD_SKY_BASE_V3_ID = ''
// process.env.GOLD_SKY_CELO_V3_ID = ''
// process.env.GOLD_SKY_WORLDCHAIN_V3_ID = ''
// process.env.GOLD_SKY_ASTROCHAIN_SEPOLIA_V3_ID = ''
// process.env.GOLD_SKY_UNICHAIN_V3_ID = ''
// process.env.GOLD_SKY_ZORA_V3_ID = ''
// process.env.GOLD_SKY_SONEIUM_V3_ID = ''
// // Goldsky V4 subgraph IDs
// process.env.GOLD_SKY_ETHEREUM_SEPOLIA_V4_ID = ''
// process.env.GOLD_SKY_ARBITRUM_V4_ID = ''
// process.env.GOLD_SKY_BASE_V4_ID = ''
// process.env.GOLD_SKY_POLYGON_V4_ID = ''
// process.env.GOLD_SKY_WORLDCHAIN_V4_ID = ''
// process.env.GOLD_SKY_ZORA_V4_ID = ''
// process.env.GOLD_SKY_UNICHAIN_V4_ID = ''
// process.env.GOLD_SKY_BNB_V4_ID = ''
// process.env.GOLD_SKY_BLAST_V4_ID = ''
// process.env.GOLD_SKY_ETHEREUM_V4_ID = ''
// process.env.GOLD_SKY_SONEIUM_V4_ID = ''
// process.env.GOLD_SKY_OPTIMISM_V4_ID = ''
// process.env.GOLD_SKY_CELO_V4_ID = ''
// process.env.GOLD_SKY_AVALANCHE_V4_ID = ''
// process.env.GRAPH_XLAYER_V4_ID = ''
// process.env.GRAPH_XLAYER_V3_ID = ''
// process.env.GRAPH_XLAYER_V2_ID = ''

// Zora hooks addresses for V4 filtering - MUST be lowercase
export const ZORA_HOOKS_FOR_V4_SUBGRAPH_FILTERING = new Set([
  ZORA_CREATOR_HOOK_ON_BASE_v1,
  ZORA_CREATOR_HOOK_ON_BASE_v1_0_0_1,
  ZORA_CREATOR_HOOK_ON_BASE_v1_1_1,
  ZORA_CREATOR_HOOK_ON_BASE_v1_1_1_1,
  ZORA_CREATOR_HOOK_ON_BASE_v1_1_2,
  ZORA_CREATOR_HOOK_ON_BASE_v2_2,
  ZORA_CREATOR_HOOK_ON_BASE_v2_2_1,
  ZORA_POST_HOOK_ON_BASE_v1,
  ZORA_POST_HOOK_ON_BASE_v1_0_0_1,
  ZORA_POST_HOOK_ON_BASE_v1_0_0_2,
  ZORA_POST_HOOK_ON_BASE_v1_1_1,
  ZORA_POST_HOOK_ON_BASE_v1_1_1_1,
  ZORA_POST_HOOK_ON_BASE_v1_1_2,
  ZORA_POST_HOOK_ON_BASE_v2_2,
  ZORA_POST_HOOK_ON_BASE_v2_2_1,
  ZORA_POST_HOOK_ON_BASE_v2_3_0,
])

// Clanker hooks addresses for V4 filtering - MUST be lowercase
export const CLANKER_HOOKS_FOR_V4_SUBGRAPH_FILTERING = new Set([
  CLANKER_DYNAMIC_FEE_HOOKS_ADDRESS_ON_BASE,
  CLANKER_STATIC_FEE_HOOKS_ADDRESS_ON_BASE,
  CLANKER_DYNAMIC_FEE_HOOKS_ADDRESS_ON_BASE_v2,
  CLANKER_STATIC_FEE_HOOKS_ADDRESS_ON_BASE_v2,
  CLANKER_DYNAMIC_FEE_HOOKS_ADDRESS_ON_ARBITRUM,
  CLANKER_STATIC_FEE_HOOKS_ADDRESS_ON_ARBITRUM,
  CLANKER_DYNAMIC_FEE_HOOKS_ADDRESS_ON_UNICHAIN,
  CLANKER_STATIC_FEE_HOOKS_ADDRESS_ON_UNICHAIN,
  CLANKER_STATIC_FEE_HOOKS_ADDRESS_ON_MAINNET,
  CLANKER_STATIC_FEE_HOOKS_ADDRESS_ON_MONAD,
])

// Combined hooks set for V4SubgraphProvider low-TVL filtering (uses trackedZoraEthThreshold = 0.001)
export const HOOKS_FOR_V4_SUBGRAPH_LOW_TVL_FILTERING = new Set([
  ...ZORA_HOOKS_FOR_V4_SUBGRAPH_FILTERING,
  ...CLANKER_HOOKS_FOR_V4_SUBGRAPH_FILTERING,
])

// Helper to build a subgraph URL only when the env var is defined.
// Returns undefined when the env var is missing, so the provider can fall back gracefully
// instead of making requests to a malformed URL (e.g. ".../id/undefined").
function goldskyUrl(envVar: string | undefined, base = 'https://api.aws-us-east-1.goldsky.com/c/uniswap2/gn/subgraphs/id'): string | undefined {
  return envVar ? `${base}/${envVar}` : undefined
}

function theGraphUrl(envVar: string | undefined): string | undefined {
  return envVar ? `https://gateway.thegraph.com/api/subgraphs/id/${envVar}` : undefined
}

function goldskyPrivateUrl(apiKey: string | undefined, subgraphPath: string): string | undefined {
  return apiKey ? `https://api.goldsky.com/api/private/${apiKey}/subgraphs/${subgraphPath}` : undefined
}

export const v4SubgraphUrlOverride = (chainId: ChainId) => {
  switch (chainId) {
    case ChainId.SEPOLIA:
      return goldskyUrl(process.env.GOLD_SKY_ETHEREUM_SEPOLIA_V4_ID)
    case ChainId.ARBITRUM_ONE:
      return goldskyUrl(process.env.GOLD_SKY_ARBITRUM_V4_ID)
    case ChainId.BASE:
      return theGraphUrl(process.env.GRAPH_BASE_V4_SUBGRAPH_ID)
    case ChainId.POLYGON:
      return goldskyUrl(process.env.GOLD_SKY_POLYGON_V4_ID)
    case ChainId.WORLDCHAIN:
      return goldskyUrl(process.env.GOLD_SKY_WORLDCHAIN_V4_ID)
    case ChainId.ZORA:
      return goldskyUrl(process.env.GOLD_SKY_ZORA_V4_ID)
    case ChainId.UNICHAIN:
      return goldskyUrl(process.env.GOLD_SKY_UNICHAIN_V4_ID)
    case ChainId.BNB:
      return goldskyUrl(process.env.GOLD_SKY_BNB_V4_ID)
    case ChainId.BLAST:
      return goldskyUrl(process.env.GOLD_SKY_BLAST_V4_ID)
    case ChainId.MAINNET:
      return goldskyUrl(process.env.GOLD_SKY_ETHEREUM_V4_ID)
    case ChainId.SONEIUM:
      return goldskyUrl(process.env.GOLD_SKY_SONEIUM_V4_ID)
    case ChainId.OPTIMISM:
      return goldskyUrl(process.env.GOLD_SKY_OPTIMISM_V4_ID)
    case ChainId.MONAD:
      return goldskyPrivateUrl(process.env.GOLD_SKY_API_KEY, 'uniswap-v4-monad/prod/gn')
    case ChainId.XLAYER:
      return theGraphUrl(process.env.GRAPH_XLAYER_V4_ID)
    case ChainId.AVALANCHE:
      return goldskyUrl(process.env.GOLD_SKY_AVALANCHE_V4_ID)
    default:
      return undefined
  }
}

export const v3SubgraphUrlOverride = (chainId: ChainId) => {
  switch (chainId) {
    // case ChainId.MAINNET:
    //   return goldskyUrl(process.env.GOLD_SKY_ETHEREUM_V3_ID)
    case ChainId.ARBITRUM_ONE:
      return goldskyUrl(process.env.GOLD_SKY_ARBITRUM_V3_ID)
    case ChainId.POLYGON:
      return goldskyUrl(process.env.GOLD_SKY_POLYGON_V3_ID)
    case ChainId.OPTIMISM:
      return goldskyUrl(process.env.GOLD_SKY_OPTIMISM_V3_ID)
    case ChainId.AVALANCHE:
      return goldskyUrl(process.env.GOLD_SKY_AVALANCHE_V3_ID)
    case ChainId.BNB:
      return goldskyUrl(process.env.GOLD_SKY_BNB_V3_ID)
    case ChainId.BLAST:
      return goldskyUrl(process.env.GOLD_SKY_BLAST_V3_ID)
    case ChainId.BASE:
      return goldskyUrl(process.env.GOLD_SKY_BASE_V3_ID)
    case ChainId.CELO:
      return goldskyUrl(process.env.GOLD_SKY_CELO_V3_ID)
    case ChainId.WORLDCHAIN:
      return goldskyUrl(process.env.GOLD_SKY_WORLDCHAIN_V3_ID)
    case ChainId.UNICHAIN_SEPOLIA:
      return goldskyUrl(process.env.GOLD_SKY_ASTROCHAIN_SEPOLIA_V3_ID)
    case ChainId.UNICHAIN:
      return goldskyUrl(process.env.GOLD_SKY_UNICHAIN_V3_ID)
    case ChainId.ZORA:
      return goldskyUrl(process.env.GOLD_SKY_ZORA_V3_ID)
    case ChainId.SONEIUM:
      return goldskyUrl(process.env.GOLD_SKY_SONEIUM_V3_ID)
    case ChainId.MONAD:
      return goldskyPrivateUrl(process.env.GOLD_SKY_API_KEY, 'uniswap-v3-monad/prod/gn')
    case ChainId.XLAYER:
      return theGraphUrl(process.env.GRAPH_XLAYER_V3_ID)
    default:
      return undefined
  }
}

const GOLDSKY_V2_BASE = 'https://api.aws-us-east-1.goldsky.com/c/uniswap/gn/subgraphs/id'

export const v2SubgraphUrlOverride = (chainId: ChainId) => {
  switch (chainId) {
    // case ChainId.MAINNET:
    //   return goldskyUrl(process.env.GOLD_SKY_ETHEREUM_V2_ID, GOLDSKY_V2_BASE)
    case ChainId.ARBITRUM_ONE:
      return goldskyUrl(process.env.GOLD_SKY_ARBITRUM_V2_ID, GOLDSKY_V2_BASE)
    case ChainId.POLYGON:
      return goldskyUrl(process.env.GOLD_SKY_POLYGON_V2_ID, GOLDSKY_V2_BASE)
    case ChainId.OPTIMISM:
      return goldskyUrl(process.env.GOLD_SKY_OPTIMISM_V2_ID, GOLDSKY_V2_BASE)
    case ChainId.AVALANCHE:
      return goldskyUrl(process.env.GOLD_SKY_AVALANCHE_V2_ID, GOLDSKY_V2_BASE)
    case ChainId.BNB:
      return goldskyUrl(process.env.GOLD_SKY_BNB_V2_ID, GOLDSKY_V2_BASE)
    case ChainId.BLAST:
      return goldskyUrl(process.env.GOLD_SKY_BLAST_V2_ID, GOLDSKY_V2_BASE)
    case ChainId.BASE:
      return goldskyUrl(process.env.GOLD_SKY_BASE_V2_ID, GOLDSKY_V2_BASE)
    case ChainId.WORLDCHAIN:
      return goldskyUrl(process.env.GOLD_SKY_WORLDCHAIN_V2_ID, GOLDSKY_V2_BASE)
    case ChainId.UNICHAIN_SEPOLIA:
      return goldskyUrl(process.env.GOLD_SKY_ASTROCHAIN_SEPOLIA_V2_ID, GOLDSKY_V2_BASE)
    case ChainId.MONAD_TESTNET:
      return goldskyUrl(process.env.GOLD_SKY_MONAD_TESTNET_V2_ID, GOLDSKY_V2_BASE)
    case ChainId.UNICHAIN:
      return goldskyUrl(process.env.GOLD_SKY_UNICHAIN_V2_ID, GOLDSKY_V2_BASE)
    case ChainId.SONEIUM:
      return goldskyUrl(process.env.GOLD_SKY_SONEIUM_V2_ID, GOLDSKY_V2_BASE)
    case ChainId.MONAD:
      return goldskyPrivateUrl(process.env.GOLD_SKY_API_KEY, 'uniswap-v2-monad/prod/gn')
    case ChainId.XLAYER:
      return theGraphUrl(process.env.GRAPH_XLAYER_V2_ID)
    default:
      return undefined
  }
}

const v4TrackedEthThreshold = 0.01 // Pools need at least 0.01 of trackedEth to be selected
const v4BaseTrackedEthThreshold = 0.1 // Pools on Base need at least 0.1 of trackedEth to be selected
const v4BaseZoraTrackedEthThreshold = 0.001 // Pools on Zora/Clanker need at least 0.001 of trackedEth to be selected
const v4UntrackedUsdThreshold = 0 // v4 subgraph totalValueLockedUSDUntracked returns 0, even with the pools that have appropriate liqudities and correct pool pricing

export const v3TrackedEthThreshold = 0.01 // Pools need at least 0.01 of trackedEth to be selected
export const v3BaseTrackedEthThreshold = 0.1 // Pools on Base need at least 0.1 of trackedEth to be selected
const v3UntrackedUsdThreshold = 25000 // Pools need at least 25K USD (untracked) to be selected (for metrics only)

export const v2TrackedEthThreshold = 0.025 // Pairs need at least 0.025 of trackedEth to be selected
export const v2BaseTrackedEthThreshold = 0.1 // Pairs on Base need at least 0.1 of trackedEth to be selected
const v2UntrackedUsdThreshold = Number.MAX_VALUE // Pairs need untracked TVL higher than this value to be selected (for metrics only). Currently excludes all V2 pools with untracked TVL.

export interface ChainProtocol {
  protocol: Protocol
  chainId: ChainId
  timeout: number
  provider: V2SubgraphProvider | V3SubgraphProvider | V4SubgraphProvider
  eulerHooksProvider?: EulerSwapHooksSubgraphProvider
}

// Builder functions that only create entries when the subgraph URL is available.
// When env vars are missing (e.g. during CDK synthesis), entries are skipped
// instead of creating providers with undefined URLs that throw at module load time.

function makeV3Entry(
  chainId: ChainId,
  timeout: number,
  retries: number,
  trackedEthThreshold: number,
  untrackedUsdThreshold: number,
  bearerToken?: string
): ChainProtocol | null {
  const url = v3SubgraphUrlOverride(chainId)
  if (!url) return null
  return {
    protocol: Protocol.V3,
    chainId,
    timeout,
    provider: new V3SubgraphProvider(chainId, retries, timeout, true, trackedEthThreshold, untrackedUsdThreshold, url, bearerToken),
  }
}

function makeV2Entry(
  chainId: ChainId,
  timeout: number,
  retries: number,
  pageSize: number,
  trackedEthThreshold: number,
  untrackedUsdThreshold: number,
  bearerToken?: string,
  providerTimeout?: number,
): ChainProtocol | null {
  const url = v2SubgraphUrlOverride(chainId)
  if (!url) return null
  return {
    protocol: Protocol.V2,
    chainId,
    timeout,
    provider: new V2SubgraphProvider(chainId, retries, providerTimeout ?? timeout, true, pageSize, trackedEthThreshold, untrackedUsdThreshold, url, bearerToken),
  }
}

function makeV4Entry(
  chainId: ChainId,
  timeout: number,
  retries: number,
  trackedEthThreshold: number,
  zoraTrackedEthThreshold: number,
  hooksForLowTvlFiltering: Set<string>,
  untrackedUsdThreshold: number,
  bearerToken?: string,
  includeEulerHooks = false,
): ChainProtocol | null {
  const url = v4SubgraphUrlOverride(chainId)
  if (!url) return null
  const entry: ChainProtocol = {
    protocol: Protocol.V4,
    chainId,
    timeout,
    provider: new V4SubgraphProvider(
      chainId, retries, timeout, true,
      trackedEthThreshold, zoraTrackedEthThreshold, hooksForLowTvlFiltering,
      untrackedUsdThreshold, url, bearerToken
    ),
  }
  if (includeEulerHooks) {
    entry.eulerHooksProvider = new EulerSwapHooksSubgraphProvider(chainId, retries, timeout, true, url)
  }
  return entry
}

export const chainProtocols: ChainProtocol[] = [
  // V3.
  makeV3Entry(ChainId.MONAD, 90000, 3, v3TrackedEthThreshold, v3UntrackedUsdThreshold),
  makeV3Entry(ChainId.XLAYER, 90000, 3, v3TrackedEthThreshold, v3UntrackedUsdThreshold, process.env.GRAPH_BEARER_TOKEN),
  // V2.
  makeV2Entry(ChainId.ARBITRUM_ONE, 90000, 3, 1000, v2TrackedEthThreshold, v2UntrackedUsdThreshold),
  makeV2Entry(ChainId.POLYGON, 90000, 3, 1000, v2TrackedEthThreshold, v2UntrackedUsdThreshold),
  makeV2Entry(ChainId.OPTIMISM, 90000, 3, 1000, v2TrackedEthThreshold, v2UntrackedUsdThreshold),
  makeV2Entry(ChainId.BNB, 90000, 3, 1000, v2TrackedEthThreshold, v2UntrackedUsdThreshold),
  makeV2Entry(ChainId.AVALANCHE, 90000, 3, 1000, v2TrackedEthThreshold, v2UntrackedUsdThreshold),
  makeV2Entry(ChainId.BASE, 840000, 5, 10000, v2BaseTrackedEthThreshold, v2UntrackedUsdThreshold, undefined, 900000),
  makeV2Entry(ChainId.BLAST, 90000, 3, 1000, v2TrackedEthThreshold, v2UntrackedUsdThreshold),
  makeV2Entry(ChainId.WORLDCHAIN, 90000, 3, 1000, v2TrackedEthThreshold, v2UntrackedUsdThreshold),
  makeV2Entry(ChainId.MONAD_TESTNET, 90000, 3, 1000, v2TrackedEthThreshold, v2UntrackedUsdThreshold),
  makeV2Entry(ChainId.UNICHAIN, 90000, 3, 1000, v2TrackedEthThreshold, v2UntrackedUsdThreshold),
  makeV2Entry(ChainId.SONEIUM, 90000, 3, 1000, v2TrackedEthThreshold, v2UntrackedUsdThreshold),
  makeV2Entry(ChainId.MONAD, 90000, 3, 1000, v2TrackedEthThreshold, v2UntrackedUsdThreshold, process.env.GOLD_SKY_BEARER_TOKEN),
  makeV2Entry(ChainId.XLAYER, 90000, 3, 1000, v2TrackedEthThreshold, v2UntrackedUsdThreshold, process.env.GRAPH_BEARER_TOKEN),
  // V4.
  makeV4Entry(ChainId.SEPOLIA, 90000, 3, v4TrackedEthThreshold, v4BaseZoraTrackedEthThreshold, HOOKS_FOR_V4_SUBGRAPH_LOW_TVL_FILTERING, v4UntrackedUsdThreshold),
  makeV4Entry(ChainId.ARBITRUM_ONE, 90000, 3, v4TrackedEthThreshold, v4BaseZoraTrackedEthThreshold, HOOKS_FOR_V4_SUBGRAPH_LOW_TVL_FILTERING, v4UntrackedUsdThreshold),
  makeV4Entry(ChainId.BASE, 90000, 3, v4BaseTrackedEthThreshold, v4BaseZoraTrackedEthThreshold, HOOKS_FOR_V4_SUBGRAPH_LOW_TVL_FILTERING, v4UntrackedUsdThreshold, process.env.GRAPH_BEARER_TOKEN),
  makeV4Entry(ChainId.POLYGON, 90000, 3, v4TrackedEthThreshold, v4BaseZoraTrackedEthThreshold, HOOKS_FOR_V4_SUBGRAPH_LOW_TVL_FILTERING, v4UntrackedUsdThreshold),
  makeV4Entry(ChainId.WORLDCHAIN, 90000, 3, v4TrackedEthThreshold, v4BaseZoraTrackedEthThreshold, HOOKS_FOR_V4_SUBGRAPH_LOW_TVL_FILTERING, v4UntrackedUsdThreshold),
  makeV4Entry(ChainId.ZORA, 90000, 3, v4TrackedEthThreshold, v4BaseZoraTrackedEthThreshold, HOOKS_FOR_V4_SUBGRAPH_LOW_TVL_FILTERING, v4UntrackedUsdThreshold),
  makeV4Entry(ChainId.UNICHAIN, 90000, 3, v4TrackedEthThreshold, v4BaseZoraTrackedEthThreshold, HOOKS_FOR_V4_SUBGRAPH_LOW_TVL_FILTERING, v4UntrackedUsdThreshold, undefined, true),
  makeV4Entry(ChainId.BLAST, 90000, 3, v4TrackedEthThreshold, v4BaseZoraTrackedEthThreshold, HOOKS_FOR_V4_SUBGRAPH_LOW_TVL_FILTERING, v4UntrackedUsdThreshold),
  makeV4Entry(ChainId.MAINNET, 90000, 3, v4TrackedEthThreshold, v4BaseZoraTrackedEthThreshold, HOOKS_FOR_V4_SUBGRAPH_LOW_TVL_FILTERING, v4UntrackedUsdThreshold, undefined, true),
  makeV4Entry(ChainId.SONEIUM, 90000, 3, v4TrackedEthThreshold, v4BaseZoraTrackedEthThreshold, HOOKS_FOR_V4_SUBGRAPH_LOW_TVL_FILTERING, v4UntrackedUsdThreshold),
  makeV4Entry(ChainId.OPTIMISM, 90000, 3, v4TrackedEthThreshold, v4BaseZoraTrackedEthThreshold, HOOKS_FOR_V4_SUBGRAPH_LOW_TVL_FILTERING, v4UntrackedUsdThreshold),
  makeV4Entry(ChainId.BNB, 90000, 3, v4TrackedEthThreshold, v4BaseZoraTrackedEthThreshold, HOOKS_FOR_V4_SUBGRAPH_LOW_TVL_FILTERING, v4UntrackedUsdThreshold),
  makeV4Entry(ChainId.MONAD, 90000, 3, v4TrackedEthThreshold, v4BaseZoraTrackedEthThreshold, HOOKS_FOR_V4_SUBGRAPH_LOW_TVL_FILTERING, v4UntrackedUsdThreshold, undefined, true),
  makeV4Entry(ChainId.XLAYER, 90000, 3, v4TrackedEthThreshold, v4BaseZoraTrackedEthThreshold, HOOKS_FOR_V4_SUBGRAPH_LOW_TVL_FILTERING, v4UntrackedUsdThreshold, process.env.GRAPH_BEARER_TOKEN),
  makeV4Entry(ChainId.AVALANCHE, 90000, 3, v4TrackedEthThreshold, v4BaseZoraTrackedEthThreshold, HOOKS_FOR_V4_SUBGRAPH_LOW_TVL_FILTERING, v4UntrackedUsdThreshold),
].filter((entry): entry is ChainProtocol => entry !== null)
