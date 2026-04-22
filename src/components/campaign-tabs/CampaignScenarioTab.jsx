import { useState } from 'react'
import { ChevronDown, Check, Save, X, ArrowRightLeft } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts'

// ─── Data ────────────────────────────────────────────────────────────────────

const allPoints = [
  // Efficiency frontier — sorted by x desc (high margin → low margin / high sell-through)
  { id: 1,  x: 88, y: 70, type: 'scenario', markdown: 5,  label: '5% markdown',  products: 26, avgPrice: '$148.20', revenue: '$168.4K', avgMarkdown: '5.0%',  grossMargin: '$44.2K', sellThrough: '70.0%' },
  { id: 2,  x: 82, y: 73, type: 'scenario', markdown: 10, label: '10% markdown', products: 26, avgPrice: '$141.50', revenue: '$178.2K', avgMarkdown: '10.2%', grossMargin: '$42.1K', sellThrough: '73.0%' },
  { id: 3,  x: 76, y: 76, type: 'scenario', markdown: 15, label: '15% markdown', products: 26, avgPrice: '$134.80', revenue: '$188.6K', avgMarkdown: '15.1%', grossMargin: '$40.3K', sellThrough: '76.0%' },
  { id: 4,  x: 68, y: 80, type: 'scenario', markdown: 20, label: '20% markdown', products: 26, avgPrice: '$126.20', revenue: '$198.4K', avgMarkdown: '20.3%', grossMargin: '$38.1K', sellThrough: '80.0%' },
  { id: 5,  x: 57, y: 84, type: 'scenario', markdown: 25, label: '25% markdown', products: 26, avgPrice: '$116.40', revenue: '$206.8K', avgMarkdown: '25.0%', grossMargin: '$36.8K', sellThrough: '84.0%' },
  { id: 6,  x: 46, y: 87, type: 'peak',     markdown: 30, label: '30% (Peak rec.)', products: 26, avgPrice: '$128.97', revenue: '$212.8K', avgMarkdown: '10.3%', grossMargin: '$36.2K', sellThrough: '87.0%' },
  { id: 7,  x: 36, y: 88, type: 'scenario', markdown: 35, label: '35% markdown', products: 26, avgPrice: '$105.70', revenue: '$216.3K', avgMarkdown: '35.2%', grossMargin: '$34.9K', sellThrough: '88.0%' },
  { id: 8,  x: 27, y: 89, type: 'scenario', markdown: 40, label: '40% markdown', products: 26, avgPrice: '$97.30',  revenue: '$218.0K', avgMarkdown: '40.0%', grossMargin: '$33.1K', sellThrough: '89.0%' },
  { id: 9,  x: 18, y: 90, type: 'scenario', markdown: 45, label: '45% markdown', products: 26, avgPrice: '$88.90',  revenue: '$219.4K', avgMarkdown: '45.1%', grossMargin: '$31.8K', sellThrough: '90.0%' },
  { id: 10, x: 11, y: 91, type: 'scenario', markdown: 50, label: '50% markdown', products: 26, avgPrice: '$81.20',  revenue: '$220.1K', avgMarkdown: '50.0%', grossMargin: '$30.0K', sellThrough: '91.0%' },
  // Flat discounts — below the curve
  { id: 11, x: 72, y: 68, type: 'flat', markdown: 20, label: 'Flat 20%', products: 26, avgPrice: '$126.20', revenue: '$182.1K', avgMarkdown: '20.0%', grossMargin: '$32.4K', sellThrough: '68.0%' },
  { id: 12, x: 62, y: 65, type: 'flat', markdown: 25, label: 'Flat 25%', products: 26, avgPrice: '$117.80', revenue: '$189.6K', avgMarkdown: '25.0%', grossMargin: '$30.8K', sellThrough: '65.0%' },
  { id: 13, x: 51, y: 63, type: 'flat', markdown: 30, label: 'Flat 30%', products: 26, avgPrice: '$108.60', revenue: '$194.2K', avgMarkdown: '30.0%', grossMargin: '$28.5K', sellThrough: '63.0%' },
  { id: 14, x: 40, y: 66, type: 'flat', markdown: 35, label: 'Flat 35%', products: 26, avgPrice: '$99.20',  revenue: '$197.8K', avgMarkdown: '35.0%', grossMargin: '$26.9K', sellThrough: '66.0%' },
  { id: 15, x: 29, y: 70, type: 'flat', markdown: 40, label: 'Flat 40%', products: 26, avgPrice: '$89.90',  revenue: '$199.4K', avgMarkdown: '40.0%', grossMargin: '$25.1K', sellThrough: '70.0%' },
  // Custom scenario
  { id: 16, x: 60, y: 91, type: 'custom', markdown: 22, label: 'Custom: Coats 25%, Knitwear 18%', products: 26, avgPrice: '$124.40', revenue: '$210.2K', avgMarkdown: '22.1%', grossMargin: '$37.8K', sellThrough: '91.0%' },
]

