/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import RESTServicio from '../../../services/RESTServicio';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTemporalAlert } from '../../../shared/context/TemporalAlertContext';
import { useNavigate } from 'react-router-dom';
import { PersonFill } from 'react-bootstrap-icons'; // Icono de persona
import PopUpWithAction from '../../../shared/modals/PopUpWithAction';
import { useOutletContext } from 'react-router-dom';

const DetalleCliente = () => {
  const { setTituloDashboard } = useOutletContext();
  const { addAlert } = useTemporalAlert();
  const navigate = useNavigate();
  const { id } = useParams(); // Obtener el ID del cliente
  const [cliente, setCliente] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    correo: '',
    direccion: '',
    notaAdicional: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { GetById, Update } = RESTServicio("huespedes"); // Usar el recurso "huespedes"

  useEffect(() => {
    const fetchCliente = async () => {
      try {
        let data = await GetById(id);
        data = data[0]; // un solo cliente por DNI
        setCliente(data);
        setFormData({
          ...formData,
          ...data
        });
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchCliente();
    setTituloDashboard("Detalles del cliente");
  }, [id]);

  // Manejo dinámico de inputs: name=formData atributo
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Preparación y precauciones al registrar
  const handleSubmit = async () => {
    // Prepara los datos a actualziar
    const clienteDTO = {
      ...cliente, 
      ...formData
    };

    try {
      await Update(cliente.documento_identidad, clienteDTO); 
      addAlert("Datos del cliente actualizados", "success");
      navigate("/clientes")
    } catch (error) {
      console.error("Error al actualizar cliente:", error);
      addAlert("Error al actualizar datos del cliente", "danger");  
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    addAlert("Error al cargar los datos del cliente", "danger");
    return <div>Error al cargar los datos del cliente: {error.message}</div>;
  }

  if (!cliente) {
    addAlert("No se encontró el registro del cliente", "warning");
    return <div>No se encontró el registro del cliente</div>;
  }

  return (
    <Container fluid>
      {/* Sección de detalles del cliente */}
      <Row className="px-4 mt-4">
        <Col>
          <Card className="p-3" style={{ backgroundColor: 'var(--blue-100)' }}> 
            <Row>
              <Col md={9}>
                <h3>{cliente.nombre + " " + cliente.apellido}</h3>
                <p><strong>Teléfono:</strong> {cliente.telefono}</p>
                {/* Futuros posibles datos a obtener */}
                <p>{cliente.notaAdicional}</p>
                <Row>
                  <Col>
                    <p><strong>Reservas realizadas:</strong> {cliente.reservasRealizadas || 0}</p> 
                    <p><strong>Reservas canceladas:</strong> {cliente.reservasCanceladas || 0}</p> 
                    <p><strong>Servicio más consumido:</strong> {cliente.servicioMasConsumido || 'N/A'}</p> 
                  </Col>
                  <Col>
                    <p><strong>Fecha de registro:</strong> {cliente.fechaRegistro ? new Date(cliente.fechaRegistro).toLocaleDateString() : 'N/A'}</p> 
                    <p><strong>Tipo de Habitación preferida:</strong> {cliente.tipoHabitacionPreferida || 'N/A'}</p> 
                    <p><strong>DNI:</strong> {cliente.documento_identidad || 'N/A'}</p> 
                  </Col>
                </Row>
              </Col>
              <Col md={3} className="d-flex justify-content-center align-items-center">
                <PersonFill size={100} color="var(--cyan-800)" /> 
              </Col>
            </Row>
            <Row className="mt-3">
              <Col className="text-end">
              {/* Aun no implementado */}
                <Button onClick={()=>addAlert("No implementado", "warning")} variant="secondary" size="sm">Enviar mensaje promocional</Button> {/* Botón "Enviar mensaje promocional" */}
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Sección de editar datos */}
      <Row className="m-4">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Editar datos</Card.Title>
              <Form>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formNombres">
                      <Form.Label>Nombres*</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Escriba aquí"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formNombres">
                      <Form.Label>Nombres*</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Escriba aquí"
                        name="apellido"
                        value={formData.apellido}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formTelefono">
                      <Form.Label>Teléfono*</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Escriba aquí"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formTelefono">
                      <Form.Label>Correo*</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Escriba aquí"
                        name="correo"
                        value={formData.correo}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formTelefono">
                      <Form.Label>Dirección*</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Escriba aquí"
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleInputChange}
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
                    name="notaAdicional"
                    value={formData.notaAdicional}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                {/* Botón para enviar datos */}
                <PopUpWithAction 
                action={handleSubmit}
                haveCancellButton={true}
                modalContent={<p>Los datos cambiarán para todos los futuros usos de los datos, tanto en facturas y reservas.</p>}
                modalTitle='¿Desea modificar este cliente?'
                textActionButton='Sí, guardar cambios'
                textShowModalButton='Guardar cambios'
                variantActionButton='danger'
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

export default DetalleCliente;