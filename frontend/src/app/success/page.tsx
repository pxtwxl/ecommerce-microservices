"use client";
import { useEffect, useRef } from "react";
import { useCart } from "../../components/CartContext";
import { useAuth } from "../../components/AuthContext";
import api from "../../lib/axios";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function SuccessPage() {
  const router = useRouter();
  const { clearCart, cart } = useCart();
  const { user, token } = useAuth();
  const hasProcessed = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    console.log("Success page useEffect running...");
    console.log("User:", user);
    console.log("User type:", typeof user);
    console.log("User keys:", user ? Object.keys(user) : "null");
    console.log("User.id:", user?.id);
    console.log("User.getId:", user?.getId);
    console.log("Token:", token);
    console.log("Cart:", cart);
    console.log("hasProcessed.current:", hasProcessed.current);

    // Check localStorage directly
    const storedToken = localStorage.getItem("token");
    const storedCart = localStorage.getItem("cart");
    console.log("Direct localStorage check:");
    console.log("- Token:", storedToken);
    console.log("- Cart:", storedCart);

    // Wait for AuthContext to finish loading
    if (!token && storedToken) {
      console.log("AuthContext still loading, waiting...");
      return; // Don't proceed yet
    }

    // Wait for user to be loaded
    if (!user || !user.id) {
      console.log("User not loaded yet, waiting...");
      return;
    }

    if (hasProcessed.current) {
      console.log("Already processed, returning...");
      return;
    }
    hasProcessed.current = true;

    const saveOrder = async () => {
      console.log("saveOrder function called");
      console.log("Cart length:", cart.length);
      console.log("User ID:", user?.id);
      console.log("Full user object:", JSON.stringify(user, null, 2));

      if (cart.length > 0 && user?.id) {
        console.log("Conditions met, saving order...");
        try {
          console.log("Saving order to backend...", {
            buyerId: user.id,
            items: cart.map(item => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price
            }))
          });

          await api.post("ORDER-SERVICE/orders/checkout", {
            buyerId: user.id, // Changed from userId to buyerId
            items: cart.map(item => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price
            }))
          });

          console.log("Order saved successfully!");
        } catch (e) {
          console.error("Error saving order:", e);
          // Optionally handle error
        }
      } else {
        console.log("Conditions not met for saving order:");
        console.log("- Cart length > 0:", cart.length > 0);
        console.log("- User ID exists:", !!user?.id);
        console.log("- User object exists:", !!user);
      }
      timerRef.current = setTimeout(() => {
        clearCart();
        router.push("/");
      }, 2500);
    };
    saveOrder();
    // Only clear timer on unmount
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [user, token, cart]); // Add dependencies back to re-run when they change

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-xl mx-auto mt-32 bg-white rounded-2xl shadow-lg p-8 min-h-[300px] flex flex-col items-center justify-center"
    >
      <h1 className="text-3xl font-bold mb-6 text-green-600">Order Placed Successfully!</h1>
      <p className="text-lg text-gray-700">Thank you for your purchase. Redirecting to homepage...</p>
    </motion.div>
  );
}
