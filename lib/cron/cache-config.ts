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

export const v4SubgraphUrlOverride = (chainId: ChainId) => {
  switch (chainId) {
    case ChainId.SEPOLIA:
      return `https://api.aws-us-east-1.goldsky.com/c/uniswap2/gn/subgraphs/id/${process.env.GOLD_SKY_ETHEREUM_SEPOLIA_V4_ID}`
    case ChainId.ARBITRUM_ONE:
      return `https://api.aws-us-east-1.goldsky.com/c/uniswap2/gn/subgraphs/id/${process.env.GOLD_SKY_ARBITRUM_V4_ID}`
    case ChainId.BASE:
      return `https://gateway.thegraph.com/api/subgraphs/id/${process.env.GRAPH_BASE_V4_SUBGRAPH_ID}`
    case ChainId.POLYGON:
      return `https://api.aws-us-east-1.goldsky.com/c/uniswap2/gn/subgraphs/id/${process.env.GOLD_SKY_POLYGON_V4_ID}`
    case ChainId.WORLDCHAIN:
      return `https://api.aws-us-east-1.goldsky.com/c/uniswap2/gn/subgraphs/id/${process.env.GOLD_SKY_WORLDCHAIN_V4_ID}`
    case ChainId.ZORA:
      return `https://api.aws-us-east-1.goldsky.com/c/uniswap2/gn/subgraphs/id/${process.env.GOLD_SKY_ZORA_V4_ID}`
    case ChainId.UNICHAIN:
      return `https://api.aws-us-east-1.goldsky.com/c/uniswap2/gn/subgraphs/id/${process.env.GOLD_SKY_UNICHAIN_V4_ID}`
    case ChainId.BNB:
      return `https://api.aws-us-east-1.goldsky.com/c/uniswap2/gn/subgraphs/id/${process.env.GOLD_SKY_BNB_V4_ID}`
    case ChainId.BLAST:
      return `https://api.aws-us-east-1.goldsky.com/c/uniswap2/gn/subgraphs/id/${process.env.GOLD_SKY_BLAST_V4_ID}`
    case ChainId.MAINNET:
      return `https://api.aws-us-east-1.goldsky.com/c/uniswap2/gn/subgraphs/id/${process.env.GOLD_SKY_ETHEREUM_V4_ID}`
    case ChainId.SONEIUM:
      return `https://api.aws-us-east-1.goldsky.com/c/uniswap2/gn/subgraphs/id/${process.env.GOLD_SKY_SONEIUM_V4_ID}`
    case ChainId.OPTIMISM:
      return `https://api.aws-us-east-1.goldsky.com/c/uniswap2/gn/subgraphs/id/${process.env.GOLD_SKY_OPTIMISM_V4_ID}`
    case ChainId.MONAD:
      return `https://api.goldsky.com/api/private/${process.env.GOLD_SKY_API_KEY}/subgraphs/uniswap-v4-monad/prod/gn`
    default:
      return undefined
  }
}

export const v3SubgraphUrlOverride = (chainId: ChainId) => {
  switch (chainId) {
    // case ChainId.MAINNET:
    //   return `https://api.aws-us-east-1.goldsky.com/c/uniswap2/gn/subgraphs/id/${process.env.GOLD_SKY_ETHEREUM_V3_ID}`
    case ChainId.ARBITRUM_ONE:
      return `https://api.aws-us-east-1.goldsky.com/c/uniswap2/gn/subgraphs/id/${process.env.GOLD_SKY_ARBITRUM_V3_ID}`
    case ChainId.POLYGON:
      return `https://api.aws-us-east-1.goldsky.com/c/uniswap2/gn/subgraphs/id/${process.env.GOLD_SKY_POLYGON_V3_ID}`
    case ChainId.OPTIMISM:
      return `https://api.aws-us-east-1.goldsky.com/c/uniswap2/gn/subgraphs/id/${process.env.GOLD_SKY_OPTIMISM_V3_ID}`
    case ChainId.AVALANCHE:
      return `https://api.aws-us-east-1.goldsky.com/c/uniswap2/gn/subgraphs/id/${process.env.GOLD_SKY_AVALANCHE_V3_ID}`
    case ChainId.BNB:
      return `https://api.aws-us-east-1.goldsky.com/c/uniswap2/gn/subgraphs/id/${process.env.GOLD_SKY_BNB_V3_ID}`
    case ChainId.BLAST:
      return `https://api.aws-us-east-1.goldsky.com/c/uniswap2/gn/subgraphs/id/${process.env.GOLD_SKY_BLAST_V3_ID}`
    case ChainId.BASE:
      return `https://api.aws-us-east-1.goldsky.com/c/uniswap2/gn/subgraphs/id/${process.env.GOLD_SKY_BASE_V3_ID}`
    case ChainId.CELO:
      return `https://api.aws-us-east-1.goldsky.com/c/uniswap2/gn/subgraphs/id/${process.env.GOLD_SKY_CELO_V3_ID}`
    case ChainId.WORLDCHAIN:
      return `https://api.aws-us-east-1.goldsky.com/c/uniswap2/gn/subgraphs/id/${process.env.GOLD_SKY_WORLDCHAIN_V3_ID}`
    case ChainId.UNICHAIN_SEPOLIA:
      return `https://api.aws-us-east-1.goldsky.com/c/uniswap2/gn/subgraphs/id/${process.env.GOLD_SKY_ASTROCHAIN_SEPOLIA_V3_ID}`
    case ChainId.UNICHAIN:
      return `https://api.aws-us-east-1.goldsky.com/c/uniswap2/gn/subgraphs/id/${process.env.GOLD_SKY_UNICHAIN_V3_ID}`
    case ChainId.ZORA:
      return `https://api.aws-us-east-1.goldsky.com/c/uniswap2/gn/subgraphs/id/${process.env.GOLD_SKY_ZORA_V3_ID}`
    case ChainId.SONEIUM:
      return `https://api.aws-us-east-1.goldsky.com/c/uniswap2/gn/subgraphs/id/${process.env.GOLD_SKY_SONEIUM_V3_ID}`
    case ChainId.MONAD:
      return `https://api.goldsky.com/api/private/${process.env.GOLD_SKY_API_KEY}/subgraphs/uniswap-v3-monad/prod/gn`
    default:
      return undefined
  }
}

