import { useState } from 'react'
import { X, ArrowLeft, Sparkles, Settings2, TrendingUp, TrendingDown, ChevronDown, ChevronUp, Info, ArrowRight, CalendarDays } from 'lucide-react'

const RECOMMENDED_OPTIONS = [
  {
    name: 'Aggressive Markdown',
    desc: 'Increase markdown on Flats & Heels',
    confidence: 'high',
    discount: 35,
    categories: 2,
    sellThroughUplift: '+8.5%',
    revenueImpact: '+£42.3k',
    marginImpact: '-2.1%',
    projectedSellThrough: 73.5,
    projectedRevenue: '£4.44M',
    projectedRevenueDelta: '+£42k',
  },
  {
    name: 'Balanced Approach',
    desc: 'Moderate markdown on underperformers',
    confidence: 'high',
    discount: 25,
    categories: 3,
    sellThroughUplift: '+6.2%',
    revenueImpact: '+£38.9k',
    marginImpact: '-1.4%',
    projectedSellThrough: 71.2,
    projectedRevenue: '£4.44M',
    projectedRevenueDelta: '+£38.9k',
  },
  {
    name: 'Targeted Recovery',
    desc: 'Deep discount on slowest SKUs only',
    confidence: 'medium',
    discount: 45,
    categories: 1,
    sellThroughUplift: '+5.8%',
    revenueImpact: '+£35.2k',
    marginImpact: '-1.8%',
    projectedSellThrough: 70.8,
    projectedRevenue: '£4.44M',
    projectedRevenueDelta: '+£35.2k',
  },
]

const SUGGESTED_CATEGORIES = [
  { name: 'Flats',    tag: 'Underperforming' },
  { name: 'Heels',    tag: 'Underperforming' },
  { name: 'Mules',    tag: null },
  { name: 'Sandals',  tag: null },
  { name: 'Trainers', tag: null },
]

