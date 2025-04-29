import React from 'react';
import { useReserva } from '../../../shared/context/ReservaContext';
import NuevaReservacion from './NuevaReservacion';
import SeleccionarHabitacion from './SeleccionarHabitacion';
import SeleccionServicios from './SeleccionServicios';
import ResumenReservacion from './ResumenReservacion';

const NuevaReservacionContainer = () => {
  const { currentStep } = useReserva();

  switch (currentStep) {
    case 1:
      return <NuevaReservacion />;
    case 2:
      return <SeleccionarHabitacion />;
    case 3:
      return <SeleccionServicios />;
    case 4:
      return <ResumenReservacion />;
    default:
      return <NuevaReservacion />; // O manejar un estado de error
  }
};

export default NuevaReservacionContainer;