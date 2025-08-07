"use client";
import { motion } from "framer-motion";
import { useWishlist } from "@/components/WishlistContext";
import { useCart } from "@/components/CartContext";
import { useAuth } from "@/components/AuthContext";
import Image from "next/image";
import { useState, useEffect } from "react";
import api from "@/lib/axios";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, loading } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [removeError, setRemoveError] = useState<string>("");
  const [images, setImages] = useState<{ [key: number]: string }>({});
  const [localWishlist, setLocalWishlist] = useState(wishlist);
  // Load images for wishlist products using the same logic as product page
  useEffect(() => {
    setLocalWishlist(wishlist);
    const fetchImages = async () => {
      const newImages: { [key: number]: string } = {};
      await Promise.all(
        wishlist.map(async (item) => {
          const product = item.product;
          if (!product || product.id === undefined || product.id === null) {
            console.warn("Invalid product id in wishlist item:", item);
            return;
          }
          try {
            const res = await api.get(`PRODUCT-SERVICE/api/product/${encodeURIComponent(product.id)}/image`, { responseType: 'text' });
            const data = res.data;
            if (data && data.trim() !== "" && data !== "null") {
              newImages[product.id] = `data:image/jpeg;base64,${data}`;
            } else {
              newImages[product.id] = "/placeholder.jpg";
            }
          } catch (err) {
            if (typeof err === "object" && err !== null && "response" in err && err.response && typeof err.response === "object" && "status" in err.response) {
              // @ts-ignore
              console.warn(`Image fetch failed for product id ${product.id}:`, err.response.status);
            } else {
              console.warn(`Error fetching image for product id ${product.id}:`, err);
            }
            newImages[product.id] = "/placeholder.jpg";
          }
        })
      );
      setImages(newImages);
    };
    if (wishlist.length > 0) fetchImages();
  }, [wishlist]);

  const handleRemoveFromWishlist = async (wishlistId: number) => {
    setRemoveError("");
    setRemovingId(wishlistId);
    try {
      // Get token from localStorage or AuthContext
      let token = null;
      if (typeof window !== "undefined") {
        token = localStorage.getItem("token");
      }
      if (!token && user && user.token) {
        token = user.token;
      }
      if (!token) {
        setRemoveError("Not authenticated. Please log in again.");
        setRemovingId(null);
        return;
      }
      console.log("Attempting to remove from wishlist:", { wishlistId, token });
      await api.delete(`WISHLIST-SERVICE/api/wishlist/${wishlistId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Update local wishlist state immediately
      setLocalWishlist((prev) => prev.filter((item) => item.id !== wishlistId));
    } catch (err) {
      console.error("Error removing from wishlist:", err);
      setRemoveError("Failed to remove item from wishlist. Please try again.");
    } finally {
      setRemovingId(null);
    }
  };

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
  };

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto mt-32 bg-white rounded-2xl shadow-lg p-8"
      >
        <h1 className="text-3xl font-bold mb-6 text-purple-700">Your Wishlist</h1>
        <div className="text-gray-500">Please log in to view your wishlist.</div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-6xl mx-auto mt-32 bg-white rounded-2xl shadow-lg p-8"
    >
      <h1 className="text-3xl font-bold mb-6 text-purple-700">Your Wishlist</h1>

      {removeError && (
        <div className="mb-4 text-center text-red-500 font-medium">{removeError}</div>
      )}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Loading your wishlist...</div>
        </div>
      ) : localWishlist.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">Your wishlist is empty.</div>
          <p className="text-sm text-gray-400">Start adding products to your wishlist to see them here!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {localWishlist.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative">
                <Image
                  src={images[item.product.id] || "/placeholder.jpg"}
                  alt={item.product.name}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover rounded-t-xl"
                />
                <button
                  onClick={() => handleRemoveFromWishlist(item.id)}
                  disabled={removingId === item.id}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {removingId === item.product.id ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </button>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-800 mb-2">{item.product.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{item.product.brand}</p>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{item.product.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl font-bold text-blue-600">${item.product.price.toFixed(2)}</span>
                  <span className="text-xs text-gray-400">
                    Added {new Date(item.addedAt).toLocaleDateString()}
                  </span>
                </div>

                <button
                  onClick={() => handleAddToCart(item.product)}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-4 rounded-lg font-semibold hover:scale-105 transition-transform"
                >
                  Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}