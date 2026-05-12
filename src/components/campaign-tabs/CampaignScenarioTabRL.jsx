import { useState, useRef, useEffect } from 'react'
import {
  ChevronDown, Check, Save, X, Lock, Sparkles,
  CheckCircle2, ArrowRightLeft, LockOpen, Info,
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts'
import StatCard from '../StatCard'
import {
  RL_CATEGORIES,
  DEFAULT_GUARDRAIL_SETS,
  SET_A_CURVE,
  SET_B_CURVE,
  MARKDOWN_RULES,
} from '../../data/rlStrategies'

// ─── Static data ──────────────────────────────────────────────────────────────

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

const distributionData = [
  { bucket: '>5%',  planned: 22, current: 8  }, { bucket: '>10%', planned: 10, current: 14 },
  { bucket: '>15%', planned: 26, current: 32 }, { bucket: '>20%', planned: 15, current: 28 },
  { bucket: '>25%', planned: 24, current: 20 }, { bucket: '>30%', planned: 26, current: 18 },
  { bucket: '>35%', planned: 28, current: 12 }, { bucket: '>40%', planned: 14, current: 8  },
  { bucket: '>45%', planned: 10, current: 4  }, { bucket: '>50%', planned: 8,  current: 2  },
  { bucket: '>55%', planned: 12, current: 2  }, { bucket: '55%+', planned: 5,  current: 1  },
]

const PEAK_REC = { x: 47, y: 84 }

const ZONES = [
  { id: 'clearance',   label: 'Clearance Zone',   xFrom: 0,  xTo: 35,  color: '#f59e0b', labelAnchor: 'start',  labelX: 4  },
  { id: 'balanced',    label: 'Balanced Zone',    xFrom: 35, xTo: 63,  color: '#8b5cf6', labelAnchor: 'middle', labelX: 49 },
  { id: 'high-margin', label: 'High Margin Zone', xFrom: 63, xTo: 100, color: '#3b82f6', labelAnchor: 'end',    labelX: 97 },
]

// ─── KPI computation ──────────────────────────────────────────────────────────

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
  return { x: sumX / totalW, y: sumY / totalW, num: interpolateKPIs(sumX / totalW, sumY / totalW) }
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
    const abs = Math.abs(n); const s = n >= 0 ? '+' : '-'
    return s + '€' + (abs >= 1e6 ? (abs / 1e6).toFixed(1) + 'M' : Math.round(abs / 1000) + 'K')
  }
  return [
    { label: 'Avg Selling Price',      value: '$' + n.avgPrice.toFixed(0),    color: 'blue',  negative: n.avgPrice    < TARGET.avgPrice,    delta: (n.avgPrice >= TARGET.avgPrice ? '+' : '') + '$' + (n.avgPrice - TARGET.avgPrice).toFixed(0), change: pctVsTarget(n.avgPrice, TARGET.avgPrice) },
    { label: 'Avg. Markdown',          value: n.avgMarkdown.toFixed(1) + '%', color: 'amber', negative: n.avgMarkdown > TARGET.avgMarkdown, delta: fmtPp(n.avgMarkdown - TARGET.avgMarkdown), change: pctVsTarget(n.avgMarkdown, TARGET.avgMarkdown) },
    { label: 'Predicted Gross Margin', value: fmtRev(n.grossMargin),          color: 'green', negative: n.grossMargin < TARGET.grossMargin, delta: fmtRevDelta(n.grossMargin - TARGET.grossMargin), change: pctVsTarget(n.grossMargin, TARGET.grossMargin) },
    { label: 'Predicted Sell-Through', value: n.sellThrough.toFixed(1) + '%', color: 'green', negative: n.sellThrough < TARGET.sellThrough, delta: fmtPp(n.sellThrough - TARGET.sellThrough) + ' vs plan', change: pctVsTarget(n.sellThrough, TARGET.sellThrough) },
    { label: 'Predicted Revenue',      value: fmtRev(n.revenue),              color: 'blue',  negative: n.revenue     < TARGET.revenue,     delta: fmtRevDelta(n.revenue - TARGET.revenue), change: pctVsTarget(n.revenue, TARGET.revenue) },
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

// ─── Toggle ───────────────────────────────────────────────────────────────────

function Toggle({ label, value, onChange }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <div onClick={onChange} className={`relative w-8 h-4 rounded-full transition-colors flex-shrink-0 ${value ? 'bg-[#2a44d4]' : 'bg-gray-200'}`}>
        <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-4' : 'translate-x-0.5'}`} />
      </div>
      <span className="text-xs text-gray-600">{label}</span>
    </label>
  )
}

