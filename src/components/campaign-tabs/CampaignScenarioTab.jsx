import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check, Save, X, ArrowRightLeft, Plus, Info } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts'
import StatCard from '../StatCard'

// ─── Data ────────────────────────────────────────────────────────────────────

// num fields are the raw numbers behind the display strings, used for live KPI computation
const allPoints = [
  { id: 1,  x: 88, y: 70, type: 'scenario', markdown: 5,  label: '5% markdown',               products: 26, avgPrice: '$148.20', revenue: '$168.4K', avgMarkdown: '5.0%',  grossMargin: '$44.2K', sellThrough: '70.0%', num: { avgPrice: 148.20, revenue: 168400, avgMarkdown: 5.0,  grossMargin: 44200, sellThrough: 70.0 } },
  { id: 2,  x: 82, y: 73, type: 'scenario', markdown: 10, label: '10% markdown',              products: 26, avgPrice: '$141.50', revenue: '$178.2K', avgMarkdown: '10.2%', grossMargin: '$42.1K', sellThrough: '73.0%', num: { avgPrice: 141.50, revenue: 178200, avgMarkdown: 10.2, grossMargin: 42100, sellThrough: 73.0 } },
  { id: 3,  x: 76, y: 76, type: 'scenario', markdown: 15, label: '15% markdown',              products: 26, avgPrice: '$134.80', revenue: '$188.6K', avgMarkdown: '15.1%', grossMargin: '$40.3K', sellThrough: '76.0%', num: { avgPrice: 134.80, revenue: 188600, avgMarkdown: 15.1, grossMargin: 40300, sellThrough: 76.0 } },
  { id: 4,  x: 68, y: 80, type: 'scenario', markdown: 20, label: '20% markdown',              products: 26, avgPrice: '$126.20', revenue: '$198.4K', avgMarkdown: '20.3%', grossMargin: '$38.1K', sellThrough: '80.0%', num: { avgPrice: 126.20, revenue: 198400, avgMarkdown: 20.3, grossMargin: 38100, sellThrough: 80.0 } },
  { id: 5,  x: 57, y: 84, type: 'scenario', markdown: 25, label: '25% markdown',              products: 26, avgPrice: '$116.40', revenue: '$206.8K', avgMarkdown: '25.0%', grossMargin: '$36.8K', sellThrough: '84.0%', num: { avgPrice: 116.40, revenue: 206800, avgMarkdown: 25.0, grossMargin: 36800, sellThrough: 84.0 } },
  { id: 6,  x: 46, y: 87, type: 'peak',     markdown: 30, label: '30% (Peak rec.)',           products: 26, avgPrice: '$128.97', revenue: '$212.8K', avgMarkdown: '10.3%', grossMargin: '$36.2K', sellThrough: '87.0%', num: { avgPrice: 128.97, revenue: 212800, avgMarkdown: 10.3, grossMargin: 36200, sellThrough: 87.0 } },
  { id: 7,  x: 36, y: 88, type: 'scenario', markdown: 35, label: '35% markdown',              products: 26, avgPrice: '$105.70', revenue: '$216.3K', avgMarkdown: '35.2%', grossMargin: '$34.9K', sellThrough: '88.0%', num: { avgPrice: 105.70, revenue: 216300, avgMarkdown: 35.2, grossMargin: 34900, sellThrough: 88.0 } },
  { id: 8,  x: 27, y: 89, type: 'scenario', markdown: 40, label: '40% markdown',              products: 26, avgPrice: '$97.30',  revenue: '$218.0K', avgMarkdown: '40.0%', grossMargin: '$33.1K', sellThrough: '89.0%', num: { avgPrice: 97.30,  revenue: 218000, avgMarkdown: 40.0, grossMargin: 33100, sellThrough: 89.0 } },
  { id: 9,  x: 18, y: 90, type: 'scenario', markdown: 45, label: '45% markdown',              products: 26, avgPrice: '$88.90',  revenue: '$219.4K', avgMarkdown: '45.1%', grossMargin: '$31.8K', sellThrough: '90.0%', num: { avgPrice: 88.90,  revenue: 219400, avgMarkdown: 45.1, grossMargin: 31800, sellThrough: 90.0 } },
  { id: 10, x: 11, y: 91, type: 'scenario', markdown: 50, label: '50% markdown',              products: 26, avgPrice: '$81.20',  revenue: '$220.1K', avgMarkdown: '50.0%', grossMargin: '$30.0K', sellThrough: '91.0%', num: { avgPrice: 81.20,  revenue: 220100, avgMarkdown: 50.0, grossMargin: 30000, sellThrough: 91.0 } },
  { id: 11, x: 72, y: 68, type: 'flat',     markdown: 20, label: 'Flat 20%',                  products: 26, avgPrice: '$126.20', revenue: '$182.1K', avgMarkdown: '20.0%', grossMargin: '$32.4K', sellThrough: '68.0%', num: { avgPrice: 126.20, revenue: 182100, avgMarkdown: 20.0, grossMargin: 32400, sellThrough: 68.0 } },
  { id: 12, x: 62, y: 65, type: 'flat',     markdown: 25, label: 'Flat 25%',                  products: 26, avgPrice: '$117.80', revenue: '$189.6K', avgMarkdown: '25.0%', grossMargin: '$30.8K', sellThrough: '65.0%', num: { avgPrice: 117.80, revenue: 189600, avgMarkdown: 25.0, grossMargin: 30800, sellThrough: 65.0 } },
  { id: 13, x: 51, y: 63, type: 'flat',     markdown: 30, label: 'Flat 30%',                  products: 26, avgPrice: '$108.60', revenue: '$194.2K', avgMarkdown: '30.0%', grossMargin: '$28.5K', sellThrough: '63.0%', num: { avgPrice: 108.60, revenue: 194200, avgMarkdown: 30.0, grossMargin: 28500, sellThrough: 63.0 } },
  { id: 14, x: 40, y: 66, type: 'flat',     markdown: 35, label: 'Flat 35%',                  products: 26, avgPrice: '$99.20',  revenue: '$197.8K', avgMarkdown: '35.0%', grossMargin: '$26.9K', sellThrough: '66.0%', num: { avgPrice: 99.20,  revenue: 197800, avgMarkdown: 35.0, grossMargin: 26900, sellThrough: 66.0 } },
  { id: 15, x: 29, y: 70, type: 'flat',     markdown: 40, label: 'Flat 40%',                  products: 26, avgPrice: '$89.90',  revenue: '$199.4K', avgMarkdown: '40.0%', grossMargin: '$25.1K', sellThrough: '70.0%', num: { avgPrice: 89.90,  revenue: 199400, avgMarkdown: 40.0, grossMargin: 25100, sellThrough: 70.0 } },
  { id: 16, x: 60, y: 91, type: 'custom',   markdown: 22, label: 'Custom: Coats 25%, Knitwear 18%', products: 26, avgPrice: '$124.40', revenue: '$210.2K', avgMarkdown: '22.1%', grossMargin: '$37.8K', sellThrough: '91.0%', num: { avgPrice: 124.40, revenue: 210200, avgMarkdown: 22.1, grossMargin: 37800, sellThrough: 91.0 } },
]

