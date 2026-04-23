import { useState } from 'react'
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  Megaphone,
  Target,
  CheckCircle2,
  FileText,
  CalendarDays,
  Sparkles,
  AlertCircle,
  LayoutGrid,
  Globe,
  MoreVertical,
  Info,
  Plus,
} from 'lucide-react'
import CreateCampaignModal from './CreateCampaignModal'

const campaigns = [
  {
    id: 1,
    name: 'End of Autumn Coats AW 26',
    type: 'Markdown',
    country: 'Spain',
    dates: '23/10/30 – 23/11/30',
    products: '124,030',
    optimized: '111,374',
    categories: ['Coats', 'Knitwear'],
    extra: 3,
    tagIcon: 'grid',
    status: 'Live',
  },
  {
    id: 2,
    name: 'End of Autumn Coats AW 25',
    type: 'Markdown',
    country: 'UK',
    dates: '04-10-24 – 08-12-24',
    products: '89,200',
    optimized: '89,200',
    categories: ['Coats', 'Dresses'],
    extra: 2,
    tagIcon: 'grid',
    status: 'Optimised',
  },
  {
    id: 3,
    name: 'End of Summer Dresses SS 25',
    type: 'Markdown',
    country: 'France',
    dates: '01-07-25 – 31-08-25',
    products: '56,100',
    optimized: '0',
    categories: ['Dresses', 'Tops'],
    extra: 4,
    tagIcon: 'globe',
    status: 'Pre-optimisation',
  },
  {
    id: 4,
    name: 'Winter Knitwear Clearance',
    type: 'Markdown',
    country: 'Germany',
    dates: '01-02-25 – 28-02-25',
    products: '34,800',
    optimized: '0',
    categories: ['Knitwear', 'Scarves'],
    extra: 1,
    tagIcon: 'globe',
    status: 'Draft',
  },
  {
    id: 5,
    name: 'Spring Edit SS 24',
    type: 'Markdown',
    country: 'Spain',
    dates: '01-03-24 – 30-04-24',
    products: '98,500',
    optimized: '98,500',
    categories: ['Dresses', 'Tops'],
    extra: 3,
    tagIcon: 'grid',
    status: 'Completed',
  },
]

const typeConfig = {
  Promo: {
    icon: Megaphone,
    className: 'bg-blue-50 text-blue-600 border border-blue-100',
  },
  Markdown: {
    icon: Target,
    className: 'bg-violet-50 text-violet-600 border border-violet-100',
  },
}

const statusConfig = {
  Completed: {
    icon: CheckCircle2,
    className: 'bg-green-50 text-green-700 border border-green-200',
  },
  Draft: {
    icon: FileText,
    className: 'bg-gray-50 text-gray-600 border border-gray-200',
  },
  'Pre-optimisation': {
    icon: CalendarDays,
    className: 'bg-blue-50 text-blue-600 border border-blue-200',
  },
  Optimised: {
    icon: Sparkles,
    className: 'bg-violet-50 text-violet-700 border border-violet-200',
  },
  Live: {
    icon: Sparkles,
    className: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    dot: true,
  },
  Error: {
    icon: AlertCircle,
    className: 'bg-red-50 text-red-600 border border-red-200',
  },
}

function TypeBadge({ type }) {
  const cfg = typeConfig[type]
  const Icon = cfg.icon
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${cfg.className}`}>
      <Icon size={11} />
      {type}
    </span>
  )
}

function StatusBadge({ status }) {
  const cfg = statusConfig[status]
  const Icon = cfg.icon
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${cfg.className}`}>
      <Icon size={11} />
      {status}
      {cfg.dot && <span className="w-1.5 h-1.5 rounded-full bg-orange-400 ml-0.5" />}
    </span>
  )
}

