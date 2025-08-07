"use client";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  // Placeholder: order details state
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-3xl mx-auto mt-32 bg-white rounded-2xl shadow-lg p-8"
    >
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Order Details: {orderId}</h1>
      <div className="text-gray-500">Order tracking and details coming soon.</div>
    </motion.div>
  );
}