"use client";
import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import api from "@/lib/axios";

export interface WishlistItem {
  id: number;
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
    description: string;
    brand: string;
    category: string;
  };
  addedAt: string;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (productId: number) => Promise<boolean>;
  removeFromWishlist: (productId: number) => Promise<boolean>;
  isInWishlist: (productId: number) => boolean;
  refreshWishlist: () => Promise<void>;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, token } = useAuth();
  const isMounted = useRef(false);

  const refreshWishlist = async () => {
    if (!token || !user) {
      setWishlist([]);
      return;
    }

    setLoading(true);
    try {
      const response = await api.get("WISHLIST-SERVICE/api/wishlist");
      setWishlist(response.data);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  // Load wishlist when user logs in
  useEffect(() => {
    if (token && user) {
      refreshWishlist();
    } else {
      setWishlist([]);
    }
    isMounted.current = true;
  }, [token, user]);

  const addToWishlist = async (productId: number): Promise<boolean> => {
    if (!token || !user) {
      return false;
    }

    try {
      await api.post(`WISHLIST-SERVICE/api/wishlist/${productId}`);
      await refreshWishlist();
      return true;
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      return false;
    }
  };

  const removeFromWishlist = async (productId: number): Promise<boolean> => {
    if (!token || !user) {
      return false;
    }

    try {
      await api.delete(`WISHLIST-SERVICE/api/wishlist/${productId}`);
      await refreshWishlist();
      return true;
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      return false;
    }
  };

  const isInWishlist = (productId: number): boolean => {
    return wishlist.some(item => item.product.id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        refreshWishlist,
        loading
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};