// Target baseline = peak recommended (id 6)
const TARGET = { avgPrice: 128.97, revenue: 212800, avgMarkdown: 10.3, grossMargin: 36200, sellThrough: 87.0 }

const distributionData = [
  { bucket: '>5%', count: 22 }, { bucket: '>10%', count: 10 }, { bucket: '>15%', count: 26 },
  { bucket: '>20%', count: 15 }, { bucket: '>25%', count: 24 }, { bucket: '>30%', count: 26 },
  { bucket: '>35%', count: 28 }, { bucket: '>40%', count: 14 }, { bucket: '>45%', count: 10 },
  { bucket: '>50%', count: 8 },  { bucket: '>55%', count: 12 }, { bucket: '55%+', count: 5 },
]

const SCENARIO_TYPES = [
  { value: 'default',    label: '(Default) Sell-Through vs Gross Margin' },
  { value: 'guardrails', label: 'Guardrails' },
]

const guardrailSets = [
  {
    id: 'high-margin',
    name: 'High Margin Protection',
    description: 'Maximizes margin while maintaining moderate sell-through',
    revenue: '$213K', margin: '42.5%', sellThru: '78.2%', maxDisc: '40.0%',
    dot: '#3b82f6',
    num: { revenue: 213000, margin: 42.5, sellThru: 78.2, maxDisc: 40.0 },
  },
  {
    id: 'balanced',
    name: 'Balanced Strategy',
    description: 'Optimizes across all metrics with balanced constraints',
    revenue: '$229K', margin: '39.2%', sellThru: '85.4%', maxDisc: '50.0%',
    dot: '#22c55e',
    num: { revenue: 229000, margin: 39.2, sellThru: 85.4, maxDisc: 50.0 },
  },
  {
    id: 'aggressive',
    name: 'Aggressive Clearance',
    description: 'Prioritizes inventory clearance with deeper discounts',
    revenue: '$198K', margin: '35.8%', sellThru: '92.5%', maxDisc: '60.0%',
    dot: '#f59e0b',
    num: { revenue: 198000, margin: 35.8, sellThru: 92.5, maxDisc: 60.0 },
  },
]