// ─── Dual-curve chart ─────────────────────────────────────────────────────────

function ScenarioChart({ categorySelections, selectedCatIds, onPointClick, onCategoryClick, compareMode, comparePoints, viewSetId }) {
  const wrapperRef = useRef(null)
  const [W, setW] = useState(540)
  const [H, setH] = useState(310)
  const [hoveredPt, setHoveredPt] = useState(null)

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

  const activeCurve     = viewSetId === 1 ? SET_A_CURVE : SET_B_CURVE
  const activeCurvePts  = activeCurve.map(p => ({ cx: sx(p.x), cy: sy(p.y) }))
  const activeColor     = viewSetId === 1 ? '#2a44d4' : '#d97706'
  const activeDash      = viewSetId === 1 ? undefined : '5 3'

  function isCmp(idx, setId, pointId) {
    return comparePoints[idx]?.setId === setId && comparePoints[idx]?.pointId === pointId
  }

  const catPositions = RL_CATEGORIES.map((cat, i) => {
    const sel   = categorySelections[cat.id]
    const curve = sel.guardrailSetId === 1 ? SET_A_CURVE : SET_B_CURVE
    const point = curve.find(p => p.id === sel.pointId) ?? curve[0]
    return { cat, cx: sx(point.x), cy: sy(point.y), setId: sel.guardrailSetId, idx: i }
  }).filter(pos => pos.setId === viewSetId)

  function renderCurvePoint(p, setId, baseColor) {
    const isHovered = hoveredPt?.setId === setId && hoveredPt?.pointId === p.id
    const isCmpA = isCmp(0, setId, p.id)
    const isCmpB = isCmp(1, setId, p.id)
    const dotColor = isCmpA ? '#4f46e5' : isCmpB ? '#f97316' : p.recommended ? baseColor : '#fff'
    const strokeColor = isCmpA ? '#4f46e5' : isCmpB ? '#f97316' : baseColor
    const cx = sx(p.x), cy = sy(p.y)
    return (
      <g key={p.id} clipPath="url(#rl-clip)"
        style={{ cursor: 'pointer' }}
        onMouseEnter={() => setHoveredPt({ setId, pointId: p.id })}
        onMouseLeave={() => setHoveredPt(null)}
        onClick={() => onPointClick(p, setId)}
      >
        {isHovered && <circle cx={cx} cy={cy} r={14} fill={baseColor} opacity={0.12} />}
        {isCmpA && <circle cx={cx} cy={cy} r={12} fill="none" stroke="#4f46e5" strokeWidth={2} strokeDasharray="3 2" opacity={0.8} />}
        {isCmpB && <circle cx={cx} cy={cy} r={12} fill="none" stroke="#f97316" strokeWidth={2} strokeDasharray="3 2" opacity={0.8} />}
        <circle cx={cx} cy={cy} r={p.recommended ? 6 : 4.5} fill={dotColor} stroke={strokeColor} strokeWidth={1.5} opacity={0.9} />
        {p.recommended && !isCmpA && !isCmpB && (
          <text x={cx} y={cy - 9} textAnchor="middle" fill={baseColor} fontSize={7} fontWeight={700} opacity={0.6}>Rec.</text>
        )}
      </g>
    )
  }

  return (
    <div ref={wrapperRef} className="w-full h-full">
      <style>{`
        @keyframes rl-cat-ring { 0% { r: 14; opacity: 0.5; } 100% { r: 24; opacity: 0; } }
      `}</style>
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ display: 'block' }}>
        <clipPath id="rl-clip"><rect x={pad.left} y={pad.top} width={cW} height={cH} /></clipPath>

        {/* Zone backgrounds */}
        {ZONES.map(z => {
          const x0 = Math.max(pad.left, sx(z.xFrom))
          const x1 = Math.min(pad.left + cW, sx(z.xTo))
          return (
            <g key={z.id}>
              <rect x={x0} y={pad.top} width={x1 - x0} height={cH} fill={z.color} opacity={0.05} clipPath="url(#rl-clip)" />
              <text x={sx(z.labelX)} y={pad.top + 14} textAnchor={z.labelAnchor} fill={z.color} fontSize={8} fontWeight={700} opacity={0.35} clipPath="url(#rl-clip)">{z.label}</text>
            </g>
          )
        })}

        {/* Grid */}
        {xTicks.map(x => <line key={x} x1={sx(x)} y1={pad.top} x2={sx(x)} y2={pad.top + cH} stroke="#f0f0f0" strokeWidth={1} />)}
        {yTicks.map(y => <line key={y} x1={pad.left} y1={sy(y)} x2={pad.left + cW} y2={sy(y)} stroke="#f0f0f0" strokeWidth={1} />)}

        {/* Active curve only */}
        <path d={catmullRomPath(activeCurvePts)} fill="none" stroke={activeColor} strokeWidth={2} strokeDasharray={activeDash} opacity={0.55} clipPath="url(#rl-clip)" />
        {activeCurve.map(p => renderCurvePoint(p, viewSetId, activeColor))}

        {/* PEAK recommended */}
        {(() => {
          const px = sx(PEAK_REC.x), py = sy(PEAK_REC.y)
          return (
            <g clipPath="url(#rl-clip)">
              <circle cx={px} cy={py} r={13} fill="#059669" opacity={0.08} />
              <circle cx={px} cy={py} r={8} fill="#059669" stroke="#fff" strokeWidth={2} opacity={0.95} />
              <text x={px} y={py + 3} textAnchor="middle" fill="#fff" fontSize={9} fontWeight={900}>★</text>
              <text x={px + 14} y={py - 3} fill="#059669" fontSize={8} fontWeight={700} opacity={0.9}>PEAK</text>
              <text x={px + 14} y={py + 7} fill="#059669" fontSize={7.5} opacity={0.75}>Recommended</text>
            </g>
          )
        })()}

        {/* Category markers */}
        {catPositions.map(({ cat, cx, cy, setId, idx }) => {
          const col = setId === 1 ? '#2a44d4' : '#d97706'
          const isSelected = selectedCatIds.includes(cat.id)
          const off = idx % 2 === 0 ? 0 : 4
          const initials = cat.name.split(' ').map(w => w[0]).join('').slice(0, 2)
          return (
            <g key={cat.id} clipPath="url(#rl-clip)" style={{ cursor: 'pointer' }} onClick={() => onCategoryClick(cat.id)}>
              {isSelected && (
                <circle cx={cx} cy={cy + off} r={14} fill={col} opacity={0.15}
                  style={{ animation: 'rl-cat-ring 1.2s ease-out infinite' }} />
              )}
              <circle cx={cx} cy={cy + off} r={isSelected ? 11 : 9} fill={col} stroke="#fff" strokeWidth={2} opacity={isSelected ? 1 : 0.55} />
              <text x={cx} y={cy + off + 3.5} textAnchor="middle" fill="#fff" fontSize={7} fontWeight={700} opacity={0.9}>{initials}</text>
            </g>
          )
        })}

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

