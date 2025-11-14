import { forwardRef } from 'react';
import { clsx } from 'clsx';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const TextInput = forwardRef<HTMLInputElement, Props>(({ label, error, hint, className, ...props }, ref) => {
  return (
    <label className="block text-sm text-secondary">
      <span className="mb-1 block font-medium">{label}</span>
      <input
        ref={ref}
        className={clsx(
          'w-full rounded-full border border-grisFondo bg-white px-4 py-2 text-sm transition focus:border-secondary',
          error && 'border-red-400 focus:border-red-400 focus:ring-red-400',
          className
        )}
        {...props}
      />
      {hint && !error ? <span className="mt-1 block text-xs text-grisTexto">{hint}</span> : null}
      {error ? <span className="mt-1 block text-xs text-red-500">{error}</span> : null}
    </label>
  );
});

TextInput.displayName = 'TextInput';
