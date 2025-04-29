import React, { createContext, useState, useContext } from 'react';
import { loginAuth } from '../../services/auth';
import { useTemporalAlert } from './TemporalAlertContext';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const {addAlert} = useTemporalAlert()
  const navigate = useNavigate();

  const login = async (credenciales) => {
   // Funcionalidad para login: Por ahora debemos cambiar el endpoint a nombreUsuario
    const userData = await loginAuth(
      {
        "correo_admin": credenciales.nombreUsuario,
        "pass_admin": credenciales.contrasena
      }
    )

    // Si no valida al usuario me retorna un mensaje
    if(!userData.mensaje){
      setIsAuthenticated(true);
      setUser(userData[0]); 

      localStorage.setItem('user', JSON.stringify(userData[0]));
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/')
    }else{
      addAlert("Nombre de usuario ó contraseña incorrectos", "danger")
    }

  };

  const logout = () => {
    // logout 
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
  };

  useState(() => {
    const storedUser = localStorage.getItem('user');
    const storedAuth = localStorage.getItem('isAuthenticated');
    if (storedUser && storedAuth === 'true') {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);


  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};