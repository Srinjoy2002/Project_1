import React, { createContext, useContext, useState } from 'react';

// Create the AuthContext with a default value
export const AuthContext = createContext();

// Create a provider component for the context
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // You can initialize user data here (e.g., from local storage, API, etc.)
  // setUser(data);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using the context easily
export const useAuth = () => {
  return useContext(AuthContext);
};
