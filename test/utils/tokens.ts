import DEFAULT_TOKEN_LIST from '@uniswap/default-token-list'
import { ChainId, Token } from '@uniswap/sdk-core'
import {
  CachingTokenListProvider,
  DAI_ARBITRUM,
  DAI_AVAX,
  DAI_BNB,
  DAI_GOERLI,
  DAI_MAINNET,
  DAI_OPTIMISM,
  DAI_OPTIMISM_GOERLI,
  DAI_POLYGON,
  DAI_POLYGON_MUMBAI,
  DAI_SEPOLIA,
  log,
  NodeJSCache,
  USDC_ABSTRACT_MAINNET,
  USDC_ABSTRACT_TESTNET,
  USDC_ANIME,
  USDC_ANIME_TESTNET,
  USDC_ARBITRUM,
  USDC_AVAX,
  USDC_BASE,
  USDC_BASE_GOERLI,
  USDC_BNB,
  USDC_BOB,
  USDC_CYBER,
  USDC_FLOW_TESTNET,
  USDF_FLOW_MAINNET,
  USDC_GOERLI,
  USDC_INK,
  USDC_MAINNET,
  USDC_MODE,
  USDC_OPTIMISM,
  USDC_OPTIMISM_GOERLI,
  USDC_POLYGON,
  USDC_POLYGON_MUMBAI,
  USDC_REDSTONE,
  USDC_REDSTONE_GARNET,
  USDC_SEPOLIA,
  USDC_SHAPE,
  USDC_ZERO,
  USDC_ZORA,
  USDCE_ZKSYNC,
  USDT_ARBITRUM,
  USDT_BNB,
  USDT_GOERLI,
  USDT_MAINNET,
  USDT_OPTIMISM,
  WRAPPED_NATIVE_CURRENCY,
} from '@uniswap/smart-order-router'
import { ethers } from 'ethers'
import NodeCache from 'node-cache'

export const getTokenListProvider = (id: ChainId) => {
  return new CachingTokenListProvider(id, DEFAULT_TOKEN_LIST, new NodeJSCache(new NodeCache()))
}

export const getAmount = async (id: ChainId, type: string, symbolIn: string, symbolOut: string, amount: string) => {
  const tokenListProvider = getTokenListProvider(id)
  const decimals = (await tokenListProvider.getTokenBySymbol(type == 'exactIn' ? symbolIn : symbolOut))!.decimals
  log.info(decimals)
  return ethers.utils.parseUnits(amount, decimals).toString()
}

export const getAmountFromToken = async (type: string, tokenIn: Token, tokenOut: Token, amount: string) => {
  const decimals = (type == 'exactIn' ? tokenIn : tokenOut).decimals
  return ethers.utils.parseUnits(amount, decimals).toString()
}

export const UNI_MAINNET = new Token(
  ChainId.MAINNET,
  '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
  18,
  'UNI',
  'Uniswap'
)

export const UNI_GORLI = new Token(ChainId.GOERLI, '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', 18, 'UNI', 'Uni token')

export const DAI_ON = (chainId: ChainId): Token => {
  switch (chainId) {
    case ChainId.MAINNET:
      return DAI_MAINNET
    case ChainId.GOERLI:
      return DAI_GOERLI
    case ChainId.SEPOLIA:
      return DAI_SEPOLIA
    case ChainId.OPTIMISM:
      return DAI_OPTIMISM
    case ChainId.OPTIMISM_GOERLI:
      return DAI_OPTIMISM_GOERLI
    case ChainId.ARBITRUM_ONE:
      return DAI_ARBITRUM
    case ChainId.POLYGON:
      return DAI_POLYGON
    case ChainId.POLYGON_MUMBAI:
      return DAI_POLYGON_MUMBAI
    case ChainId.BNB:
      return DAI_BNB
    case ChainId.AVALANCHE:
      return DAI_AVAX
    default:
      throw new Error(`Chain id: ${chainId} not supported`)
  }
}

export const USDT_ON = (chainId: ChainId): Token => {
  switch (chainId) {
    case ChainId.MAINNET:
      return USDT_MAINNET
    case ChainId.GOERLI:
      return USDT_GOERLI
    case ChainId.OPTIMISM:
      return USDT_OPTIMISM
    case ChainId.ARBITRUM_ONE:
      return USDT_ARBITRUM
    case ChainId.BNB:
      return USDT_BNB
    default:
      throw new Error(`Chain id: ${chainId} not supported`)
  }
}

export const USDC_ON = (chainId: ChainId): Token => {
  switch (chainId) {
    case ChainId.MAINNET:
      return USDC_MAINNET
    case ChainId.GOERLI:
      return USDC_GOERLI
    case ChainId.SEPOLIA:
      return USDC_SEPOLIA
    case ChainId.OPTIMISM:
      return USDC_OPTIMISM
    case ChainId.OPTIMISM_GOERLI:
      return USDC_OPTIMISM_GOERLI
    case ChainId.ARBITRUM_ONE:
      return USDC_ARBITRUM
    case ChainId.POLYGON:
      return USDC_POLYGON
    case ChainId.POLYGON_MUMBAI:
      return USDC_POLYGON_MUMBAI
    case ChainId.BNB:
      return USDC_BNB
    case ChainId.AVALANCHE:
      return USDC_AVAX
    case ChainId.BASE:
      return USDC_BASE
    case ChainId.BASE_GOERLI:
      return USDC_BASE_GOERLI
    case ChainId.ZORA:
      return USDC_ZORA
    case ChainId.ZKSYNC:
      return USDCE_ZKSYNC
    case ChainId.ABSTRACT_TESTNET:
      return USDC_ABSTRACT_TESTNET
    case ChainId.ZERO:
      return USDC_ZERO
    case ChainId.BOB:
      return USDC_BOB
    case ChainId.CYBER:
      return USDC_CYBER
    case ChainId.SHAPE:
      return USDC_SHAPE
    case ChainId.INK:
      return USDC_INK
    case ChainId.REDSTONE:
      return USDC_REDSTONE
    case ChainId.REDSTONE_GARNET:
      return USDC_REDSTONE_GARNET
    case ChainId.ABSTRACT_MAINNET:
      return USDC_ABSTRACT_MAINNET
    case ChainId.ANIME_TESTNET:
      return USDC_ANIME_TESTNET
    case ChainId.MODE:
      return USDC_MODE
    case ChainId.ANIME:
      return USDC_ANIME
    case ChainId.FLOW_TESTNET:
      return USDC_FLOW_TESTNET
    case ChainId.FLOW_MAINNET:
      return USDF_FLOW_MAINNET
    case ChainId.BASE_SEPOLIA:
      return new Token(
        ChainId.BASE_SEPOLIA,
        '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
        6,
        'USDC',
        'USDC'
      )
    default:
      throw new Error(`Chain id: ${chainId} not supported`)
  }
}

export const WNATIVE_ON = (chainId: ChainId): Token => {
  return WRAPPED_NATIVE_CURRENCY[chainId]
}
