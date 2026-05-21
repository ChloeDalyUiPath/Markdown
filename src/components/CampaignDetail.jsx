import { useState, useRef, useEffect } from 'react'
import {
  ArrowLeft,
  ChevronDown,
  MoreHorizontal,
  Plus,
  Target,
  Megaphone,
  Zap,
  X,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Sparkles,
  CalendarDays,
  Copy,
  Archive,
  Save,
} from 'lucide-react'
import CampaignOverviewTab from './campaign-tabs/CampaignOverviewTab'
import CampaignProductsTab, { UploadProductsModal } from './campaign-tabs/CampaignProductsTab'
import CampaignScenarioTab from './campaign-tabs/CampaignScenarioTab'
import CampaignScenarioTabRL from './campaign-tabs/CampaignScenarioTabRL'
import CampaignSettingsTab from './campaign-tabs/CampaignSettingsTab'
import CreateCampaignModal from './CreateCampaignModal'
import CreateHitModal from './CreateHitModal'
import { DEFAULT_CATEGORY_SELECTIONS } from '../data/rlStrategies'

const INITIAL_TIMELINE_HITS = [
  { id: 1, label: 'Hit 1', pct: 24, status: 'Completed', date: '12/02' },
  { id: 2, label: 'Hit 2', pct: 50, status: 'Live',      date: '19/02' },
  { id: 3, label: 'Hit 3', pct: 76, status: 'Planned',   date: '28/02' },
]

const INITIAL_CAMPAIGN_HITS = [
  { id: 3, name: 'Hit 3: Final clearance', discount: '45% Discount', categories: '12 Categories', status: 'Draft', recommended: true, sellThrough: null, revenue: null, units: '— / 45 target', perDay: '—' },
  { id: 2, name: 'Hit 2: Extra 20% off slow movers', discount: '20% Discount', categories: '4 Categories', status: 'Live', alert: '51 units needed to hit target', daysLeft: '3d left', sellThrough: '66%', revenue: '£1.5K+', units: '125 / 176 units sold', perDay: '£1.3K /day' },
  { id: 1, name: 'Hit 1: Initial 5% discount', discount: '5% off', categories: '10 Categories', status: 'Completed', missedTarget: 'Missed target by 5%', sellThrough: '78%', revenue: '£2.5K+', units: '34 / 45 units sold', perDay: '£1.3K /day' },
]

const MULTI_HIT_TIMELINE_HITS = [
  { id: 1, label: 'Hit 1', pct: 18, status: 'Completed', date: '06/02',
    children: [
      { id: '1a', label: 'Hit 1a', pct: 11, status: 'Completed', date: '02/02' },
      { id: '1b', label: 'Hit 1b', pct: 16, status: 'Completed', date: '05/02' },
    ]
  },
  { id: 2, label: 'Hit 2', pct: 42, status: 'Live', date: '16/02',
    children: [
      { id: '2a', label: 'Hit 2a', pct: 34, status: 'Completed', date: '12/02' },
      { id: '2b', label: 'Hit 2b', pct: 50, status: 'Live',      date: '20/02' },
    ]
  },
  { id: 3, label: 'Hit 3', pct: 64, status: 'Draft', date: '28/02' },
  { id: 4, label: 'Hit 4', pct: 64, status: 'Draft', date: '28/02' },
  { id: 5, label: 'Hit 5', pct: 82, status: 'Draft', date: '08/03' },
]

const MULTI_HIT_CAMPAIGN_HITS = [
  { id: 5, name: 'Hit 5: Weekend flash event',       discount: '40% Discount', categories: '8 Categories',  status: 'Draft',     recommended: true,  sellThrough: null, revenue: null, units: '— / 80 target' },
  { id: 4, name: 'Hit 4: Last-chance size runs',     discount: '35% Discount', categories: '6 Categories',  status: 'Draft',     recommended: false, sellThrough: null, revenue: null, units: '— / 60 target' },
  { id: 3, name: 'Hit 3: Final clearance push',      discount: '45% Discount', categories: '12 Categories', status: 'Draft',     recommended: true,  sellThrough: null, revenue: null, units: '— / 45 target' },
  { id: 2, name: 'Hit 2: Extra 20% off slow movers', discount: '20% Discount', categories: '4 Categories',  status: 'Live',      alert: '51 units needed to hit target', daysLeft: '3d left', sellThrough: '66%', revenue: '£1.5K+', units: '125 / 176 units sold' },
  { id: 1, name: 'Hit 1: Initial 5% discount',       discount: '5% off',       categories: '10 Categories', status: 'Completed', missedTarget: 'Missed target by 5%', sellThrough: '78%', revenue: '£2.5K+', units: '34 / 45 units sold' },
]

