import { useState, useEffect, useRef } from 'react'
import {
  Search, SlidersHorizontal, Columns2, ChevronDown, ChevronUp,
  TrendingUp, TrendingDown, ChevronLeft, ChevronRight,
  ChevronsLeft, ChevronsRight, Edit2, Settings, ShieldAlert,
  AlertTriangle, CheckCircle2, LayoutGrid, Check,
} from 'lucide-react'

// ─── Mock data ──────────────────────────────────────────────────────────────

const categoryData = [
  {
    id: 1, name: 'Coats & Jackets', products: 1240, optimised: 1108,
    avgMarkdown: '32%', sellThrough: '71%', sellThroughTarget: '80%', vstTarget: '-9%',
    revenue: '£124.5K', revenueVsTarget: '-£13K', avgMargin: '48%', stockCover: 3.2,
    guardrails: true, guardrailNote: 'Min margin 40% · Max discount 50%',
    performance: 'underperforming',
  },
  {
    id: 2, name: 'Knitwear', products: 890, optimised: 890,
    avgMarkdown: '18%', sellThrough: '84%', sellThroughTarget: '80%', vstTarget: '+4%',
    revenue: '£89.2K', revenueVsTarget: '+£4K', avgMargin: '52%', stockCover: 2.1,
    guardrails: false, guardrailNote: null,
    performance: 'on-track',
  },
  {
    id: 3, name: 'Dresses', products: 2100, optimised: 1890,
    avgMarkdown: '25%', sellThrough: '76%', sellThroughTarget: '80%', vstTarget: '-4%',
    revenue: '£210.8K', revenueVsTarget: '-£8K', avgMargin: '45%', stockCover: 2.8,
    guardrails: true, guardrailNote: 'Max discount 40%',
    performance: 'at-risk',
  },
  {
    id: 4, name: 'Tops & Blouses', products: 3400, optimised: 3400,
    avgMarkdown: '15%', sellThrough: '91%', sellThroughTarget: '85%', vstTarget: '+6%',
    revenue: '£186.3K', revenueVsTarget: '+£11K', avgMargin: '56%', stockCover: 1.4,
    guardrails: false, guardrailNote: null,
    performance: 'on-track',
  },
  {
    id: 5, name: 'Trousers & Jeans', products: 1650, optimised: 1320,
    avgMarkdown: '28%', sellThrough: '68%', sellThroughTarget: '80%', vstTarget: '-12%',
    revenue: '£143.1K', revenueVsTarget: '-£21K', avgMargin: '41%', stockCover: 4.1,
    guardrails: true, guardrailNote: 'Min margin 38% · Max discount 45%',
    performance: 'underperforming',
  },
  {
    id: 6, name: 'Footwear', products: 780, optimised: 624,
    avgMarkdown: '35%', sellThrough: '58%', sellThroughTarget: '75%', vstTarget: '-17%',
    revenue: '£64.9K', revenueVsTarget: '-£19K', avgMargin: '35%', stockCover: 5.2,
    guardrails: true, guardrailNote: 'Min margin 30% · Max discount 55%',
    performance: 'underperforming',
  },
  {
    id: 7, name: 'Accessories', products: 4200, optimised: 4200,
    avgMarkdown: '12%', sellThrough: '88%', sellThroughTarget: '80%', vstTarget: '+8%',
    revenue: '£98.4K', revenueVsTarget: '+£7K', avgMargin: '61%', stockCover: 1.8,
    guardrails: false, guardrailNote: null,
    performance: 'on-track',
  },
  {
    id: 8, name: 'Knitwear Accessories', products: 560, optimised: 420,
    avgMarkdown: '20%', sellThrough: '79%', sellThroughTarget: '80%', vstTarget: '-1%',
    revenue: '£28.6K', revenueVsTarget: '-£0.4K', avgMargin: '50%', stockCover: 2.5,
    guardrails: false, guardrailNote: null,
    performance: 'on-track',
  },
]

