import React, { useState } from 'react';
import { Button, Form, Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import RESTServicio from '../../../services/RESTServicio';
import { useTemporalAlert } from '../../../shared/context/TemporalAlertContext';
import TopNav from "../../../components/TopNav";
import DashboardNote from "../../../components/DashboardNote";
import { PersonFill } from "react-bootstrap-icons";

function RegistrarCliente() {
  const navigate = useNavigate();
  const { addAlert } = useTemporalAlert();
  const { Post } = RESTServicio("huespedes");

  const [formData, setFormData] = useState({
    documento_identidad: '', 
    nombre: '',
    apellido: '',
    telefono: '',
    correo: '',
    direccion: '',
    notaAdicional: '',
  });

  // Manejo de datos dinamicos
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.documento_identidad || !formData.nombre || !formData.apellido || !formData.telefono || !formData.correo || !formData.direccion) {
      addAlert("Por favor, complete todos los campos obligatorios.", "warning");
      return;
    }

    try {
      await Post(formData);
      addAlert("Cliente registrado exitosamente", "success");
      navigate("/clientes"); 
    } catch (error) {
      console.error("Error al registrar cliente:", error);
      addAlert("Error al registrar cliente", "danger");
    }
  };

  return (
    <Container fluid>
      <TopNav
        linkTo="/clientes"
        title="Registrar Cliente"
      />

      {/* Texto de introducción */}
      <Row className="p-4">
        <DashboardNote
          note="Registre un nuevo cliente en el sistema para gestionar sus reservas y datos personales."
          variant="tertiary"
        />
      </Row>

      {/* FORMULARIO DE REGISTRO Y PANEL */}
      <div className="container-fluid px-4 pb-4">
        <Row>
          {/* Formulario */}
          <Col md={6}>
            <Card>
              <Card.Body>
                <Card.Title>Formulario de Registro de Cliente</Card.Title>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="formDni">
                        <Form.Label>DNI*</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Ingrese DNI"
                          name="documento_identidad"
                          value={formData.documento_identidad}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="formNombres">
                        <Form.Label>Nombres*</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Ingrese nombres"
                          name="nombre"
                          value={formData.nombre}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="formApellidos">
                        <Form.Label>Apellidos*</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Ingrese apellidos"
                          name="apellido"
                          value={formData.apellido}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="formTelefono">
                        <Form.Label>Teléfono*</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Ingrese teléfono"
                          name="telefono"
                          value={formData.telefono}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="formCorreo">
                        <Form.Label>Correo*</Form.Label>
                        <Form.Control
                          type="email"
                          placeholder="Ingrese correo electrónico"
                          name="correo"
                          value={formData.correo}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="formDireccion">
                        <Form.Label>Dirección*</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Ingrese dirección"
                          name="direccion"
                          value={formData.direccion}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-3" controlId="formNotaAdicional">
                    <Form.Label>Nota adicional</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Notas adicionales sobre el cliente"
                      name="notaAdicional"
                      value={formData.notaAdicional}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Registrar Cliente
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          {/* Panel de Cliente */}
          <PanelCliente
            dni={formData.documento_identidad}
            nombre={formData.nombre}
            apellido={formData.apellido}
            telefono={formData.telefono}
            correo={formData.correo}
            direccion={formData.direccion}
          />
        </Row>
      </div>
    </Container>
  );
}

function PanelCliente({ dni, nombre, apellido, telefono, correo, direccion }) {
  return (
    <Col md={6} className="d-flex flex-column align-items-center justify-content-center">
      <div className="cuadro-cliente p-4 rounded mb-3" style={{ backgroundColor: 'var(--blue-100)' }}>
        <div className="text-center mb-3">
          <PersonFill color="var(--cyan-800)" size={100} />
          <div className="fw-bold text-primary">{nombre || 'Nombres'} {apellido || 'Apellidos'}</div>
          <div className="text-primary">
            <strong>DNI:</strong> {dni}
          </div>
          <div className="text-primary">
            <strong>Teléfono:</strong> {telefono}
          </div>
          <div className="text-primary">
            <strong>Correo:</strong> {correo}
          </div>
          <div className="text-primary">
            <strong>Dirección:</strong> {direccion }
          </div>
        </div>
      </div>
    </Col>
  );
}

export default RegistrarCliente;