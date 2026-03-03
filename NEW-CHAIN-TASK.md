# New Chain Integration: Routing API

## Overview

Add a new EVM chain to the Uniswap Routing API. This repo consumes the Smart Order Router — ensure `smart-order-router/` and `sdks/` changes are done first.

## Prerequisites

Gather these values before starting:

```
CHAIN_ID=<numeric>            # e.g. 545
CHAIN_NAME=<name>             # e.g. FLOW_TESTNET (UPPER_SNAKE)
CHAIN_SLUG=<slug>             # e.g. flow-testnet (kebab-case)
RPC_GATEWAY_ENV=<name>        # e.g. WEB3_RPC_GATEWAY_545

# Protocol support flags:
HAS_V2=<true|false>
HAS_V3=<true|false>
HAS_V4=<true|false>
HAS_MIXED=<true|false>
IS_TESTNET=<true|false>
HAS_V4_ONLY=<true|false>     # true if no V3, only V2+V4

# Subgraph URLs (if available):
V2_SUBGRAPH_URL=<url|empty>
V3_SUBGRAPH_URL=<url|empty>
V4_SUBGRAPH_URL=<url|empty>

# Cache config:
BLOCKS_TO_LIVE=<number>       # e.g. 60 (route cache TTL in blocks)
CACHE_ROLLOUT_PERCENT=<0-100> # e.g. 100 for testnet
```

## Steps

### 1. Add to supported chains

**File:** `lib/handlers/injector-sor.ts`

```ts
// Add to SUPPORTED_CHAINS array (~line 98-122):
ChainId.CHAIN_NAME,
```

### 2. Configure RPC provider

**File:** `lib/config/rpcProviderProdConfig.json`

Add JSON entry:

```json
{
  "chainId": CHAIN_ID,
  "useMultiProviderProb": 1,
  "latencyEvaluationSampleProb": 0,
  "healthCheckSampleProb": 0,
  "providerInitialWeights": [1],
  "providerUrls": ["RPC_GATEWAY_ENV"],
  "providerNames": ["WEB3_RPC_GATEWAY"]
}
```

**File:** `lib/rpc/utils.ts`

```ts
// Add to chainIdToNetworkName():
case ChainId.CHAIN_NAME:
  return 'CHAIN_SLUG'

// Add to generateProviderUrl() switch for the RPC env var:
case 'RPC_GATEWAY_ENV': {
  return tokens[0]
}
```

### 3. Configure protocol support

**File:** `lib/handlers/injector-sor.ts`

Inside `buildContainerInjected()` method, add to protocol arrays:

```ts
// v2Supported array (if HAS_V2):
ChainId.CHAIN_NAME,

// v4Supported array (if HAS_V4):
ChainId.CHAIN_NAME,

// mixedSupported array (if HAS_MIXED):
ChainId.CHAIN_NAME,

// deleteCacheEnabledChains array:
ChainId.CHAIN_NAME,
```

If the chain needs `StaticV4SubgraphProvider` (no V4 subgraph), add a conditional in the V4 subgraph provider section:

```ts
if (chainId === ChainId.CHAIN_NAME) {
  return new StaticV4SubgraphProvider(chainId, v4PoolProvider, v4PoolParams) as IV4SubgraphProvider
}
```

### 4. Configure on-chain quote provider (optional)

**File:** `lib/util/onChainQuoteProviderConfigs.ts`

Defaults work for most chains. Add explicit entries only if needed:

```ts
// RETRY_OPTIONS — if custom retry logic needed
// OPTIMISTIC_CACHED_ROUTES_BATCH_PARAMS — multicall chunk size, gas limits
// NON_OPTIMISTIC_CACHED_ROUTES_BATCH_PARAMS — same for non-cached
// BLOCK_NUMBER_CONFIGS — block confirmation settings
// GAS_ERROR_FAILURE_OVERRIDES — gas error thresholds
// SUCCESS_RATE_FAILURE_OVERRIDES — quote success rate thresholds
```

### 5. Configure cached routes rollout

**File:** `lib/util/newCachedRoutesRolloutPercent.ts`

```ts
[ChainId.CHAIN_NAME]: CACHE_ROLLOUT_PERCENT,
```

### 6. Configure route cache TTL

**File:** `lib/util/defaultBlocksToLiveRoutesDB.ts`

```ts
[ChainId.CHAIN_NAME]: BLOCKS_TO_LIVE,
```

### 7. Configure V4 fee tiers

**File:** `lib/util/extraV4FeeTiersTickSpacingsHookAddresses.ts`

