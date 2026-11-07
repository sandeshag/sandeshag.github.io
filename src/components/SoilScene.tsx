import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import type { SocialLink } from '../data/site.js'
import styles from './SoilScene.module.css'

const SEGMENTS = 28
const WORM_COLORS = ['#cf9588', '#c58779', '#d6a093', '#bf8274', '#cc8f7f']

interface Props {
  links: SocialLink[]
  label: string
}

interface WormSpec {
  link: SocialLink
  side: 1 | -1
  ax: number
  ay: number
  L: number
  W: number
  restX: number 
  restY: number
  phase: number
  sigma: 1 | -1
  color: string
  pillW: number
  pillH: number
  fs: number
  hitW: number
}

interface WormState {
  px: number
  py: number
  vx: number
  vy: number
  tx: number
  ty: number
  drag: boolean
  moved: boolean
  sx: number
  sy: number
  ready: boolean
}

interface WormEls {
  root: Element | null
  shadow: SVGPathElement | null
  body: SVGPathElement | null
  rings: SVGPathElement | null
  clit: SVGPathElement | null
  shine: SVGPathElement | null
  hit: SVGPathElement | null
  head: SVGCircleElement | null
  label: SVGGElement | null
}

const surfaceOf = (h: number) => Math.max(26, Math.min(54, h * 0.14))

function seeded(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0
    return s / 4294967296
  }
}

function layoutWorms(links: SocialLink[], w: number, h: number): WormSpec[] {
  const top = surfaceOf(h) + 22
  const gap = (h - top - 14) / Math.max(links.length, 1)
  const compact = w < 520
  const W = compact
    ? Math.max(10, Math.min(20, gap * 0.5))
    : Math.max(8, Math.min(16, gap * 0.4))
  const L = compact ? w * 0.5 : Math.min(w * 0.5, 280)
  const pillH = compact ? Math.max(18, Math.min(24, gap * 0.58)) : 18
  const fs = compact ? pillH * 0.48 : 10.5

  return links.map((link, i) => {
    const side: 1 | -1 = i % 2 === 0 ? 1 : -1
    return {
      link,
      side,
      ax: side === 1 ? -10 : w + 10,
      ay: top + gap * (i + 0.5),
      L,
      W,
      restX: side * 0.72 * L,
      restY: 0,
      phase: i * 1.7,
      sigma: i % 4 < 2 ? 1 : -1,
      color: WORM_COLORS[i % WORM_COLORS.length],
      pillW: Math.round((link.label.length + 2) * fs * 0.7 + (compact ? pillH : 22)),
      pillH,
      fs,
      hitW: compact ? Math.max(38, W + 20) : Math.max(28, W + 14),
    }
  })
}

function wavy(w: number, y: number, amp: number, freq: number, phase: number) {
  let d = ''
  for (let x = 0; x <= w + 16; x += 16) {
    const yy = y + Math.sin(x * freq + phase) * amp
    d += `${d ? 'L' : 'M'}${x} ${yy.toFixed(1)}`
  }
  return d
}

