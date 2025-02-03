import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import MetaMaskIcon from '../assets/images/MetaMask.svg'
import CoinbaseIcon from '../assets/images/Coinbase.svg'
import PhantomIcon from '../assets/images/Phanton.svg'
import WalletConnectIcon from '../assets/images/WalletConnect.svg'
import { WalletOption } from './interface'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const WELCOME_MESSAGE =
  'Welcome to our dApp! Please sign this message to verify your ownership.'

export const shortenAddr = (text: string, first = 6, last = 4) => {
  if (text.length <= first + last) {
    return text
  }
  return text.slice(0, first) + '...' + text.slice(text.length - last)
}

export const walletOptions: WalletOption[] = [
  {
    name: 'MetaMask',
    icon: MetaMaskIcon,
    connectorId: 0
  },
  {
    name: 'Coinbase',
    icon: CoinbaseIcon,
    connectorId: 1
  },
  {
    name: 'Phantom',
    icon: PhantomIcon,
    connectorId: 3
  },
  {
    name: 'WalletConnect',
    icon: WalletConnectIcon,
    connectorId: 2
  }
]
