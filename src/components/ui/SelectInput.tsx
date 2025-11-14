import { forwardRef } from 'react';
import { clsx } from 'clsx';

interface Option {
  label: string;
  value: string | number;
}

interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Option[];
  error?: string;
}

export const SelectInput = forwardRef<HTMLSelectElement, Props>(
  ({ label, options, error, className, children, ...props }, ref) => {
  return (
    <label className="block text-sm text-secondary">
      <span className="mb-1 block font-medium">{label}</span>
      <select
        ref={ref}
        className={clsx(
          'w-full rounded-full border border-grisFondo bg-white px-4 py-2 text-sm transition focus:border-secondary',
          error && 'border-red-400 focus:border-red-400 focus:ring-red-400',
          className
        )}
        {...props}
      >
        {children}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <span className="mt-1 block text-xs text-red-500">{error}</span> : null}
    </label>
  );
  }
);

SelectInput.displayName = 'SelectInput';
