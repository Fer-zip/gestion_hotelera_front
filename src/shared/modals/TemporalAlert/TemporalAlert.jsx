import React, { useState, useEffect } from 'react';
import Alert from 'react-bootstrap/Alert';

import styles from './TemporalAlert.module.css';

/**
 * @typedef {Object} TemporalAlertProps
 * @property {string | number} id - Identificador único de la alerta.
 * @property {string} message - Mensaje a mostrar en la alerta.
 * @property {string} variant - Variante de estilo de la alerta (ej: 'success', 'danger', 'warning', 'info').
 * @property {number} [duration=3000] - Duración en milisegundos que la alerta permanecerá visible.
 * @property {function(string | number): void} onClose - Función a ejecutar cuando la alerta se cierra.
 */

/**
 * Componente interno para mostrar una sola alerta temporal.
 * Este componente no debe usarse directamente. Utilice el hook `useTemporalAlert`
 * proporcionado por `TemporalAlertProvider`.
 *
 * @param {TemporalAlertProps} props - Las propiedades del componente.
 * @param {React.Ref<HTMLDivElement>} ref - Referencia al elemento DOM de la alerta.
 * @returns {React.ReactElement | null} Un elemento de alerta de React-Bootstrap o null si no está visible.
 */
export const TemporalAlert = React.forwardRef(({ id, message, variant, duration = 3000, onClose }, ref) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setShow(false);
    // La eliminación real del estado se maneja en onExited de CSSTransition
  };

  // No renderizamos si show es false, CSSTransition se encargará de la animación de salida
  if (!show) {
      return null;
  }

  return (
    <Alert
      ref={ref} // Pasar la referencia al elemento DOM
      variant={variant}
      onClose={handleClose}
      dismissible
      className={styles.temporalAlert}
    >
      {message}
    </Alert>
  );
});

