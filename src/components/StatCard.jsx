import { Info, TrendingUp, TrendingDown } from 'lucide-react'

const borderColors = {
  green: 'border-l-[#22c55e]',
  blue:  'border-l-[#3b82f6]',
  amber: 'border-l-[#f59e0b]',
  red:   'border-l-red-400',
  slate: 'border-l-slate-400',
}

export default function StatCard({ label, value, change, color, negative, delta, warning, timeframe }) {
  const isNegative = negative !== undefined
    ? negative
    : typeof change === 'string' && change.startsWith('-')

  return (
    <div className={`bg-white rounded-xl border border-gray-200 border-l-4 ${borderColors[color]} p-4`}>
      <div className="flex items-center gap-1.5 mb-0.5">
        <span className="text-xs font-medium text-gray-500 leading-tight">{label}</span>
        <Info size={11} className="text-gray-300 flex-shrink-0" />
      </div>
      {timeframe && <div className="text-[10px] text-gray-400 mb-1">{timeframe}</div>}
      <div className="text-2xl font-bold text-gray-900 leading-tight mb-1">{value}</div>
      {delta && (
        <div className={`text-xs font-semibold mb-0.5 ${isNegative ? 'text-red-500' : 'text-emerald-600'}`}>
          {isNegative ? '↓' : '↑'} {delta}
        </div>
      )}
      {change != null && (
        <div className={`flex items-center gap-1 text-[10px] ${isNegative ? 'text-red-400' : 'text-emerald-500'}`}>
          {isNegative ? <TrendingDown size={10} /> : <TrendingUp size={10} />}
          <span>{change}</span>
        </div>
      )}
      {warning && (
        <div className="flex items-center gap-1 mt-1.5 text-[10px] font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5">
          ⚠ {warning}
        </div>
      )}
    </div>
  )
}