const END_TIMELINE_HITS = [
  { id: 1, label: 'Hit 1', pct: 30, status: 'Completed', date: '14/03' },
  { id: 2, label: 'Hit 2', pct: 60, status: 'Live',      date: '22/03' },
]

const END_CAMPAIGN_HITS = [
  {
    id: 2,
    name: 'Hit 2: Extra 25% off outerwear + footwear',
    discount: '25% Discount', categories: '4 Categories', status: 'Live',
    recommended: true, alert: '£94K stock at cost still exposed', daysLeft: '8d left',
    sellThrough: '58%', revenue: '£18.2K', margin: '29%',
    stockAtCost: '£620K remaining', units: '2,840 / 4,890 units',
    brands: [
      { name: 'Stone Island', sellThrough: 48, stockQuality: 'limited',    skus: 12, note: '6 SKUs with broken size runs — limited markdown impact' },
      { name: 'Nike',         sellThrough: 74, stockQuality: 'full',       skus: 28, note: null },
      { name: 'New Balance',  sellThrough: 66, stockQuality: 'good',       skus: 16, note: null },
      { name: 'Carhartt',     sellThrough: 38, stockQuality: 'fragmented', skus: 8,  note: 'XS / XL only — deep markdown unlikely to clear' },
    ],
  },
  {
    id: 1,
    name: 'Hit 1: Initial 15% across all categories',
    discount: '15% Discount', categories: '7 Categories', status: 'Completed',
    recommended: false, missedTarget: 'Missed sell-through target by 18pp',
    sellThrough: '68%', revenue: '£168K', margin: '36%',
    stockAtCost: '£220K cleared', units: '8,200 / 11,400 units',
    brands: [
      { name: 'Stone Island', sellThrough: 52, stockQuality: 'limited',    skus: 12, note: '8 SKUs with broken size runs' },
      { name: 'Nike',         sellThrough: 82, stockQuality: 'full',       skus: 28, note: null },
      { name: 'New Balance',  sellThrough: 76, stockQuality: 'good',       skus: 16, note: null },
      { name: 'Carhartt',     sellThrough: 44, stockQuality: 'fragmented', skus: 8,  note: 'Carry-over risk — only XS / XL remain' },
      { name: 'adidas',       sellThrough: 72, stockQuality: 'full',       skus: 22, note: null },
    ],
  },
]

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

