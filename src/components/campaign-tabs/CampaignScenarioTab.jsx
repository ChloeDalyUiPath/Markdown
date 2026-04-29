import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check, Save, X, ArrowRightLeft, Plus, Info, AlertTriangle, Search, Lock, LockOpen } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts'
import StatCard from '../StatCard'

// ─── Data ────────────────────────────────────────────────────────────────────

const allPoints = [
  { id: 1,  x: 88, y: 70, type: 'scenario', markdown: 5,  label: '5% markdown',               products: 26, avgPrice: '$148.20', revenue: '$168.4K', avgMarkdown: '5.0%',  grossMargin: '$44.2K', sellThrough: '70.0%', num: { avgPrice: 148.20, revenue: 168400, avgMarkdown: 5.0,  grossMargin: 44200, sellThrough: 70.0 } },
  { id: 2,  x: 82, y: 73, type: 'scenario', markdown: 10, label: '10% markdown',               products: 26, avgPrice: '$141.50', revenue: '$178.2K', avgMarkdown: '10.2%', grossMargin: '$42.1K', sellThrough: '73.0%', num: { avgPrice: 141.50, revenue: 178200, avgMarkdown: 10.2, grossMargin: 42100, sellThrough: 73.0 } },
  { id: 3,  x: 76, y: 76, type: 'scenario', markdown: 15, label: '15% markdown',               products: 26, avgPrice: '$134.80', revenue: '$188.6K', avgMarkdown: '15.1%', grossMargin: '$40.3K', sellThrough: '76.0%', num: { avgPrice: 134.80, revenue: 188600, avgMarkdown: 15.1, grossMargin: 40300, sellThrough: 76.0 } },
  { id: 4,  x: 68, y: 80, type: 'scenario', markdown: 20, label: '20% markdown',               products: 26, avgPrice: '$126.20', revenue: '$198.4K', avgMarkdown: '20.3%', grossMargin: '$38.1K', sellThrough: '80.0%', num: { avgPrice: 126.20, revenue: 198400, avgMarkdown: 20.3, grossMargin: 38100, sellThrough: 80.0 } },
  { id: 5,  x: 57, y: 84, type: 'scenario', markdown: 25, label: '25% markdown',               products: 26, avgPrice: '$116.40', revenue: '$206.8K', avgMarkdown: '25.0%', grossMargin: '$36.8K', sellThrough: '84.0%', num: { avgPrice: 116.40, revenue: 206800, avgMarkdown: 25.0, grossMargin: 36800, sellThrough: 84.0 } },
  { id: 6,  x: 46, y: 87, type: 'peak',     markdown: 30, label: '30% (Peak rec.)',            products: 26, avgPrice: '$128.97', revenue: '$212.8K', avgMarkdown: '10.3%', grossMargin: '$36.2K', sellThrough: '87.0%', num: { avgPrice: 128.97, revenue: 212800, avgMarkdown: 10.3, grossMargin: 36200, sellThrough: 87.0 } },
  { id: 7,  x: 36, y: 88, type: 'scenario', markdown: 35, label: '35% markdown',               products: 26, avgPrice: '$105.70', revenue: '$216.3K', avgMarkdown: '35.2%', grossMargin: '$34.9K', sellThrough: '88.0%', num: { avgPrice: 105.70, revenue: 216300, avgMarkdown: 35.2, grossMargin: 34900, sellThrough: 88.0 } },
  { id: 8,  x: 27, y: 89, type: 'scenario', markdown: 40, label: '40% markdown',               products: 26, avgPrice: '$97.30',  revenue: '$218.0K', avgMarkdown: '40.0%', grossMargin: '$33.1K', sellThrough: '89.0%', num: { avgPrice: 97.30,  revenue: 218000, avgMarkdown: 40.0, grossMargin: 33100, sellThrough: 89.0 } },
  { id: 9,  x: 18, y: 90, type: 'scenario', markdown: 45, label: '45% markdown',               products: 26, avgPrice: '$88.90',  revenue: '$219.4K', avgMarkdown: '45.1%', grossMargin: '$31.8K', sellThrough: '90.0%', num: { avgPrice: 88.90,  revenue: 219400, avgMarkdown: 45.1, grossMargin: 31800, sellThrough: 90.0 } },
  { id: 10, x: 11, y: 91, type: 'scenario', markdown: 50, label: '50% markdown',               products: 26, avgPrice: '$81.20',  revenue: '$220.1K', avgMarkdown: '50.0%', grossMargin: '$30.0K', sellThrough: '91.0%', num: { avgPrice: 81.20,  revenue: 220100, avgMarkdown: 50.0, grossMargin: 30000, sellThrough: 91.0 } },
  { id: 11, x: 72, y: 68, type: 'flat',     markdown: 20, label: 'Flat 20%',                   products: 26, avgPrice: '$126.20', revenue: '$182.1K', avgMarkdown: '20.0%', grossMargin: '$32.4K', sellThrough: '68.0%', num: { avgPrice: 126.20, revenue: 182100, avgMarkdown: 20.0, grossMargin: 32400, sellThrough: 68.0 } },
  { id: 12, x: 62, y: 65, type: 'flat',     markdown: 25, label: 'Flat 25%',                   products: 26, avgPrice: '$117.80', revenue: '$189.6K', avgMarkdown: '25.0%', grossMargin: '$30.8K', sellThrough: '65.0%', num: { avgPrice: 117.80, revenue: 189600, avgMarkdown: 25.0, grossMargin: 30800, sellThrough: 65.0 } },
  { id: 13, x: 51, y: 63, type: 'flat',     markdown: 30, label: 'Flat 30%',                   products: 26, avgPrice: '$108.60', revenue: '$194.2K', avgMarkdown: '30.0%', grossMargin: '$28.5K', sellThrough: '63.0%', num: { avgPrice: 108.60, revenue: 194200, avgMarkdown: 30.0, grossMargin: 28500, sellThrough: 63.0 } },
  { id: 14, x: 40, y: 66, type: 'flat',     markdown: 35, label: 'Flat 35%',                   products: 26, avgPrice: '$99.20',  revenue: '$197.8K', avgMarkdown: '35.0%', grossMargin: '$26.9K', sellThrough: '66.0%', num: { avgPrice: 99.20,  revenue: 197800, avgMarkdown: 35.0, grossMargin: 26900, sellThrough: 66.0 } },
  { id: 15, x: 29, y: 70, type: 'flat',     markdown: 40, label: 'Flat 40%',                   products: 26, avgPrice: '$89.90',  revenue: '$199.4K', avgMarkdown: '40.0%', grossMargin: '$25.1K', sellThrough: '70.0%', num: { avgPrice: 89.90,  revenue: 199400, avgMarkdown: 40.0, grossMargin: 25100, sellThrough: 70.0 } },
  { id: 16, x: 60, y: 91, type: 'custom',   markdown: 22, label: 'Custom: Coats 25%, Knitwear 18%', products: 26, avgPrice: '$124.40', revenue: '$210.2K', avgMarkdown: '22.1%', grossMargin: '$37.8K', sellThrough: '91.0%', num: { avgPrice: 124.40, revenue: 210200, avgMarkdown: 22.1, grossMargin: 37800, sellThrough: 91.0 } },
]

