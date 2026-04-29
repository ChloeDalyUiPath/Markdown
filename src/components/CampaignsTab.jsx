import { useState } from 'react'
import {
  Search, SlidersHorizontal, ChevronDown, Check,
  Megaphone, Target, CheckCircle2, FileText, CalendarDays, Sparkles, Zap,
  MoreVertical, AlertTriangle, BarChart2, Calendar,
  TrendingUp, TrendingDown, Minus, ArrowRight, PlusCircle, Layers,
} from 'lucide-react'

// ─── Data ─────────────────────────────────────────────────────────────────────
// Plan fields: revenuePlan, sellThroughPlan, marginPlan
// Elapsed fields (Live only): elapsed = { pct, days, total }
// All campaigns carry sellThrough + margin (Promo campaigns get estimates)

const campaigns = [
  // ── LIVE · MARKDOWN · UNDERPERFORMING ───────────────────────────────
  {
    id: 6, name: 'Summer Clearance Sale SS 26', type: 'Markdown', status: 'Live',
    performance: 'underperforming', locations: 'Spain, Italy +3',
    dates: '01/04/2026 – 30/04/2026', categories: ['Swimwear', 'Dresses'], extra: 6,
    optimizedProducts: '61,200 / 78,400',
    sellThrough: '41%', revenue: '£62,140', margin: '28%',
    revenuePlan: '£112,000', sellThroughPlan: '72%', marginPlan: '34%',
    elapsed: { pct: 73, days: 22, total: 30 },
    campaignHits: 2,
    hits: [
      { name: 'Hit 1: Initial 10% markdown', discount: '10% off', status: 'Completed' },
      { name: 'Hit 2: Extra 20% on swimwear', discount: '20% off', status: 'Live' },
    ],
  },
  // ── LIVE · PROMO · UNDERPERFORMING ──────────────────────────────────
  {
    id: 9, name: 'Footwear Flash Sale', type: 'Promo', status: 'Live',
    performance: 'underperforming', locations: 'UK',
    dates: '24/04/2026 – 30/04/2026', categories: ['Footwear', 'Trainers'], extra: 1,
    optimizedProducts: '0 / 12,400',
    sellThrough: '22%', revenue: '£8,240', margin: '18%',
    revenuePlan: '£18,000', sellThroughPlan: '40%', marginPlan: '28%',
    elapsed: { pct: 71, days: 5, total: 7 },
    campaignHits: 1,
    hits: [
      { name: 'Event 1: Flash 20% off trainers', discount: '20% off', status: 'Completed' },
    ],
  },
  // ── LIVE · MARKDOWN · AT RISK ────────────────────────────────────────
  {
    id: 7, name: 'Menswear Summer Edit SS 26', type: 'Markdown', status: 'Live',
    performance: 'at-risk', locations: 'Germany, Austria +1',
    dates: '15/03/2026 – 18/04/2026', categories: ['Chinos', 'Shirts'], extra: 3,
    optimizedProducts: '28,900 / 36,200',
    sellThrough: '58%', revenue: '£44,820', margin: '35%',
    revenuePlan: '£54,000', sellThroughPlan: '72%', marginPlan: '40%',
    elapsed: { pct: 51, days: 18, total: 35 },
    campaignHits: 1,
    hits: [{ name: 'Hit 1: Initial markdown', discount: '15% off', status: 'Completed' }],
  },
  // ── LIVE · PROMO · AT RISK ───────────────────────────────────────────
  {
    id: 2, name: 'Spring Collection Launch SS 26', type: 'Promo', status: 'Live',
    performance: 'at-risk', locations: 'France',
    dates: '12/04/2026 – 02/05/2026', categories: ['Accessories', 'Dresses'], extra: 5,
    optimizedProducts: '0 / 85,000',
    sellThrough: '38%', revenue: '£18,410', margin: '24%',
    revenuePlan: '£28,000', sellThroughPlan: '58%', marginPlan: '30%',
    elapsed: { pct: 60, days: 12, total: 20 },
    campaignHits: 0, hits: [],
  },
  // ── LIVE · MARKDOWN · ON TRACK ───────────────────────────────────────
  {
    id: 1, name: 'End of Autumn Coats AW 26', type: 'Markdown', status: 'Live',
    performance: 'on-track', locations: 'Spain, UK +5',
    dates: '08/04/2026 – 28/04/2026', categories: ['Accessories', 'Dresses'], extra: 5,
    optimizedProducts: '74,800 / 85,000',
    sellThrough: '72%', revenue: '£38,593', margin: '42%',
    revenuePlan: '£34,000', sellThroughPlan: '76%', marginPlan: '39%',
    elapsed: { pct: 60, days: 12, total: 20 },
    campaignHits: 3,
    hits: [
      { name: 'Hit 1: Initial 5% discount', discount: '5% off', status: 'Completed' },
      { name: 'Hit 2: Extra 20% off slow movers', discount: '20% off', status: 'Live' },
      { name: 'Hit 3: Final clearance', discount: '45% off', status: 'Draft' },
    ],
  },
  // ── LIVE · PROMO · ON TRACK ──────────────────────────────────────────
  {
    id: 19, name: 'Loyalty Members Weekend', type: 'Promo', status: 'Live',
    performance: 'on-track', locations: 'UK',
    dates: '25/04/2026 – 27/04/2026', categories: ['Knitwear', 'Accessories'], extra: 4,
    optimizedProducts: '0 / 24,800',
    sellThrough: '64%', revenue: '£32,140', margin: '38%',
    revenuePlan: '£28,000', sellThroughPlan: '52%', marginPlan: '35%',
    elapsed: { pct: 60, days: 3, total: 5 },
    campaignHits: 1,
    hits: [{ name: 'Event 1: Members-only 15% off', discount: '15% off', status: 'Live' }],
  },
  // ── LIVE · MARKDOWN · OUTPERFORMING ─────────────────────────────────
  {
    id: 8, name: 'Luxury Accessories Blowout', type: 'Markdown', status: 'Live',
    performance: 'outperforming', locations: 'Italy',
    dates: '20/04/2026 – 03/05/2026', categories: ['Accessories', 'Leather Goods'], extra: 2,
    optimizedProducts: '4,800 / 4,800',
    sellThrough: '94%', revenue: '£198,240', margin: '54%',
    revenuePlan: '£120,000', sellThroughPlan: '70%', marginPlan: '45%',
    elapsed: { pct: 57, days: 8, total: 14 },
    campaignHits: 2,
    hits: [
      { name: 'Hit 1: Opening discount', discount: '20% off', status: 'Completed' },
      { name: 'Hit 2: Final push', discount: '35% off', status: 'Completed' },
    ],
  },
  // ── LIVE · PROMO · OUTPERFORMING ─────────────────────────────────────
  {
    id: 3, name: 'Spring Collection Launch SS 26', type: 'Promo', status: 'Live',
    performance: 'outperforming', locations: 'Germany',
    dates: '12/04/2026 – 02/05/2026', categories: ['Accessories', 'Dresses'], extra: 5,
    optimizedProducts: '0 / 85,000',
    sellThrough: '71%', revenue: '£38,593', margin: '32%',
    revenuePlan: '£22,000', sellThroughPlan: '48%', marginPlan: '28%',
    elapsed: { pct: 60, days: 12, total: 20 },
    campaignHits: 3,
    hits: [
      { name: 'Event 1: Launch flash sale', discount: '10% off', status: 'Completed' },
      { name: 'Event 2: Boost slow movers', discount: '20% off', status: 'Completed' },
      { name: 'Event 3: Final push', discount: '30% off', status: 'Live' },
    ],
  },
  {
    id: 10, name: "Mother's Day Gifting 2026", type: 'Promo', status: 'Live',
    performance: 'outperforming', locations: 'UK, Ireland',
    dates: '10/03/2026 – 22/03/2026', categories: ['Fragrance', 'Accessories'], extra: 3,
    optimizedProducts: '0 / 18,600',
    sellThrough: '84%', revenue: '£86,420', margin: '44%',
    revenuePlan: '£50,000', sellThroughPlan: '68%', marginPlan: '38%',
    elapsed: { pct: 71, days: 10, total: 14 },
    campaignHits: 2,
    hits: [
      { name: "Event 1: Mother's Day hero offer", discount: '15% off', status: 'Completed' },
      { name: 'Event 2: Gifting bundle deal', discount: '3 for 2', status: 'Live' },
    ],
  },

  // ── OPTIMISED ────────────────────────────────────────────────────────
  {
    id: 0, name: 'Ralph Lauren Heritage Edit SS 26', type: 'Markdown', status: 'Optimised',
    performance: null, locations: 'UK', dates: '01/05/2026 – 30/06/2026',
    categories: ["Women's Polo", 'Knitwear'], extra: 4,
    optimizedProducts: '38,200 / 42,800',
    sellThrough: null, revenue: null, margin: null,
    revenuePlan: null, sellThroughPlan: null, marginPlan: null, elapsed: null,
    campaignHits: 0, hits: [],
  },
  {
    id: 11, name: 'Black Friday Weekend 2026', type: 'Promo', status: 'Optimised',
    performance: null, locations: 'UK, France, Germany +2', dates: '27/11/2026 – 30/11/2026',
    categories: ['All Categories'], extra: 0,
    optimizedProducts: '0 / 324,000',
    sellThrough: null, revenue: null, margin: null,
    revenuePlan: null, sellThroughPlan: null, marginPlan: null, elapsed: null,
    campaignHits: 0, hits: [],
  },

  // ── PRE-OPTIMISATION ─────────────────────────────────────────────────
  {
    id: 4, name: 'Winter Knitwear Clearance', type: 'Markdown', status: 'Pre-optimisation',
    performance: null, locations: 'Germany', dates: '01/06/2026 – 28/06/2026',
    categories: ['Knitwear', 'Scarves'], extra: 1,
    optimizedProducts: '0 / 34,800',
    sellThrough: null, revenue: null, margin: null,
    revenuePlan: null, sellThroughPlan: null, marginPlan: null, elapsed: null,
    campaignHits: 0, hits: [],
  },
  {
    id: 13, name: 'Kids Outerwear Clearance', type: 'Markdown', status: 'Pre-optimisation',
    performance: null, locations: 'France, Belgium +1', dates: '01/05/2026 – 31/05/2026',
    categories: ["Kids' Coats", "Kids' Jackets"], extra: 2,
    optimizedProducts: '0 / 19,600',
    sellThrough: null, revenue: null, margin: null,
    revenuePlan: null, sellThroughPlan: null, marginPlan: null, elapsed: null,
    campaignHits: 0, hits: [],
  },
  {
    id: 12, name: 'Easter 2027 Collection', type: 'Promo', status: 'Pre-optimisation',
    performance: null, locations: 'UK, France', dates: '28/03/2027 – 06/04/2027',
    categories: ['Dresses', 'Knitwear'], extra: 4,
    optimizedProducts: '0 / 28,400',
    sellThrough: null, revenue: null, margin: null,
    revenuePlan: null, sellThroughPlan: null, marginPlan: null, elapsed: null,
    campaignHits: 0, hits: [],
  },

  // ── DRAFT ────────────────────────────────────────────────────────────
  {
    id: 14, name: 'AW 26 Denim & Tailoring Exit', type: 'Markdown', status: 'Draft',
    performance: null, locations: 'Spain, Italy', dates: '01/10/2026 – 30/11/2026',
    categories: ['Denim', 'Tailoring'], extra: 2,
    optimizedProducts: '0 / 42,100',
    sellThrough: null, revenue: null, margin: null,
    revenuePlan: null, sellThroughPlan: null, marginPlan: null, elapsed: null,
    campaignHits: 0, hits: [],
  },
  {
    id: 5, name: 'Spring Edit SS 24', type: 'Markdown', status: 'Draft',
    performance: null, locations: 'Spain', dates: '01/03/2024 – 30/04/2024',
    categories: ['Dresses', 'Tops'], extra: 3,
    optimizedProducts: '0 / 98,500',
    sellThrough: null, revenue: null, margin: null,
    revenuePlan: null, sellThroughPlan: null, marginPlan: null, elapsed: null,
    campaignHits: 0, hits: [],
  },
  {
    id: 15, name: "Father's Day Gifting 2026", type: 'Promo', status: 'Draft',
    performance: null, locations: 'UK', dates: '08/06/2026 – 21/06/2026',
    categories: ['Fragrance', 'Accessories'], extra: 2,
    optimizedProducts: '0 / 16,800',
    sellThrough: null, revenue: null, margin: null,
    revenuePlan: null, sellThroughPlan: null, marginPlan: null, elapsed: null,
    campaignHits: 0, hits: [],
  },

  // ── COMPLETED ────────────────────────────────────────────────────────
  {
    id: 16, name: 'Denim & Tailoring Year-End', type: 'Markdown', status: 'Completed',
    performance: null, locations: 'UK', dates: '26/12/2025 – 15/01/2026',
    categories: ['Denim', 'Tailoring'], extra: 2,
    optimizedProducts: '34,100 / 34,100',
    sellThrough: '89%', revenue: '£198,440', margin: '44%',
    revenuePlan: '£160,000', sellThroughPlan: '82%', marginPlan: '40%', elapsed: null,
    campaignHits: 3,
    hits: [
      { name: 'Hit 1: Boxing Day Sale', discount: '25% off', status: 'Completed' },
      { name: 'Hit 2: New Year push', discount: '35% off', status: 'Completed' },
      { name: 'Hit 3: Final clearance', discount: '50% off', status: 'Completed' },
    ],
  },
  {
    id: 18, name: 'Lingerie & Swimwear SS 25', type: 'Markdown', status: 'Completed',
    performance: null, locations: 'Italy, Spain +1', dates: '15/08/2025 – 15/09/2025',
    categories: ['Swimwear', 'Lingerie'], extra: 1,
    optimizedProducts: '22,800 / 24,600',
    sellThrough: '76%', revenue: '£84,180', margin: '38%',
    revenuePlan: '£90,000', sellThroughPlan: '80%', marginPlan: '36%', elapsed: null,
    campaignHits: 2,
    hits: [
      { name: 'Hit 1: Season-end markdown', discount: '20% off', status: 'Completed' },
      { name: 'Hit 2: Final stock push', discount: '40% off', status: 'Completed' },
    ],
  },
  {
    id: 17, name: 'Christmas Gifting 2025', type: 'Promo', status: 'Completed',
    performance: null, locations: 'UK, France, Germany +3', dates: '01/12/2025 – 24/12/2025',
    categories: ['Fragrance', 'Accessories'], extra: 5,
    optimizedProducts: '0 / 86,200',
    sellThrough: '88%', revenue: '£284,640', margin: '48%',
    revenuePlan: '£240,000', sellThroughPlan: '72%', marginPlan: '42%', elapsed: null,
    campaignHits: 3,
    hits: [
      { name: 'Event 1: Black Friday tie-in', discount: '20% off', status: 'Completed' },
      { name: 'Event 2: Christmas hero offer', discount: '25% off', status: 'Completed' },
      { name: 'Event 3: Last-minute gifts', discount: '30% off', status: 'Completed' },
    ],
  },
]

