import { cn } from '@/lib/utils';

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'premium';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<string, string> = {
  default: 'bg-surface-100 text-surface-600',
  success: 'bg-mint-50 text-mint-700',
  warning: 'bg-sunny-50 text-sunny-700',
  danger: 'bg-coral-50 text-coral-700',
  info: 'bg-ocean-50 text-ocean-700',
  premium: 'bg-sunny-500 text-white',
};

const sizeClasses = {
  sm: 'px-2.5 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
};

export default function Badge({ variant = 'default', size = 'sm', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        variantClasses[variant] || variantClasses.default,
        sizeClasses[size],
        className
      )}
    >
      {children}
    </span>
  );
}