// ─── Markdown Distribution ────────────────────────────────────────────────────

function MarkdownDistribution() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-start justify-between mb-0.5">
        <h4 className="text-xs font-semibold text-gray-900">Markdown Distribution</h4>
        <div className="flex items-center gap-3 text-[10px] text-gray-500">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-indigo-200 inline-block" />Current</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-indigo-500 inline-block" />Planned</span>
        </div>
      </div>
      <p className="text-[10px] text-gray-400 mb-2">Products per markdown bucket — planned vs current.</p>
      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={distributionData} margin={{ top: 4, right: 0, left: -22, bottom: 0 }} barGap={1} barCategoryGap="20%">
          <XAxis dataKey="bucket" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 8 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 8 }} domain={[0, 40]} ticks={[0, 10, 20, 30, 40]} />
          <Bar dataKey="current" radius={[2, 2, 0, 0]}>
            {distributionData.map((_, i) => <Cell key={i} fill="#c7d2fe" />)}
          </Bar>
          <Bar dataKey="planned" radius={[2, 2, 0, 0]}>
            {distributionData.map((_, i) => <Cell key={i} fill="#6366f1" />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="text-center text-[10px] text-gray-400 -mt-1">Markdown Bucket</div>
    </div>
  )
}

// ─── Category multi-select ────────────────────────────────────────────────────

