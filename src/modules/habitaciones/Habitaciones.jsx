/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import "./Habitaciones.css";
import { useOutletContext } from "react-router-dom";
import RESTServicio from "../../services/RESTServicio";
import { useTemporalAlert } from "../../shared/context/TemporalAlertContext";
import { Button, Container, Row, Col, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import DashboardNote from "../../components/DashboardNote";
import ActionCardDashboard from "../../components/ActionCard";
import { DoorClosedFill } from "react-bootstrap-icons";
import HoverIcon from "../../utils/HoverIcon/HoverIcon";


function Habitaciones() {
  const [filtro, setFiltro] = useState("Todos");

  const { setTituloDashboard } = useOutletContext();
  const { addAlert } = useTemporalAlert();
  const { Get } = RESTServicio("habitaciones");
  const [habitaciones, setHabitaciones] = useState([]);

  // Consulta API
  const cargarHabitaciones = async () => {
    try {
      const data = await Get();
      setHabitaciones(data);
    } catch (error) {
      addAlert("Hubo un error al obtener los datos", "danger");
    }
  };

  // Ejecutados al construi el componente
  useEffect(() => {
    setTituloDashboard("Gestión de Habitaciones");
    cargarHabitaciones();
  }, [setTituloDashboard]);

  // Filtrar habitaciones por estado
  const filtrarHabitaciones = (e) => {
    setHabitaciones(
      filtro === "Todos"
        ? habitaciones
        : habitaciones.filter((h) => h.tipo.includes(filtro))
    );
  };

  return (
    // Todavía no implementado
    <Container
    >
      {/* Contenido principal */}
      <DashboardNote
        variant="tertiary"
        note="Administre a todos los usuarios del sistema, remueva registros, añada usuarios para sus trabajadores y consulte estadísticas acerca de ellos."
      />

      {/* Cartas de accion */}
      <Row className="mb-3">
        <Col md={3}>
          <ActionCardDashboard
            linkTo="/registrar-habitacion"
            titleCard="Registrar Habitacion"
            icon={
              <HoverIcon
                iconoNormal={
                  <DoorClosedFill
                    color="#CFE2FF"
                    size={30}
                    className="mx-2 mb-2"
                  />
                }
                iconoHover={
                  <DoorClosedFill
                    color="#FFF"
                    size={30}
                    className="mx-2 mb-2"
                  />
                }
              />
            }
          />
        </Col>
      </Row>

      <Row>
        <Col>
          <h2>Todas las Habitaciones</h2>
        </Col>
      </Row>
        <Col md={3} className="p-3">
          <div className="filtro-container" onClick={() => addAlert("Todavía no implementado", "warning")}>
            <label htmlFor="filtro">Filtrar por tipo:</label>
            <Form.Select
              id="filtro"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            >
              <option value="Todos">Todos</option>
              <option value="Básico">Básico</option>
              <option value="Especial">Especial</option>
              <option value="Premium">Premium</option>
            </Form.Select>
          </div>
        </Col>
      <Row>
        <Col md={9}>
          <div className="habitaciones-listado">
            <div className="grid-habitaciones">
              {habitaciones ? (
                habitaciones.map((hab, index) => (
                  <HabitacionCard key={index} hab={hab} />
                ))
              ) : (
                <h3>No hay habitaciones registradas</h3>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

// Separar en un componente
function HabitacionCard({ hab }) {
  const navigate = useNavigate();
  // Manejar acciones para las habitaciones
  const onEditarHabitacion = (numeroHabitacion) => {
    navigate("/detalle-habitacion/" + numeroHabitacion);
  };

  return (
    <div className={"habitacion-card habitacion-estado-" + hab.estado}>
      <p className="text-secondary">{hab.tipo}</p>
      <div className="habitacion-numero">{hab.numero}</div>
      <div
        className={`habitacion-estado ${
          hab.estado === "" ? "libre" : "ocupada"
        }`}
      >
        {hab.estado === "disponible" ? "🗝️" : "🔒"}
        {" - " + hab.estado.charAt(0).toUpperCase() + hab.estado.slice(1)}
      </div>
      <div className="habitacion-descripcion">{hab.descripcion}</div>
      <div className="habitacion-precio">S/{hab.precio}/noche</div>
      <div className="text-tertiary">Piso: {hab.piso}</div>
      <Container>
        <Col className="d-flex gap-2 py-1 justify-content-end">
          <Button variant="info" onClick={() => onEditarHabitacion(hab.numero)}>
            Detalles
          </Button>
        </Col>
      </Container>
    </div>
  );
}

export default Habitaciones;
