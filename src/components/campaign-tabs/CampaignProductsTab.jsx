import { useState, useEffect, useRef } from 'react'
import {
  Search, SlidersHorizontal, Columns2, ChevronDown, ChevronUp,
  TrendingUp, TrendingDown, ChevronLeft, ChevronRight,
  ChevronsLeft, ChevronsRight, Edit2, Settings, ShieldAlert,
  AlertTriangle, CheckCircle2, LayoutGrid, Check, Lock, X, Plus,
} from 'lucide-react'
import { RL_CATEGORIES } from '../../data/rlStrategies'
import CreateHitModal from '../CreateHitModal'

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

// ─── RL-specific data ─────────────────────────────────────────────────────────

const RL_CAT_DATA = [
  { rlCatId: 1, name: "Women's Polo",  products: 8200, optimised: 7800, avgMarkdown: '12%', sellThrough: '88%', sellThroughTarget: '85%', vstTarget: '+3%',  revenue: '£142K', revenueVsTarget: '+£8K',  avgMargin: '56%', stockCover: 1.8, guardrails: false, guardrailNote: null,                                   performance: 'on-track' },
  { rlCatId: 2, name: 'Knitwear',      products: 6400, optimised: 5800, avgMarkdown: '22%', sellThrough: '76%', sellThroughTarget: '85%', vstTarget: '-9%',  revenue: '£96K',  revenueVsTarget: '-£14K', avgMargin: '48%', stockCover: 3.1, guardrails: true,  guardrailNote: 'Min margin 45%',                      performance: 'underperforming' },
  { rlCatId: 3, name: 'Oxford Shirts', products: 5100, optimised: 4900, avgMarkdown: '15%', sellThrough: '84%', sellThroughTarget: '85%', vstTarget: '-1%',  revenue: '£78K',  revenueVsTarget: '-£2K',  avgMargin: '52%', stockCover: 2.1, guardrails: false, guardrailNote: null,                                   performance: 'at-risk' },
  { rlCatId: 4, name: 'Chinos',        products: 4800, optimised: 4200, avgMarkdown: '28%', sellThrough: '72%', sellThroughTarget: '80%', vstTarget: '-8%',  revenue: '£61K',  revenueVsTarget: '-£11K', avgMargin: '44%', stockCover: 3.6, guardrails: true,  guardrailNote: 'Max discount 35%',                    performance: 'underperforming' },
  { rlCatId: 5, name: 'Outerwear',     products: 4200, optimised: 3400, avgMarkdown: '38%', sellThrough: '64%', sellThroughTarget: '80%', vstTarget: '-16%', revenue: '£84K',  revenueVsTarget: '-£31K', avgMargin: '36%', stockCover: 4.8, guardrails: true,  guardrailNote: 'Min margin 35% · Max discount 45%', performance: 'underperforming' },
  { rlCatId: 6, name: 'Accessories',   products: 2400, optimised: 2400, avgMarkdown: '8%',  sellThrough: '93%', sellThroughTarget: '85%', vstTarget: '+8%',  revenue: '£52K',  revenueVsTarget: '+£7K',  avgMargin: '64%', stockCover: 1.4, guardrails: false, guardrailNote: null,                                   performance: 'on-track' },
]

