import { Github } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const Footer = () => {
  return (
    <div className='absolute bottom-0 right-0 p-4 '>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              href='https://github.com/Swapnil-Sagar/wagmi-wallet-interaction'
              target='_blank'
              rel='noreferrer'
            >
              <Github className='h-7 w-7 hover:animate-bounce' />
            </a>
          </TooltipTrigger>
          <TooltipContent side='left'>
            <p>By Swapnil Sagar</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

export default Footer
