import { useState } from 'react'
import {
  Info,
  TrendingDown,
  TrendingUp,
  ChevronRight,
  CheckCircle2,
  CalendarDays,
  Clock,
  ChevronDown,
  AlertTriangle,
  ArrowUpRight,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  ReferenceLine,
} from 'recharts'

const kpiCards = [
  { label: 'Avg Margin', value: '30.3%', change: '-2% vs target', negative: true },
  { label: 'Avg Sell-Through', value: '65%', change: '-10% vs target', negative: true },
  { label: 'Avg Cover', value: '4 weeks', change: '-2% vs target', negative: true },
  { label: 'Total Revenue', value: '€4.4M', change: '-3% vs target', negative: true },
]

const sellThroughData = [
  { week: 'W1', target: 20, current: 22 },
  { week: 'W2', target: 38, current: 34 },
  { week: 'W3', target: 55, current: 48 },
  { week: 'W4', target: 70, current: 62 },
  { week: 'W5', target: 85, current: 74 },
]

const hits = [
  { id: 1, label: 'Hit 1', pct: 24, status: 'Completed', date: '12/02' },
  { id: 2, label: 'Hit 2', pct: 50, status: 'Live', date: '19/02' },
  { id: 3, label: 'Hit 3', pct: 76, status: 'Planned', date: '28/02' },
]

const campaignHits = [
  {
    id: 3,
    name: 'Hit 3: Final clearance',
    discount: '45% Discount',
    categories: '12 Categories',
    status: 'Draft',
    recommended: true,
    sellThrough: null,
    revenue: null,
    units: '— / 45 target',
    perDay: '—',
  },
  {
    id: 2,
    name: 'Hit 2: Extra 20% off slow movers',
    discount: '20% Discount',
    categories: '4 Categories',
    status: 'Live',
    alert: '51 units needed to hit target',
    daysLeft: '3d left',
    sellThrough: '66%',
    revenue: '£1.5K+',
    units: '125 / 176 units sold',
    perDay: '£1.3K /day',
  },
  {
    id: 1,
    name: 'Hit 1: Initial 5% discount',
    discount: '5% off',
    categories: '10 Categories',
    status: 'Completed',
    missedTarget: 'Missed target by 5%',
    sellThrough: '78%',
    revenue: '£2.5K+',
    units: '34 / 45 units sold',
    perDay: '£1.3K /day',
  },
]

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

function ChartTooltip({ active, payload, label }) {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-md text-xs space-y-0.5">
        <p className="font-semibold text-gray-700 mb-1">{label}</p>
        {payload.map(p => (
          <p key={p.name} style={{ color: p.stroke }}>{p.name}: {p.value}%</p>
        ))}
      </div>
    )
  }
  return null
}

