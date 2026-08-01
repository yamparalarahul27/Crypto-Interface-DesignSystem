"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

export type HoldPhase = "idle" | "holding" | "releasing" | "committed";

type UseHoldToConfirmOptions = {
  onConfirm: () => void;
  onAbort?: () => void;
  duration?: number;
  releaseRate?: number;
  moveTolerance?: number;
  disabled?: boolean;
};

/**
 * Press-and-hold confirm. Progress fills while held, drains on release
 * (faster than fill). Commits once at full duration — a click never fires
 * onConfirm. CSS-only fill (no `motion`).
 */
function useHoldToConfirm({
  onConfirm,
  onAbort,
  duration = 1800,
  releaseRate = 2.5,
  moveTolerance = 10,
  disabled = false,
}: UseHoldToConfirmOptions) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<HoldPhase>("idle");

  const phaseRef = useRef<HoldPhase>("idle");
  const down = useRef(false);
  const elapsed = useRef(0);
  const last = useRef(0);
  const raf = useRef(0);
  const origin = useRef<{ x: number; y: number } | null>(null);
  const confirm = useRef(onConfirm);
  const abort = useRef(onAbort);
  useEffect(() => {
    confirm.current = onConfirm;
    abort.current = onAbort;
  });

  const move = useCallback((next: HoldPhase) => {
    phaseRef.current = next;
    setPhase(next);
  }, []);

  const reset = useCallback(() => {
    cancelAnimationFrame(raf.current);
    raf.current = 0;
    down.current = false;
    elapsed.current = 0;
    origin.current = null;
    setProgress(0);
    move("idle");
  }, [move]);

  const begin = useCallback(
    (point?: { x: number; y: number }) => {
      if (disabled) return;
      if (phaseRef.current === "committed" || phaseRef.current === "holding") return;

      origin.current = point ?? null;
      down.current = true;
      move("holding");
      if (raf.current) return;

      last.current = performance.now();

      const loop = (now: number) => {
        const dt = Math.min(64, now - last.current);
        last.current = now;
        elapsed.current += down.current ? dt : -dt * releaseRate;

        if (elapsed.current >= duration) {
          raf.current = 0;
          elapsed.current = duration;
          down.current = false;
          origin.current = null;
          setProgress(1);
          move("committed");
          confirm.current();
          return;
        }

        if (elapsed.current <= 0) {
          raf.current = 0;
          elapsed.current = 0;
          origin.current = null;
          setProgress(0);
          move("idle");
          return;
        }

        setProgress(elapsed.current / duration);
        raf.current = requestAnimationFrame(loop);
      };

      raf.current = requestAnimationFrame(loop);
    },
    [disabled, duration, releaseRate, move],
  );

  const release = useCallback(() => {
    if (phaseRef.current !== "holding") return;
    down.current = false;
    origin.current = null;
    move("releasing");
    abort.current?.();
  }, [move]);

  useEffect(() => {
    const bail = () => release();
    const onVisibility = () => {
      if (document.hidden) release();
    };
    window.addEventListener("blur", bail);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("blur", bail);
      document.removeEventListener("visibilitychange", onVisibility);
      cancelAnimationFrame(raf.current);
    };
  }, [release]);

  const bind = {
    onPointerDown: (e: PointerEvent<HTMLButtonElement>) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      e.currentTarget.setPointerCapture?.(e.pointerId);
      begin({ x: e.clientX, y: e.clientY });
    },
    onPointerMove: (e: PointerEvent<HTMLButtonElement>) => {
      const from = origin.current;
      if (phaseRef.current !== "holding" || !from) return;
      if (Math.hypot(e.clientX - from.x, e.clientY - from.y) > moveTolerance) {
        release();
      }
    },
    onPointerUp: release,
    onPointerCancel: release,
    onPointerLeave: release,
    onKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "Escape") {
        if (phaseRef.current === "holding" || phaseRef.current === "releasing") {
          e.preventDefault();
          reset();
        }
        return;
      }
      if (e.repeat) return;
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        begin();
      }
    },
    onKeyUp: (e: KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === " " || e.key === "Enter") release();
    },
    onBlur: release,
    onClick: (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (phaseRef.current === "committed") e.stopPropagation();
    },
    onContextMenu: (e: MouseEvent<HTMLButtonElement>) => e.preventDefault(),
  };

  return { bind, phase, progress, reset };
}

export type HoldToConfirmProps = {
  onConfirm: () => void;
  children: ReactNode;
  onAbort?: () => void;
  confirmLabel?: string;
  duration?: number;
  resetAfter?: number;
  releaseRate?: number;
  disabled?: boolean;
  className?: string;
};

/**
 * Irreversible-action control: hold to commit. For revoke / disconnect
 * forever / delete — never for reversible toggles (use Switch / Dialog).
 */
export function HoldToConfirm({
  onConfirm,
  children,
  onAbort,
  confirmLabel = "Confirmed",
  duration = 1800,
  resetAfter = 1600,
  releaseRate = 2.5,
  disabled = false,
  className,
}: HoldToConfirmProps) {
  const { bind, phase, progress, reset } = useHoldToConfirm({
    onConfirm,
    onAbort,
    duration,
    releaseRate,
    disabled,
  });
  const hintId = useId();
  const committed = phase === "committed";
  const seconds = Math.round(duration / 100) / 10;
  const name = typeof children === "string" ? children : undefined;
  const accessibleName = committed ? confirmLabel : name;

  useEffect(() => {
    if (phase !== "committed" || resetAfter <= 0) return;
    const t = setTimeout(reset, resetAfter);
    return () => clearTimeout(t);
  }, [phase, resetAfter, reset]);

  return (
    <>
      <button
        type="button"
        aria-label={accessibleName}
        aria-disabled={disabled || committed || undefined}
        aria-describedby={hintId}
        {...bind}
        style={{ touchAction: "manipulation", WebkitTouchCallout: "none" }}
        className={cn(
          "relative isolate inline-grid h-10 select-none place-items-center overflow-hidden",
          "rounded-control border border-outline-variant bg-surface-container px-4 text-sm font-medium text-fg",
          "outline-none transition-[border-color,opacity] duration-150",
          disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer",
          className,
        )}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 bg-sell-strong transition-[width] duration-75 ease-linear"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
        <span aria-hidden className="relative z-[1] col-start-1 row-start-1 grid">
          <span
            className={cn(
              "col-start-1 row-start-1 flex items-center justify-center whitespace-nowrap transition-opacity duration-150",
              committed ? "opacity-0" : progress > 0.15 ? "text-white" : "text-fg",
            )}
          >
            {children}
          </span>
          <span
            className={cn(
              "col-start-1 row-start-1 flex items-center justify-center gap-1.5 whitespace-nowrap text-white transition-opacity duration-150",
              committed ? "opacity-100" : "opacity-0",
            )}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path
                d="M2.5 6.4 4.7 8.6 9.5 3.5"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {confirmLabel}
          </span>
        </span>
      </button>
      <span id={hintId} className="sr-only">
        Press and hold for {seconds} seconds to confirm. Releasing early cancels
        and nothing happens.
      </span>
      <span role="status" aria-live="polite" className="sr-only">
        {committed ? confirmLabel : ""}
      </span>
    </>
  );
}
