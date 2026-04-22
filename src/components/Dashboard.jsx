import { useState } from 'react'
import { Tag, Plus, Calendar } from 'lucide-react'

const timeFilters = ['This week', 'Last week', 'This month', 'Last 6 months']
import StatCard from './StatCard'
import RevenueChart from './RevenueChart'
import ActionItems from './ActionItems'
import ProductsTab from './ProductsTab'
import CampaignsTab from './CampaignsTab'
import CampaignDetail from './CampaignDetail'

const tabs = ['Overview', 'Products', 'Campaigns']

const stats = [
  { label: 'Total Revenue', value: '$722K', change: '+18.2% WoW', color: 'green' },
  { label: 'Active Campaigns', value: '42', change: '+12.0% WoW', color: 'blue' },
  { label: 'Avg Margin', value: '30.3%', change: '+2.4% WoW', color: 'amber' },
  { label: 'Products Tracked', value: '1,247', change: '+5.6% WoW', color: 'slate' },
]

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('Overview')
  const [timeFilter, setTimeFilter] = useState('This week')
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState(null)

  if (selectedCampaign) {
    return <CampaignDetail campaign={selectedCampaign} onBack={() => setSelectedCampaign(null)} />
  }

  return (
    <div className="p-6 min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl border-2 border-green-300 bg-green-50 flex items-center justify-center shrink-0">
            <Tag className="w-5 h-5 text-green-700" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Markdown</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Create effective pricing campaigns to help you maximize profit and reduce manual
              decision making
            </p>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-[#2a44d4] hover:bg-[#2438b8] text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-colors shrink-0">
          Create campaign
          <Plus size={15} />
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-5">
        <div className="flex gap-7">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'text-[#2a44d4] border-b-2 border-[#2a44d4]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'Overview' && (
        <>
          {/* Time filters */}
          <div className="flex items-center justify-end gap-1.5 mb-4">
            {/* Custom date button */}
            <div className="relative">
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                  showDatePicker
                    ? 'bg-[#2a44d4] text-white border-[#2a44d4]'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Calendar size={12} />
                Custom date
              </button>
              {showDatePicker && (
                <div className="absolute right-0 top-9 z-10 bg-white border border-gray-200 rounded-xl shadow-lg p-4 w-64">
                  <p className="text-xs font-medium text-gray-700 mb-3">Select date range</p>
                  <div className="flex flex-col gap-2">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">From</label>
                      <input type="date" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-[#2a44d4]" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">To</label>
                      <input type="date" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-[#2a44d4]" />
                    </div>
                    <button
                      onClick={() => { setTimeFilter('Custom date'); setShowDatePicker(false) }}
                      className="mt-1 w-full bg-[#2a44d4] text-white text-xs font-medium py-1.5 rounded-lg hover:bg-[#2438b8] transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Preset filters */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
              {timeFilters.map((f) => (
                <button
                  key={f}
                  onClick={() => { setTimeFilter(f); setShowDatePicker(false) }}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                    timeFilter === f && !showDatePicker
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-4 gap-4 mb-5">
            {stats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>

          {/* Main 2-col layout */}
          <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 360px' }}>
            <RevenueChart />
            <ActionItems />
          </div>
        </>
      )}

      {activeTab === 'Products' && <ProductsTab />}

      {activeTab === 'Campaigns' && <CampaignsTab onSelectCampaign={setSelectedCampaign} />}
    </div>
  )
}
