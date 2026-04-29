import { useState, useEffect, useRef } from 'react'
import {
  X, ArrowLeft, Check, Search, ChevronDown, ChevronUp, ChevronRight,
  Info, Megaphone, Tag, Percent, TrendingUp, Gift, Calendar, Pencil,
  SlidersHorizontal,
} from 'lucide-react'
import { MARKDOWN_RULES } from '../data/rlStrategies'

// ─── Static data ──────────────────────────────────────────────────────────────

const CAMPAIGN_TYPES = [
  { id: 'promotional', label: 'Promotional Campaign', description: 'Drive demand for new or core products through time-limited events', Icon: Megaphone },
  { id: 'markdown',    label: 'Markdown Campaign',    description: 'Clear aged stock and hit sell-through targets with AI-optimised depth', Icon: Tag },
]

const PROMO_STRATEGIES = [
  { id: 'flat',  Icon: Percent,    label: 'Flat X% off', description: 'Apply a consistent percentage discount across all selected products' },
  { id: 'upTo',  Icon: TrendingUp, label: 'Up to X%',    description: 'Variable discount tiers based on product value or category performance' },
  { id: '3for2', Icon: Gift,       label: '3 for 2',     description: 'Bundle promotion - customers get the lowest priced item free when buying 3' },
]

const CATEGORIES = [
  { id: 1, name: 'Electronics',            count: 1347  },
  { id: 2, name: 'Clothing & Apparel',     count: 3891  },
  { id: 3, name: 'Home & Garden',          count: 2158  },
  { id: 4, name: 'Sports & Outdoors',      count: 13234 },
  { id: 5, name: 'Beauty & Personal Care', count: 867   },
  { id: 6, name: 'Books & Media',          count: 524   },
]

const LOCATIONS = ['Spain', 'France', 'Germany', 'Italy', 'United Kingdom']

const MESSAGING_OPTS = ['Up to 20% off', 'Up to 30% off', 'Up to 40% off', 'Up to 50% off']

const MARKDOWN_STEPS = {
  1: { title: 'Create a Campaign',     subtitle: 'Provide details of your campaign.' },
  2: { title: 'Select Categories',     subtitle: 'Choose the categories to include.' },
  3: { title: 'Configure Guardrails',  subtitle: 'Optional — set floor constraints to protect margin.' },
  4: { title: 'Select Guardrail Sets', subtitle: 'Pick two clearance scenarios to compare.' },
  5: { title: 'Review & Create Draft', subtitle: 'Check everything before saving.' },
}
const PROMO_STEPS = {
  1: { title: 'Create a Campaign',         subtitle: 'Provide details of your campaign.' },
  2: { title: 'Select Categories',         subtitle: 'Choose the categories to include.' },
  3: { title: 'Promotional Objectives',    subtitle: 'Set what you\'re trying to achieve and how aggressively.' },
  4: { title: 'Review & Create Draft',     subtitle: 'Check everything before saving.' },
}

// ─── Shared primitives ────────────────────────────────────────────────────────

