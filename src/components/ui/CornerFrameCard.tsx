import type { ReactNode } from 'react';
import { cn } from '@/functions/cn';

type CornerFrameCardProps = {
  children: ReactNode;
  className?: string;
  cornerSize?: 'sm' | 'md' | 'lg';
  frameColor?: string;
  onClick?: () => void;
};

const cornerSizes = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

export default function CornerFrameCard({
  children,
  className = '',
  cornerSize = 'md',
  frameColor = 'border-primary-300',
  onClick,
}: CornerFrameCardProps) {
  const size = cornerSizes[cornerSize];
  const Tag = onClick ? 'button' : 'div';

  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`group relative ${className}`}
    >
      <div className={cn('absolute top-0 left-0 border-l-2 border-t-2 opacity-0 group-hover:opacity-100 transition-opacity', size, frameColor)} />
      {children}
      <div className={cn('absolute bottom-0 right-0 border-r-2 border-b-2 opacity-0 group-hover:opacity-100 transition-opacity', size, frameColor)} />
    </Tag>
  );
}
