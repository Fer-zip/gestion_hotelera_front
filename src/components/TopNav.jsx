import { Row, Col } from "react-bootstrap"
import { Link } from "react-router-dom"
import HoverIcon from "../utils/HoverIcon/HoverIcon"
import { ArrowLeft } from "react-bootstrap-icons"


/**
 * Componente TopNav que muestra una barra de navegación superior con un botón de retroceso y un título.
 *
 * @param {Object} props - Las propiedades del componente.
 * @param {string} props.linkTo - La ruta a la que navegará el botón de retroceso.
 * @param {string} props.title - El título que se mostrará en la barra de navegación.
 * @returns {React.ReactElement} Un elemento de React que representa la barra de navegación superior.
 *
 * @example
 * import TopNav from './components/TopNav.jsx';
 *
 * function MyPage() {
 *   return (
 *     <TopNav
 *       linkTo="/dashboard"
 *       title="Detalles de la Reserva"
 *     />
 *   );
 * }
 */
function TopNav(props){
    return (
        <Row className="p-4 mb-4 align-items-center" style={{backgroundColor: "var(--cyan-700)"}}>
        <Col xs="auto">
          <Link to={props.linkTo}>
            <HoverIcon
            iconoNormal={<ArrowLeft color='#CFE2FF' size={40}/>}
            iconoHover={<ArrowLeft color='#FFF' size={40}/>}
            />
          </Link>
        </Col>
        <Col>
          <h2 className='text-light'>{props.title}</h2>
        </Col>
      </Row>
    )
}

export default TopNav;