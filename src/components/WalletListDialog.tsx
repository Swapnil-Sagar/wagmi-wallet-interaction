import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { WalletOption } from '@/lib/interface'
import { walletOptions } from '@/lib/utils'

interface WalletListDialogProps {
  showWalletOptions: boolean
  setShowWalletOptions: (open: boolean) => void
  handleConnect: (connectorId: number, walletName: string) => void
  isConnecting: boolean
  connectingWallet: string | null
}

const WalletListDialog: React.FC<WalletListDialogProps> = ({
  showWalletOptions,
  setShowWalletOptions,
  handleConnect,
  isConnecting,
  connectingWallet
}) => {
  return (
    <Dialog open={showWalletOptions} onOpenChange={setShowWalletOptions}>
      <DialogContent
        className='sm:max-w-md  bg-secondary-foreground'
        role='dialog'
        aria-labelledby='wallet-dialog-title'
      >
        <DialogHeader>
          <DialogTitle className='text-gray-50 font-normal'>Connect Wallet</DialogTitle>
        </DialogHeader>
        <div className='grid gap-2 py-4'>
          {walletOptions.map((wallet: WalletOption) => (
            <Button
              key={wallet.name}
              onClick={() => handleConnect(wallet.connectorId, wallet.name)}
              disabled={isConnecting}
              variant='outline'
              className='w-full h-14 flex items-center justify-start px-4 space-x-3 bg-[#1B1B1B] hover:bg-gray-100 text-gray-50'
              aria-label={`Connect to ${wallet.name}`}
            >
              <img src={wallet.icon} alt={wallet.name} className='h-8 w-8' />
              <span className='flex-1 text-left'>{wallet.name}</span>
              {isConnecting && connectingWallet === wallet.name && (
                <Loader2 className='h-4 w-4 animate-spin ml-2' />
              )}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default WalletListDialog
