import React from 'react';
import { Button } from 'react-bootstrap';
import { useTemporalAlert } from '../shared/context/TemporalAlertContext';

/**
 * Botón demo para probar las alertas
 * @returns 
 */
const AlertDemoButton = () => {
  const { addAlert } = useTemporalAlert();

  // Función para mostrar una alerta de demostración
  const showDemoAlert = () => {
    addAlert('Alerta para probar el uso de TemporalAlert', 'success', 5000);
  };

  return (
    <Button variant='primary' onClick={showDemoAlert}>Mostrar Alerta Temporal</Button>
  );
};

export default AlertDemoButton;