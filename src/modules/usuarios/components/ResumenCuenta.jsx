import React from 'react';
import { Button, Card } from 'react-bootstrap';
import './ResumenCuenta.css';

function ResumenCuenta() {
  return (
    <div className="resumen-cuenta-container">
      
      {/* Información de reserva */}
      <div className="info-reserva">
        <h4 className="reserva-codigo">RS-0011</h4>

        <div className="detalles">
          <h6>Reserva</h6>
          <p><strong>DNI:</strong> 919199</p>
          <p><strong>Cliente:</strong> Teodoro Pasteles</p>
          <p><strong>Tipo Habitación:</strong> Básica - S/50 x día</p>
          <p><strong>Días de estadía:</strong> 10</p>
          <p><strong>Fecha reserva:</strong> 18/04/2025</p>
        </div>

        <div className="servicios">
          <h6>Servicios</h6>
          <ul>
            <li>Internet 4G - S/29</li>
            <li>Jacuzzi - S/100</li>
          </ul>
        </div>

        <div className="servicios-anadidos">
          <h6>Servicios añadidos</h6>
          <ul>
            <li>Cena - S/30</li>
          </ul>
        </div>

        <div className="recepcionista">
          <h6>Recepcionista</h6>
          <p>Diego Marines</p>
        </div>
      </div>

      {/* Factura */}
      <Card className="factura-card">
        <Card.Body>
          <h5>Factura</h5>
          <p><strong>Fecha checkin:</strong> 19/05/2025</p>
          <p><strong>Fecha checkout:</strong> 19/05/2025</p>
          <p><strong>Importe Total:</strong> S/350</p>
          <p><strong>Importe Total (inc. IGV):</strong> S/400</p>

          <Button variant="info" className="pagar-btn">Pagar</Button>
        </Card.Body>
      </Card>
    </div>
  );
}

export default ResumenCuenta;
