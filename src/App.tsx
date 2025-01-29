import { WagmiProvider } from 'wagmi'
import { config } from './wagmi'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WalletConnection } from './components/WalletConnection'

const queryClient = new QueryClient()

export default function App() {
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError('')
      }, 3000)
    }
  }, [error])

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <div className='min-h-screen bg-gray-100 p-4 flex w-full justify-center items-center'>
          <div className='max-w-2xl mx-auto'>
            {error && (
              <Alert variant='destructive' className='mb-4'>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <WalletConnection onError={setError} />
          </div>
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
