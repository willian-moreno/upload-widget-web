import type { ComponentProps } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

const buttonVariants = tv({
  base: 'cursor-pointer rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 disabled:pointer-events-none disabled:opacity-50',

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

interface ButtonProps
  extends ComponentProps<'button'>,
    VariantProps<typeof buttonVariants> {}

export function Button({ size, className, ...props }: ButtonProps) {
  return (
    <button
      className={buttonVariants({ className, size })}
      {...props}
    />
  )
}
