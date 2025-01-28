import { createConfig, http } from 'wagmi'
import { mainnet, bsc } from 'wagmi/chains'
import { injected, coinbaseWallet, walletConnect } from 'wagmi/connectors'

export const config = createConfig({
  chains: [mainnet, bsc],
  connectors: [
    injected(),
    coinbaseWallet({ appName: 'Floki Wallet Connection' }),
    walletConnect({
      projectId: '40de0bc868d652b22360da910fa8d3d4',
      showQrModal: true,
      qrModalOptions: {
        themeMode: 'dark'
      }
    })
  ],
  transports: {
    [mainnet.id]: http(),
    [bsc.id]: http()
  }
})
