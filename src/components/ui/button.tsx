import { Slot } from '@radix-ui/react-slot'
import type { ComponentProps } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

const buttonVariants = tv({
  base: 'cursor-pointer rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50',

  defaultVariants: {
    size: 'default',
  },

  variants: {
    size: {
      default: 'px-3 py-2',
      icon: 'p-2',
      'icon-sm': 'p-1',
    },
  },
})

interface ButtonProps extends ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export function Button({ size, className, asChild, ...props }: ButtonProps) {
  const Component = asChild ? Slot : 'button'

  return (
    <Component
      className={buttonVariants({ className, size })}
      {...props}
    />
  )
}
