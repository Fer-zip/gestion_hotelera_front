import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Table, Dropdown } from 'react-bootstrap';
import { CalendarCheckFill, ArrowDownLeftCircleFill, ArrowUpRightCircleFill, BarChartLineFill } from 'react-bootstrap-icons';
import ActionCardDashboard from '../../../components/ActionCard';
import HoverIcon from '../../../utils/HoverIcon/HoverIcon';
import DashboardNote from '../../../components/DashboardNote';
import { useOutletContext } from 'react-router-dom';
import { useTemporalAlert } from '../../../shared/context/TemporalAlertContext';
import RESTServicio from '../../../services/RESTServicio';
import { cancelarReserva } from '../../../services/transaccionReserva';
import PopUpWithAction from '../../../shared/modals/PopUpWithAction';


const ReservasDashboardContent = () => {

  // Coloco titulo en el dashboard
  const {addAlert} = useTemporalAlert();
  const {setTituloDashboard} = useOutletContext();
  const [reservaciones, setReservaciones] = useState([]);
  const {Get} = RESTServicio("reservas");


  setTituloDashboard("Gestión de Reservas")

  // Carga de datos desde la API
  useEffect(()=>{
    async function cargarDatos() {
      try{
        const reservaciones = await Get();
        if(reservaciones.length===0){
          addAlert("No hay reservas actualmente")
          return;
        }
        setReservaciones(reservaciones)

      }catch(error){
        addAlert("No se ha logrado cargar los cambios", "danger")
      }
    }

    cargarDatos()
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Acciones de reserva
  const handleCancelarReserva = async(idReserva)=>{
    try{
      cancelarReserva(idReserva)
      addAlert("Reserva cancelada")
    }catch(error){
      addAlert("No se pudo cancelar la reserva. Llamar a soporte tecnico", "danger")
    }
  }


  return (
    <Container fluid className="p-0">
      <DashboardNote variant="tertiary" note="Consulte y modifique las reservaciones de clientes bajo sus requerimientos y necesidades."/>      

      {/* Action Cards */}
      <Row className="mb-3">
        <Col md={3}>
          <ActionCardDashboard 
          linkTo="/nueva-reserva"
          titleCard="Nueva Reserva"
          icon={<HoverIcon 
            iconoNormal={<CalendarCheckFill color="#CFE2FF" size={30} className="mx-2 mb-2" />}
            iconoHover={<CalendarCheckFill color="#FFF" size={30} className="mx-2 mb-2" />} />}

          />
        </Col>
        <Col md={3}>
            <ActionCardDashboard 
            linkTo="#"
            titleCard="Realizar Checkin"
            icon={<HoverIcon 
              iconoNormal={<ArrowDownLeftCircleFill color="#CFE2FF" size={30} className="mx-2 mb-2" />}
              iconoHover={<ArrowDownLeftCircleFill color="#FFF" size={30} className="mx-2 mb-2" />} />}

            />
        </Col>
        <Col md={3}>
            <ActionCardDashboard 
            linkTo="#"
            titleCard="Realizar Checkout"
            icon={<HoverIcon 
              iconoNormal={<ArrowUpRightCircleFill color="#CFE2FF" size={30} className="mx-2 mb-2" />}
              iconoHover={<ArrowUpRightCircleFill color="#FFF" size={30} className="mx-2 mb-2" />} />}
            />
        </Col>
        <Col md={3}>
        <ActionCardDashboard 
            linkTo="#"
            titleCard="Estadísticas"
            icon={<HoverIcon 
              iconoNormal={<BarChartLineFill color="#CFE2FF" size={30} className="mx-2 mb-2" />}
              iconoHover={<BarChartLineFill color="#FFF" size={30} className="mx-2 mb-2" />} />}
            />
        </Col>
      </Row>

      <h2>Todos los reservas</h2>

      {/* Busqueda y filtrado */}
      {/* <Row className="mb-3 align-items-center">
        <Col md={6}>
          <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Buscar por confirmación o cliente"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="success">Buscar</Button>
          </Form>
        </Col>
        <Col md={3} className="ms-auto">
           <Dropdown>
            <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
              Desde
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href="#/action-1">Hoy</Dropdown.Item>
              <Dropdown.Item href="#/action-2">Últimos 7 días</Dropdown.Item>
              <Dropdown.Item href="#/action-3">Últimos 30 días</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row> */}

      {/* Tabla de todas las reservas actuales */}
      {!reservaciones ? <h2 className='text-center text-secondary'>No hay reservas</h2>
      : <Table striped bordered hover responsive className="mb-3">
      <thead>
        <tr>
          <th className='text-secondary'>ID</th>
          <th>Estado</th>
          <th>Fecha entrada</th>
          <th>Habitación</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {reservaciones.map((reservation) => (
          <tr key={reservation.idReserva}>
            <td className='text-secondary'>{reservation.id_reserva}</td>
            <td>{reservation.estado}</td>
            <td>{reservation.fecha_inicio.substring(0, 10)}</td>
            <td>{reservation.tipo_habitacion}</td>
            <td>
              <Button variant="info" size="sm" className="me-2" onClick={()=>addAlert("No implementado", "warning")}>Ver detalles</Button>
              {reservation.estado !== "cancelada" ? <PopUpWithAction 
              action={()=>handleCancelarReserva(reservation.id_reserva)}
              haveCancellButton={true}
              modalContent={<p>Al cancelar, deberá comunicar al cliente de la operación.</p>}
              modalTitle='¿Está seguro que desea cancelar la reserva?'
              textActionButton='Sí. Cancelar'
              textShowModalButton='Cancelar'
              variantActionButton='danger'
              variantShowModalButton='danger'
              /> : null}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>}
      

      
    </Container>
  );
};

export default ReservasDashboardContent;