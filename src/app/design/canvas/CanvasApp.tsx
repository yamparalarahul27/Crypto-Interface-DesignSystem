"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { CANVAS_ITEMS } from "./items";
import { ThemeToggle } from "../ThemeToggle";
import { ThemeStudio } from "./ThemeStudio";
import { LayersPanel } from "./LayersPanel";
import { Inspector } from "./Inspector";
import { DEMOS } from "./demos";
import { CanvasSearch } from "./CanvasSearch";
import { defaultDemoState } from "./demoStates";

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
  const [layersOpen, setLayersOpen] = useState(true);
  const [studioOpen, setStudioOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [animating, setAnimating] = useState(false);
  const itemEls = useRef(new Map<string, HTMLDivElement>());
  const hydrated = useRef(false);

  // Wheel: plain scroll pans; ctrl/cmd+wheel (and trackpad pinch) zooms.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.ctrlKey || e.metaKey) {
        const rect = el.getBoundingClientRect();
        const cx = e.clientX - rect.left;
        const cy = e.clientY - rect.top;
        const factor = Math.exp(-e.deltaY * 0.01);
        setView((v) => {
          const s = clampS(v.s * factor);
          const k = s / v.s;
          return { s, x: cx - (cx - v.x) * k, y: cy - (cy - v.y) * k };
        });
      } else {
        setView((v) => ({ ...v, x: v.x - e.deltaX, y: v.y - e.deltaY }));
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // ⌘K / Ctrl+K — open search (ignore when typing in inputs outside).
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
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const panelW = layersOpen ? 260 : 0;
    const availW = rect.width - panelW - 80;
    const availH = rect.height - 140;
    const s = clampS(Math.min(availW / w, availH / h, 1.25) * 0.9);
    setAnimating(true);
    setView({
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
    setView((v) => ({ ...v, x: v.x + dx, y: v.y + dy }));
  };
  const onPointerUp = () => {
    drag.current = null;
    setPanning(false);
  };

  const zoomBy = (factor: number) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    const cx = (rect?.width ?? 0) / 2;
    const cy = (rect?.height ?? 0) / 2;
    setView((v) => {
      const s = clampS(v.s * factor);
      const k = s / v.s;
      return { s, x: cx - (cx - v.x) * k, y: cy - (cy - v.y) * k };
    });
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
        className="absolute left-0 top-0"
        style={{
          transform: `translate(${view.x}px, ${view.y}px) scale(${view.s})`,
          transformOrigin: "0 0",
          transition: animating ? "transform 240ms cubic-bezier(0.2, 0.8, 0.2, 1)" : "none",
        }}
      >
        {CANVAS_ITEMS.map((item) => {
          if (item.kind === "label") {
            return (
              <div
                key={item.id}
                className="absolute whitespace-nowrap font-mono text-[13px] font-semibold uppercase tracking-[0.14em] text-fg-subtle"
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
                ref={(el) => {
                  if (el) itemEls.current.set(item.id, el);
                }}
                onClick={() => selectFrame(item.id)}
                className={cn("absolute", selected === item.id && "outline outline-1 outline-brand")}
                style={{ left: item.x, top: item.y }}
              >
                <div className={cn("mb-1.5 font-mono text-[11px]", selected === item.id ? "text-brand" : "text-fg-subtle")}>{item.title}</div>
                <iframe
                  src={item.src}
                  title={item.title}
                  width={item.w}
                  height={item.h}
                  className="pointer-events-none rounded-sm border border-outline-variant bg-surface-page"
                />
              </div>
            );
          }
          const Demo = DEMOS[item.id];
          return (
            <div
              key={item.id}
              ref={(el) => {
                if (el) itemEls.current.set(item.id, el);
              }}
              onClick={() => selectFrame(item.id)}
              className={cn("absolute", selected === item.id && "outline outline-1 outline-brand")}
              style={{ left: item.x, top: item.y, width: item.w }}
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
          <span
            className="text-sm font-semibold text-fg"
            style={{ fontFamily: "var(--font-geist-mono), monospace" }}
          >
            cids <span className="text-brand">~</span>{" "}
            <span className="text-fg-subtle">canvas</span>
          </span>
          <Link href="/design" className="font-mono text-xs text-fg-muted underline-offset-2 hover:underline">
            gallery
          </Link>
          <ThemeToggle />
        </div>
        <div className="pointer-events-auto flex items-center gap-1 rounded-sm border border-outline bg-surface-page/95 p-1">
          <HudButton
            label="search"
            onClick={() => {
              setSearchOpen(true);
              setStudioOpen(false);
            }}
            wide
          />
          <HudButton label="−" onClick={() => zoomBy(1 / 1.25)} />
          <span className="w-12 text-center font-mono text-[11px] text-fg-muted">
            {Math.round(view.s * 100)}%
          </span>
          <HudButton label="+" onClick={() => zoomBy(1.25)} />
          <HudButton label="fit" onClick={() => setView(INITIAL)} wide />
          <HudButton label="layers" onClick={() => { setLayersOpen((v) => !v); setStudioOpen(false); }} wide />
          <HudButton label="studio" onClick={() => { setStudioOpen((v) => !v); setLayersOpen(false); }} wide />
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
          canvas is desktop-first for now — drag to pan · use + / −
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
