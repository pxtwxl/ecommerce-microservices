"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { use } from "react";


import api from "@/lib/axios";
import { useAuth } from "@/components/AuthContext";


const OrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const { user } = useAuth();
  const userId = user?.id;

  // Load products.json on mount
  useEffect(() => {
    fetch("/products.json")
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(() => setProducts([]));
  }, []);

  useEffect(() => {
    if (user === undefined) return; // user still loading
    if (!userId) {
      setLoading(false);
      setOrders([]);
      return;
    }
    setLoading(true);
    api.get(`ORDER-SERVICE/orders/buyer/${userId}`)
      .then((res: any) => {
        // Map productId to product name and image
        const ordersWithNames = res.data.map((order: any) => ({
          ...order,
          items: order.items?.map((item: any) => {
            const product = products.find((p: any) => p.id === item.productId);
            return {
              ...item,
              name: product ? product.name : `Product #${item.productId}`,
              image: product?.image || null,
            };
          }) || [],
        }));
        setOrders(ordersWithNames);
      })
      .catch(() => setError("Failed to fetch orders."))
      .finally(() => setLoading(false));
  }, [user, userId, products]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-3xl mx-auto mt-32 bg-white rounded-2xl shadow-lg p-8"
    >
      <h1 className="text-3xl font-bold mb-8 text-blue-700 text-center">Your Orders</h1>
      {loading ? (
        <div className="text-gray-500 text-center">Loading...</div>
      ) : !userId ? (
        <div className="text-gray-500 text-center">Please log in to view your orders.</div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : orders.length === 0 ? (
        <div className="text-gray-500 text-center">No orders found.</div>
      ) : (
        <div className="flex flex-col gap-8">
          {orders.map(order => {
            const orderTotal = order.items?.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0) || 0;
            return (
              <div key={order.id} className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
                  <div className="font-semibold text-lg text-blue-800">Order #{order.id}</div>
                  <div className="text-sm text-gray-500">{order.date ? new Date(order.date).toLocaleString() : ""}</div>
                  <div className="text-base font-bold text-green-600">Total: ${orderTotal.toFixed(2)}</div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm border-t border-b border-blue-100">
                    <thead>
                      <tr className="bg-blue-100 text-blue-800">
                        <th className="py-2 px-3 text-left">Product</th>
                        <th className="py-2 px-3 text-center">Qty</th>
                        <th className="py-2 px-3 text-center">Price</th>
                        <th className="py-2 px-3 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items && order.items.map((item: any) => (
                        <tr key={item.id} className="border-b last:border-b-0 border-blue-50 hover:bg-blue-50">
                          <td className="py-2 px-3 font-medium text-gray-700">{item.name}</td>
                          <td className="py-2 px-3 text-center">{item.quantity}</td>
                          <td className="py-2 px-3 text-center">${item.price.toFixed(2)}</td>
                          <td className="py-2 px-3 text-right font-semibold">${(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default OrdersPage;