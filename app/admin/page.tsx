import { createClient } from "@/lib/supabaseServer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { HotelSettings } from "@/lib/types"
import {
  ShoppingBag,
  Package,
  Clock,
  Calendar,
  TrendingUp,
  Users,
  DollarSign,
  Activity,
} from "lucide-react"

export default async function AdminDashboard() {
  const supabase = await createClient()

  const { count: orderCount } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })

  const { count: menuCount } = await supabase
    .from("menu_items")
    .select("*", { count: "exact", head: true })

  const { data: settings } = await supabase
    .from("hotel_settings")
    .select("*")
    .eq("id", 1)
    .single() as { data: HotelSettings | null }

  const { count: holidayCount } = await supabase
    .from("holidays")
    .select("*", { count: "exact", head: true })

  const { data: recentOrders } = await supabase
    .from("orders")
    .select("*, profile:profiles(name, phone)")
    .order("created_at", { ascending: false })
    .limit(5) as { data: any[] | null }

  const stats = [
    {
      title: "Total Orders",
      value: orderCount || 0,
      icon: ShoppingBag,
      gradient: "from-blue-500 to-cyan-500",
      change: "+12%",
    },
    {
      title: "Menu Items",
      value: menuCount || 0,
      icon: Package,
      gradient: "from-purple-500 to-pink-500",
      change: "+3",
    },
    {
      title: "Hotel Status",
      value: settings?.is_open ? "Open" : "Closed",
      icon: Clock,
      gradient: settings?.is_open ? "from-green-500 to-emerald-500" : "from-red-500 to-rose-500",
      subtitle: `${settings?.opening_time} - ${settings?.closing_time}`,
    },
    {
      title: "Holidays",
      value: holidayCount || 0,
      icon: Calendar,
      gradient: "from-orange-500 to-amber-500",
      change: "This month",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container py-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Overview of your restaurant</p>
        </div>
      </div>

      <div className="container py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card
              key={stat.title}
              className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  {stat.title}
                </CardTitle>
                <div
                  className={`p-2 rounded-xl bg-gradient-to-br ${stat.gradient}`}
                >
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {stat.value}
                </div>
                {(stat as any).change && (
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {(stat as any).change}
                  </p>
                )}
                {(stat as any).subtitle && (
                  <p className="text-xs text-gray-400 mt-1">
                    {(stat as any).subtitle}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Orders */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-xl">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {recentOrders && recentOrders.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                        <ShoppingBag className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          Order #{order.id.slice(0, 8)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {(order.profile as any)?.name || "Unknown"} • ₹
                          {order.total_amount}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(order.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-medium ${
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
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500">No orders yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
