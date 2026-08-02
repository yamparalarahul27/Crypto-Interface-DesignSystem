"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type FocusEvent,
  type KeyboardEvent,
} from "react";
import { cn } from "@/lib/utils";

export type OTPMode = "numeric" | "alphanumeric";

const ALLOW: Record<OTPMode, RegExp> = {
  numeric: /^[0-9]$/,
  alphanumeric: /^[0-9a-zA-Z]$/,
};

type UseOTPInputOptions = {
  length?: number;
  mode?: OTPMode;
  defaultValue?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
};

function useOTPInput({
  length = 6,
  mode = "numeric",
  defaultValue = "",
  disabled = false,
  onChange,
  onComplete,
}: UseOTPInputOptions) {
  const allow = ALLOW[mode];
  const keep = useCallback(
    (text: string) =>
      text
        .split("")
        .filter((c) => allow.test(c))
        .join(""),
    [allow],
  );

  const [chars, setChars] = useState<string[]>(() => {
    const seed = defaultValue
      .split("")
      .filter((c) => ALLOW[mode].test(c))
      .slice(0, length);
    return Array.from({ length }, (_, i) => seed[i] ?? "");
  });
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const charsRef = useRef(chars);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const changed = useRef(onChange);
  const completed = useRef(onComplete);

  useEffect(() => {
    charsRef.current = chars;
    changed.current = onChange;
    completed.current = onComplete;
  });

  const commit = useCallback((next: string[]) => {
    charsRef.current = next;
    setChars(next);
    const value = next.join("");
    changed.current?.(value);
    if (next.length > 0 && next.every((c) => c !== "")) completed.current?.(value);
  }, []);

  const focusAt = useCallback(
    (index: number) => {
      const el = refs.current[Math.max(0, Math.min(length - 1, index))];
      if (!el) return;
      el.focus();
      el.select();
    },
    [length],
  );

  const fillFrom = useCallback(
    (index: number, text: string) => {
      const incoming = keep(text);
      if (incoming.length === 0) return;
      const next = [...charsRef.current];
      let cursor = index;
      for (const c of incoming) {
        if (cursor >= length) break;
        next[cursor] = c;
        cursor += 1;
      }
      commit(next);
      focusAt(Math.min(cursor, length - 1));
    },
    [commit, focusAt, keep, length],
  );

  const clear = useCallback(() => {
    commit(Array.from({ length }, () => ""));
    focusAt(0);
  }, [commit, focusAt, length]);

  const getCellProps = useCallback(
    (index: number) => ({
      ref: (el: HTMLInputElement | null) => {
        refs.current[index] = el;
      },
      value: chars[index] ?? "",
      disabled,
      type: "text" as const,
      inputMode: (mode === "numeric" ? "numeric" : "text") as "numeric" | "text",
      autoComplete: index === 0 ? "one-time-code" : "off",
      autoCorrect: "off" as const,
      autoCapitalize: "off" as const,
      spellCheck: false as const,
      onChange: (e: ChangeEvent<HTMLInputElement>) => {
        const previous = charsRef.current[index] ?? "";
        const raw = e.currentTarget.value;
        const trimmed =
          raw.length > 1 && previous && raw.startsWith(previous)
            ? raw.slice(previous.length)
            : raw;
        const incoming = keep(trimmed);

        if (incoming.length === 0) {
          if (raw.length === 0 && previous) {
            const next = [...charsRef.current];
            next[index] = "";
            commit(next);
          }
          e.currentTarget.value = charsRef.current[index] ?? "";
          return;
        }

        if (incoming.length === 1) {
          const next = [...charsRef.current];
          next[index] = incoming;
          e.currentTarget.value = incoming;
          commit(next);
          if (index < length - 1) focusAt(index + 1);
          return;
        }

        fillFrom(index, incoming);
      },
      onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace") {
          e.preventDefault();
          const current = charsRef.current;
          const next = [...current];
          if (current[index]) {
            next[index] = "";
            commit(next);
            return;
          }
          if (index > 0) {
            next[index - 1] = "";
            commit(next);
            focusAt(index - 1);
          }
          return;
        }
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          focusAt(index - 1);
          return;
        }
        if (e.key === "ArrowRight") {
          e.preventDefault();
          focusAt(index + 1);
        }
      },
      onPaste: (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const text = keep(e.clipboardData.getData("text"));
        fillFrom(text.length >= length ? 0 : index, text);
      },
      onFocus: (e: FocusEvent<HTMLInputElement>) => {
        e.currentTarget.select();
        const firstEmpty = charsRef.current.findIndex((c) => c === "");
        if (firstEmpty !== -1 && firstEmpty < index) {
          focusAt(firstEmpty);
          return;
        }
        setFocusedIndex(index);
      },
      onBlur: (e: FocusEvent<HTMLInputElement>) => {
        const to = e.relatedTarget as HTMLInputElement | null;
        if (to && refs.current.includes(to)) return;
        setFocusedIndex(-1);
      },
    }),
    [chars, commit, disabled, fillFrom, focusAt, keep, length, mode],
  );

  return {
    chars,
    value: chars.join(""),
    length,
    focusedIndex,
    getCellProps,
    focusAt,
    clear,
  };
}

