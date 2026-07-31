"use client";

import { useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { cn } from "@/lib/utils";

const DEFAULT_STOPS = [0, 25, 50, 75, 100] as const;

function clampPct(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, Math.round(value)));
}

function buildSubStops(stops: readonly number[]): number[] {
  const out: number[] = [];
  for (let i = 0; i < stops.length - 1; i++) {
    const start = stops[i];
    const end = stops[i + 1];
    const step = (end - start) / 4;
    out.push(start + step, start + step * 2, start + step * 3);
  }
  return out;
}

export function SizeSlider({
  value,
  onValueChange,
  stops = DEFAULT_STOPS,
  label = "Size as percent of balance",
  disabled = false,
  showSubTicks = true,
  className,
}: {
  /** 0-100, rounded to whole percent. */
  value: number;
  onValueChange: (value: number) => void;
  stops?: readonly number[];
  label?: string;
  disabled?: boolean;
  showSubTicks?: boolean;
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const [dragging, setDragging] = useState(false);
  const actual = clampPct(value);
  const subStops = useMemo(() => buildSubStops(stops), [stops]);

  const emit = (next: number) => {
    if (disabled) return;
    onValueChange(clampPct(next));
  };

  const updateFromClientX = (clientX: number) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    emit(((clientX - rect.left) / rect.width) * 100);
  };

  const onThumbPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    draggingRef.current = true;
    setDragging(true);
    updateFromClientX(event.clientX);
  };

  const onThumbPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    updateFromClientX(event.clientX);
  };

  const onThumbPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    draggingRef.current = false;
    setDragging(false);
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const onThumbKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    const step = event.shiftKey ? 5 : 1;
    if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault();
      emit(actual - step);
    } else if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      emit(actual + step);
    } else if (event.key === "Home") {
      event.preventDefault();
      emit(0);
    } else if (event.key === "End") {
      event.preventDefault();
      emit(100);
    }
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className={cn("relative min-w-0 flex-1 select-none", disabled && "opacity-45")}>
        <div
          className={cn("py-4", disabled ? "cursor-not-allowed" : "cursor-pointer")}
          onClick={(event) => updateFromClientX(event.clientX)}
        >
          <div ref={trackRef} className="relative h-1.5 rounded-full bg-surface-bright">
            <div
              aria-hidden="true"
              className={cn(
                "absolute inset-y-0 left-0 rounded-full bg-brand",
                !dragging && "transition-[width] duration-150 ease-out",
              )}
              style={{ width: `${actual}%` }}
            />
            <div
              role="slider"
              tabIndex={disabled ? -1 : 0}
              aria-label={label}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={actual}
              aria-valuetext={`${actual}%`}
              aria-disabled={disabled || undefined}
              onPointerDown={onThumbPointerDown}
              onPointerMove={onThumbPointerMove}
              onPointerUp={onThumbPointerUp}
              onPointerCancel={onThumbPointerUp}
              onKeyDown={onThumbKeyDown}
              className={cn(
                "absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-brand bg-fg",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-page",
                dragging ? "cursor-grabbing" : "cursor-grab",
                !dragging && "transition-[left] duration-150 ease-out",
              )}
              style={{ left: `${actual}%` }}
            />
          </div>
        </div>

        <div className="pointer-events-none absolute left-0 right-0 top-[27px] h-2">
          {stops.map((stop) => (
            <span
              key={stop}
              className={cn(
                "absolute top-0 h-2 w-px",
                actual >= stop ? "bg-brand" : "bg-outline-variant",
              )}
              style={{ left: `${stop}%`, transform: "translateX(-50%)" }}
            />
          ))}
        </div>

        {showSubTicks && (
          <div className="pointer-events-none absolute left-0 right-0 top-[28px] h-1">
            {subStops.map((stop) => (
              <span
                key={stop}
                className={cn(
                  "absolute top-0 h-1 w-px",
                  actual >= stop ? "bg-brand" : "bg-outline-variant/60",
                )}
                style={{ left: `${stop}%`, transform: "translateX(-50%)" }}
              />
            ))}
          </div>
        )}

        <div className="absolute -left-1.5 -right-1.5 bottom-0 flex justify-between">
          {stops.map((stop) => {
            const active = actual === stop;
            return (
              <button
                key={stop}
                type="button"
                disabled={disabled}
                onClick={() => emit(stop)}
                className={cn(
                  "rounded-control px-1 font-mono text-[10px] tabular-nums transition-colors duration-150",
                  active ? "font-semibold text-fg" : "text-fg-subtle hover:text-fg",
                  disabled && "cursor-not-allowed hover:text-fg-subtle",
                )}
              >
                {stop}%
              </button>
            );
          })}
        </div>

        <div className="h-5" aria-hidden="true" />
      </div>

      <output
        aria-label="Selected size"
        className="flex h-8 w-14 shrink-0 items-center justify-center rounded-control border border-outline-variant bg-surface-container font-mono text-xs tabular-nums text-fg"
      >
        {actual}%
      </output>
    </div>
  );
}
