import React, { useState } from 'react'; // Importar useState
import { Container, Row, Col, Navbar, Nav, Button } from 'react-bootstrap';
import { PersonCircle, PeopleFill, CalendarDate, DoorClosedFill, HandbagFill, BarChartFill, ThreeDots, ArrowLeftSquareFill, Bell, DoorOpenFill } from 'react-bootstrap-icons';
import './dashboardlayout.css'; // estilos para el dashboard
import HoverIcon from '../../utils/HoverIcon/HoverIcon';
import { Outlet } from 'react-router-dom';
import InactivePopUpWithAction from '../modals/InactivePopUp';
import { useAuth } from '../context/AuthContext';

import { logoImg } from '../../data/images';

const DashboardLayout = ({ children }) => {
  const [tituloDashboard, setTituloDashboard] = useState("Gestión de Hotelería");
  const [estaDesplegado, setEstaDesplegado] = useState(false); // Para desplegar la barra lateral
  const [showModalLogout, setShowModalLogout] = useState(false);
  const {logout} = useAuth();


  const handleToggleSidebar = () => { 
    setEstaDesplegado(!estaDesplegado);
  };


  return (
    <Container fluid className="dashboard-container p-0">
      <Row className="dashboard-row g-0">
        {/* Sidebar para despliegue*/}
        <Col xs={estaDesplegado ? 1 : 2} className={`sidebar ${estaDesplegado ? 'collapsed' : ''}`}> 
          <div className="sidebar-header">
            {/* Logo */}
            <Nav.Link href='/'>
              <img src={logoImg} alt="" className='w-75'/>
            </Nav.Link>
          </div>

          <Nav className="flex-column sidebar-nav">

            {/* Sidebar Nav Items */}
            <Nav.Link href="/usuarios" className="sidebar-nav-item">
              <HoverIcon iconoNormal={<PersonCircle color='#9EC5FE' className='icon rounded-3'></PersonCircle>} iconoHover={<PersonCircle color='#FFF' className='icon rounded-3'></PersonCircle>}></HoverIcon>
              {!estaDesplegado && <span>Usuarios</span>} 
            </Nav.Link>

            <Nav.Link href="/clientes" className="sidebar-nav-item">
              <HoverIcon iconoNormal={<PeopleFill color='#9EC5FE' className='icon rounded-3'></PeopleFill>} iconoHover={<PeopleFill color='#FFF' className='icon rounded-3'></PeopleFill>}></HoverIcon>
              {!estaDesplegado && <span>Clientes</span>} 

            </Nav.Link>

            <Nav.Link href="/reservas" className="sidebar-nav-item">
              <HoverIcon iconoNormal={<CalendarDate color='#9EC5FE' className='icon rounded-3'></CalendarDate>} iconoHover={<CalendarDate color='#FFF' className='icon rounded-3'></CalendarDate>}></HoverIcon>
              {!estaDesplegado && <span>Reservas</span>} 
            </Nav.Link>

            <Nav.Link href="/habitaciones" className="sidebar-nav-item">
              <HoverIcon iconoNormal={<DoorClosedFill color='#9EC5FE' className='icon rounded-3'></DoorClosedFill>} iconoHover={<DoorClosedFill color='#FFF' className='icon rounded-3'></DoorClosedFill>}></HoverIcon>
              {!estaDesplegado && <span>Habitaciones</span>} 
            </Nav.Link>

            <Nav.Link href="/servicios" className="sidebar-nav-item">
              <HoverIcon iconoNormal={<HandbagFill color='#9EC5FE' className='icon rounded-3'></HandbagFill>} iconoHover={<HandbagFill color='#FFF' className='icon rounded-3'></HandbagFill>}></HoverIcon>
              {!estaDesplegado && <span>Servicios</span>} 
            </Nav.Link>

            <Nav.Link href="#link6" className="sidebar-nav-item">
              <HoverIcon iconoNormal={<BarChartFill color='#9EC5FE' className='icon rounded-3'></BarChartFill>} iconoHover={<BarChartFill color='#FFF' className='icon rounded-3'></BarChartFill>}></HoverIcon>
              {!estaDesplegado && <span>Reportes y facturación</span>} 
            </Nav.Link>

            <Nav.Link href="#link7" className="sidebar-nav-item">
              <HoverIcon iconoNormal={<ThreeDots color='#9EC5FE' className='icon rounded-3'></ThreeDots>} iconoHover={<ThreeDots color='#FFF' className='icon rounded-3'></ThreeDots>}></HoverIcon>
              {!estaDesplegado && <span>Otros</span>} 
            </Nav.Link>

          </Nav>

           {/* Boton que despliega la barra lateral */}
           <div className="sidebar-footer" onClick={handleToggleSidebar}> 
             <HoverIcon iconoNormal={<ArrowLeftSquareFill color='#CFE2FF' className='icon-top-nav rounded-3'></ArrowLeftSquareFill>} iconoHover={<ArrowLeftSquareFill color='#FFF' className='icon-top-nav rounded-3'></ArrowLeftSquareFill>}></HoverIcon>
             {!estaDesplegado && <span>Desplegar</span>} 
           </div>

        </Col>

        {/* Main Content Area */}
        <Col className="main-content">
          {/* Top Navbar */}
          <Navbar bg="blue" expand="lg" className="top-navbar ">
            <Navbar.Brand href="#home" className='text-light'><h2> {tituloDashboard} </h2></Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Nav className="ms-auto"> {/* Elemento a la derecha*/}
               {/* Acciones generales */}
               <Nav.Link href="#notifications">
                 <HoverIcon iconoNormal={<Bell color='#9EC5FE' className='icon-top-nav rounded-3'></Bell>} iconoHover={<Bell color='#FFF' className='icon-top-nav rounded-3'></Bell>}></HoverIcon>
               </Nav.Link>

               <Button variant='tertiary' onClick={()=>setShowModalLogout(true)}>
                 <HoverIcon iconoNormal={<DoorOpenFill color='#9EC5FE' className='icon-top-nav rounded-3'></DoorOpenFill>} iconoHover={<DoorOpenFill color='#FFF' className='icon-top-nav rounded-3'></DoorOpenFill>}></HoverIcon>
               </Button>
            </Nav>
          </Navbar>

          {/* Area para todo el contenido del Dashboard */}
          <div className="content-area">
            {/* Componente que se mostrará según la ruta */}
            <Outlet context={{setTituloDashboard}}/>

          </div>
        </Col>
        <InactivePopUpWithAction
          show={showModalLogout}
          action={logout}
          haveCancellButton={true}
          modalContent={<p></p>}
          modalTitle='¿Desea finalizar la sesión?'
          onHide={()=>setShowModalLogout(false)}
          textActionButton='Cerrar Sesión'
          variantActionButton='danger'
        />
      </Row>
    </Container>
  );
};

export default DashboardLayout;