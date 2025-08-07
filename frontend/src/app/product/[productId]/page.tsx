"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { useCart } from "../../../components/CartContext";
import api from "../../../lib/axios";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  stockQuantity: number;
  category?: string;
  brand?: string;
  rating?: number;
}

export default function ProductDetailsPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    setError("");
    if (!productId) return;
    api.get(`PRODUCT-SERVICE/api/product/${productId}`)
      .then(async res => {
        const productData = res.data;
        try {
          const imgRes = await api.get(`PRODUCT-SERVICE/api/product/${productId}/image`);
          if (imgRes.data && imgRes.data.trim() !== "" && imgRes.data !== "null") {
            productData.image = `data:image/jpeg;base64,${imgRes.data}`;
          } else {
            productData.image = "/placeholder.jpg";
          }
        } catch {
          productData.image = "/placeholder.jpg";
        }
        setProduct(productData);
      })
      .catch(() => {
        setError("Product not found.");
        setProduct(null);
      })
      .finally(() => setLoading(false));
  }, [productId]);

  const handleAddToCart = () => {
    if (product && quantity > 0 && quantity <= product.stockQuantity) {
      for (let i = 0; i < quantity; i++) {
        addToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
        });
      }
      router.push("/cart");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-gray-400 text-lg">Loading...</div>
    );
  }
  if (error || !product) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-red-500 text-lg">{error || "Product not found."}</div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto mt-32 bg-white rounded-2xl shadow-lg p-8 flex flex-col md:flex-row gap-10"
    >
      <div className="flex-shrink-0 flex flex-col items-center gap-4">
        <Image
          src={product.image}
          alt={product.name}
          width={320}
          height={320}
          className="rounded-xl object-cover shadow-md border"
        />
        <div className="flex gap-2 text-yellow-400 text-lg">
          {product.rating ? (
            <>
              <span>★</span>
              <span>{product.rating}</span>
            </>
          ) : null}
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-4">
        <h1 className="text-3xl font-bold text-purple-700">{product.name}</h1>
        <div className="text-gray-500 text-sm mb-2">
          {product.category && <span>Category: {product.category} | </span>}
          {product.brand && <span>Brand: {product.brand}</span>}
        </div>
        <p className="text-gray-600 mb-2">{product.description}</p>
        <span className="text-2xl font-bold text-blue-600 mb-4">${product.price.toFixed(2)}</span>
        <div className="flex items-center gap-4 mb-4">
          <span className="font-semibold">Quantity:</span>
          <button
            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
            disabled={quantity <= 1}
          >-</button>
          <span className="px-2 font-semibold">{quantity}</span>
          <button
            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => setQuantity(q => Math.min(product.stockQuantity, q + 1))}
            disabled={quantity >= product.stockQuantity}
          >+</button>
          <span className="text-sm text-gray-400 ml-2">({product.stockQuantity} in stockQuantity)</span>
        </div>
        <button
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-full font-semibold shadow hover:scale-105 transition-transform w-fit disabled:opacity-60"
          onClick={handleAddToCart}
          disabled={product.stockQuantity === 0}
        >
          {product.stockQuantity === 0 ? "Out of stockQuantity" : "Add to Cart"}
        </button>
        <button
          className="mt-2 text-purple-500 hover:underline w-fit"
          disabled
        >
          ♥ Add to Wishlist (coming soon)
        </button>
      </div>
    </motion.div>
  );
}