// ─── Config ───────────────────────────────────────────────────────────────────

const statusConfig = {
  Live:               { icon: Zap,          className: 'bg-green-50 text-green-700 border border-green-200',    dot: true  },
  Optimised:          { icon: Sparkles,     className: 'bg-violet-50 text-violet-700 border border-violet-200'            },
  'Pre-optimisation': { icon: CalendarDays, className: 'bg-blue-50 text-blue-600 border border-blue-200'                  },
  Draft:              { icon: FileText,     className: 'bg-gray-100 text-gray-500 border border-gray-200'                 },
  Completed:          { icon: CheckCircle2, className: 'bg-green-50 text-green-700 border border-green-200'               },
}

const typeConfig = {
  Promo:    { icon: Megaphone, className: 'bg-blue-50 text-blue-600 border border-blue-100'       },
  Markdown: { icon: Target,    className: 'bg-violet-50 text-violet-600 border border-violet-100' },
}

const perfConfig = {
  'underperforming': { label: 'Underperforming', icon: AlertTriangle, cls: 'text-red-600 border-red-200',    activeBg: 'bg-red-50',    cardBadge: 'text-red-600 bg-red-50 border-red-200',     actionLabel: '↓ Behind plan',   actionCls: 'text-red-600 border-red-200 bg-red-50'    },
  'at-risk':         { label: 'At Risk',          icon: AlertTriangle, cls: 'text-amber-600 border-amber-200',activeBg: 'bg-amber-50',  cardBadge: 'text-amber-600 bg-amber-50 border-amber-200',actionLabel: '⚠ At risk',       actionCls: 'text-amber-600 border-amber-200 bg-amber-50'},
  'on-track':        { label: 'On Track',          icon: ArrowRight,   cls: 'text-blue-600 border-blue-200',  activeBg: 'bg-blue-50',   cardBadge: 'text-blue-600 bg-blue-50 border-blue-200',   actionLabel: '→ On track',      actionCls: 'text-blue-600 border-blue-200 bg-blue-50'  },
  'outperforming':   { label: 'Outperforming',     icon: PlusCircle,   cls: 'text-green-700 border-green-200',activeBg: 'bg-green-50',  cardBadge: 'text-green-700 bg-green-50 border-green-200',actionLabel: '⊕ Ahead of plan', actionCls: 'text-green-700 border-green-200 bg-green-50'},
}

