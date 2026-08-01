"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import { Button } from "../Button";

export type WizardDirection = 1 | -1;

export type WizardStep = {
  id: string;
  label: string;
  content: ReactNode;
};

function clampIndex(value: number, total: number) {
  if (total < 1) return 0;
  return Math.max(0, Math.min(total - 1, Math.trunc(value)));
}

function useWizard({
  total,
  index,
  defaultIndex = 0,
  onIndexChange,
  onComplete,
}: {
  total: number;
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number, direction: WizardDirection) => void;
  onComplete?: () => void;
}) {
  const [internal, setInternal] = useState(() => clampIndex(defaultIndex, total));
  const current = clampIndex(index ?? internal, total);
  const [direction, setDirection] = useState<WizardDirection>(1);
  const [furthest, setFurthest] = useState(current);
  const prev = useRef(current);
  const controlled = index !== undefined;
  const emit = useRef(onIndexChange);
  const finish = useRef(onComplete);

  useEffect(() => {
    emit.current = onIndexChange;
    finish.current = onComplete;
  });

  useEffect(() => {
    if (prev.current !== current) {
      setDirection(current > prev.current ? 1 : -1);
      prev.current = current;
    }
    setFurthest((f) => Math.max(f, current));
  }, [current]);

  const goTo = useCallback(
    (to: number) => {
      const target = clampIndex(to, total);
      if (target === current) return;
      const dir: WizardDirection = target > current ? 1 : -1;
      setDirection(dir);
      if (!controlled) setInternal(target);
      emit.current?.(target, dir);
    },
    [controlled, current, total],
  );

  const next = useCallback(() => {
    if (current >= total - 1) {
      finish.current?.();
      return;
    }
    goTo(current + 1);
  }, [current, goTo, total]);

  const back = useCallback(() => goTo(current - 1), [current, goTo]);

  return {
    index: current,
    direction,
    furthest: Math.min(furthest, Math.max(total - 1, 0)),
    total,
    isFirst: current === 0,
    isLast: current === total - 1,
    next,
    back,
    goTo,
  };
}

export type WizardStepsProps = {
  steps: WizardStep[];
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number, direction: WizardDirection) => void;
  onComplete?: () => void;
  height?: number;
  backLabel?: string;
  nextLabel?: string;
  finishLabel?: string;
  label?: string;
  className?: string;
};

/**
 * Multi-step flow rail + fixed-height panel for send / onboarding.
 * Visited steps are jumpable; future steps are inert. No `motion`.
 */
export function WizardSteps({
  steps,
  index,
  defaultIndex = 0,
  onIndexChange,
  onComplete,
  height = 184,
  backLabel = "Back",
  nextLabel = "Next",
  finishLabel = "Finish",
  label = "Steps",
  className,
}: WizardStepsProps) {
  const {
    index: at,
    furthest,
    total,
    isFirst,
    isLast,
    next,
    back,
    goTo,
  } = useWizard({
    total: steps.length,
    index,
    defaultIndex,
    onIndexChange,
    onComplete,
  });

  const step = steps[at];
  if (!step) return null;

  const position = `Step ${at + 1} of ${total}: ${step.label}`;

  const onStepKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    let target = at;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") target = at + 1;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") target = at - 1;
    else if (e.key === "Home") target = 0;
    else if (e.key === "End") target = furthest;
    else return;
    e.preventDefault();
    target = Math.min(clampIndex(target, total), furthest);
    if (target !== at) goTo(target);
  };

  return (
    <div className={cn("w-full", className)}>
      <p aria-live="polite" className="sr-only">
        {position}
      </p>
      <p className="mb-2 truncate text-sm font-medium text-fg">{step.label}</p>
      <ol aria-label={label} className="mb-4 flex list-none items-center gap-1 p-0">
        {steps.map((s, i) => {
          const done = i < at;
          const here = i === at;
          const tile = (
            <span
              aria-hidden
              className={cn(
                "grid size-7 place-items-center rounded-control border text-[11px] font-medium tabular-nums transition-[background-color,color,border-color,transform] duration-150",
                done
                  ? "border-brand bg-brand text-on-brand"
                  : here
                    ? "scale-100 border-outline-variant bg-surface-container text-fg"
                    : "scale-[0.92] border-outline-variant bg-surface-container text-fg-subtle",
              )}
            >
              {done ? "✓" : i + 1}
            </span>
          );

          return (
            <li key={s.id} className="flex flex-1 items-center gap-1 last:flex-none">
              {i <= furthest ? (
                <button
                  type="button"
                  tabIndex={here ? 0 : -1}
                  aria-current={here ? "step" : undefined}
                  aria-label={`Step ${i + 1} of ${total}: ${s.label}`}
                  onKeyDown={onStepKeyDown}
                  onClick={() => {
                    if (!here) goTo(i);
                  }}
                  className="rounded-control outline-none"
                >
                  {tile}
                </button>
              ) : (
                <span>
                  <span className="sr-only">{`Step ${i + 1} of ${total}: ${s.label}`}</span>
                  {tile}
                </span>
              )}
              {i < total - 1 ? (
                <span
                  aria-hidden
                  className="relative h-0.5 flex-1 overflow-hidden rounded-full bg-surface-bright"
                >
                  <span
                    className={cn(
                      "absolute inset-0 origin-left rounded-full bg-brand transition-transform duration-150",
                      done ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>

      <div
        role="group"
        aria-label={position}
        style={{ height }}
        className="relative overflow-hidden rounded-card border border-outline-variant bg-surface-container"
      >
        <div className="absolute inset-0 overflow-y-auto p-4 text-sm text-fg">
          {step.content}
        </div>
      </div>

      <div className="mt-3 flex h-9 items-center gap-3">
        {!isFirst && (
          <Button type="button" variant="secondary" size="md" onClick={back}>
            {backLabel}
          </Button>
        )}
        <Button
          type="button"
          variant="primary"
          size="md"
          className="ml-auto min-w-[5.5rem]"
          aria-label={isLast ? finishLabel : nextLabel}
          onClick={next}
        >
          {/* Width-stable Next / Finish swap */}
          <span className="relative inline-grid place-items-center">
            <span className="invisible col-start-1 row-start-1">
              {finishLabel.length > nextLabel.length ? finishLabel : nextLabel}
            </span>
            <span
              className={cn(
                "col-start-1 row-start-1 transition-opacity duration-150",
                isLast ? "opacity-0" : "opacity-100",
              )}
            >
              {nextLabel}
            </span>
            <span
              className={cn(
                "col-start-1 row-start-1 transition-opacity duration-150",
                isLast ? "opacity-100" : "opacity-0",
              )}
            >
              {finishLabel}
            </span>
          </span>
        </Button>
      </div>
    </div>
  );
}