export type OTPInputProps = {
  length?: number;
  mode?: OTPMode;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  error?: boolean;
  errorMessage?: string;
  hint?: string;
  label?: string;
  groupEvery?: number;
  disabled?: boolean;
  autoFocus?: boolean;
  className?: string;
};

/**
 * One-time code cells for wallet connect / verify flows. Paste fills
 * from any cell; width reserved on first paint. No `motion`.
 */
export function OTPInput({
  length = 6,
  mode = "numeric",
  defaultValue = "",
  onChange,
  onComplete,
  error = false,
  errorMessage = "",
  hint = "",
  label = "Verification code",
  groupEvery = 3,
  disabled = false,
  autoFocus = false,
  className,
}: OTPInputProps) {
  const statusId = useId();
  const { focusedIndex, getCellProps, focusAt } = useOTPInput({
    length,
    mode,
    defaultValue,
    disabled,
    onChange,
    onComplete,
  });

  useEffect(() => {
    if (autoFocus && !disabled) focusAt(0);
  }, [autoFocus, disabled, focusAt]);

  useEffect(() => {
    if (error && !disabled) focusAt(0);
  }, [error, disabled, focusAt]);

  const hasStatus = Boolean(hint || errorMessage);
  const message = error ? errorMessage : hint;

  return (
    <div className={cn("inline-flex flex-col", className)}>
      <div role="group" aria-label={label} className="relative flex gap-2">
        {Array.from({ length }, (_, i) => {
          const active = focusedIndex === i;
          const gap = groupEvery > 0 && i > 0 && i % groupEvery === 0;
          const props = getCellProps(i);
          return (
            <div key={i} className={cn("relative h-11 w-9", gap && "ml-2")}>
              <input
                {...props}
                aria-label={`${label}, character ${i + 1} of ${length}`}
                aria-invalid={error || undefined}
                aria-describedby={hasStatus ? statusId : undefined}
                className={cn(
                  "h-11 w-9 rounded-control border bg-surface-container text-center font-mono text-sm tabular-nums text-fg",
                  "outline-none transition-[border-color,background-color] duration-150",
                  "disabled:opacity-40",
                  error
                    ? "border-sell"
                    : active
                      ? "border-outline"
                      : "border-outline-variant",
                )}
              />
            </div>
          );
        })}
      </div>
      {hasStatus && (
        <div className="relative mt-2 grid h-4 text-[11px] leading-4">
          <span
            className={cn(
              "col-start-1 row-start-1 transition-opacity duration-150",
              error ? "text-sell opacity-100" : "text-fg-muted opacity-100",
            )}
          >
            {message}
          </span>
          <span id={statusId} role="status" className="sr-only">
            {message}
          </span>
        </div>
      )}
    </div>
  );
}
