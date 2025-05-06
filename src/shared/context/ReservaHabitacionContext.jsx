import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Crear el contexto
const ReservaHabitacionContext = createContext(null);

// Hook personalizado para consumir el contexto
export const useReservaHabitacion = () => {
  const context = useContext(ReservaHabitacionContext);
  if (!context) {
    throw new Error('useReservaHabitacion must be used within a ReservaHabitacionProvider');
  }
  return context;
};

// Proveedor del contexto
export const ReservaHabitacionProvider = ({ children }) => {

  const [reserva, setReserva] = useState(null);
  const [habitacion, setHabitacion] = useState(null);

  const guardarDatos = (datosReserva, datosHabitacion) => {
    setReserva(datosReserva);
    setHabitacion(datosHabitacion);
  };

  const limpiarDatos = () => {
    setReserva(null);
    setHabitacion(null);
  };


  return (
    <ReservaHabitacionContext.Provider value={{ reserva, habitacion, guardarDatos, limpiarDatos }}>
      {children}
    </ReservaHabitacionContext.Provider>
  );
};