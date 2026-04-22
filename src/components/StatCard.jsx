import { Info, TrendingUp, TrendingDown } from 'lucide-react'

const borderColors = {
  green: 'border-l-[#22c55e]',
  blue:  'border-l-[#3b82f6]',
  amber: 'border-l-[#f59e0b]',
  red:   'border-l-red-400',
  slate: 'border-l-slate-400',
}

export default function StatCard({ label, value, change, color, negative }) {
  const isNegative = negative !== undefined
    ? negative
    : typeof change === 'string' && change.startsWith('-')

  return (
    <div className={`bg-white rounded-xl border border-gray-200 border-l-4 ${borderColors[color]} p-5`}>
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        <Info size={13} className="text-gray-400" />
      </div>
      <div className="text-[28px] font-bold text-gray-900 leading-tight mb-1.5">{value}</div>
      {change != null && (
        <div className={`flex items-center gap-1 text-xs font-medium ${isNegative ? 'text-red-500' : 'text-green-600'}`}>
          {isNegative ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
          <span>{change}</span>
        </div>
      )}
    </div>
  )
}