export default function CampaignOverviewTab({ status, onNavigateToProducts }) {
  const isLive = status === 'Live'
  const [chartMetric, setChartMetric] = useState('Sell-through')

  return (
    <div>
      {/* KPI cards row */}
      <div className="grid gap-3 mb-5" style={{ gridTemplateColumns: 'repeat(4, 1fr) 1.1fr' }}>
        {kpiCards.map((k) => (
          <div key={k.label} className="bg-white rounded-xl border border-l-4 border-gray-200 border-l-violet-400 p-4">
            <div className="flex items-center gap-1 mb-1">
              <span className="text-xs font-medium text-gray-500">{k.label}</span>
              <Info size={11} className="text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 leading-tight mb-1">{k.value}</div>
            <div className={`flex items-center gap-1 text-xs font-medium ${k.negative ? 'text-red-500' : 'text-green-600'}`}>
              {k.negative ? <TrendingDown size={11} /> : <TrendingUp size={11} />}
              <span>{k.change}</span>
            </div>
          </div>
        ))}

        {/* Underperforming Categories — clickable on live campaigns */}
        <div
          onClick={isLive ? () => onNavigateToProducts('underperforming') : undefined}
          className={`bg-white rounded-xl border border-l-4 border-gray-200 border-l-red-400 p-4 ${isLive ? 'cursor-pointer hover:border-red-300 hover:shadow-sm transition-all group' : ''}`}
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1">
              <span className="text-xs font-medium text-gray-500">Underperforming Categories</span>
              <Info size={11} className="text-gray-400" />
            </div>
            {isLive && <ArrowUpRight size={13} className="text-[#2a44d4] opacity-0 group-hover:opacity-100 transition-opacity" />}
          </div>
          <div className="text-2xl font-bold text-gray-900 leading-tight mb-1">3</div>
          {isLive ? (
            <div className="flex items-center gap-1 text-xs font-medium text-[#2a44d4]">
              View categories →
            </div>
          ) : (
            <div className="text-xs text-gray-400">vs target</div>
          )}
        </div>
      </div>

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
            {hits.map(hit => (
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
          {hits.map(hit => (
            <div
              key={hit.id}
              className="absolute text-center"
              style={{ left: `${hit.pct}%`, transform: 'translateX(-50%)', top: 24 }}
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

      {/* Two-column: Hits + Chart (live only) */}
      {isLive ? (
        <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <CampaignHitsPanel />
          <SellThroughChart metric={chartMetric} onMetricChange={setChartMetric} />
        </div>
      ) : (
        <CampaignHitsPanel />
      )}
    </div>
  )
}

function CampaignHitsPanel() {
  const [sort, setSort] = useState('Most recent')
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-gray-900">Campaign Hits (3)</span>
        <button className="flex items-center gap-1 text-xs text-gray-600 border border-gray-200 rounded-lg px-2.5 py-1.5 hover:bg-gray-50">
          {sort} <ChevronDown size={11} />
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-2 bg-gray-50 rounded-lg p-3 mb-3">
        {[
          { label: 'Additional Margin from Hits', value: '23%+' },
          { label: 'Additional Revenue from Hits', value: '£34.4K+' },
          { label: 'Contribution to Target', value: '11.8%+', green: true },
        ].map(s => (
          <div key={s.label}>
            <div className="text-xs text-gray-400 mb-0.5 leading-tight">{s.label}</div>
            <div className={`text-sm font-bold ${s.green ? 'text-green-600' : 'text-gray-900'}`}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {campaignHits.map(hit => (
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

            <div className="grid grid-cols-4 gap-2 mt-2 pt-2 border-t border-gray-50 text-xs text-gray-500">
              <div><span className="text-gray-400">Sell-through</span><br /><span className="font-medium text-gray-700">{hit.sellThrough ?? '—'}</span></div>
              <div><span className="text-gray-400">Revenue</span><br /><span className="font-medium text-gray-700">{hit.revenue ?? '—'}</span></div>
              <div className="col-span-2"><span className="text-gray-400">Units</span><br /><span className="font-medium text-gray-700">{hit.units}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SellThroughChart({ metric, onMetricChange }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">Sell-Through Performance</h3>
        <button className="flex items-center gap-1 text-xs text-gray-600 border border-gray-200 rounded-lg px-2.5 py-1.5 hover:bg-gray-50">
          {metric} <ChevronDown size={11} />
        </button>
      </div>

      <div className="flex items-center gap-4 mb-4">
        {[
          { label: 'Target', style: 'border-t-2 border-dashed border-gray-400' },
          { label: 'Current', style: 'border-t-2 border-[#2a44d4]' },
          { label: 'Hit', dot: true },
        ].map(l => (
          <span key={l.label} className="flex items-center gap-1.5 text-xs text-gray-500">
            {l.dot
              ? <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
              : <span className={`w-6 inline-block ${l.style}`} />}
            {l.label}
          </span>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={sellThroughData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
          <defs>
            <linearGradient id="tGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e0e7ff" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#e0e7ff" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="cGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c7d2fe" stopOpacity={0.6} />
              <stop offset="100%" stopColor="#eff1fe" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="4 4" stroke="#f0f0f0" vertical={false} />
          <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} />
          <YAxis tickFormatter={v => `${v}%`} axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} />
          <Tooltip content={<ChartTooltip />} />
          <Area type="monotone" dataKey="target" stroke="#9ca3af" strokeWidth={1.5} strokeDasharray="5 4" fill="url(#tGrad)" dot={false} name="Target" />
          <Area type="monotone" dataKey="current" stroke="#2a44d4" strokeWidth={2} fill="url(#cGrad)" dot={false} activeDot={{ r: 4, fill: '#2a44d4' }} name="Current" />
          <ReferenceLine x="W2" stroke="#ef4444" strokeWidth={1} strokeDasharray="3 3" label={{ value: 'Hit 1', fill: '#ef4444', fontSize: 9, position: 'top' }} />
          <ReferenceLine x="W4" stroke="#ef4444" strokeWidth={1} strokeDasharray="3 3" label={{ value: 'Hit 2', fill: '#ef4444', fontSize: 9, position: 'top' }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
