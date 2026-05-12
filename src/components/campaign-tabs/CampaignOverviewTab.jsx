import { useState, useRef, useEffect, useMemo } from 'react'
import {
  Info,
  ChevronRight,
  CheckCircle2,
  CalendarDays,
  Clock,
  ChevronDown,
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
  Tag,
  ShieldAlert,
  Settings,
  Check,
  Megaphone,
  Target,
  Plus,
  X,
} from 'lucide-react'
import StatCard from '../StatCard'
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  ReferenceLine,
} from 'recharts'

// ---------------------------------------------------------------------------
// KPI card data
// ---------------------------------------------------------------------------

const kpiCards = [
  { label: 'Avg Margin',       value: '30.3%',  change: '-2% vs target',  negative: true,  color: 'amber' },
  { label: 'Avg Sell-Through', value: '65%',    change: '-10% vs target', negative: true,  color: 'green' },
  { label: 'Avg Cover',        value: '4 weeks',change: '-2% vs target',  negative: true,  color: 'amber' },
  { label: 'Total Revenue',    value: '€4.4M',  change: '-3% vs target',  negative: true,  color: 'blue'  },
]

const promoKpiCards = [
  { label: 'Revenue Lift',      value: '+£28.4K', change: '+8.2% vs target',    negative: false, color: 'green' },
  { label: 'Incremental Units', value: '+12,420', change: '+3.4% vs target',    negative: false, color: 'blue'  },
  { label: 'Conversion Rate',   value: '3.2%',    change: '+0.4% vs last promo', negative: false, color: 'amber' },
  { label: 'Avg Order Value',   value: '£142',    change: '+12% vs base',        negative: false, color: 'green' },
]

const markdownZeroKpis = [
  { label: 'Avg Margin',       value: '—', change: null, color: 'slate' },
  { label: 'Avg Sell-Through', value: '—', change: null, color: 'slate' },
  { label: 'Avg Cover',        value: '—', change: null, color: 'slate' },
  { label: 'Total Revenue',    value: '—', change: null, color: 'slate' },
]

const promoZeroKpis = [
  { label: 'Revenue Lift',      value: '—', change: null, color: 'slate' },
  { label: 'Incremental Units', value: '—', change: null, color: 'slate' },
  { label: 'Conversion Rate',   value: '—', change: null, color: 'slate' },
  { label: 'Avg Order Value',   value: '—', change: null, color: 'slate' },
]

const endKpiCards = [
  { label: 'Avg Margin',    value: '32%',   change: '-6pp vs target',     negative: true, color: 'amber' },
  { label: 'Sell-Through',  value: '54%',   change: '-18pp vs target',    negative: true, color: 'amber' },
  { label: 'Total Revenue', value: '£186K', change: '-34% vs plan',       negative: true, color: 'blue'  },
  { label: 'Stock at Cost', value: '£840K', change: '£620K still exposed', negative: true, color: 'red', warning: 'High exposure' },
]

// ---------------------------------------------------------------------------
// Pre-launch checklist items
// ---------------------------------------------------------------------------

const DRAFT_MARKDOWN_ITEMS = [
  {
    id: 'products',
    Icon: Tag,
    label: 'Add products to campaign',
    description: 'Add the categories and products you want to include. You can filter by category, sell-through, or stock cover.',
    tab: 'Products & Categories',
    tabLabel: 'Products & Categories',
  },
  {
    id: 'targets',
    Icon: Target,
    label: 'Set sell-through targets',
    description: 'Define your target sell-through rate and revenue goals for this campaign period.',
    tab: 'Settings',
    tabLabel: 'Settings',
  },
  {
    id: 'guardrails',
    Icon: ShieldAlert,
    label: 'Configure guardrails',
    description: 'Set minimum margin floors and maximum discount caps before optimisation runs.',
    tab: 'Settings',
    tabLabel: 'Settings',
  },
]

const DRAFT_PROMO_ITEMS = [
  {
    id: 'products',
    Icon: Tag,
    label: 'Add products to promotion',
    description: 'Select which categories and products are eligible for this promotional event.',
    tab: 'Products & Categories',
    tabLabel: 'Products & Categories',
  },
  {
    id: 'targets',
    Icon: Target,
    label: 'Set revenue lift target',
    description: 'Define the incremental revenue lift and conversion uplift you expect from this promotion.',
    tab: 'Settings',
    tabLabel: 'Settings',
  },
  {
    id: 'eligibility',
    Icon: Settings,
    label: 'Configure eligibility rules',
    description: 'Restrict the promotion by customer segment, region, or channel before going live.',
    tab: 'Settings',
    tabLabel: 'Settings',
  },
]

const PRE_OPT_MARKDOWN_ITEMS = [
  {
    id: 'products',
    Icon: CheckCircle2,
    label: 'Products added',
    description: 'Your products are loaded. You can still adjust the selection before optimising.',
    tab: 'Products & Categories',
    tabLabel: 'Products & Categories',
    autoCheck: true,
  },
  {
    id: 'optimise',
    Icon: Sparkles,
    label: 'Run AI optimisation',
    description: "Click 'Optimise campaign' in the header to run PEAK's AI price optimisation across all added products.",
    tab: null,
    tabLabel: null,
  },
  {
    id: 'guardrails',
    Icon: ShieldAlert,
    label: 'Review guardrail settings',
    description: 'Confirm margin floors and discount caps are correct — these constrain the optimiser.',
    tab: 'Settings',
    tabLabel: 'Settings',
  },
]

const PRE_OPT_PROMO_ITEMS = [
  {
    id: 'products',
    Icon: CheckCircle2,
    label: 'Products added',
    description: 'Products are loaded and ready to optimise.',
    tab: 'Products & Categories',
    tabLabel: 'Products & Categories',
    autoCheck: true,
  },
  {
    id: 'optimise',
    Icon: Sparkles,
    label: 'Run AI optimisation',
    description: 'Click \'Optimise campaign\' to generate promotional price recommendations.',
    tab: null,
    tabLabel: null,
  },
  {
    id: 'messaging',
    Icon: Megaphone,
    label: 'Set promotional messaging',
    description: "Configure the customer-facing discount label (e.g. 'Up to 30% off') before going live.",
    tab: 'Settings',
    tabLabel: 'Settings',
  },
]

