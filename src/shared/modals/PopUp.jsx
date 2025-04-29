import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';


/**
 * Componente PopUp que muestra un modal con un título, contenido y un botón de cierre.
 *
 * @param {Object} props - Las propiedades del componente.
 * @param {string} props.modalTitle - El título que se mostrará en el encabezado del modal.
 * @param {React.ReactNode} props.modalContent - El contenido que se mostrará en el cuerpo del modal. Puede ser cualquier elemento de React.
 * @param {string} props.variantCloseButton - La variante de estilo para el botón de cierre (por ejemplo, 'secondary', 'danger', etc.).
 * @param {string} props.textCloseButton - El texto que se mostrará en el botón de cierre.
 * @param {string} props.variantShowModalButton - La variante de estilo para el botón que activa la apertura del modal.
 * @param {string} props.textShowModalButton - El texto que se mostrará en el botón que activa la apertura del modal.
 * @returns {React.ReactElement} Un fragmento de React que contiene el botón para mostrar el modal y el componente Modal.
 *
 * @example
 * import PopUp from './shared/modals/PopUp.jsx';
 *
 * function MyComponent() {
 *   const contentModal = (
 *     <>
 *       <h4>Título del Contenido</h4>
 *       <p>Este es el contenido del modal.</p>
 *     </>
 *   );
 *
 *   return (
 *     <PopUp
 *       modalTitle="Título del Modal"
 *       variantCloseButton="secondary"
 *       textCloseButton="Cerrar"
 *       variantShowModalButton="primary"
 *       textShowModalButton="Abrir Modal"
 *       modalContent={contentModal}
 *     />
 *   );
 * }
 */
function PopUp(props) {
    const [modalShow, setModalShow] = useState(false);

    // Crear el modal
    const modal = <Modal
    {...props} // propiedades personalizadas
    size="lg"
    onHide={()=>{setModalShow(false)}}
    show={modalShow}
    aria-labelledby="contained-modal-title-vcenter"
    centered
    backdrop="static"
  >
    <Modal.Header closeButton>
      <Modal.Title id="contained-modal-title-vcenter">
        {/* Titular para el Modal */}
        {props.modalTitle}
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      {/* Contenido adicional para el PopUp */}
      {props.modalContent}
    </Modal.Body>
    <Modal.Footer>
      {/* Botón de Cierre con la accion */}
      <Button variant={props.variantCloseButton} onClick={()=>{setModalShow(false)}}>{props.textCloseButton}</Button>
    </Modal.Footer>
  </Modal>

    // Boton que manejará el modal
    const button = <Button variant={props.variantShowModalButton} onClick={() => setModalShow(true)}>{props.textShowModalButton}</Button>

  return (
    <>
    {button}
    {modal}
    </>
  );
}

export default PopUp;