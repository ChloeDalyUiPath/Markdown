import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check, Save, X, Lock, Sparkles } from 'lucide-react'
import StatCard from '../StatCard'
import {
  RL_CATEGORIES,
  DEFAULT_GUARDRAIL_SETS,
  SET_A_CURVE,
  SET_B_CURVE,
} from '../../data/rlStrategies'

// ─── KPI reference + interpolation ───────────────────────────────────────────

const KPI_REFS = [
  { x: 9,  num: { avgPrice: 79.00,  revenue: 220400, avgMarkdown: 52.0, grossMargin: 29000, sellThrough: 93.0 } },
  { x: 16, num: { avgPrice: 85.50,  revenue: 219800, avgMarkdown: 47.0, grossMargin: 30500, sellThrough: 91.0 } },
  { x: 25, num: { avgPrice: 94.20,  revenue: 218500, avgMarkdown: 41.0, grossMargin: 32400, sellThrough: 89.0 } },
  { x: 36, num: { avgPrice: 105.70, revenue: 216300, avgMarkdown: 35.2, grossMargin: 34900, sellThrough: 88.0 } },
  { x: 47, num: { avgPrice: 116.80, revenue: 213200, avgMarkdown: 25.0, grossMargin: 36600, sellThrough: 86.0 } },
  { x: 50, num: { avgPrice: 119.50, revenue: 212800, avgMarkdown: 22.0, grossMargin: 36200, sellThrough: 85.5 } },
  { x: 58, num: { avgPrice: 126.20, revenue: 210200, avgMarkdown: 18.0, grossMargin: 37200, sellThrough: 83.0 } },
  { x: 61, num: { avgPrice: 128.50, revenue: 208900, avgMarkdown: 16.0, grossMargin: 38000, sellThrough: 82.0 } },
  { x: 72, num: { avgPrice: 136.40, revenue: 200100, avgMarkdown: 10.0, grossMargin: 40200, sellThrough: 77.0 } },
  { x: 82, num: { avgPrice: 143.60, revenue: 186400, avgMarkdown: 5.5,  grossMargin: 43100, sellThrough: 72.0 } },
].sort((a, b) => a.x - b.x)

const TARGET = { avgPrice: 128.97, revenue: 212800, avgMarkdown: 10.3, grossMargin: 36200, sellThrough: 87.0 }

function interpolateKPIs(bx, by) {
  const refs = KPI_REFS
  const x = Math.max(refs[0].x, Math.min(refs[refs.length - 1].x, bx))
  let lo = refs[0], hi = refs[refs.length - 1]
  for (let i = 0; i < refs.length - 1; i++) {
    if (refs[i].x <= x && refs[i + 1].x >= x) { lo = refs[i]; hi = refs[i + 1]; break }
  }
  const t = hi.x === lo.x ? 0 : (x - lo.x) / (hi.x - lo.x)
  const lerp = (a, b) => a + (b - a) * t
  return {
    avgPrice:    lerp(lo.num.avgPrice,    hi.num.avgPrice),
    revenue:     lerp(lo.num.revenue,     hi.num.revenue),
    avgMarkdown: lerp(lo.num.avgMarkdown, hi.num.avgMarkdown),
    grossMargin: lerp(lo.num.grossMargin, hi.num.grossMargin),
    sellThrough: Math.max(60, Math.min(95, by)),
  }
}

function computeBlended(categorySelections) {
  const totalW = RL_CATEGORIES.reduce((s, c) => s + c.weight, 0)
  let sumX = 0, sumY = 0
  RL_CATEGORIES.forEach(c => {
    const sel = categorySelections[c.id]
    const curve = sel.guardrailSetId === 1 ? SET_A_CURVE : SET_B_CURVE
    const point = curve.find(p => p.id === sel.pointId) ?? curve.find(p => p.recommended) ?? curve[0]
    sumX += point.x * c.weight
    sumY += point.y * c.weight
  })
  const bx = sumX / totalW
  const by = sumY / totalW
  return { x: bx, y: by, num: interpolateKPIs(bx, by) }
}