const OPTIMISED_MARKDOWN_ITEMS = [
  {
    id: 'scenario',
    Icon: Sparkles,
    label: 'Review optimised scenario',
    description: 'The AI has planned your markdown strategy. Review it, adjust depths per category, and confirm it looks right.',
    tab: 'Scenario planning',
    tabLabel: 'Scenario Planning',
  },
  {
    id: 'guardrails',
    Icon: ShieldAlert,
    label: 'Review guardrails',
    description: 'Check minimum margin floors and maximum discount caps are correctly set before going live.',
    tab: 'Settings',
    tabLabel: 'Settings',
  },
  {
    id: 'settings',
    Icon: Settings,
    label: 'Confirm campaign settings',
    description: 'Review campaign dates, sell-through targets, and any activation conditions.',
    tab: 'Settings',
    tabLabel: 'Settings',
  },
]

const OPTIMISED_PROMO_ITEMS = [
  {
    id: 'scenario',
    Icon: Sparkles,
    label: 'Review promotional scenario',
    description: 'The AI has planned your promotional pricing. Review the suggested discounts and confirm they match your objectives.',
    tab: 'Scenario planning',
    tabLabel: 'Scenario Planning',
  },
  {
    id: 'messaging',
    Icon: Megaphone,
    label: 'Configure promotional messaging',
    description: 'Set the customer-facing discount messaging banner (e.g. "Up to 30% off") that will appear across channels.',
    tab: 'Settings',
    tabLabel: 'Settings',
  },
  {
    id: 'settings',
    Icon: Settings,
    label: 'Confirm activation conditions',
    description: 'Review campaign start date, eligibility rules, and any approval gates before going live.',
    tab: 'Settings',
    tabLabel: 'Settings',
  },
]

function getChecklistItems(status, campaignType) {
  if (status === 'Draft') {
    return campaignType === 'Promo' ? DRAFT_PROMO_ITEMS : DRAFT_MARKDOWN_ITEMS
  }
  if (status === 'Pre-optimisation') {
    return campaignType === 'Promo' ? PRE_OPT_PROMO_ITEMS : PRE_OPT_MARKDOWN_ITEMS
  }
  if (status === 'Optimised') {
    return campaignType === 'Promo' ? OPTIMISED_PROMO_ITEMS : OPTIMISED_MARKDOWN_ITEMS
  }
  return []
}

// ---------------------------------------------------------------------------
// Chart data
// ---------------------------------------------------------------------------

const CHART_DATA = {
  sellThrough: [
    { week: 'W1', target: 18, current: 18 },
    { week: 'W2', target: 36, current: 30, hitLabel: 'Hit 1', hitStatus: 'Completed' },
    { week: 'W3', target: 54, current: 43, hitLabel: 'Hit 2', hitStatus: 'Live' },
    { week: 'W4', target: 72, current: 62 },
    { week: 'W5', target: 90, current: 76 },
  ],
  revenue: [
    { week: 'W1', target: 48, current: 44 },
    { week: 'W2', target: 96, current: 86 },
    { week: 'W3', target: 148, current: 130 },
    { week: 'W4', target: 202, current: 174 },
    { week: 'W5', target: 248, current: 212 },
  ],
  margin: [
    { week: 'W1', target: 38, current: 37 },
    { week: 'W2', target: 36, current: 35 },
    { week: 'W3', target: 34, current: 32 },
    { week: 'W4', target: 32, current: 31 },
    { week: 'W5', target: 30, current: 30 },
  ],
  stock: [
    { week: 'W1', target: 80, current: 80 },
    { week: 'W2', target: 62, current: 68 },
    { week: 'W3', target: 44, current: 55 },
    { week: 'W4', target: 26, current: 37 },
    { week: 'W5', target: 10, current: 24 },
  ],
  discount: [
    { week: 'W1', target: 10, current: 8 },
    { week: 'W2', target: 15, current: 18 },
    { week: 'W3', target: 22, current: 24 },
    { week: 'W4', target: 30, current: 28 },
    { week: 'W5', target: 38, current: 33 },
  ],
  conversion: [
    { week: 'W1', target: 3.2, current: 3.0 },
    { week: 'W2', target: 3.8, current: 3.4 },
    { week: 'W3', target: 4.4, current: 3.9 },
    { week: 'W4', target: 5.0, current: 4.3 },
    { week: 'W5', target: 5.4, current: 4.7 },
  ],
  revenueUplift: [
    { week: 'D1', actual: 28.4, target: 28.0, baseline: 26.0 },
    { week: 'D2', actual: 29.7, target: 29.5, baseline: 26.0, hitLabel: 'Hit 1', hitStatus: 'Completed' },
    { week: 'D3', actual: 32.7, target: 31.5, baseline: 26.0 },
    { week: 'D4', actual: 31.8, target: 32.0, baseline: 26.0 },
    { week: 'D5', actual: 31.8, target: 31.0, baseline: 26.0, hitLabel: 'Hit 2', hitStatus: 'Live' },
    { week: 'D6', actual: 30.0, target: 30.0, baseline: 26.0 },
    { week: 'D7', actual: 28.8, target: 30.0, baseline: 26.0 },
  ],
  incrementalUnits: [
    { week: 'D1', actual: 2420, target: 2300, baseline: 1600 },
    { week: 'D2', actual: 2880, target: 2800, baseline: 1600, hitLabel: 'Hit 1', hitStatus: 'Completed' },
    { week: 'D3', actual: 3900, target: 3700, baseline: 1600 },
    { week: 'D4', actual: 4400, target: 4400, baseline: 1600 },
    { week: 'D5', actual: 4000, target: 4000, baseline: 1600, hitLabel: 'Hit 2', hitStatus: 'Live' },
    { week: 'D6', actual: 3400, target: 3400, baseline: 1600 },
    { week: 'D7', actual: 2620, target: 2600, baseline: 1600 },
  ],
  promoROI: [
    { week: 'D1', actual: 1.2, target: 3.0, baseline: 1.0 },
    { week: 'D2', actual: 1.9, target: 3.0, baseline: 1.0 },
    { week: 'D3', actual: 2.5, target: 3.0, baseline: 1.0 },
    { week: 'D4', actual: 3.0, target: 3.0, baseline: 1.0 },
    { week: 'D5', actual: 3.4, target: 3.0, baseline: 1.0 },
    { week: 'D6', actual: 3.7, target: 3.0, baseline: 1.0 },
    { week: 'D7', actual: 3.8, target: 3.0, baseline: 1.0 },
  ],
  promoConversion: [
    { week: 'D1', actual: 2.4, target: 2.8, baseline: 2.1 },
    { week: 'D2', actual: 2.9, target: 2.8, baseline: 2.1 },
    { week: 'D3', actual: 3.4, target: 2.8, baseline: 2.1 },
    { week: 'D4', actual: 3.1, target: 2.8, baseline: 2.1 },
    { week: 'D5', actual: 3.2, target: 2.8, baseline: 2.1 },
    { week: 'D6', actual: 3.5, target: 2.8, baseline: 2.1 },
    { week: 'D7', actual: 3.2, target: 2.8, baseline: 2.1 },
  ],
  aov: [
    { week: 'D1', actual: 148, target: 142, baseline: 130 },
    { week: 'D2', actual: 152, target: 142, baseline: 130 },
    { week: 'D3', actual: 156, target: 142, baseline: 130 },
    { week: 'D4', actual: 141, target: 142, baseline: 130 },
    { week: 'D5', actual: 155, target: 142, baseline: 130 },
    { week: 'D6', actual: 159, target: 142, baseline: 130 },
    { week: 'D7', actual: 162, target: 142, baseline: 130 },
  ],
  stockDepletion: [
    { week: 'D1', actual: 16, target: 14, baseline: 8 },
    { week: 'D2', actual: 32, target: 28, baseline: 16 },
    { week: 'D3', actual: 50, target: 42, baseline: 24 },
    { week: 'D4', actual: 63, target: 56, baseline: 32 },
    { week: 'D5', actual: 76, target: 70, baseline: 40 },
    { week: 'D6', actual: 85, target: 82, baseline: 48 },
    { week: 'D7', actual: 88, target: 92, baseline: 56 },
  ],
}

