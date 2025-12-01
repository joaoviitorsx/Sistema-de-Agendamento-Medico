import { Button as AntButton, ButtonProps as AntButtonProps } from 'antd';
import { ReactNode } from 'react';

export interface ButtonProps extends Omit<AntButtonProps, 'type' | 'variant'> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'ghost' | 'link';
  children: ReactNode;
}

export const Button = ({ variant = 'primary', children, className = '', ...props }: ButtonProps) => {
  let buttonType: AntButtonProps['type'] = 'primary';
  let danger = false;
  let ghost = false;

  switch (variant) {
    case 'primary':
      buttonType = 'primary';
      break;
    case 'secondary':
      buttonType = 'default';
      break;
    case 'success':
      buttonType = 'primary';
      className = `!bg-success hover:!bg-success-dark !border-success ${className}`;
      break;
    case 'danger':
      buttonType = 'primary';
      danger = true;
      break;
    case 'warning':
      buttonType = 'primary';
      className = `!bg-warning hover:!bg-warning-dark !border-warning ${className}`;
      break;
    case 'ghost':
      ghost = true;
      buttonType = 'default';
      break;
    case 'link':
      buttonType = 'link';
      break;
  }

  return (
    <AntButton
      type={buttonType}
      danger={danger}
      ghost={ghost}
      className={`font-medium ${className}`}
      {...props}
    >
      {children}
    </AntButton>
  );
};
