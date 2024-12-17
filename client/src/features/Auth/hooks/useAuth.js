import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, logout, register } from "../../../services/authService";
import toast from "react-hot-toast";

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Xử lý đăng nhập
  const handleLogin = async (email, password) => 
  {
    setIsLoading(true);

    try {
      const response = await login(email, password);

      // Lưu token và thông tin user vào localStorage
      localStorage.setItem("token", response.access_token);

      // Hiển thị toast thành công
      toast.success("Đăng nhập thành công!", {
        duration: 5000, // Hiển thị trong 5 giây
      });

      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Có lỗi xảy ra!";
      // Hiển thị toast thất bại
      toast.error(errorMessage, {
        duration: 5000, // Hiển thị trong 5 giây
      });

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý đăng ký
  const handleRegister = async (name, email, password, password_confirmation) => 
  {
    setIsLoading(true);

    try {
      // Gọi API đăng ký
      const response = await register(name, email, password, password_confirmation);

      // Hiển thị toast thành công
      toast.success("Đăng ký thành công! Vui lòng đăng nhập.", {
        duration: 5000, // Hiển thị trong 5 giây
      });

      // Điều hướng đến trang đăng nhập
      navigate("/login");

      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Có lỗi xảy ra!";
      // Hiển thị toast thất bại
      toast.error(errorMessage, 
      {
        duration: 5000, // Hiển thị trong 5 giây
      });

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý đăng xuất
  const handleLogout = async () => {
    await logout();
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Hiển thị toast thành công
    toast.success("Đăng xuất thành công!", {
      duration: 5000, // Hiển thị trong 5 giây
    });

    // Điều hướng đến trang login
    navigate("/login");
  };

  return {
    isLoading,
    handleLogin,
    handleRegister, // Thêm handleRegister vào đây
    handleLogout,
  };
};