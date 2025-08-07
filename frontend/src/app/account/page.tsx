"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../components/AuthContext";
import { useRouter } from "next/navigation";
import api from "../../lib/axios";
import Image from "next/image";

interface UserProfile {
  id: number;
  username: string;
  email: string;
  role: string;
  address: string;
  phone: string;
  profileImg?: string;
  profileImgName?: string;
  profileImgType?: string;
}

export default function AccountPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [formData, setFormData] = useState<UserProfile>({
    id: 0,
    username: "",
    email: "",
    role: "",
    address: "",
    phone: ""
  });

  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id || 0,
        username: user.username || "",
        email: user.email || "",
        role: user.role || "",
        address: user.address || "",
        phone: user.phone || "",
        profileImg: user.profileImg,
        profileImgName: user.profileImgName,
        profileImgType: user.profileImgType
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('user', JSON.stringify(formData));

      if (profileImage) {
        formDataToSend.append('imageFile', profileImage);
      }

      await api.put(`PRODUCT-SERVICE/user/profile/${user.id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setIsEditing(false);
      setProfileImage(null);
      // Refresh the page to get updated user data
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Please log in to view your account</h2>
          <button
            onClick={() => router.push("/login")}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto mt-32 bg-white rounded-2xl shadow-lg p-8"
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-purple-700">Your Account</h1>
        <div className="flex gap-4">
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Edit Profile
            </button>
          )}
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Profile Image Section */}
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            {formData.profileImg ? (
              <Image
                src={`data:${formData.profileImgType};base64,${formData.profileImg}`}
                alt="Profile"
                width={150}
                height={150}
                className="rounded-full object-cover border-4 border-purple-200"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-4xl text-gray-500">
                  {formData.username?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {isEditing && (
            <div className="text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              />
              <p className="text-xs text-gray-500 mt-2">Upload a new profile image</p>
            </div>
          )}
        </div>

        {/* Profile Information */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              ) : (
                <p className="text-gray-900 font-medium">{formData.username}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              ) : (
                <p className="text-gray-900">{formData.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <p className="text-gray-900 capitalize">{formData.role}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              ) : (
                <p className="text-gray-900">{formData.phone || "Not provided"}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              ) : (
                <p className="text-gray-900">{formData.address || "Not provided"}</p>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-4 pt-4">
              <button
                onClick={handleSave}
                disabled={loading}
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setProfileImage(null);
                  // Reset form data to original user data
                  if (user) {
                    setFormData({
                      id: user.id || 0,
                      username: user.username || "",
                      email: user.email || "",
                      role: user.role || "",
                      address: user.address || "",
                      phone: user.phone || "",
                      profileImg: user.profileImg,
                      profileImgName: user.profileImgName,
                      profileImgType: user.profileImgType
                    });
                  }
                }}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Account Actions */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Actions</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <button
            onClick={() => router.push("/orders")}
            className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors text-left"
          >
            <div className="font-semibold">View Orders</div>
            <div className="text-sm opacity-90">Check your order history</div>
          </button>

          <button
            onClick={() => router.push("/wishlist")}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors text-left"
          >
            <div className="font-semibold">Wishlist</div>
            <div className="text-sm opacity-90">View your saved items</div>
          </button>
        </div>
      </div>
    </motion.div>
  );
}