import DashboardGeneral from "./modules/dashboard/DashboardGeneral.jsx";
import "./App.css";
import DashboardLayout from "./shared/layout/DashboardLayout.jsx";

import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./modules/usuarios/components/Login.jsx";
import RegistrarUsuario from "./modules/usuarios/components/RegistroUsuario.jsx";
import ReservasDashboardContent from "./modules/reservas/views/ReservasDashboardContent.jsx";
import GestionUsuario from "./modules/usuarios/components/GestionUsuario.jsx";
import ClienteDashboard from "./modules/clientes/views/ClienteDashboard.jsx";
import NuevaReservacionContainer from "./modules/reservas/views/NuevaReservacionContainer.jsx";
import { ReservaProvider } from "./shared/context/ReservaContext.jsx";
import { ReservaHabitacionProvider } from "./shared/context/ReservaHabitacionContext.jsx";
import EditarDatosUsuario from "./modules/usuarios/components/EditarDatos.jsx";
import ProtectedRoute from "./shared/components/ProtectedRoute.jsx"; // Importar ProtectedRoute
import Habitaciones from "./modules/habitaciones/Habitaciones.jsx";
import ActualizarHabitacion from "./modules/habitaciones/ActualizarHabitacion.jsx";
import RegistroHabitacion from "./modules/habitaciones/RegistroHabitacion.jsx";
import DetalleCliente from "./modules/clientes/components/DetalleCliente.jsx";
import RegistrarCliente from "./modules/clientes/components/RegistrarCliente.jsx";
import DashboardServicios from "./modules/servicios/DashboardServicios.jsx"; // Importar DashboardServicios
import RegistrarServicio from "./modules/servicios/RegistrarServicio.jsx"; // Importar RegistrarServicio

import Checkin from "./modules/checkin-checkout/Checkin.jsx";

function App() {
  return (
    <ReservaHabitacionProvider>
      {" "}
      <Routes>
        {/* RUTAS PÚBLICAS */}
        <Route path="login" element={<Login />} />

        {/* RUTAS PROTEGIDAS */}
        <Route element={<ProtectedRoute />}>
          {" "}
          <Route path="/" element={<DashboardLayout />}>
            {/* Ruta base del dashboard */}
            <Route index element={<DashboardGeneral />} />
            {/* Vistas que usan el Dashboard */}
            <Route path="usuarios" element={<GestionUsuario />} />
            <Route path="reservas" element={<ReservasDashboardContent />} />
            <Route path="clientes" element={<ClienteDashboard />} />
            <Route path="habitaciones" element={<Habitaciones />} />
            <Route path="servicios" element={<DashboardServicios />} />{" "}
            <Route path="checkin" element={<Checkin />} />
            <Route path="detalle-cliente/:id" element={<DetalleCliente />} />
            <Route
              path="detalle-habitacion/:id"
              element={<ActualizarHabitacion />}
            />
          </Route>
          {/* Vistas independientes protegidas */}
          <Route
            path="actualizar-usuario/:id"
            element={<EditarDatosUsuario />}
          />
          <Route path="registrar-usuario" element={<RegistrarUsuario />} />
          <Route path="registrar-habitacion" element={<RegistroHabitacion />} />
          <Route
            path="nueva-reserva"
            element={
              <ReservaProvider>
                <NuevaReservacionContainer />
              </ReservaProvider>
            }
          />
          <Route path="registrar-servicio" element={<RegistrarServicio />} />{" "}
          <Route path="registrar-cliente" element={<RegistrarCliente />} />
        </Route>
        {/* Redireccion a la ruta base (protegida) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ReservaHabitacionProvider>
  );

  // return (
  //     <>
  //       <DashboardLayout>
  //         {/* Ejemplo de PopUp */}
  //         <PopUp
  //         modalTitle="Hola"
  //         variantCloseButton="success"
  //         textCloseButton="Ok"
  //         textShowModalButton="Abrir"
  //         variantShowModalButton="warning"
  //         modalContent={<p>Contenido de PopUp</p>}

  //         />

  //       {/* Ejemplo de PopUpWithACtion */}
  //       <PopUpWithAction
  //         action={()=>alert("Accion al click de PopUp")}
  //         textActionButton={"Ok"}
  //         modalTitle={"PopUp"}
  //         modalContent={<p>Contenido de Modal con Acción</p>}
  //         variantActionButton={"danger"}
  //         haveCancellButton={true}
  //         variantShowModalButton={"success"}
  //         textShowModalButton={"Enviar"}
  //         />
  //         {/* Ejemplo del uso de Alertas para el sistema*/}
  //         <AlertDemoButton/>
  //       </DashboardLayout>
  //     </>
  //   );
  // }
}

export default App;