function buildStats(bp) {
  const n = bp.num
  const fmtRev = v => '$' + Math.round(v / 1000) + 'K'
  const fmtPp  = n => (n >= 0 ? '+' : '') + n.toFixed(1) + 'pp'
  const pctVsTarget = (val, base) => {
    const d = ((val - base) / Math.abs(base)) * 100
    return (d >= 0 ? '+' : '') + d.toFixed(1) + '% vs plan'
  }
  const fmtRevDelta = n => {
    const abs = Math.abs(n)
    const s = n >= 0 ? '+' : '-'
    return s + '€' + (abs >= 1e6 ? (abs / 1e6).toFixed(1) + 'M' : Math.round(abs / 1000) + 'K')
  }
  return [
    { label: 'Avg Selling Price',      value: '$' + n.avgPrice.toFixed(0),    color: 'blue',  negative: n.avgPrice    < TARGET.avgPrice,     delta: (n.avgPrice >= TARGET.avgPrice ? '+' : '') + '$' + (n.avgPrice - TARGET.avgPrice).toFixed(0),      change: pctVsTarget(n.avgPrice, TARGET.avgPrice) },
    { label: 'Avg. Markdown',          value: n.avgMarkdown.toFixed(1) + '%', color: 'amber', negative: n.avgMarkdown > TARGET.avgMarkdown,  delta: fmtPp(n.avgMarkdown - TARGET.avgMarkdown),                                                          change: pctVsTarget(n.avgMarkdown, TARGET.avgMarkdown) },
    { label: 'Predicted Gross Margin', value: fmtRev(n.grossMargin),          color: 'green', negative: n.grossMargin < TARGET.grossMargin, delta: fmtRevDelta(n.grossMargin - TARGET.grossMargin),                                                    change: pctVsTarget(n.grossMargin, TARGET.grossMargin) },
    { label: 'Predicted Sell-Through', value: n.sellThrough.toFixed(1) + '%', color: 'green', negative: n.sellThrough < TARGET.sellThrough, delta: fmtPp(n.sellThrough - TARGET.sellThrough) + ' vs plan',                                            change: pctVsTarget(n.sellThrough, TARGET.sellThrough) },
    { label: 'Predicted Revenue',      value: fmtRev(n.revenue),              color: 'blue',  negative: n.revenue     < TARGET.revenue,     delta: fmtRevDelta(n.revenue - TARGET.revenue),                                                            change: pctVsTarget(n.revenue, TARGET.revenue) },
    { label: 'Total Products',         value: '12,492',                        color: 'slate', negative: false, delta: null, change: null },
  ]
}

// ─── Catmull-Rom path ─────────────────────────────────────────────────────────

function catmullRomPath(pts) {
  if (pts.length < 2) return ''
  const segs = []
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)], p1 = pts[i]
    const p2 = pts[i + 1], p3 = pts[Math.min(i + 2, pts.length - 1)]
    const cp1x = p1.cx + (p2.cx - p0.cx) / 6, cp1y = p1.cy + (p2.cy - p0.cy) / 6
    const cp2x = p2.cx - (p3.cx - p1.cx) / 6, cp2y = p2.cy - (p3.cy - p1.cy) / 6
    if (i === 0) segs.push(`M ${p1.cx} ${p1.cy}`)
    segs.push(`C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.cx} ${p2.cy}`)
  }
  return segs.join(' ')
}

// ─── Zone backgrounds ─────────────────────────────────────────────────────────

const ZONES = [
  { id: 'clearance',   label: 'Clearance Zone',   xFrom: 0,  xTo: 35,  color: '#f59e0b', labelAnchor: 'start',  labelX: 4  },
  { id: 'balanced',    label: 'Balanced Zone',    xFrom: 35, xTo: 63,  color: '#8b5cf6', labelAnchor: 'middle', labelX: 49 },
  { id: 'high-margin', label: 'High Margin Zone', xFrom: 63, xTo: 100, color: '#3b82f6', labelAnchor: 'end',    labelX: 97 },
]

// ─── Dual-curve chart ─────────────────────────────────────────────────────────

