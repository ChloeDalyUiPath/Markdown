import { useState, useMemo } from 'react'
import {
  ArrowLeft, ChevronDown, ChevronUp, Info, Sparkles,
  AlertTriangle, Calendar,
} from 'lucide-react'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseNum(val) {
  if (!val || val === 'Not started' || val === '—') return null
  const s = String(val).replace(/[£%,+]/g, '').trim()
  const m = s.match(/^(-?\d+\.?\d*)([KM]?)$/)
  if (!m) return null
  let n = parseFloat(m[1])
  if (m[2] === 'K') n *= 1000
  if (m[2] === 'M') n *= 1000000
  return n
}

function computeDelta(v1, v2) {
  const b = parseNum(v1)
  const c = parseNum(v2)
  if (b === null || c === null || b === 0) return null
  const pct = ((c - b) / Math.abs(b)) * 100
  if (Math.abs(pct) < 0.05) return { display: '—', isPositive: false, isNone: true }
  return {
    display: `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`,
    isPositive: pct > 0,
    isNone: false,
  }
}

// ─── Per-campaign data builder ─────────────────────────────────────────────────

const HIT_UNITS = [
  [3200, 4500, 5550, 2800],   // campaign index 0: ascending revenue
  [5200, 4800, 3000, 1800],   // campaign index 1: descending revenue
]
const HIT_REVENUES = [
  ['£580K', '£830K', '£1.03M', '£420K'],
  ['£875K', '£805K', '£510K', '£310K'],
]
const HIT_TOP_IDX  = [2, 0]   // index of the "top" (highest revenue) hit per campaign
const HIT_TOP_PCT  = ['42%', '40%']