const distributionData = [
  { bucket: '>5%', count: 22 }, { bucket: '>10%', count: 10 }, { bucket: '>15%', count: 26 },
  { bucket: '>20%', count: 15 }, { bucket: '>25%', count: 24 }, { bucket: '>30%', count: 26 },
  { bucket: '>35%', count: 28 }, { bucket: '>40%', count: 14 }, { bucket: '>45%', count: 10 },
  { bucket: '>50%', count: 8 },  { bucket: '>55%', count: 12 }, { bucket: '55%+', count: 5 },
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
      <div onClick={onChange} className={`relative w-8 h-4 rounded-full transition-colors ${value ? 'bg-[#2a44d4]' : 'bg-gray-200'}`}>
        <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-4' : 'translate-x-0.5'}`} />
      </div>
      <span className="text-xs text-gray-600">{label}</span>
    </label>
  )
}

// ─── Custom SVG Scatter Chart ────────────────────────────────────────────────

function ScenarioChart({ points, selectedIds, onPointClick, compareMode }) {
  const W = 540, H = 320
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
      <circle cx={cx} cy={cy} r={r} fill={isSelected ? selFill : '#4f46e5'} stroke={isSelected ? '#fff' : '#fff'} strokeWidth={isSelected ? 2 : 1.5} />
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
    // scenario
    return <circle cx={cx} cy={cy} r={r} fill={isSelected ? selFill : 'none'} stroke={isSelected ? '#fff' : '#4f46e5'} strokeWidth={isSelected ? 2 : 1.5} style={isSelected ? { filter: `drop-shadow(0 0 3px ${selFill})` } : {}} />
  }

  return (
    <div className="w-full overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }}>
        {/* Grid */}
        {xTicks.map(x => <line key={x} x1={sx(x)} y1={pad.top} x2={sx(x)} y2={pad.top + cH} stroke="#f0f0f0" strokeWidth={1} />)}
        {yTicks.map(y => <line key={y} x1={pad.left} y1={sy(y)} x2={pad.left + cW} y2={sy(y)} stroke="#f0f0f0" strokeWidth={1} />)}

        {/* Efficiency curve */}
        <path d={pathD} fill="none" stroke="#4f46e5" strokeWidth={1.5} opacity={0.5} />

        {/* X axis labels */}
        {xTicks.map(x => (
          <text key={x} x={sx(x)} y={pad.top + cH + 16} textAnchor="middle" fill="#9ca3af" fontSize={10}>{x}</text>
        ))}
        <text x={pad.left + cW / 2} y={H - 4} textAnchor="middle" fill="#6b7280" fontSize={10}>Predicted gross margin (%)</text>

        {/* Y axis labels */}
        {yTicks.map(y => (
          <text key={y} x={pad.left - 6} y={sy(y) + 3} textAnchor="end" fill="#9ca3af" fontSize={10}>{y}</text>
        ))}
        <text x={12} y={pad.top + cH / 2} textAnchor="middle" fill="#6b7280" fontSize={10} transform={`rotate(-90, 12, ${pad.top + cH / 2})`}>Predicted sell-through rate (%)</text>

        {/* Points */}
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
                <circle cx={cx} cy={cy} r={isSelected ? 12 : 9} fill="none" stroke={isCompareB ? '#f97316' : '#4f46e5'} strokeWidth={1} strokeDasharray="2 2" opacity={0.5} />
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}