function ScenarioChart({ categorySelections, blendedPoint, pulseKey }) {
  const wrapperRef = useRef(null)
  const [W, setW] = useState(540)
  const [H, setH] = useState(300)

  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      if (width > 0) setW(Math.floor(width))
      if (height > 0) setH(Math.floor(height))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const pad = { top: 28, right: 24, bottom: 48, left: 52 }
  const cW = W - pad.left - pad.right
  const cH = H - pad.top - pad.bottom
  const xD = [0, 100], yD = [60, 95]
  const sx = x => pad.left + ((x - xD[0]) / (xD[1] - xD[0])) * cW
  const sy = y => pad.top  + ((yD[1] - y) / (yD[1] - yD[0])) * cH
  const xTicks = [0, 20, 40, 60, 80, 100]
  const yTicks = [60, 65, 70, 75, 80, 85, 90, 95]

  const setACurvePts = SET_A_CURVE.map(p => ({ cx: sx(p.x), cy: sy(p.y) }))
  const setBCurvePts = SET_B_CURVE.map(p => ({ cx: sx(p.x), cy: sy(p.y) }))

  const bx = blendedPoint ? sx(blendedPoint.x) : null
  const by = blendedPoint ? sy(blendedPoint.y) : null

  // Per-category positions grouped for offset rendering
  const catPositions = RL_CATEGORIES.map(cat => {
    const sel   = categorySelections[cat.id]
    const curve = sel.guardrailSetId === 1 ? SET_A_CURVE : SET_B_CURVE
    const point = curve.find(p => p.id === sel.pointId) ?? curve[0]
    return { cat, cx: sx(point.x), cy: sy(point.y), setId: sel.guardrailSetId }
  })

  return (
    <div ref={wrapperRef} className="w-full h-full">
      <style>{`
        @keyframes rl-pulse { 0% { r: 10; opacity: 0.7; } 100% { r: 28; opacity: 0; } }
      `}</style>
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ display: 'block' }}>
        <clipPath id="rl3-clip"><rect x={pad.left} y={pad.top} width={cW} height={cH} /></clipPath>

        {/* Zone backgrounds */}
        {ZONES.map(z => {
          const x0 = Math.max(pad.left, sx(z.xFrom))
          const x1 = Math.min(pad.left + cW, sx(z.xTo))
          return (
            <g key={z.id}>
              <rect x={x0} y={pad.top} width={x1 - x0} height={cH} fill={z.color} opacity={0.05} clipPath="url(#rl3-clip)" />
              <text x={sx(z.labelX)} y={pad.top + 14} textAnchor={z.labelAnchor} fill={z.color} fontSize={8} fontWeight={700} opacity={0.35} clipPath="url(#rl3-clip)">
                {z.label}
              </text>
            </g>
          )
        })}

        {/* Grid */}
        {xTicks.map(x => <line key={x} x1={sx(x)} y1={pad.top} x2={sx(x)} y2={pad.top + cH} stroke="#f0f0f0" strokeWidth={1} />)}
        {yTicks.map(y => <line key={y} x1={pad.left} y1={sy(y)} x2={pad.left + cW} y2={sy(y)} stroke="#f0f0f0" strokeWidth={1} />)}

        {/* Set B curve — dashed amber */}
        <path d={catmullRomPath(setBCurvePts)} fill="none" stroke="#d97706" strokeWidth={2} strokeDasharray="5 3" opacity={0.55} clipPath="url(#rl3-clip)" />

        {/* Set A curve — solid blue */}
        <path d={catmullRomPath(setACurvePts)} fill="none" stroke="#2a44d4" strokeWidth={2} opacity={0.55} clipPath="url(#rl3-clip)" />

        {/* Set B reference points */}
        {SET_B_CURVE.map(p => (
          <circle key={p.id} cx={sx(p.x)} cy={sy(p.y)} r={p.recommended ? 6 : 4}
            fill={p.recommended ? '#d97706' : '#fff'} stroke="#d97706" strokeWidth={1.5} opacity={0.75} clipPath="url(#rl3-clip)" />
        ))}

        {/* Set A reference points */}
        {SET_A_CURVE.map(p => (
          <circle key={p.id} cx={sx(p.x)} cy={sy(p.y)} r={p.recommended ? 6 : 4}
            fill={p.recommended ? '#2a44d4' : '#fff'} stroke="#2a44d4" strokeWidth={1.5} opacity={0.75} clipPath="url(#rl3-clip)" />
        ))}

        {/* Category selection markers */}
        {catPositions.map(({ cat, cx, cy, setId }, i) => {
          const col = setId === 1 ? '#2a44d4' : '#d97706'
          const off = (i % 2 === 0 ? 0 : 4) // slight vertical offset to reduce overlap
          return (
            <g key={cat.id} clipPath="url(#rl3-clip)">
              <circle cx={cx} cy={cy + off} r={8} fill={col} stroke="#fff" strokeWidth={2} opacity={0.9} />
              <text x={cx} y={cy + off + 3.5} textAnchor="middle" fill="#fff" fontSize={7} fontWeight={700}>
                {cat.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
              </text>
            </g>
          )
        })}

        {/* Blended outcome diamond */}
        {bx !== null && (
          <>
            <g key={pulseKey}>
              <circle cx={bx} cy={by} r={10} fill="none" stroke="#1f2937" strokeWidth={1.5}
                style={{ animation: 'rl-pulse 0.9s ease-out forwards' }} />
            </g>
            <g style={{ transform: `translate(${bx}px, ${by}px)`, transition: 'transform 0.55s cubic-bezier(0.4,0,0.2,1)' }}>
              <polygon points={`0,${-9} ${9},0 0,${9} ${-9},0`} fill="#1f2937" stroke="#fff" strokeWidth={2} />
              <text x={0} y={-14} textAnchor="middle" fill="#1f2937" fontSize={9} fontWeight={700}>Blended outcome</text>
            </g>
          </>
        )}

        {/* Axes */}
        {xTicks.map(x => <text key={x} x={sx(x)} y={pad.top + cH + 16} textAnchor="middle" fill="#9ca3af" fontSize={10}>{x}</text>)}
        <text x={pad.left + cW / 2} y={H - 4} textAnchor="middle" fill="#6b7280" fontSize={10}>Predicted gross margin (%)</text>
        {yTicks.map(y => <text key={y} x={pad.left - 6} y={sy(y) + 3} textAnchor="end" fill="#9ca3af" fontSize={10}>{y}</text>)}
        <text x={12} y={pad.top + cH / 2} textAnchor="middle" fill="#6b7280" fontSize={10}
          transform={`rotate(-90, 12, ${pad.top + cH / 2})`}>Predicted sell-through rate (%)</text>
      </svg>
    </div>
  )
}

