"use client"

import Link from "next/link"
import Image from "next/image"
import { useCart } from "@/store/cart"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  UtensilsCrossed,
} from "lucide-react"
import type { CartItem } from "@/store/cart"

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart } = useCart()

  const total = items.reduce(
    (sum: number, item: CartItem) => sum + item.price * item.qty,
    0
  )

  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        {/* Hero */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 py-16">
          <div className="container">
            <h1 className="text-4xl font-bold text-white">Your Cart</h1>
            <p className="text-slate-400 mt-2">Review your order before checkout</p>
          </div>
        </div>

        <div className="container py-12">
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <ShoppingBag className="w-12 h-12 text-gray-400" />
              </div>
              <CardTitle className="text-2xl">Your cart is empty</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              <p>Add items from the menu to get started</p>
            </CardContent>
            <CardContent className="pt-0">
              <Link href="/menu">
                <Button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-xl">
                  <UtensilsCrossed className="w-4 h-4 mr-2" />
                  Browse Menu
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 py-16">
        <div className="container">
          <h1 className="text-4xl font-bold text-white">Your Cart</h1>
          <p className="text-slate-400 mt-2">
            {items.length} item{items.length !== 1 ? "s" : ""} in your cart
          </p>
        </div>
      </div>

      <div className="container py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item: CartItem) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-center p-4 gap-4">
                    <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <ShoppingBag className="w-8 h-8 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        ₹{item.price} each
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-lg"
                        disabled={item.qty <= 1}
                        onClick={() => updateQuantity(item.id, item.qty - 1)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-12 text-center font-bold text-lg">
                        {item.qty}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-lg"
                        onClick={() => updateQuantity(item.id, item.qty + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button
              variant="ghost"
              onClick={clearCart}
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Cart
            </Button>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">₹{total}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                    FREE
                  </Badge>
                </div>
                <div className="border-t pt-4 flex justify-between">
                  <span className="font-semibold text-lg">Total</span>
                  <span className="font-bold text-lg text-orange-600">₹{total}</span>
                </div>
              </CardContent>
              <CardContent className="pt-0">
                <Link href="/checkout" className="block">
                  <Button
                    className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-xl h-12"
                    size="lg"
                  >
                    Proceed to Checkout
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
