export interface WalletConnectionProps {
  onError: (error: string) => void
}

export interface WalletOption {
  name: string
  icon: string
  connectorId: number
}
