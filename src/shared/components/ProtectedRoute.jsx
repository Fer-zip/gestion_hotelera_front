import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


// Ruta creada para proteger las demás rutas de usuarios no autenticados
const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Si no está autenticado, redirigir al login
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, renderizar las rutas anidadas
  return <Outlet />;
};

export default ProtectedRoute;