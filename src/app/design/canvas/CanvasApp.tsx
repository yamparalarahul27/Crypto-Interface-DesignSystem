"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import { CANVAS_ITEMS } from "./items";
import { ThemeToggle } from "../ThemeToggle";
import { ThemeStudio } from "./ThemeStudio";
import { LayersPanel } from "./LayersPanel";
import { Inspector } from "./Inspector";
import { DEMOS } from "./demos";
import { CanvasSearch } from "./CanvasSearch";
import { defaultDemoState } from "./demoStates";
import {
  getServerCidsTheme,
  getStoredCidsTheme,
  subscribeCidsTheme,
  withThemeParam,
} from "../theme";
import { IconArrowLeft } from "@/design-system";

type View = { x: number; y: number; s: number };

const MIN_S = 0.1;
const MAX_S = 2.5;
const INITIAL: View = { x: 40, y: 40, s: 0.55 };

const clampS = (s: number) => Math.min(MAX_S, Math.max(MIN_S, s));

function isCanvasItemId(id: string): boolean {
  return CANVAS_ITEMS.some((i) => i.id === id && i.kind !== "label");
}

export function CanvasApp({
  docs,
  sources,
}: {
  docs: Record<string, string>;
  sources: Record<string, string>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [view, setView] = useState<View>(INITIAL);
  const wrapRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ px: number; py: number } | null>(null);
  const [panning, setPanning] = useState(false);

  const [selected, setSelected] = useState<string | null>(null);
  const [demoState, setDemoState] = useState<string | undefined>();
  const theme = useSyncExternalStore(
    subscribeCidsTheme,
    getStoredCidsTheme,
    getServerCidsTheme,
  );
  const [layersOpen, setLayersOpen] = useState(true);
  const [studioOpen, setStudioOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [animating, setAnimating] = useState(false);
  const itemEls = useRef(new Map<string, HTMLDivElement>());
  const hydrated = useRef(false);

  // ── View transform: painted on the DOM, not rendered by React ──────
  // Pan/zoom used to live in `view` state, so every pointermove (60–120/s)
  // reconciled all ~100 frames and their live demos. Now `viewRef` is the
  // live truth and `paint()` writes straight to the stage node; state is
  // committed once per gesture, for the things that genuinely need a
  // render (permalinks, fit, zoom-to-item).
  //
  // The transform is deliberately absent from the stage's JSX style: React
  // only touches style keys it declares, so an unrelated re-render mid-drag
  // (selecting a frame, opening a panel) can't slam the canvas back to the
  // last committed view.
  const stageRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<View>(INITIAL);
  const zoomLabelRef = useRef<HTMLSpanElement>(null);
  const commitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const paint = useCallback((v: View) => {
    const el = stageRef.current;
    if (el) el.style.transform = `translate(${v.x}px, ${v.y}px) scale(${v.s})`;
    const z = zoomLabelRef.current;
    if (z) z.textContent = `${Math.round(v.s * 100)}%`;
  }, []);

  /** Move the canvas without telling React (pointer + wheel path). */
  const paintView = useCallback(
    (next: View) => {
      viewRef.current = next;
      paint(next);
    },
    [paint],
  );

  /** Commit the painted view to state: one render, at rest. */
  const commitView = useCallback((next: View) => {
    viewRef.current = next;
    setView(next);
  }, []);

  /** Wheel has no "end" event; settle shortly after the last tick. */
  const scheduleCommit = useCallback(() => {
    if (commitTimer.current) clearTimeout(commitTimer.current);
    commitTimer.current = setTimeout(() => setView(viewRef.current), 140);
  }, []);

  useEffect(
    () => () => {
      if (commitTimer.current) clearTimeout(commitTimer.current);
    },
    [],
  );

  // State → DOM. Runs before paint, so committed changes (fit, zoom-to-item)
  // land in the same frame.
  useLayoutEffect(() => {
    viewRef.current = view;
    paint(view);
  }, [view, paint]);

  // Wheel: plain scroll pans; ctrl/cmd+wheel (and trackpad pinch) zooms.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const v = viewRef.current;
      if (e.ctrlKey || e.metaKey) {
        const rect = el.getBoundingClientRect();
        const cx = e.clientX - rect.left;
        const cy = e.clientY - rect.top;
        const factor = Math.exp(-e.deltaY * 0.01);
        const s = clampS(v.s * factor);
        const k = s / v.s;
        paintView({ s, x: cx - (cx - v.x) * k, y: cy - (cy - v.y) * k });
      } else {
        paintView({ ...v, x: v.x - e.deltaX, y: v.y - e.deltaY });
      }
      scheduleCommit();
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [paintView, scheduleCommit]);

  // Dev-only overlap guard. Frame heights only exist once rendered, so no
  // static test can catch a collision: items.ts places rows at hand-picked
  // pitches and a demo that grows past its pitch silently lands under the
  // next row. This measures the real boxes after mount and names the
  // offenders. content-visibility is forced off for the measurement,
  // otherwise off-screen frames report their guessed intrinsic size.
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    const stage = stageRef.current;
    if (!stage) return;
    const t = setTimeout(() => {
      const kids = [...stage.children] as HTMLElement[];
      const prev = kids.map((k) => {
        const p = k.style.contentVisibility;
        k.style.contentVisibility = "visible";
        return p;
      });
      const boxes = kids.map((k) => ({
        id: k.dataset.itemId ?? k.textContent?.slice(0, 20) ?? "?",
        x: k.offsetLeft,
        y: k.offsetTop,
        w: k.offsetWidth,
        h: k.offsetHeight,
      }));
      kids.forEach((k, i) => (k.style.contentVisibility = prev[i]));

      const hits: string[] = [];
      for (let a = 0; a < boxes.length; a++) {
        for (let b = a + 1; b < boxes.length; b++) {
          const A = boxes[a];
          const B = boxes[b];
          const ox = Math.min(A.x + A.w, B.x + B.w) - Math.max(A.x, B.x);
          const oy = Math.min(A.y + A.h, B.y + B.h) - Math.max(A.y, B.y);
          if (ox > 2 && oy > 2) {
            hits.push(`${A.id} ↔ ${B.id} (${Math.round(ox)}×${Math.round(oy)}px)`);
          }
        }
      }
      if (hits.length) {
        console.warn(
          `[canvas] ${hits.length} overlapping frame(s); adjust items.ts:\n  ${hits.join("\n  ")}`,
        );
      }
    }, 600); // let demos settle (charts, fonts) before measuring
    return () => clearTimeout(t);
  }, []);

  // ⌘K / Ctrl+K: open search (ignore when typing in inputs outside).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
        setStudioOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const writePermalink = (id: string | null) => {
    const url = new URL(window.location.href);
    if (id) url.searchParams.set("item", id);
    else url.searchParams.delete("item");
    router.replace(`${url.pathname}${url.search}`, { scroll: false });
  };

  const zoomToItem = (id: string, syncUrl = true) => {
    setSelected(id);
    setDemoState(defaultDemoState(id));
    if (syncUrl) writePermalink(id);
    const def = CANVAS_ITEMS.find((i) => i.id === id);
    const el = itemEls.current.get(id);
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!def || def.kind === "label" || !el || !rect) return;
    // content-visibility:auto means an off-screen frame reports its
    // *guessed* intrinsic size, not its real one: which would mis-scale
    // every ?item= permalink (the target is off-screen by definition).
    // Force this one subtree to lay out, measure, then hand it back.
    const cv = el.style.contentVisibility;
    el.style.contentVisibility = "visible";
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    el.style.contentVisibility = cv;
    const panelW = layersOpen ? 260 : 0;
    const availW = rect.width - panelW - 80;
    const availH = rect.height - 140;
    const s = clampS(Math.min(availW / w, availH / h, 1.25) * 0.9);
    setAnimating(true);
    commitView({
      s,
      x: panelW + 40 + (availW - w * s) / 2 - def.x * s,
      y: 100 + (availH - h * s) / 2 - def.y * s,
    });
    setTimeout(() => setAnimating(false), 260);
  };

  // Hydrate selection from ?item= once frames have mounted.
  useEffect(() => {
    if (hydrated.current) return;
    const item = searchParams.get("item");
    if (!item || !isCanvasItemId(item)) {
      hydrated.current = true;
      return;
    }
    // Wait a frame so itemEls refs are populated.
    const t = requestAnimationFrame(() => {
      zoomToItem(item, false);
      hydrated.current = true;
    });
    return () => cancelAnimationFrame(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- one-shot hydrate from URL
  }, [searchParams]);

  const clearSelection = () => {
    setSelected(null);
    setDemoState(undefined);
    writePermalink(null);
  };

  const selectFrame = (id: string) => {
    setSelected(id);
    setDemoState(defaultDemoState(id));
    writePermalink(id);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    const t = e.target as HTMLElement;
    if (t.closest("button, a, input, textarea, select, [role='dialog']")) return;
    drag.current = { px: e.clientX, py: e.clientY };
    setPanning(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.px;
    const dy = e.clientY - drag.current.py;
    drag.current = { px: e.clientX, py: e.clientY };
    const v = viewRef.current;
    paintView({ ...v, x: v.x + dx, y: v.y + dy });
  };
  const onPointerUp = () => {
    if (drag.current) setView(viewRef.current); // one render per gesture
    drag.current = null;
    setPanning(false);
  };

  const zoomBy = (factor: number) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    const cx = (rect?.width ?? 0) / 2;
    const cy = (rect?.height ?? 0) / 2;
    const v = viewRef.current;
    const s = clampS(v.s * factor);
    const k = s / v.s;
    commitView({ s, x: cx - (cx - v.x) * k, y: cy - (cy - v.y) * k });
  };

  return (
    <div
      ref={wrapRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      className="fixed inset-0 touch-none select-none overflow-hidden bg-surface-dim font-sans"
      style={{
        cursor: panning ? "grabbing" : "grab",
        backgroundImage:
          "radial-gradient(var(--outline-variant) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      <div
        ref={stageRef}
        className="absolute left-0 top-0"
        // No `transform` here on purpose: paint() owns it. See the view
        // transform note above.
        style={{
          transformOrigin: "0 0",
          transition: animating ? "transform 240ms cubic-bezier(0.2, 0.8, 0.2, 1)" : "none",
        }}
      >
        {CANVAS_ITEMS.map((item) => {
          if (item.kind === "label") {
            return (
              <div
                key={item.id}
                data-item-id={item.id}
                className="absolute whitespace-nowrap font-mono text-[13px] font-semibold text-fg-subtle"
                style={{ left: item.x, top: item.y }}
              >
                {item.title}
              </div>
            );
          }
          if (item.kind === "iframe") {
            return (
              <div
                key={item.id}
                data-item-id={item.id}
                ref={(el) => {
                  if (el) itemEls.current.set(item.id, el);
                }}
                onClick={() => selectFrame(item.id)}
                className={cn("absolute", selected === item.id && "outline outline-1 outline-brand")}
                style={{
                  left: item.x,
                  top: item.y,
                  // Off-screen frames skip layout + paint entirely. Safe to
                  // guess a size here: frames are absolutely positioned, so
                  // an inexact intrinsic size moves nothing else.
                  contentVisibility: "auto",
                  containIntrinsicSize: `${item.w}px ${item.h}px`,
                }}
              >
                <div className={cn("mb-1.5 font-mono text-[11px]", selected === item.id ? "text-brand" : "text-fg-subtle")}>{item.title}</div>
                <iframe
                  src={withThemeParam(item.src, theme)}
                  title={item.title}
                  width={item.w}
                  height={item.h}
                  loading="lazy"
                  className="pointer-events-none rounded-sm border border-outline-variant bg-surface-page"
                />
              </div>
            );
          }
          const Demo = DEMOS[item.id];
          return (
            <div
              key={item.id}
              data-item-id={item.id}
              ref={(el) => {
                if (el) itemEls.current.set(item.id, el);
              }}
              onClick={() => selectFrame(item.id)}
              className={cn("absolute", selected === item.id && "outline outline-1 outline-brand")}
              style={{
                left: item.x,
                top: item.y,
                width: item.w,
                contentVisibility: "auto",
                containIntrinsicSize: `${item.w}px 260px`,
              }}
            >
              <div className={cn("mb-1.5 font-mono text-[11px]", selected === item.id ? "text-brand" : "text-fg-subtle")}>{item.title}</div>
              <div className="rounded-sm border border-outline-variant bg-surface-page p-4">
                {Demo ? (
                  <Demo state={selected === item.id ? demoState : undefined} />
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 z-[var(--z-raised)] flex items-center justify-between px-4 py-3">
        <div className="pointer-events-auto flex items-center gap-3 rounded-sm border border-outline bg-surface-page/95 px-3 py-2">
          {/* Exit hatch. A real link to `/` rather than history.back():
              the canvas is reachable by permalink, where there's no prior
              page to go back to. */}
          <Link
            href="/"
            aria-label="Exit canvas"
            className="-ml-1 inline-flex h-8 items-center gap-1.5 rounded-control px-2 font-mono text-xs text-fg-muted hover:bg-surface-container hover:text-fg"
            style={{
              transition:
                "background-color var(--motion-fast), color var(--motion-fast)",
            }}
          >
            <IconArrowLeft size={13} weight="bold" aria-hidden="true" /> back
          </Link>
          <span className="h-5 w-px bg-outline-variant" aria-hidden="true" />
          <span
            className="text-sm font-semibold text-fg"
            style={{ fontFamily: "var(--font-geist-mono), monospace" }}
          >
            cids <span className="text-brand">~</span>{" "}
            <span className="text-fg-subtle">canvas</span>
          </span>
          <span
            className="rounded-chip bg-warning-surface px-1.5 py-0.5 font-mono text-[10px] font-medium text-warning"
            title="Gestures are still being worked on"
          >
            Beta
          </span>
          <Link href="/design" className="font-mono text-xs text-fg-muted underline-offset-2 hover:underline">
            Gallery
          </Link>
          <ThemeToggle />
        </div>
        <div className="pointer-events-auto flex items-center gap-1 rounded-sm border border-outline bg-surface-page/95 p-1">
          <HudButton
            label="Search"
            onClick={() => {
              setSearchOpen(true);
              setStudioOpen(false);
            }}
            wide
          />
          <HudButton label="−" onClick={() => zoomBy(1 / 1.25)} />
          {/* Filled by paint(), so the readout stays live during a pinch
              without a render. Empty in JSX so React never overwrites it. */}
          <span
            ref={zoomLabelRef}
            className="w-12 text-center font-mono text-[11px] text-fg-muted"
          />
          <HudButton label="+" onClick={() => zoomBy(1.25)} />
          <HudButton label="Fit" onClick={() => commitView(INITIAL)} wide />
          <HudButton label="Layers" onClick={() => { setLayersOpen((v) => !v); setStudioOpen(false); }} wide />
          <HudButton label="Studio" onClick={() => { setStudioOpen((v) => !v); setLayersOpen(false); }} wide />
        </div>
      </div>

      {layersOpen && (
        <div className="pointer-events-none absolute left-4 top-16 z-[var(--z-raised)]">
          <LayersPanel selected={selected} onSelect={(id) => zoomToItem(id)} />
        </div>
      )}

      {studioOpen && (
        <div className="pointer-events-none absolute left-4 top-16 z-[var(--z-raised)]">
          <ThemeStudio onClose={() => setStudioOpen(false)} />
        </div>
      )}

      {selected && (
        <div className="pointer-events-none absolute right-4 top-16 z-[var(--z-raised)]">
          <Inspector
            key={selected}
            selected={selected}
            docs={docs}
            sources={sources}
            demoState={demoState}
            onDemoStateChange={setDemoState}
            onClose={clearSelection}
          />
        </div>
      )}

      {searchOpen ? (
        <CanvasSearch
          open
          onOpenChange={setSearchOpen}
          onSelect={(id) => zoomToItem(id)}
        />
      ) : null}

      <div className="pointer-events-none absolute bottom-3 left-1/2 z-[var(--z-raised)] -translate-x-1/2 rounded-sm border border-outline bg-surface-page/95 px-3 py-1.5 font-mono text-[11px] text-fg-muted">
        <span className="[@media(pointer:coarse)]:hidden">
          drag to pan · ⌘K search · share <span className="text-fg-subtle">?item=</span>
        </span>
        <span className="hidden [@media(pointer:coarse)]:inline">
          canvas is desktop-first for now: drag to pan · use + / −
        </span>
      </div>
    </div>
  );
}

function HudButton({
  label,
  onClick,
  wide,
}: {
  label: string;
  onClick: () => void;
  wide?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-8 items-center justify-center rounded-sm font-mono text-xs text-fg-muted transition-colors hover:bg-surface-container-high hover:text-fg",
        wide ? "px-3" : "w-8",
      )}
    >
      {label}
    </button>
  );
}