function ProgressBar({ step, total }) {
  const pct = Math.round((step / total) * 100)
  return (
    <div>
      <div className="flex justify-between text-xs text-gray-400 mb-1.5">
        <span>Step {step} of {total}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1 bg-gray-100 rounded-full">
        <div className="h-full bg-[#2a44d4] rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function InlineStepper({ value, onChange, min = 0, max = 100, step = 5 }) {
  return (
    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
      <span className="flex-1 px-3 py-2.5 text-sm text-gray-700">{value}</span>
      <button onClick={() => onChange(Math.max(min, value - step))} className="px-3.5 py-2.5 hover:bg-gray-100 text-gray-500 border-l border-gray-200 text-base leading-none select-none">−</button>
      <button onClick={() => onChange(Math.min(max, value + step))} className="px-3.5 py-2.5 hover:bg-gray-100 text-gray-500 border-l border-gray-200 text-base leading-none select-none">+</button>
    </div>
  )
}

function Label({ children, optional, info }) {
  return (
    <div className="flex items-center gap-1 text-xs font-medium text-gray-600 mb-1.5">
      {children}
      {optional && <span className="font-normal text-gray-400">(optional)</span>}
      {info && <Info size={11} className="text-gray-400" />}
    </div>
  )
}

function Input({ value, onChange, placeholder, icon: Icon }) {
  return (
    <div className="relative">
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#2a44d4] focus:ring-1 focus:ring-[#2a44d4]"
      />
      {Icon && <Icon size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />}
    </div>
  )
}

function Stepper({ value, onChange }) {
  const n = parseInt(value) || 0
  return (
    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
      <span className="flex-1 px-3 py-2.5 text-sm text-gray-700">
        {value !== '' ? `${value}%` : <span className="text-gray-400">—</span>}
      </span>
      <div className="flex flex-col border-l border-gray-200">
        <button onClick={() => onChange(String(Math.min(100, n + 5)))} className="px-2.5 py-1 hover:bg-gray-50 text-gray-400 border-b border-gray-200">
          <ChevronUp size={10} />
        </button>
        <button onClick={() => onChange(String(Math.max(0, n - 5)))} className="px-2.5 py-1 hover:bg-gray-50 text-gray-400">
          <ChevronDown size={10} />
        </button>
      </div>
    </div>
  )
}

function Toggle({ value, onChange }) {
  return (
    <button onClick={() => onChange(!value)} className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 ${value ? 'bg-[#2a44d4]' : 'bg-gray-200'}`}>
      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-4' : 'translate-x-0.5'}`} />
    </button>
  )
}

