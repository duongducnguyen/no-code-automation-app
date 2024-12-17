import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes"; // Import file định nghĩa route
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            theme: {
              primary: "#4aed88",
            },
          },
        }}
      />
      <AppRoutes />
    </Router>
  );
};

export default App;