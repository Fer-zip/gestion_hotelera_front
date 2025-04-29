import RESTServicio from "./RESTServicio";
import { obtenerFechaActualYYYYMMDD } from "../utils/fecha";

import axios from "axios"
const API_URL = "http://localhost:3000/";

const axiosBase = axios.create({
    baseURL: API_URL,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json"
    }
});

// Para la reserva, necesito el ID del cliente, si no existe, se crea un registro
// data: cliente , reserva, serviciosAgregados
async function transaccionReserva(data){
    const clienteService = RESTServicio('huespedes')
    const serviciosReservaService = RESTServicio('servicioReserva')
    const reservasService = RESTServicio("reservas")

    // Esta funcion se usa para el proceso de recervacion
    try{
        // getById obtiene .
        let cliente = await clienteService.GetById(data.cliente.documento_identidad)
        cliente = cliente[0]
        // Si existe un usuario con el mismo DNI, usarlo, se extrae el primer valor encontrado
        if(cliente){
            cliente.id = cliente.id_huesped
        }else{
            // Crearlo para poder referecniarlo en la consulta
            cliente = await clienteService.Post(data.cliente)
        }

        // Crear la reserva
        const reserva = await reservasService.Post({
            id_huesped: cliente.id,
            fecha_inicio: obtenerFechaActualYYYYMMDD(),
            fecha_fin: "",
            estado: "pendiente",
            tipo_habitacion: data.habitacion.tipo
        })

        // Añadir los servicios a la reserva
        data.servicios.forEach(async servicio => {
            await serviciosReservaService.Post(
                {
                    id_reserva: reserva.idReserva,
                    id_servicio: servicio.id_servicio,
                    cantidad: 1
                }
            )
        });
        // Para crear el codigo de confirmacion
        return reserva.idReserva
    }catch(error){
        console.log(error)
    }
}

async function cancelarReserva(idReserva){
    try{
        const res = await axiosBase.put('/reservas/cancelar/' + idReserva)
        return res.data;
    }catch (err){
        throw err;
    }
}

export {transaccionReserva, cancelarReserva};