const matchConfig = {
  great: { label: 'Great match', cls: 'text-green-700 bg-green-50 border-green-200' },
  good:  { label: 'Good match',  cls: 'text-blue-600 bg-blue-50 border-blue-200'    },
  fair:  { label: 'Fair match',  cls: 'text-amber-600 bg-amber-50 border-amber-200' },
  weak:  { label: 'Weak match',  cls: 'text-red-600 bg-red-50 border-red-200'       },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseNum(val) {
  if (!val || val === 'Not started') return null
  const s = String(val).replace(/[£%,+]/g, '').trim()
  const m = s.match(/^(-?\d+\.?\d*)([KM]?)$/)
  if (!m) return null
  let n = parseFloat(m[1])
  if (m[2] === 'K') n *= 1000
  if (m[2] === 'M') n *= 1000000
  return n
}

function computeVsPlan(actual, plan) {
  const a = parseNum(actual)
  const p = parseNum(plan)
  if (a === null || p === null || p === 0) return null
  const pct = Math.round(((a - p) / Math.abs(p)) * 100)
  return { pct, display: `${pct >= 0 ? '+' : ''}${pct}%`, isPositive: pct >= 0 }
}

function getCompatibility(a, b) {
  const warnings = []
  let score = 10

  // Type match — most important for metric comparability
  if (a.type !== b.type) {
    score -= 4
    warnings.push(`Different campaign types (${a.type} vs ${b.type}) — metrics may not be directly comparable`)
  }

  // Category overlap — key for a merchandiser
  const aCats = new Set(a.categories.map(c => c.toLowerCase().trim()))
  const bCats = new Set(b.categories.map(c => c.toLowerCase().trim()))
  const sharedCats = [...aCats].filter(c => bCats.has(c))
  if (sharedCats.length === 0) {
    score -= 3
    warnings.push('No shared categories — comparison may be less meaningful')
  } else if (sharedCats.length < Math.min(aCats.size, bCats.size)) {
    score -= 1
  }

  // Location/market overlap
  const parseLocs = loc =>
    loc.split(',').map(l => l.trim().replace(/\s*\+\d+/, '').toLowerCase())
  const aLocs = new Set(parseLocs(a.locations))
  const bLocs = new Set(parseLocs(b.locations))
  const locOverlap = [...aLocs].some(l => bLocs.has(l))
  if (!locOverlap) {
    score -= 2
    warnings.push('Different markets — regional conditions may affect comparison')
  }

  // Season similarity — compare same-month ranges (within ±2 months)
  const parseMonth = dates => {
    const m = dates.match(/(\d{2})\/(\d{2})\//)
    return m ? parseInt(m[2], 10) : null
  }
  const aMonth = parseMonth(a.dates)
  const bMonth = parseMonth(b.dates)
  if (aMonth && bMonth) {
    const diff = Math.min(Math.abs(aMonth - bMonth), 12 - Math.abs(aMonth - bMonth))
    if (diff > 2) {
      score -= 1
      warnings.push('Different seasons — seasonal demand differences may skew results')
    }
  }

  // Prefer fully-resolved data
  if (a.status === 'Completed' && b.status === 'Completed') score = Math.min(10, score + 1)

  score = Math.max(0, Math.min(10, score))
  const tier = score >= 8 ? 'great' : score >= 6 ? 'good' : score >= 4 ? 'fair' : 'weak'

  return { score, tier, warnings, shared: { cats: sharedCats, locs: [...aLocs].filter(l => bLocs.has(l)) } }
}

function getSuggestions(selected, all) {
  const hasData = c => c.status === 'Live' || c.status === 'Completed' || c.status === 'Optimised'
  return all
    .filter(c => c.id !== selected.id && hasData(c))
    .map(c => ({ campaign: c, compat: getCompatibility(selected, c) }))
    .filter(({ compat }) => compat.score >= 3)
    .sort((a, b) => b.compat.score - a.compat.score)
    .slice(0, 4)
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const cfg = statusConfig[status] || statusConfig['Draft']
  const Icon = cfg.icon
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${cfg.className}`}>
      <Icon size={10} />
      {status}
      {cfg.dot && <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />}
    </span>
  )
}

function TypeBadge({ type }) {
  const cfg = typeConfig[type] || typeConfig['Markdown']
  const Icon = cfg.icon
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${cfg.className}`}>
      <Icon size={10} />
      {type}
    </span>
  )
}