const guardrailCategories = [
  {
    id: 1, name: "Women's Dresses",
    metrics: {
      'high-margin': { st: '76.5%', m: '44.2%', r: '$3K' },
      'balanced':    { st: '84.7%', m: '40.5%', r: '$3K' },
      'aggressive':  { st: '76.5%', m: '44.2%', r: '$3K' },
    },
  },
  {
    id: 2, name: "Women's Knitwear",
    metrics: {
      'high-margin': { st: '68.0%', m: '38.1%', r: '$4K' },
      'balanced':    { st: '79.3%', m: '35.6%', r: '$4K' },
      'aggressive':  { st: '88.1%', m: '31.2%', r: '$4K' },
    },
  },
  {
    id: 3, name: "Men's Outerwear",
    metrics: {
      'high-margin': { st: '71.2%', m: '46.0%', r: '$5K' },
      'balanced':    { st: '82.4%', m: '42.1%', r: '$5K' },
      'aggressive':  { st: '91.0%', m: '37.5%', r: '$5K' },
    },
  },
  {
    id: 4, name: 'Accessories',
    metrics: {
      'high-margin': { st: '80.0%', m: '51.3%', r: '$2K' },
      'balanced':    { st: '88.2%', m: '47.0%', r: '$2K' },
      'aggressive':  { st: '94.3%', m: '40.0%', r: '$2K' },
    },
  },
  {
    id: 5, name: 'Footwear',
    metrics: {
      'high-margin': { st: '65.4%', m: '40.2%', r: '$6K' },
      'balanced':    { st: '76.8%', m: '36.9%', r: '$6K' },
      'aggressive':  { st: '86.5%', m: '32.4%', r: '$6K' },
    },
  },
  {
    id: 6, name: 'Home & Lifestyle',
    metrics: {
      'high-margin': { st: '72.1%', m: '43.7%', r: '$2K' },
      'balanced':    { st: '83.5%', m: '39.8%', r: '$2K' },
      'aggressive':  { st: '90.2%', m: '34.5%', r: '$2K' },
    },
  },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function catmullRomPath(pts) {
  if (pts.length < 2) return ''
  const segs = []
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[Math.min(i + 2, pts.length - 1)]
    const cp1x = p1.cx + (p2.cx - p0.cx) / 6
    const cp1y = p1.cy + (p2.cy - p0.cy) / 6
    const cp2x = p2.cx - (p3.cx - p1.cx) / 6
    const cp2y = p2.cy - (p3.cy - p1.cy) / 6
    if (i === 0) segs.push(`M ${p1.cx} ${p1.cy}`)
    segs.push(`C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.cx} ${p2.cy}`)
  }
  return segs.join(' ')
}

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

// ─── KPI computation ──────────────────────────────────────────────────────────

function pctDiff(val, base) {
  const d = ((val - base) / Math.abs(base)) * 100
  return (d >= 0 ? '+' : '') + d.toFixed(1) + '% vs target'
}

function fmtRevenue(n) {
  if (n >= 1e6) return '€' + (n / 1e6).toFixed(1) + 'M'
  return '$' + (n / 1000).toFixed(0) + 'K'
}

