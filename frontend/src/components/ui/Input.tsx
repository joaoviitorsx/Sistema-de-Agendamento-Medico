import { Input as AntInput, InputProps as AntInputProps } from 'antd';
import { forwardRef } from 'react';

export interface InputProps extends AntInputProps {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<any, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-neutral-dark mb-1.5">
            {label}
            {props.required && <span className="text-danger ml-1">*</span>}
          </label>
        )}
        
        <AntInput
          ref={ref}
          status={error ? 'error' : undefined}
          className={className}
          {...props}
        />
        
        {error && (
          <span className="text-xs text-danger mt-1 block">{error}</span>
        )}
        
        {helperText && !error && (
          <span className="text-xs text-neutral-medium mt-1 block">{helperText}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
