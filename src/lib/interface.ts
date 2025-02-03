export interface WalletConnectionProps {
  onError: (error: string) => void
  setAlertType: (type: 'destructive' | 'default') => void
}

export interface WalletOption {
  name: string
  icon: string
  connectorId: number
}