```ts
[ChainId.CHAIN_NAME]: emptyV4FeeTickSpacingsHookAddresses,
```

### 8. Add to testnet list (if IS_TESTNET)

**File:** `lib/util/testNets.ts`

```ts
ChainId.CHAIN_NAME,
```

### 9. Configure protocol version support

**File:** `lib/util/supportedProtocolVersions.ts`

If the chain is V4-only (no V3 subgraph, uses V2+V4 via UniversalRouter V2.0):

```ts
// Add to V4_ONLY_CHAINS:
ChainId.CHAIN_NAME,
```

### 10. Configure Tenderly rollout

**File:** `lib/util/tenderlyNewEndpointRolloutPercent.ts`

```ts
[ChainId.CHAIN_NAME]: 0,  // start at 0, increase after testing
```

### 11. Configure subgraph providers

**File:** `lib/cron/cache-config.ts`

Add subgraph URL overrides (only for available subgraphs):

```ts
// v2SubgraphUrlOverride — add case (if V2 subgraph exists):
case ChainId.CHAIN_NAME:
  return 'V2_SUBGRAPH_URL'

// v3SubgraphUrlOverride — add case (if V3 subgraph exists):
case ChainId.CHAIN_NAME:
  return 'V3_SUBGRAPH_URL'

// v4SubgraphUrlOverride — add case (if V4 subgraph exists):
case ChainId.CHAIN_NAME:
  return 'V4_SUBGRAPH_URL'
```

Add entries to `chainProtocols` array (only for available subgraphs):

```ts
// V2 (if subgraph exists):
makeV2Entry(ChainId.CHAIN_NAME, 90000, 3, 1000, v2TrackedEthThreshold, v2UntrackedUsdThreshold),

// V3 (if subgraph exists):
makeV3Entry(ChainId.CHAIN_NAME, 90000, 3, v3TrackedEthThreshold, v3UntrackedUsdThreshold),

// V4 (if subgraph exists):
makeV4Entry(ChainId.CHAIN_NAME, 90000, 3, v4TrackedEthThreshold, v4BaseZoraTrackedEthThreshold, HOOKS_FOR_V4_SUBGRAPH_LOW_TVL_FILTERING, v4UntrackedUsdThreshold),
```

### 12. Configure gas limits (optional)

**File:** `lib/util/gasLimit.ts`

Only if chain needs a custom gas limit:

```ts
[ChainId.CHAIN_NAME]: <custom_gas_limit>,
```

### 13. Build and verify

```bash
cd routing-api
npm run build
```

## Files Changed (summary)

| File | Change |
|------|--------|
| `lib/handlers/injector-sor.ts` | SUPPORTED_CHAINS + protocol arrays + V4 provider |
| `lib/config/rpcProviderProdConfig.json` | RPC provider config |
| `lib/rpc/utils.ts` | Network name mapping + provider URL |
| `lib/util/newCachedRoutesRolloutPercent.ts` | Cache rollout % |
| `lib/util/defaultBlocksToLiveRoutesDB.ts` | Route cache TTL |
| `lib/util/extraV4FeeTiersTickSpacingsHookAddresses.ts` | V4 fee config |
| `lib/util/testNets.ts` | Testnet flag (if testnet) |
| `lib/util/supportedProtocolVersions.ts` | V4_ONLY_CHAINS (if applicable) |
| `lib/util/tenderlyNewEndpointRolloutPercent.ts` | Tenderly config |
| `lib/cron/cache-config.ts` | Subgraph URLs + chainProtocols entries |
| `lib/util/onChainQuoteProviderConfigs.ts` | Quote provider (if custom) |
| `lib/util/gasLimit.ts` | Gas limit (if custom) |

## Environment Variables

At deployment, ensure these are set:

```
RPC_GATEWAY_ENV=<rpc_url>     # e.g. WEB3_RPC_GATEWAY_545=https://testnet.evm.nodes.onflow.org
```

## Validation

- `npm run build` passes
- Chain is in SUPPORTED_CHAINS and all protocol arrays
- RPC config resolves correctly
- Subgraph URLs return data (test with curl)
- Quote request works: `GET /quote?tokenInAddress=NATIVE&tokenOutAddress=USDC&amount=1000000&type=exactIn&chainId=CHAIN_ID`

## Note on SDK Patches

If this repo cannot update its `@uniswap/smart-order-router` or `@uniswap/sdk-core` dependencies directly, apply patches using `patch-package`. Check `patches/` directory for examples.