const products = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1, name: 'Product', productId: '#ID',
  category: ['Coats & Jackets', 'Knitwear', 'Dresses', 'Tops & Blouses'][i % 4],
  season: 'AW 2024', status: i % 2 === 0 ? 'Optimised' : 'Original', country: 'UK',
  sales: [123, 98, 211, 67, 145, 88, 192, 54][i], salesChange: i % 3 === 0 ? '-2.4%' : '+2.4%',
  revenue: ['£20.2K', '£15.6K', '£38.4K', '£11.2K', '£24.8K', '£14.1K', '£31.6K', '£8.9K'][i],
  revenueChange: i % 3 === 0 ? '-3.1%' : '+2.4%',
  margin: ['77.6%', '52.1%', '45.3%', '61.0%', '48.8%', '35.2%', '56.4%', '50.9%'][i],
  marginChange: i % 3 === 0 ? '-2.4%' : '+2.4%',
  stock: [1.4, 2.8, 3.2, 1.1, 2.1, 4.5, 1.8, 2.3][i], stockChange: '+2.4%',
  predStock: [583, 402, 710, 290, 468, 820, 380, 510][i], predStockChange: '+2.4%',
  predDemand: ['102K', '84K', '148K', '62K', '96K', '74K', '128K', '48K'][i], predDemandChange: '+2.4%',
  predMargin: ['10%', '8%', '12%', '15%', '9%', '7%', '11%', '10%'][i], predMarginChange: i % 3 === 0 ? '-2.4%' : '+2.4%',
  predRevenue: ['£10.2K', '£8.1K', '£14.6K', '£5.8K', '£9.4K', '£6.3K', '£12.1K', '£4.2K'][i], predRevenueChange: '+2.4%',
}))

// ─── Column definitions ───────────────────────────────────────────────────────

const CAT_COLS = [
  { key: 'products',   label: 'Products / Optimised' },
  { key: 'markdown',   label: 'Avg Markdown' },
  { key: 'sellThru',   label: 'Sell-Through' },
  { key: 'revenue',    label: 'Revenue' },
  { key: 'margin',     label: 'Avg Margin' },
  { key: 'stock',      label: 'Stock Cover' },
  { key: 'guardrails', label: 'Guardrails' },
]

const PROD_COLS = [
  { key: 'category',    label: 'Category' },
  { key: 'season',      label: 'Season' },
  { key: 'status',      label: 'Status' },
  { key: 'country',     label: 'Country' },
  { key: 'sales',       label: 'Sales' },
  { key: 'revenue',     label: 'Revenue' },
  { key: 'margin',      label: 'Margin %' },
  { key: 'stock',       label: 'Stock' },
  { key: 'predStock',   label: 'Pred. Stock' },
  { key: 'predDemand',  label: 'Pred. Demand' },
  { key: 'predMargin',  label: 'Pred. Margin' },
  { key: 'predRevenue', label: 'Pred. Revenue' },
]

// ─── Sub-components ──────────────────────────────────────────────────────────

function Delta({ value }) {
  const isNeg = value.startsWith('-')
  return (
    <span className={`flex items-center gap-0.5 text-xs ${isNeg ? 'text-red-500' : 'text-green-600'}`}>
      {isNeg ? <TrendingDown size={9} /> : <TrendingUp size={9} />}
      {value}
    </span>
  )
}

function ProductStatusBadge({ status }) {
  return status === 'Optimised'
    ? <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">✓ Optimised</span>
    : <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">⊙ Original</span>
}

function PerformanceBadge({ perf }) {
  if (perf === 'underperforming') return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
      <AlertTriangle size={9} /> Underperforming
    </span>
  )
  if (perf === 'at-risk') return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
      <AlertTriangle size={9} /> At risk
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
      <CheckCircle2 size={9} /> On track
    </span>
  )
}