function MatchBadge({ tier }) {
  const cfg = matchConfig[tier]
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${cfg.cls}`}>
      {cfg.label}
    </span>
  )
}

function MetricCell({ label, value, plan, isFirst = false }) {
  const hasData = value && value !== 'Not started'
  const trend = hasData ? computeVsPlan(value, plan) : null

  return (
    <div className={`px-4 py-3 ${isFirst ? '' : 'border-l border-gray-100'}`}>
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-xs text-gray-400">{label}</span>
        {trend && (
          <span className={`inline-flex items-center gap-0.5 text-[11px] font-semibold ${trend.isPositive ? 'text-green-600' : 'text-red-500'}`}>
            {trend.isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {trend.display}
          </span>
        )}
      </div>
      <p className={`text-sm font-bold ${hasData ? 'text-gray-900' : 'text-gray-400 font-normal'}`}>
        {hasData ? value : '—'}
      </p>
      {hasData && plan && (
        <p className="text-[11px] text-gray-400 mt-0.5">vs plan: {plan}</p>
      )}
    </div>
  )
}

function StatusCell({ campaign }) {
  const perf = campaign.performance ? perfConfig[campaign.performance] : null
  const el   = campaign.elapsed

  return (
    <div className="px-4 py-3 border-l border-gray-100">
      <p className="text-xs text-gray-400 mb-1">Status</p>
      {perf ? (
        <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border ${perf.actionCls}`}>
          {perf.actionLabel}
        </span>
      ) : campaign.status === 'Completed' ? (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
          <CheckCircle2 size={10} /> Completed
        </span>
      ) : (
        <span className="text-xs text-gray-400">—</span>
      )}
      {el && (
        <p className="text-[11px] text-gray-400 mt-1.5">
          {el.pct}% elapsed ({el.days}/{el.total} days)
        </p>
      )}
    </div>
  )
}

