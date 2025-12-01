import { Card as AntCard, CardProps as AntCardProps } from 'antd';
import { ReactNode } from 'react';

export interface CardProps extends AntCardProps {
  children: ReactNode;
}

export const Card = ({ children, className = '', ...props }: CardProps) => {
  return (
    <AntCard
      className={`shadow-medical ${className}`}
      variant="outlined"
      {...props}
    >
      {children}
    </AntCard>
  );
};
