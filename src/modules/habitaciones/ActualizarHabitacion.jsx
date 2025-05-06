import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Form } from 'react-bootstrap';
import RESTServicio from '../../services/RESTServicio'; // Assuming RESTServicio is in this path
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure bootstrap is imported
import { useTemporalAlert } from '../../shared/context/TemporalAlertContext';
import { useNavigate } from 'react-router-dom';
import { DoorClosedFill } from 'react-bootstrap-icons';
import PopUpWithAction from '../../shared/modals/PopUpWithAction';
import { useOutletContext } from 'react-router-dom';

const ActualizarHabitacion = () => {
  // Colocacion de titulo a Dashboard según ruta
  const {setTituloDashboard} = useOutletContext();

  const {addAlert} = useTemporalAlert();
  const navigate = useNavigate();
  const { id } = useParams(); // Obtener el numero de habitacion
  const [habitacion, setHabitacion] = useState(null);
  const [formData, setFormData] = useState({
    precio: '',
    tipo: '',
    descripcion: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {GetById, Update} = RESTServicio("habitaciones")

  useEffect(() => {
    const fetchHabitacion = async () => {
      try {
        let data = await GetById(id)
        data = data[0]

        setHabitacion(data);
        setFormData({
          precio: data.precio || '',
          tipo: data.tipo || '',
          descripcion: data.descripcion || '',
        });
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchHabitacion();
    setTituloDashboard("Detalle de Habitación")
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    
    const habitacionDTO = {
      numero: habitacion.numero,
      tipo: formData.tipo,
      descripcion: formData.descripcion,
      precio: formData.precio,
      piso: habitacion.piso,
      estado: habitacion.estado
    }
    await Update(habitacion.numero, habitacionDTO)
    addAlert("Habitación actualizada", "success")
    navigate('/habitaciones')
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    addAlert("Error al cargar la habitación", "danger")
    navigate("/habitaciones")
    return <div>Error al cargar la habitación: {error.message}</div>;
  }

  if (!habitacion) {
    addAlert("No se encontró el registro de la habitación", "warning")
    return <div>No se encontró el registro de la habitación</div>;
  }

  return (
    <Container>
      <Row className="my-4">
        <Col>
          <Card bg='primary' text='light'>
            <Card.Header>
              <Card.Subtitle className='text-dark'>{habitacion.tipo}</Card.Subtitle>  
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={9}>
                  <Card.Title>Habitación Nro {habitacion.numero}</Card.Title>
                  <Card.Text>{habitacion.descripcion}</Card.Text>
                  <p><strong>Precio x Noche:</strong> S/ {habitacion.precio}</p>
                  <p><strong>Nro Piso:</strong> {habitacion.piso}</p>
                </Col>
                <Col md={3} className="d-flex justify-content-center align-items-center">
                  {/* Placeholder for room icon */}
                  <DoorClosedFill color='var(--blue-100)' size={70}/>

                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="my-4">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Editar datos</Card.Title>
              <Form>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formprecio">
                      <Form.Label>Precio x Noche</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Escriba aquí"
                        name="precio"
                        value={formData.precio}
                        onChange={handleInputChange}
                        min={1}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formTipo">
                      <Form.Label>Tipo</Form.Label>
                      <Form.Control
                        as="select"
                        name="tipo"
                        value={formData.tipo}
                        onChange={handleInputChange}
                      >
                        <option value="">Seleccione un tipo</option>
                        <option value="basica">Básica</option>
                        <option value="especial">Especial</option>
                        <option value="premium">Premium</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3" controlId="formDescripcion">
                  <Form.Label>Descripcion</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Write a message"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <PopUpWithAction
                action={handleSubmit}
                haveCancellButton={true}
                modalContent={<p>Al modificar los datos las reservas realizadas se actualizarán cambiando su monto de cliente.</p>}
                modalTitle='Actualizar datos de habitación'
                textActionButton='Guardar cambios'
                textShowModalButton='Guardar cambios'
                variantActionButton='warning'
                variantShowModalButton='success'
                />
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ActualizarHabitacion;