"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { motion } from "framer-motion";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const success = await login(username, password);
    setLoading(false);
    if (success) {
      router.push("/");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-md mx-auto mt-32 bg-white rounded-2xl shadow-lg p-8"
    >
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Login</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" className="border rounded px-4 py-2" value={username} onChange={e => setUsername(e.target.value)} required />
        <input type="password" placeholder="Password" className="border rounded px-4 py-2" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-full font-semibold shadow hover:scale-105 transition-transform mt-4" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      </form>
    </motion.div>
  );
}