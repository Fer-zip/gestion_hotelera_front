import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  InputGroup,
} from "react-bootstrap";
import { BoxSeam, Search } from "react-bootstrap-icons";
import ActionCardDashboard from "../../components/ActionCard";
import DashboardNote from "../../components/DashboardNote";

import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import RESTServicio from "../../services/RESTServicio";
import HoverIcon from "../../utils/HoverIcon/HoverIcon";

import { useTemporalAlert } from "../../shared/context/TemporalAlertContext";
import InactivePopUpWithAction from "../../shared/modals/InactivePopUp";

function DashboardServicios() {
  const { setTituloDashboard } = useOutletContext();
  const serviceServicios = RESTServicio("servicios");
  const [servicios, setServicios] = useState([]);
  const [searchService, setSearchService] = useState('');

  const { addAlert } = useTemporalAlert();

  // Estados para controlar mis PopUps
  const [showAlertAtDeleteService, setShowAlertAtDeleteService] = useState(false);
  const [idServiceToDelete, setIdServiceToDelete] = useState(0);

  setTituloDashboard("Gestión de Servicios");

  // API
  useEffect(() => {
    // Funcion autoejecutable
    (async () => {
      setServicios(await serviceServicios.Get());
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Manejar acciones
  const handleEliminarServicio = async (idServicio) => {
    try {
        addAlert("Servicio removido", "danger")
      await serviceServicios.Delete(idServicio);
      setServicios(await serviceServicios.Get())
    } catch (err) {
        addAlert("Hubo un error al remover el servicio")
    }
  };

  const handleBuscarServicio = async()=>{
    try {
        let serviciosEncontrados = [];
        if(searchService.trim()===''){
            serviciosEncontrados = await serviceServicios.Get()
        }else{
            serviciosEncontrados = await serviceServicios.GetById(searchService)
        }
        setServicios(serviciosEncontrados)
    } catch (error) {
        addAlert("Hubo un error al obtener los datos", "danger")
    }
  }

  const handleVerDetallesServicio = async (idServicio) => {
    addAlert("Ver detalles: " + idServicio);
  };


  return (
    <Container fluid className="p-2">
      <DashboardNote
        variant="tertiary"
        note="Los servicios son los gastos y valores añadidos a la estadía para el cliente.
         Administre los servicios que cuenta su hotelería desde aquí. Consulte datos acerca de su consumo."
      />

      <Row className="my-4">
        <Col xs={12} md={4} lg={3}>
          <ActionCardDashboard
            linkTo="/registrar-servicio" // Ajustar la ruta según sea necesario
            icon={
              <HoverIcon
                iconoNormal={
                  <BoxSeam size={40} color="#CFE2FF" className="mx-2 mb-2" />
                }
                iconoHover={
                  <BoxSeam size={40} color="#FFF" className="mx-2 mb-2" />
                }
              />
            }
            titleCard="Nuevo servicio"
          />
        </Col>
      </Row>

      <h2 className="mt-4">Todos los Servicios</h2>
    {/* BUSQUEDA DE SERVICIOS BASADO EN NOMBRE */}
      <Row className="my-3">
        <Col xs={12} md={6} lg={4}>
          <InputGroup>
            <InputGroup.Text>
              <Search />
            </InputGroup.Text>
            <Form.Control
              placeholder="Buscar por nombre"
              aria-label="Buscar por nombre"
              value={searchService}
              onChange={(e)=>setSearchService(e.target.value)}
            />
            <Button variant="success" onClick={handleBuscarServicio}>Buscar</Button>
          </InputGroup>
        </Col>
      </Row>

      <Row xs={1} md={2} lg={3} className="g-4">
        {servicios.map((servicio) => (
          <Col key={servicio.id_servicio}>
            <Card>
              <Card.Body>
                <Card.Subtitle className="mb-2 text-muted">
                  {servicio.tipo}
                </Card.Subtitle>
                <Card.Title>
                  {servicio.nombre} - S/{servicio.precio}
                </Card.Title>
                <Card.Text>{servicio.descripcion}</Card.Text>
                <Button
                  variant="info"
                  size="sm"
                  className="me-2"
                  onClick={async () => {
                    await handleVerDetallesServicio(servicio.id_servicio);
                  }}
                >
                  Ver detalles
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    setIdServiceToDelete(servicio.id_servicio);
                    setShowAlertAtDeleteService(true);
                  }}
                >
                  Eliminar
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

        {/* PopUps de apoyo y alerta */}
        {/* ALERTA AL ELIMINAR SERVICIO */}
        <InactivePopUpWithAction 
            action={async()=>await handleEliminarServicio(idServiceToDelete)}
            haveCancellButton={true}
            modalContent={
                <p>Al eliminar un servicio, los clientes no podrán accederlo</p>
            }
            modalTitle="¿Desea remover el servicio de la hotelería?"
            onHide={()=>{setShowAlertAtDeleteService(false)}}
            show={showAlertAtDeleteService}
            textActionButton="Sí, remover"
            variantActionButton="danger"
        />

    </Container>
  );
}

export default DashboardServicios;