const RL_PRODUCTS = [
  { id: 1, name: 'Polo Shirt Classic',  productId: '#RL-001', category: "Women's Polo",  season: 'SS 2026', status: 'Optimised', country: 'UK', sales: 312, salesChange: '+4.2%', revenue: '£28.4K', revenueChange: '+3.8%', margin: '58.2%', marginChange: '+1.4%', stock: 1.6, stockChange: '-0.2%', predStock: 280,  predStockChange: '-8.5%',  predDemand: '96K',  predDemandChange: '+2.4%', predMargin: '12%', predMarginChange: '+1.2%', predRevenue: '£14.2K', predRevenueChange: '+3.1%' },
  { id: 2, name: 'Cable Knit Sweater',  productId: '#RL-002', category: 'Knitwear',      season: 'SS 2026', status: 'Original',  country: 'UK', sales: 198, salesChange: '-3.1%', revenue: '£18.6K', revenueChange: '-2.8%', margin: '47.4%', marginChange: '-2.1%', stock: 3.2, stockChange: '+0.8%', predStock: 510,  predStockChange: '+14.2%', predDemand: '74K',  predDemandChange: '-1.4%', predMargin: '8%',  predMarginChange: '-2.4%', predRevenue: '£8.1K',  predRevenueChange: '-3.2%' },
  { id: 3, name: 'Oxford Pinpoint',     productId: '#RL-003', category: 'Oxford Shirts', season: 'SS 2026', status: 'Optimised', country: 'UK', sales: 245, salesChange: '+1.8%', revenue: '£21.2K', revenueChange: '+1.4%', margin: '53.6%', marginChange: '+0.6%', stock: 2.0, stockChange: '-0.4%', predStock: 380,  predStockChange: '-8.1%',  predDemand: '88K',  predDemandChange: '+1.6%', predMargin: '11%', predMarginChange: '+0.8%', predRevenue: '£11.4K', predRevenueChange: '+2.2%' },
  { id: 4, name: 'Slim Chino Trouser',  productId: '#RL-004', category: 'Chinos',        season: 'SS 2026', status: 'Original',  country: 'UK', sales: 167, salesChange: '-4.8%', revenue: '£14.8K', revenueChange: '-5.2%', margin: '43.8%', marginChange: '-3.6%', stock: 3.8, stockChange: '+1.2%', predStock: 620,  predStockChange: '+22.1%', predDemand: '58K',  predDemandChange: '-3.8%', predMargin: '7%',  predMarginChange: '-3.2%', predRevenue: '£6.8K',  predRevenueChange: '-4.8%' },
  { id: 5, name: 'Quilted Field Jacket',productId: '#RL-005', category: 'Outerwear',     season: 'SS 2026', status: 'Optimised', country: 'UK', sales: 142, salesChange: '-8.2%', revenue: '£28.6K', revenueChange: '-9.1%', margin: '36.4%', marginChange: '-6.2%', stock: 4.9, stockChange: '+2.1%', predStock: 820,  predStockChange: '+38.4%', predDemand: '46K',  predDemandChange: '-8.4%', predMargin: '6%',  predMarginChange: '-5.8%', predRevenue: '£8.4K',  predRevenueChange: '-8.6%' },
  { id: 6, name: 'Canvas Belt',         productId: '#RL-006', category: 'Accessories',   season: 'SS 2026', status: 'Optimised', country: 'UK', sales: 428, salesChange: '+6.4%', revenue: '£12.8K', revenueChange: '+5.8%', margin: '65.2%', marginChange: '+2.4%', stock: 1.3, stockChange: '-0.6%', predStock: 180,  predStockChange: '-12.4%', predDemand: '148K', predDemandChange: '+4.8%', predMargin: '14%', predMarginChange: '+2.1%', predRevenue: '£7.2K',  predRevenueChange: '+4.4%' },
  { id: 7, name: 'Polo Shirt Slim Fit', productId: '#RL-007', category: "Women's Polo",  season: 'SS 2026', status: 'Optimised', country: 'UK', sales: 284, salesChange: '+3.6%', revenue: '£24.2K', revenueChange: '+3.1%', margin: '56.8%', marginChange: '+1.2%', stock: 1.8, stockChange: '-0.3%', predStock: 310,  predStockChange: '-6.2%',  predDemand: '102K', predDemandChange: '+2.8%', predMargin: '12%', predMarginChange: '+1.4%', predRevenue: '£12.8K', predRevenueChange: '+2.8%' },
  { id: 8, name: 'Merino Crewneck',     productId: '#RL-008', category: 'Knitwear',      season: 'SS 2026', status: 'Original',  country: 'UK', sales: 176, salesChange: '-2.4%', revenue: '£16.4K', revenueChange: '-2.1%', margin: '46.8%', marginChange: '-1.8%', stock: 2.8, stockChange: '+0.6%', predStock: 460,  predStockChange: '+9.8%',  predDemand: '68K',  predDemandChange: '-1.8%', predMargin: '8%',  predMarginChange: '-1.6%', predRevenue: '£7.6K',  predRevenueChange: '-2.4%' },
]

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

// ─── Scenario banner ──────────────────────────────────────────────────────────

function ScenarioBanner({ savedScenario, onClear }) {
  const { name, lockedCategoryNames } = savedScenario
  return (
    <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3 mb-4">
      <Lock size={14} className="text-indigo-500 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <span className="text-xs font-semibold text-indigo-900">Scenario applied: </span>
        <span className="text-xs text-indigo-700">{name}</span>
        {lockedCategoryNames.length > 0 && (
          <div className="text-[11px] text-indigo-500 mt-0.5">
            Locked categories: {lockedCategoryNames.join(' · ')}
          </div>
        )}
      </div>
      <button onClick={onClear} className="text-indigo-400 hover:text-indigo-600 transition-colors flex-shrink-0">
        <X size={14} />
      </button>
    </div>
  )
}