const MARKDOWN_CHART_METRICS = [
  { key: 'sellThrough', label: 'Sell-through', unit: '%',  dataKey: 'sellThrough', mainKey: 'current' },
  { key: 'revenue',     label: 'Revenue',      unit: '£K', dataKey: 'revenue',     mainKey: 'current' },
  { key: 'margin',      label: 'Margin',       unit: '%',  dataKey: 'margin',      mainKey: 'current' },
  { key: 'stock',       label: 'Stock',        unit: '%',  dataKey: 'stock',       mainKey: 'current' },
  { key: 'discount',    label: 'Discount',     unit: '%',  dataKey: 'discount',    mainKey: 'current' },
  { key: 'conversion',  label: 'Conversion',   unit: '%',  dataKey: 'conversion',  mainKey: 'current' },
]

const PROMO_CHART_METRICS = [
  { key: 'revenueUplift',    label: 'Revenue',    unit: '£K', dataKey: 'revenueUplift',    mainKey: 'actual' },
  { key: 'incrementalUnits', label: 'Units',      unit: '',   dataKey: 'incrementalUnits', mainKey: 'actual' },
  { key: 'promoROI',         label: 'ROI',        unit: 'x',  dataKey: 'promoROI',         mainKey: 'actual' },
  { key: 'promoConversion',  label: 'Conversion', unit: '%',  dataKey: 'promoConversion',  mainKey: 'actual' },
  { key: 'aov',              label: 'AOV',        unit: '£',  dataKey: 'aov',              mainKey: 'actual' },
  { key: 'stockDepletion',   label: 'Stock',      unit: '%',  dataKey: 'stockDepletion',   mainKey: 'actual' },
]

const MICRO_INSIGHTS = {
  sellThrough: 'Sell-through is 4pp behind pace — Knitwear and Footwear are the main drag',
  revenue: 'Revenue is £36K short of target; Hit 2 needs to close the gap by end of week',
  margin: 'Margin holding within 1pp of floor — guardrails are working as expected',
  stock: 'Stock cover is 2 weeks above target — carry-over risk if no deeper markdown soon',
  discount: 'Discount depth is lower than planned; consider deepening Footwear by 5pp',
  conversion: 'Conversion climbing each week — campaign momentum is building steadily',
  revenueUplift: 'Promo is adding ~£4–7K/day above baseline. Hit 2 on D5 held the uplift well',
  incrementalUnits: 'Promo is driving 1,000–2,300 extra units per day above organic baseline',
  promoROI: 'ROI crossed break-even (1x) on Day 1 and hit target (3x) on Day 4 — highly efficient',
  promoConversion: 'Conversion averaging 0.4pp above target — strongest single day was Day 3 at 3.4%',
  aov: 'AOV tracking £14 above baseline. Day 4 dip driven by accessories-heavy basket mix',
  stockDepletion: 'Stock depletion ahead of plan through Day 6, then slowed — monitor Day 7 carry-over risk',
}

// ---------------------------------------------------------------------------
// Completed summary data
// ---------------------------------------------------------------------------

