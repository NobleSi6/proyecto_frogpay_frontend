import type { InputHTMLAttributes, ReactNode } from "react";

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  error?: string;
  trailing?: ReactNode;
  reserveErrorSpace?: boolean;
  sizeVariant?: "default" | "activation";
};

export function FormField({
  id, label, error, trailing, reserveErrorSpace = false, sizeVariant = "default", ...inputProps
}: FormFieldProps) {
  return (
    <div className={`flex w-full flex-col ${sizeVariant === "activation" ? "gap-2" : "gap-1.5"}`}>
      <label htmlFor={id} className="text-sm leading-5 font-medium text-auth-secondary">
        {label}
      </label>
      <div className="relative">
        <input
          {...inputProps}
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`${sizeVariant === "activation" ? "h-12" : "h-11"} w-full rounded-auth-input border-[1.5px] bg-auth-surface px-3.5 text-base leading-5 text-auth-text outline-none placeholder:text-auth-muted focus-visible:ring-2 focus-visible:ring-auth-focus disabled:cursor-not-allowed disabled:bg-auth-disabled disabled:text-auth-muted sm:text-sm ${trailing ? "pr-12" : ""} ${error ? "border-auth-error-border" : "border-auth-border focus-visible:border-auth-primary"}`}
        />
        {trailing}
      </div>
      {(error || reserveErrorSpace) && (
        <p id={`${id}-error`} aria-live="polite" className="min-h-4 text-xs leading-4 text-auth-error">
          {error}
        </p>
      )}
    </div>
  );
}
