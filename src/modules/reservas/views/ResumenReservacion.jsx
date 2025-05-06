import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { PersonCircle } from 'react-bootstrap-icons';
import TopNav from '../../../components/TopNav';
import { useReserva } from '../../../shared/context/ReservaContext';
import {transaccionReserva} from '../../../services/reserva';
import { useNavigate } from 'react-router-dom';
import { useTemporalAlert } from '../../../shared/context/TemporalAlertContext';
import PopUpWithAction from '../../../shared/modals/PopUpWithAction';

const ResumenReservacion = () => {

  const { reservaData, prevStep, resetReserva } = useReserva();
  const {addAlert} = useTemporalAlert();
  const [diasEstadia, setDiasEstadia] = useState(reservaData.diasEstadia || 1);
  const [montoCalculado, setMontoCalculado] = useState(0);
  const [montoTotalCalculado, setMontoTotalCalculado] = useState(0);
  const [codigoConfirmacion, setCodigoConfirmacion] = useState(0);
  const navigate = useNavigate();


  const igv = 0.18;
  useEffect(() => {
    
    const precioHabitacion = reservaData.habitacion ? reservaData.habitacion.precio : 0;
    const totalServicios = reservaData.servicios.reduce((sum, service) => sum + (service.price || 0), 0);
    
    const calculatedMonto = (precioHabitacion * diasEstadia) + totalServicios;
    const calculatedMontoTotal = calculatedMonto * (1 + igv);
    
    setMontoCalculado(calculatedMonto);
    setMontoTotalCalculado(calculatedMontoTotal);
  }, [diasEstadia, reservaData.habitacion, reservaData.servicios]);
  
  const handleDiasEstadiaChange = (event) => {
    const days = parseInt(event.target.value, 10);
    setDiasEstadia(isNaN(days) || days < 1 ? 1 : days);
  };
  // Comunicacion con backend para envio de datos
  const handleConfirmarReserva = async() => {
      
    try{
      const idReserva = await transaccionReserva({
        cliente: reservaData.cliente,
        servicios:reservaData.servicios,
        habitacion: reservaData.habitacion})
        // Mostrar la ventana con el código : Creacion del código
        setCodigoConfirmacion(idReserva + "" + reservaData.cliente.documento_identidad);
        addAlert("Reserva realizada", "success")
    }catch(error){
      console.log(error)
      addAlert("Hubo un error al registrar", "danger")
    }
  };

  const handleFinalizarReserva = ()=>{
      resetReserva(); // Reiniciar el estado del contexto para una nueva reserva
      navigate("/reservas")
  }

  // Mostrar la ventana de datos finales cuando el código de confirmacion se brinde
  return (
    <Container fluid>
      <TopNav linkTo='/reservas' title='Nueva reservación'/>
      {!codigoConfirmacion ? <>
      <Row className='p-4'>
        <Col>
          <h2>Resumen de reserva</h2>
        </Col>
      </Row>

      <Row className="p-4">
        {/* Cliente */}
        <Col md={4}>
          <Card>
            <Card.Header>Cliente</Card.Header>
            <Card.Body className="d-flex align-items-center">
              <PersonCircle size={40} className="me-3" />
              <div>
                <Card.Title>{reservaData.cliente?.nombre || 'Cliente no especificado'}</Card.Title>
                <Card.Text>
                  {reservaData.cliente?.telefono || 'Teléfono no especificado'}<br />
                  DNI: {reservaData.cliente?.documento_identidad || 'DNI no especificado'}
                </Card.Text>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Tipo de Habitacion */}
        <Col md={4}>
          <Card>
            <Card.Header>Tipo de Habitacion</Card.Header>
            <Card.Body>
              <Card.Title>{reservaData.habitacion?.tipo || 'Habitación no seleccionada'}</Card.Title>
              <Card.Text>{reservaData.habitacion?.descripcion || 'Descripción no disponible'}</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* Servicios añadidos */}
        <Col md={4}>
          <Card>
            <Card.Header>Servicios añadidos</Card.Header>
            <Card.Body>
              {reservaData.servicios.length > 0 ? (
                reservaData.servicios.map((service, index) => (
                  <Card key={index} className="mb-2" bg='success' text='light'>
                    <Card.Body>
                      <Card.Title>{service.nombre} - S/ {service.precio !== null ? service.precio.toFixed(2) : 'N/A'}</Card.Title>
                      <Card.Text>{service.descripcion}</Card.Text>
                    </Card.Body>
                  </Card>
                ))
              ) : (
                <Card.Text>No se han añadido servicios.</Card.Text>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="p-4">
        {/* Días de estadía */}
        <Col md={4}>
          <Form.Group className="mb-3" onClick={()=>addAlert("No implementado", "warning")}>
            <Form.Label>Días de estadía</Form.Label>
            <Form.Control
              type="number"
              placeholder="Escriba aqui"
              value={diasEstadia}
              onChange={handleDiasEstadiaChange}
              min="1"
            />
          </Form.Group>
        </Col>

        {/* Monto and Monto Total */}
        <Col md={4}>
          <Card className="mb-2" bg="info">
            <Card.Body>
              <Card.Title>Monto Base (Habitación x Días + Servicios)</Card.Title>
              <Card.Text>S/ {montoCalculado.toFixed(2)}</Card.Text>
            </Card.Body>
          </Card>
          <Card bg='warning'>
            <Card.Body>
              <Card.Title>Monto Total (inc.IGV)</Card.Title>
              <Card.Text>S/ {montoTotalCalculado.toFixed(2)}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
         <Col md={4}></Col>
      </Row>

      <Row className="p-4">
        <Col>
          <PopUpWithAction 
          action={handleConfirmarReserva}
          haveCancellButton={true}
          modalContent={<p>Se generará un código de confirmación</p>}
          modalTitle='¿Desea confirmar la reserva?'
          textActionButton='Aceptar'
          textShowModalButton='Confirmar reserva'
          variantActionButton='success'
          variantShowModalButton='success'
          />
          <Button variant="secondary" onClick={prevStep}>Volver</Button>
        </Col>
      </Row>
      </>: <>
      <Container fluid className='d-flex justify-content-center align-items-center vh-100'>

        <Col className='text-center align-center w-full'>
          <h1 className='text-primary fs-1'>{codigoConfirmacion}</h1>
          <h3 className='fs-4'>Número de confirmación</h3>
          <h5 className='text-secondary fs-6'>Debe brindar el código de confirmación al cliente y mantenerlo hasta checkin</h5>
          <Button variant='success' onClick={handleFinalizarReserva}>Volver a inicio</Button>
        </Col>

      </Container>
      </>}
    </Container>
  );
};



export default ResumenReservacion;