function SoilBackground({ w, h }: { w: number; h: number }) {
  const art = useMemo(() => {
    const rnd = seeded(7)
    const surface = surfaceOf(h)
    const b1 = surface + (h - surface) * 0.34
    const b2 = surface + (h - surface) * 0.66

    const blades: { d: string; c: string }[] = []
    const greens = ['#567257', '#8fb092', '#3f5a41', '#6f8f71']
    for (let x = 3; x < w; x += 6 + rnd() * 8) {
      const bh = 6 + rnd() * (surface - 12)
      const lean = (rnd() - 0.5) * 8
      blades.push({
        d: `M${x.toFixed(1)} ${surface + 1}Q${(x + lean * 0.3).toFixed(1)} ${(surface - bh * 0.55).toFixed(1)} ${(x + lean).toFixed(1)} ${(surface - bh).toFixed(1)}`,
        c: greens[Math.floor(rnd() * greens.length)],
      })
    }

    const roots: string[] = []
    const rootCount = Math.max(3, Math.round(w / 170))
    for (let r = 0; r < rootCount; r++) {
      let x = w * (0.08 + 0.84 * rnd())
      let y = surface
      let d = `M${x.toFixed(1)} ${y}`
      const depth = surface + (b1 - surface) * (0.7 + rnd() * 0.7)
      while (y < depth) {
        const ny = y + 12 + rnd() * 10
        const nx = x + (rnd() - 0.5) * 14
        d += `Q${(x + (rnd() - 0.5) * 10).toFixed(1)} ${((y + ny) / 2).toFixed(1)} ${nx.toFixed(1)} ${ny.toFixed(1)}`
        if (rnd() < 0.55) {
          const dir = rnd() < 0.5 ? -1 : 1
          d += `M${nx.toFixed(1)} ${ny.toFixed(1)}q${dir * (10 + rnd() * 16)} ${(6 + rnd() * 8).toFixed(1)} ${dir * (18 + rnd() * 20)} ${(10 + rnd() * 12).toFixed(1)}M${nx.toFixed(1)} ${ny.toFixed(1)}`
        }
        x = nx
        y = ny
      }
      roots.push(d)
    }

    const specks: { x: number; y: number; r: number; c: string }[] = []
    const count = Math.round((w * (h - surface)) / 1500)
    for (let i = 0; i < count; i++) {
      const roll = rnd()
      specks.push({
        x: rnd() * w,
        y: surface + 4 + rnd() * (h - surface - 4),
        r: 0.6 + rnd() * 1.5,
        c:
          roll < 0.5
            ? 'rgba(18,10,6,0.35)'
            : roll < 0.9
              ? 'rgba(236,226,206,0.13)'
              : 'rgba(143,176,146,0.3)',
      })
    }

    const pebbles: { x: number; y: number; rx: number; ry: number; rot: number }[] = []
    const pebbleCount = Math.max(4, Math.round(w / 85))
    for (let i = 0; i < pebbleCount; i++) {
      pebbles.push({
        x: rnd() * w,
        y: b1 + 6 + rnd() * (h - b1 - 12),
        rx: 3 + rnd() * 8,
        ry: 2.5 + rnd() * 5,
        rot: rnd() * 180,
      })
    }

    return { surface, b1, b2, blades, roots, specks, pebbles }
  }, [w, h])

  const { surface, b1, b2, blades, roots, specks, pebbles } = art
  const below = (y: number, amp: number, freq: number, phase: number) =>
    `${wavy(w, y, amp, freq, phase)}L${w + 16} ${h}L0 ${h}Z`

  return (
    <svg className={styles.bg} width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      <defs>
        <linearGradient id="soil-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2b2520" />
          <stop offset="1" stopColor="#38302a" />
        </linearGradient>
        <linearGradient id="soil-shade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0.28" />
          <stop offset="0.35" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.26" />
        </linearGradient>
        <filter id="soil-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" />
          <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0" />
        </filter>
      </defs>

      <rect width={w} height={h} fill="url(#soil-sky)" />

      <path d={`${wavy(w, surface, 1.2, 0.05, 0)}L${w + 16} ${h}L0 ${h}Z`} fill="#3a2e27" />
      <path d={below(b1, 5, 0.021, 1.2)} fill="#4d3b2f" />
      <path d={below(b2, 6, 0.017, 3.1)} fill="#5d4838" />

      {roots.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke="rgba(226,208,180,0.34)"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      ))}

      {specks.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={s.c} />
      ))}

      {pebbles.map((p, i) => (
        <g key={i} transform={`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${p.rot.toFixed(0)})`}>
          <ellipse rx={p.rx} ry={p.ry} fill="#8d7c6c" opacity="0.55" />
          <ellipse rx={p.rx * 0.6} ry={p.ry * 0.45} cy={-p.ry * 0.25} fill="#c9baa6" opacity="0.28" />
        </g>
      ))}

      {blades.map((b, i) => (
        <path key={i} d={b.d} fill="none" stroke={b.c} strokeWidth="2" strokeLinecap="round" />
      ))}
      <path d={wavy(w, surface, 1.2, 0.05, 0)} fill="none" stroke="rgba(143,176,146,0.45)" strokeWidth="1.5" />

      <rect width={w} height={h} fill="url(#soil-shade)" />
      <rect width={w} height={h} filter="url(#soil-grain)" opacity="0.5" style={{ mixBlendMode: 'overlay' }} />
    </svg>
  )
}

