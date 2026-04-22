import { useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

const data = [
  { week: 'W1', value: 82000 },
  { week: 'W2', value: 100000 },
  { week: 'W3', value: 88000 },
  { week: 'W4', value: 120000 },
  { week: 'W5', value: 133000 },
  { week: 'W6', value: 155000 },
]

const filters = ['Revenue', 'Margin', 'Sales', 'Campaigns']

const formatY = (value) => `$${value / 1000}K`

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-md text-sm">
        <p className="font-semibold text-gray-900">{label}</p>
        <p className="text-[#4f5fd5]">${(payload[0].value / 1000).toFixed(0)}K</p>
      </div>
    )
  }
  return null
}

export default function RevenueChart() {
  const [activeFilter, setActiveFilter] = useState('Revenue')

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-1">
        <h2 className="text-base font-semibold text-gray-900">Revenue Performance</h2>
        <p className="text-sm text-gray-400 mt-0.5">6-week trend view</p>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 mt-4 mb-5">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeFilter === filter
                ? 'bg-gray-900 text-white'
                : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={290}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c7d2fe" stopOpacity={0.7} />
              <stop offset="100%" stopColor="#eff1fe" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="4 4" stroke="#f0f0f0" vertical={false} />
          <XAxis
            dataKey="week"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9ca3af', fontSize: 12 }}
          />
          <YAxis
            tickFormatter={formatY}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            domain={[0, 160000]}
            ticks={[0, 40000, 80000, 120000, 160000]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#4f5fd5"
            strokeWidth={2.5}
            fill="url(#revenueGrad)"
            dot={false}
            activeDot={{ r: 5, fill: '#4f5fd5', strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