function UnsavedChangesModal({ targetTab, onSaveAndSwitch, onDiscardAndSwitch, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <h2 className="text-base font-bold text-gray-900 mb-1.5">Unsaved changes</h2>
        <p className="text-sm text-gray-500 mb-5">
          You have unsaved changes on this tab. What would you like to do before switching to <strong>{targetTab}</strong>?
        </p>
        <div className="flex flex-col gap-2">
          <button
            onClick={onSaveAndSwitch}
            className="w-full flex items-center justify-center gap-2 bg-[#2a44d4] hover:bg-[#2438b8] text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          >
            <Save size={14} /> Save changes &amp; switch
          </button>
          <button
            onClick={onDiscardAndSwitch}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Discard changes &amp; switch
          </button>
          <button
            onClick={onCancel}
            className="w-full px-4 py-2.5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

function HeaderActions({ status, onCreateHit, onSave, onAddProducts }) {
  if (status === 'Draft' || status === 'Pre-optimisation') return (
    <div className="flex items-center gap-2">
      <button
        onClick={onAddProducts}
        className="flex items-center gap-1.5 border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
      >
        <Plus size={14} />
        Add products
      </button>
      <button className="flex items-center gap-1.5 bg-[#2a44d4] hover:bg-[#2438b8] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
        <Sparkles size={14} />
        Optimise campaign
      </button>
    </div>
  )
  if (status === 'Optimised') return (
    <div className="flex items-center gap-2">
      <button onClick={onSave} className="flex items-center gap-1.5 border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
        <Save size={14} />
        Save campaign updates
      </button>
      <button className="flex items-center gap-1.5 bg-[#2a44d4] hover:bg-[#2438b8] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
        <Zap size={14} />
        Go Live
      </button>
    </div>
  )
  if (status === 'Live') return (
    <button onClick={onCreateHit} className="flex items-center gap-1.5 bg-[#2a44d4] hover:bg-[#2438b8] text-white px-3.5 py-2 rounded-lg text-sm font-medium transition-colors">
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
  const [savedScenario, setSavedScenario] = useState(null)
  const [rlCategorySelections, setRlCategorySelections] = useState(DEFAULT_CATEGORY_SELECTIONS)
  const [rlLockedCats, setRlLockedCats]                 = useState([])
  const [showMenu, setShowMenu] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showCreateHitModal, setShowCreateHitModal] = useState(false)
  const zeroHitsLive = campaign.status === 'Live' && !campaign.isMultiBrand && campaign.campaignHits === 0
  const isMultiHit   = campaign.id === 6
  const [timelineHits, setTimelineHits] = useState(
    campaign.isMultiBrand ? END_TIMELINE_HITS :
    isMultiHit            ? MULTI_HIT_TIMELINE_HITS :
    zeroHitsLive          ? [] :
    INITIAL_TIMELINE_HITS
  )
  const [campaignHitsData, setCampaignHitsData] = useState(
    campaign.isMultiBrand ? END_CAMPAIGN_HITS :
    isMultiHit            ? MULTI_HIT_CAMPAIGN_HITS :
    zeroHitsLive          ? [] :
    INITIAL_CAMPAIGN_HITS
  )
  const [isDirty, setIsDirty] = useState(false)
  const [showAddProductsModal, setShowAddProductsModal] = useState(false)
  const [pendingTab, setPendingTab] = useState(null)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [saveFlash, setSaveFlash] = useState(false)
  const menuRef = useRef(null)

  function handleTabClick(tab) {
    if (isDirty && tab !== activeTab) {
      setPendingTab(tab)
      setShowSaveModal(true)
    } else {
      setActiveTab(tab)
      if (tab !== 'Products & Categories') setProductFilter(null)
    }
  }

  function handleSave() {
    setIsDirty(false)
    setSaveFlash(true)
    setTimeout(() => setSaveFlash(false), 2000)
  }

  function handleSaveAndSwitch() {
    handleSave()
    setShowSaveModal(false)
    setActiveTab(pendingTab)
    if (pendingTab !== 'Products & Categories') setProductFilter(null)
    setPendingTab(null)
  }

  function handleDiscardAndSwitch() {
    setIsDirty(false)
    setShowSaveModal(false)
    setActiveTab(pendingTab)
    if (pendingTab !== 'Products & Categories') setProductFilter(null)
    setPendingTab(null)
  }

  function handleCreateHit(newHit) {
    const lastHit = timelineHits[timelineHits.length - 1]
    const nextPct = Math.min(92, (lastHit ? lastHit.pct : 0) + 15)
    setTimelineHits(prev => [...prev, { id: newHit.id, label: newHit.label, pct: nextPct, status: newHit.status, date: '07/03' }])
    setCampaignHitsData(prev => [{
      id: newHit.id,
      name: newHit.name,
      discount: newHit.discount,
      categories: newHit.categories,
      status: newHit.status,
      recommended: newHit.recommended,
      sellThrough: null,
      revenue: null,
      units: '— / — target',
      perDay: '—',
    }, ...prev])
  }

  function handleDeleteHit(hitId) {
    setTimelineHits(prev => prev.filter(h => h.id !== hitId))
    setCampaignHitsData(prev => prev.filter(h => h.id !== hitId))
  }

  useEffect(() => {
    if (!showMenu) return
    function handler(e) { if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showMenu])

  const status = campaign.status
  const isLive = status === 'Live'
  const showWarning = isLive && !warningDismissed

  function navigateToProducts(filter = null) {
    setProductFilter(filter)
    setActiveTab('Products & Categories')
  }

  function navigateToCategory(categoryName) {
    setProductFilter({ type: 'category', name: categoryName })
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
              {campaign.type === 'Promo' ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
                  <Megaphone size={11} />
                  Promo
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-violet-600 bg-violet-50 border border-violet-100 px-2 py-0.5 rounded-full">
                  <Target size={11} />
                  Markdown
                </span>
              )}
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
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(v => !v)}
              className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <MoreHorizontal size={15} className="text-gray-600" />
            </button>
            {showMenu && (
              <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-30 overflow-hidden w-48">
                <button
                  onClick={() => { setShowMenu(false); setShowCreateModal(true) }}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5"
                >
                  <Plus size={13} className="text-gray-400" />
                  Create campaign
                </button>
                <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5">
                  <Copy size={13} className="text-gray-400" />
                  Duplicate
                </button>
                <div className="border-t border-gray-100" />
                <button className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2.5">
                  <Archive size={13} />
                  Archive
                </button>
              </div>
            )}
          </div>
          <HeaderActions status={status} onCreateHit={() => setShowCreateHitModal(true)} onSave={handleSave} onAddProducts={() => setShowAddProductsModal(true)} />
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
              onClick={() => handleTabClick(tab)}
              className={`pb-3 text-sm font-medium transition-colors whitespace-nowrap relative ${
                activeTab === tab
                  ? 'text-[#2a44d4] border-b-2 border-[#2a44d4]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
              {isDirty && tab === activeTab && (
                <span className="absolute -top-0.5 -right-2.5 w-1.5 h-1.5 rounded-full bg-amber-400" />
              )}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'Overview' && (
        <CampaignOverviewTab
          status={status}
          campaignName={campaign.name}
          campaignType={campaign.type}
          onNavigateToProducts={navigateToProducts}
          onNavigateToTab={tab => setActiveTab(tab)}
          onNavigateToCategory={navigateToCategory}
          onCreateHit={() => setShowCreateHitModal(true)}
          onDeleteHit={handleDeleteHit}
          timelineHits={timelineHits}
          campaignHitsData={campaignHitsData}
          isMultiBrand={campaign.isMultiBrand}
        />
      )}
      {activeTab === 'Products & Categories' && (
        <CampaignProductsTab
          status={status}
          initialFilter={productFilter}
          savedScenario={savedScenario}
          onClearSavedScenario={() => setSavedScenario(null)}
          isRL={campaign.isRL === true}
          rlLockedCats={campaign.isRL === true ? rlLockedCats : undefined}
          rlCategorySelections={campaign.isRL === true ? rlCategorySelections : undefined}
          onCreateHit={handleCreateHit}
          existingHitsCount={campaignHitsData.length}
          onDirty={setIsDirty}
          isMultiBrand={campaign.isMultiBrand === true}
        />
      )}
      {activeTab === 'Scenario planning' && (
        campaign.isRL === true
          ? <CampaignScenarioTabRL
              status={status}
              categorySelections={rlCategorySelections}
              onSelectionsChange={sel => { setRlCategorySelections(sel); setIsDirty(true) }}
              lockedCats={rlLockedCats}
              onLockedCatsChange={setRlLockedCats}
              onScenarioSaved={s => setSavedScenario(s)}
            />
          : <CampaignScenarioTab status={status} onScenarioSaved={s => { setSavedScenario(s); setIsDirty(false) }} />
      )}
      {activeTab === 'Settings' && <CampaignSettingsTab campaign={campaign} status={status} onDirty={setIsDirty} />}

      {showAddProductsModal && (
        <UploadProductsModal
          existingCount={325302}
          onClose={() => setShowAddProductsModal(false)}
          onAdd={() => setShowAddProductsModal(false)}
        />
      )}
      {showCreateModal && (
        <CreateCampaignModal onClose={() => setShowCreateModal(false)} onCreated={() => setShowCreateModal(false)} />
      )}
      {showCreateHitModal && (
        <CreateHitModal
          onClose={() => setShowCreateHitModal(false)}
          onCreateHit={handleCreateHit}
          existingHitsCount={campaignHitsData.length}
        />
      )}
      {showSaveModal && (
        <UnsavedChangesModal
          targetTab={pendingTab}
          onSaveAndSwitch={handleSaveAndSwitch}
          onDiscardAndSwitch={handleDiscardAndSwitch}
          onCancel={() => { setShowSaveModal(false); setPendingTab(null) }}
        />
      )}
      {saveFlash && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-2xl text-sm font-medium animate-fade-in">
          <CheckCircle2 size={15} className="text-green-400" />
          Campaign updates saved
        </div>
      )}
    </div>
  )
}
