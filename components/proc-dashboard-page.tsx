"use client"

import type React from "react"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MoreVertical } from "lucide-react"
import { useState } from "react"

// Static data for charts
const departmentSpendData = [
  { name: "Procurement", allocated: 100, spent: 78 },
  { name: "Sales", allocated: 65, spent: 68 },
  { name: "Resource Planning", allocated: 105, spent: 72 },
  { name: "Marketing", allocated: 60, spent: 82 },
  { name: "Human Resource", allocated: 38, spent: 40 },
  { name: "Administration", allocated: 78, spent: 58 },
  { name: "Finance", allocated: 65, spent: 18 },
  { name: "Research", allocated: 65, spent: 75 },
  { name: "IT", allocated: 110, spent: 95 },
]

const monthlySpendData = [
  { month: "Jan", spend: 450000 },
  { month: "Feb", spend: 320000 },
  { month: "Mar", spend: 280000 },
  { month: "Apr", spend: 390000 },
  { month: "May", spend: 500000 },
  { month: "Jun", spend: 420000 },
  { month: "Jul", spend: 380000 },
  { month: "Aug", spend: 290000 },
  { month: "Sep", spend: 350000 },
  { month: "Oct", spend: 480000 },
  { month: "Nov", spend: 520000 },
  { month: "Dec", spend: 410000 },
]

const COLORS = {
  green: "#4CAF50", // Material green for Procurement
  lightGreen: "#95DE64", // Light green for budget spent
  orange: "#F1AA33", // Orange for Finance
  lightOrange: "#FFA940", // Light orange
  purple: "#906CA6", // Lavender purple for PMO
  lightPurple: "#B37FEB", // Light purple
  blue: "#1890FF", // Blue
  magenta: "#C15469", // Magenta/pink for Cyber Security
  teal: "#13C2C2", // Teal/cyan
  red: "#F5222D", // Red
}

// For pie charts - include colors in the data
const spentByDepartmentData = [
  { name: "Procurement", value: 18, color: COLORS.green },
  { name: "Finance", value: 7, color: COLORS.orange },
  { name: "PMO", value: 11, color: COLORS.purple },
  { name: "Cyber Security", value: 5, color: COLORS.magenta },
]

const prCommitteesData = [
  { name: "BID Opening", value: 10, color: COLORS.green },
  { name: "Bid Evaluation", value: 6, color: COLORS.orange },
  { name: "Qualification", value: 4, color: COLORS.purple },
  { name: "Direct Purchase", value: 2, color: COLORS.blue },
]

// For bar charts - include colors in the data
const rfpByDepartmentData = [
  { name: "Finance", value: 105, color: COLORS.green },
  { name: "IT & Service", value: 72, color: COLORS.orange },
  { name: "Procurement", value: 90, color: COLORS.blue },
  { name: "Hardware", value: 70, color: COLORS.teal },
  { name: "CSD", value: 58, color: COLORS.magenta },
]

const topVendorsData = [
  { name: "NORMA", value: 100, color: COLORS.green },
  { name: "AL Dates", value: 85, color: COLORS.orange },
  { name: "Riyadh Cables", value: 70, color: COLORS.purple },
  { name: "Zelal", value: 65, color: COLORS.blue },
  { name: "Al Fahd Traders", value: 55, color: COLORS.lightGreen },
]

const slaData = [
  { name: "On Time", value: 7, color: COLORS.green },
  { name: "Breached", value: 4, color: COLORS.orange },
]

const purchaseDocTypeData = [
  { name: "Service", value: 7, color: COLORS.green },
  { name: "Direct Purchase", value: 3, color: COLORS.orange },
]

interface PieSlice {
  name: string
  value: number
  color: string
}

