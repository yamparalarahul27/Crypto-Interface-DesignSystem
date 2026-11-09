import type { CSSProperties } from "react";
import { anatomyLayers, type LayerId } from "./usdt";
import styles from "./anatomy.module.css";

function Face() {
  return <>
    <circle cx="300" cy="350" r="220" fill="var(--anatomy-paper)" />
    <circle cx="300" cy="350" r="200" fill="var(--anatomy-mint)" />
    <circle cx="300" cy="350" r="200" fill="url(#anatomy-hatch)" opacity=".5" />
    <circle cx="300" cy="350" r="219" fill="none" strokeWidth="2.2" />
    <circle cx="300" cy="350" r="204" fill="none" strokeWidth="1" />
    <circle cx="300" cy="350" r="217" fill="none" strokeWidth="11" strokeDasharray="1 9" opacity=".7" />
    <text fontSize="10.4" letterSpacing="2.9" fill="var(--anatomy-ink)" stroke="none"><textPath href="#anatomy-ring">ONE DOLLAR · USD₮ · ONE TOKEN · ONE DOLLAR · USD₮ · ONE TOKEN · ONE DOLLAR · USD₮ · ONE TOKEN · </textPath></text>
    <g fill="var(--anatomy-ink)" strokeWidth="2.2" transform="translate(5 6)"><path d="M231 280H369V314H318V450H282V314H231Z" /><ellipse cx="300" cy="337" rx="93" ry="18" fill="none" strokeWidth="10" /></g>
    <path d="M231 280H369V314H318V450H282V314H231Z" fill="var(--anatomy-paper)" strokeWidth="2.2" />
    <ellipse cx="300" cy="337" rx="93" ry="18" fill="none" stroke="var(--anatomy-ink)" strokeWidth="9" />
    <ellipse cx="300" cy="335" rx="93" ry="18" fill="none" stroke="var(--anatomy-paper)" strokeWidth="5" />
    <path d="M282 315V345H318V315" fill="var(--anatomy-paper)" stroke="none" />
  </>;
}
function Ledger() {
  return <g strokeWidth="1">
    <path d="M119 290H482M105 328H495M105 366H495M117 404H483M150 442H450M255 240V466" fill="none" opacity=".45" />
    <path d="M111 330H491V366H111Z" fill="var(--anatomy-mint)" stroke="var(--anatomy-green)" strokeWidth="2" />
    <g stroke="none" fill="var(--anatomy-green)" fontFamily="monospace" fontSize="15">
      <text x="153" y="278">address</text><text x="321" y="278">balance</text>
      <text x="124" y="316">0x8a…42f1</text><text x="320" y="316"> 24.000000</text>
      <text x="124" y="355">0x71…c09e</text><text x="320" y="355"> 1.000000</text>
      <text x="132" y="393">0x9b…a7d2</text><text x="320" y="393"> 850.500000</text>
      <text x="158" y="431">0x3f…6e81</text><text x="320" y="431"> 7.000000</text>
    </g>
  </g>;
}
function Contract({ freeze }: { freeze: boolean }) {
  return <g stroke="none" fontFamily="monospace" fontSize="17" fill="var(--anatomy-green)">
    <text x="159" y="279">contract TetherToken {'{'}</text>
    <text x="179" y="317">balances[address]</text>
    <text x="179" y="355">transfer(to, value)</text>
    <text x="179" y="393" fill={freeze ? "var(--anatomy-rust)" : undefined}>isBlackListed[user]</text>
    <text x="179" y="431" fill={freeze ? "var(--anatomy-rust)" : undefined}>destroyBlackFunds()</text>
    <text x="159" y="459">{'}'}</text>
  </g>;
}
function Networks() {
  return <g strokeWidth="1.5">
    <path d="M300 350L204 295M300 350L396 295M300 350V440" fill="none" strokeDasharray="5 5" />
    {[[204, 295, "ETH"], [396, 295, "TRON"], [300, 433, "SOL"]].map(([x, y, text]) => <g key={text}>
      <circle cx={x} cy={y} r="42" fill="var(--anatomy-paper)" />
      <text x={x} y={Number(y) + 6} textAnchor="middle" fontSize="18" stroke="none" fill="var(--anatomy-green)">{text}</text>
    </g>)}
    <circle cx="300" cy="350" r="22" fill="var(--anatomy-mint)" />
    <text x="300" y="358" textAnchor="middle" fontSize="28" stroke="none" fill="var(--anatomy-green)">₮</text>
  </g>;
}
function Reserves() {
  return <>
    <path d="M300 350L300 146A204 204 0 1 1 106 413Z" fill="var(--anatomy-mint)" />
    <path d="M300 350L106 413A204 204 0 0 1 159 202Z" fill="var(--anatomy-sand)" />
    <path d="M300 350L159 202A204 204 0 0 1 300 146Z" fill="url(#anatomy-hatch)" />
    <path d="M300 146V350L106 413M300 350L159 202" fill="none" strokeWidth="1.4" />
    <g stroke="none" fill="var(--anatomy-ink)" fontSize="18"><text x="319" y="365">Cash &amp;</text><text x="319" y="390">equivalents</text><text x="151" y="336">Other</text><text x="151" y="361">assets</text></g>
    <text x="230" y="472" fontSize="12" fill="var(--anatomy-muted)" stroke="none">illustrative, not to scale</text>
  </>;
}
function Issuer() {
  return <g strokeWidth="2" fill="none">
    <path d="M203 312L300 257L397 312ZM217 317H383M220 413H380M203 429H397M236 326V405M278 326V405M322 326V405M364 326V405" />
    <text x="300" y="464" textAnchor="middle" fontSize="19" fill="var(--anatomy-green)" stroke="none">Tether · the issuer</text>
  </g>;
}

