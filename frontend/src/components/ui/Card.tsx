import { cn } from '@/lib/utils';
import { HTMLAttributes, forwardRef } from 'react';
import { crayons, type CrayonName } from '@/lib/crayon';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'gradient' | 'raised';
  color?: CrayonName;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', color, children, ...props }, ref) => {
    const accent = color ? crayons.find(c => c.name === color) : undefined;
    const variantStyles = {
      default: 'bg-white border-2 border-surface-200 shadow-card',
      glass: 'glass border-2 border-white/40',
      gradient: 'card-gradient border-2 border-surface-200 shadow-card',
      raised: 'bg-white border-2 border-surface-200/60 shadow-card-raised',
    };
    return (
      <div
        ref={ref}
        className={cn(
          'relative rounded-2xl transition-all duration-300',
          'hover:shadow-card-hover hover:-translate-y-0.5',
          variantStyles[variant],
          accent && `overflow-hidden ${accent.border} ${accent.hoverBorder} ${accent.hoverShadow}`,
          className
        )}
        {...props}
      >
        {accent && <div className={`absolute inset-x-0 top-0 h-2 ${accent.body}`} />}
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6 pb-0', className)} {...props} />
  )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn('font-display text-lg font-bold leading-tight', className)} {...props} />
  )
);
CardTitle.displayName = 'CardTitle';

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

export { Card, CardHeader, CardTitle, CardContent };
