import { Target, Clock, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react'

const actions = [
  {
    id: 1,
    icon: Target,
    iconBg: 'bg-[#166534]',
    cardBg: 'bg-[#f0fdf4]',
    border: 'border-[#bbf7d0]',
    title: 'Optimize Pricing in Footwear',
    description:
      '47 SKUs show 12% price increase potential based on elasticity analysis',
    pill: '+$127K Revenue',
    pillStyle: 'bg-[#dcfce7] text-[#166534]',
    progressColor: 'bg-[#22c55e]',
    progress: 78,
    progressLabel: 'High',
    btnText: 'Review Products',
    btnStyle: 'border-gray-200 text-gray-700 hover:bg-white/80',
  },
  {
    id: 2,
    icon: Clock,
    iconBg: 'bg-[#b45309]',
    cardBg: 'bg-[#fffbeb]',
    border: 'border-[#fde68a]',
    title: 'Inventory Clearance Needed',
    description:
      '64 products with low turnover (<4 weeks). Markdown recommended.',
    pill: '64 Products',
    pillStyle: 'bg-[#fef3c7] text-[#92400e]',
    progressColor: 'bg-[#f59e0b]',
    progress: 78,
    progressLabel: 'High',
    btnText: 'Create Campaign',
    btnStyle: 'border-[#fde68a] text-[#b45309] hover:bg-amber-50',
  },
  {
    id: 3,
    icon: CheckCircle2,
    iconBg: 'bg-[#1d4ed8]',
    cardBg: 'bg-[#eff6ff]',
    border: 'border-[#bfdbfe]',
    title: 'Spring Campaign Exceeding Target',
    description:
      'Performance at 123% of target with strong margin retention',
    pill: '+$89K Revenue',
    pillStyle: 'bg-[#dbeafe] text-[#1d4ed8]',
    progressColor: 'bg-[#3b82f6]',
    progress: 48,
    progressLabel: 'Medium',
    btnText: 'View Campaign',
    btnStyle: 'border-[#bfdbfe] text-[#1d4ed8] hover:bg-blue-50',
  },
]

export default function ActionItems() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Action Items</h2>
          <p className="text-sm text-gray-400 mt-0.5">AI-powered recommendations</p>
        </div>
        <button className="flex items-center gap-1.5 border border-blue-300 text-blue-600 rounded-full px-3 py-1 text-xs font-medium hover:bg-blue-50 transition-colors">
          <Sparkles size={11} />
          3 New
        </button>
      </div>

      {/* Cards */}
      {actions.map((action) => {
        const Icon = action.icon
        return (
          <div
            key={action.id}
            className={`${action.cardBg} border ${action.border} rounded-xl p-4 flex flex-col gap-3`}
          >
            {/* Icon + text */}
            <div className="flex gap-3">
              <div
                className={`${action.iconBg} w-9 h-9 rounded-lg flex items-center justify-center shrink-0`}
              >
                <Icon size={17} className="text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 leading-snug">
                  {action.title}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  {action.description}
                </p>
              </div>
            </div>

            {/* Pill + progress bar */}
            <div className="flex items-center gap-3">
              <span
                className={`${action.pillStyle} text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap`}
              >
                {action.pill}
              </span>
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="flex-1 h-1.5 bg-black/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${action.progressColor} rounded-full`}
                    style={{ width: `${action.progress}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 shrink-0">{action.progressLabel}</span>
              </div>
            </div>

            {/* CTA */}
            <button
              className={`w-full bg-white border ${action.btnStyle} rounded-lg py-2 text-sm font-medium flex items-center justify-center gap-1.5 transition-colors`}
            >
              {action.btnText}
              <ArrowRight size={13} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