function computeScenarioStats(point) {
  const n = point.num
  return [
    { label: 'Avg Selling Price',      value: point.avgPrice,    change: pctDiff(n.avgPrice,    TARGET.avgPrice),    negative: n.avgPrice    < TARGET.avgPrice,    color: 'blue'  },
    { label: 'Avg. Markdown',          value: point.avgMarkdown, change: pctDiff(n.avgMarkdown, TARGET.avgMarkdown), negative: n.avgMarkdown > TARGET.avgMarkdown, color: 'amber' },
    { label: 'Predicted Gross Margin', value: point.grossMargin, change: pctDiff(n.grossMargin, TARGET.grossMargin), negative: n.grossMargin < TARGET.grossMargin, color: 'green' },
    { label: 'Predicted Sell-Through', value: point.sellThrough, change: pctDiff(n.sellThrough, TARGET.sellThrough), negative: n.sellThrough < TARGET.sellThrough, color: 'green' },
    { label: 'Predicted Revenue',      value: point.revenue,     change: pctDiff(n.revenue,     TARGET.revenue),     negative: n.revenue     < TARGET.revenue,     color: 'blue'  },
    { label: 'Total Products',         value: String(point.products), change: null, negative: false, color: 'slate' },
  ]
}

function computeGuardrailStats(selectedGuardrails) {
  const n = guardrailCategories.length
  const catMetrics = guardrailCategories.map(cat => {
    const m = cat.metrics[selectedGuardrails[cat.id]]
    return {
      st: parseFloat(m.st),
      margin: parseFloat(m.m),
    }
  })
  const avgST     = catMetrics.reduce((s, m) => s + m.st, 0) / n
  const avgMargin = catMetrics.reduce((s, m) => s + m.margin, 0) / n

  // Weighted average revenue from guardrail set selection
  const counts = {}
  Object.values(selectedGuardrails).forEach(id => { counts[id] = (counts[id] || 0) + 1 })
  const totalWeight = Object.values(counts).reduce((s, w) => s + w, 0)
  const weightedRevenue  = Object.entries(counts).reduce((s, [id, w]) => s + guardrailSets.find(g => g.id === id).num.revenue  * (w / totalWeight), 0)
  const weightedMaxDisc  = Object.entries(counts).reduce((s, [id, w]) => s + guardrailSets.find(g => g.id === id).num.maxDisc  * (w / totalWeight), 0)
  const weightedSellThru = Object.entries(counts).reduce((s, [id, w]) => s + guardrailSets.find(g => g.id === id).num.sellThru * (w / totalWeight), 0)

  // Guardrail targets (balanced strategy as baseline)
  const base = guardrailSets.find(g => g.id === 'balanced').num
  return [
    { label: 'Avg. Markdown',          value: weightedMaxDisc.toFixed(1) + '%', change: pctDiff(weightedMaxDisc,  base.maxDisc),  negative: weightedMaxDisc  > base.maxDisc,  color: 'amber' },
    { label: 'Avg Selling Price',       value: '30.3%',                          change: null,                                    negative: false,                              color: 'blue'  },
    { label: 'Predicted Gross Margin', value: avgMargin.toFixed(1) + '%',        change: pctDiff(avgMargin,        base.margin),   negative: avgMargin        < base.margin,   color: 'green' },
    { label: 'Predicted Sell-Through', value: avgST.toFixed(1) + '%',            change: pctDiff(avgST,            base.sellThru), negative: avgST            < base.sellThru, color: 'green' },
    { label: 'Predicted Revenue',      value: fmtRevenue(weightedRevenue),       change: pctDiff(weightedRevenue,  base.revenue),  negative: weightedRevenue  < base.revenue,  color: 'blue'  },
    { label: 'Total Products',         value: '12,492',                          change: null,                                    negative: false,                              color: 'slate' },
  ]
}

// ─── Stats bar ────────────────────────────────────────────────────────────────

function StatsBar({ stats }) {
  return (
    <div className="grid grid-cols-6 gap-3 mb-4">
      {stats.map(s => (
        <StatCard key={s.label} label={s.label} value={s.value} change={s.change} negative={s.negative} color={s.color} />
      ))}
    </div>
  )
}

// ─── Custom SVG Scatter Chart ────────────────────────────────────────────────