function isLockedCategory(catName, lockedNames) {
  if (!lockedNames?.length) return false
  const lower = catName.toLowerCase()
  return lockedNames.some(n => {
    const ln = n.toLowerCase()
    return lower.includes(ln) || ln.includes(lower)
  })
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function CampaignProductsTab({ status, initialFilter, savedScenario, onClearSavedScenario, isRL, rlLockedCats, onCreateHit, existingHitsCount = 3 }) {
  const isLive = status === 'Live'
  const [view, setView] = useState('Product Level')
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [filterPerf, setFilterPerf] = useState(initialFilter || null)
  const [selectedCatIds, setSelectedCatIds] = useState(new Set())
  const [selectedProductIds, setSelectedProductIds] = useState(new Set())
  const [showHitModal, setShowHitModal] = useState(false)

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

  function toggleCatId(id) {
    setSelectedCatIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }
  function toggleProductId(id) {
    setSelectedProductIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }
  function clearSelection() { setSelectedCatIds(new Set()); setSelectedProductIds(new Set()) }

  function getPreselectedCategories() {
    if (view === 'Category Level') {
      return (isRL ? RL_CAT_DATA : categoryData)
        .filter(c => selectedCatIds.has(c.rlCatId ?? c.id))
        .map(c => c.name)
    }
    const selProds = (isRL ? RL_PRODUCTS : products).filter(p => selectedProductIds.has(p.id))
    return [...new Set(selProds.map(p => p.category))]
  }

  const totalSelected = selectedCatIds.size + selectedProductIds.size

  const sourceCatData = isRL ? RL_CAT_DATA : categoryData
  const filteredCategories = sourceCatData.filter(c => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false
    if (filterPerf === 'underperforming' && c.performance === 'on-track') return false
    return true
  })
  const displayProducts = isRL ? RL_PRODUCTS : products

  return (
    <div>
      {savedScenario && (
        <ScenarioBanner savedScenario={savedScenario} onClear={onClearSavedScenario} />
      )}

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
                  {isLive && <th className="w-10 px-3 py-3" />}
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
                {filteredCategories.map((cat, i) => {
                  const locked   = isLockedCategory(cat.name, savedScenario?.lockedCategoryNames)
                  const rlCat    = isRL ? RL_CATEGORIES.find(c => c.name === cat.name) : null
                  const rlLocked = rlCat ? rlLockedCats?.includes(rlCat.id) : false
                  const rowLocked = locked || rlLocked
                  return (
                  <tr key={cat.rlCatId ?? cat.id} className={`${i < filteredCategories.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-gray-50 transition-colors ${rowLocked ? 'bg-indigo-50/30' : ''} ${selectedCatIds.has(cat.rlCatId ?? cat.id) ? 'bg-indigo-50/40' : ''}`}>
                    {isLive && (
                      <td className="w-10 px-3 py-3" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => toggleCatId(cat.rlCatId ?? cat.id)}
                          className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${selectedCatIds.has(cat.rlCatId ?? cat.id) ? 'bg-[#2a44d4] border-[#2a44d4]' : 'border-gray-300 hover:border-[#2a44d4]'}`}
                        >
                          {selectedCatIds.has(cat.rlCatId ?? cat.id) && <Check size={9} className="text-white" />}
                        </button>
                      </td>
                    )}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {rowLocked && <Lock size={11} className="text-indigo-400 flex-shrink-0" />}
                        <span className={`font-semibold text-sm ${rowLocked ? 'text-indigo-700' : 'text-gray-900'}`}>{cat.name}</span>
                        {rowLocked && <span className="text-[10px] font-medium text-indigo-500 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded-full">Locked</span>}
                      </div>
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
                  )
                })}
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
                  {isLive && <th className="w-10 px-3 py-3" />}
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
                {displayProducts.map((p, i) => {
                  return (
                  <tr key={p.id} className={`${i < displayProducts.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-gray-50 ${selectedProductIds.has(p.id) ? 'bg-indigo-50/40' : ''}`}>
                    {isLive && (
                      <td className="w-10 px-3 py-3" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => toggleProductId(p.id)}
                          className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${selectedProductIds.has(p.id) ? 'bg-[#2a44d4] border-[#2a44d4]' : 'border-gray-300 hover:border-[#2a44d4]'}`}
                        >
                          {selectedProductIds.has(p.id) && <Check size={9} className="text-white" />}
                        </button>
                      </td>
                    )}
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
                  )
                })}
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

      {/* Floating selection bar */}
      {isLive && totalSelected > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className="flex items-center gap-4 bg-gray-900 text-white rounded-2xl px-5 py-3.5 shadow-2xl">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#2a44d4] flex items-center justify-center text-xs font-bold">
                {totalSelected}
              </div>
              <span className="text-sm font-medium">
                {view === 'Category Level'
                  ? `${selectedCatIds.size} ${selectedCatIds.size === 1 ? 'category' : 'categories'} selected`
                  : `${selectedProductIds.size} ${selectedProductIds.size === 1 ? 'product' : 'products'} selected`}
              </span>
            </div>
            <div className="w-px h-5 bg-white/20" />
            <button
              onClick={() => setShowHitModal(true)}
              className="flex items-center gap-1.5 bg-[#2a44d4] hover:bg-[#2438b8] text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
            >
              <Plus size={14} />
              Create Hit
            </button>
            <button onClick={clearSelection} className="text-white/50 hover:text-white text-sm transition-colors">
              Clear
            </button>
          </div>
        </div>
      )}

      {showHitModal && (
        <CreateHitModal
          onClose={() => setShowHitModal(false)}
          onCreateHit={hit => { onCreateHit?.(hit); clearSelection() }}
          existingHitsCount={existingHitsCount}
          preselectedCategories={getPreselectedCategories()}
        />
      )}
    </div>
  )
}
