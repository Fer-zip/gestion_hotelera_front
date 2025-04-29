import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

/**
 * Componente ActionCardDashboard que muestra una tarjeta interactiva con un icono, título y un enlace.
 *
 * @param {Object} props - Las propiedades del componente.
 * @param {string} props.linkTo - La ruta a la que navegará el componente al hacer clic.
 * @param {React.ReactNode} props.icon - El icono que se mostrará en la tarjeta. Puede ser cualquier elemento de React (por ejemplo, un componente de icono).
 * @param {string} props.titleCard - El título que se mostrará en la tarjeta.
 * @returns {React.ReactElement} Un elemento Link de react-router-dom que contiene una tarjeta de React-Bootstrap.
 *
 * @example
 * import ActionCardDashboard from './components/ActionCard.jsx';
 * import { FaUsers } from 'react-icons/fa'; // Ejemplo de uso con un icono de react-icons
 *
 * function MyDashboard() {
 *   return (
 *     <ActionCardDashboard
 *       linkTo="/usuarios"
 *       icon={<FaUsers size={40} className="text-light mb-2" />}
 *       titleCard="Gestión de Usuarios"
 *     />
 *   );
 * }
 */
function ActionCardDashboard(props){

    return (
        <Link to={props.linkTo}>
            <Card bg='primary' className="text-start p-3 action-card">
                
                {props.icon}

                <p className="fs-4 text-light">{props.titleCard}</p>
            </Card>
        </Link>
    )
}

export default ActionCardDashboard;