function RLCategoryMultiSelect({ value, onChange, categorySelections, lockedCats }) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)
  const allIds = RL_CATEGORIES.map(c => c.id)

  useEffect(() => {
    if (!open) return
    function handle(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open])

  function toggle(id) {
    onChange(value.includes(id) ? value.filter(i => i !== id) : [...value, id])
  }

  const triggerLabel = value.length === 0
    ? 'Select categories…'
    : value.length === allIds.length
      ? 'All categories'
      : value.length === 1
        ? RL_CATEGORIES.find(c => c.id === value[0])?.name ?? '1 category'
        : `${value.length} of ${allIds.length} categories`

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className={`w-full flex items-center gap-2 border rounded-lg px-3 py-2 text-sm transition-colors text-left
          ${open ? 'border-[#2a44d4] ring-1 ring-[#2a44d4]/20 bg-white' : 'border-gray-200 bg-white hover:bg-gray-50'}`}
      >
        <span className={`flex-1 truncate font-medium ${value.length === 0 ? 'text-gray-400' : 'text-gray-800'}`}>{triggerLabel}</span>
        {value.length > 0 && value.length < allIds.length && (
          <span className="text-[10px] font-bold text-[#2a44d4] bg-indigo-50 px-1.5 py-0.5 rounded-full flex-shrink-0">{value.length}</span>
        )}
        <ChevronDown size={14} className={`text-gray-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-[100] overflow-hidden">
          {/* Select all / clear row */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
            <button type="button" onMouseDown={e => e.preventDefault()}
              onClick={() => onChange([...allIds])}
              className="flex-1 text-xs font-semibold text-[#2a44d4] hover:text-[#2438b8] transition-colors text-left"
            >
              All categories
            </button>
            {value.length > 0 && (
              <button type="button" onMouseDown={e => e.preventDefault()}
                onClick={() => onChange([])}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          <div className="max-h-52 overflow-y-auto">
            {RL_CATEGORIES.map(cat => {
              const checked = value.includes(cat.id)
              const locked = lockedCats.includes(cat.id)
              const sel = categorySelections[cat.id]
              const gs  = DEFAULT_GUARDRAIL_SETS.find(s => s.id === sel.guardrailSetId)
              return (
                <div key={cat.id}
                  className={`flex items-center gap-2.5 px-3 py-2.5 cursor-pointer select-none transition-colors ${checked ? 'hover:bg-indigo-50' : 'hover:bg-gray-50'}`}
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => toggle(cat.id)}
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${checked ? 'bg-[#2a44d4] border-[#2a44d4]' : 'border-gray-300 bg-white'}`}>
                    {checked && <Check size={10} className="text-white" />}
                  </div>
                  <span className={`text-xs flex-1 leading-none ${checked ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>{cat.name}</span>
                  {locked
                    ? <CheckCircle2 size={11} className="text-green-500 flex-shrink-0" />
                    : <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border flex-shrink-0 ${gs?.colorClass}`}>{gs?.label}</span>
                  }
                </div>
              )
            })}
          </div>

          <div className="px-3 py-2.5 border-t border-gray-100 flex justify-end">
            <button type="button" onMouseDown={e => e.preventDefault()}
              onClick={() => setOpen(false)}
              className="text-xs font-semibold text-[#2a44d4] hover:text-[#2438b8] transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Guardrail set picker ─────────────────────────────────────────────────────

