import Image from 'next/image';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: AvatarSize;
  className?: string;
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-12 w-12 text-sm',
  lg: 'h-20 w-20 text-xl',
  xl: 'h-[120px] w-[120px] text-3xl',
};

const sizePx: Record<AvatarSize, number> = {
  sm: 32,
  md: 48,
  lg: 80,
  xl: 120,
};

export default function Avatar({ src, name, size = 'md', className = '' }: AvatarProps) {
  const initial = name.charAt(0).toUpperCase();
  const classes = [
    'rounded-full shrink-0 overflow-hidden flex items-center justify-center',
    sizeClasses[size],
    className,
  ].join(' ');

  if (src) {
    const px = sizePx[size];
    return (
      <Image
        src={src}
        alt={name}
        width={px}
        height={px}
        className={[classes, 'object-cover'].join(' ')}
        sizes={`${px}px`}
      />
    );
  }

  return (
    <div className={[classes, 'bg-teal text-white font-semibold'].join(' ')}>
      {initial}
    </div>
  );
}
