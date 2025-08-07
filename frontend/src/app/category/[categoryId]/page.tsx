"use client";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

export default function CategoryPage() {
  const { categoryId } = useParams();
  // Placeholder: category products state
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-5xl mx-auto mt-32 p-8"
    >
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Category: {categoryId}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {/* Placeholder for category products */}
        <div className="col-span-full text-center text-gray-500">No products found in this category.</div>
      </div>
    </motion.div>
  );
}