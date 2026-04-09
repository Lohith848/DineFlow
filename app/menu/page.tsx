"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import Image from "next/image"

type MenuItem = {
  id: string
  name: string
  price: number
  category: string
  image_url: string
  is_available: boolean
}

export default function MenuPage() {
  const [menu, setMenu] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchMenu()
  }, [])

  const fetchMenu = async () => {
    try {
      // First check if we can connect
      const { data: allData, error: allError } = await supabase
        .from("menu_items")
        .select("*")

      console.log("All menu items:", allData)
      console.log("Error:", allError)

      if (allError) {
        setError(allError.message)
      } else if (allData && allData.length > 0) {
        // Filter available items on client side if RLS is blocking
        const availableItems = allData.filter((item: any) => item.is_available === true)
        setMenu(availableItems)
      }
    } catch (err: any) {
      setError(err.message)
    }

    setLoading(false)
  }

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Menu</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>Error: {error}</p>
        </div>
      )}

      {menu.length === 0 && <p>No items found</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {menu.map((item) => (
          <div key={item.id} className="border p-4 rounded-lg shadow">
            
            {item.image_url && (
              <div className="relative h-40 mb-3">
                <Image
                  src={item.image_url}
                  alt={item.name}
                  fill
                  className="object-cover rounded"
                />
              </div>
            )}

            <h2 className="font-semibold">{item.name}</h2>
            <p className="text-gray-500">{item.category}</p>
            <p className="font-bold">₹{item.price}</p>

          </div>
        ))}
      </div>
    </div>
  )
}