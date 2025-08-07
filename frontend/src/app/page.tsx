"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import api from "@/lib/axios";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("PRODUCT-SERVICE/api/products");
        const productsWithImages = await Promise.all(
          res.data.map(async (product: Product) => {
            try {
              const imgRes = await api.get(`PRODUCT-SERVICE/api/product/${product.id}/image`
              );
              if (imgRes.data && imgRes.data.trim() !== "" && imgRes.data !== "null") {
                const imageUrl = `data:image/jpeg;base64,${imgRes.data}`;
                return { ...product, image: imageUrl };
              } else {
                throw new Error("Invalid image data");
              }
            } catch (error) {
              // fallback to placeholder
              return { ...product, image: "/placeholder.jpg" };
            }
          })
        );
        setProducts(productsWithImages);
      } catch (err) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex flex-col items-center justify-center p-6">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-8 drop-shadow-lg"
      >
        Shop the Future
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="text-lg text-gray-700 mb-12 max-w-xl text-center"
      >
        Discover the best products with stunning visuals and smooth animations. Powered by Next.js, Tailwind CSS, and Framer Motion.
      </motion.p>
      <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full flex justify-center items-center h-40">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full"
            />
          </div>
        ) : products.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">No products found.</div>
        ) : (
          products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </div>
  );
}
