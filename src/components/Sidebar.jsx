import {
  Home,
  Layers,
  ArrowUpRight,
  FileUp,
  BookOpen,
  Sparkles,
  Bell,
  HelpCircle,
  Settings,
  ChevronRight,
} from 'lucide-react'
import logo from '../assets/logo.svg'

function NavButton({ icon: Icon, active = false }) {
  return (
    <button
      className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
        active
          ? 'bg-indigo-50 text-indigo-600'
          : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'
      }`}
    >
      <Icon size={18} />
    </button>
  )
}

export default function Sidebar() {
  return (
    <div className="w-[64px] bg-white border-r border-gray-200 flex flex-col items-center py-3 shrink-0">
      {/* Logo */}
      <img src={logo} alt="UiPath x PEAK" className="w-9 mb-2" />

      {/* Collapse toggle */}
      <button className="w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600 mb-3">
        <ChevronRight size={14} />
      </button>

      {/* Top nav */}
      <nav className="flex flex-col gap-1 items-center">
        <NavButton icon={Home} />
        <NavButton icon={Layers} active />
        <NavButton icon={ArrowUpRight} />
      </nav>

      {/* Manage section */}
      <div className="w-full px-3 my-3">
        <div className="border-t border-gray-100" />
        <p className="text-[9px] font-semibold text-gray-400 tracking-widest text-center mt-2 uppercase">
          Manage
        </p>
      </div>

      <NavButton icon={FileUp} />

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom nav */}
      <nav className="flex flex-col gap-1 items-center mb-3">
        <NavButton icon={BookOpen} />
        <NavButton icon={Sparkles} />
        <NavButton icon={Bell} />
        <NavButton icon={HelpCircle} />
        <NavButton icon={Settings} />
      </nav>

      {/* User avatar */}
      <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
        <span className="text-white text-xs font-semibold">Z</span>
      </div>
    </div>
  )
}
