import React, { createContext, useContext, useState } from 'react';

const VariablesContext = createContext();

export const VariablesProvider = ({ children }) => {
  const [globalVariables, setGlobalVariables] = useState([]);

  return (
    <VariablesContext.Provider value={{ globalVariables, setGlobalVariables }}>
      {children}
    </VariablesContext.Provider>
  );
};

export const useVariables = () => useContext(VariablesContext);