import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import './SeleccionServicios.css'; 
import TopNav from '../../../components/TopNav';
import { useReserva } from '../../../shared/context/ReservaContext';
import RESTServicio from '../../../services/RESTServicio';
import { useTemporalAlert } from '../../../shared/context/TemporalAlertContext';

const SeleccionServicios = () => {
  const { reservaData, updateReservaData, nextStep, prevStep } = useReserva();
  const {Get} = RESTServicio('servicios')
  const {addAlert} = useTemporalAlert();
  

  // Datos dummy , la API traerá los verdaderos
  const [services, setServices] = useState([]);

  // Carga de datos de los servicios
  useEffect(()=>{
      async function cargarServicios() {
        try{
          const servicios = await Get()
          // Convertir los datos "precio" a numerico para operaciones
          const serviciosPreparados = servicios.map(servicio => ({
            ...servicio,
            precio: parseFloat(servicio.precio) 
          }));

          if(serviciosPreparados.length===0){
            addAlert("No se encuentran habitaciones registradas. Registre una antes.")
            return;
          }

          // Cargar los servicios
          setServices(serviciosPreparados)

        }catch(error){
          addAlert("Hubo un error al cargar las servicios")
          console.error(error)
        }
      }
      cargarServicios()
      
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [selectedServiceIds, setSelectedServiceIds] = useState(reservaData.servicios.map(service => service.id));
  const handleServiceClick = (serviceId) => {
    setSelectedServiceIds(prevSelected => {
      const newSelected = prevSelected.includes(serviceId)
        ? prevSelected.filter(id_servicio => id_servicio !== serviceId)
        : [...prevSelected, serviceId];
      
      // Actualizar el contexto con los objetos de servicio completos
      const selectedServices = services.filter(service => newSelected.includes(service.id_servicio));
      updateReservaData({ servicios: selectedServices });

      return newSelected;
    });
  };

  const calculateTotal = () => {
    // Sumatoria de todos los servicios añadidos
    return selectedServiceIds.reduce((total, serviceId) => {
      const service = services.find(s => s.id_servicio === serviceId);
      return total + (service && service.precio ? parseInt(service.precio) : 0);
    }, 0);
  };

  const onClickCard = (idService)=>{
    handleServiceClick(idService); 
  }

  const handleGuardarYContinuar = ()=>{
      nextStep();
  }

  return (
    <Container fluid>
      <TopNav title="Nueva reservación" linkTo='/reservas'/>
      
      <Row className='p-4'>
        <h2 >Catálogo de Servicios</h2>
      </Row>
      {/* Mostrar los servicios colocados */}
      <Row className='p-4'>
        {services.map(service => (
          <Col key={service.id_servicio} md={4} className="mb-4">
            <Card
              className={`service-card ${selectedServiceIds.includes(service.id_servicio) ? 'selected' : ''}`}
              onClick={() => {onClickCard(service.id_servicio)}}>
              <Card.Header>{service.nombre}</Card.Header>
              <Card.Body>
                <Card.Title className="mb-2 text-muted">{service.precio !== null ? ` S/${service.precio}` : ''}</Card.Title>
                <Card.Text>{service.descripcion}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>


      {/* Muestro el monto total */}
      <Col className="text-end">
          <div className="total-amount-box p-3 bg-gray">
            <h2>Monto Total</h2>
            <h3>S/ {calculateTotal()}</h3> 
          </div>
      </Col>


      <div className="button-group p-4">
        <Button variant="success" className="me-2" onClick={handleGuardarYContinuar}>Guardar y continuar</Button>
        <Button variant="secondary" onClick={prevStep}>Volver</Button>
      </div>
    </Container>
  );
};

export default SeleccionServicios;