const MARKDOWN_COMPLETED = {
  score: 74,
  scoreLabel: 'Good',
  wentWell: [
    { title: 'Margin protected', detail: '31.2% margin vs 30% target (+1.2pp)' },
    { title: 'Hit 2 outperformed', detail: 'Drove 45% of total revenue, best single hit this season' },
    { title: 'Knitwear cleared', detail: '84% sell-through, 4% above category target' },
  ],
  watchPoints: [
    { title: 'Sell-through short', detail: '78% vs 80% target, 2pp below — driven by Footwear' },
    { title: 'Revenue gap', detail: '£2.5M vs £2.8M target, 10.7% below plan' },
  ],
  aiLearnings: [
    'Start Hit 1 discounts 5 days earlier next season to capture early demand peak',
    'Footwear needed a deeper markdown in Week 3 — consider starting at 25% vs 15%',
    'Knitwear cleared faster than expected — reduce opening stock allocation next season',
  ],
}

const PROMO_COMPLETED = {
  score: 88,
  scoreLabel: 'Strong',
  wentWell: [
    { title: 'Revenue target exceeded', detail: '+£28.4K lift, 8.2% above plan' },
    { title: 'Conversion spike', detail: '3.2% vs 2.8% baseline (+14% uplift)' },
    { title: 'Promo ROI', detail: '3.8x return vs 3.0x target' },
  ],
  watchPoints: [
    { title: 'AOV dipped on Day 4', detail: '£141 vs £155 target — basket mix shifted toward accessories' },
    { title: 'Stock depletion slowed in final 2 days', detail: 'Risked carry-over stock' },
  ],
  aiLearnings: [
    'Extend the promo window by 1 day — day 7 showed strong late conversion that was cut short',
    'Consider a flash \'last chance\' email on day 5 — missed incremental uplift window',
    'Accessories over-indexed vs apparel — adjust channel mix for next promo',
  ],
}

// ---------------------------------------------------------------------------
// Helper components
// ---------------------------------------------------------------------------