function ConfidenceBadge({ level }) {
  const isHigh = level === 'high'
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${isHigh ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${isHigh ? 'bg-green-500' : 'bg-gray-400'}`} />
      {isHigh ? 'High confidence' : 'Medium confidence'}
    </span>
  )
}

function MetricRow({ label, value, isNegative }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-gray-500">{label}</span>
      <span className={`text-xs font-semibold flex items-center gap-0.5 ${isNegative ? 'text-red-500' : 'text-green-600'}`}>
        {isNegative ? <TrendingDown size={11} /> : <TrendingUp size={11} />}
        {value}
      </span>
    </div>
  )
}

export default function CreateHitModal({ onClose, onCreateHit, existingHitsCount = 3, preselectedCategories = [] }) {
  const hasPreselected = preselectedCategories.length > 0
  const [tab, setTab]                     = useState(hasPreselected ? 'manual' : 'recommended')
  const [selectedIdx, setSelectedIdx]     = useState(0)
  const [configExpanded, setConfigExpanded] = useState(false)
  const [tradeoffDismissed, setTradeoffDismissed] = useState(false)
  const [advancedOpen, setAdvancedOpen]   = useState(false)

  // Manual form state
  const [discount, setDiscount]           = useState('')
  const [selectedCats, setSelectedCats]   = useState(
    hasPreselected ? new Set(preselectedCategories) : new Set(['Flats', 'Heels'])
  )

  // Merge suggested categories with any preselected ones not already in the list
  const allCategories = [
    ...SUGGESTED_CATEGORIES,
    ...preselectedCategories
      .filter(name => !SUGGESTED_CATEGORIES.some(s => s.name === name))
      .map(name => ({ name, tag: null })),
  ]

  const hitNumber = existingHitsCount + 1
  const option    = RECOMMENDED_OPTIONS[selectedIdx]

  function toggleCat(name) {
    setSelectedCats(prev => {
      const next = new Set(prev)
      next.has(name) ? next.delete(name) : next.add(name)
      return next
    })
  }

  function handleCreate(status) {
    const isManual = tab === 'manual'
    const newHit = {
      id: Date.now(),
      label:      `Hit ${hitNumber}`,
      name:       isManual
        ? `Hit ${hitNumber}: Custom ${discount || '—'}% markdown`
        : `Hit ${hitNumber}: ${option.name}`,
      discount:   isManual ? `${discount || '—'}% Discount` : `${option.discount}% Discount`,
      categories: isManual
        ? `${selectedCats.size} ${selectedCats.size === 1 ? 'Category' : 'Categories'}`
        : `${option.categories} ${option.categories === 1 ? 'Category' : 'Categories'}`,
      status,
      recommended: !isManual,
      sellThroughUplift: !isManual ? option.sellThroughUplift : null,
      projectedSellThrough: !isManual ? option.projectedSellThrough : null,
      projectedRevenueDelta: !isManual ? option.projectedRevenueDelta : null,
    }
    onCreateHit(newHit)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" onClick={onClose} />

      {/* Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[720px] mx-4 flex flex-col max-h-[90vh] overflow-hidden">

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <ArrowLeft size={14} className="text-gray-500" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900">Campaign Hit {hitNumber}</h2>
                <button className="text-gray-400 hover:text-gray-600">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M9.5 2.5L11.5 4.5L4.5 11.5H2.5V9.5L9.5 2.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-400 mt-0.5">Create a campaign hit within your current campaign</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <X size={15} className="text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-2 gap-2 px-6 py-3 border-b border-gray-100 shrink-0">
          <button
            onClick={() => setTab('recommended')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              tab === 'recommended'
                ? 'bg-[#eaecfb] text-[#2a44d4] border border-[#2a44d4]/20'
                : 'text-gray-500 hover:bg-gray-50 border border-transparent'
            }`}
          >
            <Sparkles size={14} />
            Recommended
          </button>
          <button
            onClick={() => setTab('manual')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              tab === 'manual'
                ? 'bg-[#eaecfb] text-[#2a44d4] border border-[#2a44d4]/20'
                : 'text-gray-500 hover:bg-gray-50 border border-transparent'
            }`}
          >
            <Settings2 size={14} />
            Customize Manually
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">

          {/* ── RECOMMENDED TAB ─────────────────────────────────────── */}
          {tab === 'recommended' && (
            <>
              {/* Option cards */}
              <div className="grid grid-cols-3 gap-3">
                {RECOMMENDED_OPTIONS.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedIdx(idx)}
                    className={`relative text-left p-4 rounded-xl border-2 transition-all ${
                      selectedIdx === idx
                        ? 'border-[#2a44d4] bg-[#f5f6ff]'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    {/* Selected checkmark */}
                    {selectedIdx === idx && (
                      <div className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-[#2a44d4] flex items-center justify-center shadow">
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}

                    <ConfidenceBadge level={opt.confidence} />
                    <p className="font-bold text-gray-900 mt-2 mb-0.5">{opt.name}</p>
                    <p className="text-xs text-gray-400 mb-3">{opt.desc}</p>

                    <div className="space-y-1.5 text-xs mb-3">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Discount</span>
                        <span className="font-semibold text-gray-900">{opt.discount}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Categories</span>
                        <span className="font-semibold text-gray-900">{opt.categories}</span>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-3 space-y-1.5">
                      <MetricRow label="Sell-through uplift" value={opt.sellThroughUplift} isNegative={false} />
                      <MetricRow label="Revenue impact" value={opt.revenueImpact} isNegative={false} />
                      <MetricRow label="Margin impact" value={opt.marginImpact} isNegative={true} />
                    </div>
                  </button>
                ))}
              </div>

              {/* Configure hit details - collapsible */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setConfigExpanded(v => !v)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-semibold text-gray-900">Configure Hit Details</span>
                  {configExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                </button>
                {configExpanded && (
                  <div className="px-5 pb-5 border-t border-gray-100">
                    <ManualForm discount={discount} setDiscount={setDiscount} selectedCats={selectedCats} toggleCat={toggleCat} advancedOpen={advancedOpen} setAdvancedOpen={setAdvancedOpen} availableCategories={allCategories} />
                  </div>
                )}
              </div>

              {/* Trade-off analysis banner */}
              {!tradeoffDismissed && (
                <div className="flex items-start justify-between gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
                  <div className="flex items-start gap-2.5">
                    <Info size={15} className="text-blue-500 mt-0.5 shrink-0" />
                    <p className="text-sm text-blue-800">
                      <strong>Trade-off analysis:</strong>{' '}
                      This action improves sell-through by{' '}
                      <span className="text-green-600 font-semibold">{option.sellThroughUplift}</span>{' '}
                      but reduces margin by{' '}
                      <span className="text-red-500 font-semibold">{option.marginImpact}</span>.{' '}
                      Net revenue impact is positive at{' '}
                      <span className="text-green-600 font-semibold">{option.revenueImpact}</span>.
                    </p>
                  </div>
                  <button onClick={() => setTradeoffDismissed(true)} className="text-blue-400 hover:text-blue-600 shrink-0">
                    <X size={14} />
                  </button>
                </div>
              )}

              {/* Projected Impact */}
              <div className="border border-gray-200 rounded-xl p-5">
                <p className="text-sm font-bold text-gray-900 mb-4">Projected Impact</p>
                <div className="grid grid-cols-2 gap-6">
                  {/* Sell-Through Rate */}
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Sell-Through Rate</p>
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">Current</p>
                        <p className="text-2xl font-bold text-gray-400">65%</p>
                      </div>
                      <ArrowRight size={16} className="text-gray-400 shrink-0" />
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">Projected</p>
                        <p className="text-2xl font-bold text-gray-900">{option.projectedSellThrough}%</p>
                      </div>
                      <span className="ml-auto inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-xl">
                        <TrendingUp size={12} />
                        {option.sellThroughUplift}
                      </span>
                    </div>
                  </div>
                  {/* Total Revenue */}
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Total Revenue</p>
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">Current</p>
                        <p className="text-2xl font-bold text-gray-400">£4.4M</p>
                      </div>
                      <ArrowRight size={16} className="text-gray-400 shrink-0" />
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">Projected</p>
                        <p className="text-2xl font-bold text-gray-900">{option.projectedRevenue}</p>
                      </div>
                      <span className="ml-auto inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-xl">
                        <TrendingUp size={12} />
                        {option.projectedRevenueDelta}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── MANUAL TAB ──────────────────────────────────────────── */}
          {tab === 'manual' && (
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <span className="text-sm font-semibold text-gray-900">Configure Hit Details</span>
                <ChevronUp size={16} className="text-gray-400" />
              </div>
              <div className="px-5 py-5">
                <ManualForm
                  discount={discount}
                  setDiscount={setDiscount}
                  selectedCats={selectedCats}
                  toggleCat={toggleCat}
                  advancedOpen={advancedOpen}
                  setAdvancedOpen={setAdvancedOpen}
                  availableCategories={allCategories}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="grid grid-cols-2 gap-3 px-6 py-4 border-t border-gray-100 shrink-0">
          <button
            onClick={() => handleCreate('Draft')}
            className="py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Save as Draft
          </button>
          <button
            onClick={() => handleCreate('Planned')}
            className="py-3 rounded-xl bg-[#2a44d4] hover:bg-[#2438b8] text-white text-sm font-semibold transition-colors"
          >
            Create Hit
          </button>
        </div>
      </div>
    </div>
  )
}

function ManualForm({ discount, setDiscount, selectedCats, toggleCat, advancedOpen, setAdvancedOpen, availableCategories = SUGGESTED_CATEGORIES }) {
  return (
    <div className="space-y-5">
      {/* Discount + Dates row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-gray-700">Discount (%)</label>
            <button className="flex items-center gap-1 text-xs text-[#2a44d4] font-medium">
              <Sparkles size={10} />
              Suggest optimal
            </button>
          </div>
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <input
              type="number"
              value={discount}
              onChange={e => setDiscount(e.target.value)}
              placeholder="—"
              className="flex-1 px-3 py-2.5 text-sm focus:outline-none"
            />
            <div className="flex flex-col border-l border-gray-200">
              <button
                onClick={() => setDiscount(v => String(Math.min(80, (parseInt(v) || 0) + 1)))}
                className="px-2.5 py-1 hover:bg-gray-50 border-b border-gray-200 transition-colors"
              >
                <ChevronUp size={12} className="text-gray-400" />
              </button>
              <button
                onClick={() => setDiscount(v => String(Math.max(0, (parseInt(v) || 0) - 1)))}
                className="px-2.5 py-1 hover:bg-gray-50 transition-colors"
              >
                <ChevronDown size={12} className="text-gray-400" />
              </button>
            </div>
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-700 block mb-2">Campaign dates</label>
          <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5">
            <input
              type="text"
              placeholder="Select date range"
              className="flex-1 text-sm focus:outline-none text-gray-500 placeholder-gray-400"
            />
            <CalendarDays size={15} className="text-gray-400 shrink-0" />
          </div>
        </div>
      </div>

      {/* Target Categories */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-xs font-semibold text-gray-700">Target Categories</p>
          <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700">
            <ChevronDown size={12} />
            Advanced product selection
          </button>
        </div>
        <p className="text-xs text-gray-400 mb-3">Suggestion: Focus on Flats &amp; Heels (underperforming)</p>
        <div className="flex flex-wrap gap-2">
          {availableCategories.map(cat => {
            const isSelected = selectedCats.has(cat.name)
            return (
              <button
                key={cat.name}
                onClick={() => toggleCat(cat.name)}
                className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                  isSelected
                    ? 'border-[#2a44d4] bg-[#eaecfb] text-[#2a44d4]'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                {cat.name}
                {cat.tag && (
                  <span className="text-[10px] text-orange-500 font-normal">{cat.tag}</span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Advanced settings */}
      <div className="border-t border-gray-100 pt-4">
        <button
          onClick={() => setAdvancedOpen(v => !v)}
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-700 transition-colors"
        >
          {advancedOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          Advanced settings
        </button>
        {advancedOpen && (
          <div className="mt-3 space-y-3 text-xs text-gray-500">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium mb-1">Margin floor (%)</label>
                <input type="number" placeholder="e.g. 20" className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#2a44d4]" />
              </div>
              <div>
                <label className="block font-medium mb-1">Max units</label>
                <input type="number" placeholder="Unlimited" className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#2a44d4]" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
