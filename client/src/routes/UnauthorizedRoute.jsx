import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { getUserInfo } from "../services/authService";
import Loading from "../components/Loading";

const UnauthorizedRoute = () => {
  const { user, setUser } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const verifyToken = async () => {
      if (token && !user) {
        try {
          const response = await getUserInfo();
          setUser(response.user);
        } catch (error) {
          localStorage.removeItem("token");
        }
      }
      setIsLoading(false);
    };

    verifyToken();
  }, [token, user, setUser]);

  if (isLoading) {
    return <Loading />;
  }

  // Nếu đã xác thực, chuyển hướng về dashboard
  if (token && user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Nếu chưa xác thực, cho phép truy cập route
  return <Outlet />;
};

export default UnauthorizedRoute;