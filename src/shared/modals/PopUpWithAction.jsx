import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';

/**
 * Componente PopUpWithAction que muestra un modal con un título, contenido y botones de acción.
 *
 * @param {Object} props - Las propiedades del componente.
 * @param {string} props.modalTitle - El título que se mostrará en el encabezado del modal.
 * @param {React.ReactNode} props.modalContent - El contenido que se mostrará en el cuerpo del modal. Puede ser cualquier elemento de React.
 * @param {boolean} props.haveCancellButton - Indica si se debe mostrar un botón de "Cancelar" en el pie de página del modal.
 * @param {string} props.variantActionButton - La variante de estilo para el botón de acción principal (por ejemplo, 'primary', 'danger', etc.).
 * @param {function} props.action - La función que se ejecutará cuando se haga clic en el botón de acción principal.
 * @param {string} props.textActionButton - El texto que se mostrará en el botón de acción principal.
 * @param {string} props.variantShowModalButton - La variante de estilo para el botón que activa la apertura del modal.
 * @param {string} props.textShowModalButton - El texto que se mostrará en el botón que activa la apertura del modal.
 * @returns {React.ReactElement} Un fragmento de React que contiene el botón para mostrar el modal y el componente Modal.
 *
 * @example
 * import PopUpWithAction from './shared/modals/PopUpWithAction.jsx';
 *
 * function MyComponent() {
 *   const handleAction = () => {
 *     alert('Acción ejecutada!');
 *   };
 *
 *   const contentModal = (
 *     <>
 *       <h4>Confirmación</h4>
 *       <p>¿Estás seguro de realizar esta acción?</p>
 *     </>
 *   );
 *
 *   return (
 *     <PopUpWithAction
 *       action={handleAction}
 *       textActionButton="Confirmar"
 *       modalTitle="Confirmar Acción"
 *       modalContent={contentModal}
 *       variantActionButton="danger"
 *       haveCancellButton={true}
 *       variantShowModalButton="primary"
 *       textShowModalButton="Abrir Confirmación"
 *     />
 *   );
 * }
 */
function PopUpWithAction(props) {
    const [modalShow, setModalShow] = useState(false);

    // Crear el modal
    const modal = <Modal
    {...props}
    size="lg"
    show={modalShow}
    aria-labelledby="contained-modal-title-vcenter"
    centered
    backdrop="static"
  >
    <Modal.Header>
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
      {/* Boton Cancelar */}  
      {props.haveCancellButton ? <Button variant='secondary' onClick={()=>{setModalShow(false)}}>Cancelar</Button> : null}
      {/* Botón de Cierre con la accion */}
      <Button variant={props.variantActionButton} onClick={()=>{props.action(); setModalShow(false)}}>{props.textActionButton}</Button>
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

export default PopUpWithAction;