// ─── Stats panel ─────────────────────────────────────────────────────────────

function StatsPanel({ point, comparePoint }) {
  if (!point && !comparePoint) return (
    <div className="text-center py-8 text-xs text-gray-400">
      Click a point on the chart to see scenario details
    </div>
  )

  const stats = [
    { label: 'Products in campaign', a: point?.products, b: comparePoint?.products },
    { label: 'Avg. selling price',   a: point?.avgPrice,  b: comparePoint?.avgPrice },
    { label: 'Predicted revenue',    a: point?.revenue,   b: comparePoint?.revenue },
    { label: 'Avg. markdown',        a: point?.avgMarkdown, b: comparePoint?.avgMarkdown },
    { label: 'Predicted gross margin', a: point?.grossMargin, b: comparePoint?.grossMargin },
    { label: 'Predicted sell-through', a: point?.sellThrough, b: comparePoint?.sellThrough },
  ]

  if (comparePoint) {
    return (
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-indigo-50 rounded-lg px-3 py-2 text-xs font-semibold text-indigo-700 text-center truncate">{point.label}</div>
          <div className="bg-orange-50 rounded-lg px-3 py-2 text-xs font-semibold text-orange-700 text-center truncate">{comparePoint.label}</div>
        </div>
        {stats.map(s => (
          <div key={s.label} className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <div className="text-right">
              <div className="text-sm font-bold text-indigo-700">{s.a}</div>
            </div>
            <div className="text-xs text-gray-400 whitespace-nowrap text-center px-1">{s.label}</div>
            <div>
              <div className="text-sm font-bold text-orange-600">{s.b}</div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {stats.map(s => (
        <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-3">
          <div className="text-xs text-gray-500 mb-0.5 leading-tight">{s.label}</div>
          <div className="text-sm font-bold text-gray-900">{s.a}</div>
        </div>
      ))}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function CampaignScenarioTab() {
  const [scenarioType, setScenarioType] = useState('(Default) Sell-Through vs Gross Margin')
  const [category, setCategory] = useState('All')
  const [viewGrossMargin, setViewGrossMargin] = useState(false)
  const [compareMode, setCompareMode] = useState(false)
  const [flatDiscounts, setFlatDiscounts] = useState(true)
  const [selectedIds, setSelectedIds] = useState([6]) // default: peak recommended
  const [savedScenario, setSavedScenario] = useState(null)
  const [showSaveConfirm, setShowSaveConfirm] = useState(false)

  const displayPoints = flatDiscounts ? allPoints : allPoints.filter(p => p.type !== 'flat')

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
    const pts = selectedIds.map(id => allPoints.find(p => p.id === id))
    setSavedScenario(pts[0])
    setShowSaveConfirm(true)
    setTimeout(() => setShowSaveConfirm(false), 3000)
  }

  const primaryPoint = allPoints.find(p => p.id === selectedIds[0]) || null
  const comparePoint = compareMode && selectedIds.length === 2
    ? allPoints.find(p => p.id === selectedIds[1])
    : null

  return (
    <div>
      {/* Preferences */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900">
            Scenario Planning Preferences <span className="font-normal text-gray-400">(optional)</span>
          </h3>
          <ChevronDown size={16} className="text-gray-400" />
        </div>
        <div className="flex items-center gap-5 flex-wrap">
          <div>
            <div className="text-xs text-gray-500 mb-1.5">Scenario Type:</div>
            <button className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 min-w-[260px]">
              {scenarioType} <ChevronDown size={14} className="ml-auto text-gray-400" />
            </button>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1.5">Category:</div>
            <button className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 min-w-[120px]">
              {category} <ChevronDown size={14} className="ml-auto text-gray-400" />
            </button>
          </div>
          <div className="ml-auto flex items-center gap-5">
            <Toggle label="View gross margin ($)" value={viewGrossMargin} onChange={() => setViewGrossMargin(v => !v)} />
            <Toggle label="Flat discounts" value={flatDiscounts} onChange={() => setFlatDiscounts(v => !v)} />
            <Toggle
              label={<span className="flex items-center gap-1"><ArrowRightLeft size={11} /> Compare scenarios</span>}
              value={compareMode}
              onChange={() => { setCompareMode(v => !v); setSelectedIds(ids => ids.slice(0, 1)) }}
            />
          </div>
        </div>
      </div>

      {/* Compare mode hint */}
      {compareMode && (
        <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-2.5 mb-4 text-xs text-indigo-700">
          <ArrowRightLeft size={13} />
          Compare mode active — select two points to compare scenarios side by side.
          <span className="ml-auto text-indigo-500">{selectedIds.length}/2 selected</span>
        </div>
      )}

      {/* Main */}
      <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 300px' }}>
        {/* Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Sell-Through Rate vs Gross Margin</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {compareMode
                  ? 'Select two points to compare predicted outcomes.'
                  : 'Click a point to view scenario details and save.'}
              </p>
            </div>
            {selectedIds.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap justify-end">
                {selectedIds.map((id, i) => {
                  const p = allPoints.find(pt => pt.id === id)
                  return (
                    <span key={id} className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border
                      ${i === 1 ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-indigo-50 text-indigo-700 border-indigo-200'}`}>
                      {p?.label}
                      <button onClick={() => setSelectedIds(ids => ids.filter(x => x !== id))} className="opacity-60 hover:opacity-100">
                        <X size={9} />
                      </button>
                    </span>
                  )
                })}
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mb-2 flex-wrap">
            {[
              { shape: 'triangle', label: 'Custom', color: '#f97316' },
              { shape: 'square',   label: 'Flat discount', color: '#16a34a' },
              { shape: 'circle',   label: 'Scenario', color: '#4f46e5', outline: true },
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

          <ScenarioChart
            points={displayPoints}
            selectedIds={selectedIds}
            onPointClick={handlePointClick}
            compareMode={compareMode}
          />

          {/* Save action */}
          {selectedIds.length > 0 && (
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-500">
                {compareMode && selectedIds.length === 2
                  ? 'Comparing two scenarios'
                  : `Selected: ${allPoints.find(p => p.id === selectedIds[0])?.label}`}
              </span>
              <div className="flex items-center gap-2">
                {showSaveConfirm ? (
                  <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                    <Check size={12} /> Scenario saved!
                  </span>
                ) : (
                  <button
                    onClick={handleSave}
                    disabled={compareMode && selectedIds.length < 2 ? false : false}
                    className="flex items-center gap-1.5 bg-[#2a44d4] hover:bg-[#2438b8] text-white text-xs font-medium px-3.5 py-2 rounded-lg transition-colors"
                  >
                    <Save size={12} />
                    {compareMode ? 'Save comparison' : 'Save & apply scenario'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right panel */}
        <div className="flex flex-col gap-3">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h4 className="text-xs font-semibold text-gray-700 mb-3">
              {compareMode && selectedIds.length === 2 ? 'Scenario Comparison' : 'Scenario Details'}
            </h4>
            <StatsPanel point={primaryPoint} comparePoint={comparePoint} />

            {savedScenario && !compareMode && (
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-1.5 text-xs text-green-600">
                <Check size={11} /> Saved: {savedScenario.label}
              </div>
            )}
          </div>

          {/* Markdown Distribution */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h4 className="text-xs font-semibold text-gray-900 mb-0.5">Markdown Distribution</h4>
            <p className="text-xs text-gray-400 mb-2">Count of product/location combos per bucket.</p>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={distributionData} margin={{ top: 4, right: 0, left: -22, bottom: 0 }}>
                <XAxis dataKey="bucket" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 8 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 8 }} domain={[0, 40]} ticks={[0, 10, 20, 30, 40]} />
                <Bar dataKey="count" radius={[2, 2, 0, 0]}>
                  {distributionData.map((_, i) => (
                    <Cell key={i} fill={primaryPoint && Math.floor(primaryPoint.markdown / 5) - 1 === i ? '#4f46e5' : '#c7d2fe'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="text-center text-xs text-gray-400 -mt-1">Markdown Bucket</div>
          </div>
        </div>
      </div>
    </div>
  )
}
