import { Home, FileDown, BookOpen, Sparkles, Bell, HelpCircle, ChevronRight } from 'lucide-react'
import peakLogo from '../assets/uipath-peak-logo.svg'

const pricingIcon = 'https://www.figma.com/api/mcp/asset/da7ae3ba-01a6-4616-95ad-ce53e5af2474'
const inventoryIcon = 'https://www.figma.com/api/mcp/asset/ae6d32d5-0b07-4504-8973-03a5bafc5379'
const wayfinderIcon = 'https://www.figma.com/api/mcp/asset/9d4cf346-caaf-487b-bd89-04d6014c2796'

function Divider() {
  return <div className="w-full h-px" style={{ background: '#D4D5DE' }} />
}

function IconBtn({ children, active = false, size = 'md' }) {
  const pad = size === 'sm' ? 'p-1.5' : 'p-2'
  return (
    <button
      className={`${pad} rounded-lg transition-colors flex items-center justify-center ${
        active ? '' : 'hover:bg-black/5'
      }`}
      style={active ? { background: '#EAECFB' } : {}}
    >
      {children}
    </button>
  )
}

export default function Sidebar({ activePage = 'pricing', onPageChange }) {
  return (
    <div
      className="relative w-[56px] shrink-0 flex flex-col items-center justify-between py-6 px-2 overflow-visible z-20"
      style={{
        background: '#F9F9FE',
        borderRight: '0.5px solid #D4D5DE',
        boxShadow: '0px 4px 8px -2px rgba(9,33,167,0.08)',
      }}
    >
      {/* Top group */}
      <div className="flex flex-col items-center gap-10 w-full">
        {/* Logo */}
        <img src={peakLogo} alt="UiPath x PEAK" className="w-8 object-contain" />

        <div className="flex flex-col items-center gap-6 w-full">
          {/* Home */}
          <button className="flex items-center justify-center w-full p-2 rounded-lg hover:bg-black/5 transition-colors">
            <Home size={20} strokeWidth={1.6} style={{ color: '#020D21' }} />
          </button>

          {/* App icons */}
          <div className="flex flex-col items-center gap-4 w-full">
            <button
              onClick={() => onPageChange?.('pricing')}
              className="p-2 rounded-lg transition-colors flex items-center justify-center"
              style={activePage === 'pricing' ? { background: '#EAECFB' } : {}}
            >
              <img src={pricingIcon} alt="Pricing AI" className="w-5 h-5" />
            </button>
            <button
              onClick={() => onPageChange?.('inventory')}
              className="p-2 rounded-lg hover:bg-black/5 transition-colors flex items-center justify-center"
            >
              <img src={inventoryIcon} alt="Inventory AI" className="w-5 h-5" />
            </button>
          </div>

          <Divider />

          {/* Manage */}
          <div className="flex flex-col items-center gap-4 w-full">
            <span
              className="text-[10px] uppercase tracking-widest"
              style={{ color: '#687387', fontFamily: 'Inter, sans-serif' }}
            >
              Manage
            </span>
            <IconBtn>
              <FileDown size={20} strokeWidth={1.6} style={{ color: '#687387' }} />
            </IconBtn>
          </div>
        </div>
      </div>

      {/* Bottom group */}
      <div className="flex flex-col items-center gap-6 w-full">
        {/* Docs + Wayfinder */}
        <div className="flex flex-col items-center gap-2 w-full">
          <IconBtn>
            <BookOpen size={20} strokeWidth={1.6} style={{ color: '#687387' }} />
          </IconBtn>
          <IconBtn>
            <img src={wayfinderIcon} alt="AI Wayfinder" className="w-5 h-5" />
          </IconBtn>
        </div>

        <Divider />

        {/* Alerts + Help */}
        <div className="flex flex-col items-center gap-4 w-full">
          <IconBtn>
            <Bell size={16} strokeWidth={1.6} style={{ color: '#687387' }} />
          </IconBtn>
          <IconBtn>
            <HelpCircle size={16} strokeWidth={1.6} style={{ color: '#687387' }} />
          </IconBtn>
        </div>

        <Divider />

        {/* User avatar */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
          style={{ background: '#9009A2' }}
        >
          <span className="text-white text-[10px] font-medium">CD</span>
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        className="absolute -right-[14px] top-8 flex items-center justify-center rounded-lg border px-1 py-4"
        style={{
          background: '#F9F9FE',
          borderColor: '#D4D5DE',
          boxShadow: '0px 4px 8px -2px rgba(9,33,167,0.08)',
        }}
      >
        <ChevronRight size={14} style={{ color: '#687387' }} />
      </button>
    </div>
  )
}
