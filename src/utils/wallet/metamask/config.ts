import { isProd } from '../../env'

export interface NodeConfig {
    chainId: string
    networkVersion: number
    blockExplorerUrls?: string[]
    chainName?: string
    iconUrls?: string[]
    nativeCurrency?: {
        name: string
        symbol: string
        decimals: number
    }
    rpcUrls?: string[]
}

export const nodeConfig = (function (): NodeConfig {
    return isProd
        ? {
              rpcUrls: ['https://bsc-dataseed.binance.org/'],
              chainId: '0x38',
              networkVersion: 56,
              chainName: 'BSC',
              nativeCurrency: {
                  name: 'Binance Chain Native Token',
                  symbol: 'BNB',
                  decimals: 18,
              },
          }
        : {
              rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
              chainId: '0x61',
              networkVersion: 97,
              chainName: 'BSC Testnet',
              nativeCurrency: {
                  name: 'Binance Chain Native Token',
                  symbol: 'BNB',
                  decimals: 18,
              },
          }
})()
