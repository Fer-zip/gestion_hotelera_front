import React, { use, useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Table, Dropdown, Card, FormCheck } from 'react-bootstrap';
import { CalendarCheckFill, ArrowDownLeftCircleFill, ArrowUpRightCircleFill, BarChartLineFill } from 'react-bootstrap-icons';
import ActionCardDashboard from '../../../components/ActionCard';
import HoverIcon from '../../../utils/HoverIcon/HoverIcon';
import DashboardNote from '../../../components/DashboardNote';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useTemporalAlert } from '../../../shared/context/TemporalAlertContext';
import { cancelarReserva, getReservasByDNICliente, getReservasConsulta, getReservaByCodigoConfirmacion } from '../../../services/reserva';
import PopUpWithAction from '../../../shared/modals/PopUpWithAction';
import InactivePopUpWithAction from '../../../shared/modals/InactivePopUp';
import RESTServicio from '../../../services/RESTServicio';

import { useReservaHabitacion } from '../../../shared/context/ReservaHabitacionContext';

// Recursos
import {dniImg, confirmacionImg} from "../../../data/images"


const ReservasDashboardContent = () => {

  // Coloco titulo en el dashboard
  const {addAlert} = useTemporalAlert();
  const {setTituloDashboard} = useOutletContext();
  const [reservaciones, setReservaciones] = useState([]);
  const [dniBusqueda, setDniBusqueda] = useState([]);
  const navigate = useNavigate();

  const {guardarDatos} = useReservaHabitacion(); 


  // Servicios
  const habitacionesService = RESTServicio("habitaciones");
  const reservasService = RESTServicio('reservas')

  // PROCESO DE CHECKIN
  const [showModalNumberConfirmation, setshowModalNumberConfirmation] = useState(false);
  const [roomTypeChooseForChangeCheckin, setRoomTypeChooseForChangeCheckin] = useState({});
  const [reservationToCheckin, setReservationToCheckin] = useState(0);
  const [typesRoomsAvailable, setTypesRoomsAvailable] = useState([]);

  const [showModalChangeTypeRoom, setModalChangeTypeRoom] = useState(false);
  const [numberConfirmation, setNumberConfirmation] = useState(0);
  const [dniForConfirmation, setDniForConfirmation] = useState('');

  const [showChoiceReservation,setShowChoiceReservation] = useState(false)
  const [indexReserva, setIndexReserva] = useState(0);

  const [showModalRoomNotAvailable, setShowModalRoomNotAvailable] = useState(false);
  const [clientReservationsToCheckin, setClientReservationsToCheckin] = useState([])

  setTituloDashboard("Gestión de Reservas")

  // Carga de datos desde la API
  useEffect(()=>{
    async function cargarDatos() {
      try{
        const reservaciones = await getReservasConsulta();
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

  const handleBusquedaReservas = async()=>{
    if(dniBusqueda==='') return;
    try{
      const reser = await getReservasByDNICliente(dniBusqueda)
      if(reser.length !== 0){
        setReservaciones(reser)
      }else{
        addAlert("No se brindó un DNI para la búsqueda", "info")
      }
    }catch(error){
      addAlert("Hubo un error al consultar las reservas")
    }
  }



  const validacionCodigo = async()=>{
    const reserva = (await getReservaByCodigoConfirmacion(numberConfirmation))[0];
    if(!reserva){
      addAlert("No se ha encontrado reserva con el presente código. Compruebe la entrada", "warning");
      return;
    }; 
    if(reserva.estado === "cancelada" || reserva.estado === "confirmada"){
      addAlert("Esta reservación ha sido " + reserva.estado, "warning")
      return;
    }
    addAlert("Accediendo a la reservacion", "success")
    setReservationToCheckin(reserva)
    setNumberConfirmation(0) // reiniciar la busqueda de reserva
    // Saber si hay habitaciones disponibles
    const habitaciones = (await habitacionesService.Get());
    const habitacionesDisponibles = habitaciones.filter(habitacion => {
      return habitacion.estado === "disponible" && habitacion.tipo === reserva.tipo_habitacion;
    });
    const habitacionesParaCambiar = habitaciones.filter(habitacion => {
      return habitacion.estado === "disponible" && habitacion.tipo !== reserva.tipo_habitacion ;
    });
    setTypesRoomsAvailable(habitacionesParaCambiar)
    // En caso de no hallar habitacio disponible mostrar PopUp para tratarlo
    if(habitacionesDisponibles.length===0){
      setShowModalRoomNotAvailable(true)
    }else{
      // Redigir a checkin con la habitación y reserva a asignar 
      guardarDatos(reserva, habitacionesDisponibles[0])
      navigate("/checkin")
      //addAlert("No implementado, proceso continuo de checkin")
    }
  }


  // Si el usuario no posee el código de confirmacion, puede usar su DNI como medio
  const validacionDni = async()=>{
    setshowModalNumberConfirmation(false);
    let reservas = (await getReservasByDNICliente(dniForConfirmation));
    reservas = reservas.filter(reservas => {
      return reservas.estado === "pendiente"
    })
    // Validar las reservas pendientes 
    if(reservas.length===0){
      addAlert("No se ha encontrado cliente ó reservas pendientes \n DNI: " + dniForConfirmation, "info");
      return;
    }
    
    setClientReservationsToCheckin(reservas);
    setShowChoiceReservation(true)

    
  }

  // Cuando obtenemos la reserva elegida a confirmar (para caso de DNI)
  const reservaCheckinConfirmacion = ()=>{
    const reserva = clientReservationsToCheckin[indexReserva]
    addAlert("Consultando habitaciones disponibles para la reserva", "info")
    setReservationToCheckin(reserva) // que la reserva sea la elegidoa
    manejarHabitacionesParaReserva()
  }

  const manejarHabitacionesParaReserva = async()=>{
    // Saber si hay habitaciones disponibles
    const habitaciones = (await habitacionesService.Get());
    const habitacionesDisponibles = habitaciones.filter(habitacion => {
      return habitacion.estado === "disponible" && habitacion.tipo === reservationToCheckin.tipo_habitacion;
    });
    const habitacionesParaCambiar = habitaciones.filter(habitacion => {
      return habitacion.estado === "disponible" && habitacion.tipo !== reservationToCheckin.tipo_habitacion ;
    });
    setTypesRoomsAvailable(habitacionesParaCambiar)
    // En caso de no hallar habitacio disponible mostrar PopUp para tratarlo
    if(habitacionesDisponibles.length===0){
      setShowModalRoomNotAvailable(true)
    }else{
      // Redigir a checkin con la habitación y reserva a asignar 
      guardarDatos(reservationToCheckin, habitacionesDisponibles[0])
      navigate("/checkin")
      //addAlert("No implementado, proceso continuo de checkin")
    }
  }


  // Manejar el cambio de habitacion escogida
  const cambiarTipoHabitacion = async()=>{
    // Actualizar la reserva para el nuevo tipo de habitacion
    await reservasService.Update(reservationToCheckin.id_reserva, {
      ...reservationToCheckin, tipo_habitacion: roomTypeChooseForChangeCheckin
    })
    addAlert("Reserva actualizada. Vuelva al proceso de checkin")
    //guardarDatos(reservationToCheckin, tiposHabitaciones[0])
    // navigate('/checkin')
    setReservationToCheckin({})
    setIndexReserva(0)
    setDniBusqueda(0)
  }

  useEffect(()=>{
    console.log("ID: " + indexReserva)
    setReservationToCheckin(clientReservationsToCheckin[indexReserva])
  }, [indexReserva, clientReservationsToCheckin])





  return (
    <Container fluid className="p-0">
      <InactivePopUpWithAction 
        // Elegirá la reserva para el checkin
        show={showChoiceReservation}
        action={reservaCheckinConfirmacion}
        haveCancellButton={true}
        modalTitle='Seleccionar Reservas'
        textActionButton='Acceder a reservación'
        variantActionButton='primary'
        onHide={()=>setShowChoiceReservation(false)}
        modalContent={
          <>
          <Form.Group>
            <Form.Label>Fecha | Código de Confirmación</Form.Label>
            <option value={null}>Todas las reservas</option>
            <Form.Select onClick={(e)=>setIndexReserva(e.target.value)}>
              {clientReservationsToCheckin.map((reservacion, index) => {
                return <option value={index}>{reservacion.fecha_inicio.substring(0,10)} | {reservacion.id_reserva}{dniForConfirmation}</option>
              })}
            </Form.Select>
            </Form.Group>
          </>
        }
      />
      {/* Modal para eleccion de habitaciones si la que prefiere no está disponible */}
      <InactivePopUpWithAction 
      show={showModalChangeTypeRoom}
      action={cambiarTipoHabitacion}
      haveCancellButton={true}
      modalTitle='Cambio de tipo de habitación'
      onHide={()=>setModalChangeTypeRoom(false)}
      textActionButton='Guardar elección'
      variantActionButton='success'
      modalContent={
        <>
          <p>El monto total modificado se mostrará en el proceso de check-out</p>
          {typesRoomsAvailable ? <Form.Select onChange={(e)=>setRoomTypeChooseForChangeCheckin(e.target.value)}>
              <option>Tipo de Habitación</option>
              {typesRoomsAvailable.map(habitacion=>
                <option value={habitacion.tipo}>{habitacion.tipo.toUpperCase()}</option>
              )}
          </Form.Select> : <p>No ninguna otra habitación en el momento</p>}
          
        </>
      }/>

      {/* Información acerca de las habitaciones */}
      <InactivePopUpWithAction 
      show={showModalRoomNotAvailable}
      action={()=>setModalChangeTypeRoom(true)} // accion a ejecutar al Cambiar tipo habitacion
      haveCancellButton={true}
      modalContent={<p>La habitación deseada no se encuentra disponible</p>}
      modalTitle='No hay habitación disponible'
      onHide={()=>setShowModalRoomNotAvailable(false)}
      textActionButton='Cambiar tipo habitación'
      variantActionButton='info'
      />
      {/* Recibir el código de confirmación para acceder a la reserva */}
      <InactivePopUpWithAction 
        show={showModalNumberConfirmation}
        onHide={()=>{setshowModalNumberConfirmation(false)}}
        action={validacionCodigo}
        textActionButton='Acceder a reservacion'
        modalTitle='Realizar Checkin'
        // Contenido que irá en el PopUp para recibir el numero de confirmación
        modalContent={(
          <>
            <Form className="d-flex align-items-center">
                <img src={confirmacionImg} alt="" className='w-25' />
                <Form.Group as={Col} md="4">
                  <Form.Label>Número de confirmación</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Ingrese el número de confirmación"
                    className="me-2"
                    value={numberConfirmation}
                    onChange={(e)=>setNumberConfirmation(e.target.value)}
                    />
                  </Form.Group>
              </Form>
          </>
        )}
        variantActionButton='success'
        haveCancellButton={true}
        controlAdicional={
          // Consulta para checkin con DNI
          <PopUpWithAction 
          action={validacionDni}
          haveCancellButton={true}
          modalContent={
            // Formulario para que pueda ingresar el DNI
              <Form className="d-flex gap-3">
                <img src={dniImg} alt="" className='w-25' />
                <Form.Group as={Col} md="4">
                  <Form.Label>DNI del cliente</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Ingrese el dni para checkin"
                    className="me-2"
                    value={dniForConfirmation}
                    onChange={(e)=>setDniForConfirmation(e.target.value)}
                    />
                  </Form.Group>
              </Form>
          }
          modalTitle='Realizar checkin por DNI'
          textActionButton='Buscar reservas'
          textShowModalButton='Con DNI'
          variantActionButton='primary'
          variantShowModalButton='secondary'
          />
        }
      />
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
            <Card bg='primary' className="text-start p-3 action-card" onClick={()=>setshowModalNumberConfirmation(true)}>
                <HoverIcon 
                  iconoNormal={<ArrowDownLeftCircleFill color="#CFE2FF" size={30} className="mx-2 mb-2" />}
                  iconoHover={<ArrowDownLeftCircleFill color="#FFF" size={30} className="mx-2 mb-2" />} />
                <p className="fs-4 text-light">Realizar Checkin</p>
            </Card>
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
        <Col md={3} onClick={()=>addAlert("No implementado", "warning")}>
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
      <Row className="mb-3 align-items-center">
        <Col md={6}>
          <Form className="d-flex">
            <Form.Control
              type="number"
              placeholder="Buscar por confirmación o cliente"
              className="me-2"
              aria-label="Search"
              value={dniBusqueda}
              onChange={(e)=>setDniBusqueda(e.target.value)}
            />
            <Button variant="success" onClick={handleBusquedaReservas}>Buscar</Button>
          </Form>
        </Col>
        <Col md={3} className="ms-auto">
           <Dropdown onClick={()=>addAlert("No implementado", "warning")}>
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
      </Row>

      {/* Tabla de todas las reservas actuales */}
      {!reservaciones ? <h2 className='text-center text-secondary'>No hay reservas</h2>
      : <Table striped bordered hover responsive className="mb-3">
      <thead>
        <tr>
          <th className='text-secondary'>ID</th>
          <th>Cliente</th>
          <th>Estado</th>
          <th>Fecha entrada</th>
          <th>Habitación</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {reservaciones.map((reservation) => (
          <tr key={reservation.id_reserva}>
            <td className='text-secondary'>{reservation.id_reserva}</td>
            <td>{reservation.nombre}</td>
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