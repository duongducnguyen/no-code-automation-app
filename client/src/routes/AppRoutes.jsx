import React from "react";
import { Route, Routes } from "react-router-dom";
import LoginPage from "../features/Auth/pages/Login";
import RegisterPage from "../features/Auth/pages/Register";
import ProtectedRoute from "./ProtectedRoute";
import UnauthorizedRoute from "./UnauthorizedRoute";
import Dashboard from "../features/Dashboard";
import { UserProvider } from "../context/UserContext";
import { VariablesProvider } from "../context/VariablesContext";

const AppRoutes = () => {
  return (
    <UserProvider>
      <VariablesProvider>
      <Routes>
        <Route element={<UnauthorizedRoute />}>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
      </VariablesProvider>
    </UserProvider>
  );
};

export default AppRoutes;
