import React from 'react';
import './Checkin.css';

function Checkin() {
  const reserva = {
    numeroReserva: 'RS-0011192',
    cliente: 'Teodoro Pasteles',
    tipoHabitacion: 'Básica',
    numeroConfirmacion: 'A21919191',
    fechaCreacion: '12/04/2025',
    montoTotal: 'S/. 99.99',
    servicios: ['Internet 4G', 'Jacuzzi'],
  };

  return (
    <div className="checkin-page">
      <div className="reserva-card">
        <div className="reserva-info">
          <h2>{reserva.numeroReserva}</h2>
          <div className="info-grid">
            <div>
              <p><strong>Cliente:</strong> {reserva.cliente}</p>
              <p><strong>Monto Total:</strong> {reserva.montoTotal}</p>
              <p><strong>Servicios:</strong> {reserva.servicios.join(', ')}</p>
            </div>
            <div>
              <p><strong>Tipo de Habitación:</strong> {reserva.tipoHabitacion}</p>
              <p><strong>Nro. Confirmación:</strong> {reserva.numeroConfirmacion}</p>
              <p><strong>Fecha Creada:</strong> {reserva.fechaCreacion}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Realizar Check-in */}
      <h2 className="realizar-checkin">Realizar check-in</h2>
      <p className="mensaje-llaves">Recuerde entregar las llaves de la habitación</p>

      {/* Botón */}
      <button className="boton-iniciar">Iniciar</button>
    </div>
  );
}

export default Checkin;