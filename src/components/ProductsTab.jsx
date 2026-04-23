import { useState, useRef, useEffect } from 'react'
import { Search, SlidersHorizontal, Columns2, Check } from 'lucide-react'
import StatCard from './StatCard'

const stats = [
  { label: 'Units Sold (last week)', value: '9,343', change: '+2.4% WoW', color: 'green' },
  { label: 'Margin (last week)', value: '26.0%', change: '-2.4% WoW', color: 'red' },
  { label: 'Total Stock Cover (weeks)', value: '7.3', change: '-1.8% WoW', color: 'amber' },
  { label: 'Revenue (last week)', value: '$1.26M', change: '+5.2% WoW', color: 'blue' },
]

const products = [
  {
    name: 'Running Sneakers Pro',
    sku: 'SKU-2847',
    category: 'Footwear',
    country: 'USA',
    tags: ['Spring Sale', 'Best Seller'],
    price: '$129.99',
    elasticity: 'Low',
    sales: '2,847',
    salesChange: '+23.4%',
    revenue: '$369,845',
    revenueChange: '+21.2%',
    margin: '32.1%',
    marginChange: '+2.4%',
    stockUnits: '4,234',
    stockWeeks: '8.2 weeks',
  },
  {
    name: 'Winter Jacket Elite',
    sku: 'SKU-1923',
    category: 'Apparel',
    country: 'UK',
    tags: ['Clearance'],
    price: '$189.99',
    elasticity: 'Medium',
    sales: '1,923',
    salesChange: '+18.7%',
    revenue: '$365,362',
    revenueChange: '+16.5%',
    margin: '28.5%',
    marginChange: '+1.8%',
    stockUnits: '1,456',
    stockWeeks: '4.1 weeks',
  },
  {
    name: 'Sports Leggings',
    sku: 'SKU-3456',
    category: 'Sportswear',
    country: 'USA',
    tags: ['New Arrival'],
    price: '$59.99',
    elasticity: 'High',
    sales: '5,234',
    salesChange: '+15.2%',
    revenue: '$313,934',
    revenueChange: '+14.8%',
    margin: '35.8%',
    marginChange: '+3.2%',
    stockUnits: '7,891',
    stockWeeks: '9.5 weeks',
  },
  {
    name: 'Athletic T-Shirt',
    sku: 'SKU-4782',
    category: 'Sportswear',
    country: 'Canada',
    tags: ['Markdown'],
    price: '$24.99',
    elasticity: 'High',
    sales: '4,128',
    salesChange: '-5.3%',
    revenue: '$103,178',
    revenueChange: '-4.9%',
    margin: '24.3%',
    marginChange: '-1.2%',
    stockUnits: '8,234',
    stockWeeks: '12.3 weeks',
  },
  {
    name: 'Training Shoes',
    sku: 'SKU-5621',
    category: 'Footwear',
    country: 'USA',
    tags: ['Spring Sale'],
    price: '$109.99',
    elasticity: 'Low',
    sales: '2,567',
    salesChange: '+9.8%',
    revenue: '$282,323',
    revenueChange: '+8.4%',
    margin: '29.7%',
    marginChange: '+1.5%',
    stockUnits: '3,456',
    stockWeeks: '6.8 weeks',
  },
]

