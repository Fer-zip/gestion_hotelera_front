import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { PersonFill, CurrencyDollar, CalendarPlusFill, GraphUp, AwardFill, PeopleFill } from 'react-bootstrap-icons';
import './DashboardGeneral.css'; 
import RESTServicio from '../../services/RESTServicio';

const DashboardGeneral = () => {
    const {Get} = RESTServicio('dashboard')
    const [data, setData] = useState({});

    // API DATA
    useEffect(()=>{
        (async()=>{
             setData(await Get());
        })()
    }, [])


  return (
    <Container fluid className="p-4">
      <Row className="mb-4">
        <Col md={4}>
          <Card className="shadow-sm h-100" style={{ backgroundColor: '#e0e7ff' }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <Card.Title className="text-muted small">N° CLIENTES REGISTRADOS</Card.Title>
                  <Card.Text className="h3">{data.clientes_registrados}</Card.Text>
                </div>
                <PeopleFill size={40} color="#007bff" />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm h-100" style={{ backgroundColor: '#e0e7ff' }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <Card.Title className="text-muted small">GANANCIAS MENSUALES</Card.Title>
                  <Card.Text className="h3">S/{data.ganancias_mes}</Card.Text>
                </div>
                <GraphUp size={40} color="#007bff" /> 
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm h-100" style={{ backgroundColor: '#e0e7ff' }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <Card.Title className="text-muted small">RESERVAS REALIZADAS</Card.Title>
                  <Card.Text className="h3">{data.reservas_realizadas}</Card.Text>
                </div>
                <CalendarPlusFill size={40} color="#007bff" /> 
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Body style={{ minHeight: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="shadow-sm bg-info" style={{color: '#1B0333' }}> 
            <Card.Body>
              <Card.Title className="small"><AwardFill size={20} className="me-2"/> CLIENTE DESTACADO</Card.Title>
              <div className="d-flex justify-content-between align-items-center mt-3">
                <div className="d-flex align-items-center">
                  <PersonFill size={30} className="me-3"/>
                  <Card.Text className="h4 mb-0">{data.cliente_top}</Card.Text>
                </div>
                <Card.Text className="h5 mb-0">{data.reservas_cliente_top} RESERVAS</Card.Text>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardGeneral;