"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "../Input";

export type ValidationStatus = "idle" | "pending" | "valid" | "invalid";
export type Validator = (value: string) => string | null;

type UseInlineValidationOptions = {
  value: string;
  validate: Validator;
  debounce?: number;
};

function useInlineValidation({
  value,
  validate,
  debounce = 400,
}: UseInlineValidationOptions) {
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<ValidationStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const check = useRef(validate);
  const latest = useRef(value);
  useEffect(() => {
    check.current = validate;
    latest.current = value;
  });

  useEffect(() => {
    if (!touched) return;

    const next = check.current(value);

    if (next === null) {
      setStatus(value.length > 0 ? "valid" : "idle");
      setError(null);
      return;
    }

    setStatus((prev) => (prev === "invalid" ? prev : "pending"));
    const t = setTimeout(() => {
      setStatus("invalid");
      setError(next);
      setMessage(next);
    }, debounce);
    return () => clearTimeout(t);
  }, [value, touched, debounce]);

  const commit = useCallback(() => {
    setTouched(true);
    const v = latest.current;
    const next = check.current(v);
    if (next === null) {
      setStatus(v.length > 0 ? "valid" : "idle");
      setError(null);
    } else {
      setStatus("invalid");
      setError(next);
      setMessage(next);
    }
  }, []);

  return {
    status,
    error,
    message,
    fieldProps: {
      onBlur: commit,
      "aria-invalid": status === "invalid" ? true : undefined,
    },
  };
}

export type InlineValidationProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  validate: Validator;
  hint?: string;
  id?: string;
  name?: string;
  type?: "text" | "email" | "password" | "tel" | "url" | "search";
  placeholder?: string;
  autoComplete?: string;
  debounce?: number;
  disabled?: boolean;
  required?: boolean;
  className?: string;
};

/**
 * Labeled field with reserved-height hint ↔ error swap (no layout jump).
 * Validates on blur / after debounce while touched. Composes Input tokens.
 */
export function InlineValidation({
  label,
  value,
  onChange,
  validate,
  hint,
  id,
  name,
  type = "text",
  placeholder,
  autoComplete,
  debounce = 400,
  disabled = false,
  required = false,
  className,
}: InlineValidationProps) {
  const auto = useId();
  const fieldId = id ?? `${auto}-field`;
  const hintId = `${auto}-hint`;
  const errorId = `${auto}-error`;

  const { status, error, message, fieldProps } = useInlineValidation({
    value,
    validate,
    debounce,
  });

  const invalid = status === "invalid";
  const valid = status === "valid";
  const described = [hint ? hintId : null, invalid ? errorId : null]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cn("w-full", className)}>
      <label htmlFor={fieldId} className="mb-1.5 block text-xs font-medium text-fg">
        {label}
      </label>
      <div className="relative">
        <Input
          id={fieldId}
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          required={required}
          aria-required={required || undefined}
          aria-describedby={described || undefined}
          invalid={invalid}
          onChange={(e) => onChange(e.target.value)}
          {...fieldProps}
          className="pr-9"
        />
        <span
          className="pointer-events-none absolute right-3 top-1/2 grid size-3.5 -translate-y-1/2 place-items-center"
          aria-hidden
        >
          <svg
            viewBox="0 0 12 12"
            width="14"
            height="14"
            fill="none"
            className={cn(
              "col-start-1 row-start-1 text-buy transition-opacity duration-150",
              valid ? "opacity-100" : "opacity-0",
            )}
          >
            <path
              d="M2 6.3 4.7 9 10 3.2"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <svg
            viewBox="0 0 12 12"
            width="14"
            height="14"
            fill="none"
            className={cn(
              "col-start-1 row-start-1 text-sell transition-opacity duration-150",
              invalid ? "opacity-100" : "opacity-0",
            )}
          >
            <path d="M6 2v4.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            <rect x="5.15" y="8.4" width="1.7" height="1.7" rx="0.5" fill="currentColor" />
          </svg>
        </span>
      </div>
      <div className="relative mt-1.5 grid h-4 text-[11px] leading-4">
        {hint ? (
          <p
            className={cn(
              "col-start-1 row-start-1 text-fg-muted transition-opacity duration-150",
              invalid ? "opacity-0" : "opacity-100",
            )}
          >
            {hint}
          </p>
        ) : null}
        <p
          className={cn(
            "col-start-1 row-start-1 text-sell transition-opacity duration-150",
            invalid ? "opacity-100" : "opacity-0",
          )}
        >
          {error ?? message}
        </p>
        {hint ? (
          <span id={hintId} className="sr-only">
            {hint}
          </span>
        ) : null}
        <span id={errorId} role="status" aria-live="polite" aria-atomic="true" className="sr-only">
          {error ?? ""}
        </span>
      </div>
    </div>
  );
}
