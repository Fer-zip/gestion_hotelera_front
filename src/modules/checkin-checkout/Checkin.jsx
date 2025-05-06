import React, { useState } from 'react';
import './Checkin.css';
import { Navigate } from 'react-router-dom';

import { useTemporalAlert } from '../../shared/context/TemporalAlertContext';
import { useReservaHabitacion } from '../../shared/context/ReservaHabitacionContext';
import { useOutletContext } from 'react-router-dom';
import RESTServicio from '../../services/RESTServicio';


import { DoorClosedFill } from 'react-bootstrap-icons';


function Checkin() {
  const {reserva, habitacion, limpiarDatos} = useReservaHabitacion();
  const {addAlert} = useTemporalAlert();
  const {setTituloDashboard} = useOutletContext();
  const [dataCheckin, setDataCheckin] = useState({
    fechaInicio: 0
  })

  const [hasCheckin, setHasCheckin] = useState(false);

  const servicioReserva = RESTServicio("reservas")
  const servicioHabitacionesReserva = RESTServicio("habitacionReserva")
  const servicioHabitaciones = RESTServicio("habitaciones")
  const servicioCheckin = RESTServicio('check');

  setTituloDashboard("Checkin")


  const iniciarCheckin = async()=>{

    addAlert("Iniciando check-in de reserva: ")
    // Actualizar el estado de la habitación
    await servicioHabitaciones.Update(habitacion.numero, {...habitacion, estado: "ocupada"})
    // Actualizar el estado de la reserva
    await servicioReserva.Update(reserva.id_reserva, {...reserva, estado: "confirmada"})
    // Relacion de registro 
    await servicioHabitacionesReserva.Post({
      id_reserva : reserva.id_reserva,
      id_habitacion : habitacion.id_habitacion
    })

    // Mostrar informacion
    let dataCheckinCreated = await servicioCheckin.Post({
      id_reserva: reserva.id_reserva
    })
    const checkInfo = (await servicioCheckin.GetById(dataCheckinCreated.id_reserva))[0]
    setDataCheckin({...dataCheckin, fechaInicio: checkInfo.checkin})

    addAlert(dataCheckinCreated.message, "info")
    addAlert("Puede entregar las llaves del cuarto", "info")
    setHasCheckin(true)
  }


  return (reserva!=null || habitacion!=null ?( 
    <div className="checkin-page">
      <div className="reserva-card">
        <div className="reserva-info">
          <div className="info-grid">
            <div>
              <p><strong>Cliente:</strong> {reserva.nombre} </p>
              <p><strong>Tipo de Habitación:</strong> {reserva.tipo_habitacion}</p>
              <p><strong>Nro. Confirmación:</strong> {reserva.id_reserva}{reserva.documento_identidad}</p>
              <p><strong>Fecha Creada:</strong> {reserva.fecha_inicio.substring(0,10)} </p>
            </div>
          </div>
        </div>
      </div>
        <img className='w-25 m-2' src={habitacion.img} alt="" />

      <h2 className="realizar-checkin">Realizar check-in</h2>
      <p className="mensaje-llaves">Recuerde entregar las llaves de la habitación</p>

      <button className="boton-iniciar my-10" onClick={iniciarCheckin}>Iniciar</button>
        {hasCheckin ? <div className="card mx-auto mt-10" style={{width: '18rem', backgroundColor: '#CFE2FF'}}>
          <div className="card-body text-start">
            <div className="d-flex align-items-center mb-3">
              <div className=" text-white p-2 rounded me-3">
                <DoorClosedFill color="#0A58CA" size={30}/>
              </div>
              <h5 className="card-title mb-0">Número {habitacion.numero} 🔑 </h5>
            </div>
            <p className="card-text"><strong>Fecha Inicio</strong><br/>{dataCheckin.fechaInicio.substring(0,10)}</p>
            <p className="card-text"><strong>Hora Inicio</strong><br/>{dataCheckin.fechaInicio.substring(11, 19)}</p>
          </div>
        </div> : null}
        
      <div>
        
      </div>
    </div>)
  : <Navigate />);
}

export default Checkin;