function GuardrailSetPicker({ value, onChange, onApply, hasSelection }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    function handle(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open])

  const gsA = DEFAULT_GUARDRAIL_SETS[0]
  const gsB = DEFAULT_GUARDRAIL_SETS[1]
  const ruleA = MARKDOWN_RULES.find(r => r.id === gsA.rule.ruleId)
  const ruleB = MARKDOWN_RULES.find(r => r.id === gsB.rule.ruleId)

  const options = [
    { id: 1, label: `Set A`, desc: ruleA?.label ?? gsA.constraintLabel, colorClass: gsA.colorClass },
    { id: 2, label: `Set B`, desc: ruleB?.label ?? gsB.constraintLabel, colorClass: gsB.colorClass },
  ]

  const selected = options.find(o => o.id === value)

  return (
    <div ref={ref}>
      <div className="relative">
        <button
          onClick={() => setOpen(v => !v)}
          className={`w-full flex items-center gap-2 border rounded-lg px-3 py-2 text-sm transition-colors text-left
            ${value !== null ? 'border-[#2a44d4] bg-indigo-50' : 'border-gray-200 bg-white hover:bg-gray-50'}`}
        >
          <span className="flex-1 truncate">
            {selected
              ? <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-1.5 py-0.5 rounded border ${selected.colorClass}`}>{selected.label}</span>
              : <span className="text-gray-400 text-sm">Apply guardrail set…</span>
            }
          </span>
          {value !== null && (
            <button type="button" onMouseDown={e => e.stopPropagation()}
              onClick={e => { e.stopPropagation(); onChange(null) }}
              className="text-gray-400 hover:text-gray-600 flex-shrink-0"
            >
              <X size={12} />
            </button>
          )}
          <ChevronDown size={14} className={`text-gray-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>

        {open && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
            {options.map(opt => (
              <button key={opt.id}
                onClick={() => {
                  onChange(opt.id)
                  if (hasSelection) onApply(opt.id)
                  setOpen(false)
                }}
                className={`w-full flex items-start gap-3 px-3 py-3 text-left transition-colors hover:bg-gray-50 ${value === opt.id ? 'bg-indigo-50' : ''}`}
              >
                <span className={`mt-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded border flex-shrink-0 ${opt.colorClass}`}>{opt.label}</span>
                <span className="flex-1 text-xs text-gray-600 leading-snug">{opt.desc}</span>
                {value === opt.id && <Check size={13} className="text-[#2a44d4] flex-shrink-0 mt-0.5" />}
              </button>
            ))}
          </div>
        )}
      </div>
      {value !== null && hasSelection && (
        <p className="text-[10px] text-indigo-600 mt-1.5">
          Applied at recommended depth. Click a chart point to refine.
        </p>
      )}
    </div>
  )
}

// ─── Preferences panel (sidebar) ─────────────────────────────────────────────

