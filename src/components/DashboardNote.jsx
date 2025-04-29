import { Alert } from "react-bootstrap"
import { InfoCircle } from "react-bootstrap-icons"

/**
 * Componente DashboardNote que muestra una nota informativa en un formato de alerta.
 *
 * @param {Object} props - Las propiedades del componente.
 * @param {string} props.variant - La variante de estilo de la alerta (por ejemplo, 'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark').
 * @param {string} props.note - El texto de la nota que se mostrará dentro de la alerta.
 * @returns {React.ReactElement} Un elemento Alert de React-Bootstrap con el icono de información y el texto de la nota.
 *
 * @example
 * import DashboardNote from './components/DashboardNote.jsx';
 *
 * function MyDashboardSection() {
 *   return (
 *     <DashboardNote
 *       variant="info"
 *       note="Esta es una nota informativa importante para el dashboard."
 *     />
 *   );
 * }
 */
function DashboardNote(props) {
    return (
        <Alert variant={props.variant} className="d-flex align-items-center p-0">
            <InfoCircle className="me-2" />
            <p className='fs-6 text-secondary'>{props.note}</p>
        </Alert>
    )
}


export default DashboardNote;