function Checkbox({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${checked ? 'bg-[#2a44d4] border-[#2a44d4]' : 'border-gray-300 hover:border-gray-400'}`}
    >
      {checked && <Check size={10} className="text-white" />}
    </button>
  )
}

function Dropdown({ value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    if (!open) return
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])
  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2.5 text-sm hover:border-gray-300"
      >
        <span className={value ? 'text-gray-700' : 'text-gray-400'}>{value || placeholder}</span>
        <ChevronDown size={14} className="text-gray-400 flex-shrink-0" />
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden">
          {options.map(opt => (
            <button key={opt} onClick={() => { onChange(opt); setOpen(false) }}
              className={`w-full text-left px-3 py-2.5 text-sm hover:bg-gray-50 flex items-center justify-between ${value === opt ? 'text-[#2a44d4] font-medium' : 'text-gray-700'}`}>
              {opt}
              {value === opt && <Check size={13} className="text-[#2a44d4]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function MultiSelect({ values, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    if (!open) return
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])
  function toggle(opt) {
    onChange(values.includes(opt) ? values.filter(v => v !== opt) : [...values, opt])
  }
  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2.5 text-sm hover:border-gray-300"
      >
        <span className={values.length === 0 ? 'text-gray-400' : 'text-gray-700'}>
          {values.length === 0 ? placeholder : values.join(', ')}
        </span>
        <ChevronDown size={14} className="text-gray-400 flex-shrink-0" />
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden">
          {options.map(opt => (
            <button key={opt} onClick={() => toggle(opt)}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-gray-50 text-left">
              <Checkbox checked={values.includes(opt)} onChange={() => toggle(opt)} />
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Step 1 ───────────────────────────────────────────────────────────────────

function Step1({ form, setForm }) {
  const [showOptional, setShowOptional] = useState(false)

  return (
    <div className="px-6 py-5 space-y-5 overflow-y-auto" style={{ maxHeight: '62vh' }}>

      {/* Campaign type */}
      <div>
        <Label>Select One</Label>
        <div className="grid grid-cols-2 gap-3">
          {CAMPAIGN_TYPES.map(t => {
            const sel = form.type === t.id
            return (
              <button key={t.id} onClick={() => setForm(f => ({ ...f, type: t.id, promoStrategy: null }))}
                className={`relative text-left border-2 rounded-xl p-4 transition-all ${sel ? 'border-[#2a44d4] bg-indigo-50/60' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                {sel && (
                  <span className="absolute top-2.5 right-2.5 w-5 h-5 bg-[#2a44d4] rounded-full flex items-center justify-center">
                    <Check size={10} className="text-white" />
                  </span>
                )}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${sel ? 'bg-[#2a44d4]/10' : 'bg-gray-100'}`}>
                  <t.Icon size={18} className={sel ? 'text-[#2a44d4]' : 'text-gray-500'} />
                </div>
                <div className="text-sm font-semibold text-gray-900 mb-1">{t.label}</div>
                <div className="text-xs text-gray-400 leading-snug">{t.description}</div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Promo strategy — only when promotional */}
      {form.type === 'promotional' && (
        <div>
          <Label>Promo Strategy</Label>
          <div className="space-y-2">
            {PROMO_STRATEGIES.map(s => {
              const sel = form.promoStrategy === s.id
              return (
                <button key={s.id} onClick={() => setForm(f => ({ ...f, promoStrategy: s.id }))}
                  className={`w-full flex items-center gap-4 border rounded-xl p-4 text-left transition-all ${sel ? 'border-[#2a44d4] bg-indigo-50/60' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${sel ? 'bg-[#2a44d4]/10' : 'bg-gray-100'}`}>
                    <s.Icon size={17} className={sel ? 'text-[#2a44d4]' : 'text-gray-500'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-900">{s.label}</div>
                    <div className="text-xs text-gray-400 mt-0.5 leading-snug">{s.description}</div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${sel ? 'border-[#2a44d4]' : 'border-gray-300'}`}>
                    {sel && <div className="w-2.5 h-2.5 rounded-full bg-[#2a44d4]" />}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Name */}
      <div>
        <Label>Name</Label>
        <Input value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="Campaign name" />
      </div>

      {/* Locations */}
      <div>
        <Label>Locations</Label>
        <MultiSelect values={form.locations} onChange={v => setForm(f => ({ ...f, locations: v }))} options={LOCATIONS} placeholder="Select locations" />
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Start Date</Label>
          <Input value={form.startDate} onChange={v => setForm(f => ({ ...f, startDate: v }))} placeholder="Select a date" icon={Calendar} />
        </div>
        <div>
          <Label optional>End date</Label>
          <Input value={form.endDate} onChange={v => setForm(f => ({ ...f, endDate: v }))} placeholder="Select a date" icon={Calendar} />
        </div>
      </div>

      {/* Optional settings */}
      <div>
        <button onClick={() => setShowOptional(v => !v)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800">
          <div className="w-4 h-4 rounded border border-gray-300 flex items-center justify-center">
            {showOptional ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
          </div>
          Optional settings
        </button>
        {showOptional && (
          <div className="mt-3 space-y-3 pl-1">
            {[
              { key: 'suggestedOnly', label: 'Include suggested products only' },
              { key: 'advancedRollUp', label: 'Advanced roll up' },
              { key: 'rollingMarkdown', label: 'Rolling Markdown' },
            ].map(opt => (
              <label key={opt.key} className="flex items-center gap-3 cursor-pointer">
                <Checkbox
                  checked={form.optionalSettings[opt.key]}
                  onChange={v => setForm(f => ({ ...f, optionalSettings: { ...f.optionalSettings, [opt.key]: v } }))}
                />
                <span className="text-sm text-gray-700">{opt.label}</span>
                <Info size={12} className="text-gray-400" />
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Step 2 ───────────────────────────────────────────────────────────────────

function Step2({ form, setForm }) {
  const [search, setSearch] = useState('')
  const filtered = CATEGORIES.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))

  function toggle(id) {
    setForm(f => ({
      ...f,
      selectedCategories: f.selectedCategories.includes(id)
        ? f.selectedCategories.filter(c => c !== id)
        : [...f.selectedCategories, id],
    }))
  }

  return (
    <div className="px-6 py-5 overflow-y-auto" style={{ maxHeight: '62vh' }}>
      {/* Toolbar */}
      <div className="flex items-center gap-2 mb-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search categories..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg placeholder-gray-400 focus:outline-none focus:border-[#2a44d4] focus:ring-1 focus:ring-[#2a44d4]" />
        </div>
        <button className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 whitespace-nowrap">
          <SlidersHorizontal size={12} /> Filter
        </button>
        <button className="flex items-center gap-1 border border-gray-200 rounded-lg px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 whitespace-nowrap">
          Bulk Actions <ChevronDown size={12} />
        </button>
      </div>

      {/* Selection count */}
      {form.selectedCategories.length > 0 && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-[#2a44d4]">{form.selectedCategories.length} categories selected</span>
          <button onClick={() => setForm(f => ({ ...f, selectedCategories: [] }))} className="text-xs text-gray-400 hover:text-gray-600">Clear all</button>
        </div>
      )}

      {/* List */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        {filtered.map((cat, i) => {
          const sel = form.selectedCategories.includes(cat.id)
          return (
            <button key={cat.id} onClick={() => toggle(cat.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors ${i > 0 ? 'border-t border-gray-100' : ''} ${sel ? 'bg-indigo-50/70' : 'hover:bg-gray-50'}`}>
              <Checkbox checked={sel} onChange={() => toggle(cat.id)} />
              <div>
                <div className="text-sm font-medium text-gray-900">{cat.name}</div>
                <div className="text-xs text-gray-400">{cat.count.toLocaleString()} products</div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Step 3 — Promo Objectives ────────────────────────────────────────────────

const OPTIMIZATION_TARGETS = [
  { id: 'revenue',  label: 'Revenue Lift',    description: 'Maximise incremental revenue driven by this campaign' },
  { id: 'volume',   label: 'Volume',          description: 'Drive as many units sold as possible' },
  { id: 'aov',      label: 'Avg Order Value', description: 'Encourage customers to buy more per order' },
  { id: 'newcust',  label: 'New Customers',   description: 'Prioritise attracting customers who haven\'t bought before' },
]

function Step3Promo({ form, setForm }) {
  const p = form.promoObjectives
  function setP(key, val) { setForm(f => ({ ...f, promoObjectives: { ...f.promoObjectives, [key]: val } })) }

  return (
    <div className="px-6 py-5 space-y-5 overflow-y-auto" style={{ maxHeight: '62vh' }}>
      {/* Optimization target */}
      <div>
        <Label>Optimization Target</Label>
        <div className="space-y-2">
          {OPTIMIZATION_TARGETS.map(t => {
            const sel = p.target === t.id
            return (
              <button
                key={t.id}
                onClick={() => setP('target', t.id)}
                className={`w-full flex items-center gap-3 border rounded-xl px-4 py-3 text-left transition-all ${sel ? 'border-[#2a44d4] bg-indigo-50/60' : 'border-gray-200 hover:border-gray-300 bg-white'}`}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${sel ? 'border-[#2a44d4]' : 'border-gray-300'}`}>
                  {sel && <div className="w-2 h-2 rounded-full bg-[#2a44d4]" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-900">{t.label}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{t.description}</div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Targets */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label info>Revenue Lift Target</Label>
          <InlineStepper value={p.revenueLiftTarget} onChange={v => setP('revenueLiftTarget', v)} min={0} max={50} step={5} />
        </div>
        <div>
          <Label>Max Discount Depth</Label>
          <InlineStepper value={p.maxDiscountDepth} onChange={v => setP('maxDiscountDepth', v)} min={0} max={60} step={5} />
        </div>
      </div>

      {/* Price floor */}
      <div>
        <Label optional info>Price Floor</Label>
        <Input
          value={p.priceFloor}
          onChange={v => setP('priceFloor', v)}
          placeholder="e.g. £15 — items won't be promoted below this price"
        />
      </div>

      {/* Messaging */}
      <div>
        <Label optional>Promotional Messaging</Label>
        <Dropdown
          value={p.messaging}
          onChange={v => setP('messaging', v)}
          options={MESSAGING_OPTS}
          placeholder="Select messaging banner…"
        />
      </div>
    </div>
  )
}

// ─── Step 3 — Guardrails ──────────────────────────────────────────────────────

function Step3({ form, setForm }) {
  const g = form.guardrails
  function setG(key, val) { setForm(f => ({ ...f, guardrails: { ...f.guardrails, [key]: val } })) }

  return (
    <div className="px-6 py-5 space-y-4 overflow-y-auto" style={{ maxHeight: '62vh' }}>
      {/* Min / Max markdown */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Min markdown %</Label>
          <Stepper value={g.minMarkdown} onChange={v => setG('minMarkdown', v)} />
        </div>
        <div>
          <Label>Max markdown %</Label>
          <Stepper value={g.maxMarkdown} onChange={v => setG('maxMarkdown', v)} />
        </div>
      </div>

      {/* Min gross margin */}
      <div>
        <Label>Min gross margin minimum target (€)</Label>
        <Input value={g.minGrossMargin} onChange={v => setG('minGrossMargin', v)} placeholder="e.g. $12,000" />
      </div>

      {/* Messaging discount + min % */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Messaging discount</Label>
          <Dropdown value={g.messagingDiscount} onChange={v => setG('messagingDiscount', v)} options={MESSAGING_OPTS} placeholder="Up to 40% off" />
        </div>
        <div>
          <Label info>Min % of products with discount messaging</Label>
          <Stepper value={g.minPctDiscountMessaging} onChange={v => setG('minPctDiscountMessaging', v)} />
        </div>
      </div>

      {/* Price bounds */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Price bounds lower</Label>
          <button className="w-full flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-400 hover:border-gray-300">
            Select one or multiple bounds <ChevronDown size={14} className="flex-shrink-0" />
          </button>
        </div>
        <div>
          <Label>Price bounds upper</Label>
          <button className="w-full flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-400 hover:border-gray-300">
            Select one or multiple bounds <ChevronDown size={14} className="flex-shrink-0" />
          </button>
        </div>
      </div>

      {/* Requires Approval */}
      <div className="flex items-start justify-between gap-4 pt-1 pb-1">
        <div>
          <div className="text-sm font-medium text-gray-900 mb-0.5">Requires Approval</div>
          <div className="text-xs text-gray-400">Manager approval needed before campaign goes live</div>
        </div>
        <Toggle value={g.requiresApproval} onChange={v => setG('requiresApproval', v)} />
      </div>
    </div>
  )
}

// ─── Step 4 — Strategies ─────────────────────────────────────────────────────

function Step4Strategies({ form, setForm }) {
  const [showDescriptions, setShowDescriptions] = useState(false)
  const rules = form.guardrailRules

  function setRule(i, key, val) {
    setForm(f => {
      const next = [...f.guardrailRules]
      next[i] = { ...next[i], [key]: val }
      return { ...f, guardrailRules: next }
    })
  }

  function showPct(stratId) { return ['pct-markdown', 'depth-coverage', 'layered'].includes(stratId) }
  function showDepth(stratId) { return ['depth-coverage', 'layered'].includes(stratId) }

  return (
    <div className="px-6 py-5 space-y-5 overflow-y-auto" style={{ maxHeight: '62vh' }}>
      {rules.map((rule, i) => (
        <div key={i} className="space-y-3">
          <Label>Guardrail Set {i === 0 ? 'A' : 'B'}</Label>
          <Dropdown
            value={rule.stratId ? (MARKDOWN_RULES.find(s => s.id === rule.stratId)?.label ?? '') : ''}
            onChange={v => setRule(i, 'stratId', MARKDOWN_RULES.find(s => s.label === v)?.id ?? '')}
            options={MARKDOWN_RULES.map(s => s.label)}
            placeholder="Select a markdown rule…"
          />
          {showPct(rule.stratId) && (
            <div className={`grid gap-4 ${showDepth(rule.stratId) ? 'grid-cols-2' : 'grid-cols-1'}`}>
              <div>
                <Label>Percentage to Markdown</Label>
                <InlineStepper value={rule.pctMarkdown} onChange={v => setRule(i, 'pctMarkdown', v)} />
              </div>
              {showDepth(rule.stratId) && (
                <div>
                  <Label>Required Markdown % Depth</Label>
                  <InlineStepper value={rule.depthPct} onChange={v => setRule(i, 'depthPct', v)} />
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <button
          onClick={() => setShowDescriptions(v => !v)}
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-amber-500 hover:bg-gray-50 transition-colors"
        >
          Rule Descriptions
          <ChevronDown size={14} className={`text-amber-400 transition-transform ${showDescriptions ? 'rotate-180' : ''}`} />
        </button>
        {showDescriptions && (
          <div className="px-4 pb-4 pt-3 space-y-3 border-t border-gray-100">
            {rules.some(r => r.stratId) ? (
              rules.map((rule, i) => {
                const strat = MARKDOWN_RULES.find(s => s.id === rule.stratId)
                return strat ? (
                  <div key={i}>
                    <div className="text-xs font-semibold text-gray-700 mb-0.5">Set {i === 0 ? 'A' : 'B'}: {strat.short}</div>
                    <div className="text-xs text-gray-400 leading-snug">{strat.description}</div>
                  </div>
                ) : null
              })
            ) : (
              <p className="text-xs text-gray-400">Select strategies above to see their descriptions.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Step 5 — Review ─────────────────────────────────────────────────────────

function Step5({ form, onEdit }) {
  const totalProducts = CATEGORIES
    .filter(c => form.selectedCategories.includes(c.id))
    .reduce((sum, c) => sum + c.count, 0)

  const g = form.guardrails
  const hasGuardrails = g.minMarkdown || g.maxMarkdown

  const locLabel = form.locations.length === 0 ? '—'
    : form.locations.length === 1 ? form.locations[0]
    : `${form.locations.length} locations`

  return (
    <div className="px-6 py-5 space-y-4 overflow-y-auto" style={{ maxHeight: '62vh' }}>
      {/* Campaign Overview */}
      <div className="border border-gray-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900">Campaign Overview</h3>
          <button onClick={() => onEdit(1)} className="text-gray-400 hover:text-gray-600 transition-colors">
            <Pencil size={14} />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-xs">
          {[
            { label: 'Campaign Name', value: form.name || '—' },
            { label: 'Type', value: form.type === 'markdown' ? 'Markdown' : form.type === 'promotional' ? 'Promotional' : '—' },
            { label: 'Dates', value: form.startDate ? `${form.startDate}${form.endDate ? ` – ${form.endDate}` : ''}` : '—' },
            { label: 'Locations', value: locLabel },
            { label: 'Categories', value: form.selectedCategories.length || '—' },
            { label: 'Total Products', value: totalProducts > 0 ? totalProducts.toLocaleString() : '—' },
          ].map(row => (
            <div key={row.label}>
              <div className="text-gray-400 mb-0.5">{row.label}</div>
              <div className="font-medium text-gray-900">{row.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Promotional Objectives — promo only */}
      {form.type === 'promotional' && (
        <div className="border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">Promotional Objectives</h3>
            <button onClick={() => onEdit(3)} className="text-gray-400 hover:text-gray-600 transition-colors">
              <Pencil size={14} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-xs">
            {[
              { label: 'Optimization Target', value: OPTIMIZATION_TARGETS.find(t => t.id === form.promoObjectives.target)?.label || '—' },
              { label: 'Revenue Lift Target', value: form.promoObjectives.revenueLiftTarget ? `${form.promoObjectives.revenueLiftTarget}%` : '—' },
              { label: 'Max Discount Depth', value: form.promoObjectives.maxDiscountDepth ? `${form.promoObjectives.maxDiscountDepth}%` : '—' },
              { label: 'Price Floor', value: form.promoObjectives.priceFloor || '—' },
              { label: 'Messaging', value: form.promoObjectives.messaging || '—' },
            ].map(row => (
              <div key={row.label}>
                <div className="text-gray-400 mb-0.5">{row.label}</div>
                <div className="font-medium text-gray-900">{row.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Applied Guardrails — markdown only */}
      {form.type !== 'promotional' && (
        <div className="border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">Applied Guardrails</h3>
            <button onClick={() => onEdit(3)} className="text-gray-400 hover:text-gray-600 transition-colors">
              <Pencil size={14} />
            </button>
          </div>
          {hasGuardrails ? (
            <>
              <div className="flex items-center gap-2 mb-3 text-xs">
                <span className="font-medium text-gray-700">Global Guardrails</span>
                <span className="text-gray-300">|</span>
                <span className="text-gray-500">Applied to all {form.selectedCategories.length} categories</span>
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs mb-3">
                <div>
                  <div className="text-gray-400 mb-0.5">Max Discount</div>
                  <div className="font-medium text-gray-900">{g.maxMarkdown}%</div>
                </div>
                <div>
                  <div className="text-gray-400 mb-0.5">Min Margin</div>
                  <div className="font-medium text-gray-900">{g.minMarkdown}%</div>
                </div>
              </div>
              <div className="text-xs text-gray-400">
                Expires in <span className="font-medium text-gray-900">30 days</span>
              </div>
            </>
          ) : (
            <p className="text-xs text-gray-400">No guardrails configured — click the edit icon to add some.</p>
          )}
        </div>
      )}

      {/* Guardrail Sets — markdown only */}
      {form.type !== 'promotional' && (
        <div className="border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">Guardrail Sets</h3>
            <button onClick={() => onEdit(4)} className="text-gray-400 hover:text-gray-600 transition-colors">
              <Pencil size={14} />
            </button>
          </div>
          {form.guardrailRules.some(r => r.stratId) ? (
            <div className="space-y-3">
              {form.guardrailRules.map((rule, i) => {
                const strat = MARKDOWN_RULES.find(s => s.id === rule.stratId)
                return strat ? (
                  <div key={i} className="text-xs">
                    <div className="text-gray-400 mb-0.5">Set {i === 0 ? 'A' : 'B'}</div>
                    <div className="font-medium text-gray-900">{strat.label}</div>
                    {['pct-markdown', 'depth-coverage', 'layered'].includes(rule.stratId) && (
                      <div className="text-gray-500 mt-0.5">
                        {rule.pctMarkdown}% of products
                        {['depth-coverage', 'layered'].includes(rule.stratId) ? ` at ${rule.depthPct}% off` : ''}
                      </div>
                    )}
                  </div>
                ) : (
                  <div key={i} className="text-xs text-gray-400">Rule {i + 1}: —</div>
                )
              })}
            </div>
          ) : (
            <p className="text-xs text-gray-400">No strategies configured — click the edit icon to add some.</p>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Main modal ───────────────────────────────────────────────────────────────

export default function CreateCampaignModal({ onClose, onCreated }) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    type: null,
    promoStrategy: null,
    name: '',
    locations: [],
    startDate: '',
    endDate: '',
    optionalSettings: { suggestedOnly: false, advancedRollUp: false, rollingMarkdown: false },
    selectedCategories: [],
    guardrails: {
      minMarkdown: '',
      maxMarkdown: '',
      minGrossMargin: '',
      messagingDiscount: '',
      minPctDiscountMessaging: '',
      requiresApproval: false,
    },
    guardrailRules: [
      { stratId: '', pctMarkdown: 30, depthPct: 30 },
      { stratId: '', pctMarkdown: 30, depthPct: 30 },
    ],
    promoObjectives: { target: '', revenueLiftTarget: 10, maxDiscountDepth: 30, priceFloor: '', messaging: '' },
  })

  const isPromo = form.type === 'promotional'
  const totalSteps = isPromo ? 4 : 5
  const reviewStep = isPromo ? 4 : 5
  const stepConf = isPromo ? PROMO_STEPS : MARKDOWN_STEPS
  const { title, subtitle } = stepConf[step] || stepConf[1]

  function handleSubmit() {
    onCreated?.(form)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[600px] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-gray-100">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              {step > 1 && (
                <button onClick={() => setStep(s => s - 1)}
                  className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 text-gray-500 flex-shrink-0">
                  <ArrowLeft size={13} />
                </button>
              )}
              <div>
                <h2 className="text-base font-semibold text-gray-900">{title}</h2>
                <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
              </div>
            </div>
            <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 text-gray-500 flex-shrink-0">
              <X size={13} />
            </button>
          </div>
          <ProgressBar step={step} total={totalSteps} />
        </div>

        {/* Body */}
        {step === 1 && <Step1 form={form} setForm={setForm} />}
        {step === 2 && <Step2 form={form} setForm={setForm} />}
        {step === 3 && (isPromo ? <Step3Promo form={form} setForm={setForm} /> : <Step3 form={form} setForm={setForm} />)}
        {step === 4 && !isPromo && <Step4Strategies form={form} setForm={setForm} />}
        {((isPromo && step === 4) || (!isPromo && step === 5)) && <Step5 form={form} onEdit={setStep} />}

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <button onClick={step === 1 ? onClose : () => setStep(s => s - 1)}
            className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors">
            Cancel
          </button>
          <div className="flex items-center gap-3">
            {!isPromo && (step === 3 || step === 4) && (
              <button onClick={() => setStep(s => s + 1)}
                className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors">
                Skip
              </button>
            )}
            <button
              onClick={step === reviewStep ? handleSubmit : () => setStep(s => s + 1)}
              className="flex items-center gap-2 bg-[#2a44d4] hover:bg-[#2438b8] text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors">
              {step === reviewStep ? 'Create Draft' : <> Next <ChevronRight size={15} /></>}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
