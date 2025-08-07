"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useCart } from "./CartContext";
import { useWishlist } from "./WishlistContext";
import { useAuth } from "./AuthContext";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  brand?: string;
  category?: string;
}

interface ProductCardProps {
  product: Product;
  showWishlist?: boolean;
  className?: string;
}

export default function ProductCard({ product, showWishlist = true, className = "" }: ProductCardProps) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      window.location.href = '/login';
      return;
    }
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  const handleCardClick = () => {
    window.location.href = `/product/${product.id}`;
  };

  return (
    <motion.div
      whileHover={{ scale: 1.04, boxShadow: "0 8px 32px rgba(80,0,200,0.12)" }}
      className={`bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center transition-all duration-300 cursor-pointer ${className}`}
      onClick={handleCardClick}
    >
      <div className="relative w-full">
        <Image
          src={product.image}
          alt={product.name}
          width={220}
          height={220}
          className="rounded-xl object-cover mb-4 shadow-md w-full h-48"
          onClick={e => { e.stopPropagation(); handleCardClick(); }}
        />
        {showWishlist && (
          <button
            className={`absolute top-2 right-2 p-2 rounded-full shadow-md transition-all duration-200 ${
              isInWishlist(product.id)
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
            onClick={handleWishlistToggle}
          >
            {isInWishlist(product.id) ? '❤️' : '🤍'}
          </button>
        )}
      </div>

      <h2 className="text-xl font-semibold mb-2 text-gray-800 text-center">{product.name}</h2>
      {product.brand && (
        <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
      )}
      <p className="text-gray-500 mb-4 text-center line-clamp-2">{product.description}</p>
      <span className="text-lg font-bold text-purple-600 mb-4">${product.price.toFixed(2)}</span>

      <div className="flex gap-2 w-full">
        <button
          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full font-semibold shadow hover:scale-105 transition-transform text-sm"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
        {showWishlist && (
          <button
            className={`px-3 py-2 rounded-full font-semibold shadow hover:scale-105 transition-transform text-sm ${
              isInWishlist(product.id)
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={handleWishlistToggle}
          >
            {isInWishlist(product.id) ? 'Remove' : 'Wishlist'}
          </button>
        )}
      </div>
    </motion.div>
  );
}