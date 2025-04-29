import React, { useState, useEffect } from "react";
import {
  Table,
  Row,
  Col,
  FormControl,
  Button,
  InputGroup,
  Spinner,
  Alert,
  Form
} from "react-bootstrap";
import { Search, PersonPlusFill } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import DashboardNote from "../../../components/DashboardNote";
import ActionCardDashboard from "../../../components/ActionCard";
import HoverIcon from "../../../utils/HoverIcon/HoverIcon";
import RESTServicio from "../../../services/RESTServicio"; 

import PopUpWithAction from "../../../shared/modals/PopUpWithAction";
import { useTemporalAlert } from "../../../shared/context/TemporalAlertContext";

const ClienteDashboard = () => {
  const { setTituloDashboard } = useOutletContext();
  const [allClients, setAllClients] = useState([]);
  const [nota, setNota] = useState();
  const [displayedClients, setDisplayedClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {addAlert} = useTemporalAlert();

  // Bueno, es otra forma de usarlo desde objeto sin desestructuración 
  const clienteService = RESTServicio("huespedes"); 
  // Para manejar la adición de Notas
  const notaInput = (
    <Form.Group className="mb-3" controlId="formDescripcion">
      <Form.Label>Descripcion</Form.Label>
      <Form.Control
        as="textarea"
        rows={3}
        placeholder="Escribe un mensaje"
        name="descripcion"
        value={nota}
        onChange={(e)=>setNota(e.target.value)}
      />
    </Form.Group>
  );

  // Colocarle el titulo a dashboard
  setTituloDashboard("Gestión de Clientes");

  // Cargar todos los clientes al montar el componente
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await clienteService.Get();
        setAllClients(data);
        setDisplayedClients(data);
        setLoading(false);
      } catch (err) {
        setError("Error al cargar los clientes.");
        setLoading(false);
        console.error("Error fetching clients:", err);
      }
    };

    fetchClients();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // solo una vez

  const handleSearchChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);

    if (term === "") {
      setDisplayedClients(allClients); // Mostrar todos los clientes si el campo de búsqueda está vacío
    }
  };

  // Agregar nota al cliente
  const handleAddNote = (id) => {
    addAlert("Nota añadida a cliente")
  };

  // Manejo de busqueda
  const handleSearchClick = async () => {
    if (searchTerm.trim() === "") {
      setDisplayedClients(allClients); // Si el campo está vacío, mostrar todos
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Intentar buscar por DNI/ID
      const client = await clienteService.GetById(searchTerm);
      if (client) {
        setDisplayedClients(client); 
      } else {
        setDisplayedClients([]); 
        addAlert("No se encontró ningún cliente con el DNI/ID proporcionado.", "warning")
        setError("No se encontró ningún cliente con el DNI/ID proporcionado.");
      }
    } catch (err) {
      setDisplayedClients([]); 
      setError("Error al buscar el cliente.");
      addAlert("Hubo un error al buscar.", "danger")
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <DashboardNote
        variant="tertiary"
        note="Acceda a información de clientes registrados en el sistema, realice operaciones de notificación ó añada una nota por parte de él."
      />

      <Row className="mb-3">
        <Col md={3}>
          <Link to="/registrar-usuario">
            <ActionCardDashboard
              linkTo="/registrar-cliente"
              titleCard="Nuevo Cliente"
              icon={
                <HoverIcon
                  iconoNormal={
                    <PersonPlusFill
                      color="#CFE2FF"
                      size={30}
                      className="mx-2 mb-2"
                    />
                  }
                  iconoHover={
                    <PersonPlusFill
                      color="#FFF"
                      size={30}
                      className="mx-2 mb-2"
                    />
                  }
                />
              }
            />
          </Link>
        </Col>
      </Row>

      <h2 className="mt-4 mb-3">Todos los clientes</h2>

      {/* Busqueda */}
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Buscar por DNI o ID"
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyDown={(e) => {
            // Permitir búsqueda al presionar Enter
            if (e.key === "Enter") {
              handleSearchClick();
            }
          }}
        />
        {/* Loader de Bootstrap para caraga de producto */}
        <Button
          variant="success"
          onClick={handleSearchClick}
          disabled={loading}
        >
          {loading ? (
            <Spinner animation="border" size="sm" />
          ) : (
            <Search className="me-1" />
          )}{" "}
          Buscar
        </Button>
      </InputGroup>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Tabla de clientes */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>DNI</th>
            <th>Nombres</th>
            <th>Teléfono</th>
            <th>Nro.Reservas realizadas</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" className="text-center">
                <Spinner animation="border" size="sm" className="me-2" />{" "}
                Cargando clientes...
              </td>
            </tr>
          ) : displayedClients.length > 0 ? (
            displayedClients.map((client) => (
              <tr key={client.id}>
                <td>{client.id_huesped}</td> 
                <td>{client.documento_identidad}</td>
                <td>{client.nombre}</td>
                <td>{client.telefono}</td>
                <td>{client.reservas || 0}</td>
                <td>
                  <Link
                    to={`/detalle-cliente/${client.documento_identidad}`}
                    className="btn btn-info btn-sm me-2"
                  >
                    Ver detalles
                  </Link>
                  <PopUpWithAction
                    action={() => handleAddNote(client.id_huesped)}
                    haveCancellButton={true}
                    modalContent={notaInput}
                    modalTitle="Añadi nota"
                    textActionButton="Guardar nota"
                    textShowModalButton="Añadir nota"
                    variantShowModalButton="secondary"
                    variantActionButton="success"
                  />
                  
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No se encontraron clientes.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default ClienteDashboard;