function SuggestionPanel({ selected, onAdd }) {
  const suggestions = getSuggestions(selected, campaigns)
  if (!suggestions.length) return null

  return (
    <div className="mb-5 bg-[#f5f6ff] border border-[#d4d8f7] rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Layers size={13} className="text-[#2a44d4]" />
        <p className="text-sm font-semibold text-gray-900">
          Suggested campaigns to compare with <span className="text-[#2a44d4]">{selected.name}</span>
        </p>
      </div>
      <div className="flex gap-2 flex-wrap">
        {suggestions.map(({ campaign: c, compat }) => {
          const sharedCatCount = compat.shared.cats.length
          const hint = sharedCatCount > 0
            ? `${sharedCatCount} shared ${sharedCatCount === 1 ? 'category' : 'categories'}`
            : compat.shared.locs.length > 0
            ? `Same market: ${compat.shared.locs[0]}`
            : 'Similar campaign type'

          return (
            <button
              key={c.id}
              onClick={() => onAdd(c.id)}
              className="flex items-start gap-3 bg-white border border-gray-200 hover:border-[#2a44d4] rounded-xl px-3.5 py-2.5 text-left transition-colors group max-w-[240px]"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                  <MatchBadge tier={compat.tier} />
                </div>
                <p className="text-xs font-semibold text-gray-900 truncate mt-1">{c.name}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{c.type} · {c.status}</p>
                <p className="text-[10px] text-[#2a44d4] mt-0.5">{hint}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function CampaignsTab({ onSelectCampaign, onCompare }) {
  const [search, setSearch]           = useState('')
  const [perfFilter, setPerfFilter]   = useState(null)
  const [selectedIds, setSelectedIds] = useState(new Set())

  const filtered = campaigns.filter(c => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false
    if (perfFilter && c.performance !== perfFilter) return false
    return true
  })

  const allSelected = filtered.length > 0 && filtered.every(c => selectedIds.has(c.id))

  // The single selected campaign (for suggestions + compat display)
  const singleSelected = selectedIds.size === 1
    ? campaigns.find(c => selectedIds.has(c.id))
    : null

  function toggleSelect(id) {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        if (next.size >= 2) return prev
        next.add(id)
      }
      return next
    })
  }

  function toggleSelectAll() {
    if (allSelected) setSelectedIds(new Set())
    else setSelectedIds(new Set(filtered.slice(0, 2).map(c => c.id)))
  }

  return (
    <div>
      {/* Section header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Campaign Management</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Select two campaigns to compare performance
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {Object.entries(perfConfig).map(([key, { label, icon: Icon, cls, activeBg }]) => {
            const active = perfFilter === key
            return (
              <button
                key={key}
                onClick={() => setPerfFilter(p => p === key ? null : key)}
                className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${cls} ${active ? activeBg : 'bg-white hover:opacity-80'}`}
              >
                <Icon size={10} />
                {label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Find a campaign"
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:border-[#2a44d4] bg-white"
          />
        </div>
        <button className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">
          <SlidersHorizontal size={14} /> Filter
        </button>
        <button onClick={toggleSelectAll} className="flex items-center gap-2 text-sm text-gray-600">
          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${allSelected ? 'bg-[#2a44d4] border-[#2a44d4]' : 'border-gray-300 hover:border-gray-400'}`}>
            {allSelected && <Check size={9} className="text-white" />}
          </div>
          Select All
        </button>
        <div className="flex-1" />
        <button className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">
          Last 30 Days <ChevronDown size={13} />
        </button>
        <button className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">
          Custom Range <Calendar size={13} />
        </button>
      </div>

      {/* Showing count */}
      <p className="text-xs text-gray-400 mb-4">
        Showing {filtered.length} of {campaigns.length} campaigns
      </p>

      {/* Suggestion panel — appears when exactly 1 campaign is selected */}
      {singleSelected && (
        <SuggestionPanel
          selected={singleSelected}
          onAdd={id => toggleSelect(id)}
        />
      )}

      {/* Campaign cards */}
      <div className="space-y-3">
        {filtered.map(c => {
          const isSelected = selectedIds.has(c.id)
          const perf       = c.performance ? perfConfig[c.performance] : null
          const hasData    = c.status === 'Live' || c.status === 'Completed'

          // Compatibility — only compute when exactly 1 other campaign is selected
          const compat = singleSelected && !isSelected
            ? getCompatibility(singleSelected, c)
            : null

          return (
            <div
              key={c.id}
              className={`bg-white rounded-xl border transition-colors ${
                isSelected
                  ? 'border-[#2a44d4] shadow-sm shadow-indigo-100'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Compatibility warning banner */}
              {compat && compat.warnings.length > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 border-b border-amber-100 bg-amber-50 rounded-t-xl">
                  <AlertTriangle size={12} className="text-amber-500 shrink-0" />
                  <p className="text-xs text-amber-700">{compat.warnings[0]}</p>
                  {compat.warnings.length > 1 && (
                    <span className="text-xs text-amber-500 ml-auto shrink-0">
                      +{compat.warnings.length - 1} more
                    </span>
                  )}
                </div>
              )}

              {/* Row 1: name + badges */}
              <div className="flex items-center gap-2.5 px-4 pt-3.5 pb-2.5">
                <button onClick={e => { e.stopPropagation(); toggleSelect(c.id) }} className="shrink-0">
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-[#2a44d4] border-[#2a44d4]' : 'border-gray-300 hover:border-gray-400'
                  }`}>
                    {isSelected && <Check size={9} className="text-white" />}
                  </div>
                </button>

                <button
                  onClick={() => onSelectCampaign?.(c)}
                  className="font-semibold text-sm text-gray-900 hover:text-[#2a44d4] transition-colors"
                >
                  {c.name}
                </button>

                <StatusBadge status={c.status} />
                <TypeBadge type={c.type} />

                <div className="flex-1" />

                {/* Match badge — only when comparing */}
                {compat && (
                  <MatchBadge tier={compat.tier} />
                )}

                {c.elapsed && !compat && (
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {c.elapsed.days}/{c.elapsed.total} days
                  </span>
                )}

                <button onClick={e => e.stopPropagation()} className="text-gray-400 hover:text-gray-600 p-0.5 shrink-0">
                  <MoreVertical size={15} />
                </button>
              </div>

              {/* Row 2: metadata */}
              <div className="flex items-center gap-5 px-4 pb-3 text-xs text-gray-500 flex-wrap">
                <span>
                  Dates: <strong className="text-gray-800">{c.dates}</strong>
                </span>
                <span>
                  Location: <strong className="text-gray-800">{c.locations}</strong>
                </span>
                <span>
                  Categories:{' '}
                  <strong className="text-gray-800">
                    {c.categories.join(', ')}
                    {c.extra > 0 && `, +${c.extra}`}
                  </strong>
                </span>
                <span>
                  Optimized Products: <strong className="text-gray-800">{c.optimizedProducts}</strong>
                </span>
              </div>

              {/* Row 3: metrics — 4-col */}
              <div className="border-t border-gray-100">
                {hasData ? (
                  <div className="grid grid-cols-4">
                    <MetricCell
                      label="Revenue"
                      value={c.revenue}
                      plan={c.revenuePlan}
                      isFirst
                    />
                    <MetricCell
                      label="Sell-Through"
                      value={c.sellThrough}
                      plan={c.sellThroughPlan}
                    />
                    <MetricCell
                      label="Margin"
                      value={c.margin}
                      plan={c.marginPlan}
                    />
                    <StatusCell campaign={c} />
                  </div>
                ) : (
                  <div className="px-4 py-3 text-xs text-gray-400">
                    No performance data yet — campaign has not started
                  </div>
                )}
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="py-16 text-center text-sm text-gray-400">
            No campaigns match your filter.
          </div>
        )}
      </div>

      {/* Compare bar — appears when exactly 2 are selected */}
      {selectedIds.size === 2 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className="flex items-center gap-4 bg-gray-900 text-white rounded-2xl px-5 py-3.5 shadow-2xl">
            <div className="flex items-center gap-2.5">
              <div className="flex -space-x-1">
                {[...selectedIds].map(id => {
                  const c = campaigns.find(x => x.id === id)
                  return (
                    <div key={id} className="w-6 h-6 rounded-full bg-[#2a44d4] border-2 border-gray-900 flex items-center justify-center text-[9px] font-bold text-white">
                      {c?.name?.[0]}
                    </div>
                  )
                })}
              </div>
              <span className="text-sm font-medium">2 campaigns selected</span>
            </div>
            <div className="w-px h-5 bg-gray-700" />
            <button
              onClick={() => {
                const selected = [...selectedIds].map(id => campaigns.find(c => c.id === id))
                onCompare?.(selected)
              }}
              className="flex items-center gap-2 bg-white text-gray-900 text-sm font-semibold px-4 py-1.5 rounded-xl hover:bg-gray-100 transition-colors"
            >
              Compare campaigns
            </button>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="text-gray-400 hover:text-white transition-colors text-xs"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
