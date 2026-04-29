import { useState, useRef, useEffect } from 'react'
import { Tag, Plus, Calendar, Settings, Pencil, Check, Eye, EyeOff, ArrowUpRight } from 'lucide-react'

const timeFilters = ['This week', 'Last week', 'This month', 'Last 6 months']

import StatCard from './StatCard'
import RevenueChart from './RevenueChart'
import ActionItems from './ActionItems'
import ProductsTab from './ProductsTab'
import CampaignsTab from './CampaignsTab'
import CampaignDetail from './CampaignDetail'
import CampaignCompare from './CampaignCompare'
import CreateCampaignModal from './CreateCampaignModal'

const ALL_TABS = ['Overview', 'Products', 'Campaigns']

const ALL_KPIS = [
  { key: 'revenue',   label: 'Total Revenue',    value: '$722K', change: '+18.2% WoW', color: 'green' },
  { key: 'campaigns', label: 'Active Campaigns', value: '42',    change: '+12.0% WoW', color: 'blue' },
  { key: 'margin',    label: 'Avg Margin',       value: '30.3%', change: '+2.4% WoW',  color: 'amber' },
  { key: 'products',  label: 'Products Tracked', value: '1,247', change: '+5.6% WoW',  color: 'slate' },
  { key: 'sellThru',  label: 'Sell-Through',     value: '65%',   change: '-3.0% WoW',  negative: true, color: 'green' },
  { key: 'orders',    label: 'Total Orders',     value: '8,241', change: '+9.1% WoW',  color: 'blue' },
  { key: 'avgMD',     label: 'Avg Markdown',     value: '24%',   change: '+1.2% WoW',  color: 'amber' },
]

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('Overview')
  const [timeFilter, setTimeFilter] = useState('This week')
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState(null)
  const [compareCampaigns, setCompareCampaigns] = useState(null)
  const [showCreate, setShowCreate] = useState(false)

  const [hiddenTabs, setHiddenTabs] = useState(new Set())
  const [showTabSettings, setShowTabSettings] = useState(false)
  const [visibleKpis, setVisibleKpis] = useState(new Set(['revenue', 'campaigns', 'margin', 'products']))
  const [showKpiPanel, setShowKpiPanel] = useState(false)

  const tabSettingsRef = useRef(null)
  const kpiPanelRef = useRef(null)

  const visibleTabs = ALL_TABS.filter(t => !hiddenTabs.has(t))

  useEffect(() => {
    if (hiddenTabs.has(activeTab) && visibleTabs.length > 0) setActiveTab(visibleTabs[0])
  }, [hiddenTabs])

  useEffect(() => {
    function handler(e) {
      if (tabSettingsRef.current && !tabSettingsRef.current.contains(e.target)) setShowTabSettings(false)
      if (kpiPanelRef.current && !kpiPanelRef.current.contains(e.target)) setShowKpiPanel(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function toggleTab(tab) {
    setHiddenTabs(prev => {
      const next = new Set(prev)
      if (next.has(tab)) next.delete(tab)
      else next.add(tab)
      return next
    })
  }

  function toggleKpi(key) {
    setVisibleKpis(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const kpiCards = ALL_KPIS.filter(k => visibleKpis.has(k.key))

  if (selectedCampaign) {
    return <CampaignDetail campaign={selectedCampaign} onBack={() => setSelectedCampaign(null)} />
  }

  if (compareCampaigns) {
    return <CampaignCompare campaigns={compareCampaigns} onBack={() => setCompareCampaigns(null)} />
  }

  return (
    <div className="p-6 min-w-0">
      {showCreate && <CreateCampaignModal onClose={() => setShowCreate(false)} />}

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
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('Campaigns')}
            className="flex items-center gap-2 border border-gray-200 text-gray-600 px-4 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors"
          >
            Compare campaigns
            <ArrowUpRight size={15} className="text-gray-400" />
          </button>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 bg-[#2a44d4] hover:bg-[#2438b8] text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-colors"
          >
            Create campaign
            <Plus size={15} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-5">
        <div className="flex items-end gap-7">
          {visibleTabs.map((tab) => (
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

          {/* Tab visibility settings */}
          <div className="ml-auto mb-1 relative" ref={tabSettingsRef}>
            <button
              onClick={() => setShowTabSettings(v => !v)}
              className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border transition-colors ${
                showTabSettings ? 'border-[#2a44d4] text-[#2a44d4] bg-indigo-50' : 'border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Settings size={13} />
              Tabs
            </button>
            {showTabSettings && (
              <div className="absolute top-full right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-lg z-20 w-44 overflow-hidden">
                <div className="px-3 py-2.5 border-b border-gray-100">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Show tabs</span>
                </div>
                {ALL_TABS.map(tab => {
                  const visible = !hiddenTabs.has(tab)
                  const isLast = visibleTabs.length === 1 && visible
                  return (
                    <button
                      key={tab}
                      onClick={() => !isLast && toggleTab(tab)}
                      disabled={isLast}
                      className={`w-full flex items-center justify-between px-3 py-2.5 text-sm transition-colors ${isLast ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-50'} ${visible ? 'text-gray-700' : 'text-gray-400'}`}
                    >
                      {tab}
                      {visible ? <Eye size={13} className="text-gray-400" /> : <EyeOff size={13} className="text-gray-300" />}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {activeTab === 'Overview' && (
        <>
          {/* Time filters */}
          <div className="flex items-center justify-end gap-1.5 mb-4">
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

          {/* KPI cards + customize */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Key metrics</span>
            <div className="relative" ref={kpiPanelRef}>
              <button
                onClick={() => setShowKpiPanel(v => !v)}
                className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border transition-colors ${
                  showKpiPanel ? 'border-[#2a44d4] text-[#2a44d4] bg-indigo-50' : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                }`}
              >
                <Pencil size={11} />
                Edit KPIs
              </button>
              {showKpiPanel && (
                <div className="absolute top-full right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-lg z-20 w-52 overflow-hidden">
                  <div className="px-3 py-2.5 border-b border-gray-100">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Available KPIs</span>
                  </div>
                  {ALL_KPIS.map(k => (
                    <button key={k.key} onClick={() => toggleKpi(k.key)}
                      className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                      {k.label}
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${visibleKpis.has(k.key) ? 'bg-[#2a44d4] border-[#2a44d4]' : 'border-gray-300'}`}>
                        {visibleKpis.has(k.key) && <Check size={9} className="text-white" />}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className={`grid gap-4 mb-5 ${kpiCards.length <= 4 ? 'grid-cols-4' : 'grid-cols-4'}`}>
            {kpiCards.map((stat) => (
              <StatCard key={stat.key} {...stat} />
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

      {activeTab === 'Campaigns' && (
        <CampaignsTab
          onSelectCampaign={setSelectedCampaign}
          onCompare={pair => setCompareCampaigns(pair)}
        />
      )}
    </div>
  )
}