function PreferencesPanel({
  selectedCatIds, onCatIdsChange,
  categorySelections, lockedCats,
  pendingSetId, onPendingSetChange, onApplySet,
  compareMode, onCompareModeChange,
  viewGrossMargin, onViewGrossMarginChange,
  onConfirmLock, onUnlock,
}) {
  const hasUnlocked = selectedCatIds.some(id => !lockedCats.includes(id))
  const hasLocked   = selectedCatIds.some(id =>  lockedCats.includes(id))

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-1">Strategy Preferences</h3>
      <p className="text-[11px] text-gray-400 mb-4">Select categories and a guardrail set, then click a point on the chart.</p>

      {/* Category multi-select */}
      <div className="mb-3">
        <div className="text-xs font-medium text-gray-600 mb-1.5">Categories</div>
        <RLCategoryMultiSelect
          value={selectedCatIds}
          onChange={onCatIdsChange}
          categorySelections={categorySelections}
          lockedCats={lockedCats}
        />
      </div>

      {/* Guardrail set picker */}
      <div className="mb-4">
        <div className="text-xs font-medium text-gray-600 mb-1.5">Apply Guardrail Set</div>
        <GuardrailSetPicker
          value={pendingSetId}
          onChange={onPendingSetChange}
          onApply={onApplySet}
          hasSelection={selectedCatIds.length > 0}
        />
      </div>

      {/* Lock / unlock actions */}
      {selectedCatIds.length > 0 && (
        <div className="flex gap-2 mb-4">
          {hasUnlocked && (
            <button onClick={onConfirmLock}
              className="flex-1 py-2 rounded-lg text-xs font-semibold bg-[#2a44d4] hover:bg-[#2438b8] text-white transition-colors flex items-center justify-center gap-1.5"
            >
              <Lock size={11} /> Confirm & Lock
            </button>
          )}
          {hasLocked && (
            <button onClick={onUnlock}
              className="flex-1 py-2 rounded-lg text-xs font-medium border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5"
            >
              <LockOpen size={11} /> Unlock
            </button>
          )}
        </div>
      )}

      {/* Toggles */}
      <div className="flex flex-col gap-3 pt-3 border-t border-gray-100">
        <Toggle
          label={<span className="flex items-center gap-1"><ArrowRightLeft size={11} /> Compare scenarios</span>}
          value={compareMode}
          onChange={onCompareModeChange}
        />
        <Toggle label="View gross margin ($)" value={viewGrossMargin} onChange={onViewGrossMarginChange} />
      </div>

      {/* Confirmed categories */}
      {lockedCats.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Confirmed</p>
            <span className="text-[10px] font-bold text-green-600 bg-green-50 border border-green-100 px-1.5 py-0.5 rounded-full">
              {lockedCats.length} / {RL_CATEGORIES.length}
            </span>
          </div>
          <div className="space-y-1">
            {RL_CATEGORIES.filter(c => lockedCats.includes(c.id)).map(cat => {
              const sel   = categorySelections[cat.id]
              const curve = sel.guardrailSetId === 1 ? SET_A_CURVE : SET_B_CURVE
              const point = curve.find(p => p.id === sel.pointId)
              const gs    = DEFAULT_GUARDRAIL_SETS.find(s => s.id === sel.guardrailSetId)
              return (
                <div key={cat.id} className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs bg-gray-50">
                  <CheckCircle2 size={11} className="text-green-500 flex-shrink-0" />
                  <span className="flex-1 text-left text-gray-700 font-medium truncate">{cat.name}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border flex-shrink-0 ${gs?.colorClass}`}>{gs?.label}</span>
                  <span className="text-gray-500 font-semibold tabular-nums flex-shrink-0">{point?.pct}%</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
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
        Each guardrail set generates its own output curve. After optimisation you'll select categories, assign a guardrail set, and click points on the chart to choose markdown depth.
      </p>
      <div className="flex items-center gap-3 mb-6 flex-wrap justify-center">
        {DEFAULT_GUARDRAIL_SETS.map(gs => (
          <span key={gs.id} className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border ${gs.colorClass}`}>
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: gs.accentColor }} />
            {gs.label} — {gs.constraintLabel}
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
      <button onClick={onDismiss} className="text-gray-500 hover:text-gray-300 flex-shrink-0"><X size={13} /></button>
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
  const [selectedCatIds, setSelectedCatIds] = useState([])
  const [pendingSetId, setPendingSetId]     = useState(null)
  const [viewSetId, setViewSetId]           = useState(1)
  const [compareMode, setCompareMode]       = useState(false)
  const [comparePoints, setComparePoints]   = useState([])
  const [saveToast, setSaveToast]           = useState(null)
  const [viewGrossMargin, setViewGrossMargin] = useState(false)

  const isPostOpt = ['Optimised', 'Live', 'Completed'].includes(status)
  const blended   = isPostOpt ? computeBlended(categorySelections) : null
  const stats     = blended ? buildStats(blended) : null

  const setARule = MARKDOWN_RULES.find(r => r.id === DEFAULT_GUARDRAIL_SETS[0].rule.ruleId)
  const setBRule = MARKDOWN_RULES.find(r => r.id === DEFAULT_GUARDRAIL_SETS[1].rule.ruleId)

  function handleApplySet(setId) {
    setViewSetId(setId)
    const curve = setId === 1 ? SET_A_CURVE : SET_B_CURVE
    const recPoint = curve.find(p => p.recommended) ?? curve[0]
    const update = {}
    selectedCatIds.forEach(catId => {
      if (!lockedCats.includes(catId)) update[catId] = { guardrailSetId: setId, pointId: recPoint.id }
    })
    if (Object.keys(update).length > 0) {
      onSelectionsChange(prev => ({ ...prev, ...update }))
    }
  }

  function handlePointClick(point, setId) {
    if (compareMode) {
      setComparePoints(prev => {
        const exists = prev.find(p => p.setId === setId && p.pointId === point.id)
        if (exists) return prev.filter(p => !(p.setId === setId && p.pointId === point.id))
        if (prev.length >= 2) return [prev[1], { setId, pointId: point.id }]
        return [...prev, { setId, pointId: point.id }]
      })
    }
    if (selectedCatIds.length > 0) {
      const unlocked = selectedCatIds.filter(id => !lockedCats.includes(id))
      if (unlocked.length === 0) return
      const update = {}
      unlocked.forEach(catId => { update[catId] = { guardrailSetId: setId, pointId: point.id } })
      onSelectionsChange(prev => ({ ...prev, ...update }))
      if (pendingSetId !== setId) setPendingSetId(setId)
    }
  }

  function handleCategoryClick(catId) {
    setSelectedCatIds(prev =>
      prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
    )
  }

  function handleConfirmLock() {
    const toAdd = selectedCatIds.filter(id => !lockedCats.includes(id))
    if (toAdd.length > 0) onLockedCatsChange(prev => [...new Set([...prev, ...toAdd])])
    setSelectedCatIds([])
    setPendingSetId(null)
  }

  function handleUnlock() {
    onLockedCatsChange(prev => prev.filter(id => !selectedCatIds.includes(id)))
  }

  function handleSave() {
    const name = 'Scenario — RL SS26'
    setSaveToast({ name })
    onScenarioSaved?.({
      name,
      lockedCategoryNames: RL_CATEGORIES.filter(c => lockedCats.includes(c.id)).map(c => c.name),
    })
  }

  if (!isPostOpt) return <PreOptimisationState />

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
              <StatCard key={s.label} label={s.label} value={s.value} change={s.change} delta={s.delta} negative={s.negative} color={s.color} />
            ))}
          </div>
        </div>
      )}

      {/* Main grid */}
      <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 300px' }}>

        {/* Chart panel */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col">
          <div className="mb-2">
            <h3 className="text-sm font-semibold text-gray-900">Sell-Through Rate vs Gross Margin</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Select a point to see projected outcomes, or enable Compare to evaluate two scenarios side by side.
            </p>
          </div>

          {/* Compare mode banner */}
          {compareMode && (
            <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-2 mb-2 text-xs text-indigo-700">
              <ArrowRightLeft size={12} />
              Compare mode active — select two points to compare scenarios side by side.
              <span className="ml-auto text-indigo-500">{comparePoints.length}/2</span>
            </div>
          )}

          {/* Selection banner */}
          {selectedCatIds.length > 0 && !compareMode && (
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 mb-2 text-xs text-blue-700">
              <Info size={12} className="flex-shrink-0" />
              <span>
                <strong>{selectedCatIds.length === RL_CATEGORIES.length ? 'All' : selectedCatIds.length} {selectedCatIds.length === 1 ? 'category' : 'categories'}</strong> selected — click a point on either curve to assign.
              </span>
              <button onClick={() => setSelectedCatIds([])} className="ml-auto text-blue-400 hover:text-blue-600"><X size={11} /></button>
            </div>
          )}

          {/* Legend — shows active set only */}
          <div className="flex items-center gap-5 mb-3 flex-wrap text-xs text-gray-500">
            {viewSetId === 1 ? (
              <span className="flex items-center gap-2">
                <svg width={28} height={8}><line x1={0} y1={4} x2={28} y2={4} stroke="#2a44d4" strokeWidth={2} /></svg>
                <span><strong className="text-[#2a44d4]">Set A</strong> — {setARule?.label ?? DEFAULT_GUARDRAIL_SETS[0].constraintLabel}</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <svg width={28} height={8}><line x1={0} y1={4} x2={28} y2={4} stroke="#d97706" strokeWidth={2} strokeDasharray="5 3" /></svg>
                <span><strong className="text-amber-600">Set B</strong> — {setBRule?.label ?? DEFAULT_GUARDRAIL_SETS[1].constraintLabel}</span>
              </span>
            )}
            <span className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 inline-flex items-center justify-center text-white text-[8px] font-black">★</span>
              PEAK Recommended
            </span>
          </div>

          <div className="flex-1 min-h-0" style={{ height: 310 }}>
            <ScenarioChart
              categorySelections={categorySelections}
              selectedCatIds={selectedCatIds}
              onPointClick={handlePointClick}
              onCategoryClick={handleCategoryClick}
              compareMode={compareMode}
              comparePoints={comparePoints}
              viewSetId={viewSetId}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-3">
          <PreferencesPanel
            selectedCatIds={selectedCatIds}
            onCatIdsChange={setSelectedCatIds}
            categorySelections={categorySelections}
            lockedCats={lockedCats}
            pendingSetId={pendingSetId}
            onPendingSetChange={setPendingSetId}
            onApplySet={handleApplySet}
            compareMode={compareMode}
            onCompareModeChange={() => { setCompareMode(v => !v); setComparePoints([]) }}
            viewGrossMargin={viewGrossMargin}
            onViewGrossMarginChange={() => setViewGrossMargin(v => !v)}
            onConfirmLock={handleConfirmLock}
            onUnlock={handleUnlock}
          />
          <MarkdownDistribution />
        </div>
      </div>

      {saveToast && <SaveToast name={saveToast.name} onDismiss={() => setSaveToast(null)} />}
    </div>
  )
}
