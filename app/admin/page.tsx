"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabaseClient"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ShoppingBag,
  Package,
  Clock,
  Calendar,
  TrendingUp,
  DollarSign,
  ToggleLeft,
  ToggleRight,
  Loader2,
  Ban,
} from "lucide-react"

type HotelSettings = {
  id: number
  is_open: boolean
  opening_time: string
  closing_time: string
}

type OrderStats = {
  today: number
  week: number
  month: number
  year: number
}

type RecentOrder = {
  id: string
  total_amount: number
  status: string
  created_at: string
  profile: {
    full_name: string
    phone: string
  } | null
}

export default function AdminDashboard() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState<HotelSettings | null>(null)
  const [orderStats, setOrderStats] = useState<OrderStats>({ today: 0, week: 0, month: 0, year: 0 })
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const today = new Date()
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString()
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay())).toISOString()
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString()
    const startOfYear = new Date(today.getFullYear(), 0, 1).toISOString()

    const [settingsData, todayOrders, weekOrders, monthOrders, yearOrders, recentData] = await Promise.all([
      supabase.from("hotel_settings").select("*").eq("id", 1).single(),
      supabase.from("orders").select("id").gte("created_at", startOfDay),
      supabase.from("orders").select("id").gte("created_at", startOfWeek),
      supabase.from("orders").select("id").gte("created_at", startOfMonth),
      supabase.from("orders").select("id").gte("created_at", startOfYear),
      supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(5),
    ])

    setSettings(settingsData.data)
    setOrderStats({
      today: todayOrders.count || 0,
      week: weekOrders.count || 0,
      month: monthOrders.count || 0,
      year: yearOrders.count || 0,
    })
    setRecentOrders(recentData.data || [])
    setLoading(false)
  }

  const toggleStoreStatus = async () => {
    if (!settings) return
    setUpdating(true)
    await supabase.from("hotel_settings").update({ is_open: !settings.is_open }).eq("id", 1)
    setSettings({ ...settings, is_open: !settings.is_open })
    setUpdating(false)
  }

  const stats = [
    { title: "Today", value: orderStats.today, icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "This Week", value: orderStats.week, icon: Calendar, color: "text-purple-600", bg: "bg-purple-100" },
    { title: "This Month", value: orderStats.month, icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-100" },
    { title: "This Year", value: orderStats.year, icon: DollarSign, color: "text-green-600", bg: "bg-green-100" },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Overview of your restaurant</p>
          </div>
          <Button
            onClick={toggleStoreStatus}
            disabled={updating}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium ${
              settings?.is_open
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "bg-red-100 text-red-700 hover:bg-red-200"
            }`}
          >
            {updating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : settings?.is_open ? (
              <Ban className="w-4 h-4" />
            ) : (
              <Ban className="w-4 h-4" />
            )}
            {settings?.is_open ? "Store Open" : "Store Closed"}
          </Button>
        </div>

        <div className={`p-4 rounded-2xl ${settings?.is_open ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
          <div className="flex items-center gap-3">
            {settings?.is_open ? (
              <ToggleRight className="w-6 h-6 text-green-600" />
            ) : (
              <ToggleLeft className="w-6 h-6 text-red-600" />
            )}
            <div>
              <p className="font-semibold">{settings?.is_open ? "Accepting Orders" : "Not Accepting Orders"}</p>
              <p className="text-sm text-muted-foreground">
                Hours: {settings?.opening_time} - {settings?.closing_time}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">{stat.title}</span>
                  <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {recentOrders.length > 0 ? (
              <div className="divide-y divide-border">
                {recentOrders.map((order) => (
                  <div key={order.id} className="p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">
                          {order.profile?.full_name || "Unknown Customer"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {order.profile?.phone || "No phone"} • ₹{order.total_amount}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(order.created_at).toLocaleString()}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 ${
                          order.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : order.status === "confirmed"
                            ? "bg-blue-100 text-blue-700"
                            : order.status === "preparing"
                            ? "bg-purple-100 text-purple-700"
                            : order.status === "out_for_delivery"
                            ? "bg-orange-100 text-orange-700"
                            : order.status === "delivered"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {order.status?.replace(/_/g, " ")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <ShoppingBag className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p>No orders yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}