const TARGET = { avgPrice: 128.97, revenue: 212800, avgMarkdown: 10.3, grossMargin: 36200, sellThrough: 87.0 }

const distributionData = [
  { bucket: '>5%',  planned: 22, current: 8  }, { bucket: '>10%', planned: 10, current: 14 },
  { bucket: '>15%', planned: 26, current: 32 }, { bucket: '>20%', planned: 15, current: 28 },
  { bucket: '>25%', planned: 24, current: 20 }, { bucket: '>30%', planned: 26, current: 18 },
  { bucket: '>35%', planned: 28, current: 12 }, { bucket: '>40%', planned: 14, current: 8  },
  { bucket: '>45%', planned: 10, current: 4  }, { bucket: '>50%', planned: 8,  current: 2  },
  { bucket: '>55%', planned: 12, current: 2  }, { bucket: '55%+', planned: 5,  current: 1  },
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
    bestFor: 'Best for slow movers with strong brand value',
    revenue: '$213K', margin: '42.5%', sellThru: '78.2%', maxDisc: '40.0%',
    dot: '#3b82f6',
    num: { revenue: 213000, margin: 42.5, sellThru: 78.2, maxDisc: 40.0 },
  },
  {
    id: 'balanced',
    name: 'Balanced Strategy',
    description: 'Optimizes revenue and margin across all categories',
    bestFor: 'Best for mixed-performance categories',
    recommended: true,
    revenue: '$229K', margin: '39.2%', sellThru: '85.4%', maxDisc: '50.0%',
    dot: '#22c55e',
    num: { revenue: 229000, margin: 39.2, sellThru: 85.4, maxDisc: 50.0 },
  },
  {
    id: 'aggressive',
    name: 'Aggressive Clearance',
    description: 'Prioritizes inventory clearance with deeper discounts',
    bestFor: 'Best for clearing excess stock fast',
    revenue: '$198K', margin: '35.8%', sellThru: '92.5%', maxDisc: '60.0%',
    dot: '#f59e0b',
    num: { revenue: 198000, margin: 35.8, sellThru: 92.5, maxDisc: 60.0 },
  },
]

const BEST = {
  revenue:  Math.max(...guardrailSets.map(s => s.num.revenue)),
  margin:   Math.max(...guardrailSets.map(s => s.num.margin)),
  sellThru: Math.max(...guardrailSets.map(s => s.num.sellThru)),
}