function HitStatusBadge({ status }) {
  const map = {
    Completed: 'bg-green-50 text-green-700 border-green-200',
    Live: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    Draft: 'bg-gray-50 text-gray-500 border-gray-200',
    Planned: 'bg-blue-50 text-blue-600 border-blue-200',
  }
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium border px-2 py-0.5 rounded-full ${map[status] || map.Draft}`}>
      {status === 'Completed' && <CheckCircle2 size={9} />}
      {status === 'Live' && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />}
      {status}
    </span>
  )
}

function ChartTooltip({ active, payload, label, unit }) {
  if (active && payload?.length) {
    const fmt = (v) => {
      if (unit === '£K') return `£${v}K`
      if (unit === '£') return `£${v}`
      if (unit === 'x') return `${v}x`
      return `${v}${unit}`
    }
    return (
      <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-md text-xs space-y-0.5">
        <p className="font-semibold text-gray-700 mb-1">{label}</p>
        {payload.map(p => (
          <p key={p.name} style={{ color: p.stroke }}>{p.name}: {fmt(p.value)}</p>
        ))}
      </div>
    )
  }
  return null
}

// ---------------------------------------------------------------------------
// PreLaunchChecklist
// ---------------------------------------------------------------------------

function PreLaunchChecklist({ onNavigateToTab, items }) {
  const initialChecked = new Set(items.filter(i => i.autoCheck).map(i => i.id))
  const [checked, setChecked] = useState(initialChecked)
  const doneCount = checked.size
  const allDone = doneCount === items.length

  function toggle(id) {
    setChecked(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <div className={`bg-white rounded-xl border overflow-hidden mb-5 transition-colors ${allDone ? 'border-green-200' : 'border-violet-200'}`}>
      {/* Header */}
      <div className={`flex items-center justify-between px-5 py-3 ${allDone ? 'bg-green-50' : 'bg-violet-50'}`}>
        <div className="flex items-center gap-2">
          {allDone
            ? <CheckCircle2 size={14} className="text-green-600 flex-shrink-0" />
            : <Sparkles size={14} className="text-violet-600 flex-shrink-0" />}
          <span className={`text-sm font-semibold ${allDone ? 'text-green-800' : 'text-violet-800'}`}>
            {allDone ? 'All checks done — ready to go live' : 'Pre-launch checklist'}
          </span>
          {!allDone && (
            <span className="text-xs text-violet-500 ml-1">Review these before activating</span>
          )}
        </div>
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-20 h-1.5 bg-white/70 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${allDone ? 'bg-green-500' : 'bg-violet-500'}`}
              style={{ width: `${(doneCount / items.length) * 100}%` }}
            />
          </div>
          <span className={`text-xs font-semibold tabular-nums ${allDone ? 'text-green-700' : 'text-violet-600'}`}>
            {doneCount} / {items.length}
          </span>
        </div>
      </div>

      {/* Items */}
      <div className="divide-y divide-gray-50">
        {items.map(({ id, Icon, label, description, tab, tabLabel }) => {
          const done = checked.has(id)
          return (
            <div
              key={id}
              className={`flex items-start gap-3.5 px-5 py-3.5 transition-colors ${done ? 'bg-gray-50/50' : 'hover:bg-gray-50/60'}`}
            >
              {/* Checkbox */}
              <button
                onClick={() => toggle(id)}
                className={`mt-0.5 w-[18px] h-[18px] rounded border-2 flex items-center justify-center flex-shrink-0 transition-all
                  ${done ? 'bg-[#2a44d4] border-[#2a44d4]' : 'border-gray-300 hover:border-[#2a44d4]'}`}
              >
                {done && <Check size={10} className="text-white" />}
              </button>

              {/* Icon */}
              <Icon size={14} className={`mt-0.5 flex-shrink-0 transition-colors ${done ? 'text-gray-300' : 'text-gray-400'}`} />

              {/* Text */}
              <div className="flex-1 min-w-0">
                <span className={`text-sm font-medium transition-colors ${done ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                  {label}
                </span>
                {!done && (
                  <p className="text-xs text-gray-400 mt-0.5 leading-snug">{description}</p>
                )}
              </div>

              {/* Tab link */}
              {!done && tab && tabLabel && (
                <button
                  onClick={() => onNavigateToTab(tab)}
                  className="flex items-center gap-0.5 text-xs font-medium text-[#2a44d4] hover:text-[#2438b8] whitespace-nowrap flex-shrink-0 mt-0.5 transition-colors"
                >
                  {tabLabel} <ChevronRight size={11} />
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// CompletedSummary
// ---------------------------------------------------------------------------

function CompletedSummary({ campaignType }) {
  const data = campaignType === 'Promo' ? PROMO_COMPLETED : MARKDOWN_COMPLETED
  const scorePct = data.score

  return (
    <div className="bg-white rounded-xl border border-gray-200 border-t-4 border-t-green-400 overflow-hidden mb-4">
      {/* Score bar */}
      <div className="px-6 pt-5 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Campaign Summary</h3>
            <p className="text-xs text-gray-400 mt-0.5">AI-generated debrief based on final campaign performance</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900 leading-tight">{data.score}<span className="text-sm font-medium text-gray-400">/100</span></div>
            <div className="text-xs font-semibold text-green-600 mt-0.5">{data.scoreLabel}</div>
          </div>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-700"
            style={{ width: `${scorePct}%` }}
          />
        </div>
      </div>

      {/* Wins + Watch points */}
      <div className="grid grid-cols-2 divide-x divide-gray-100 px-0">
        {/* What went well */}
        <div className="px-6 py-4">
          <div className="flex items-center gap-1.5 mb-3">
            <CheckCircle2 size={13} className="text-green-500" />
            <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">What went well</span>
          </div>
          <div className="space-y-2.5">
            {data.wentWell.map((w, i) => (
              <div key={i} className="bg-green-50 rounded-lg px-3 py-2.5 border border-green-100">
                <div className="text-xs font-semibold text-green-800 mb-0.5">{w.title}</div>
                <div className="text-xs text-green-700 leading-snug">{w.detail}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Watch points */}
        <div className="px-6 py-4">
          <div className="flex items-center gap-1.5 mb-3">
            <AlertTriangle size={13} className="text-amber-500" />
            <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Watch points</span>
          </div>
          <div className="space-y-2.5">
            {data.watchPoints.map((w, i) => (
              <div key={i} className="bg-amber-50 rounded-lg px-3 py-2.5 border border-amber-100">
                <div className="text-xs font-semibold text-amber-800 mb-0.5">{w.title}</div>
                <div className="text-xs text-amber-700 leading-snug">{w.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Learnings */}
      <div className="px-6 py-4 bg-violet-50 border-t border-violet-100">
        <div className="flex items-center gap-1.5 mb-3">
          <Sparkles size={13} className="text-violet-600" />
          <span className="text-xs font-semibold text-violet-800 uppercase tracking-wide">AI learnings for next season</span>
        </div>
        <div className="space-y-2">
          {data.aiLearnings.map((l, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <span className="w-4 h-4 rounded-full bg-violet-200 text-violet-700 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
              <p className="text-xs text-violet-700 leading-snug">{l}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// PerformanceChart
// ---------------------------------------------------------------------------

function PerformanceChart({ campaignType }) {
  const metrics = campaignType === 'Promo' ? PROMO_CHART_METRICS : MARKDOWN_CHART_METRICS
  const [selectedMetricKey, setSelectedMetricKey] = useState(metrics[0].key)
  const [compareMetricKey, setCompareMetricKey] = useState(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [compareDropdownOpen, setCompareDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const compareDropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false)
      if (compareDropdownRef.current && !compareDropdownRef.current.contains(e.target)) setCompareDropdownOpen(false)
    }
    if (dropdownOpen || compareDropdownOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [dropdownOpen, compareDropdownOpen])

  const selectedMetric = metrics.find(m => m.key === selectedMetricKey) || metrics[0]
  const compareMetric  = compareMetricKey ? metrics.find(m => m.key === compareMetricKey) : null
  const chartData      = CHART_DATA[selectedMetric.dataKey] || []
  const compareData    = compareMetric ? CHART_DATA[compareMetric.dataKey] || [] : []

  const mergedData = useMemo(() => {
    if (!compareMetric) return chartData
    return chartData.map((pt, i) => ({ ...pt, _compare: compareData[i]?.[compareMetric.mainKey] }))
  }, [chartData, compareData, compareMetric])

  const hasTarget   = chartData.length > 0 && 'target'   in chartData[0]
  const hasBaseline = chartData.length > 0 && 'baseline' in chartData[0]
  const hitPoints   = chartData.filter(d => d.hitLabel)
  const { unit, mainKey } = selectedMetric

  const yFmt = (v, u = unit) => {
    if (u === '£K') return `£${v}K`
    if (u === '£')  return `£${v}`
    if (u === 'x')  return `${v}x`
    return `${v}${u}`
  }

  function selectMetric(key) {
    setSelectedMetricKey(key)
    setDropdownOpen(false)
    if (key === compareMetricKey) setCompareMetricKey(null)
  }

  function selectCompare(key) {
    setCompareMetricKey(key)
    setCompareDropdownOpen(false)
  }

  const microInsight = MICRO_INSIGHTS[selectedMetricKey]

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-900">Performance</h3>
        <div className="flex items-center gap-2">
          {/* Compare control */}
          {compareMetric ? (
            <div className="flex items-center gap-1 text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-gray-50">
              <span className="text-gray-400 font-medium">vs</span>
              <span className="text-gray-600">{compareMetric.label}</span>
              <button onClick={() => setCompareMetricKey(null)} className="ml-0.5 text-gray-400 hover:text-gray-600">
                <X size={10} />
              </button>
            </div>
          ) : (
            <div className="relative" ref={compareDropdownRef}>
              <button
                onClick={() => setCompareDropdownOpen(o => !o)}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Plus size={11} /> Compare
              </button>
              {compareDropdownOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[140px] py-1">
                  {metrics.filter(m => m.key !== selectedMetricKey).map(m => (
                    <button key={m.key} onClick={() => selectCompare(m.key)}
                      className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50">
                      {m.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          {/* Primary dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(o => !o)}
              className="flex items-center gap-1 text-xs text-gray-600 border border-gray-200 rounded-lg px-2.5 py-1.5 hover:bg-gray-50 transition-colors"
            >
              {selectedMetric.label}
              <ChevronDown size={11} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[140px] py-1">
                {metrics.map(m => (
                  <button key={m.key} onClick={() => selectMetric(m.key)}
                    className={`w-full text-left px-3 py-2 text-xs transition-colors ${
                      m.key === selectedMetricKey ? 'bg-[#2a44d4]/5 text-[#2a44d4] font-medium' : 'text-gray-700 hover:bg-gray-50'
                    }`}>
                    {m.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Micro-insight */}
      {microInsight && (
        <div className="flex items-start gap-1.5 bg-blue-50 rounded-lg px-3 py-2 mb-3">
          <Sparkles size={11} className="text-blue-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-blue-700 leading-snug">{microInsight}</p>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 mb-3 flex-wrap">
        <span className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="w-6 inline-block border-t-2 border-[#2a44d4]" /> Actual
        </span>
        {hasTarget && (
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="w-6 inline-block border-t-2 border-dashed border-red-300" /> Target
          </span>
        )}
        {hasBaseline && (
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="w-6 inline-block border-t-2 border-dashed border-gray-300" /> Baseline
          </span>
        )}
        {hitPoints.length > 0 && (
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="w-px h-3 inline-block bg-indigo-400" /> Hit
          </span>
        )}
        {compareMetric && (
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="w-6 inline-block border-t-2 border-dashed border-gray-400" /> {compareMetric.label}
          </span>
        )}
      </div>

      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={mergedData} margin={{ top: 5, right: compareMetric ? 30 : 5, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="cGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c7d2fe" stopOpacity={0.65} />
                <stop offset="100%" stopColor="#eff1fe" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} />
            <YAxis yAxisId="left" tickFormatter={v => yFmt(v)} axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} />
            {compareMetric && (
              <YAxis yAxisId="right" orientation="right" tickFormatter={v => yFmt(v, compareMetric.unit)} axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10 }} />
            )}
            <Tooltip content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null
              const pt = chartData.find(d => d.week === label) || {}
              const mainVal = payload.find(p => p.dataKey === mainKey)?.value
              const compareVal = compareMetric ? payload.find(p => p.dataKey === '_compare')?.value : null
              const fmtD = (a, b) => { const d = a - b; return `${d >= 0 ? '+' : ''}${Math.round(d * 10) / 10}` }
              const fmtP = (a, b) => { const d = ((a - b) / Math.abs(b)) * 100; return `${d >= 0 ? '+' : ''}${Math.round(d * 10) / 10}%` }
              return (
                <div className="bg-white border border-gray-200 rounded-lg px-3 py-2.5 shadow-lg text-xs min-w-[160px]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-700">{label}</span>
                    {pt.hitLabel && (
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                        pt.hitStatus === 'Completed' ? 'bg-green-50 text-green-700' : 'bg-indigo-50 text-indigo-700'
                      }`}>{pt.hitLabel}</span>
                    )}
                  </div>
                  {mainVal != null && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Actual</span>
                      <span className="font-bold text-gray-900">{yFmt(mainVal)}</span>
                    </div>
                  )}
                  {pt.baseline != null && mainVal != null && (
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-gray-400">vs baseline</span>
                      <span className={`font-medium ${mainVal >= pt.baseline ? 'text-green-600' : 'text-red-500'}`}>
                        {fmtD(mainVal, pt.baseline)} ({fmtP(mainVal, pt.baseline)})
                      </span>
                    </div>
                  )}
                  {pt.target != null && mainVal != null && (
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-gray-400">vs target</span>
                      <span className={`font-medium ${mainVal >= pt.target ? 'text-green-600' : 'text-amber-600'}`}>
                        {fmtD(mainVal, pt.target)} ({fmtP(mainVal, pt.target)})
                      </span>
                    </div>
                  )}
                  {compareMetric && compareVal != null && (
                    <div className="flex items-center justify-between mt-1 pt-1 border-t border-gray-100">
                      <span className="text-gray-400">{compareMetric.label}</span>
                      <span className="font-medium text-gray-500">{yFmt(compareVal, compareMetric.unit)}</span>
                    </div>
                  )}
                </div>
              )
            }} />
            {hasBaseline && (
              <Line yAxisId="left" type="monotone" dataKey="baseline" stroke="#d1d5db" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="Baseline" />
            )}
            {hasTarget && (
              <Line yAxisId="left" type="monotone" dataKey="target" stroke="#f87171" strokeWidth={1.5} strokeDasharray="5 4" dot={false} name="Target" />
            )}
            <Area yAxisId="left" type="monotone" dataKey={mainKey} stroke="#2a44d4" strokeWidth={2} fill="url(#cGrad)" name="Actual" activeDot={{ r: 4, fill: '#2a44d4' }} dot={false} />
            {compareMetric && (
              <Line yAxisId="right" type="monotone" dataKey="_compare" stroke="#9ca3af" strokeWidth={1.5} strokeDasharray="4 3" dot={false} name={compareMetric.label} />
            )}
            {hitPoints.map(pt => (
              <ReferenceLine
                key={pt.week} yAxisId="left" x={pt.week}
                stroke={pt.hitStatus === 'Completed' ? '#10b981' : '#6366f1'}
                strokeWidth={1.5} strokeDasharray="3 3"
                label={{ value: pt.hitLabel, fill: pt.hitStatus === 'Completed' ? '#10b981' : '#6366f1', fontSize: 9, position: 'insideTopRight' }}
              />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// BrandBreakdown (multi-brand hits)
// ---------------------------------------------------------------------------

const stockQualityConfig = {
  full:       { label: 'Full range',  dot: 'bg-green-400', text: 'text-green-700', bg: 'bg-green-50 border-green-100' },
  good:       { label: 'Good avail.', dot: 'bg-green-400', text: 'text-green-700', bg: 'bg-green-50 border-green-100' },
  limited:    { label: 'Limited',     dot: 'bg-amber-400', text: 'text-amber-700', bg: 'bg-amber-50 border-amber-100' },
  fragmented: { label: 'Fragmented',  dot: 'bg-red-400',   text: 'text-red-700',   bg: 'bg-red-50 border-red-100'    },
}

function BrandBreakdown({ brands }) {
  const [expanded, setExpanded] = useState(false)
  const warnings = brands.filter(b => b.note)

  return (
    <div className="mt-2.5 pt-2.5 border-t border-gray-50">
      <button
        onClick={e => { e.stopPropagation(); setExpanded(v => !v) }}
        className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
      >
        Brand breakdown
        <ChevronDown size={11} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
        {!expanded && warnings.length > 0 && (
          <span className="ml-1 flex items-center gap-0.5 text-amber-600 font-medium">
            <AlertTriangle size={9} /> {warnings.length} {warnings.length === 1 ? 'brand needs attention' : 'brands need attention'}
          </span>
        )}
      </button>
      {expanded && (
        <div className="mt-2 space-y-1.5">
          {brands.map(b => {
            const qc = stockQualityConfig[b.stockQuality] || stockQualityConfig.good
            const stColor = b.sellThrough >= 65 ? 'bg-green-400' : b.sellThrough >= 50 ? 'bg-amber-400' : 'bg-red-400'
            const stText  = b.sellThrough >= 65 ? 'text-green-600' : b.sellThrough >= 50 ? 'text-amber-600' : 'text-red-500'
            return (
              <div key={b.name} className="flex items-center gap-2.5">
                <span className="text-xs font-medium text-gray-700 w-28 shrink-0 truncate">{b.name}</span>
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden min-w-0">
                  <div className={`h-full rounded-full ${stColor}`} style={{ width: `${b.sellThrough}%` }} />
                </div>
                <span className={`text-xs font-semibold tabular-nums w-7 shrink-0 ${stText}`}>{b.sellThrough}%</span>
                <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded border ${qc.bg} ${qc.text} shrink-0`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${qc.dot}`} />
                  {qc.label}
                </span>
                <span className="text-[10px] text-gray-400 shrink-0">{b.skus} SKUs</span>
              </div>
            )
          })}
          {warnings.map(b => (
            <div key={b.name + '-note'} className="flex items-start gap-1.5 text-[10px] text-amber-700 bg-amber-50 border border-amber-100 rounded px-2 py-1.5 mt-1">
              <AlertTriangle size={9} className="mt-0.5 shrink-0" />
              <span><strong>{b.name}:</strong> {b.note}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// CampaignHitsPanel
// ---------------------------------------------------------------------------

function CampaignHitsPanel({ hits = [], isMultiBrand = false }) {
  const [sort, setSort] = useState('Most recent')

  const summaryItems = isMultiBrand
    ? [
        { label: 'Margin from Hits',        value: '23%+' },
        { label: 'Revenue from Hits',        value: '£186K+' },
        { label: 'Stock at Cost Cleared',    value: '£220K' },
        { label: 'Contribution to Target',   value: '66%+', green: true },
      ]
    : [
        { label: 'Additional Margin from Hits',   value: '23%+' },
        { label: 'Additional Revenue from Hits',  value: '£34.4K+' },
        { label: 'Contribution to Target',        value: '11.8%+', green: true },
      ]

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-gray-900">Campaign Hits ({hits.length})</span>
        <button className="flex items-center gap-1 text-xs text-gray-600 border border-gray-200 rounded-lg px-2.5 py-1.5 hover:bg-gray-50">
          {sort} <ChevronDown size={11} />
        </button>
      </div>

      {/* Summary */}
      <div className={`grid gap-2 bg-gray-50 rounded-lg p-3 mb-3 ${isMultiBrand ? 'grid-cols-4' : 'grid-cols-3'}`}>
        {summaryItems.map(s => (
          <div key={s.label}>
            <div className="text-xs text-gray-400 mb-0.5 leading-tight">{s.label}</div>
            <div className={`text-sm font-bold ${s.green ? 'text-green-600' : 'text-gray-900'}`}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {hits.map(hit => (
          <div key={hit.id} className="border border-gray-100 rounded-lg p-3 hover:border-gray-200 cursor-pointer transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap mb-1">
                  <span className="text-sm font-semibold text-gray-900">{hit.name}</span>
                  <span className="text-xs text-gray-400">• {hit.discount}</span>
                  <span className="text-xs text-gray-400">• {hit.categories}</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <HitStatusBadge status={hit.status} />
                  {hit.recommended && <span className="text-xs text-violet-600">✦ AI recommended</span>}
                  {hit.alert && (
                    <span className="flex items-center gap-0.5 text-xs text-amber-600">
                      <Clock size={9} /> {hit.alert}
                    </span>
                  )}
                  {hit.daysLeft && <span className="text-xs text-orange-500">{hit.daysLeft}</span>}
                  {hit.missedTarget && <span className="text-xs text-amber-600">⚠ {hit.missedTarget}</span>}
                </div>
              </div>
              <ChevronRight size={15} className="text-gray-400 shrink-0 mt-0.5" />
            </div>

            {isMultiBrand ? (
              <div className="grid grid-cols-4 gap-2 mt-2 pt-2 border-t border-gray-50 text-xs">
                <div><span className="text-gray-400">Sell-through</span><br /><span className="font-medium text-gray-700">{hit.sellThrough ?? '—'}</span></div>
                <div><span className="text-gray-400">Revenue</span><br /><span className="font-medium text-gray-700">{hit.revenue ?? '—'}</span></div>
                <div><span className="text-gray-400">Margin</span><br /><span className="font-medium text-gray-700">{hit.margin ?? '—'}</span></div>
                <div><span className="text-gray-400">Stock at cost</span><br /><span className="font-medium text-gray-700">{hit.stockAtCost ?? '—'}</span></div>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2 mt-2 pt-2 border-t border-gray-50 text-xs text-gray-500">
                <div><span className="text-gray-400">Sell-through</span><br /><span className="font-medium text-gray-700">{hit.sellThrough ?? '—'}</span></div>
                <div><span className="text-gray-400">Revenue</span><br /><span className="font-medium text-gray-700">{hit.revenue ?? '—'}</span></div>
                <div className="col-span-2"><span className="text-gray-400">Units</span><br /><span className="font-medium text-gray-700">{hit.units}</span></div>
              </div>
            )}

            {isMultiBrand && hit.brands?.length > 0 && (
              <BrandBreakdown brands={hit.brands} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export default function CampaignOverviewTab({
  status,
  onNavigateToProducts,
  onNavigateToTab,
  campaignType,
  timelineHits = [],
  campaignHitsData = [],
  isMultiBrand = false,
}) {
  const isLive      = status === 'Live'
  const isCompleted = status === 'Completed'
  const isPreLive   = status === 'Draft' || status === 'Pre-optimisation' || status === 'Optimised'

  const checklistItems = getChecklistItems(status, campaignType)

  return (
    <div>
      {/* KPI cards row */}
      <div
        className="grid gap-3 mb-5"
        style={{ gridTemplateColumns: isLive ? 'repeat(4, 1fr) 1.1fr' : 'repeat(4, 1fr)' }}
      >
        {(() => {
          const cards = isPreLive
            ? (campaignType === 'Promo' ? promoZeroKpis : markdownZeroKpis)
            : isMultiBrand
            ? endKpiCards
            : (campaignType === 'Promo' ? promoKpiCards : kpiCards)
          return cards.map((k) => (
            <StatCard key={k.label} label={k.label} value={k.value} change={k.change} negative={k.negative} color={k.color} warning={k.warning} />
          ))
        })()}

        {/* Underperforming Categories — live campaigns only */}
        {isLive && (
          <div
            onClick={() => onNavigateToProducts('underperforming')}
            className="bg-white rounded-xl border border-l-4 border-gray-200 border-l-red-400 p-4 cursor-pointer hover:border-red-300 hover:shadow-sm transition-all group"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium text-gray-500">Underperforming Categories</span>
                <Info size={11} className="text-gray-400" />
              </div>
              <ArrowUpRight size={13} className="text-[#2a44d4] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="text-2xl font-bold text-gray-900 leading-tight mb-1">3</div>
            <div className="flex items-center gap-1 text-xs font-medium text-[#2a44d4]">
              View categories →
            </div>
          </div>
        )}
      </div>

      {/* Completed summary */}
      {isCompleted && (
        <CompletedSummary campaignType={campaignType} />
      )}

      {/* Campaign Timeline */}
      <div className="bg-white rounded-xl border border-gray-200 px-6 py-5 mb-4">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <CalendarDays size={15} className="text-gray-500" />
            <h3 className="text-sm font-semibold text-gray-900">Campaign Timeline</h3>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1 text-amber-600 font-medium">
              <AlertTriangle size={11} /> Below Target
            </span>
            <span className="flex items-center gap-1">
              <CalendarDays size={11} /> Week 2 of 4
            </span>
            <span className="text-gray-400">50% complete</span>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative" style={{ paddingBottom: 56 }}>
          {/* Week date labels */}
          <div className="flex justify-between text-xs text-gray-400 mb-3">
            {['W1 | 12/02/24', 'W2 | 19/02/24', 'W3 | 28/02/24', 'W4 | 04/03/24'].map(w => (
              <span key={w}>{w}</span>
            ))}
          </div>

          {/* Track */}
          <div className="relative h-2 bg-gray-100 rounded-full">
            {/* Progress fill */}
            <div className="absolute left-0 top-0 h-full bg-[#2a44d4] rounded-full transition-all" style={{ width: '50%' }} />

            {/* Hit markers — positioned on the track */}
            {timelineHits.map(hit => (
              <div
                key={hit.id}
                className="absolute top-1/2 -translate-y-1/2"
                style={{ left: `${hit.pct}%`, transform: `translateX(-50%) translateY(-50%)` }}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                  ${hit.status === 'Completed' ? 'bg-[#2a44d4] border-[#2a44d4]' :
                    hit.status === 'Live' ? 'bg-orange-400 border-orange-400' :
                    'bg-white border-gray-300'}`}
                >
                  {hit.status === 'Completed' && <CheckCircle2 size={8} className="text-white" />}
                </div>
              </div>
            ))}
          </div>

          {/* Hit labels — below the track */}
          {timelineHits.map(hit => (
            <div
              key={hit.id}
              className="absolute text-center"
              style={{ left: `${hit.pct}%`, transform: 'translateX(-50%)', top: 46 }}
            >
              <p className="text-xs font-semibold text-gray-700 whitespace-nowrap">{hit.label}</p>
              <div className={`text-xs flex items-center justify-center gap-0.5 whitespace-nowrap
                ${hit.status === 'Completed' ? 'text-green-600' :
                  hit.status === 'Live' ? 'text-orange-500' :
                  'text-gray-400'}`}>
                {hit.status === 'Completed' && <CheckCircle2 size={9} />}
                {hit.status}
              </div>
            </div>
          ))}

          {/* Campaign Launch / Ends */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-400">
            <span>Campaign Launch</span>
            <span>Campaign Ends</span>
          </div>
        </div>
      </div>

      {/* Bottom panel — context-aware */}
      {isLive && campaignHitsData.length > 0 ? (
        <div className="grid gap-4 items-stretch" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <CampaignHitsPanel hits={campaignHitsData} isMultiBrand={isMultiBrand} />
          <PerformanceChart campaignType={campaignType} />
        </div>
      ) : isLive ? (
        <PerformanceChart campaignType={campaignType} />
      ) : isPreLive && onNavigateToTab && checklistItems.length > 0 ? (
        <PreLaunchChecklist onNavigateToTab={onNavigateToTab} items={checklistItems} />
      ) : null}
    </div>
  )
}
