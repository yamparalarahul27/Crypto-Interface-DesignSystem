"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { IconArrowRight, IconCaretDown, IconCheck, IconExternal } from "@/design-system/icons";
import { CoinDrawing } from "./CoinDrawing";
import { anatomyLayers, type AnatomyAsset } from "./usdt";
import styles from "./anatomy.module.css";

const filters = [
  { id: "all", label: "All pieces" },
  { id: "on-chain", label: "On-chain" },
  { id: "off-chain", label: "Off-chain" },
  { id: "market", label: "Market" },
];
const scopeLabel = { "on-chain": "On-chain", "off-chain": "Off-chain", market: "Market", both: "On + off-chain" };

export function AssetAnatomy({ asset }: { asset: AnatomyAsset }) {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [filter, setFilter] = useState("all");
  const [shareStatus, setShareStatus] = useState("");
  const sections = useRef<(HTMLElement | null)[]>([]);
  const shareTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const chapter = asset.chapters[active];

  useEffect(() => {
    let frame = 0;
    const update = () => {
      const focus = window.innerHeight * (window.innerWidth <= 760 ? .72 : .5);
      let nearest = 0;
      let distance = Infinity;
      sections.current.forEach((section, i) => {
        if (!section) return;
        const rect = section.getBoundingClientRect();
        const nextDistance = Math.abs(rect.top + rect.height / 2 - focus);
        if (nextDistance < distance) { nearest = i; distance = nextDistance; }
      });
      setActive(nearest);
      const first = sections.current[0];
      if (first) {
        const rect = first.getBoundingClientRect();
        setProgress(window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? (nearest === 0 ? 0 : 1)
          : Math.max(0, Math.min(1, -rect.top / rect.height)));
      }
      frame = 0;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
      if (shareTimer.current) clearTimeout(shareTimer.current);
    };
  }, []);

  function jump(index: number) {
    const section = sections.current[index];
    if (!section) return;
    // On phones the illustration sits above the reading area.
    const offset = window.innerWidth <= 760 ? Math.min(window.innerHeight * .38, 310) + 76 : 68;
    const top = section.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    window.history.replaceState(null, "", `#${asset.chapters[index].id}`);
    section.focus({ preventScroll: true });
  }

  async function share() {
    const url = new URL(window.location.href);
    url.hash = chapter.id;
    try {
      await navigator.clipboard.writeText(url.toString());
      setShareStatus("Chapter link copied");
    } catch {
      setShareStatus("Copy this page’s address to share");
    }
    if (shareTimer.current) clearTimeout(shareTimer.current);
    shareTimer.current = setTimeout(() => setShareStatus(""), 3500);
  }

  return (
    <main className={styles.anatomy}>
      <a className={styles.skipLink} href="#anatomy-story">Skip to the story</a>
      <header className={styles.header}>
        <Link className={styles.brand} href="/" aria-label="CIDS home"><span className={styles.brandMark}>cids<span>~</span></span><span className={styles.brandCaption}>Field notes</span></Link>
        <a className={styles.assetMark} href="https://tether.to/" target="_blank" rel="noreferrer" aria-label="About Tether (opens in a new tab)"><span className={styles.handSmall}>inside</span><Image className={styles.tetherLogo} src="/brands/tether/tether-logo.svg" alt="Tether" width={124} height={27} unoptimized /></a>
        <nav className={styles.chapterNav} aria-label="Story chapters">
          <span className={styles.counter} aria-live="polite">{active + 1}<span> / {asset.chapters.length}</span></span>
          <div className={styles.dots}>{asset.chapters.map((c, i) => <button key={c.id} className={styles.dot} data-active={i === active} aria-label={`${i + 1}. ${c.title}`} aria-current={i === active ? "step" : undefined} title={c.title} onClick={() => jump(i)}><span /></button>)}</div>
          <label className={styles.mobileChapter}><span className={styles.srOnly}>Jump to chapter</span><select value={active} onChange={e => jump(Number(e.target.value))}>{asset.chapters.map((c, i) => <option value={i} key={c.id}>{i + 1}. {c.title}</option>)}</select><IconCaretDown size={16} aria-hidden="true" /></label>
        </nav>
      </header>

      <div className={styles.layout}>
        <aside className={styles.visual} aria-label="Interactive asset illustration">
          <div className={styles.visualTop}><span>{asset.symbol}</span><span>A closer look</span></div>
          <CoinDrawing progress={progress} activeLayers={chapter.layers} filter={active === asset.chapters.length - 1 ? filter : "all"} freeze={chapter.id === "controls"} />
          <div className={styles.visualBottom}><span>{progress < .1 ? "Every coin has a story." : chapter.id === "pieces" ? "Six layers. One token." : "Follow the highlighted layer."}</span><span className={styles.sketchArrow} aria-hidden="true">↙</span></div>
        </aside>

        <div className={styles.story} id="anatomy-story">
          {asset.chapters.map((c, i) => (
            <section className={styles.chapter} key={c.id} id={c.id} ref={el => { sections.current[i] = el; }} tabIndex={-1} aria-labelledby={`${c.id}-title`}>
              <div className={styles.chapterContent}>
                {c.scope && <span className={styles.scope} data-scope={c.scope}>{scopeLabel[c.scope]}</span>}
                {i === 0 ? <h1 id={`${c.id}-title`} className={styles.title}>Anatomy{" "}<br />of a <span className={styles.titleAsset}><Image src="/brands/tether/usdt.svg" alt="" width={48} height={48} unoptimized />{asset.symbol}</span></h1> : <h2 id={`${c.id}-title`} className={styles.title}>{c.title}</h2>}
                <p className={styles.description}>{c.description}</p>
                {i === 0 && <button className={styles.scrollPrompt} onClick={() => jump(1)}><span aria-hidden="true">↓</span> Let’s look inside</button>}
                {c.terms?.map(term => <details className={styles.term} key={term.title}><summary><span className={styles.infoIcon} aria-hidden="true">i</span>{term.title}<IconCaretDown size={16} aria-hidden="true" /></summary><p>{term.description}</p></details>)}
                {c.source && <a className={styles.source} href={c.source.href} target="_blank" rel="noreferrer">{c.source.label}<IconExternal size={13} aria-hidden="true" /><span className={styles.srOnly}> (opens in a new tab)</span></a>}
                {i === asset.chapters.length - 1 && <>
                  <div className={styles.filters} role="group" aria-label="Highlight layers by location">{filters.map(f => <button key={f.id} aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>{f.label}</button>)}</div>
                  <ul className={styles.layerKey}>{anatomyLayers.filter(l => filter === "all" || l.scope === filter).map(l => <li key={l.id}><span aria-hidden="true" />{l.label}<small>{scopeLabel[l.scope]}</small></li>)}</ul>
                  <div className={styles.endActions}><button onClick={() => jump(0)}>Read again <span aria-hidden="true">↺</span></button><button onClick={share}>{shareStatus === "Chapter link copied" ? <><IconCheck size={16} aria-hidden="true" /> Copied</> : "Share this story"}</button></div>
                  <p className={styles.disclaimer}>An educational demo by CIDS. Not affiliated with Tether.</p>
                  <p className={styles.credit}>Interaction study inspired by <a href="https://gaplab.me/stablecoin/usdt" target="_blank" rel="noreferrer">Gap’s Anatomy of a USDT <IconExternal size={12} aria-hidden="true" /></a>. Original illustrations and explanations.</p>
                </>}
                {i > 0 && i < asset.chapters.length - 1 && <button className={styles.nextChapter} onClick={() => jump(i + 1)}>Next: {asset.chapters[i + 1].title}<IconArrowRight size={16} aria-hidden="true" /></button>}
              </div>
              <div className={styles.chapterFoot}><span>{String(i + 1).padStart(2, "0")} / {asset.chapters.length}</span><span>{i === 0 ? "A visual guide to what you hold" : i === asset.chapters.length - 1 ? "The whole picture" : "Keep going, there’s another layer"}</span></div>
            </section>
          ))}
        </div>
      </div>
      <div className={styles.shareStatus} role="status">{shareStatus}</div>
    </main>
  );
}
