import { useState } from "react"
import { Search, Filter, Clock, Calendar, ArrowDownRight, Lock, ChevronRight } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"
import { Checkbox } from "./ui/checkbox"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs"
import { cn } from "../lib/utils"

const products = [
  {
    id: "FMD8521",
    name: "Floral Maxi Dress",
    image: "https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=56&h=56&fit=crop",
    supplier: "Summer Styles",
    category: "Women's A...",
    location: "London",
    freight: "Sea",
    approvalStatus: "waiting",
    sizesProgress: 60,
    skusOrdered: 10,
    orderCost: "£26,000",
    reorderMin: 400,
    reorderRebuy: 250,
  },
  {
    id: "LHB4561",
    name: "Leather Handbag",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=56&h=56&fit=crop",
    supplier: "Luxe Leather",
    category: "Accessories",
    location: "Edinburgh",
    freight: "Sea",
    approvalStatus: "waiting",
    sizesProgress: 60,
    skusOrdered: 10,
    orderCost: "£26,000",
    reorderMin: 400,
    reorderRebuy: 250,
  },
  {
    id: "CTS2349",
    name: "Cotton T-Shirt",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=56&h=56&fit=crop",
    supplier: "Basic Apparel",
    category: "Men's Apparel",
    location: "Bristol",
    freight: "Sea",
    approvalStatus: "waiting",
    sizesProgress: 60,
    skusOrdered: 10,
    orderCost: "£26,000",
    reorderMin: 400,
    reorderRebuy: 250,
  },
  {
    id: "WBL6723",
    name: "Wool Blazer",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=56&h=56&fit=crop",
    supplier: "Tailored Fash...",
    category: "Outerwear",
    location: "Leeds",
    freight: "Sea",
    approvalStatus: "waiting",
    sizesProgress: 60,
    skusOrdered: 10,
    orderCost: "£26,000",
    reorderMin: 400,
    reorderRebuy: 250,
  },
  {
    id: "ABT9134",
    name: "Ankle Boots",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=56&h=56&fit=crop",
    supplier: "Trendy Boots",
    category: "Footwear",
    location: "Glasgow",
    freight: "Sea",
    approvalStatus: "waiting",
    sizesProgress: 60,
    skusOrdered: 10,
    orderCost: "£26,000",
    reorderMin: 400,
    reorderRebuy: 250,
  },
  {
    id: "SPS5678",
    name: "Striped Polo Shirt",
    image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=56&h=56&fit=crop",
    supplier: "Basic Apparel",
    category: "Men's Apparel",
    location: "Cardiff",
    freight: "Sea",
    approvalStatus: "waiting",
    sizesProgress: 60,
    skusOrdered: 10,
    orderCost: "£26,000",
    reorderMin: 400,
    reorderRebuy: 250,
  },
  {
    id: "CSN7892",
    name: "Classic Sneakers",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=56&h=56&fit=crop",
    supplier: "Urban Foot...",
    category: "Footwear",
    location: "Birmingham",
    freight: "Air",
    approvalStatus: "tbc",
    sizesProgress: 60,
    skusOrdered: 10,
    orderCost: "£26,000",
    reorderMin: 400,
    reorderRebuy: 250,
  },
]

function ApprovalBadge({ status }) {
  if (status === "waiting") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-gray-600">
        <Lock className="h-3.5 w-3.5 text-gray-400" />
        Waiting approval
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-amber-600">
      <Lock className="h-3.5 w-3.5 text-amber-400" />
      Tbc
    </span>
  )
}

function SizesBar({ progress }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden w-24">
        <div className="flex h-full">
          <div className="bg-red-400 h-full" style={{ width: `${progress}%` }} />
          <div className="bg-blue-400 h-full" style={{ width: `${(100 - progress) * 0.4}%` }} />
          <div className="bg-orange-400 h-full" style={{ width: `${(100 - progress) * 0.3}%` }} />
          <div className="bg-green-400 h-full" style={{ width: `${(100 - progress) * 0.3}%` }} />
        </div>
      </div>
      <span className="text-xs text-gray-500 whitespace-nowrap">{progress}% Understoc</span>
    </div>
  )
}

