import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, InputGroup } from 'react-bootstrap';
import { ArrowLeft, PersonFill, TelephoneFill } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import DashboardNote from '../../../components/DashboardNote';
import HoverIcon from '../../../utils/HoverIcon/HoverIcon';
import { useReserva } from '../../../shared/context/ReservaContext';
import RESTServicio from '../../../services/RESTServicio';
import { useTemporalAlert } from '../../../shared/context/TemporalAlertContext';


const NuevaReservacion = () => {

  const { updateReservaData, nextStep } = useReserva();

  // Datos para el cliente
  const [nombresCompletos, setNombresCompletos] = useState('');
  const [dni, setDni] = useState('');
  const [telefono, setTelefono] = useState('');
  const [numeroPersonas, setNumeroPersonas] = useState('');
  const [notaAdicional, setNotaAdicional] = useState('');
  const [direccion, setDireccion] = useState('');
  const [correo, setCorreo] = useState('');
  const [dniBuscar, setDniBuscar] = useState('');

  const {addAlert} = useTemporalAlert();
  const {GetById} = RESTServicio("huespedes")

  // Cargar datos por DNI
  const handleCargarDatos = async()=>{
    try{
      let cliente = await GetById(dniBuscar)
      if(cliente.length===0){
        addAlert("No se encontró cliente con DNI: " + dniBuscar, "warning")
        return;
      }
      cliente = cliente[0]
      //  Rellenar los campos con los datos traidos
      addAlert("Cargando datos...")
      setNombresCompletos(cliente.nombre)
      setCorreo(cliente.correo)
      setDireccion(cliente.direccion)
      setDni(cliente.documento_identidad)
      setTelefono(cliente.telefono)

    }catch (error){
      addAlert("No pudo consultar los datos del cliente", "danger")
    }
  }


  // Enviar a backend
  const handleGuardar = () => {
    // Filtro para los datos
    if(!(nombresCompletos && dni && telefono && correo && direccion)){
      addAlert("Debe rellenar todos estos campos", "warning")
      return;
    }
    updateReservaData({
      cliente: {
        nombre: nombresCompletos,
        apellido: nombresCompletos,
        documento_identidad: dni,
        telefono:telefono,
        correo:correo,
        direccion,
        notaAdicional: notaAdicional
      },
      numeroPersonas
    });
    nextStep();
  };

  return (
    // Titular
    <Container fluid className="p-0">
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
      <DashboardNote variant='tertiary' note="Al registrar una nueva reserva, debe asignar un cliente el 
cual obtendrá el número de confirmación"/>
      </Row>
    
      {/* Cargar datos del cliente  */}
      <Row className='px-4 pb-4'>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Cliente</Card.Title>
              <InputGroup className="mb-3">
                <Form.Control
                  type='number'
                  placeholder="Cargar datos por DNI"
                  aria-label="Cargar datos por DNI"
                  value={dniBuscar}
                  onChange={(e) => setDniBuscar(e.target.value)}
                />
                <Button variant="success" onClick={handleCargarDatos}>Buscar</Button>
              </InputGroup>
            </Card.Body>
          </Card>

          {/* Formulario para datos de cliente */}
          <Card>
            <Card.Body>
              <Card.Title>Datos del cliente</Card.Title>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formNombresCompletos">
                    <Form.Label>Nombres completos*</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Escriba aquí"
                      value={nombresCompletos}
                      onChange={(e) => setNombresCompletos(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formDni">
                    <Form.Label>DNI*</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Escriba aquí"
                      value={dni}
                      onChange={(e) => setDni(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formTelefono">
                    <Form.Label>Teléfono*</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Escriba aquí"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formCorreo">
                    <Form.Label>Correo*</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Escriba aquí"
                      value={correo}
                      onChange={(e) => setCorreo(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formDireccion">
                    <Form.Label>Dirección*</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Escriba aquí"
                      value={direccion}
                      onChange={(e) => setDireccion(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formNumeroPersonas" onClick={()=>addAlert("No implementado","warning")}>
                    <Form.Label>Número de personas</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Escriba aquí"
                      value={numeroPersonas}
                      onChange={(e) => setNumeroPersonas(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3" controlId="formNotaAdicional">
                <Form.Label>Nota adicional</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Write a message"
                  value={notaAdicional}
                  onChange={(e) => setNotaAdicional(e.target.value)}
                />
              </Form.Group>
            </Card.Body>
          </Card>

          <Button variant="success" size="lg" onClick={handleGuardar} className="mt-3">
            Guardar y continuar
          </Button>
        </Col>

        <Col md={4}>
          <Card className="text-center p-4" style={{ backgroundColor: 'var(--blue-100)' }}>
            <PersonFill size={80} className="mx-auto mb-3" />
            <h5>{nombresCompletos.length !==0 ? nombresCompletos : "Nombre de Cliente"}</h5>
            <p><TelephoneFill className="me-2" />{telefono.length !==0 ? telefono : "telefono"}</p>
            <p className="text-muted mt-3">Asignando a un cliente 1/3</p> 
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default NuevaReservacion;