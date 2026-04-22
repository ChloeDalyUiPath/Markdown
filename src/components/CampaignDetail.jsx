import { useState } from 'react'
import {
  ArrowLeft,
  ChevronDown,
  MoreHorizontal,
  Plus,
  Target,
  Zap,
  X,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Sparkles,
  CalendarDays,
} from 'lucide-react'
import CampaignOverviewTab from './campaign-tabs/CampaignOverviewTab'
import CampaignProductsTab from './campaign-tabs/CampaignProductsTab'
import CampaignScenarioTab from './campaign-tabs/CampaignScenarioTab'
import CampaignSettingsTab from './campaign-tabs/CampaignSettingsTab'

const tabs = ['Overview', 'Products & Categories', 'Scenario planning', 'Settings']

const statusBadgeConfig = {
  Draft: { label: 'Draft', className: 'bg-gray-100 text-gray-600 border border-gray-200', icon: FileText },
  'Pre-optimisation': { label: 'Pre-optimisation', className: 'bg-blue-50 text-blue-600 border border-blue-200', icon: CalendarDays },
  Optimised: { label: 'Optimised', className: 'bg-violet-50 text-violet-700 border border-violet-200', icon: Sparkles },
  Live: { label: 'Live', className: 'bg-green-50 text-green-700 border border-green-200', icon: Zap, dot: true },
  Completed: { label: 'Completed', className: 'bg-green-50 text-green-700 border border-green-200', icon: CheckCircle2 },
}

function StatusBadge({ status }) {
  const cfg = statusBadgeConfig[status] || statusBadgeConfig['Draft']
  const Icon = cfg.icon
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${cfg.className}`}>
      <Icon size={11} />
      {cfg.label}
      {cfg.dot && <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />}
    </span>
  )
}

function HeaderActions({ status }) {
  if (status === 'Draft' || status === 'Pre-optimisation') return (
    <button className="flex items-center gap-1.5 bg-[#2a44d4] hover:bg-[#2438b8] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
      <Sparkles size={14} />
      Optimise campaign
    </button>
  )
  if (status === 'Optimised') return (
    <div className="flex items-center gap-2">
      <button className="flex items-center gap-1.5 border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
        Edit scenario
      </button>
      <button className="flex items-center gap-1.5 bg-[#2a44d4] hover:bg-[#2438b8] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
        <Zap size={14} />
        Go Live
      </button>
    </div>
  )
  if (status === 'Live') return (
    <button className="flex items-center gap-1.5 bg-[#2a44d4] hover:bg-[#2438b8] text-white px-3.5 py-2 rounded-lg text-sm font-medium transition-colors">
      <Plus size={14} />
      Create a hit
    </button>
  )
  if (status === 'Completed') return (
    <button className="flex items-center gap-1.5 border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
      View results
    </button>
  )
  return null
}

export default function CampaignDetail({ campaign, onBack }) {
  const [activeTab, setActiveTab] = useState('Overview')
  const [productFilter, setProductFilter] = useState(null)
  const [warningDismissed, setWarningDismissed] = useState(false)

  const status = campaign.status
  const isLive = status === 'Live'
  const showWarning = isLive && !warningDismissed

  function navigateToProducts(filter = null) {
    setProductFilter(filter)
    setActiveTab('Products & Categories')
  }

  return (
    <div className="p-6 min-w-0">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm mb-3">
        <button onClick={onBack} className="text-[#2a44d4] hover:underline font-medium">
          Pricing
        </button>
        <span className="text-gray-400">/</span>
        <span className="text-gray-500">{campaign.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shrink-0"
          >
            <ArrowLeft size={15} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{campaign.name}</h1>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <StatusBadge status={status} />
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-violet-600 bg-violet-50 border border-violet-100 px-2 py-0.5 rounded-full">
                <Target size={11} />
                Markdown
              </span>
              <span className="text-xs text-gray-400">{campaign.categories?.slice(0, 2).join(', ')}{campaign.extra ? ` +${campaign.extra}` : ''}</span>
              <span className="text-xs text-gray-400">{campaign.country}</span>
              <span className="text-xs text-gray-400">{campaign.dates}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isLive && (
            <>
              <button className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                All Time <ChevronDown size={14} />
              </button>
              <button className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                Custom Range
              </button>
            </>
          )}
          <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <MoreHorizontal size={15} className="text-gray-600" />
          </button>
          <HeaderActions status={status} />
        </div>
      </div>

      {/* Warning banner — live campaigns only */}
      {showWarning && (
        <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4">
          <div className="flex items-start gap-2.5">
            <AlertTriangle size={16} className="text-amber-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-amber-800">
                Below target: projected to miss sell-through target by 10%
              </p>
              <p className="text-xs text-amber-600 mt-0.5">
                Driven by Flats &amp; Heels — consider additional markdown.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-4">
            <button className="flex items-center gap-1.5 border border-amber-300 text-amber-700 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-amber-100 transition-colors">
              <Target size={11} />
              Apply recommended hit
            </button>
            <button onClick={() => setWarningDismissed(true)} className="text-amber-400 hover:text-amber-600 transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Pre-optimisation info banner */}
      {status === 'Pre-optimisation' && (
        <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-4">
          <CalendarDays size={16} className="text-blue-500 shrink-0" />
          <p className="text-sm text-blue-700">
            Products have been added. Click <strong>Optimise campaign</strong> to run AI price optimisation before going live.
          </p>
        </div>
      )}

      {/* Optimised info banner */}
      {status === 'Optimised' && (
        <div className="flex items-center gap-3 bg-violet-50 border border-violet-200 rounded-xl px-4 py-3 mb-4">
          <Sparkles size={16} className="text-violet-500 shrink-0" />
          <p className="text-sm text-violet-700">
            Campaign is optimised and ready. Review the scenario, adjust if needed, then click <strong>Go Live</strong> to activate.
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-5">
        <div className="flex gap-7">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); if (tab !== 'Products & Categories') setProductFilter(null) }}
              className={`pb-3 text-sm font-medium transition-colors whitespace-nowrap ${
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
        <CampaignOverviewTab
          status={status}
          onNavigateToProducts={navigateToProducts}
        />
      )}
      {activeTab === 'Products & Categories' && (
        <CampaignProductsTab status={status} initialFilter={productFilter} />
      )}
      {activeTab === 'Scenario planning' && <CampaignScenarioTab status={status} />}
      {activeTab === 'Settings' && <CampaignSettingsTab campaign={campaign} />}
    </div>
  )
}
