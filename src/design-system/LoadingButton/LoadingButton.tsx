"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import { IconCheck, IconExclamation, IconSpinner } from "../icons";
import {
  BUTTON_SIZE,
  BUTTON_VARIANT,
  type ButtonSize,
  type ButtonVariant,
} from "../Button";

export type AsyncActionStatus = "idle" | "pending" | "success" | "error";

type UseAsyncActionOptions = {
  action: () => unknown;
  resetAfter?: number;
  onError?: (error: unknown) => void;
};

/**
 * Idle → pending → success|error → idle. Rejects while pending so a
 * second click never queues; success/error can be re-run (Retry).
 * Behavior contract stolen from Interior's loading-button: CSS only,
 * no `motion` dep (portable core).
 */
function useAsyncAction({
  action,
  resetAfter = 1400,
  onError,
}: UseAsyncActionOptions) {
  const [status, setStatus] = useState<AsyncActionStatus>("idle");
  const phase = useRef<AsyncActionStatus>("idle");
  const runId = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const alive = useRef(true);
  const act = useRef(action);
  const fail = useRef(onError);

  useEffect(() => {
    act.current = action;
    fail.current = onError;
  });

  const clear = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  const run = useCallback(() => {
    if (phase.current === "pending") return;

    clear();
    const id = ++runId.current;
    phase.current = "pending";
    setStatus("pending");

    const settle = (next: "success" | "error") => {
      if (!alive.current || id !== runId.current) return;
      clear();
      phase.current = next;
      setStatus(next);
      timer.current = setTimeout(() => {
        if (!alive.current || id !== runId.current) return;
        phase.current = "idle";
        setStatus("idle");
      }, resetAfter);
    };

    Promise.resolve()
      .then(() => act.current())
      .then(
        () => settle("success"),
        (error: unknown) => {
          fail.current?.(error);
          settle("error");
        },
      );
  }, [clear, resetAfter]);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      clear();
    };
  }, [clear]);

  return {
    status,
    run,
    pending: status === "pending",
  };
}

export type LoadingButtonProps = {
  /** Runs on click. Sync throws and rejected promises → error; else success. */
  onAction: () => unknown;
  /** Idle label: string so it can also be the accessible name. */
  children: string;
  pendingLabel?: string;
  successLabel?: string;
  errorLabel?: string;
  /** ms to hold success/error before returning to idle. */
  resetAfter?: number;
  /** Genuinely unavailable (not busy). Sets the native disabled attribute. */
  disabled?: boolean;
  onError?: (error: unknown) => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

/**
 * Async action button: width-stable label swap across idle → pending →
 * success|error → idle. Compose on Button tokens; do not put irreversible
 * confirms here: that is HoldToConfirm territory.
 */
export function LoadingButton({
  onAction,
  children,
  pendingLabel = children,
  successLabel = "Done",
  errorLabel = "Try again",
  resetAfter = 1400,
  disabled = false,
  onError,
  variant = "primary",
  size = "md",
  className,
}: LoadingButtonProps) {
  const { status, run, pending } = useAsyncAction({
    action: onAction,
    resetAfter,
    onError,
  });

  const label =
    status === "pending"
      ? pendingLabel
      : status === "success"
        ? successLabel
        : status === "error"
          ? errorLabel
          : children;

  const faces: {
    key: AsyncActionStatus;
    text: string;
    icon: ReactNode;
  }[] = [
    { key: "idle", text: children, icon: null },
    {
      key: "pending",
      text: pendingLabel,
      icon: <IconSpinner size={12} weight="bold" aria-hidden="true" className="shrink-0 animate-spin" />,
    },
    {
      key: "success",
      text: successLabel,
      icon: <IconCheck size={12} weight="bold" aria-hidden="true" className="shrink-0" />,
    },
    {
      key: "error",
      text: errorLabel,
      icon: <IconExclamation size={12} weight="bold" aria-hidden="true" className="shrink-0" />,
    },
  ];

  return (
    <>
      <button
        type="button"
        disabled={disabled}
        aria-label={label}
        aria-busy={pending || undefined}
        aria-disabled={pending || undefined}
        onClick={(event) => {
          if (pending) {
            event.preventDefault();
            return;
          }
          run();
        }}
        className={cn(
          "relative inline-flex select-none items-center justify-center rounded-control font-medium",
          "transition-[background-color,color,box-shadow,transform] duration-150",
          !disabled && !pending && "active:scale-[0.96]",
          "disabled:pointer-events-none disabled:opacity-40",
          pending && "cursor-wait opacity-90",
          BUTTON_SIZE[size],
          BUTTON_VARIANT[variant],
          className,
        )}
      >
        {/*
          Stack every face in one grid cell so the button reserves the
          widest label up front: Save → Saving… never shoves the row.
        */}
        <span aria-hidden className="relative inline-grid place-items-center">
          {faces.map((face) => (
            <span
              key={face.key}
              className={cn(
                "col-start-1 row-start-1 flex items-center justify-center gap-1.5 whitespace-nowrap",
                "transition-opacity duration-150",
                face.key === status ? "opacity-100" : "opacity-0",
              )}
            >
              {face.icon}
              {face.text}
            </span>
          ))}
        </span>
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {status === "success" ? successLabel : status === "error" ? errorLabel : ""}
      </span>
    </>
  );
}
