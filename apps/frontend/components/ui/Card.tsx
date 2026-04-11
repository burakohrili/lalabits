interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = '', hover = true }: CardProps) {
  return (
    <div
      className={[
        'bg-white border border-border rounded-[20px] p-6',
        'shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)]',
        hover
          ? 'transition-all duration-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] hover:scale-[1.01]'
          : '',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  );
}
