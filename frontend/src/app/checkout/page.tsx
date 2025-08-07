"use client";
import { motion } from "framer-motion";
import { useCart } from "@/components/CartContext";
import { useState } from "react";
import api from "@/lib/axios";

export default function CheckoutPage() {
  const { cart } = useCart();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("USER-SERVICE/api/payment/create-stripe-session", {
        cartItems: cart.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        }))
      });
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (err) {
      alert("Failed to start payment session.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-xl mx-auto mt-32 bg-white rounded-2xl shadow-lg p-8 min-h-[300px]"
    >
      <h1 className="text-3xl font-bold mb-6 text-purple-700">Checkout</h1>
      <form className="flex flex-col gap-4" onSubmit={handleCheckout}>
        <input type="text" placeholder="Full Name" className="border rounded px-4 py-2" required />
        <input type="email" placeholder="Email Address" className="border rounded px-4 py-2" required />
        <input type="text" placeholder="Shipping Address" className="border rounded px-4 py-2" required />
        <button type="submit" disabled={loading} className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-full font-semibold shadow hover:scale-105 transition-transform mt-4 disabled:opacity-60">
          {loading ? "Redirecting..." : "Place Order & Pay"}
        </button>
      </form>
    </motion.div>
  );
}