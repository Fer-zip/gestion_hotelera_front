import React, { createContext, useContext, useState } from "react";
import ReactDOM from 'react-dom';
import styles from '../modals/TemporalAlert/TemporalAlert.module.css';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { TemporalAlert } from "../modals/TemporalAlert/TemporalAlert";

/**
 * @typedef {Object} TemporalAlertContextType
 * @property {function(string, string, number): void} addAlert - Función para añadir una nueva alerta temporal.
 */

// Context para manejar las alertas
const TemporalAlertContext = createContext(undefined);

/**
 * Hook personalizado para acceder a la funcionalidad de añadir alertas temporales.
 * Debe ser utilizado dentro de un componente envuelto por `TemporalAlertProvider`.
 *
 * @returns {TemporalAlertContextType} Un objeto con la función `addAlert`.
 * @throws {Error} Si se utiliza fuera de un `TemporalAlertProvider`.
 *
 * @example
 * import { useTemporalAlert } from './shared/context/TemporalAlertContext';
 *
 * function MyComponent() {
 *   const { addAlert } = useTemporalAlert();
 *
 *   const handleClick = () => {
 *     addAlert('¡Operación exitosa!', 'success', 4000); // Muestra una alerta de éxito por 4 segundos
 *     addAlert('Advertencia: Algo salió mal.', 'warning'); // Muestra una alerta de advertencia por la duración por defecto (3 segundos)
 *   };
 *
 *   return (
 *     <button onClick={handleClick}>Mostrar Alertas</button>
 *   );
 * }
 */
function useTemporalAlert(){
  const context = useContext(TemporalAlertContext);
  if (context === undefined) {
    console.error("useTemporalAlert debe ser usado dentro de un TemporalAlertProvider");
    // Retornar un objeto dummy para evitar errores si no se usa dentro del provider
    return { addAlert: () => console.error("TemporalAlertProvider no encontrado") };
  }
  return context;
};

/**
 * Proveedor para el contexto de alertas temporales.
 * Este componente debe envolver la parte de la aplicación donde se necesiten mostrar alertas temporales.
 * Renderiza las alertas en un portal en el body del documento.
 *
 * @param {Object} props - Las propiedades del componente.
 * @param {React.ReactNode} props.children - Los componentes hijos que tendrán acceso al contexto de alertas.
 * @returns {React.ReactElement} El proveedor con los componentes hijos y el portal de alertas.
 */
const TemporalAlertProvider = ({ children }) => {
    const [alerts, setAlerts] = useState([]);
  
    /**
    /**
     * Añade una nueva alerta temporal a la cola para ser mostrada.
     *
     * @param {string} message - El mensaje principal que se mostrará dentro de la alerta.
     * @param {string} [variant='success'] - La variante de estilo de la alerta de React-Bootstrap. Puede ser 'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', o 'dark'. Por defecto es 'success'.
     * @param {number} [duration=3000] - La duración en milisegundos que la alerta permanecerá visible antes de desaparecer automáticamente. Por defecto son 3000ms (3 segundos).
     */
    const addAlert = (message, variant = 'success', duration = 3000) => {
      const id = Date.now() + Math.random(); // Usar Date.now() + Math.random() para un ID más único
      // Para poder apilar las Alerts realizadas
      setAlerts((prevAlerts) => [
        ...prevAlerts,
        { id, message, variant, duration },
      ]);
    };
  
    const removeAlert = (id) => {
      setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
    };
  
    return (
      <TemporalAlertContext.Provider value={{ addAlert }}>
        {children}
        {/* Renderizar alertas fuera del flujo principal usando un portal */}
        {ReactDOM.createPortal(
          <div className={styles.temporalAlertContainer}>
            <TransitionGroup>
              {alerts.map((alert) => (
                <CSSTransition
                  key={alert.id}
                  timeout={300} 
                  classNames={{
                      enter: styles['temporalAlert-enter'],
                      enterActive: styles['temporalAlert-enter-active'],
                      exit: styles['temporalAlert-exit'],
                      exitActive: styles['temporalAlert-exit-active'],
                  }}
                  onExited={() => removeAlert(alert.id)} // Eliminar del estado después de la animación de salida
                  nodeRef={React.createRef()}
                >
                  <TemporalAlert
                    id={alert.id}
                    message={alert.message}
                    variant={alert.variant}
                    duration={alert.duration}
                    onClose={removeAlert} // Pasar removeAlert para que la alerta individual pueda iniciar el proceso de cierre
                    ref={React.createRef()} 
                  />
                </CSSTransition>
              ))}
            </TransitionGroup>
          </div>,
          document.body // Añadir al contenido
        )}
      </TemporalAlertContext.Provider>
    );
  };

export {TemporalAlertProvider, useTemporalAlert};