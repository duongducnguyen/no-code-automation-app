import React, { useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useAuth } from "../hooks/useAuth";

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
      <Skeleton height={45} /> {/* Button */}
      <Skeleton height={20} width={200} className="mx-auto" />{" "}
      {/* Register link */}
    </div>
  </div>
);

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { isLoading, handleLogin } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleLogin(formData.email, formData.password);
    } catch {}
  };

  if (isLoading) 
  {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">

      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Đăng nhập
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 text-sm border rounded-md focus:ring-blue-500 focus:border-blue-500 border-gray-300 }"
              placeholder="Nhập email của bạn"
            />
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 text-sm border rounded-md focus:ring-blue-500 focus:border-blue-500 border-gray-300"
              placeholder="Nhập mật khẩu"
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white transition-colors bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              Đăng nhập
            </button>
          </div>
        </form>

        {/* Additional Links */}
        <div className="text-sm text-center text-gray-600">
          <p>
            Chưa có tài khoản?{" "}
            <a href="/register" className="text-blue-500 hover:underline">
              Đăng ký
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
