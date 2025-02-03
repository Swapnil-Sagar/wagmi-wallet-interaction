import { Github } from 'lucide-react'

const Footer = () => {
  return (
    <div title='By Swapnil Sagar' className='absolute bottom-0 right-0 m-4 hover:animate-bounce'>
      <a
        href='https://github.com/Swapnil-Sagar/wagmi-wallet-interaction'
        target='_blank'
        rel='noreferrer'
      >
        <Github className='h-6 w-6' />
      </a>
    </div>
  )
}

export default Footer