function updateWorm(
  s: WormSpec,
  d: WormState,
  el: WormEls,
  t: number,
  dt: number,
  reduce: boolean,
) {
  let tx: number
  let ty: number
  let k: number
  let c: number
  if (d.drag) {
    tx = d.tx
    ty = d.ty
    k = 800
    c = 50
  } else {
    const live = reduce ? 0 : 1
    tx = s.restX + Math.sin(t * 0.8 + s.phase) * 4 * live
    ty = s.restY + Math.cos(t * 1.1 + s.phase) * 3 * live
    k = 110
    c = 7
  }
  d.vx += ((tx - d.px) * k - d.vx * c) * dt
  d.vy += ((ty - d.py) * k - d.vy * c) * dt
  d.px += d.vx * dt
  d.py += d.vy * dt

  const r = Math.hypot(d.px, d.py) || 1
  const dirx = d.px / r
  const diry = d.py / r
  const soft = 0.6 * s.L
  let dist = r < soft ? r : soft + 0.4 * s.L * Math.tanh((r - soft) / (0.4 * s.L))
  dist = Math.max(dist, 0.3 * s.L)

  const slack = Math.max(0, s.L - dist)
  const bow = s.sigma * 0.7 * (Math.sqrt(dist * slack) / Math.PI)
  const waveA = reduce ? 0 : 1.2 + (4 * slack) / s.L
  const nx = -diry
  const ny = dirx

  const cx: number[] = []
  const cy: number[] = []
  for (let i = 0; i <= SEGMENTS; i++) {
    const u = i / SEGMENTS
    const lat =
      bow * Math.sin(2 * Math.PI * u) +
      waveA * Math.sin(2 * Math.PI * 1.3 * u - t * 2.6 + s.phase) * Math.sin(Math.PI * u)
    cx.push(s.ax + dirx * dist * u + nx * lat)
    cy.push(s.ay + diry * dist * u + ny * lat)
  }

  const lx: number[] = []
  const ly: number[] = []
  const rx: number[] = []
  const ry: number[] = []
  const widths: number[] = []
  const bx: number[] = []
  const by: number[] = []
  for (let i = 0; i <= SEGMENTS; i++) {
    const u = i / SEGMENTS
    const a = Math.max(0, i - 1)
    const b = Math.min(SEGMENTS, i + 1)
    let txv = cx[b] - cx[a]
    let tyv = cy[b] - cy[a]
    const tl = Math.hypot(txv, tyv) || 1
    txv /= tl
    tyv /= tl
    const px = -tyv
    const py = txv
    const wi = s.W * Math.min(1, 0.55 + u * 3) * (1 - 0.1 * u ** 4)
    widths.push(wi)
    lx.push(cx[i] + (px * wi) / 2)
    ly.push(cy[i] + (py * wi) / 2)
    rx.push(cx[i] - (px * wi) / 2)
    ry.push(cy[i] - (py * wi) / 2)
    bx.push(cx[i] + px * wi * 0.22)
    by.push(cy[i] + py * wi * 0.22)
  }

  const f = (n: number) => n.toFixed(1)
  const ring = (from: number, to: number, grow: number) => {
    let p = `M${f(cx[from] + (lx[from] - cx[from]) * grow)} ${f(cy[from] + (ly[from] - cy[from]) * grow)}`
    for (let i = from + 1; i <= to; i++) {
      p += `L${f(cx[i] + (lx[i] - cx[i]) * grow)} ${f(cy[i] + (ly[i] - cy[i]) * grow)}`
    }
    for (let i = to; i >= from; i--) {
      p += `L${f(cx[i] + (rx[i] - cx[i]) * grow)} ${f(cy[i] + (ry[i] - cy[i]) * grow)}`
    }
    return p + 'Z'
  }

  const bodyD = ring(0, SEGMENTS, 1)
  el.body?.setAttribute('d', bodyD)
  el.shadow?.setAttribute('d', bodyD)
  el.clit?.setAttribute('d', ring(Math.round(SEGMENTS * 0.62), Math.round(SEGMENTS * 0.74), 1.12))

  let rings = ''
  for (let i = 3; i < SEGMENTS; i += 2) {
    rings += `M${f(lx[i] * 0.9 + cx[i] * 0.1)} ${f(ly[i] * 0.9 + cy[i] * 0.1)}L${f(rx[i] * 0.9 + cx[i] * 0.1)} ${f(ry[i] * 0.9 + cy[i] * 0.1)}`
  }
  el.rings?.setAttribute('d', rings)

  let shine = `M${f(bx[2])} ${f(by[2])}`
  for (let i = 3; i < SEGMENTS; i++) shine += `L${f(bx[i])} ${f(by[i])}`
  el.shine?.setAttribute('d', shine)

  let hit = `M${f(cx[0])} ${f(cy[0])}`
  for (let i = 2; i <= SEGMENTS; i += 2) hit += `L${f(cx[i])} ${f(cy[i])}`
  el.hit?.setAttribute('d', hit)

  const hx = cx[SEGMENTS]
  const hy = cy[SEGMENTS]
  if (el.head) {
    el.head.setAttribute('cx', f(hx))
    el.head.setAttribute('cy', f(hy))
  }
  if (el.label) {
    const off = s.side === 1 ? s.W * 0.5 + 10 : -(s.W * 0.5 + 10) - s.pillW
    el.label.setAttribute('transform', `translate(${f(hx + off)} ${f(hy - s.pillH / 2)})`)
  }

  const ready = d.drag && Math.hypot(d.tx, d.ty) >= s.L
  if (ready !== d.ready) {
    d.ready = ready
    el.root?.classList.toggle(styles.ready, ready)
  }
}