export const v2SubgraphUrlOverride = (chainId: ChainId) => {
  switch (chainId) {
    // case ChainId.MAINNET:
    //   return `https://api.aws-us-east-1.goldsky.com/c/uniswap/gn/subgraphs/id/${process.env.GOLD_SKY_ETHEREUM_V2_ID}`
    case ChainId.ARBITRUM_ONE:
      return `https://api.aws-us-east-1.goldsky.com/c/uniswap/gn/subgraphs/id/${process.env.GOLD_SKY_ARBITRUM_V2_ID}`
    case ChainId.POLYGON:
      return `https://api.aws-us-east-1.goldsky.com/c/uniswap/gn/subgraphs/id/${process.env.GOLD_SKY_POLYGON_V2_ID}`
    case ChainId.OPTIMISM:
      return `https://api.aws-us-east-1.goldsky.com/c/uniswap/gn/subgraphs/id/${process.env.GOLD_SKY_OPTIMISM_V2_ID}`
    case ChainId.AVALANCHE:
      return `https://api.aws-us-east-1.goldsky.com/c/uniswap/gn/subgraphs/id/${process.env.GOLD_SKY_AVALANCHE_V2_ID}`
    case ChainId.BNB:
      return `https://api.aws-us-east-1.goldsky.com/c/uniswap/gn/subgraphs/id/${process.env.GOLD_SKY_BNB_V2_ID}`
    case ChainId.BLAST:
      return `https://api.aws-us-east-1.goldsky.com/c/uniswap/gn/subgraphs/id/${process.env.GOLD_SKY_BLAST_V2_ID}`
    case ChainId.BASE:
      return `https://api.aws-us-east-1.goldsky.com/c/uniswap/gn/subgraphs/id/${process.env.GOLD_SKY_BASE_V2_ID}`
    case ChainId.WORLDCHAIN:
      return `https://api.aws-us-east-1.goldsky.com/c/uniswap/gn/subgraphs/id/${process.env.GOLD_SKY_WORLDCHAIN_V2_ID}`
    case ChainId.UNICHAIN_SEPOLIA:
      return `https://api.aws-us-east-1.goldsky.com/c/uniswap/gn/subgraphs/id/${process.env.GOLD_SKY_ASTROCHAIN_SEPOLIA_V2_ID}`
    case ChainId.MONAD_TESTNET:
      return `https://api.aws-us-east-1.goldsky.com/c/uniswap/gn/subgraphs/id/${process.env.GOLD_SKY_MONAD_TESTNET_V2_ID}`
    case ChainId.UNICHAIN:
      return `https://api.aws-us-east-1.goldsky.com/c/uniswap/gn/subgraphs/id/${process.env.GOLD_SKY_UNICHAIN_V2_ID}`
    case ChainId.SONEIUM:
      return `https://api.aws-us-east-1.goldsky.com/c/uniswap/gn/subgraphs/id/${process.env.GOLD_SKY_SONEIUM_V2_ID}`
    case ChainId.MONAD:
      return `https://api.goldsky.com/api/private/${process.env.GOLD_SKY_API_KEY}/subgraphs/uniswap-v2-monad/prod/gn`
    default:
      return undefined
  }
}

const v4TrackedEthThreshold = 0.01 // Pools need at least 0.01 of trackedEth to be selected
// const v4BaseTrackedEthThreshold = 0.1 // Pools on Base need at least 0.1 of trackedEth to be selected
const v4BaseZoraTrackedEthThreshold = 0.001 // Pools on Zora need at least 0.1 of trackedEth to be selected
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

export const chainProtocols = [
  // V3.
  {
    protocol: Protocol.V3,
    chainId: ChainId.MAINNET,
    timeout: 90000,
    provider: new V3SubgraphProvider(
      ChainId.MAINNET,
      3,
      90000,
      true,
      v3TrackedEthThreshold,
      v3UntrackedUsdThreshold,
      v3SubgraphUrlOverride(ChainId.MAINNET)
    ),
  },
  {
    protocol: Protocol.V2,
    chainId: ChainId.MAINNET,
    timeout: 840000,
    provider: new V2SubgraphProvider(
      ChainId.MAINNET,
      5,
      900000,
      true,
      1000,
      v2TrackedEthThreshold,
      v2UntrackedUsdThreshold,
      v2SubgraphUrlOverride(ChainId.MAINNET)
    ), // 1000 is the largest page size supported by thegraph
  },
    {
    protocol: Protocol.V4,
    chainId: ChainId.MAINNET,
    timeout: 90000,
    provider: new V4SubgraphProvider(
      ChainId.MAINNET,
      3,
      90000,
      true,
      v4TrackedEthThreshold,
      v4BaseZoraTrackedEthThreshold,
      ZORA_HOOKS_FOR_V4_SUBGRAPH_FILTERING,
      v4UntrackedUsdThreshold,
      v4SubgraphUrlOverride(ChainId.MAINNET)
    ),
    eulerHooksProvider: new EulerSwapHooksSubgraphProvider(
      ChainId.MAINNET,
      3,
      90000,
      true,
      v4SubgraphUrlOverride(ChainId.MAINNET)
    ),
  },
]
