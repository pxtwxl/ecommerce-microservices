"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/components/AuthContext";
import { useCart } from "@/components/CartContext";
import { useWishlist } from "@/components/WishlistContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { token, logout } = useAuth();
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full bg-white/80 backdrop-blur shadow-md fixed top-0 left-0 z-50 px-8 py-4 flex items-center justify-between"
    >
      <Link href="/" className="text-2xl font-display font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
        ShopEase
      </Link>
      <div className="flex gap-8 items-center text-lg font-medium">
        <Link href="/" className="hover:text-purple-600 transition-colors">Home</Link>
        <Link href="/cart" className="hover:text-purple-600 transition-colors relative">
          Cart
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </Link>
        <Link href="/wishlist" className="hover:text-purple-600 transition-colors relative">
          Wishlist
          {wishlist.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {wishlist.length}
            </span>
          )}
        </Link>
        <Link href="/orders" className="hover:text-purple-600 transition-colors">Orders</Link>
        {token ? (
          <Link href="/account" className="hover:text-purple-600 transition-colors">Account</Link>
        ) : (
          <span className="text-gray-400 cursor-not-allowed">Account</span>
        )}
        {!token ? (
          <>
            <Link href="/login" className="hover:text-blue-600 transition-colors">Login</Link>
            <Link href="/register" className="hover:text-blue-600 transition-colors">Register</Link>
          </>
        ) : (
          <button onClick={handleLogout} className="text-red-500 hover:text-red-700 transition-colors">Logout</button>
        )}
      </div>
    </motion.nav>
  );
}