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
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

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
    <Card>
      <CardContent className='space-y-4 mt-4'>
        <div>
          <p className='text-sm font-medium text-gray-500'>Connected Address</p>
          <p className='text-sm font-mono break-all'>{address}</p>
        </div>

        <div>
          <p className='text-sm font-medium text-gray-500'>Current Balance</p>
          {isBalanceLoading ? (
            <Loader2 className='h-4 w-4 animate-spin' />
          ) : (
            <p className='text-sm'>
              {balance?.formatted} {balance?.symbol}
            </p>
          )}
        </div>

        <div>
          <p className='text-sm font-medium text-gray-500 mb-2'>Network Selection</p>
          <div className='flex space-x-2'>
            <Button
              variant={chainId === mainnet.id ? 'default' : 'outline'}
              onClick={() => handleSwitchNetwork(mainnet.id)}
              disabled={isSwitchingNetwork}
              size='sm'
            >
              Ethereum
            </Button>
            <Button
              variant={chainId === bsc.id ? 'default' : 'outline'}
              onClick={() => handleSwitchNetwork(bsc.id)}
              disabled={isSwitchingNetwork}
              size='sm'
            >
              BSC
            </Button>
          </div>
        </div>

        <div className='space-y-2'>
          <Button
            onClick={handleSignMessage}
            disabled={isSigningMessage || hasSignedMessage}
            className='w-full'
          >
            {isSigningMessage ? (
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

          <Button onClick={handleDisconnect} variant='outline' className='w-full'>
            Disconnect
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
