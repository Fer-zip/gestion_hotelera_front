import React, { useState } from 'react';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import './SeleccionarHabitacion.css'; 
import HoverIcon from '../../../utils/HoverIcon/HoverIcon';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'react-bootstrap-icons';
import DashboardNote from '../../../components/DashboardNote';
import { useReserva } from '../../../shared/context/ReservaContext';
import { useTemporalAlert } from '../../../shared/context/TemporalAlertContext';

// Imágenes 
import basicaImg from '../../../assets/basica.png';
import especialImg from '../../../assets/especial.png';
import premiumImg from '../../../assets/premium.png';

const SeleccionarHabitacion = () => {
  const tiposHabitaciones = [
    {id: 1, tipo: "basica", descripcion: "Habitación básica", precio: 50, img: basicaImg},
    {id: 2, tipo: "especial", descripcion: "Habitación especial", precio: 100, img: especialImg},
    {id: 3, tipo: "premium", descripcion: "Habitación premium", precio: 150, img: premiumImg}
  ]
  const { reservaData, updateReservaData, nextStep, prevStep } = useReserva();
  const {addAlert} = useTemporalAlert();

  // Usar datos de contexto de proceso de reserva
  const [selectedRoom, setSelectedRoom] = useState(reservaData.habitacion); 
  const [montoTotal, setMontoTotal] = useState(reservaData.habitacion ? reservaData.habitacion.precio : 0); 

  const handleSelectRoom = (room) => {
    setSelectedRoom(room);
    setMontoTotal(room.precio);

    updateReservaData({ habitacion: room }); // Guardar en el proceso
  };
  


  // Validacion para que elija un tipo de habitacion antes de pasar al siguiente
  const nextStepValidation = ()=>{
    if(reservaData.habitacion==null){
      addAlert("Debe elegir un tipo de habitación para escoger")
      return;
    }
    nextStep()
  }

  return (
    <Container fluid className="">
      <Row className="p-4 mb-4 align-items-center" style={{backgroundColor: "var(--cyan-700)"}}>
        <Col xs="auto">
          <Link to="/reservas">
            <HoverIcon
            iconoNormal={<ArrowLeft color='#CFE2FF' size={40}/>}
            iconoHover={<ArrowLeft color='#FFF' size={40}/>}
            />
          </Link>
        </Col>
        <Col>
          <h2 className='text-light'>Nueva reservación</h2>
        </Col>
      </Row>

      <Row className='mx-4 p-2'>
      <DashboardNote variant='tertiary' note="Al registrar una nueva reserva, se guardan los 
      datos de ella para su seguimiento, el cliente debe estar enterado de los detalles, puede añadir servicios a consumir y luego debe pasar a check-in."/>
      </Row>

      
      <div className="p-4 horizontal-scroll-container">
      <h2>Tipo de Habitaciones</h2>
        <Row className="flex-nowrap overflow-auto">
          {tiposHabitaciones.map((room) => (
            <Col key={room.id} xs={12} md={4} className="mb-4">
              <Card
                onClick={() => handleSelectRoom(room)}
                className={`room-card ${selectedRoom && selectedRoom.id === room.id ? 'selected' : ''}`}
                style={{ cursor: 'pointer', heigth: '20rem' }}
              >
                <Card.Img variant='top' src={room.img}></Card.Img>
                
                <Card.Body>
                  <Card.Title>{room.tipo.toUpperCase()}</Card.Title>
                  <Card.Text>{room.descripcion}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      <Row className="p-4 mt-4 align-items-center">
        <Col>
          <Button variant="success" onClick={nextStepValidation}>Guardar y continuar</Button>
          <Button variant="secondary" className="ms-2" onClick={prevStep}>Volver</Button>
        </Col>
        <Col className="text-end">
          <div className="total-amount-box p-3">
            <h2>Monto Total</h2>
            <h3>S/ {montoTotal}</h3> 
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default SeleccionarHabitacion;