export default function SoilScene({ links, label }: Props) {
  const stageRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const els = useRef<WormEls[]>([])
  const states = useRef<WormState[]>([])
  const suppressClick = useRef(false)
  const [size, setSize] = useState({ w: 0, h: 0 })

  useLayoutEffect(() => {
    const el = stageRef.current
    if (!el) return
    const measure = () => {
      const r = el.getBoundingClientRect()
      const w = Math.round(r.width)
      const h = Math.round(r.height)
      setSize((p) => (p.w === w && p.h === h ? p : { w, h }))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const worms = useMemo(
    () => (size.w > 0 ? layoutWorms(links, size.w, size.h) : []),
    [links, size.w, size.h],
  )

  useEffect(() => {
    if (!worms.length) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    states.current = worms.map((s) => ({
      px: s.restX,
      py: s.restY,
      vx: 0,
      vy: 0,
      tx: 0,
      ty: 0,
      drag: false,
      moved: false,
      sx: 0,
      sy: 0,
      ready: false,
    }))

    const clock = { last: performance.now(), raf: 0 }
    const frame = (now: number) => {
      const dt = Math.min(0.033, (now - clock.last) / 1000)
      clock.last = now
      worms.forEach((s, i) => {
        const el = els.current[i]
        const st = states.current[i]
        if (el && st) updateWorm(s, st, el, now / 1000, dt, reduce)
      })
      clock.raf = requestAnimationFrame(frame)
    }
    clock.raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(clock.raf)
  }, [worms])

  const local = (e: ReactPointerEvent) => {
    const r = svgRef.current!.getBoundingClientRect()
    return { x: e.clientX - r.left, y: e.clientY - r.top }
  }

  const onDown = (i: number) => (e: ReactPointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    const d = states.current[i]
    const s = worms[i]
    if (!d || !s) return
    e.currentTarget.setPointerCapture(e.pointerId)
    const p = local(e)
    d.drag = true
    d.moved = false
    d.sx = p.x
    d.sy = p.y
    d.tx = p.x - s.ax
    d.ty = p.y - s.ay
  }

  const onMove = (i: number) => (e: ReactPointerEvent<HTMLAnchorElement>) => {
    const d = states.current[i]
    const s = worms[i]
    if (!d?.drag || !s) return
    const p = local(e)
    d.tx = p.x - s.ax
    d.ty = p.y - s.ay
    if (!d.moved && Math.hypot(p.x - d.sx, p.y - d.sy) > 6) {
      d.moved = true
      stageRef.current?.setAttribute('data-dragging', 'true')
    }
  }

  const finish = (i: number, open: boolean) => (e: ReactPointerEvent<HTMLAnchorElement>) => {
    const d = states.current[i]
    const s = worms[i]
    if (!d?.drag || !s) return
    d.drag = false
    stageRef.current?.removeAttribute('data-dragging')
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
    if (d.moved) {
      suppressClick.current = true
      window.setTimeout(() => (suppressClick.current = false), 60)
      if (open && Math.hypot(d.tx, d.ty) >= s.L) {
        window.open(s.link.href, '_blank', 'noopener,noreferrer')
      }
    }
  }

  const setEl = (i: number, key: keyof WormEls) => (node: Element | null) => {
    els.current[i] ??= {
      root: null, shadow: null, body: null, rings: null, clit: null, shine: null, hit: null, head: null, label: null,
    }
    ;(els.current[i] as unknown as Record<string, Element | null>)[key] = node
  }

  return (
    <div ref={stageRef} className={styles.stage}>
      {size.w > 0 && <SoilBackground w={size.w} h={size.h} />}
      {size.w > 0 && (
        <svg
          ref={svgRef}
          className={styles.worms}
          width={size.w}
          height={size.h}
          viewBox={`0 0 ${size.w} ${size.h}`}
          role="group"
          aria-label={label}
        >
          {worms.map((s, i) => (
            <a
              key={s.link.label}
              ref={setEl(i, 'root')}
              className={styles.worm}
              href={s.link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${s.link.label} (opens in a new tab)`}
              draggable={false}
              onDragStart={(e) => e.preventDefault()}
              onPointerDown={onDown(i)}
              onPointerMove={onMove(i)}
              onPointerUp={finish(i, true)}
              onPointerCancel={finish(i, false)}
              onClick={(e) => {
                if (suppressClick.current) {
                  e.preventDefault()
                  suppressClick.current = false
                }
              }}
            >
              <path ref={setEl(i, 'shadow')} className={styles.shadow} />
              <path ref={setEl(i, 'body')} className={styles.body} fill={s.color} stroke={s.color} />
              <circle ref={setEl(i, 'head')} className={styles.body} r={s.W * 0.46} fill={s.color} stroke={s.color} />
              <path ref={setEl(i, 'clit')} className={styles.clit} />
              <path ref={setEl(i, 'rings')} className={styles.rings} />
              <path ref={setEl(i, 'shine')} className={styles.shine} strokeWidth={Math.max(2, s.W * 0.16)} />
              <path ref={setEl(i, 'hit')} className={styles.hit} strokeWidth={s.hitW} />
              <g ref={setEl(i, 'label')} className={styles.label}>
                <rect className={styles.pill} width={s.pillW} height={s.pillH} rx={s.pillH / 2} />
                <text
                  className={styles.labelText}
                  x={s.pillW / 2}
                  y={s.pillH / 2 + s.fs * 0.36}
                  fontSize={s.fs}
                  textAnchor="middle"
                >
                  {s.link.label.toUpperCase()} ↗
                </text>
              </g>
            </a>
          ))}
        </svg>
      )}
    </div>
  )
}