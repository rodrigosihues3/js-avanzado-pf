import React, { createContext, useContext, useState, useEffect } from 'react';
import { usuariosAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Cargar usuario del localStorage al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await usuariosAPI.login({ email, password });
      const userData = response.data;
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true, user: userData };
    } catch (error) {
      console.error('Error en login:', error);
      return { success: false, error: error.response?.data?.error || 'Credenciales incorrectas' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await usuariosAPI.registrar({
        nombre: userData.nombre,
        email: userData.email,
        telefono: userData.telefono,
        password: userData.password || 'password123',
        pedidos: 0,
        activo: true,
        esAdmin: false
      });
      
      const newUser = response.data;
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(newUser));
      return { success: true };
    } catch (error) {
      console.error('Error en registro:', error);
      return { success: false, error: error.response?.data?.error || 'Error al registrar usuario' };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
