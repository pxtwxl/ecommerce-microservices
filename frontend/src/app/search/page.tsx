"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  // Placeholder: search results state
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-5xl mx-auto mt-32 p-8"
    >
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Search Products</h1>
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search for products..."
        className="w-full border rounded px-4 py-2 mb-8"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {/* Placeholder for search results */}
        <div className="col-span-full text-center text-gray-500">No results found.</div>
      </div>
    </motion.div>
  );
}