// src/routes/ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { getUserInfo } from "../services/authService";
import Loading from "../components/Loading"; // Import Loading Component

const ProtectedRoute = () => 
{
  const { user, setUser } = useUser(); // Lấy thông tin user từ UserContext
  const [isLoading, setIsLoading] = useState(true); // Trạng thái tải
  const token = localStorage.getItem("token");

  useEffect(() => {
    const verifyToken = async () => 
      {
      if (token && !user) {
        try {
          const response = await getUserInfo(); // Gọi API để kiểm tra token
          setUser(response.user); // Lưu thông tin người dùng vào context nếu token hợp lệ
        } catch (error) {
          localStorage.removeItem("token"); // Xóa token nếu không hợp lệ
        }
      }
      setIsLoading(false); // Kết thúc trạng thái tải
    };

    verifyToken();
  }, [token, user, setUser]);

  // Hiển thị Loading Component trong khi đang kiểm tra token
  if (isLoading) {
    return <Loading />;
  }

  // Nếu không có token hoặc token không hợp lệ, điều hướng về trang đăng nhập
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Nếu token hợp lệ, hiển thị nội dung của route
  return <Outlet />;
};

export default ProtectedRoute;