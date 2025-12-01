import { Select as AntSelect, SelectProps as AntSelectProps } from 'antd';

export interface SelectProps extends AntSelectProps {
  label?: string;
  error?: string;
  helperText?: string;
  options?: Array<{ value: string | number; label: string }>;
}

export const Select = ({ label, error, helperText, className = '', options, ...props }: SelectProps) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-neutral-dark mb-1.5">
          {label}
          {props.required && <span className="text-danger ml-1">*</span>}
        </label>
      )}
      
      <AntSelect
        status={error ? 'error' : undefined}
        className={`w-full ${className}`}
        options={options}
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
};
