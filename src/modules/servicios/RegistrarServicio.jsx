import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  FormControl,
  FormLabel,
} from "react-bootstrap";
import { BagFill } from "react-bootstrap-icons";
import "./RegistrarServicio.css"; // Import the CSS file
import TopNav from "../../components/TopNav";
import DashboardNote from "../../components/DashboardNote";
import { useNavigate } from "react-router-dom";


import { useTemporalAlert } from "../../shared/context/TemporalAlertContext";
import RESTServicio from "../../services/RESTServicio";
import InactivePopUpWithAction from "../../shared/modals/InactivePopUp";


const RegistrarServicio = () => {
  const [nombreServicio, setNombreServicio] = useState("");
  const [precioServicio, setPrecioServicio] = useState("");
  const [descripcionServicio, setDescripcionServicio] = useState("");
  const [showModalInfo, setShowModalInfo] = useState(false);
  const servicioServicios = RESTServicio("servicios")
  const navigate = useNavigate();

  const {addAlert} = useTemporalAlert();

  const handleNombreChange = (event) => {
    setNombreServicio(event.target.value);
  };

  const handlePrecioChange = (event) => {
    setPrecioServicio(event.target.value);
  };

  // API
  const handleRegistrarClick = async() => {
    if(nombreServicio.trim()==='' || precioServicio.trim()===''){
        addAlert("Brinde todos los datos, por favor")
        return;
    }
    try{
        await servicioServicios.Post({
            nombre:nombreServicio,
            descripcion: descripcionServicio,
            precio: precioServicio
        })
        setShowModalInfo(true )
    }catch(err){
        addAlert("Hubo un error al registrar el nuevo servicio")
    }
  };

  return (
    <Container fluid>
            {/* POPUP DE ALERTA CUANDO SE REGISTRE UN NUEVO SERVICIO */}
            <InactivePopUpWithAction 
            action={()=>navigate("/servicios")}
            haveCancellButton={false}
            modalContent={<></>}
            modalTitle="Servicio registrado"
            onHide={()=>setShowModalInfo(false)}
            show={showModalInfo}
            textActionButton="Ok"
            variantActionButton="success"
            />
      <TopNav linkTo="/servicios" title="Nuevo servicio de Hotelería" />
      <div className="px-4">
        <DashboardNote
          note="Los servicios se podrán brindar en todas las habitaciones como valores agregados a la reservación"
          variant="tertiary"
        />
      </div>
      <Row className="p-4">
        <Col md={7}>
          <h3>Datos del servicio</h3>
          <Form>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formNombre">
                  <FormLabel>Nombre*</FormLabel>
                  <FormControl
                    type="text"
                    placeholder="Escriba aquí"
                    value={nombreServicio}
                    onChange={handleNombreChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formPrecio">
                  <FormLabel>Precio (S/.)*</FormLabel>
                  <FormControl
                    type="number"
                    placeholder="Escriba aquí"
                    value={precioServicio}
                    onChange={handlePrecioChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3" controlId="formDescripcion">
              <FormLabel>Descripción</FormLabel>
              <FormControl
                value={descripcionServicio}
                onChange={(e) => setDescripcionServicio(e.target.value)}
                as="textarea"
                rows={5}
                placeholder="Descripcion del servicio, como condiciones, personal..."
              />
            </Form.Group>
            <Button variant="success" onClick={handleRegistrarClick}>
              Registrar
            </Button>
          </Form>
        </Col>
        <Col md={5}>
          <div className="service-preview">
            <BagFill size={50} className="mb-3" />
            <h4>{nombreServicio || "Nombre de Servicio"}</h4>
            <p>S/.{precioServicio || "0"}</p>
          </div>
        </Col>
      </Row>

    
    </Container>
  );
};

export default RegistrarServicio;
