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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, LogOut, ChevronDown } from 'lucide-react'
import { shortenAddr } from '@/lib/utils'
import Synergy from '../assets/images/Synergy.svg'
import Eth from '../assets/images/Ethereum.svg'
import Bsc from '../assets/images/Bsc.svg'

interface WalletConnectionProps {
  onError: (error: string) => void
}

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
  const [hasSignedMessage, setHasSignedMessage] = useState(false)

  useEffect(() => {
    if (isConnected && !hasSignedMessage) {
      //   handleSignMessage()
    }
  }, [address])

  const handleConnect = async () => {
    try {
      setIsConnecting(true)
      const result = await connectAsync({
        connector: connectors[0]
      })
      if (result?.accounts[0]) {
        // Connected successfully
      }
    } catch (error) {
      onError('Failed to connect wallet')
      console.error(error)
    } finally {
      setIsConnecting(false)
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
        message: 'Welcome to our dApp! Please sign this message to verify your ownership.'
      })
      setHasSignedMessage(true)
    } catch (error) {
      onError('Failed to sign message')
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
      <Button onClick={handleConnect} disabled={isConnecting} className='w-auto'>
        {isConnecting ? (
          <>
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            Connecting...
          </>
        ) : (
          'Connect Wallet'
        )}
      </Button>
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
                {' '}
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
                {' '}
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
