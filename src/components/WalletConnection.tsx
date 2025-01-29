import { useState, useEffect } from 'react'
import {
  useAccount,
  useConnect,
  useDisconnect,
  useChainId,
  useSwitchChain,
  useBalance,
  useSignMessage
} from 'wagmi'
import { mainnet, bsc } from 'wagmi/chains'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, LogOut, ChevronDown } from 'lucide-react'
import { shortenAddr, walletOptions, WELCOME_MESSAGE } from '@/lib/utils'
import Synergy from '../assets/images/Synergy.svg'
import Eth from '../assets/images/Ethereum.svg'
import Bsc from '../assets/images/Bsc.svg'
import { WalletConnectionProps } from '@/lib/interface'

export function WalletConnection({ onError }: WalletConnectionProps) {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { connectAsync, connectors } = useConnect()
  const { disconnectAsync } = useDisconnect()
  const { switchChainAsync } = useSwitchChain()
  const { data: balance, isLoading: isBalanceLoading } = useBalance({
    address
  })
  const { signMessageAsync } = useSignMessage()

  const [isConnecting, setIsConnecting] = useState(false)
  const [isSwitchingNetwork, setIsSwitchingNetwork] = useState(false)
  const [isSigningMessage, setIsSigningMessage] = useState(false)
  const [hasSignedMessage, setHasSignedMessage] = useState(() => {
    return localStorage.getItem('hasSignedMessage') === 'true'
  })
  const [showWalletOptions, setShowWalletOptions] = useState(false)
  const [connectingWallet, setConnectingWallet] = useState<string | null>(null)

  useEffect(() => {
    if (isConnected && !isSigningMessage) {
      // handleSignMessage()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address])

  useEffect(() => {
    localStorage.setItem('hasSignedMessage', hasSignedMessage.toString())
  }, [hasSignedMessage])

  const handleConnect = async (connectorId: number, walletName: string) => {
    try {
      setIsConnecting(true)
      setConnectingWallet(walletName)
      const connector = connectors[connectorId]
      if (!connector) {
        throw new Error('Connector not found')
      }
      const result = await connectAsync({
        connector
      })
      if (result?.accounts[0]) {
        setShowWalletOptions(false)
      }
    } catch (error) {
      onError(`Failed to connect ${walletName}`)
      console.error(error)
    } finally {
      setIsConnecting(false)
      setConnectingWallet(null)
    }
  }

  const handleDisconnect = async () => {
    try {
      await disconnectAsync()
      setHasSignedMessage(false)
    } catch (error) {
      onError('Failed to disconnect wallet')
      console.error(error)
    }
  }

  const handleSignMessage = async () => {
    try {
      setIsSigningMessage(true)
      await signMessageAsync({
        message: WELCOME_MESSAGE
      })
      setHasSignedMessage(true)
    } catch (error) {
      if (!hasSignedMessage) {
        onError('Failed to sign message')
      }
      console.error(error)
    } finally {
      setIsSigningMessage(false)
    }
  }

  const handleSwitchNetwork = async (newChainId: number) => {
    try {
      setIsSwitchingNetwork(true)
      await switchChainAsync({ chainId: newChainId })
    } catch (error) {
      onError('Failed to switch network')
      console.error(error)
    } finally {
      setIsSwitchingNetwork(false)
    }
  }

  if (!isConnected) {
    return (
      <>
        <Button onClick={() => setShowWalletOptions(true)} className='w-auto'>
          Connect Wallet
        </Button>

        <Dialog open={showWalletOptions} onOpenChange={setShowWalletOptions}>
          <DialogContent className='sm:max-w-md  bg-secondary-foreground'>
            <DialogHeader>
              <DialogTitle className='text-gray-50 font-normal'>Connect Wallet</DialogTitle>
            </DialogHeader>
            <div className='grid gap-2 py-4'>
              {walletOptions.map((wallet) => (
                <Button
                  key={wallet.name}
                  onClick={() => handleConnect(wallet.connectorId, wallet.name)}
                  disabled={isConnecting}
                  variant='outline'
                  className='w-full h-14 flex items-center justify-start px-4 space-x-3 bg-[#1B1B1B] hover:bg-gray-100 text-gray-50'
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
      </>
    )
  }

  return (
    <Card className='bg-gray-50 p-6 max-w-xl space-y-4'>
      <CardContent className='space-x-4 mt-4 flex items-center justify-between'>
        <div className='flex items-center px-2 rounded-md justify-between w-fit gap-2 bg-accent-foreground'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' className='flex items-center bg-transparent'>
                {isSwitchingNetwork ? (
                  <Loader2 className='h-4 w-4 animate-spin' />
                ) : (
                  <img src={chainId === mainnet.id ? Eth : Bsc} alt='icon' className='h-5 w-5' />
                )}
                <span>{chainId === mainnet.id ? 'Ethereum' : 'BSC'}</span>
                <ChevronDown className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Button
                  className='w-full justify-start'
                  variant={chainId === mainnet.id ? 'default' : 'outline'}
                  onClick={() => handleSwitchNetwork(mainnet.id)}
                  disabled={isSwitchingNetwork}
                  size='sm'
                >
                  <img src={Eth} alt='icon' className='h-5 w-5' />
                  Ethereum
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Button
                  className='w-full justify-start'
                  variant={chainId === bsc.id ? 'default' : 'outline'}
                  onClick={() => handleSwitchNetwork(bsc.id)}
                  disabled={isSwitchingNetwork}
                  size='sm'
                >
                  <img src={Bsc} alt='icon' className='h-5 w-5' />
                  BSC
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className='flex items-center px-2 rounded-md justify-between w-fit gap-2 bg-accent-foreground'>
          <div>
            {isBalanceLoading || isSwitchingNetwork ? (
              <Loader2 className='h-4 w-4 animate-spin' />
            ) : (
              <p className='text-sm font-semibold'>
                {balance?.formatted} {balance?.symbol}
              </p>
            )}
          </div>
          <span className='text-[#E1E4EA]'>|</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='flex items-center bg-accent-foreground'>
                <img src={Synergy} alt='icon' className='h-5 w-5' />
                <span>{shortenAddr(address || '', 4, 4)}</span>
                <ChevronDown className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Button
                  onClick={handleSignMessage}
                  disabled={isSigningMessage || hasSignedMessage}
                  className='w-full'
                >
                  {isSigningMessage || isSwitchingNetwork ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Signing...
                    </>
                  ) : hasSignedMessage ? (
                    'Message Signed'
                  ) : (
                    'Sign Message'
                  )}
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Button onClick={handleDisconnect} variant='outline' className='w-full'>
                  <LogOut className='h-5 w-5' />
                  Disconnect
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  )
}
