"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import api from "@/lib/axios";

interface AuthContextType {
  user: any;
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (user: { username: string; password: string; email?: string }) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    console.log("AuthContext: useEffect running...");
    const storedToken = localStorage.getItem("token");
    console.log("AuthContext: Stored token:", storedToken);

    if (storedToken) {
      setToken(storedToken);
      console.log("AuthContext: Fetching user profile...");
      // Fetch user profile if token exists
      api.get("USER-SERVICE/user/profile")
        .then(res => {
          console.log("AuthContext: User ID fetched successfully:", res.data);
          // The backend returns just the user ID, so we need to fetch the full user object
          return api.get(`USER-SERVICE/user/profile/${res.data}`);
        })
        .then(res => {
          console.log("AuthContext: Full user profile fetched successfully:", res.data);
          setUser(res.data);
        })
        .catch((error) => {
          console.error("AuthContext: Error fetching user profile:", error);
          setUser(null);
        });
    } else {
      console.log("AuthContext: No stored token found");
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const res = await api.post("USER-SERVICE/user/login", { username, password });
      if (res.data && res.data !== "Login Failed") {
        setToken(res.data);
        localStorage.setItem("token", res.data);
        // Fetch user profile after login
        const profileRes = await api.get("USER-SERVICE/user/profile");
        const userId = profileRes.data;
        const userRes = await api.get(`USER-SERVICE/user/profile/${userId}`);
        setUser(userRes.data);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const register = async (userObj: { username: string; password: string; email?: string }) => {
    try {
      await api.post("USER-SERVICE/user/register", userObj);
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};