function ChangeBadge({ value }) {
  const isNeg = value.startsWith('-')
  return (
    <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${isNeg ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
      {value}
    </span>
  )
}

function TagPill({ label }) {
  return (
    <span className="inline-block text-xs text-gray-600 border border-gray-200 rounded-full px-2.5 py-0.5 whitespace-nowrap">
      {label}
    </span>
  )
}

const COLS = [
  { key: 'category', label: 'Category' },
  { key: 'country',  label: 'Country' },
  { key: 'tags',     label: 'Campaign Tags' },
  { key: 'price',    label: 'Current Price' },
  { key: 'sales',    label: 'Sales' },
  { key: 'revenue',  label: 'Revenue' },
  { key: 'margin',   label: 'Margin' },
  { key: 'stock',    label: 'Stock Units' },
]

export default function ProductsTab() {
  const [visibleCols, setVisibleCols] = useState(new Set(COLS.map(c => c.key)))
  const [showColPanel, setShowColPanel] = useState(false)
  const colPanelRef = useRef(null)

  useEffect(() => {
    if (!showColPanel) return
    function handler(e) {
      if (colPanelRef.current && !colPanelRef.current.contains(e.target)) setShowColPanel(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showColPanel])

  function toggleCol(key) {
    setVisibleCols(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const col = key => visibleCols.has(key)

  return (
    <div>
      {/* Section header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Analyze Your Product Data</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Locate and filter products to get ideas for your next campaign
          </p>
        </div>
        <div className="flex items-center gap-2 relative" ref={colPanelRef}>
          <button className="flex items-center gap-2 border border-gray-200 rounded-lg px-3.5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <SlidersHorizontal size={15} />
            Filter
          </button>
          <button
            onClick={() => setShowColPanel(v => !v)}
            className={`flex items-center gap-2 border rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
              showColPanel ? 'border-[#2a44d4] text-[#2a44d4] bg-indigo-50' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Columns2 size={15} />
            Columns
          </button>
          {showColPanel && (
            <div className="absolute top-full right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-lg z-20 w-48 overflow-hidden">
              <div className="px-3 py-2.5 border-b border-gray-100">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Toggle columns</span>
              </div>
              {COLS.map(c => (
                <button key={c.key} onClick={() => toggleCol(c.key)}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                  {c.label}
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${visibleCols.has(c.key) ? 'bg-[#2a44d4] border-[#2a44d4]' : 'border-gray-300'}`}>
                    {visibleCols.has(c.key) && <Check size={9} className="text-white" />}
                  </div>
                </button>
              ))}
              <div className="px-3 py-2 border-t border-gray-100">
                <button onClick={() => setVisibleCols(new Set(COLS.map(c => c.key)))}
                  className="text-xs text-[#2a44d4] hover:underline">Reset to default</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Search */}
      <div className="relative w-72 mb-4">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Find a product"
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#2a44d4] focus:ring-1 focus:ring-[#2a44d4] bg-white"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-5 py-3">
                <div className="font-semibold text-gray-800 text-xs">Product Name</div>
                <div className="text-gray-400 font-normal text-xs">Product ID</div>
              </th>
              {col('category') && <th className="text-left px-4 py-3"><div className="font-semibold text-gray-800 text-xs">Category</div></th>}
              {col('country') && <th className="text-left px-4 py-3"><div className="font-semibold text-gray-800 text-xs">Country</div></th>}
              {col('tags') && <th className="text-left px-4 py-3"><div className="font-semibold text-gray-800 text-xs">Campaign Tags</div></th>}
              {col('price') && (
                <th className="text-right px-4 py-3">
                  <div className="font-semibold text-gray-800 text-xs">Current Price</div>
                  <div className="text-gray-400 font-normal text-xs">Price elasticity</div>
                </th>
              )}
              {col('sales') && (
                <th className="text-right px-4 py-3">
                  <div className="font-semibold text-gray-800 text-xs">Sales</div>
                  <div className="text-gray-400 font-normal text-xs">vs last week</div>
                </th>
              )}
              {col('revenue') && (
                <th className="text-right px-4 py-3">
                  <div className="font-semibold text-gray-800 text-xs">Revenue</div>
                  <div className="text-gray-400 font-normal text-xs">vs last week</div>
                </th>
              )}
              {col('margin') && (
                <th className="text-right px-4 py-3">
                  <div className="font-semibold text-gray-800 text-xs">Margin</div>
                  <div className="text-gray-400 font-normal text-xs">vs last week</div>
                </th>
              )}
              {col('stock') && (
                <th className="text-right px-5 py-3">
                  <div className="font-semibold text-gray-800 text-xs">Stock Units</div>
                  <div className="text-gray-400 font-normal text-xs">Stock cover (weeks)</div>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => (
              <tr key={p.sku} className={`${i < products.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-gray-50 transition-colors`}>
                <td className="px-5 py-4">
                  <div className="font-semibold text-gray-900">{p.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{p.sku}</div>
                </td>
                {col('category') && <td className="px-4 py-4 text-gray-600">{p.category}</td>}
                {col('country') && <td className="px-4 py-4 text-gray-600">{p.country}</td>}
                {col('tags') && (
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {p.tags.map((t) => <TagPill key={t} label={t} />)}
                    </div>
                  </td>
                )}
                {col('price') && (
                  <td className="px-4 py-4 text-right">
                    <div className="font-semibold text-gray-900">{p.price}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{p.elasticity}</div>
                  </td>
                )}
                {col('sales') && (
                  <td className="px-4 py-4 text-right">
                    <div className="font-semibold text-gray-900">{p.sales}</div>
                    <div className="mt-0.5"><ChangeBadge value={p.salesChange} /></div>
                  </td>
                )}
                {col('revenue') && (
                  <td className="px-4 py-4 text-right">
                    <div className="font-semibold text-gray-900">{p.revenue}</div>
                    <div className="mt-0.5"><ChangeBadge value={p.revenueChange} /></div>
                  </td>
                )}
                {col('margin') && (
                  <td className="px-4 py-4 text-right">
                    <div className="font-semibold text-gray-900">{p.margin}</div>
                    <div className="mt-0.5"><ChangeBadge value={p.marginChange} /></div>
                  </td>
                )}
                {col('stock') && (
                  <td className="px-5 py-4 text-right">
                    <div className="font-semibold text-gray-900">{p.stockUnits}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{p.stockWeeks}</div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
