import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  bordered?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className,
  onClick,
  hoverable = true,
  bordered = false
}) => {
  return (
    <div 
      className={cn(
        'bg-white rounded-xl overflow-hidden transition-all duration-200',
        hoverable ? 'shadow-card hover:shadow-card-hover' : 'shadow-sm',
        bordered && 'border border-neutral-200',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => (
  <div className={cn('p-4 border-b border-neutral-100', className)}>
    {children}
  </div>
);

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

const CardBody: React.FC<CardBodyProps> = ({ children, className }) => (
  <div className={cn('p-4', className)}>
    {children}
  </div>
);

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

const CardFooter: React.FC<CardFooterProps> = ({ children, className }) => (
  <div className={cn('p-4 border-t border-neutral-100', className)}>
    {children}
  </div>
);

interface CardImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: 'auto' | 'square' | 'video' | 'vertical';
}

const CardImage: React.FC<CardImageProps> = ({ 
  src, 
  alt, 
  className,
  aspectRatio = 'auto'
}) => {
  const aspectRatioClasses = {
    auto: '',
    square: 'aspect-square',
    video: 'aspect-video',
    vertical: 'aspect-[3/4]'
  };

  return (
    <div className={cn(
      'relative overflow-hidden',
      aspectRatioClasses[aspectRatio],
      className
    )}>
      <img 
        src={src} 
        alt={alt} 
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
      />
    </div>
  );
};

export { Card, CardHeader, CardBody, CardFooter, CardImage };