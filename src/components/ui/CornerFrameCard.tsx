import type { ReactNode } from 'react';

type CornerFrameCardProps = {
  children: ReactNode;
  className?: string;
  cornerSize?: 'sm' | 'md' | 'lg';
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
      <div className={`absolute top-0 left-0 ${size} border-l-2 border-t-2 border-primary-300 opacity-0 group-hover:opacity-100 transition-opacity`} />
      {children}
      <div className={`absolute bottom-0 right-0 ${size} border-r-2 border-b-2 border-primary-300 opacity-0 group-hover:opacity-100 transition-opacity`} />
    </Tag>
  );
}
