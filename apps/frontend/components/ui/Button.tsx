import { type ButtonHTMLAttributes, forwardRef } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-orange text-white hover:bg-orange-dark active:bg-orange-dark',
  secondary:
    'border border-teal text-teal bg-transparent hover:bg-teal-light active:bg-teal-light',
  ghost:
    'text-text-secondary bg-transparent hover:text-text-primary hover:bg-gray-50 active:bg-gray-100',
  danger:
    'bg-red-600 text-white hover:bg-red-700 active:bg-red-700',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={[
          'inline-flex items-center justify-center gap-2 rounded-xl font-semibold',
          'transition-all duration-150 cursor-pointer',
          'focus:outline-none focus-visible:ring-3 focus-visible:ring-teal/25',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variantClasses[variant],
          sizeClasses[size],
          className,
        ].join(' ')}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