export default function CampaignsTab({ onSelectCampaign }) {
  const [showCreate, setShowCreate] = useState(false)

  return (
    <div>
      {showCreate && <CreateCampaignModal onClose={() => setShowCreate(false)} />}

      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Create &amp; Find Campaigns</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Search and edit campaigns or create a new one.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 border border-gray-200 rounded-lg px-3.5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <SlidersHorizontal size={15} />
            Filter
          </button>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 bg-[#2a44d4] text-white rounded-lg px-3.5 py-2 text-sm font-medium hover:bg-[#2338b8] transition-colors"
          >
            <Plus size={15} />
            Create Campaign
          </button>
        </div>
      </div>

      {/* Two stat cards */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        {/* Total Products */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm font-medium text-gray-500 mb-1">Total Products</p>
          <p className="text-[28px] font-bold text-gray-900 leading-tight mb-4">26,472</p>
          <div className="flex rounded-full overflow-hidden h-8 text-xs font-medium">
            <div
              className="flex items-center justify-center bg-green-100 text-green-700 shrink-0"
              style={{ width: '94%' }}
            >
              24,912 optimized
            </div>
            <div
              className="flex items-center justify-center bg-amber-100 text-amber-700 min-w-0 flex-1 truncate px-2"
            >
              1,576 original price
            </div>
          </div>
        </div>

        {/* Campaigns Status */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm font-medium text-gray-500 mb-1">Campaigns Status</p>
          <p className="text-[28px] font-bold text-gray-900 leading-tight mb-4">3</p>
          <div className="flex gap-2">
            <div className="flex-1 flex items-center justify-center border border-blue-300 text-blue-600 rounded-full py-1.5 text-xs font-medium">
              3 live
            </div>
            <div className="flex-1 flex items-center justify-center bg-gray-100 text-gray-600 rounded-full py-1.5 text-xs font-medium">
              14 Drafts
            </div>
            <div className="flex-1 flex items-center justify-center bg-green-100 text-green-700 rounded-full py-1.5 text-xs font-medium">
              3 Completed
            </div>
          </div>
        </div>
      </div>

      {/* Search + count + sort */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-72">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Find a campaign"
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#2a44d4] focus:ring-1 focus:ring-[#2a44d4] bg-white"
          />
        </div>
        <span className="text-sm text-gray-400">24 Total Campaigns</span>
        <div className="ml-auto flex items-center gap-1 text-sm text-gray-600">
          <span>Sort by:</span>
          <button className="flex items-center gap-1 font-medium text-[#2a44d4] hover:underline">
            Date edited
            <ChevronDown size={14} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">Campaign Name</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Type</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Country</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">
                <span className="inline-flex items-center gap-1">
                  Dates <ChevronDown size={12} className="text-gray-400" />
                </span>
              </th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500">
                <div>Products</div>
                <div className="font-normal text-gray-400">Optimized</div>
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Categories</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500">Tags</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500"></th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c, i) => (
              <tr
                key={c.id}
                onClick={() => onSelectCampaign?.(c)}
                className={`${i < campaigns.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-gray-50 transition-colors cursor-pointer`}
              >
                <td className="px-5 py-4 font-semibold text-gray-900 whitespace-nowrap">
                  {c.name}
                </td>
                <td className="px-4 py-4">
                  <TypeBadge type={c.type} />
                </td>
                <td className="px-4 py-4 text-gray-600">{c.country}</td>
                <td className="px-4 py-4 text-gray-600 whitespace-nowrap">{c.dates}</td>
                <td className="px-4 py-4 text-right">
                  <div className="font-semibold text-gray-900">{c.products}</div>
                  <div className="flex items-center justify-end gap-1 text-xs text-gray-400 mt-0.5">
                    {c.optimized}
                    <Info size={11} />
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {c.categories.map((cat) => (
                      <span key={cat} className="text-xs text-gray-600">{cat}</span>
                    ))}
                    <span className="text-xs text-[#2a44d4] font-medium">+{c.extra}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-center">
                  {c.tagIcon === 'grid' ? (
                    <LayoutGrid size={16} className="text-gray-400 mx-auto" />
                  ) : (
                    <Globe size={16} className="text-gray-400 mx-auto" />
                  )}
                </td>
                <td className="px-4 py-4">
                  <StatusBadge status={c.status} />
                </td>
                <td className="px-4 py-4">
                  <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
