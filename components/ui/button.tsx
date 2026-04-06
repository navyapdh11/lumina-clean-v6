import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25',
        destructive: 'bg-red-600 text-white hover:bg-red-700',
        outline: 'border border-white/10 bg-white/5 text-white hover:bg-white/10',
        secondary: 'bg-white/10 text-white hover:bg-white/15',
        ghost: 'text-gray-300 hover:text-white hover:bg-white/5',
        link: 'text-cyan-400 underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-5 py-3',
        sm: 'h-9 px-4 text-xs',
        lg: 'h-14 px-8 text-lg rounded-2xl',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  )
);
Button.displayName = 'Button';

export { Button, buttonVariants };