function CustomPieChart({ data, size = 240 }: { data: PieSlice[]; size?: number }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })

  const total = data.reduce((sum, item) => sum + item.value, 0)
  const centerX = size / 2
  const centerY = size / 2
  const radius = size / 2 - 20
  const innerRadius = radius * 0.6

  let currentAngle = -90 // Start from top

  const slices = data.map((item) => {
    const percentage = item.value / total
    const angle = percentage * 360
    const startAngle = currentAngle
    const endAngle = currentAngle + angle

    // Calculate path for donut slice
    const startRad = (startAngle * Math.PI) / 180
    const endRad = (endAngle * Math.PI) / 180

    const x1 = centerX + radius * Math.cos(startRad)
    const y1 = centerY + radius * Math.sin(startRad)
    const x2 = centerX + radius * Math.cos(endRad)
    const y2 = centerY + radius * Math.sin(endRad)

    const x3 = centerX + innerRadius * Math.cos(endRad)
    const y3 = centerY + innerRadius * Math.sin(endRad)
    const x4 = centerX + innerRadius * Math.cos(startRad)
    const y4 = centerY + innerRadius * Math.sin(startRad)

    const largeArc = angle > 180 ? 1 : 0

    const path = [
      `M ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
      `L ${x3} ${y3}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}`,
      "Z",
    ].join(" ")

    currentAngle = endAngle

    return {
      path,
      color: item.color,
      name: item.name,
      percentage: Math.round(percentage * 100),
    }
  })

  const handleMouseMove = (e: React.MouseEvent<SVGPathElement>) => {
    const svg = e.currentTarget.ownerSVGElement
    if (svg) {
      const rect = svg.getBoundingClientRect()
      setTooltipPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }

  return (
    <div className="relative">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {slices.map((slice, index) => (
          <path
            key={index}
            d={slice.path}
            fill={slice.color}
            stroke="white"
            strokeWidth="2"
            style={{
              cursor: "pointer",
              opacity: hoveredIndex === null || hoveredIndex === index ? 1 : 0.6,
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => {
              setHoveredIndex(index)
              handleMouseMove(e)
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredIndex(null)}
          />
        ))}
        {hoveredIndex !== null && (
          <g transform={`translate(${tooltipPos.x}, ${tooltipPos.y - 10})`}>
            <rect
              x="-50"
              y="-30"
              width="100"
              height="25"
              fill="rgba(0, 0, 0, 0.8)"
              rx="4"
              style={{ pointerEvents: "none" }}
            />
            <text
              x="0"
              y="-12"
              textAnchor="middle"
              fill="white"
              style={{ fontSize: "12px", fontWeight: "500", pointerEvents: "none" }}
            >
              {slices[hoveredIndex].name} {slices[hoveredIndex].percentage}%
            </text>
          </g>
        )}
      </svg>
    </div>
  )
}

interface BarData {
  name: string
  value: number
  color: string
}

function CustomBarChart({ data, height = 320 }: { data: BarData[]; height?: number }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const maxValue = Math.max(...data.map((d) => d.value))
  const chartHeight = height - 100
  const chartWidth = 600
  const barWidth = chartWidth / data.length - 20
  const padding = { top: 20, right: 20, bottom: 80, left: 50 }

  // Calculate Y-axis ticks
  const yAxisTicks = [0, 30, 60, 90, 120]

  return (
    <div className="w-full flex justify-center">
      <svg width={chartWidth + padding.left + padding.right} height={height} className="overflow-visible">
        {/* Y-axis */}
        <line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={padding.top + chartHeight}
          stroke="#e5e7eb"
          strokeWidth="1"
        />

        {/* Y-axis ticks and labels */}
        {yAxisTicks.map((tick) => {
          const y = padding.top + chartHeight - (tick / 120) * chartHeight
          return (
            <g key={tick}>
              <line x1={padding.left - 5} y1={y} x2={padding.left} y2={y} stroke="#6b7280" strokeWidth="1" />
              <text x={padding.left - 10} y={y + 4} textAnchor="end" className="text-xs fill-gray-600">
                {tick}
              </text>
              <line
                x1={padding.left}
                y1={y}
                x2={padding.left + chartWidth}
                y2={y}
                stroke="#e5e7eb"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
            </g>
          )
        })}

        {/* X-axis */}
        <line
          x1={padding.left}
          y1={padding.top + chartHeight}
          x2={padding.left + chartWidth}
          y2={padding.top + chartHeight}
          stroke="#e5e7eb"
          strokeWidth="1"
        />

        {/* Bars */}
        {data.map((item, index) => {
          const barHeight = (item.value / 120) * chartHeight
          const x = padding.left + index * (chartWidth / data.length) + (chartWidth / data.length - barWidth) / 2
          const y = padding.top + chartHeight - barHeight

          return (
            <g key={index}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={item.color}
                rx="4"
                ry="4"
                style={{
                  cursor: "pointer",
                  opacity: hoveredIndex === null || hoveredIndex === index ? 1 : 0.6,
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
              {/* X-axis label */}
              <text
                x={x + barWidth / 2}
                y={padding.top + chartHeight + 15}
                textAnchor="end"
                transform={`rotate(-45 ${x + barWidth / 2} ${padding.top + chartHeight + 15})`}
                className="text-sm fill-gray-600"
              >
                {item.name}
              </text>
              {/* Hover tooltip */}
              {hoveredIndex === index && (
                <g>
                  <rect x={x + barWidth / 2 - 30} y={y - 30} width="60" height="25" fill="rgba(0, 0, 0, 0.8)" rx="4" />
                  <text x={x + barWidth / 2} y={y - 12} textAnchor="middle" className="text-xs fill-white font-medium">
                    {item.value}
                  </text>
                </g>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export default function ProcDashboardPage() {
  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="mb-8">
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Hello Mohammad !</h1>
                  <p className="text-gray-600">
                    Saved 40% budget than last year. You can view detailed report in report section.
                  </p>
                </div>
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                  View report
                </button>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Card className="bg-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Total RFP requested</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold text-gray-900">60</div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <span className="text-xl">📋</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">View details ›</p>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Total PO under approval</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold text-gray-900">29</div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-xl">📦</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">View details ›</p>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Total contract created</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold text-gray-900">20</div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-xl">📄</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">View details ›</p>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Pending Invoices</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold text-gray-900">12</div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-xl">💰</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">View details ›</p>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Budget spent (This year)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold text-gray-900">2,000</div>
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <span className="text-xl">📊</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Total spend per month</CardTitle>
              </div>
              <div className="flex gap-2">
                <select className="px-3 py-1 border border-gray-300 rounded text-sm">
                  <option>This Year</option>
                </select>
                <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                  View report
                </button>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={monthlySpendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.blue} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={COLORS.blue} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Area type="monotone" dataKey="spend" stroke={COLORS.blue} fillOpacity={1} fill="url(#colorSpend)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Budget Utilization</CardTitle>
              </div>
              <div className="flex gap-2">
                <button className="p-1 hover:bg-gray-100 rounded">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded">
                  Budget Allotted: 90 Mn SAR
                </span>
              </div>
              <ResponsiveContainer width="100%" height={620}>
                <BarChart data={departmentSpendData} margin={{ top: 20, right: 30, left: 0, bottom: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={120} stroke="#6b7280" interval={0} />
                  <YAxis
                    stroke="#6b7280"
                    domain={[0, 120]} // fixed upper bound
                    tickCount={13} // ensures roughly 0–120 with 10 gaps
                    allowDecimals={false} // no decimals
                  />
                  <Tooltip />
                  <Legend wrapperStyle={{ paddingTop: "20px" }} />
                  <Bar dataKey="allocated" fill={COLORS.green} name="Budget Allotted" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="spent" fill={COLORS.lightGreen} name="Budget Spent" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Spent Analysis by Department</CardTitle>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <CustomPieChart data={spentByDepartmentData} size={280} />
                </div>
                <div className="flex flex-wrap gap-4 justify-center mt-4">
                  {spentByDepartmentData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm text-gray-600">
                        {item.name} ({item.value} Mn)
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>PR Under Committees</CardTitle>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <CustomPieChart data={prCommitteesData} size={280} />
                </div>
                <div className="flex flex-wrap gap-4 justify-center mt-4">
                  {prCommitteesData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm text-gray-600">
                        {item.name} ({item.value})
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>RFPs by Department</CardTitle>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </CardHeader>
              <CardContent>
                <CustomBarChart data={rfpByDepartmentData} height={320} />
                <div className="flex flex-wrap gap-4 justify-center mt-4">
                  {rfpByDepartmentData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm text-gray-600">{item.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Top 5 Vendors by order by Amount</CardTitle>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </CardHeader>
              <CardContent>
                <CustomBarChart data={topVendorsData} height={320} />
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>SLA</CardTitle>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <CustomPieChart data={slaData} size={280} />
                </div>
                <div className="flex flex-wrap gap-4 justify-center mt-4">
                  {slaData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm text-gray-600">
                        {item.name} ({item.value})
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Purchase Document Type</CardTitle>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <CustomPieChart data={purchaseDocTypeData} size={280} />
                </div>
                <div className="flex flex-wrap gap-4 justify-center mt-4">
                  {purchaseDocTypeData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm text-gray-600">
                        {item.name} ({item.value})
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
