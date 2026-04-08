"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { supabase } from "@/lib/supabaseClient"
import { useCart } from "@/store/cart"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ShoppingBag,
  Plus,
  Minus,
  Star,
  Clock,
  Flame,
  Leaf,
} from "lucide-react"
import type { MenuItem } from "@/lib/types"

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const { items, addItem, removeItem, updateQuantity } = useCart()

  useEffect(() => {
    fetchMenu()
  }, [])

  const fetchMenu = async () => {
    const { data } = await supabase
      .from("menu_items")
      .select("*")
      .eq("is_available", true)
      .order("category")
      .order("name")

    setMenuItems(data || [])
    setLoading(false)
  }

  const categories = Array.from(
    new Set(menuItems.map((item) => item.category).filter(Boolean))
  )

  const filteredItems = selectedCategory
    ? menuItems.filter((item) => item.category === selectedCategory)
    : menuItems

  const getItemQuantity = (id: string) => {
    const item = items.find((i) => i.id === id)
    return item?.qty || 0
  }

  const handleAddToCart = (item: MenuItem) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      qty: 1,
    })
  }

  const handleRemoveFromCart = (id: string) => {
    removeItem(id)
  }

  const handleUpdateQuantity = (id: string, delta: number) => {
    const currentQty = getItemQuantity(id)
    const newQty = currentQty + delta

    if (newQty <= 0) {
      removeItem(id)
    } else {
      updateQuantity(id, newQty)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case "main course":
        return <Flame className="w-3.5 h-3.5" />
      case "curry":
        return <Flame className="w-3.5 h-3.5" />
      case "snacks":
        return <Star className="w-3.5 h-3.5" />
      case "beverages":
        return <Leaf className="w-3.5 h-3.5" />
      case "bread":
        return <Star className="w-3.5 h-3.5" />
      case "rice":
        return <Star className="w-3.5 h-3.5" />
      default:
        return <Star className="w-3.5 h-3.5" />
    }
  }

  if (loading) {
    return (
      <div className="container py-12 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading menu...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 py-16 mb-8">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmZmZmMiIGZpbGwtb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-30" />
        <div className="container relative z-10">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              Our Menu
            </h1>
            <p className="text-orange-100 mt-3 text-lg max-w-xl">
              Fresh, delicious meals delivered hot to your hostel door
            </p>
            <div className="flex items-center gap-4 mt-6 text-orange-100 text-sm">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>30 Min Delivery</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4" />
                <span>Free Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container pb-12">
        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              className={`rounded-full px-5 ${
                selectedCategory === null
                  ? "bg-orange-500 hover:bg-orange-600"
                  : ""
              }`}
            >
              All Items
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-5 ${
                  selectedCategory === category
                    ? "bg-orange-500 hover:bg-orange-600"
                    : ""
                }`}
              >
                {getCategoryIcon(category as string)}
                <span className="ml-1.5">{category}</span>
              </Button>
            ))}
          </div>
        )}

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item, index) => {
            const qty = getItemQuantity(item.id)
            return (
              <div
                key={item.id}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden animate-fade-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Image Container */}
                <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                  {item.image_url ? (
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                        <ShoppingBag className="w-10 h-10 text-gray-400" />
                      </div>
                    </div>
                  )}
                  {/* Category Badge */}
                  {item.category && (
                    <Badge className="absolute top-3 left-3 bg-white/90 text-gray-700 backdrop-blur-sm hover:bg-white">
                      {getCategoryIcon(item.category)}
                      <span className="ml-1">{item.category}</span>
                    </Badge>
                  )}
                  {/* Price Tag */}
                  <div className="absolute top-3 right-3">
                    <div className="bg-orange-500 text-white font-bold px-3 py-1.5 rounded-full text-sm shadow-lg">
                      ₹{item.price}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">
                    {item.name}
                  </h3>
                  {item.description && (
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                      {item.description}
                    </p>
                  )}

                  {/* Add to Cart */}
                  {qty > 0 ? (
                    <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-lg text-orange-600 hover:bg-orange-100"
                        onClick={() => handleUpdateQuantity(item.id, -1)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="flex-1 text-center font-bold text-gray-900">
                        {qty}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-lg text-orange-600 hover:bg-orange-100"
                        onClick={() => handleUpdateQuantity(item.id, 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-xl"
                      onClick={() => handleAddToCart(item)}
                    >
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <ShoppingBag className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No items found
            </h3>
            <p className="text-gray-500">
              No items available in this category yet.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
