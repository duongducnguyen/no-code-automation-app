import React, { useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";

// Skeleton Loader Component
const LoadingSkeleton = () => (
  <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
    <Skeleton height={40} className="mb-6" /> {/* Title */}
    <div className="space-y-6">
      <div>
        <Skeleton height={20} width={80} className="mb-2" /> {/* Label */}
        <Skeleton height={40} /> {/* Input */}
      </div>
      <div>
        <Skeleton height={20} width={80} className="mb-2" /> {/* Label */}
        <Skeleton height={40} /> {/* Input */}
      </div>
      <div>
        <Skeleton height={20} width={80} className="mb-2" /> {/* Label */}
        <Skeleton height={40} /> {/* Input */}
      </div>
      <div>
        <Skeleton height={20} width={80} className="mb-2" /> {/* Label */}
        <Skeleton height={40} /> {/* Input */}
      </div>
      <Skeleton height={45} /> {/* Button */}
      <Skeleton height={20} width={200} className="mx-auto" /> {/* Login link */}
    </div>
  </div>
);

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const { isLoading, handleRegister } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra mật khẩu và xác nhận mật khẩu
    if (formData.password !== formData.password_confirmation) 
    {
      toast.error("Mật khẩu và xác nhận mật khẩu không khớp!", {
        duration: 5000,
      });
      return;
    }

    try 
    {
      // Gọi handleRegister từ useAuth
      await handleRegister(formData.name, formData.email, formData.password, formData.password_confirmation);
    } catch {
      // Lỗi đã được xử lý trong handleRegister
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Đăng ký</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Full Name Input */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Họ và tên
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 text-sm border rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nhập họ và tên"
              required
            />
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 text-sm border rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nhập email của bạn"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 text-sm border rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nhập mật khẩu"
              required
            />
          </div>

          {/* Confirm Password Input */}
          <div>
            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              id="password_confirmation"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 text-sm border rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nhập lại mật khẩu"
              required
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? "Đang xử lý..." : "Đăng ký"}
            </button>
          </div>
        </form>

        {/* Additional Links */}
        <div className="text-sm text-center text-gray-600">
          <p>
            Đã có tài khoản?{" "}
            <a href="/login" className="text-blue-500 hover:underline">
              Đăng nhập
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;