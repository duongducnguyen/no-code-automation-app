import React from "react";
import { Route, Routes } from "react-router-dom";
import LoginPage from "../features/Auth/pages/Login";
import RegisterPage from "../features/Auth/pages/Register";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "../features/Dashboard";
import { UserProvider } from "../context/UserContext";

const AppRoutes = () => {
  return (
    <UserProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Dashboard />} />
        </Route>
      </Routes>
    </UserProvider>
  );
};

export default AppRoutes;
