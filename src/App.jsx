import { useState } from 'react'
import Dashboard from './components/Dashboard'
import InventoryPage from './components/InventoryPage'
import Sidebar from './components/Sidebar'

export default function App() {
  const [activePage, setActivePage] = useState('pricing')

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar activePage={activePage} onPageChange={setActivePage} />
      <main className="flex-1 overflow-auto min-w-0">
        {activePage === 'pricing' ? <Dashboard /> : <InventoryPage />}
      </main>
    </div>
  )
}
