import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const shortenAddr = (text: string, first = 6, last = 4) => {
  if (text.length <= first + last) {
    return text
  }
  return text.slice(0, first) + '...' + text.slice(text.length - last)
}
