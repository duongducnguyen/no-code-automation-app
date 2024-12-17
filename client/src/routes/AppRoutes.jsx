import React from "react";
import { Route, Routes } from "react-router-dom";
import LoginPage from "../features/Auth/pages/Login";
import RegisterPage from "../features/Auth/pages/Register";

const AppRoutes = () => {
  return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* Thêm các route khác tại đây */}
      </Routes>
  );
};

export default AppRoutes;