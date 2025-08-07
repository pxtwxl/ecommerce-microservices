"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useCart } from "../../components/CartContext";
import Image from "next/image";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-2xl mx-auto mt-32 bg-white rounded-2xl shadow-lg p-8 min-h-[300px] flex flex-col items-center"
    >
      <h1 className="text-3xl font-bold mb-6 text-purple-700">Your Cart</h1>
      {cart.length === 0 ? (
        <div className="flex flex-col items-center gap-2 text-gray-500 mb-8">
          <svg width="48" height="48" fill="none" viewBox="0 0 24 24"><path stroke="#a3a3a3" strokeWidth="2" d="M6 6h15l-1.5 9h-13z"/><circle cx="9" cy="20" r="1" fill="#a3a3a3"/><circle cx="17" cy="20" r="1" fill="#a3a3a3"/></svg>
          <span>Your cart is empty.</span>
        </div>
      ) : (
        <div className="w-full mb-8 flex flex-col gap-4">
          {cart.map(item => (
            <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg shadow-sm">
              <Image src={item.image} alt={item.name} width={64} height={64} className="rounded object-cover border" />
              <div className="flex-1">
                <div className="font-semibold text-lg">{item.name}</div>
                <div className="text-gray-500 text-sm">${item.price.toFixed(2)}</div>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >-</button>
                  <span className="px-2 font-semibold">{item.quantity}</span>
                  <button
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >+</button>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="font-bold text-blue-600 text-lg">${(item.price * item.quantity).toFixed(2)}</div>
                <button
                  className="text-red-500 hover:text-red-700"
                  title="Remove from cart"
                  onClick={() => removeFromCart(item.id)}
                >
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M6 6h12M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6h12z"/></svg>
                </button>
              </div>
            </div>
          ))}
          <div className="flex justify-between items-center mt-4 font-bold text-xl border-t pt-4">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      )}
      <Link href="/checkout" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-full font-semibold shadow hover:scale-105 transition-transform">Go to Checkout</Link>
    </motion.div>
  );
}