// ─── Point picker dropdown ────────────────────────────────────────────────────

function PointPicker({ guardrailSetId, pointId, onChange, disabled }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const curve   = guardrailSetId === 1 ? SET_A_CURVE : SET_B_CURVE
  const current = curve.find(p => p.id === pointId) ?? curve.find(p => p.recommended) ?? curve[0]
  const isSetA  = guardrailSetId === 1

  useEffect(() => {
    if (!open) return
    function handle(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <button type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen(v => !v)}
        className={`flex items-center gap-1.5 border rounded-lg px-2 py-1 text-xs font-medium transition-colors
          ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50 text-gray-400 border-gray-200'
            : isSetA ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                     : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'}`}
      >
        {current.pct}% markdown{current.recommended ? ' ★' : ''}
        {!disabled && <ChevronDown size={10} className={`transition-transform ${open ? 'rotate-180' : ''}`} />}
      </button>
      {open && (
        <div className="absolute bottom-full left-0 mb-1 bg-white border border-gray-200 rounded-xl shadow-xl z-[200] overflow-hidden w-44">
          {curve.map(p => (
            <button key={p.id} type="button"
              onMouseDown={e => e.preventDefault()}
              onClick={() => { onChange(p.id); setOpen(false) }}
              className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors
                ${p.id === pointId
                  ? isSetA ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
                  : 'hover:bg-gray-50 text-gray-700'}`}
            >
              <span>{p.pct}% markdown</span>
              <span className="flex items-center gap-1">
                {p.recommended && <span className="text-[9px] font-bold text-gray-400 uppercase">Rec.</span>}
                {p.id === pointId && <Check size={10} />}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Category selections panel ────────────────────────────────────────────────

function CategorySelectionsPanel({ categorySelections, onSelectionChange, lockedCats, onToggleLock }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2.5">
        <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Category selections</div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-[10px] text-blue-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" /> Set A
          </span>
          <span className="flex items-center gap-1 text-[10px] text-amber-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Set B
          </span>
        </div>
      </div>

      <div className="space-y-1.5">
        {RL_CATEGORIES.map(cat => {
          const sel      = categorySelections[cat.id]
          const isLocked = lockedCats.includes(cat.id)
          const setId    = sel.guardrailSetId

          return (
            <div key={cat.id}
              className={`px-2.5 py-2 rounded-lg transition-colors ${isLocked ? 'bg-indigo-50/70 ring-1 ring-indigo-100' : 'hover:bg-gray-50'}`}
            >
              {/* Name + lock */}
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`text-xs font-medium flex-1 truncate ${isLocked ? 'text-indigo-700' : 'text-gray-800'}`}>
                  {isLocked && <Lock size={9} className="inline mr-1 mb-0.5 text-indigo-400" />}
                  {cat.name}
                </span>
                <button onClick={() => onToggleLock(cat.id)} title={isLocked ? 'Unlock' : 'Lock'}
                  className={`p-1 rounded transition-colors flex-shrink-0 ${isLocked ? 'text-indigo-500 hover:text-indigo-700' : 'text-gray-300 hover:text-gray-500'}`}>
                  <Lock size={10} />
                </button>
              </div>
              {/* Set toggle + point picker */}
              <div className="flex items-center gap-2">
                <div className="flex rounded border border-gray-200 overflow-hidden flex-shrink-0">
                  {DEFAULT_GUARDRAIL_SETS.map(gs => (
                    <button key={gs.id} type="button"
                      disabled={isLocked}
                      onClick={() => {
                        if (isLocked) return
                        const defaultPt = (gs.id === 1 ? SET_A_CURVE : SET_B_CURVE).find(p => p.recommended)?.id
                          ?? (gs.id === 1 ? SET_A_CURVE[0] : SET_B_CURVE[0]).id
                        onSelectionChange(cat.id, { guardrailSetId: gs.id, pointId: defaultPt })
                      }}
                      className={`px-2 py-0.5 text-[10px] font-bold transition-colors leading-none
                        ${setId === gs.id ? gs.colorClass : 'text-gray-400 bg-white hover:text-gray-600'}
                        ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {gs.label}
                    </button>
                  ))}
                </div>
                <PointPicker
                  guardrailSetId={setId}
                  pointId={sel.pointId}
                  onChange={newPtId => onSelectionChange(cat.id, { guardrailSetId: setId, pointId: newPtId })}
                  disabled={isLocked}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Pre-optimisation placeholder ────────────────────────────────────────────

function PreOptimisationState() {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center">
      <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
        <Sparkles size={24} className="text-gray-400" />
      </div>
      <h3 className="text-sm font-semibold text-gray-900 mb-1.5">Optimisation results will appear here</h3>
      <p className="text-xs text-gray-400 max-w-sm mb-6 leading-relaxed">
        Each guardrail set generates its own output curve. After optimisation you'll compare them and
        choose a markdown depth per category from whichever set best fits.
      </p>
      <div className="flex items-center gap-3 mb-6">
        {DEFAULT_GUARDRAIL_SETS.map(gs => (
          <span key={gs.id} className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${gs.colorClass}`}>
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: gs.accentColor }} />
            {gs.label} — {gs.name}
          </span>
        ))}
      </div>
      <p className="text-xs text-gray-400">
        Click <strong className="text-gray-600">Optimise campaign</strong> in the header to run optimisation.
      </p>
    </div>
  )
}

// ─── Save toast ───────────────────────────────────────────────────────────────

function SaveToast({ name, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3500)
    return () => clearTimeout(t)
  }, [])
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-gray-900 text-white text-sm px-4 py-3 rounded-xl shadow-2xl max-w-sm">
      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
        <Check size={13} className="text-white" />
      </span>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-white text-xs">Scenario saved</div>
        <div className="text-gray-400 text-[11px] truncate mt-0.5">{name}</div>
      </div>
      <button onClick={onDismiss} className="text-gray-500 hover:text-gray-300 flex-shrink-0">
        <X size={13} />
      </button>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function CampaignScenarioTabRL({
  status,
  categorySelections,
  onSelectionsChange,
  lockedCats,
  onLockedCatsChange,
  onScenarioSaved,
}) {
  const [pulseKey, setPulseKey]   = useState(0)
  const [saveToast, setSaveToast] = useState(null)

  const isPostOpt = ['Optimised', 'Live', 'Completed'].includes(status)
  const blended   = isPostOpt ? computeBlended(categorySelections) : null
  const stats     = blended ? buildStats(blended) : null

  function handleSelectionChange(catId, newSel) {
    if (lockedCats.includes(catId)) return
    onSelectionsChange(prev => ({ ...prev, [catId]: newSel }))
    setPulseKey(k => k + 1)
  }

  function handleToggleLock(catId) {
    onLockedCatsChange(prev =>
      prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
    )
  }

  function handleSave() {
    const name = 'Scenario — RL SS26'
    setSaveToast({ name })
    onScenarioSaved?.({
      name,
      lockedCategoryNames: RL_CATEGORIES.filter(c => lockedCats.includes(c.id)).map(c => c.name),
    })
  }

  if (!isPostOpt) {
    return <PreOptimisationState />
  }

  return (
    <div>
      {/* KPI stats */}
      {stats && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">Projected end of campaign</p>
            <span className="text-[10px] text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full font-medium">
              Blended across categories
            </span>
          </div>
          <div className="grid grid-cols-6 gap-3">
            {stats.map(s => (
              <StatCard key={s.label} label={s.label} value={s.value}
                change={s.change} delta={s.delta} negative={s.negative} color={s.color} />
            ))}
          </div>
        </div>
      )}

      {/* Main grid: chart | sidebar */}
      <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 300px' }}>

        {/* Chart panel */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Guardrail Set Comparison</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Set A and Set B show the achievable outcomes under each guardrail set. Choose a point per category →
              </p>
            </div>
            <button onClick={handleSave}
              className="flex items-center gap-1.5 bg-[#2a44d4] hover:bg-[#2438b8] text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors ml-4 flex-shrink-0">
              <Save size={12} /> Save scenario
            </button>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-5 mb-3 flex-wrap">
            <span className="flex items-center gap-2 text-xs text-gray-500">
              <svg width={28} height={8}><line x1={0} y1={4} x2={28} y2={4} stroke="#2a44d4" strokeWidth={2} /></svg>
              Set A — Standard
            </span>
            <span className="flex items-center gap-2 text-xs text-gray-500">
              <svg width={28} height={8}><line x1={0} y1={4} x2={28} y2={4} stroke="#d97706" strokeWidth={2} strokeDasharray="5 3" /></svg>
              Set B — Aggressive
            </span>
            <span className="flex items-center gap-2 text-xs text-gray-500">
              <svg width={12} height={12} viewBox="-6 -6 12 12"><polygon points="0,-5 5,0 0,5 -5,0" fill="#1f2937" /></svg>
              Blended outcome
            </span>
            <span className="flex items-center gap-2 text-xs text-gray-500">
              <span className="w-3 h-3 rounded-full bg-[#2a44d4] inline-block opacity-90" />
              Category selection
            </span>
          </div>

          <div className="flex-1 min-h-0" style={{ height: 300 }}>
            <ScenarioChart
              categorySelections={categorySelections}
              blendedPoint={blended}
              pulseKey={pulseKey}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-0.5">Category selections</h3>
          <p className="text-[11px] text-gray-400 mb-4 leading-snug">
            Assign each category to a guardrail set and choose a markdown depth from its output curve.
          </p>
          <CategorySelectionsPanel
            categorySelections={categorySelections}
            onSelectionChange={handleSelectionChange}
            lockedCats={lockedCats}
            onToggleLock={handleToggleLock}
          />
        </div>
      </div>

      {saveToast && <SaveToast name={saveToast.name} onDismiss={() => setSaveToast(null)} />}
    </div>
  )
}