function GuardrailBadge({ note }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full cursor-help" title={note}>
      <ShieldAlert size={9} /> Guardrails
    </span>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function CampaignProductsTab({ status, initialFilter }) {
  const isLive = status === 'Live'
  const [view, setView] = useState('Product Level')
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [filterPerf, setFilterPerf] = useState(initialFilter || null)

  const [visibleCatCols, setVisibleCatCols] = useState(new Set(CAT_COLS.map(c => c.key)))
  const [visibleProdCols, setVisibleProdCols] = useState(new Set(PROD_COLS.map(c => c.key)))
  const [showColPanel, setShowColPanel] = useState(false)
  const colPanelRef = useRef(null)

  const totalPages = 25

  useEffect(() => {
    if (initialFilter) setFilterPerf(initialFilter)
  }, [initialFilter])

  useEffect(() => {
    if (!showColPanel) return
    function handler(e) {
      if (colPanelRef.current && !colPanelRef.current.contains(e.target)) setShowColPanel(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showColPanel])

  const currentCols = view === 'Category Level' ? CAT_COLS : PROD_COLS
  const currentVisible = view === 'Category Level' ? visibleCatCols : visibleProdCols
  const setCurrentVisible = view === 'Category Level' ? setVisibleCatCols : setVisibleProdCols

  function toggleCol(key) {
    setCurrentVisible(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const col = key => currentVisible.has(key)

  const filteredCategories = categoryData.filter(c => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false
    if (filterPerf === 'underperforming' && c.performance === 'on-track') return false
    return true
  })

  return (
    <div>
      {/* Summary card */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="text-2xl font-bold text-gray-900 mb-2">
              325,302 <span className="text-lg font-semibold text-gray-500">Products</span>
            </div>
            <div className="flex rounded-full overflow-hidden h-2 mb-2" style={{ maxWidth: 400 }}>
              <div className="bg-green-500 h-full" style={{ width: '75%' }} />
              <div className="bg-amber-400 h-full" style={{ width: '10%' }} />
              <div className="bg-gray-200 h-full flex-1" />
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-green-500" />Optimised: 243,492</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-amber-400" />Original Price: 34,034</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {['Product Level', 'Category Level'].map(v => (
              <button
                key={v}
                onClick={() => { setView(v); setShowColPanel(false) }}
                className={`flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg border transition-colors
                  ${view === v ? 'border-[#2a44d4] text-[#2a44d4] bg-white' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
              >
                {v === 'Product Level' ? <Edit2 size={12} /> : <LayoutGrid size={12} />}
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative w-56">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search categories…"
            className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:border-[#2a44d4] bg-white"
          />
        </div>
        <button className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">
          <SlidersHorizontal size={14} /> Filter
        </button>

        {/* Columns button */}
        <div className="relative" ref={colPanelRef}>
          <button
            onClick={() => setShowColPanel(v => !v)}
            className={`flex items-center gap-1.5 border rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              showColPanel ? 'border-[#2a44d4] text-[#2a44d4] bg-indigo-50' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Columns2 size={14} /> Columns
          </button>
          {showColPanel && (
            <div className="absolute top-full left-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-lg z-20 w-52 overflow-hidden">
              <div className="px-3 py-2.5 border-b border-gray-100">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {view === 'Category Level' ? 'Category columns' : 'Product columns'}
                </span>
              </div>
              {currentCols.map(c => (
                <button key={c.key} onClick={() => toggleCol(c.key)}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                  {c.label}
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${currentVisible.has(c.key) ? 'bg-[#2a44d4] border-[#2a44d4]' : 'border-gray-300'}`}>
                    {currentVisible.has(c.key) && <Check size={9} className="text-white" />}
                  </div>
                </button>
              ))}
              <div className="px-3 py-2 border-t border-gray-100">
                <button
                  onClick={() => setCurrentVisible(new Set(currentCols.map(c => c.key)))}
                  className="text-xs text-[#2a44d4] hover:underline"
                >
                  Reset to default
                </button>
              </div>
            </div>
          )}
        </div>

        {filterPerf === 'underperforming' && (
          <span className="flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-600 text-xs font-medium px-3 py-1.5 rounded-full">
            <AlertTriangle size={11} /> Underperforming only
            <button onClick={() => setFilterPerf(null)} className="ml-1 text-red-400 hover:text-red-600">×</button>
          </span>
        )}
        {view === 'Product Level' && (
          <div className="ml-auto flex items-center gap-2 text-sm text-gray-500">
            Min stock cover:
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <span className="px-3 py-1.5 text-sm font-medium text-gray-700">2.7 Weeks</span>
              <div className="flex flex-col border-l border-gray-200">
                <button className="px-1.5 py-0.5 hover:bg-gray-50"><ChevronUp size={10} /></button>
                <button className="px-1.5 py-0.5 hover:bg-gray-50 border-t border-gray-200"><ChevronDown size={10} /></button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── CATEGORY VIEW ─────────────────────────────────────── */}
      {view === 'Category Level' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700 min-w-[160px]">Category</th>
                  {col('products') && (
                    <th className="text-right px-3 py-3 text-xs font-semibold text-gray-500 whitespace-nowrap">
                      Products<br /><span className="font-normal text-gray-400">Optimised</span>
                    </th>
                  )}
                  {col('markdown') && <th className="text-right px-3 py-3 text-xs font-semibold text-gray-500 whitespace-nowrap">Avg Markdown</th>}
                  {col('sellThru') && (
                    <th className="text-right px-3 py-3 text-xs font-semibold text-gray-500 whitespace-nowrap">
                      Sell-Through<br /><span className="font-normal text-gray-400">vs Target</span>
                    </th>
                  )}
                  {col('revenue') && (
                    <th className="text-right px-3 py-3 text-xs font-semibold text-gray-500 whitespace-nowrap">
                      Revenue<br /><span className="font-normal text-gray-400">vs Target</span>
                    </th>
                  )}
                  {col('margin') && <th className="text-right px-3 py-3 text-xs font-semibold text-gray-500 whitespace-nowrap">Avg Margin</th>}
                  {col('stock') && (
                    <th className="text-right px-3 py-3 text-xs font-semibold text-gray-500 whitespace-nowrap">
                      Stock Cover<br /><span className="font-normal text-gray-400">weeks</span>
                    </th>
                  )}
                  {isLive && (
                    <th className="text-center px-3 py-3 text-xs font-semibold text-gray-500 whitespace-nowrap">Performance</th>
                  )}
                  {col('guardrails') && <th className="text-center px-3 py-3 text-xs font-semibold text-gray-500">Guardrails</th>}
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((cat, i) => (
                  <tr key={cat.id} className={`${i < filteredCategories.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-gray-50 transition-colors`}>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-900 text-sm">{cat.name}</div>
                      <div className="text-xs text-gray-400">{cat.products.toLocaleString()} products</div>
                    </td>
                    {col('products') && (
                      <td className="px-3 py-3 text-right">
                        <div className="text-sm font-semibold text-gray-900">{cat.products.toLocaleString()}</div>
                        <div className="text-xs text-gray-400">{cat.optimised.toLocaleString()} optimised</div>
                      </td>
                    )}
                    {col('markdown') && <td className="px-3 py-3 text-right"><span className="text-sm font-semibold text-gray-900">{cat.avgMarkdown}</span></td>}
                    {col('sellThru') && (
                      <td className="px-3 py-3 text-right">
                        <div className="text-sm font-semibold text-gray-900">{cat.sellThrough}</div>
                        <Delta value={cat.vstTarget} />
                      </td>
                    )}
                    {col('revenue') && (
                      <td className="px-3 py-3 text-right">
                        <div className="text-sm font-semibold text-gray-900">{cat.revenue}</div>
                        <Delta value={cat.revenueVsTarget} />
                      </td>
                    )}
                    {col('margin') && <td className="px-3 py-3 text-right"><span className="text-sm font-semibold text-gray-900">{cat.avgMargin}</span></td>}
                    {col('stock') && (
                      <td className="px-3 py-3 text-right">
                        <span className={`text-sm font-semibold ${cat.stockCover > 4 ? 'text-red-600' : cat.stockCover > 3 ? 'text-amber-600' : 'text-gray-900'}`}>
                          {cat.stockCover}
                        </span>
                      </td>
                    )}
                    {isLive && (
                      <td className="px-3 py-3 text-center"><PerformanceBadge perf={cat.performance} /></td>
                    )}
                    {col('guardrails') && (
                      <td className="px-3 py-3 text-center">
                        {cat.guardrails ? <GuardrailBadge note={cat.guardrailNote} /> : <span className="text-xs text-gray-300">—</span>}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredCategories.length === 0 && (
            <div className="py-12 text-center text-sm text-gray-400">No categories match your filter.</div>
          )}
        </div>
      )}

      {/* ─── PRODUCT VIEW ──────────────────────────────────────── */}
      {view === 'Product Level' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 min-w-[140px]">
                    <div className="text-xs font-semibold text-gray-700">Product Name</div>
                    <div className="text-xs font-normal text-gray-400">Product ID</div>
                  </th>
                  {col('category') && <th className="text-left px-3 py-3 text-xs font-semibold text-gray-500">Category</th>}
                  {col('season') && <th className="text-left px-3 py-3 text-xs font-semibold text-gray-500">Season</th>}
                  {col('status') && <th className="text-left px-3 py-3 text-xs font-semibold text-gray-500">Status</th>}
                  <th className="px-2 py-3" />
                  {col('country') && <th className="text-left px-3 py-3 text-xs font-semibold text-gray-500">Country</th>}
                  {col('sales') && <th className="text-right px-3 py-3"><div className="text-xs font-semibold text-gray-500">Sales</div><div className="text-xs font-normal text-gray-400">vs LY</div></th>}
                  {col('revenue') && <th className="text-right px-3 py-3"><div className="text-xs font-semibold text-gray-500">Revenue</div><div className="text-xs font-normal text-gray-400">vs LY</div></th>}
                  {col('margin') && <th className="text-right px-3 py-3"><div className="text-xs font-semibold text-gray-500">Margin %</div><div className="text-xs font-normal text-gray-400">vs LY</div></th>}
                  {col('stock') && <th className="text-right px-3 py-3"><div className="text-xs font-semibold text-gray-500">Stock</div><div className="text-xs font-normal text-gray-400">wks cover</div></th>}
                  {col('predStock') && <th className="text-right px-3 py-3"><div className="text-xs font-semibold text-gray-500">Pred. Stock</div><div className="text-xs font-normal text-gray-400">wks</div></th>}
                  {col('predDemand') && <th className="text-right px-3 py-3"><div className="text-xs font-semibold text-gray-500">Pred. Demand</div><div className="text-xs font-normal text-gray-400">vs Base</div></th>}
                  {col('predMargin') && <th className="text-right px-3 py-3"><div className="text-xs font-semibold text-gray-500">Pred. Margin</div><div className="text-xs font-normal text-gray-400">vs Base</div></th>}
                  {col('predRevenue') && <th className="text-right px-3 py-3"><div className="text-xs font-semibold text-gray-500">Pred. Revenue</div><div className="text-xs font-normal text-gray-400">vs Base</div></th>}
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => (
                  <tr key={p.id} className={`${i < products.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-gray-50`}>
                    <td className="px-4 py-3"><div className="font-semibold text-gray-900">{p.name}</div><div className="text-xs text-gray-400">{p.productId}</div></td>
                    {col('category') && <td className="px-3 py-3 text-xs text-gray-600">{p.category}</td>}
                    {col('season') && <td className="px-3 py-3 text-xs text-gray-600">{p.season}</td>}
                    {col('status') && <td className="px-3 py-3"><ProductStatusBadge status={p.status} /></td>}
                    <td className="px-2 py-3">
                      <div className="flex gap-1">
                        <button className="w-6 h-6 flex items-center justify-center rounded border border-gray-200 hover:bg-gray-50 text-gray-400"><Edit2 size={10} /></button>
                        <button className="w-6 h-6 flex items-center justify-center rounded border border-gray-200 hover:bg-gray-50 text-gray-400"><Settings size={10} /></button>
                      </div>
                    </td>
                    {col('country') && <td className="px-3 py-3 text-xs text-gray-600">{p.country}</td>}
                    {col('sales') && <td className="px-3 py-3 text-right"><div className="text-sm text-gray-900">{p.sales}</div><Delta value={p.salesChange} /></td>}
                    {col('revenue') && <td className="px-3 py-3 text-right"><div className="text-sm text-gray-900">{p.revenue}</div><Delta value={p.revenueChange} /></td>}
                    {col('margin') && <td className="px-3 py-3 text-right"><div className="text-sm text-gray-900">{p.margin}</div><Delta value={p.marginChange} /></td>}
                    {col('stock') && <td className="px-3 py-3 text-right"><div className="text-sm text-gray-900">{p.stock}</div><Delta value={p.stockChange} /></td>}
                    {col('predStock') && <td className="px-3 py-3 text-right"><div className="text-sm text-gray-900">{p.predStock}</div><Delta value={p.predStockChange} /></td>}
                    {col('predDemand') && <td className="px-3 py-3 text-right"><div className="text-sm text-gray-900">{p.predDemand}</div><Delta value={p.predDemandChange} /></td>}
                    {col('predMargin') && <td className="px-3 py-3 text-right"><div className="text-sm text-gray-900">{p.predMargin}</div><Delta value={p.predMarginChange} /></td>}
                    {col('predRevenue') && <td className="px-3 py-3 text-right"><div className="text-sm text-gray-900">{p.predRevenue}</div><Delta value={p.predRevenueChange} /></td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(1)} className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 text-gray-500"><ChevronsLeft size={13} /></button>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 text-gray-500"><ChevronLeft size={13} /></button>
              {[1, 2, 3, 4, 5, 6].map(n => (
                <button key={n} onClick={() => setPage(n)}
                  className={`w-7 h-7 flex items-center justify-center rounded text-sm ${page === n ? 'bg-[#2a44d4] text-white' : 'hover:bg-gray-100 text-gray-600'}`}>
                  {n}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 text-gray-500"><ChevronRight size={13} /></button>
              <button onClick={() => setPage(totalPages)} className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 text-gray-500"><ChevronsRight size={13} /></button>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span>{page} of {totalPages}</span>
              <div className="flex items-center gap-1">
                Show <button className="flex items-center gap-1 border border-gray-200 rounded px-2 py-1 text-xs text-gray-600 hover:bg-gray-50">25 <ChevronDown size={9} /></button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
