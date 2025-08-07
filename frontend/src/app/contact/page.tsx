"use client";
import { motion } from "framer-motion";

export default function ContactPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-2xl mx-auto mt-32 bg-white rounded-2xl shadow-lg p-8"
    >
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Contact Us</h1>
      <form className="flex flex-col gap-4">
        <input type="text" placeholder="Your Name" className="border rounded px-4 py-2" />
        <input type="email" placeholder="Your Email" className="border rounded px-4 py-2" />
        <textarea placeholder="Your Message" className="border rounded px-4 py-2 min-h-[100px]" />
        <button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-full font-semibold shadow hover:scale-105 transition-transform mt-4">Send Message</button>
      </form>
    </motion.div>
  );
}