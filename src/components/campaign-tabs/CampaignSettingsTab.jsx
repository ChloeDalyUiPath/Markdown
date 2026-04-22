import { useState } from 'react'
import { ChevronDown, ChevronUp, Calendar, Info } from 'lucide-react'

function SectionHeader({ title, description }) {
  return (
    <div className="pr-8">
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      <p className="text-xs text-gray-400 mt-1 leading-relaxed">{description}</p>
    </div>
  )
}

function Label({ children, hint }) {
  return (
    <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1.5">
      {children}
      {hint && <Info size={12} className="text-gray-400" />}
    </label>
  )
}

function TextInput({ value, onChange, placeholder }) {
  return (
    <input
      type="text"
      defaultValue={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#2a44d4] focus:ring-1 focus:ring-[#2a44d4]"
    />
  )
}

function SelectInput({ placeholder }) {
  return (
    <button className="w-full flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-400 hover:bg-gray-50 transition-colors">
      {placeholder}
      <ChevronDown size={14} className="text-gray-400 shrink-0" />
    </button>
  )
}

function StepInput({ value, placeholder }) {
  const [val, setVal] = useState(value || '')
  return (
    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
      <input
        type="text"
        value={val}
        onChange={e => setVal(e.target.value)}
        placeholder={placeholder}
        className="flex-1 px-3 py-2.5 text-sm text-gray-800 focus:outline-none"
      />
      <div className="flex flex-col border-l border-gray-200">
        <button onClick={() => {}} className="px-2 py-1 hover:bg-gray-50 border-b border-gray-200"><ChevronUp size={10} /></button>
        <button onClick={() => {}} className="px-2 py-1 hover:bg-gray-50"><ChevronDown size={10} /></button>
      </div>
    </div>
  )
}

function Checkbox({ label, hint }) {
  const [checked, setChecked] = useState(false)
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={() => setChecked(c => !c)}
        className="w-4 h-4 rounded border-gray-300 accent-[#2a44d4]"
      />
      <span className="text-sm text-gray-700">{label}</span>
      {hint && <Info size={12} className="text-gray-400" />}
    </label>
  )
}

export default function CampaignSettingsTab({ campaign }) {
  const [name, setName] = useState(campaign?.name || 'End of Autumn Coats')

  return (
    <div className="max-w-4xl space-y-0">
      {/* General Information */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
        <div className="grid grid-cols-[220px_1fr] gap-8">
          <SectionHeader
            title="General Information"
            description="Lorem ipsum dolor sit amet consectetur. Magna suscipit"
          />
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <TextInput value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div>
              <Label>Categories</Label>
              <SelectInput placeholder="Select categories" />
            </div>
            <div>
              <Label>Locations</Label>
              <SelectInput placeholder="Select locations" />
            </div>
            <div>
              <Label>Campaign dates</Label>
              <button className="w-full flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-400 hover:bg-gray-50 transition-colors">
                Select date range
                <Calendar size={14} className="text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Guardrails */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
        <div className="grid grid-cols-[220px_1fr] gap-8">
          <SectionHeader
            title="Guardrails"
            description="Lorem ipsum dolor sit amet consectetur. Magna suscipit"
          />
          <div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label>Min markdown %</Label>
                <StepInput value="10%" />
              </div>
              <div>
                <Label>Max markdown %</Label>
                <StepInput value="40%" />
              </div>
            </div>

            <div className="mb-4">
              <Label>Min gross margin minimum target (£)</Label>
              <StepInput value="$12,000" />
            </div>

            <div className="space-y-3 mb-4">
              <Checkbox label="Allow bypass of guardrails and alert me." hint />
              <Checkbox label="Include suggested products only" hint />
              <Checkbox label="Advanced roll up" hint />
              <Checkbox label="Rolling Markdown" hint />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Messaging discount</Label>
                <TextInput value="Up to 40% off" />
              </div>
              <div>
                <Label hint>Min % of products with discount messaging</Label>
                <StepInput value="40%" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <Label>Price bounds lower</Label>
                <SelectInput placeholder="Select one or multiple bounds" />
              </div>
              <div>
                <Label>Price bounds upper</Label>
                <SelectInput placeholder="Select one or multiple bounds" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Other */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="grid grid-cols-[220px_1fr] gap-8">
          <SectionHeader
            title="Other"
            description="Lorem ipsum dolor sit amet consectetur. Magna suscipit"
          />
          <div className="grid grid-cols-2 gap-x-8 gap-y-5">
            <div>
              <div className="text-xs font-medium text-gray-500 mb-1">Creation Date &amp; Time</div>
              <div className="text-sm text-gray-900">18-12-2025 &nbsp;|&nbsp; 13:03</div>
            </div>
            <div>
              <div className="text-xs font-medium text-gray-500 mb-1">Last Updated</div>
              <div className="text-sm text-gray-900">18-12-2025 &nbsp;|&nbsp; 13:03</div>
            </div>
            <div>
              <div className="text-xs font-medium text-[#2a44d4] mb-1">Root ID</div>
              <div className="text-sm text-gray-900 font-mono">E92757294-5764-4C9C-9DDD</div>
            </div>
            <div>
              <div className="text-xs font-medium text-[#2a44d4] mb-1">Parent ID</div>
              <div className="text-sm text-gray-900">-</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