function buildData(campaign, posIdx) {
  const isPromo   = campaign.type === 'Promo'
  const hasReal   = campaign.status === 'Live' || campaign.status === 'Completed'
  const revenueN  = parseNum(campaign.revenue)
  const aovN      = parseNum(campaign.aov) || 150

  const unitsSold = hasReal && revenueN
    ? Math.round(revenueN / aovN).toLocaleString()
    : null

  const topIdx = Math.min(HIT_TOP_IDX[posIdx], campaign.hits.length - 1)

  const hits = campaign.hits.map((h, i) => ({
    label:   isPromo ? `Event ${i + 1}` : `Hit ${i + 1}`,
    discount: h.discount,
    units:   (HIT_UNITS[posIdx]?.[i] ?? 1500).toLocaleString(),
    revenue: HIT_REVENUES[posIdx]?.[i] ?? '£280K',
    isTop:   i === topIdx,
  }))

  return {
    // header
    name:          campaign.name,
    dates:         campaign.dates,
    type:          isPromo ? 'Promotional Campaign' : 'Markdown Campaign',
    locations:     campaign.locations,
    categories:    campaign.categories.join(', ') + (campaign.extra > 0 ? ` +${campaign.extra}` : ''),
    products:      campaign.optimizedProducts.split('/')[1]?.trim() ?? campaign.optimizedProducts,
    strategy:      isPromo
                     ? `Demand-driving strategy — ${campaign.locations}`
                     : `Clearance markdown strategy — ${campaign.locations}`,
    avgDiscount:   posIdx === 0 ? '30%' : '25%',
    discountRange: posIdx === 0
                     ? (isPromo ? '15% → 30% (max: 30%)' : '20% → 50% (max: 50%)')
                     : (isPromo ? '15% → 25% (max: 25%)' : '15% → 40% (max: 40%)'),
    hitsCount:     campaign.campaignHits,
    hits,
    topIdx,
    topPct:        HIT_TOP_PCT[posIdx],
    // metrics
    revenue:       campaign.revenue !== 'Not started' ? campaign.revenue : null,
    unitsSold,
    margin:        campaign.margin !== 'Not started' ? campaign.margin : (isPromo ? '31%' : null),
    sellThrough:   campaign.sellThrough !== 'Not started' ? campaign.sellThrough : null,
    conversionRate:campaign.conversionRate !== 'Not started' ? campaign.conversionRate : (isPromo ? '3.8%' : null),
    aov:           campaign.aov !== 'Not started' ? campaign.aov : null,
    discountPct:   posIdx === 0 ? '30%' : '25%',
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

const METRICS = [
  { key: 'revenue',        label: 'Revenue',          confidence: 'High confidence' },
  { key: 'unitsSold',      label: 'Units Sold',        confidence: 'High confidence' },
  { key: 'margin',         label: 'Margin %',          confidence: null },
  { key: 'sellThrough',    label: 'Sell-Through %',    confidence: null },
  { key: 'conversionRate', label: 'Conversion Rate',   confidence: 'High confidence' },
  { key: 'aov',            label: 'AOV',               confidence: null },
  { key: 'discountPct',    label: 'Discount %',        confidence: null },
]

export default function CampaignCompare({ campaigns, onBack }) {
  const [showDataNotes,   setShowDataNotes]   = useState(false)
  const [showHits,        setShowHits]        = useState(true)
  const [viewMode,        setViewMode]        = useState('side-by-side')

  const [c1, c2] = campaigns
  const d1 = useMemo(() => buildData(c1, 0), [c1])
  const d2 = useMemo(() => buildData(c2, 1), [c2])

  const maxHits = Math.max(d1.hits.length, d2.hits.length)

  return (
    <div className="p-6 min-w-0">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-[#2a44d4] font-medium hover:underline"
        >
          <ArrowLeft size={14} />
          Back to campaigns
        </button>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50">
            All Time <ChevronDown size={13} />
          </button>
          <button className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50">
            Custom Range <Calendar size={13} />
          </button>
          <div className="flex items-center gap-1.5 text-sm text-gray-600 ml-2">
            Confidence:
            <span className="text-green-600 font-semibold">High (85%)</span>
            <Info size={13} className="text-gray-400" />
          </div>
        </div>
      </div>

      {/* ── Campaign summary cards ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {[d1, d2].map((d, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-4 bg-white">
            <p className="font-semibold text-sm text-gray-900 mb-0.5">{d.name} — Details</p>
            <p className="text-xs text-gray-400 mb-4">{d.strategy}</p>
            <div className="space-y-2 text-xs">
              {[['Location', d.locations], ['Categories', d.categories], ['Products', d.products]].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-gray-500">{k}:</span>
                  <span className="font-semibold text-gray-900 text-right">{v}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── Comparison context bar ─────────────────────────────────────── */}
      <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-3 text-xs text-gray-600">
        <div className="flex items-center gap-0 divide-x divide-gray-300">
          <span className="pr-4">Comparing: <strong className="text-gray-900">2 campaigns</strong></span>
          <span className="px-4">
            Time range: <strong className="text-gray-900">Last 7 days</strong>{' '}
            <span className="text-gray-400">(aligned across both)</span>
          </span>
          <span className="px-4">Products: <strong className="text-gray-900">All</strong></span>
          <span className="pl-4">Attribution: <strong className="text-gray-900">Last-touch</strong></span>
        </div>
        <button className="flex items-center gap-1.5 text-amber-600 font-medium whitespace-nowrap ml-4">
          <AlertTriangle size={12} />
          2 Data considerations
        </button>
      </div>

      {/* ── Data considerations accordion ──────────────────────────────── */}
      <button
        onClick={() => setShowDataNotes(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-xl text-sm text-amber-600 font-medium mb-3 bg-white hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <AlertTriangle size={13} />
          2 Data considerations
        </div>
        {showDataNotes ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {showDataNotes && (
        <div className="border border-amber-200 bg-amber-50 rounded-xl px-4 py-3 mb-3 text-xs text-amber-800 space-y-1.5">
          <p>• Campaign durations differ — sell-through rates are not directly comparable without normalization.</p>
          <p>• Product overlap between campaigns is estimated at 78%; 22% of SKUs are campaign-exclusive.</p>
        </div>
      )}

      {/* ── Smart normalization ────────────────────────────────────────── */}
      <div className="flex items-center justify-between border border-gray-200 rounded-xl px-4 py-3 mb-3 bg-white">
        <div className="flex items-start gap-2.5">
          <Info size={15} className="text-blue-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-gray-900">Smart Normalization</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Compare revenue per SKU, units per SKU, and sell-through % for fairer metrics
            </p>
          </div>
        </div>
        <button className="text-sm border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-50 shrink-0 ml-4 whitespace-nowrap">
          Show normalized
        </button>
      </div>

      {/* ── AI Insight ─────────────────────────────────────────────────── */}
      <div className="flex items-start gap-3 border border-gray-200 rounded-xl px-4 py-3.5 mb-6 bg-white">
        <div className="w-8 h-8 rounded-full bg-[#2a44d4] flex items-center justify-center shrink-0">
          <Sparkles size={14} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900 mb-0.5">AI Insight</p>
          <p className="text-sm text-gray-600 leading-relaxed">
            {c1.name} drove higher revenue vs {c2.name}, primarily from deeper markdown phases
            {d1.type === 'Markdown Campaign' ? ` (up to ${d1.avgDiscount})` : ''}, which contributed{' '}
            {d1.hits.length > 0 ? `${d1.topPct} of total revenue` : 'significant volume'}. However,
            margin was lower compared to {c2.name}.
          </p>
        </div>
      </div>

      {/* ── View toggle ────────────────────────────────────────────────── */}
      <div className="flex justify-end mb-3">
        <div className="flex border border-gray-200 rounded-lg overflow-hidden">
          {['side-by-side', 'summary'].map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-4 py-2 text-sm font-medium transition-colors border-l first:border-l-0 border-gray-200 ${
                viewMode === mode
                  ? 'bg-[#2a44d4] text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {mode === 'side-by-side' ? 'Side by side' : 'Summary'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Metrics table ──────────────────────────────────────────────── */}
      <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">

        {/* Column headers */}
        <div className="grid border-b border-gray-200" style={{ gridTemplateColumns: '200px 1fr 1fr' }}>
          <div className="px-5 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Metric
          </div>
          {[d1, d2].map((d, i) => (
            <div key={i} className="px-5 py-4 border-l border-gray-200 bg-gray-50">
              <p className="font-bold text-sm text-gray-900">{d.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{d.dates}</p>
              <p className="text-xs text-gray-500 mt-0.5">{d.type}</p>
              <div className="mt-3 space-y-1 text-xs text-gray-700">
                <p><span className="font-semibold">Avg discount:</span> {d.avgDiscount}</p>
                <p><span className="font-semibold">Range:</span> {d.discountRange}</p>
                <p><span className="font-semibold">Hits:</span> {d.hitsCount} {d.hitsCount === 1 ? 'hit' : 'hits'}</p>
              </div>
              {d.hitsCount > 0 && (
                <button
                  onClick={() => setShowHits(v => !v)}
                  className="mt-2 flex items-center gap-1 text-xs text-[#2a44d4] font-medium hover:underline"
                >
                  {showHits ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                  {showHits ? 'Hide hits' : 'Show hits'}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Campaign hits section */}
        {showHits && maxHits > 0 && (
          <>
            {/* Hits sub-header */}
            <div className="grid border-b border-gray-200 bg-gray-50/60" style={{ gridTemplateColumns: '200px 1fr 1fr' }}>
              <div className="px-5 py-2.5 text-xs font-semibold text-gray-700">Campaign Hits</div>
              {[d1, d2].map((_, i) => (
                <div key={i} className="px-5 py-2.5 border-l border-gray-200">
                  <div className="grid text-xs text-gray-400 font-medium" style={{ gridTemplateColumns: '1fr 64px 64px 80px' }}>
                    <span>Hit</span>
                    <span>Discount</span>
                    <span>Units</span>
                    <span className="text-right">Revenue</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Hit rows */}
            {Array.from({ length: maxHits }).map((_, rowIdx) => {
              const h1 = d1.hits[rowIdx]
              const h2 = d2.hits[rowIdx]
              return (
                <div
                  key={rowIdx}
                  className="grid border-b border-gray-100"
                  style={{ gridTemplateColumns: '200px 1fr 1fr' }}
                >
                  <div />
                  {[{ hit: h1, d: d1 }, { hit: h2, d: d2 }].map(({ hit, d }, ci) => (
                    <div
                      key={ci}
                      className={`px-5 py-2.5 border-l border-gray-200 ${hit?.isTop ? 'bg-blue-50/50' : ''}`}
                    >
                      {hit ? (
                        <div className="grid text-xs items-center" style={{ gridTemplateColumns: '1fr 64px 64px 80px' }}>
                          <span className={`font-medium ${hit.isTop ? 'text-blue-600' : 'text-gray-700'}`}>
                            {hit.label}
                          </span>
                          <span className="text-gray-600">{hit.discount}</span>
                          <span className="text-gray-600">{hit.units}</span>
                          <span className="text-right font-medium text-gray-900">
                            {hit.revenue}
                            {hit.isTop && (
                              <span className="text-blue-600 ml-1">({d.topPct})</span>
                            )}
                          </span>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              )
            })}

            {/* Top-hit footnote row */}
            <div className="grid border-b border-gray-200" style={{ gridTemplateColumns: '200px 1fr 1fr' }}>
              <div />
              {[d1, d2].map((d, i) => (
                <div key={i} className="px-5 py-2 border-l border-gray-200">
                  {d.topIdx >= 0 && d.hits[d.topIdx] && (
                    <p className="text-[11px] text-gray-400 italic">
                      {d.hits[d.topIdx].label} drove {d.topPct} of total revenue
                    </p>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Metric rows */}
        {METRICS.map(({ key, label, confidence }) => {
          const v1 = d1[key]
          const v2 = d2[key]
          const delta = computeDelta(v1, v2)

          // Is margin higher (positive delta) unexpectedly good? Add "Higher" badge
          const showHigherBadge = key === 'margin' && delta?.isPositive && !delta.isNone

          return (
            <div
              key={key}
              className="grid border-b border-gray-100 last:border-0"
              style={{ gridTemplateColumns: '200px 1fr 1fr' }}
            >
              {/* Metric label */}
              <div className="px-5 py-5">
                <p className="text-sm font-semibold text-gray-900">{label}</p>
                {confidence && (
                  <div className="flex items-center gap-1 mt-1.5">
                    <AlertTriangle size={10} className="text-green-600" />
                    <span className="text-[10px] text-green-600 font-medium">{confidence}</span>
                  </div>
                )}
              </div>

              {/* Campaign 1 (reference — bold black) */}
              <div className="px-5 py-5 border-l border-gray-200">
                <p className="text-2xl font-bold text-gray-900">{v1 ?? '—'}</p>
              </div>

              {/* Campaign 2 (comparison — gray + delta) */}
              <div className="px-5 py-5 border-l border-gray-200">
                <p className="text-2xl font-bold text-gray-500">{v2 ?? '—'}</p>
                {delta && (
                  <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                    {delta.isNone ? (
                      <span className="text-xs text-gray-400">— No change</span>
                    ) : (
                      <span className={`text-xs font-semibold ${delta.isPositive ? 'text-green-600' : 'text-red-500'}`}>
                        {delta.display}
                      </span>
                    )}
                    <span className="text-xs text-gray-400">vs previous</span>
                    {showHigherBadge && (
                      <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">
                        Higher
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
