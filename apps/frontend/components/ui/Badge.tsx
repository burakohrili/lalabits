type Variant = 'teal' | 'orange' | 'gray' | 'success' | 'warning';

interface BadgeProps {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<Variant, string> = {
  teal: 'bg-teal-light text-teal',
  orange: 'bg-orange-light text-orange-dark',
  gray: 'bg-gray-100 text-text-secondary',
  success: 'bg-green-50 text-green-700',
  warning: 'bg-yellow-50 text-yellow-700',
};

export default function Badge({ variant = 'gray', children, className = '' }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium leading-none',
        variantClasses[variant],
        className,
      ].join(' ')}
    >
      {children}
    </span>
  );
}
