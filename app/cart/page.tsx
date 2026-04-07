"use client"

import { useCart } from "@/store/cart"

export default function CartPage() {
    const { items } = useCart()

    const total = items.reduce(
        (sum, item) => sum + item.price * item.qty,
        0
    )

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">🛒 Your Cart</h1>

            {items.length === 0 && <p>Your cart is empty</p>}

            {items.map((item) => (
                <div
                    key={item.id}
                    className="border p-4 mb-2 rounded-lg"
                >
                    <h2 className="font-semibold">{item.name}</h2>
                    <p>₹{item.price} x {item.qty}</p>
                    <p>Total: ₹{item.price * item.qty}</p>
                </div>
            ))}

            <h2 className="text-xl font-bold mt-4">
                Total: ₹{total}
            </h2>

            <a
                href="/checkout"
                className="block mt-4 bg-black text-white text-center py-2 rounded-lg"
            >
                Proceed to Checkout
            </a>
        </div>
    )
}