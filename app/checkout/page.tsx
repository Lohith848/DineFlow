"use client"

import { useState } from "react"
import { useCart } from "@/store/cart"

export default function CheckoutPage() {
    const { items } = useCart()

    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [address, setAddress] = useState("")

    const total = items.reduce(
        (sum, item) => sum + item.price * item.qty,
        0
    )

    const handleOrder = () => {
        const message = `
🛒 New Order - The Hunters Kitchen

👤 Name: ${name}
📞 Phone: ${phone}
📍 Address: ${address}

🍽 Items:
${items.map(i => `${i.name} x${i.qty}`).join("\n")}

💰 Total: ₹${total}
    `

        const url = `https://wa.me/916383346991?text=${encodeURIComponent(message)}`
        window.open(url, "_blank")
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">
                📦 Checkout
            </h1>

            <input
                type="text"
                placeholder="Your Name"
                className="border p-2 w-full mb-2"
                onChange={(e) => setName(e.target.value)}
            />

            <input
                type="text"
                placeholder="Phone Number"
                className="border p-2 w-full mb-2"
                onChange={(e) => setPhone(e.target.value)}
            />

            <textarea
                placeholder="Address"
                className="border p-2 w-full mb-2"
                onChange={(e) => setAddress(e.target.value)}
            />

            <button
                onClick={handleOrder}
                className="bg-green-600 text-white w-full py-2 rounded-lg"
            >
                Order via WhatsApp
            </button>
        </div>
    )
}