const guardrailCategories = [
  {
    id: 1, name: "Women's Dresses", weeksOfCover: 8,
    metrics: {
      'high-margin': { st: '76.5%', m: '44.2%', r: '$3K', stNum: 76.5, mNum: 44.2 },
      'balanced':    { st: '84.7%', m: '40.5%', r: '$3K', stNum: 84.7, mNum: 40.5 },
      'aggressive':  { st: '91.2%', m: '36.8%', r: '$3K', stNum: 91.2, mNum: 36.8 },
    },
  },
  {
    id: 2, name: "Women's Knitwear", weeksOfCover: 14,
    metrics: {
      'high-margin': { st: '68.0%', m: '38.1%', r: '$4K', stNum: 68.0, mNum: 38.1 },
      'balanced':    { st: '79.3%', m: '35.6%', r: '$4K', stNum: 79.3, mNum: 35.6 },
      'aggressive':  { st: '88.1%', m: '31.2%', r: '$4K', stNum: 88.1, mNum: 31.2 },
    },
  },
  {
    id: 3, name: "Men's Outerwear", weeksOfCover: 6,
    metrics: {
      'high-margin': { st: '71.2%', m: '46.0%', r: '$5K', stNum: 71.2, mNum: 46.0 },
      'balanced':    { st: '82.4%', m: '42.1%', r: '$5K', stNum: 82.4, mNum: 42.1 },
      'aggressive':  { st: '91.0%', m: '37.5%', r: '$5K', stNum: 91.0, mNum: 37.5 },
    },
  },
  {
    id: 4, name: 'Accessories', weeksOfCover: 4,
    metrics: {
      'high-margin': { st: '80.0%', m: '51.3%', r: '$2K', stNum: 80.0, mNum: 51.3 },
      'balanced':    { st: '88.2%', m: '47.0%', r: '$2K', stNum: 88.2, mNum: 47.0 },
      'aggressive':  { st: '94.3%', m: '40.0%', r: '$2K', stNum: 94.3, mNum: 40.0 },
    },
  },
  {
    id: 5, name: 'Footwear', weeksOfCover: 11,
    metrics: {
      'high-margin': { st: '65.4%', m: '40.2%', r: '$6K', stNum: 65.4, mNum: 40.2 },
      'balanced':    { st: '76.8%', m: '36.9%', r: '$6K', stNum: 76.8, mNum: 36.9 },
      'aggressive':  { st: '86.5%', m: '32.4%', r: '$6K', stNum: 86.5, mNum: 32.4 },
    },
  },
  {
    id: 6, name: 'Home & Lifestyle', weeksOfCover: 5,
    metrics: {
      'high-margin': { st: '72.1%', m: '43.7%', r: '$2K', stNum: 72.1, mNum: 43.7 },
      'balanced':    { st: '83.5%', m: '39.8%', r: '$2K', stNum: 83.5, mNum: 39.8 },
      'aggressive':  { st: '90.2%', m: '34.5%', r: '$2K', stNum: 90.2, mNum: 34.5 },
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

function fmtRevDelta(n) {
  const abs = Math.abs(n)
  const sign = n >= 0 ? '+' : '-'
  if (abs >= 1e6) return sign + '€' + (abs / 1e6).toFixed(1) + 'M'
  return sign + '€' + Math.round(abs / 1000) + 'K'
}

function fmtPpDelta(n) {
  return (n >= 0 ? '+' : '') + n.toFixed(1) + 'pp'
}

function pctVsTarget(val, base) {
  const d = ((val - base) / Math.abs(base)) * 100
  return (d >= 0 ? '+' : '') + d.toFixed(1) + '% vs plan'
}

function stockSignal(weeks) {
  if (weeks >= 12) return { label: `${weeks}wk`, cls: 'text-red-500 bg-red-50', tip: 'High stock — consider clearing' }
  if (weeks >= 8)  return { label: `${weeks}wk`, cls: 'text-amber-600 bg-amber-50', tip: 'Moderate stock' }
  return { label: `${weeks}wk`, cls: 'text-gray-400 bg-gray-50', tip: 'Low stock' }
}

// ─── Category multi-select ────────────────────────────────────────────────────

function CategoryMultiSelect({ value, onChange, locked, onLock, onUnlock }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef(null)

  const allIds = guardrailCategories.map(c => c.id)
  const isAll  = value.length === 0

  // Close on outside click — isolated from everything else
  useEffect(() => {
    if (!open) return
    function handle(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open])

  // Clear search when closed
  useEffect(() => { if (!open) setSearch('') }, [open])

  function toggle(id) {
    let next
    if (isAll) {
      // Start from all-checked: uncheck this one
      next = allIds.filter(i => i !== id)
    } else {
      const already = value.includes(id)
      next = already ? value.filter(i => i !== id) : [...value, id]
    }
    // Normalise: if every category is explicitly checked, treat as "all"
    onChange(next.length === allIds.length ? [] : next.length === 0 ? [] : next)
  }

  function selectAll() { onChange([]) }

  const visible = guardrailCategories.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase())
  )

  const lockedCats   = guardrailCategories.filter(c => value.includes(c.id))
  const selectedCount = isAll ? allIds.length : value.length

  const triggerLabel = isAll
    ? 'All categories'
    : value.length === 1
      ? guardrailCategories.find(c => c.id === value[0])?.name ?? '1 category'
      : `${value.length} of ${allIds.length} categories`

  return (
    <div className="relative" ref={containerRef}>

      {/* ── Trigger ── */}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className={`w-full flex items-center gap-2 border rounded-lg px-3 py-2 text-sm transition-colors text-left
          ${locked
            ? 'border-indigo-300 bg-indigo-50 text-indigo-900 hover:bg-indigo-100'
            : open
              ? 'border-[#2a44d4] ring-1 ring-[#2a44d4]/20 bg-white text-gray-900'
              : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
          }`}
      >
        {locked && <Lock size={12} className="text-indigo-500 flex-shrink-0" />}
        <span className="flex-1 truncate font-medium">{triggerLabel}</span>
        {locked
          ? <span className="text-[10px] font-bold text-indigo-600 bg-white border border-indigo-200 px-1.5 py-0.5 rounded-full flex-shrink-0">Locked</span>
          : !isAll
            ? <span className="text-[10px] font-bold text-[#2a44d4] bg-indigo-50 px-1.5 py-0.5 rounded-full flex-shrink-0">{value.length}</span>
            : null
        }
        {!locked && <ChevronDown size={14} className={`text-gray-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />}
      </button>

      {/* ── Dropdown ── */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-[100]">

          {locked ? (
            /* ── Locked view ── */
            <div className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Lock size={13} className="text-indigo-500 flex-shrink-0" />
                <span className="text-xs font-semibold text-gray-800">Locked to your categories</span>
              </div>
              <p className="text-[11px] text-gray-400 mb-3 ml-5">Only these categories are visible in the table.</p>
              <div className="space-y-1.5 mb-4">
                {lockedCats.length === 0 ? (
                  <p className="text-xs text-gray-400 px-2">No categories selected.</p>
                ) : lockedCats.map(cat => {
                  const sig = stockSignal(cat.weeksOfCover)
                  return (
                    <div key={cat.id} className="flex items-center gap-2.5 px-3 py-2 bg-indigo-50 border border-indigo-100 rounded-lg">
                      <Check size={12} className="text-indigo-500 flex-shrink-0" />
                      <span className="text-xs font-semibold text-indigo-900 flex-1">{cat.name}</span>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${sig.cls}`}>{sig.label}</span>
                    </div>
                  )
                })}
              </div>
              <button
                type="button"
                onClick={() => { onUnlock(); setOpen(false) }}
                className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-[#2a44d4] border border-indigo-200 rounded-lg py-2 hover:bg-indigo-50 transition-colors"
              >
                <LockOpen size={12} /> Unlock to change categories
              </button>
            </div>
          ) : (
            /* ── Normal multi-select ── */
            <>
              {/* Search */}
              <div className="p-2 border-b border-gray-100">
                <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-2.5 py-1.5">
                  <Search size={12} className="text-gray-400 flex-shrink-0" />
                  <input
                    autoFocus
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    onKeyDown={e => e.key === 'Escape' && setOpen(false)}
                    placeholder="Search categories…"
                    className="flex-1 text-xs bg-transparent outline-none text-gray-700 placeholder-gray-400 min-w-0"
                  />
                  {search && (
                    <button type="button" onMouseDown={e => e.preventDefault()} onClick={() => setSearch('')} className="text-gray-400 hover:text-gray-600">
                      <X size={10} />
                    </button>
                  )}
                </div>
              </div>

              {/* Select all */}
              <div
                className="flex items-center gap-2.5 px-3 py-2.5 border-b border-gray-100 cursor-pointer select-none hover:bg-gray-50"
                onMouseDown={e => e.preventDefault()}
                onClick={selectAll}
              >
                <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors pointer-events-none
                  ${isAll ? 'bg-[#2a44d4] border-[#2a44d4]' : 'border-gray-300 bg-white'}`}>
                  {isAll
                    ? <Check size={10} className="text-white" />
                    : value.length > 0 ? <div className="w-2 h-0.5 bg-[#2a44d4] rounded" /> : null
                  }
                </div>
                <span className="text-xs font-semibold text-gray-700 flex-1">Select all</span>
                <span className="text-[10px] text-gray-400">{allIds.length} categories</span>
              </div>

              {/* Category list */}
              <div className="max-h-52 overflow-y-auto">
                {visible.length === 0 ? (
                  <div className="px-3 py-5 text-xs text-gray-400 text-center">No categories match "{search}"</div>
                ) : visible.map(cat => {
                  const checked = isAll || value.includes(cat.id)
                  const sig = stockSignal(cat.weeksOfCover)
                  return (
                    <div
                      key={cat.id}
                      className={`flex items-center gap-2.5 px-3 py-2.5 cursor-pointer select-none transition-colors
                        ${checked ? 'hover:bg-indigo-50' : 'hover:bg-gray-50'}`}
                      onMouseDown={e => e.preventDefault()}
                      onClick={() => toggle(cat.id)}
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors pointer-events-none
                        ${checked ? 'bg-[#2a44d4] border-[#2a44d4]' : 'border-gray-300 bg-white'}`}>
                        {checked && <Check size={10} className="text-white" />}
                      </div>
                      <span className={`text-xs flex-1 leading-none ${checked ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                        {cat.name}
                      </span>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${sig.cls}`}>{sig.label}</span>
                    </div>
                  )
                })}
              </div>

              {/* Footer */}
              <div className="px-3 py-2.5 border-t border-gray-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  {!isAll && (
                    <button
                      type="button"
                      onMouseDown={e => e.preventDefault()}
                      onClick={selectAll}
                      className="text-xs text-gray-500 hover:text-gray-800 transition-colors px-1"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {!isAll && (
                    <button
                      type="button"
                      onMouseDown={e => e.preventDefault()}
                      onClick={() => { onLock(); setOpen(false) }}
                      className="flex items-center gap-1 text-xs font-semibold text-indigo-600 border border-indigo-200 rounded-lg px-2.5 py-1 hover:bg-indigo-50 transition-colors"
                    >
                      <Lock size={10} /> Lock view
                    </button>
                  )}
                  <button
                    type="button"
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => setOpen(false)}
                    className="text-xs font-semibold text-[#2a44d4] hover:text-[#2438b8] transition-colors px-1"
                  >
                    Done
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Locked category banner ───────────────────────────────────────────────────

