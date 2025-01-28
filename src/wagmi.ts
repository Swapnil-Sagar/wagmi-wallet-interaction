import { createConfig, http } from 'wagmi'
import { mainnet, bsc } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

export const config = createConfig({
  chains: [mainnet, bsc],
  connectors: [injected()],
  transports: {
    [mainnet.id]: http(),
    [bsc.id]: http()
  }
})
