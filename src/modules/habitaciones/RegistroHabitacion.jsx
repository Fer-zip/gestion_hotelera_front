import React, { useState } from "react";
import { Container, Row, Col, Card, Form } from "react-bootstrap";
import RESTServicio from "../../services/RESTServicio"; // Assuming RESTServicio is in this path
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure bootstrap is imported
import { useTemporalAlert } from "../../shared/context/TemporalAlertContext";
import { useNavigate } from "react-router-dom";
import { DoorClosedFill } from "react-bootstrap-icons";
import PopUpWithAction from "../../shared/modals/PopUpWithAction";
import TopNav from "../../components/TopNav";
import DashboardNote from "../../components/DashboardNote";

const RegistroHabitacion = () => {
  // Colocacion de titulo a Dashboard según ruta

  const { addAlert } = useTemporalAlert();
  const navigate = useNavigate();
  const { Post, GetById } = RESTServicio("habitaciones");

  const [formData, setFormData] = useState({
    numero: 0,
    precio: "",
    tipo: "",
    descripcion: "",
    piso: 0,
    estado: "disponible",
  });

  // Cambio dinámico para Inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    // Consulta de numero para cuando se envia los datos si la habitación ya existe
    const data = await GetById(formData.numero);
    if (data.length) {
        addAlert("No se puede registrar una habitación un número ya existente")
        return;
    }
    await Post(formData)
    addAlert("Habitación registrada", "success");
    navigate('/habitaciones')
  };

  return (
    <Container fluid>
      <TopNav linkTo="/habitaciones" title="Registrar Habitación" />
      <Row className="px-4">
        <DashboardNote
            variant="tertiary"
            note="Al registrar una nueva habitación, esta tiene un estado Disponible y no se pueden crear 2 habitaciones
            con el mismo número"
        />

      </Row>
      <Row className="m-4">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Editar datos</Card.Title>
              <Form>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formprecio">
                      <Form.Label>Número de habitación</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Escriba aquí"
                        name="numero"
                        value={formData.numero}
                        onChange={handleInputChange}
                        min={1}
                      />
                    </Form.Group>
                  </Col>
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
                    <Form.Group className="mb-3" controlId="formprecio">
                      <Form.Label>Piso</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Piso donde se encuentra la habitación"
                        name="piso"
                        value={formData.piso}
                        onChange={handleInputChange}
                        min={0}
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
                    placeholder="Escribe un mensaje"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <PopUpWithAction
                  action={handleSubmit}
                  haveCancellButton={true}
                  modalContent={
                    <p>
                      Podrá ver la nueva habitación desde el Dashboard
                    </p>
                  }
                  modalTitle="Registrar habitación"
                  textActionButton="Registrar"
                  textShowModalButton="Registrar habitación"
                  variantActionButton="success"
                  variantShowModalButton="success"
                />
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <PanelHabitacion
            numero={formData.numero}
            precio={formData.precio}
            tipo={formData.tipo}
          />
        </Col>
      </Row>
    </Container>
  );
};

function PanelHabitacion({ numero, precio, tipo }) {
  return (
    <div className="col-md-6 d-flex flex-column align-items-center justify-content-center">
      <div className="cuadro-usuario p-4 rounded mb-3">
        <div className="text-center mb-3">
          <DoorClosedFill color="var(--cyan-800)" size={100} />
          <div className="fw-bold text-primary">{"Número:" + numero}</div>
          <div className="text-primary">
            <span role="img" aria-label="key">
              S/
            </span>{" "}
            {precio || 0}
          </div>
        </div>
        <div className="text-center">
          <button className="btn btn-outline-warning btn-sm">
            {tipo || "Tipo"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegistroHabitacion;
