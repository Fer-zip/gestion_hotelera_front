import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import './RegistroUsuario.css'; // Aquí colocaremos los estilos personalizados
import RESTServicio from '../../../services/RESTServicio';
import { useTemporalAlert } from '../../../shared/context/TemporalAlertContext';
import { useNavigate } from 'react-router-dom';
import TopNav from "../../../components/TopNav";
import { Container, Row } from "react-bootstrap";
import DashboardNote from "../../../components/DashboardNote";
import { PersonFill } from "react-bootstrap-icons";
import { filtrarLetrasInput } from "../../../utils/filtros";
import PopUpWithAction from "../../../shared/modals/PopUpWithAction";

export default function RegistrarUsuario() {
  const [formData, setFormData] = useState({
    nombreUsuario: '',
    dni: '',
    nombresCompletos: '',
    contraseña: '',
    email: '',
    telefono: '', // Añadido campo de teléfono
    rol: '',
    permisos: {
      gestionarUsuarios: false,
      reportesFacturacion: false,
      consultasRecepcion: false,
      informacionHabitaciones: false,
      historialAcciones: false,
      configurarServicios: false,
    },
  });

  const { Post } = RESTServicio("empleados");
  const { addAlert } = useTemporalAlert();
  const navigate = useNavigate();

  const handleChange = (e) => {
    // Atributos de Inputs cuando son editados/modificados
    const { name, value, type, checked } = e.target;

    //Para los permisos cuando sea implementado
    if (type === 'checkbox') {
      // Actualizacion de permisos
      setFormData({
        ...formData,
        permisos: {
          ...formData.permisos,
          [name]: checked,
        },
      });
    } else {
      // Recibir el valor actual del input
      let newValue = value;

      // Filtros y aplicaciones para cada campo
      if (name === 'dni') {
        // Permitir solo dígitos para el DNI
        newValue = filtrarLetrasInput(value)
      } else if (name === 'telefono') {
        // Limitar la longitud del teléfono a 20 caracteres
        newValue = filtrarLetrasInput(value)
        if (value.length > 20) {
          return; // No actualizar el estado si excede la longitud
        }
      }
      
      // Actualizar los valores
      setFormData({
        ...formData,
        [name]: newValue,
      });
    }
  };

  const handleSubmit = async () => {
    try {
      //  Estructura esperada por el backend
      const userData = {
        nombreUsuario: formData.nombreUsuario, 
        dni: formData.dni,
        nombre: formData.nombresCompletos,
        apellido: formData.nombresCompletos,
        contra: formData.contraseña,
        cargo: formData.rol.toLowerCase(),
        email: formData.email, 
        telefono: formData.telefono, 
        fecha_contratacion: new Date().toISOString().split('T')[0], // Fecha actual
        // Tratar los permisos
        // permisos: formData.permisos,
      };
      
      await Post(userData);
      addAlert('Usuario registrado exitosamente', 'success');
      navigate('/usuarios'); 
    } catch (error) {
      addAlert('Error al registrar usuario', 'danger');
    }
  };


  return (
    <Container fluid> 
      <TopNav 
      linkTo="/usuarios"
      title="Registrar Usuario"
      />

      {/* Texto de introducción */}
      <Row className="p-4">
        <DashboardNote 
        note="Al crear un usuario, este podrá acceder al sistema y realizar
            operaciones, para mantener la seguridad, debe agregar un rol para sus
            funciones."
        variant="tertiary"
        />
      </Row>

      {/* FORMULARIO DE REGISTRO */}
      <div className="container-fluid px-4 pb-4">
        <div className="row">
          {/* Formulario */}
          <div className="col-md-6">
            {/* Manejo de */}
            <form onSubmit={handleSubmit}> 
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label>Nombre de Usuario*</label>
                  <input
                    className="form-control"
                    placeholder="Escriba aquí"
                    required
                    name="nombreUsuario" 
                    value={formData.nombreUsuario} 
                    onChange={handleChange} 
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label>DNI*</label>
                  <input
                    className="form-control"
                    placeholder="Escriba aquí"
                    required
                    name="dni" 
                    value={formData.dni} 
                    onChange={handleChange} 
                  />
                </div>
              </div>

              <div className="mb-3">
                <label>Nombres completos</label>
                <input
                  className="form-control"
                  placeholder="Escriba aquí"
                  name="nombresCompletos" 
                  value={formData.nombresCompletos} 
                  onChange={handleChange} 
                />
              </div>

              <div className="mb-3">
                <label>Correo electrónico*</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Escriba aquí"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label>Teléfono</label>
                <input
                  type="tel" 
                  className="form-control"
                  placeholder="Escriba aquí"
                  name="telefono" 
                  value={formData.telefono} 
                  onChange={handleChange} 
                />
              </div>

              <div className="mb-3">
                <label>Contraseña*</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Escriba aquí"
                  required
                  name="contraseña" 
                  value={formData.contraseña} 
                  onChange={handleChange} 
                />
              </div>

              <div className="mb-3">
                <label>Rol</label>
                <select
                  className="form-select"
                  name="rol" 
                  value={formData.rol} 
                  onChange={handleChange} 
                >
                  <option value="">SELECCIONAR ROL</option> 
                  <option value="Administrador">Administrador</option> 
                  <option value="Recepcionista">Recepcionista</option> 
                  <option value="Personal">Personal</option> 
                  <option value="Contador">Contador</option> 
                  <option value="Personalizado">Personalizado</option> 
                </select>
              </div>

              <h6 className="mt-4">Permisos</h6>
              <div onClick={()=>addAlert("No implementado", "warning")} className="border rounded p-3 mb-4">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="gestionarUsuarios" 
                        checked={formData.permisos.gestionarUsuarios} 
                        onChange={handleChange} 
                      />
                      <label className="form-check-label">
                        Gestionar Usuarios
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="reportesFacturacion" 
                        checked={formData.permisos.reportesFacturacion} 
                        onChange={handleChange} 
                      />
                      <label className="form-check-label">
                        Acceder a reportes y facturación
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="consultasRecepcion" 
                        checked={formData.permisos.consultasRecepcion} 
                        onChange={handleChange} 
                      />
                      <label className="form-check-label">
                        Consultas y recepción
                      </label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="informacionHabitaciones" 
                        checked={formData.permisos.informacionHabitaciones} 
                        onChange={handleChange} 
                      />
                      <label className="form-check-label">
                        Información sobre habitaciones
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="historialAcciones" 
                        checked={formData.permisos.historialAcciones} 
                        onChange={handleChange} 
                      />
                      <label className="form-check-label">
                        Acceso a historial de acciones
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="configurarServicios" 
                        checked={formData.permisos.configurarServicios} 
                        onChange={handleChange} 
                      />
                      <label className="form-check-label">
                        Configurar servicios de hotelería
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              {/* Botón de Registrar dentro del formulario */}
              <PopUpWithAction 
              action={handleSubmit}
              haveCancellButton={true}
              modalContent={""}
              modalTitle={"¿Desea registrar al usuario " + formData.nombreUsuario + "?"}
              textActionButton="Sí, registrar usuario"
              textShowModalButton="Registrar"
              variantActionButton="success"
              variantShowModalButton="success"
              />
            </form>
          </div>
          <PanelUsuario contrasena={formData.contraseña} nombreUsuario={formData.nombreUsuario} rol={formData.rol}/>
        </div>
      </div>
    </Container>
  );
}

function PanelUsuario({contrasena, nombreUsuario, rol}){
  return (
    <div className="col-md-6 d-flex flex-column align-items-center justify-content-center">
    <div className="cuadro-usuario p-4 rounded mb-3">
      <div className="text-center mb-3">
        <PersonFill color="var(--cyan-800)" size={100}/>
        <div className="fw-bold text-primary">{nombreUsuario || 'Nombre de Usuario'}</div> 
        <div className="text-primary">
          <span role="img" aria-label="key">
            🔑
          </span>{" "}
          {contrasena || 'Contraseña'} {/* Mostrar contraseña dinámica */}
        </div>
      </div>
      <div className="text-center">
        <button className="btn btn-outline-warning btn-sm">{rol || 'Rol'}</button> 
      </div>
    </div>
  </div>
  )
}