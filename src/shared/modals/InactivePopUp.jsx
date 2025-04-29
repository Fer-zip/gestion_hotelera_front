import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
/**
 * Componente InactivePopUpWithAction que muestra un modal controlado por un componente padre.
 *
 * @param {Object} props - Las propiedades del componente.
 * @param {boolean} props.show - Controla la visibilidad del modal. Si es `true`, el modal se muestra.
 * @param {function} props.onHide - Función que se llama cuando el modal debe cerrarse.
 * @param {string} props.modalTitle - El título que se mostrará en el encabezado del modal.
 * @param {React.ReactNode} props.modalContent - El contenido que se mostrará en el cuerpo del modal. Puede ser cualquier elemento de React.
 * @param {boolean} props.haveCancellButton - Indica si se debe mostrar un botón de "Cancelar" en el pie de página del modal.
 * @param {string} props.variantActionButton - La variante de estilo para el botón de acción principal (por ejemplo, 'primary', 'danger', etc.).
 * @param {function} props.action - La función que se ejecutará cuando se haga clic en el botón de acción principal.
 * @param {string} props.textActionButton - El texto que se mostrará en el botón de acción principal.
 * @returns {React.ReactElement} El componente Modal.
 *
 * @example
 * import InactivePopUpWithAction from './shared/modals/InactivePopUpWithAction.jsx';
 * import { useState } from 'react';
 *
 * function ParentComponent() {
 *   const [showModal, setShowModal] = useState(false);
 *
 *   const handleAction = () => {
 *     alert('Acción ejecutada!');
 *     setShowModal(false); // Cerrar modal después de la acción
 *   };
 *
 *   const handleClose = () => setShowModal(false);
 *
 *   const contentModal = (
 *     <>
 *       <h4>Mensaje Importante</h4>
 *       <p>Este es el contenido del modal inactivo.</p>
 *     </>
 *   );
 *
 *   return (
 *     <>
 *       <Button onClick={() => setShowModal(true)}>Mostrar Modal Inactivo</Button>
 *
 *       <InactivePopUpWithAction
 *         show={showModal}
 *         onHide={handleClose}
 *         action={handleAction}
 *         textActionButton="Aceptar"
 *         modalTitle="Modal Inactivo"
 *         modalContent={contentModal}
 *         variantActionButton="primary"
 *         haveCancellButton={true}
 *       />
 *     </>
 *   );
 * }
 */
function InactivePopUpWithAction({ show, onHide, modalTitle, modalContent, haveCancellButton, variantActionButton, action, textActionButton }) {

  const handleActionClick = () => {
    if (action) {
      action();
    }
    onHide(); // Cerrar modal después de la acción
  };

  const handleCancelClick = () => {
    onHide(); // Cerrar modal al cancelar
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static" // Considerar si quieres que se cierre al hacer clic fuera
    >
      <Modal.Header closeButton> {/* Añadido closeButton para cerrar desde el encabezado */}
        <Modal.Title id="contained-modal-title-vcenter">
          {/* Titular para el Modal */}
          {modalTitle}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Contenido adicional para el PopUp */}
        {modalContent}
      </Modal.Body>
      <Modal.Footer>
        {/* Boton Cancelar */}
        {haveCancellButton && <Button variant='secondary' onClick={handleCancelClick}>Cancelar</Button>}
        {/* Botón de Cierre con la accion */}
        <Button variant={variantActionButton} onClick={handleActionClick}>{textActionButton}</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default InactivePopUpWithAction;