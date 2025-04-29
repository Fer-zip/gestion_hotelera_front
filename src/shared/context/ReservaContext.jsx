import React, { createContext, useState, useContext } from 'react';

const ReservaContext = createContext();

export const useReserva = () => {
  return useContext(ReservaContext);
};

export const ReservaProvider = ({ children }) => {
  const [reservaData, setReservaData] = useState({
    cliente: null,
    habitacion: null,
    servicios: [],
    diasEstadia: 1,
    numeroPersonas: 1
    
  });
  
  // Esto es secuencial, primero irá a solicitar datos de cliente, luego de habitacion, despues
  // servicios añadidos y por ultimo el resumen otal
  // 1: Cliente, 2: Habitacion, 3: Servicios, 4: Resumen
  const [currentStep, setCurrentStep] = useState(1); 

  const updateReservaData = (newData) => {
    setReservaData(prevData => ({ ...prevData, ...newData }));
  };

  const nextStep = () => {
    setCurrentStep(prevStep => prevStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(prevStep => prevStep - 1);
  };

  const resetReserva = () => {
    setReservaData({
      cliente: null,
      habitacion: null,
      servicios: [],
      diasEstadia: 1,
      numeroPersonas: 1
    });
    setCurrentStep(1);
  };

  return (
    <ReservaContext.Provider value={{ reservaData, updateReservaData, currentStep, nextStep, prevStep, resetReserva }}>
      {children}
    </ReservaContext.Provider>
  );
};