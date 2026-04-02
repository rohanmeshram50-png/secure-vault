import React, { createContext, useState } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
    masterPassword: null,
  });

  const login = (token, masterPassword) => {
    localStorage.setItem('token', token);
    setAuth({
      token,
      isAuthenticated: true,
      masterPassword,
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuth({
      token: null,
      isAuthenticated: false,
      masterPassword: null,
    });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
