"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { useCart } from "../../components/CartContext";
import { useWishlist } from "../../components/WishlistContext";
import { useAuth } from "../../components/AuthContext";
import api from "@/lib/axios";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
}

export default function ProductDetailsPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
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
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      });
      // Optionally, show a toast/notification here
    }
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      // Redirect to login or show login modal
      router.push('/login');
      return;
    }

    if (product) {
      if (isInWishlist(product.id)) {
        await removeFromWishlist(product.id);
      } else {
        await addToWishlist(product.id);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-3xl mx-auto mt-32 bg-white rounded-2xl shadow-lg p-8 flex flex-col md:flex-row gap-8"
    >
      {loading ? (
        <div className="flex-1 flex items-center justify-center text-gray-400">Loading...</div>
      ) : product ? (
        <>
          <Image
            src={product.image}
            alt={product.name}
            width={320}
            height={320}
            className="rounded-xl object-cover shadow-md"
          />
          <div className="flex-1 flex flex-col gap-4">
            <h1 className="text-3xl font-bold text-purple-700">{product.name}</h1>
            <p className="text-gray-600 mb-2">{product.description}</p>
            <span className="text-2xl font-bold text-blue-600 mb-4">${product.price.toFixed(2)}</span>
            <div className="flex gap-3">
              <button
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-full font-semibold shadow hover:scale-105 transition-transform"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
              <button
                className={`px-6 py-2 rounded-full font-semibold shadow hover:scale-105 transition-transform ${
                  isInWishlist(product.id)
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={handleWishlistToggle}
              >
                {isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-400">Product not found.</div>
      )}
    </motion.div>
  );
}