export function CoinDrawing({ progress, activeLayers, filter, freeze }: {
  progress: number; activeLayers: LayerId[]; filter: string; freeze: boolean;
}) {
  const spread = Math.min(1, Math.max(0, progress));
  const all = activeLayers.length === anatomyLayers.length;
  return <svg className={styles.drawing} viewBox="0 0 600 730" role="img" aria-labelledby="anatomy-drawing-title anatomy-drawing-desc">
    <title id="anatomy-drawing-title">USDT, taken apart</title>
    <desc id="anatomy-drawing-desc">{spread < .1 ? "An illustrated Tether coin." : `Six separated layers: peg, balances, contract, blockchains, reserves, and issuer. Highlighted: ${anatomyLayers.filter(l => activeLayers.includes(l.id) && (filter === "all" || filter === l.scope)).map(l => l.label).join(", ")}.`}</desc>
    <defs>
      <pattern id="anatomy-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(36)"><path d="M0 0V6" stroke="var(--anatomy-ink)" strokeWidth=".65" /></pattern>
      <pattern id="anatomy-crosshatch" width="7" height="7" patternUnits="userSpaceOnUse"><path d="M0 0L7 7M7 0L0 7" stroke="var(--anatomy-ink)" strokeWidth=".5" /></pattern>
      <path id="anatomy-ring" d="M300 140a210 210 0 1 1-.1 0" />
    </defs>
    <ellipse cx="316" cy={365 + spread * 272} rx={220 - spread * 25} ry={215 - spread * 125} fill="url(#anatomy-crosshatch)" opacity=".23" />
    <g stroke="var(--anatomy-ink)">
      {spread > .05 && <g strokeDasharray="3 6" strokeWidth="1" opacity=".25"><path d="M167 160V610M433 160V610" /></g>}
      {[...anatomyLayers].reverse().map(layer => {
        const i = anatomyLayers.findIndex(l => l.id === layer.id);
        const selected = activeLayers.includes(layer.id);
        const inFilter = filter === "all" || filter === layer.scope;
        const visible = i === 0 ? 1 : spread;
        const opacity = visible * (inFilter && (all || selected || spread < .9) ? 1 : .2);
        const y = 350 + spread * (-175 + i * 89);
        const scale = 1.32 - spread * .46;
        return <g key={layer.id} className={styles.coinLayer} style={{ opacity } as CSSProperties} transform={`translate(300 ${y}) scale(${scale} ${1.32 - spread * .87}) rotate(${-spread * 19}) translate(-300 -350)`}>
          {i !== 0 && <><circle cx="300" cy="358" r="209" fill="var(--anatomy-paper)" strokeWidth="2" /><circle cx="300" cy="350" r="209" fill="var(--anatomy-paper)" strokeWidth={selected ? "2.5" : "1.5"} stroke={selected ? "var(--anatomy-green)" : undefined} /></>}
          {layer.id === "face" && <Face />}
          {layer.id === "ledger" && <Ledger />}
          {layer.id === "contract" && <Contract freeze={freeze} />}
          {layer.id === "networks" && <Networks />}
          {layer.id === "reserves" && <Reserves />}
          {layer.id === "issuer" && <Issuer />}
        </g>;
      })}
    </g>
    {spread > .85 && <g className={styles.drawingLabels} fill="var(--anatomy-green)" stroke="none" fontSize="26">
      {anatomyLayers.map((layer, i) => {
        const right = i % 2 !== 0;
        const selected = activeLayers.includes(layer.id) && (filter === "all" || filter === layer.scope);
        return <g key={layer.id} opacity={selected ? 1 : .3}>
          <path d={right ? `M470 ${175 + i * 89}l37 -24` : `M126 ${175 + i * 89}l-30 -24`} stroke="currentColor" strokeWidth="1" fill="none" />
          <text x={right ? 505 : 93} y={153 + i * 89} textAnchor={right ? "start" : "end"}>{["the peg", "ledger", "contract", "chains", "reserves", "issuer"][i]}</text>
        </g>;
      })}
    </g>}
  </svg>;
}
