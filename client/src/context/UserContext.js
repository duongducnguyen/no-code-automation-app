// src/context/UserContext.js
import { createContext, useContext, useState } from "react";

// Tạo UserContext
const UserContext = createContext();

// Provider cho UserContext
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook để sử dụng UserContext
export const useUser = () => {
  return useContext(UserContext);
};