function StatCard({ label, value, delta, deltaLabel }) {
  const isNegative = delta < 0
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 flex flex-col gap-2 min-w-0 flex-1">
      <div className="flex items-center gap-1 text-xs text-gray-500">
        {label}
        <span className="text-gray-300">···</span>
      </div>
      <div className="text-2xl font-semibold text-gray-900">{value}</div>
      <div className={cn("inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full w-fit", isNegative ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600")}>
        <ArrowDownRight className="h-3 w-3" />
        {Math.abs(delta)}% {deltaLabel}
      </div>
    </div>
  )
}

export default function InventoryPage() {
  const [selectedRows, setSelectedRows] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("reorder")

  const toggleRow = (id) => {
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    )
  }

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-white">
      {/* Top App Header */}
      <div className="border-b border-gray-200 bg-white px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-amber-400 rounded rotate-45 flex items-center justify-center">
            <div className="h-4 w-4 bg-amber-600 rounded-sm -rotate-45" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Inventory</h1>
            <p className="text-xs text-gray-500">A holistic inventory view to forecast, order and balance optimal stock levels across your network.</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="text-sm gap-2">
          <span className="text-gray-400">⚙</span>
          Edit global guardrails
        </Button>
      </div>

      {/* Tabs nav */}
      <div className="border-b border-gray-200 bg-white px-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="gap-0">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="reorder">Reorder</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main content */}
      <div className="bg-gray-50 min-h-screen p-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">

          {/* Page header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Reorder Management</h2>
              <p className="text-sm text-gray-500 mt-0.5">Review AI-suggested orders and manage individual SKUs requiring attention</p>
            </div>
            <div className="flex items-center gap-0 border border-gray-200 rounded-lg overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 border-r border-gray-200">
                <Clock className="h-4 w-4 text-gray-400" />
                <div>
                  <div className="text-xs text-gray-500">Approvals Updated</div>
                  <div className="text-xs font-semibold text-gray-900">Today at 11:24 AM</div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2.5">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <div className="text-xs text-gray-500">Next Reorder Suggestions</div>
                  <div className="text-xs font-semibold text-gray-900">In 7 Days</div>
                </div>
              </div>
            </div>
          </div>

          {/* Search + actions bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="relative w-60">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Find a product by id or name"
                  className="pl-9 h-12 text-sm border-gray-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" className="h-12 gap-2 text-sm border-gray-200">
                <Filter className="h-4 w-4 text-gray-500" />
                Filter
              </Button>
            </div>
            <Button className="h-12 gap-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium px-6">
              Send to Order App
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Order status + KPI cards */}
          <div className="flex gap-4 mb-6">
            {/* Order Status KPI - wider */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 flex-[2] min-w-0">
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-2xl font-bold text-gray-900">325,302</span>
                <span className="text-base font-medium text-gray-500">Order Status</span>
              </div>
              {/* Progress bar */}
              <div className="h-1 w-full rounded-full overflow-hidden flex mb-2">
                <div className="bg-green-500 h-full" style={{ width: "48%" }} />
                <div className="bg-blue-500 h-full" style={{ width: "7%" }} />
                <div className="bg-orange-400 h-full" style={{ width: "6%" }} />
                <div className="bg-gray-200 h-full flex-1" />
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
                  Approved : 156,320
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
                  Waiting Approval: 22,480
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block h-2 w-2 rounded-full bg-orange-400" />
                  Approval Declined: 18,760
                </span>
              </div>
            </div>

            <StatCard label="Total Reorders" value="124" delta={-12.5} deltaLabel="WoW" />
            <StatCard label="Total Quantity" value="94,850" delta={-14.2} deltaLabel="WoW" />
            <StatCard label="Reorder at Cost" value="£485.75K" delta={-13.8} deltaLabel="WoW" />
            <StatCard label="Av. Reorder Cover" value="4 Weeks" delta={-20.0} deltaLabel="WoW" />
          </div>

          {/* Table */}
          <div>
            <p className="text-xs text-gray-500 mb-3">Showing 27 of 27 products</p>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Table header */}
              <div className="grid bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wide" style={{ gridTemplateColumns: "40px 74px 1fr 100px 110px 90px 70px 130px 130px 90px 90px 70px" }}>
                <div className="p-3 flex items-center justify-center">
                  <Checkbox />
                </div>
                <div className="p-3" />
                <div className="p-3">
                  <div>Product Name</div>
                  <div className="text-gray-400 normal-case tracking-normal font-normal">SKU</div>
                </div>
                <div className="p-3">Supplier</div>
                <div className="p-3">Category</div>
                <div className="p-3">Location</div>
                <div className="p-3">Freight</div>
                <div className="p-3">Approval Status</div>
                <div className="p-3">Sizes</div>
                <div className="p-3 text-right">
                  <div>SKUs ordered</div>
                  <div className="text-gray-400 normal-case tracking-normal font-normal">Order cost</div>
                </div>
                <div className="p-3 text-right">
                  <div>Reorder</div>
                  <div className="text-gray-400 normal-case tracking-normal font-normal">Minimum rebuy</div>
                </div>
                <div className="p-3" />
              </div>

              {/* Table rows */}
              {filteredProducts.map((product, idx) => (
                <div
                  key={product.id}
                  className={cn(
                    "grid items-center border-b border-gray-100 hover:bg-gray-50 transition-colors",
                    selectedRows.includes(product.id) && "bg-blue-50",
                    idx === filteredProducts.length - 1 && "border-b-0"
                  )}
                  style={{ gridTemplateColumns: "40px 74px 1fr 100px 110px 90px 70px 130px 130px 90px 90px 70px" }}
                >
                  <div className="p-3 flex items-center justify-center">
                    <Checkbox
                      checked={selectedRows.includes(product.id)}
                      onCheckedChange={() => toggleRow(product.id)}
                    />
                  </div>
                  <div className="p-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-12 w-12 rounded-md object-cover bg-gray-100"
                      onError={(e) => { e.target.style.display = 'none' }}
                    />
                  </div>
                  <div className="p-3">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    <div className="text-xs text-gray-400">#{product.id}</div>
                  </div>
                  <div className="p-3 text-sm text-gray-600 truncate">{product.supplier}</div>
                  <div className="p-3 text-sm text-gray-600 truncate">{product.category}</div>
                  <div className="p-3 text-sm text-gray-600">{product.location}</div>
                  <div className="p-3 text-sm text-gray-600">{product.freight}</div>
                  <div className="p-3">
                    <ApprovalBadge status={product.approvalStatus} />
                  </div>
                  <div className="p-3">
                    <SizesBar progress={product.sizesProgress} />
                  </div>
                  <div className="p-3 text-right">
                    <div className="text-sm font-medium text-gray-900">{product.skusOrdered}</div>
                    <div className="text-xs text-gray-400">{product.orderCost}</div>
                  </div>
                  <div className="p-3 text-right">
                    <div className="text-sm font-medium text-gray-900">{product.reorderMin}</div>
                    <div className="text-xs text-gray-400">{product.reorderRebuy}</div>
                  </div>
                  <div className="p-3">
                    <Button variant="outline" size="sm" className="text-xs h-7 px-3">
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