function LockedBanner({ selectedCategories, onUnlock }) {
  const names = guardrailCategories
    .filter(c => selectedCategories.includes(c.id))
    .map(c => c.name)
  return (
    <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-2.5 mb-4">
      <Lock size={13} className="text-indigo-500 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <span className="text-xs font-semibold text-indigo-800">Category view locked</span>
        <span className="text-xs text-indigo-600 ml-2">{names.join(' · ')}</span>
      </div>
      <button
        onClick={onUnlock}
        className="flex items-center gap-1.5 text-xs font-semibold text-indigo-700 hover:text-indigo-900 bg-white border border-indigo-200 hover:border-indigo-400 rounded-lg px-2.5 py-1 transition-colors flex-shrink-0"
      >
        <LockOpen size={11} /> Unlock
      </button>
    </div>
  )
}

// ─── Save modal ───────────────────────────────────────────────────────────────

function SaveModal({ defaultName, kpiStats, scenarioType, selectedGuardrails, onClose, onSave }) {
  const [name, setName] = useState(defaultName)
  const inputRef = useRef(null)

  useEffect(() => {
    if (inputRef.current) inputRef.current.select()
    function handleKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  // Strategy mix breakdown for guardrails
  const breakdown = (() => {
    if (scenarioType !== 'guardrails') return null
    const counts = {}
    Object.entries(selectedGuardrails).forEach(([catId, setId]) => {
      if (!counts[setId]) counts[setId] = []
      counts[setId].push(guardrailCategories.find(c => c.id === Number(catId))?.name)
    })
    return guardrailSets
      .filter(s => counts[s.id])
      .map(s => ({ ...s, cats: counts[s.id] }))
  })()

  const summaryStats = kpiStats.slice(0, 3)
  const hasWarnings = kpiStats.some(s => s.warning)

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Save scenario</h2>
            <p className="text-xs text-gray-400 mt-0.5">This will be applied to the campaign.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 -mr-1">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Name input */}
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1.5">Scenario name</label>
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && name.trim()) onSave(name.trim()) }}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2a44d4]/30 focus:border-[#2a44d4] transition-colors"
              placeholder="Enter a name for this scenario"
            />
          </div>

          {/* Projected outcomes */}
          <div>
            <div className="text-xs font-semibold text-gray-600 mb-2">Projected outcomes</div>
            <div className="grid grid-cols-3 gap-2">
              {summaryStats.map(s => (
                <div key={s.label} className="bg-gray-50 rounded-xl p-3">
                  <div className="text-[10px] text-gray-400 mb-1 leading-tight">{s.label}</div>
                  <div className="text-base font-bold text-gray-900 leading-none mb-1">{s.value}</div>
                  {s.delta && (
                    <div className={`text-[10px] font-semibold ${s.negative ? 'text-red-500' : 'text-emerald-600'}`}>
                      {s.negative ? '↓' : '↑'} {s.delta}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Strategy mix (guardrails only) */}
          {breakdown && (
            <div>
              <div className="text-xs font-semibold text-gray-600 mb-2">Strategy mix</div>
              <div className="space-y-2">
                {breakdown.map(b => (
                  <div key={b.id} className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full flex-shrink-0 mt-0.5" style={{ backgroundColor: b.dot }} />
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-semibold text-gray-700">{b.name}</span>
                      <span className="text-xs text-gray-400 ml-1.5">({b.cats.length})</span>
                      <div className="text-[10px] text-gray-400 mt-0.5 truncate">{b.cats.join(', ')}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warning if any risk signals */}
          {hasWarnings && (
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5">
              <AlertTriangle size={13} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">
                {kpiStats.filter(s => s.warning).map(s => s.warning).join(' · ')}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => name.trim() && onSave(name.trim())}
            disabled={!name.trim()}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#2a44d4] hover:bg-[#2438b8] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors"
          >
            <Check size={14} /> Save & apply
          </button>
        </div>
      </div>
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
        <div className="font-semibold text-white text-xs">Scenario saved & applied</div>
        <div className="text-gray-400 text-[11px] truncate mt-0.5">{name}</div>
      </div>
      <button onClick={onDismiss} className="text-gray-500 hover:text-gray-300 flex-shrink-0 transition-colors">
        <X size={13} />
      </button>
    </div>
  )
}

// ─── KPI computation ──────────────────────────────────────────────────────────

function computeScenarioStats(point) {
  const n = point.num
  return [
    {
      label: 'Predicted Revenue', value: point.revenue, color: 'blue',
      negative: n.revenue < TARGET.revenue,
      delta: fmtRevDelta(n.revenue - TARGET.revenue),
      change: pctVsTarget(n.revenue, TARGET.revenue),
      warning: n.revenue < TARGET.revenue * 0.9 ? 'Revenue well below plan' : null,
    },
    {
      label: 'Predicted Gross Margin', value: point.grossMargin, color: 'green',
      negative: n.grossMargin < TARGET.grossMargin,
      delta: fmtRevDelta(n.grossMargin - TARGET.grossMargin),
      change: pctVsTarget(n.grossMargin, TARGET.grossMargin),
      warning: n.grossMargin < TARGET.grossMargin * 0.92 ? 'Margin below target' : null,
    },
    {
      label: 'Predicted Sell-Through', value: point.sellThrough, color: 'green',
      negative: n.sellThrough < TARGET.sellThrough,
      delta: fmtPpDelta(n.sellThrough - TARGET.sellThrough) + ' vs plan',
      change: pctVsTarget(n.sellThrough, TARGET.sellThrough),
      warning: null,
    },
    {
      label: 'Avg. Markdown', value: point.avgMarkdown, color: 'amber',
      negative: n.avgMarkdown > TARGET.avgMarkdown,
      delta: fmtPpDelta(n.avgMarkdown - TARGET.avgMarkdown),
      change: pctVsTarget(n.avgMarkdown, TARGET.avgMarkdown),
      warning: n.avgMarkdown > 40 ? 'High discount exposure' : null,
    },
    {
      label: 'Avg Selling Price', value: point.avgPrice, color: 'blue',
      negative: n.avgPrice < TARGET.avgPrice,
      delta: (n.avgPrice >= TARGET.avgPrice ? '+' : '') + '€' + (n.avgPrice - TARGET.avgPrice).toFixed(0),
      change: pctVsTarget(n.avgPrice, TARGET.avgPrice),
      warning: null,
    },
    {
      label: 'Total Products', value: String(point.products), color: 'slate',
      negative: false, delta: null, change: null, warning: null,
    },
  ]
}

function computeGuardrailStats(selectedGuardrails, activeCats = guardrailCategories) {
  const n = activeCats.length
  if (n === 0) return []
  const catMetrics = activeCats.map(cat => {
    const m = cat.metrics[selectedGuardrails[cat.id]]
    return { st: m.stNum, margin: m.mNum }
  })
  const avgST     = catMetrics.reduce((s, m) => s + m.st, 0) / n
  const avgMargin = catMetrics.reduce((s, m) => s + m.margin, 0) / n

  const counts = {}
  activeCats.forEach(cat => {
    const id = selectedGuardrails[cat.id]
    counts[id] = (counts[id] || 0) + 1
  })
  const totalWeight = Object.values(counts).reduce((s, w) => s + w, 0)
  const wRevenue = Object.entries(counts).reduce((s, [id, w]) => s + guardrailSets.find(g => g.id === id).num.revenue  * (w / totalWeight), 0)
  const wMaxDisc = Object.entries(counts).reduce((s, [id, w]) => s + guardrailSets.find(g => g.id === id).num.maxDisc  * (w / totalWeight), 0)

  const base = guardrailSets.find(g => g.id === 'balanced').num
  const fmtRev = v => v >= 1e6 ? '€' + (v / 1e6).toFixed(1) + 'M' : '€' + Math.round(v / 1000) + 'K'

  return [
    {
      label: 'Predicted Revenue', value: fmtRev(wRevenue), color: 'blue',
      negative: wRevenue < base.revenue,
      delta: fmtRevDelta(wRevenue - base.revenue),
      change: pctVsTarget(wRevenue, base.revenue),
      warning: wRevenue < base.revenue * 0.92 ? 'Revenue well below plan' : null,
    },
    {
      label: 'Predicted Gross Margin', value: avgMargin.toFixed(1) + '%', color: 'green',
      negative: avgMargin < base.margin,
      delta: fmtPpDelta(avgMargin - base.margin) + ' vs balanced',
      change: pctVsTarget(avgMargin, base.margin),
      warning: avgMargin < 37 ? 'Margin below target' : null,
    },
    {
      label: 'Predicted Sell-Through', value: avgST.toFixed(1) + '%', color: 'green',
      negative: avgST < base.sellThru,
      delta: fmtPpDelta(avgST - base.sellThru) + ' vs balanced',
      change: pctVsTarget(avgST, base.sellThru),
      warning: null,
    },
    {
      label: 'Avg. Max Discount', value: wMaxDisc.toFixed(1) + '%', color: 'amber',
      negative: wMaxDisc > base.maxDisc,
      delta: fmtPpDelta(wMaxDisc - base.maxDisc),
      change: pctVsTarget(wMaxDisc, base.maxDisc),
      warning: wMaxDisc > 54 ? 'High discount exposure' : null,
    },
    {
      label: 'Avg Selling Price', value: '30.3%', color: 'blue',
      negative: false, delta: null, change: null, warning: null,
    },
    {
      label: 'Total Products', value: '12,492', color: 'slate',
      negative: false, delta: null, change: null, warning: null,
    },
  ]
}

// ─── Stats bar ────────────────────────────────────────────────────────────────

function StatsBar({ stats }) {
  return (
    <div className="mb-4">
      <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide mb-2">Projected end of campaign</p>
      <div className="grid grid-cols-6 gap-3">
        {stats.map(s => (
          <StatCard
            key={s.label}
            label={s.label}
            value={s.value}
            change={s.change}
            delta={s.delta}
            negative={s.negative}
            color={s.color}
            warning={s.warning}
          />
        ))}
      </div>
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

  function renderShape(p, cx, cy, isSelected, isCompareB) {
    const selFill = isCompareB ? '#f97316' : '#4f46e5'
    const r = isSelected ? 7 : 5
    if (p.type === 'peak') return <circle cx={cx} cy={cy} r={r} fill={isSelected ? selFill : '#4f46e5'} stroke="#fff" strokeWidth={isSelected ? 2 : 1.5} />
    if (p.type === 'flat') {
      const s = isSelected ? 9 : 7
      return <rect x={cx - s / 2} y={cy - s / 2} width={s} height={s} fill={isSelected ? selFill : 'none'} stroke={isSelected ? selFill : '#16a34a'} strokeWidth={1.5} />
    }
    if (p.type === 'custom') {
      const s = isSelected ? 8 : 6
      return <polygon points={`${cx},${cy - s} ${cx + s},${cy + s * 0.6} ${cx - s},${cy + s * 0.6}`} fill={isSelected ? selFill : 'none'} stroke={isSelected ? selFill : '#f97316'} strokeWidth={1.5} />
    }
    return <circle cx={cx} cy={cy} r={r} fill={isSelected ? selFill : 'none'} stroke={isSelected ? '#fff' : '#4f46e5'} strokeWidth={isSelected ? 2 : 1.5} style={isSelected ? { filter: `drop-shadow(0 0 3px ${selFill})` } : {}} />
  }

  return (
    <div ref={wrapperRef} className="w-full h-full">
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ display: 'block' }}>
        {xTicks.map(x => <line key={x} x1={sx(x)} y1={pad.top} x2={sx(x)} y2={pad.top + cH} stroke="#f0f0f0" strokeWidth={1} />)}
        {yTicks.map(y => <line key={y} x1={pad.left} y1={sy(y)} x2={pad.left + cW} y2={sy(y)} stroke="#f0f0f0" strokeWidth={1} />)}
        <path d={catmullRomPath(curvePoints)} fill="none" stroke="#4f46e5" strokeWidth={1.5} opacity={0.5} />
        {xTicks.map(x => <text key={x} x={sx(x)} y={pad.top + cH + 16} textAnchor="middle" fill="#9ca3af" fontSize={10}>{x}</text>)}
        <text x={pad.left + cW / 2} y={H - 4} textAnchor="middle" fill="#6b7280" fontSize={10}>Predicted gross margin (%)</text>
        {yTicks.map(y => <text key={y} x={pad.left - 6} y={sy(y) + 3} textAnchor="end" fill="#9ca3af" fontSize={10}>{y}</text>)}
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
              {isSelected && <circle cx={cx} cy={cy} r={12} fill="none" stroke={isCompareB ? '#f97316' : '#4f46e5'} strokeWidth={1} strokeDasharray="2 2" opacity={0.5} />}
            </g>
          )
        })}
      </svg>
    </div>
  )
}

// ─── Guardrail card ───────────────────────────────────────────────────────────

function GuardrailCard({ set }) {
  const isTopRevenue  = set.num.revenue  === BEST.revenue
  const isTopMargin   = set.num.margin   === BEST.margin
  const isTopSellThru = set.num.sellThru === BEST.sellThru

  return (
    <div className={`relative border rounded-xl p-4 bg-white transition-shadow ${set.recommended ? 'border-[#2a44d4] shadow-sm ring-1 ring-[#2a44d4]/20' : 'border-gray-200'}`}>
      {set.recommended && (
        <span className="absolute -top-2.5 left-3 bg-[#2a44d4] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
          Recommended
        </span>
      )}
      <div className="flex items-center gap-1.5 mb-0.5">
        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: set.dot }} />
        <div className="text-sm font-semibold text-gray-900">{set.name}</div>
      </div>
      <div className="text-[11px] text-[#2a44d4] font-medium mb-3">{set.bestFor}</div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        <div>
          <div className="text-[10px] text-gray-400 mb-0.5">Revenue</div>
          <div className={`text-xs font-bold ${isTopRevenue ? 'text-emerald-600' : 'text-gray-800'}`}>
            {set.revenue}
            {isTopRevenue && <span className="ml-1 text-[9px] font-semibold bg-emerald-50 text-emerald-600 px-1 py-0.5 rounded">Highest</span>}
          </div>
        </div>
        <div>
          <div className="text-[10px] text-gray-400 mb-0.5">Gross Margin</div>
          <div className={`text-xs font-bold ${isTopMargin ? 'text-blue-600' : 'text-gray-800'}`}>
            {set.margin}
            {isTopMargin && <span className="ml-1 text-[9px] font-semibold bg-blue-50 text-blue-600 px-1 py-0.5 rounded">Highest</span>}
          </div>
        </div>
        <div>
          <div className="text-[10px] text-gray-400 mb-0.5">Sell-Through</div>
          <div className={`text-xs font-bold ${isTopSellThru ? 'text-amber-600' : 'text-gray-800'}`}>
            {set.sellThru}
            {isTopSellThru && <span className="ml-1 text-[9px] font-semibold bg-amber-50 text-amber-600 px-1 py-0.5 rounded">Highest</span>}
          </div>
        </div>
        <div>
          <div className="text-[10px] text-gray-400 mb-0.5">Max Discount</div>
          <div className="text-xs font-bold text-gray-800">{set.maxDisc}</div>
        </div>
      </div>
    </div>
  )
}

// ─── Guardrail category table ─────────────────────────────────────────────────

function deltaMark(val, base) {
  const d = val - base
  if (Math.abs(d) < 0.1) return null
  return d > 0
}

function GuardrailTable({ categories, totalCategories, selectedGuardrails, onSelect, lastChange }) {
  const isFiltered = categories.length < totalCategories

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="flex items-start gap-1.5 text-xs text-gray-500 bg-indigo-50 border border-indigo-100 rounded-lg px-3 py-2 flex-1 mr-3">
          <Info size={13} className="flex-shrink-0 mt-0.5 text-indigo-400" />
          Select a strategy per category. Arrows show change vs Balanced baseline.
        </p>
        {isFiltered && (
          <span className="text-[11px] text-indigo-600 font-medium bg-indigo-50 border border-indigo-200 rounded-lg px-2.5 py-1.5 flex-shrink-0">
            Showing {categories.length} of {totalCategories}
          </span>
        )}
      </div>
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left font-semibold text-gray-600 pb-2.5 pr-3 w-36">Category</th>
            <th className="text-left font-medium text-gray-400 pb-2.5 px-2 w-16">Stock</th>
            {guardrailSets.map(set => (
              <th key={set.id} className="text-left font-semibold text-gray-600 pb-2.5 px-3">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full inline-block flex-shrink-0" style={{ backgroundColor: set.dot }} />
                  {set.name}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {categories.map(cat => {
            const sig = stockSignal(cat.weeksOfCover)
            const baseM = cat.metrics['balanced']
            const isJustChanged = lastChange?.catId === cat.id

            return (
              <tr key={cat.id} className="border-b border-gray-50 group">
                <td className="py-3 pr-3 font-semibold text-gray-800 text-xs align-top">
                  <div>{cat.name}</div>
                  {isJustChanged && lastChange.message && (
                    <div className="mt-1 text-[10px] font-medium text-indigo-600 bg-indigo-50 rounded px-1.5 py-0.5">
                      {lastChange.message}
                    </div>
                  )}
                </td>
                <td className="py-3 px-2 align-top">
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${sig.cls}`} title={sig.tip}>
                    {sig.label}
                  </span>
                </td>
                {guardrailSets.map(set => {
                  const isSelected = selectedGuardrails[cat.id] === set.id
                  const m = cat.metrics[set.id]
                  const upST = deltaMark(m.stNum, baseM.stNum)
                  const upM  = deltaMark(m.mNum,  baseM.mNum)
                  const maxST = Math.max(...guardrailSets.map(s => cat.metrics[s.id].stNum))
                  const maxM  = Math.max(...guardrailSets.map(s => cat.metrics[s.id].mNum))

                  return (
                    <td
                      key={set.id}
                      className={`py-3 px-3 cursor-pointer rounded-lg transition-all align-top
                        ${isSelected
                          ? 'bg-indigo-50 ring-1 ring-inset ring-indigo-300'
                          : 'hover:bg-gray-50'
                        }`}
                      onClick={() => onSelect(cat.id, set.id)}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <span className={`font-semibold ${m.stNum === maxST ? 'text-emerald-600' : isSelected ? 'text-indigo-700' : 'text-gray-600'}`}>
                            ST: {m.st}
                          </span>
                          {upST !== null && (
                            <span className={`text-[9px] font-bold ${upST ? 'text-emerald-500' : 'text-red-400'}`}>{upST ? '↑' : '↓'}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <span className={`font-semibold ${m.mNum === maxM ? 'text-blue-600' : isSelected ? 'text-indigo-700' : 'text-gray-600'}`}>
                            M: {m.m}
                          </span>
                          {upM !== null && (
                            <span className={`text-[9px] font-bold ${upM ? 'text-blue-500' : 'text-red-400'}`}>{upM ? '↑' : '↓'}</span>
                          )}
                        </div>
                        <div className={`text-[10px] ${isSelected ? 'text-indigo-500' : 'text-gray-400'}`}>Rev: {m.r}</div>
                      </div>
                      {isSelected && (
                        <span className="inline-flex items-center gap-0.5 mt-1.5 bg-indigo-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                          <Check size={8} /> Applied
                        </span>
                      )}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ─── Markdown distribution chart ─────────────────────────────────────────────

function MarkdownDistribution({ highlightIndex }) {
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
      <ResponsiveContainer width="100%" height={150}>
        <BarChart data={distributionData} margin={{ top: 4, right: 0, left: -22, bottom: 0 }} barGap={1} barCategoryGap="20%">
          <XAxis dataKey="bucket" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 8 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 8 }} domain={[0, 40]} ticks={[0, 10, 20, 30, 40]} />
          <Bar dataKey="current" radius={[2, 2, 0, 0]}>
            {distributionData.map((_, i) => <Cell key={i} fill="#c7d2fe" />)}
          </Bar>
          <Bar dataKey="planned" radius={[2, 2, 0, 0]}>
            {distributionData.map((_, i) => <Cell key={i} fill={highlightIndex === i ? '#4338ca' : '#6366f1'} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="text-center text-[10px] text-gray-400 -mt-1">Markdown Bucket</div>
    </div>
  )
}

// ─── Risk signals ─────────────────────────────────────────────────────────────

function RiskSignals({ stats }) {
  const warnings = stats.filter(s => s.warning)
  if (!warnings.length) return null
  return (
    <div className="flex items-center gap-2 flex-wrap mb-3">
      {warnings.map(w => (
        <div key={w.label} className="flex items-center gap-1.5 text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1">
          <AlertTriangle size={11} />
          {w.warning}
        </div>
      ))}
    </div>
  )
}

// ─── Preferences panel (right sidebar) ───────────────────────────────────────

function PreferencesPanel({
  scenarioType, onScenarioTypeChange,
  selectedCategories, onCategoriesChange,
  categoryLocked, onLockCategories, onUnlockCategories,
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
      <h3 className="text-sm font-semibold text-gray-900 mb-1">Strategy Preferences</h3>
      <p className="text-[11px] text-gray-400 mb-4">Filters apply to the table and chart.</p>

      {/* Strategy Type */}
      <div className="mb-3" ref={dropdownRef}>
        <div className="text-xs font-medium text-gray-600 mb-1.5">Strategy Type</div>
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

      {/* Category filter */}
      <div className="mb-4">
        <div className="text-xs font-medium text-gray-600 mb-1.5">Category Filter</div>
        <CategoryMultiSelect
          value={selectedCategories}
          onChange={onCategoriesChange}
          locked={categoryLocked}
          onLock={onLockCategories}
          onUnlock={onUnlockCategories}
        />
      </div>

      {/* Toggles */}
      <div className="flex flex-col gap-3 pt-3 border-t border-gray-100">
        <Toggle label="View gross margin ($)" value={viewGrossMargin} onChange={onViewGrossMarginChange} />
        {!isGuardrails && (
          <>
            <Toggle
              label={<span className="flex items-center gap-1"><ArrowRightLeft size={11} /> Compare scenarios</span>}
              value={compareMode}
              onChange={onCompareModeChange}
            />
            <Toggle label="Include flat discounts" value={flatDiscounts} onChange={onFlatDiscountsChange} />
          </>
        )}
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

function buildDefaultName(scenarioType, selectedIds, selectedGuardrails) {
  const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  if (scenarioType !== 'guardrails') {
    const pt = allPoints.find(p => p.id === selectedIds[0])
    if (!pt) return `Scenario — ${dateStr}`
    return `${pt.label.replace('% markdown', '%').replace('% (Peak rec.)', ' Peak')} — ${dateStr}`
  }
  const counts = {}
  Object.values(selectedGuardrails).forEach(id => { counts[id] = (counts[id] || 0) + 1 })
  const dominant = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0]
  const allSame = Object.keys(counts).length === 1
  const name = guardrailSets.find(g => g.id === dominant)?.name.split(' ')[0] ?? 'Mixed'
  return allSame ? `${name} Strategy — ${dateStr}` : `${name}-led Mix — ${dateStr}`
}

export default function CampaignScenarioTab({ onScenarioSaved }) {
  const [scenarioType, setScenarioType]           = useState('default')
  const [selectedCategories, setSelectedCategories] = useState([])   // [] = all
  const [viewGrossMargin, setViewGrossMargin]     = useState(false)
  const [compareMode, setCompareMode]             = useState(false)
  const [flatDiscounts, setFlatDiscounts]         = useState(true)
  const [selectedIds, setSelectedIds]             = useState([6])
  const [selectedGuardrails, setSelectedGuardrails] = useState(
    Object.fromEntries(guardrailCategories.map(c => [c.id, 'balanced']))
  )
  const [categoryLocked, setCategoryLocked]   = useState(false)
  const [lastChange, setLastChange]   = useState(null)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [saveToast, setSaveToast]     = useState(null)

  const isGuardrails  = scenarioType === 'guardrails'
  const displayPoints = flatDiscounts ? allPoints : allPoints.filter(p => p.type !== 'flat')
  const primaryPoint  = allPoints.find(p => p.id === selectedIds[0]) || null

  const activeCats = selectedCategories.length === 0
    ? guardrailCategories
    : guardrailCategories.filter(c => selectedCategories.includes(c.id))

  const kpiStats = isGuardrails
    ? computeGuardrailStats(selectedGuardrails, activeCats)
    : computeScenarioStats(primaryPoint || allPoints.find(p => p.id === 6))

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

  function handleGuardrailSelect(catId, setId) {
    const prev = selectedGuardrails[catId]
    if (prev === setId) return
    const cat  = guardrailCategories.find(c => c.id === catId)
    const oldM = cat.metrics[prev]
    const newM = cat.metrics[setId]
    const dST  = newM.stNum - oldM.stNum
    const dM   = newM.mNum  - oldM.mNum
    const parts = []
    if (Math.abs(dST) >= 0.5) parts.push(`${dST > 0 ? '+' : ''}${dST.toFixed(1)}pp sell-through`)
    if (Math.abs(dM)  >= 0.5) parts.push(`${dM  > 0 ? '+' : ''}${dM.toFixed(1)}pp margin`)
    setSelectedGuardrails(g => ({ ...g, [catId]: setId }))
    const ts = Date.now()
    setLastChange({ catId, message: parts.join(', ') || null, ts })
    setTimeout(() => setLastChange(lc => lc?.ts === ts ? null : lc), 2500)
  }

  function handleSaveConfirm(name) {
    setShowSaveModal(false)
    setSaveToast({ name })
    if (selectedCategories.length > 0) setCategoryLocked(true)
    const lockedCategoryNames = selectedCategories.length > 0
      ? guardrailCategories.filter(c => selectedCategories.includes(c.id)).map(c => c.name)
      : []
    onScenarioSaved?.({ name, lockedCategoryNames })
  }

  function handleLockCategories() {
    if (selectedCategories.length > 0) setCategoryLocked(true)
  }

  function handleUnlockCategories() {
    setCategoryLocked(false)
  }

  const distributionHighlight = primaryPoint ? Math.floor(primaryPoint.markdown / 5) - 1 : -1

  return (
    <div>
      <StatsBar stats={kpiStats} />
      <RiskSignals stats={kpiStats} />

      <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 300px' }}>

        {/* ── Guardrails view ───────────────────────────────────────────────── */}
        {isGuardrails && (
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Choose a Strategy per Category</h3>
                <p className="text-xs text-gray-400 mt-0.5">Mix and match guardrail sets to optimise the full assortment.</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                <button className="flex items-center gap-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors">
                  <Plus size={13} /> Create Custom
                </button>
                <button
                  onClick={() => setShowSaveModal(true)}
                  className="flex items-center gap-1.5 bg-[#2a44d4] hover:bg-[#2438b8] text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-colors"
                >
                  <Save size={12} /> Save strategy
                </button>
              </div>
            </div>
            {categoryLocked && selectedCategories.length > 0 && (
              <LockedBanner selectedCategories={selectedCategories} onUnlock={handleUnlockCategories} />
            )}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {guardrailSets.map(set => <GuardrailCard key={set.id} set={set} />)}
            </div>
            <GuardrailTable
              categories={activeCats}
              totalCategories={guardrailCategories.length}
              selectedGuardrails={selectedGuardrails}
              onSelect={handleGuardrailSelect}
              lastChange={lastChange}
            />
          </div>
        )}

        {/* ── Scatter chart view ────────────────────────────────────────────── */}
        {!isGuardrails && (
          <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Sell-Through Rate vs Gross Margin</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Select a point to see projected outcomes, or enable Compare to evaluate two scenarios side by side.
                </p>
              </div>
              {selectedIds.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap justify-end ml-4">
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
                  <button
                    onClick={() => setShowSaveModal(true)}
                    className="flex items-center gap-1.5 bg-[#2a44d4] hover:bg-[#2438b8] text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors"
                  >
                    <Save size={12} />
                    {compareMode ? 'Save comparison' : 'Save & apply'}
                  </button>
                </div>
              )}
            </div>

            {compareMode && (
              <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-2 mb-2 text-xs text-indigo-700">
                <ArrowRightLeft size={12} />
                Compare mode active — select two points to compare scenarios side by side.
                <span className="ml-auto text-indigo-500">{selectedIds.length}/2</span>
              </div>
            )}

            <div className="flex items-center gap-4 mb-2 flex-wrap">
              {[
                { shape: 'triangle', label: 'Custom',           color: '#f97316' },
                { shape: 'square',   label: 'Flat discount',    color: '#16a34a' },
                { shape: 'circle',   label: 'Scenario',         color: '#4f46e5', outline: true },
                { shape: 'circle',   label: 'Peak recommended', color: '#4f46e5' },
              ].map(l => (
                <span key={l.label} className="flex items-center gap-1.5 text-xs text-gray-500">
                  {l.shape === 'circle'   && <span className={`w-3 h-3 rounded-full inline-block ${l.outline ? 'border border-indigo-500' : 'bg-indigo-500'}`} />}
                  {l.shape === 'square'   && <span className="w-3 h-3 border border-green-600 inline-block" />}
                  {l.shape === 'triangle' && <svg width={12} height={12} viewBox="0 0 12 12"><polygon points="6,1 11,11 1,11" fill="none" stroke="#f97316" strokeWidth={1.5} /></svg>}
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
            selectedCategories={selectedCategories}
            onCategoriesChange={v => { if (!categoryLocked) setSelectedCategories(v) }}
            categoryLocked={categoryLocked}
            onLockCategories={handleLockCategories}
            onUnlockCategories={handleUnlockCategories}
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

      {/* Save modal */}
      {showSaveModal && (
        <SaveModal
          defaultName={buildDefaultName(scenarioType, selectedIds, selectedGuardrails)}
          kpiStats={kpiStats}
          scenarioType={scenarioType}
          selectedGuardrails={selectedGuardrails}
          onClose={() => setShowSaveModal(false)}
          onSave={handleSaveConfirm}
        />
      )}

      {/* Save toast */}
      {saveToast && (
        <SaveToast name={saveToast.name} onDismiss={() => setSaveToast(null)} />
      )}
    </div>
  )
}