function ScenarioChart({ points, selectedIds, onPointClick, compareMode }) {
  const wrapperRef = useRef(null)
  const [W, setW] = useState(540)
  const [H, setH] = useState(320)

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

  const pad = { top: 16, right: 24, bottom: 48, left: 52 }
  const cW = W - pad.left - pad.right
  const cH = H - pad.top - pad.bottom

  const xD = [0, 100], yD = [60, 95]
  const sx = x => pad.left + ((x - xD[0]) / (xD[1] - xD[0])) * cW
  const sy = y => pad.top + ((yD[1] - y) / (yD[1] - yD[0])) * cH

  const xTicks = [0, 20, 40, 60, 80, 100]
  const yTicks = [60, 65, 70, 75, 80, 85, 90, 95]

  const curvePoints = points
    .filter(p => p.type === 'scenario' || p.type === 'peak')
    .sort((a, b) => a.x - b.x)
    .map(p => ({ cx: sx(p.x), cy: sy(p.y) }))

  const pathD = catmullRomPath(curvePoints)

  function renderShape(p, cx, cy, isSelected, isCompareB) {
    const selFill = isCompareB ? '#f97316' : '#4f46e5'
    const r = isSelected ? 7 : 5
    if (p.type === 'peak') return (
      <circle cx={cx} cy={cy} r={r} fill={isSelected ? selFill : '#4f46e5'} stroke="#fff" strokeWidth={isSelected ? 2 : 1.5} />
    )
    if (p.type === 'flat') {
      const s = isSelected ? 9 : 7
      return <rect x={cx - s / 2} y={cy - s / 2} width={s} height={s} fill={isSelected ? selFill : 'none'} stroke={isSelected ? selFill : '#16a34a'} strokeWidth={1.5} />
    }
    if (p.type === 'custom') {
      const s = isSelected ? 8 : 6
      const pts = `${cx},${cy - s} ${cx + s},${cy + s * 0.6} ${cx - s},${cy + s * 0.6}`
      return <polygon points={pts} fill={isSelected ? selFill : 'none'} stroke={isSelected ? selFill : '#f97316'} strokeWidth={1.5} />
    }
    return <circle cx={cx} cy={cy} r={r} fill={isSelected ? selFill : 'none'} stroke={isSelected ? '#fff' : '#4f46e5'} strokeWidth={isSelected ? 2 : 1.5} style={isSelected ? { filter: `drop-shadow(0 0 3px ${selFill})` } : {}} />
  }

  return (
    <div ref={wrapperRef} className="w-full h-full">
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ display: 'block' }}>
        {xTicks.map(x => <line key={x} x1={sx(x)} y1={pad.top} x2={sx(x)} y2={pad.top + cH} stroke="#f0f0f0" strokeWidth={1} />)}
        {yTicks.map(y => <line key={y} x1={pad.left} y1={sy(y)} x2={pad.left + cW} y2={sy(y)} stroke="#f0f0f0" strokeWidth={1} />)}
        <path d={pathD} fill="none" stroke="#4f46e5" strokeWidth={1.5} opacity={0.5} />
        {xTicks.map(x => (
          <text key={x} x={sx(x)} y={pad.top + cH + 16} textAnchor="middle" fill="#9ca3af" fontSize={10}>{x}</text>
        ))}
        <text x={pad.left + cW / 2} y={H - 4} textAnchor="middle" fill="#6b7280" fontSize={10}>Predicted gross margin (%)</text>
        {yTicks.map(y => (
          <text key={y} x={pad.left - 6} y={sy(y) + 3} textAnchor="end" fill="#9ca3af" fontSize={10}>{y}</text>
        ))}
        <text x={12} y={pad.top + cH / 2} textAnchor="middle" fill="#6b7280" fontSize={10} transform={`rotate(-90, 12, ${pad.top + cH / 2})`}>Predicted sell-through rate (%)</text>
        {points.map(p => {
          const cx = sx(p.x), cy = sy(p.y)
          const selIdx = selectedIds.indexOf(p.id)
          const isSelected = selIdx >= 0
          const isCompareB = compareMode && selIdx === 1
          return (
            <g key={p.id} onClick={() => onPointClick(p)} style={{ cursor: 'pointer' }}>
              <circle cx={cx} cy={cy} r={14} fill="transparent" />
              {renderShape(p, cx, cy, isSelected, isCompareB)}
              {isSelected && (
                <circle cx={cx} cy={cy} r={12} fill="none" stroke={isCompareB ? '#f97316' : '#4f46e5'} strokeWidth={1} strokeDasharray="2 2" opacity={0.5} />
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}

// ─── Guardrail card ───────────────────────────────────────────────────────────

function GuardrailCard({ set }) {
  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-white">
      <div className="text-sm font-semibold text-gray-900 mb-1">{set.name}</div>
      <div className="text-xs text-gray-500 mb-3 leading-snug">{set.description}</div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
        <div>
          <div className="text-xs text-gray-400">Revenue</div>
          <div className="text-xs font-semibold text-gray-800">{set.revenue}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Margin</div>
          <div className="text-xs font-semibold text-gray-800">{set.margin}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Sell-thru</div>
          <div className="text-xs font-semibold text-gray-800">{set.sellThru}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Max disc.</div>
          <div className="text-xs font-semibold text-gray-800">{set.maxDisc}</div>
        </div>
      </div>
    </div>
  )
}

// ─── Guardrail category table ─────────────────────────────────────────────────

function GuardrailTable({ categories, selectedGuardrails, onSelect }) {
  return (
    <div>
      <p className="flex items-start gap-1.5 text-xs text-gray-400 mb-3">
        <Info size={13} className="flex-shrink-0 mt-0.5 text-gray-400" />
        Click a cell to apply a guardrail set to each category. Different categories can use different constraint strategies.
      </p>
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left font-medium text-gray-600 pb-2 pr-4 w-36">Category</th>
            {guardrailSets.map(set => (
              <th key={set.id} className="text-left font-medium text-gray-600 pb-2 px-3">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full inline-block flex-shrink-0" style={{ backgroundColor: set.dot }} />
                  {set.name}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {categories.map(cat => (
            <tr key={cat.id} className="border-b border-gray-50">
              <td className="py-3 pr-4 font-medium text-gray-800 text-xs">{cat.name}</td>
              {guardrailSets.map(set => {
                const isSelected = selectedGuardrails[cat.id] === set.id
                const m = cat.metrics[set.id]
                return (
                  <td
                    key={set.id}
                    className="py-3 px-3 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => onSelect(cat.id, set.id)}
                  >
                    <div className={`text-xs leading-relaxed ${isSelected ? 'text-green-600' : 'text-gray-500'}`}>
                      <div>ST: {m.st}</div>
                      <div>M: {m.m}</div>
                      <div>R: {m.r}</div>
                    </div>
                    {isSelected && (
                      <span className="inline-block mt-1 bg-green-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                        Selected
                      </span>
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Markdown distribution chart ─────────────────────────────────────────────

function MarkdownDistribution({ highlightIndex }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <h4 className="text-xs font-semibold text-gray-900 mb-0.5">Markdown Distribution</h4>
      <p className="text-xs text-gray-400 mb-2">Each bar's height shows the count of location/product combos in that markdown range.</p>
      <ResponsiveContainer width="100%" height={150}>
        <BarChart data={distributionData} margin={{ top: 4, right: 0, left: -22, bottom: 0 }}>
          <XAxis dataKey="bucket" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 8 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 8 }} domain={[0, 40]} ticks={[0, 10, 20, 30, 40]} />
          <Bar dataKey="count" radius={[2, 2, 0, 0]}>
            {distributionData.map((_, i) => (
              <Cell key={i} fill={highlightIndex === i ? '#4f46e5' : '#c7d2fe'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="text-center text-xs text-gray-400 -mt-1">Markdown Bucket</div>
    </div>
  )
}

// ─── Preferences panel (right sidebar) ───────────────────────────────────────

function PreferencesPanel({
  scenarioType, onScenarioTypeChange,
  category, onCategoryChange,
  viewGrossMargin, onViewGrossMarginChange,
  compareMode, onCompareModeChange,
  flatDiscounts, onFlatDiscountsChange,
}) {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)
  const isGuardrails = scenarioType === 'guardrails'

  useEffect(() => {
    if (!open) return
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const currentLabel = SCENARIO_TYPES.find(t => t.value === scenarioType)?.label ?? ''

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">
        Scenario Planning Preferences <span className="font-normal text-gray-400">(optional)</span>
      </h3>

      {/* Scenario Type */}
      <div className="mb-3" ref={dropdownRef}>
        <div className="text-xs text-gray-500 mb-1.5">Scenario Type:</div>
        <div className="relative">
          <button
            onClick={() => setOpen(v => !v)}
            className="w-full flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <span className="flex-1 text-left truncate">{currentLabel}</span>
            <ChevronDown size={14} className="text-gray-400 flex-shrink-0" />
          </button>
          {open && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
              {SCENARIO_TYPES.map(t => (
                <button
                  key={t.value}
                  onClick={() => { onScenarioTypeChange(t.value); setOpen(false) }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center justify-between
                    ${t.value === scenarioType ? 'text-[#2a44d4] font-medium' : 'text-gray-700'}`}
                >
                  {t.label}
                  {t.value === scenarioType && <Check size={13} className="text-[#2a44d4]" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Category */}
      <div className="mb-4">
        <div className="text-xs text-gray-500 mb-1.5">Category:</div>
        <button className="w-full flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
          <span className="flex-1 text-left">{category}</span>
          <ChevronDown size={14} className="text-gray-400 flex-shrink-0" />
        </button>
      </div>

      {/* Toggles */}
      <div className="flex flex-col gap-3">
        <Toggle label="View gross margin ($)" value={viewGrossMargin} onChange={onViewGrossMarginChange} />
        {!isGuardrails && (
          <>
            <Toggle
              label={<span className="flex items-center gap-1"><ArrowRightLeft size={11} /> Compare scenarios</span>}
              value={compareMode}
              onChange={onCompareModeChange}
            />
            <Toggle label="Flat discounts" value={flatDiscounts} onChange={onFlatDiscountsChange} />
          </>
        )}
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function CampaignScenarioTab() {
  const [scenarioType, setScenarioType] = useState('default')
  const [category, setCategory] = useState('All')
  const [viewGrossMargin, setViewGrossMargin] = useState(false)
  const [compareMode, setCompareMode] = useState(false)
  const [flatDiscounts, setFlatDiscounts] = useState(true)
  const [selectedIds, setSelectedIds] = useState([6])
  const [savedScenario, setSavedScenario] = useState(null)
  const [showSaveConfirm, setShowSaveConfirm] = useState(false)
  const [selectedGuardrails, setSelectedGuardrails] = useState(
    Object.fromEntries(guardrailCategories.map(c => [c.id, 'balanced']))
  )

  const isGuardrails = scenarioType === 'guardrails'
  const displayPoints = flatDiscounts ? allPoints : allPoints.filter(p => p.type !== 'flat')
  const primaryPoint = allPoints.find(p => p.id === selectedIds[0]) || null
  const comparePoint = compareMode && selectedIds.length === 2
    ? allPoints.find(p => p.id === selectedIds[1])
    : null

  function handlePointClick(p) {
    if (compareMode) {
      setSelectedIds(prev => {
        if (prev.includes(p.id)) return prev.filter(id => id !== p.id)
        if (prev.length >= 2) return [prev[1], p.id]
        return [...prev, p.id]
      })
    } else {
      setSelectedIds(prev => prev.includes(p.id) ? [] : [p.id])
    }
  }

  function handleSave() {
    setSavedScenario(allPoints.find(p => p.id === selectedIds[0]))
    setShowSaveConfirm(true)
    setTimeout(() => setShowSaveConfirm(false), 3000)
  }

  const distributionHighlight = primaryPoint ? Math.floor(primaryPoint.markdown / 5) - 1 : -1

  const kpiStats = isGuardrails
    ? computeGuardrailStats(selectedGuardrails)
    : computeScenarioStats(primaryPoint || allPoints.find(p => p.id === 6))

  return (
    <div>
      {/* Stats bar */}
      <StatsBar stats={kpiStats} />

      {/* Body */}
      <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 300px' }}>

        {/* ── Left: guardrails view ─────────────────────────────────────────── */}
        {isGuardrails && (
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">Guardrail Sets to Compare</h3>
              <button className="flex items-center gap-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50">
                <Plus size={13} /> Create Custom
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-5">
              {guardrailSets.map(set => <GuardrailCard key={set.id} set={set} />)}
            </div>
            <GuardrailTable
              categories={guardrailCategories}
              selectedGuardrails={selectedGuardrails}
              onSelect={(catId, setId) => setSelectedGuardrails(prev => ({ ...prev, [catId]: setId }))}
            />
          </div>
        )}

        {/* ── Left: default scatter chart ───────────────────────────────────── */}
        {!isGuardrails && (
          <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Sell-Through Rate vs Gross Margin</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Choose one point for details or multiple to plan a scenario and compare.
                </p>
              </div>
              {selectedIds.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap justify-end">
                  <span className="text-xs text-gray-500">Selected:</span>
                  {selectedIds.map((id, i) => {
                    const p = allPoints.find(pt => pt.id === id)
                    return (
                      <span key={id} className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border
                        ${i === 1 ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-indigo-50 text-indigo-700 border-indigo-200'}`}>
                        {p?.label.replace('% markdown', '%').replace('% (Peak rec.)', ' recom.')}
                        <button onClick={() => setSelectedIds(ids => ids.filter(x => x !== id))} className="opacity-60 hover:opacity-100">
                          <X size={9} />
                        </button>
                      </span>
                    )
                  })}
                  {showSaveConfirm ? (
                    <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                      <Check size={12} /> Saved!
                    </span>
                  ) : (
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-1.5 bg-[#2a44d4] hover:bg-[#2438b8] text-white text-xs font-medium px-3.5 py-2 rounded-lg transition-colors"
                    >
                      <Save size={12} />
                      {compareMode ? 'Save comparison' : 'Save & apply scenario'}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Compare mode banner */}
            {compareMode && (
              <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-2 mb-2 text-xs text-indigo-700">
                <ArrowRightLeft size={12} />
                Compare mode active — select two points to compare scenarios side by side.
                <span className="ml-auto text-indigo-500">{selectedIds.length}/2</span>
              </div>
            )}

            {/* Legend */}
            <div className="flex items-center gap-4 mb-2 flex-wrap">
              {[
                { shape: 'triangle', label: 'Custom',           color: '#f97316' },
                { shape: 'square',   label: 'Flat discount',    color: '#16a34a' },
                { shape: 'circle',   label: 'Scenario',         color: '#4f46e5', outline: true },
                { shape: 'circle',   label: 'Peak recommended', color: '#4f46e5' },
              ].map(l => (
                <span key={l.label} className="flex items-center gap-1.5 text-xs text-gray-500">
                  {l.shape === 'circle' && <span className={`w-3 h-3 rounded-full inline-block ${l.outline ? 'border border-indigo-500' : 'bg-indigo-500'}`} />}
                  {l.shape === 'square' && <span className="w-3 h-3 border border-green-600 inline-block" />}
                  {l.shape === 'triangle' && (
                    <svg width={12} height={12} viewBox="0 0 12 12"><polygon points="6,1 11,11 1,11" fill="none" stroke="#f97316" strokeWidth={1.5} /></svg>
                  )}
                  {l.label}
                </span>
              ))}
            </div>

            <div className="flex-1 min-h-0">
              <ScenarioChart
                points={displayPoints}
                selectedIds={selectedIds}
                onPointClick={handlePointClick}
                compareMode={compareMode}
              />
            </div>

          </div>
        )}

        {/* ── Right sidebar ─────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-3">
          <PreferencesPanel
            scenarioType={scenarioType}
            onScenarioTypeChange={setScenarioType}
            category={category}
            onCategoryChange={setCategory}
            viewGrossMargin={viewGrossMargin}
            onViewGrossMarginChange={() => setViewGrossMargin(v => !v)}
            compareMode={compareMode}
            onCompareModeChange={() => { setCompareMode(v => !v); setSelectedIds(ids => ids.slice(0, 1)) }}
            flatDiscounts={flatDiscounts}
            onFlatDiscountsChange={() => setFlatDiscounts(v => !v)}
          />
          <MarkdownDistribution highlightIndex={distributionHighlight} />
        </div>
      </div>
    </div>
  )
}
