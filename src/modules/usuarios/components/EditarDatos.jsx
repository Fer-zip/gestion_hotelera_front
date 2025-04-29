import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import RESTServicio from '../../../services/RESTServicio';
import { useTemporalAlert } from '../../../shared/context/TemporalAlertContext';
import { useNavigate } from 'react-router-dom';
import TopNav from "../../../components/TopNav";
import { Button, Container, Row } from "react-bootstrap";
import DashboardNote from "../../../components/DashboardNote";
import { PersonFill } from "react-bootstrap-icons";
import { filtrarLetrasInput } from "../../../utils/filtros";
import PopUpWithAction from "../../../shared/modals/PopUpWithAction";
import { useParams } from "react-router-dom";

export default function EditarDatosUsuario() {

  const [formData, setFormData] = useState({});

  const { Update, GetById } = RESTServicio("empleados");
  const { addAlert } = useTemporalAlert();
  const navigate = useNavigate();
  const {id} = useParams()

  // Carga de datos 
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await GetById(id);
        setFormData(data[0]) // acceso al objeto de la respuesta
      } catch (error) {
        console.error("Error fetching user data:", error);
        addAlert("No se pudo obtener los datos del usuario con DNI: " + id, 'danger');
        navigate("/usuarios")
      }
    };

    fetchUserData()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[id]); // Para el cambio cuando la ruta se modifique


  const handleSubmit = async () => {
    try {
      //  Estructura esperada por el backend
      const usuarioDTO = formData;
      usuarioDTO.contra = formData.contraseña;
      usuarioDTO.email = formData.correo;

      await Update(id, usuarioDTO);
      addAlert('Usuario actualizado exitosamente', 'success');
      navigate('/usuarios'); 
    } catch (error) {
      addAlert('Error al registrar usuario', 'danger');
    }
  };


  return (
    <Container fluid> 
      <TopNav 
      linkTo="/usuarios"
      title="Actualizar Usuario"
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
            <form> 
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label>Nombre de Usuario*</label>
                  <input
                    className="form-control"
                    placeholder="Escriba aquí"
                    required
                    name="nombreUsuario" 
                    value={formData.nombre} 
                    onChange={(e)=>{setFormData({...formData, nombre:e.target.value})}} 
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label>DNI*</label>
                  <input
                    className="form-control"
                    placeholder="Escriba aquí"
                    required
                    disabled
                    name="dni" 
                    value={formData.dni} 
                  />
                </div>
              </div>

              <div className="mb-3">
                <label>Nombres completos</label>
                <input
                  className="form-control"
                  placeholder="Escriba aquí"
                  name="nombresCompletos" 
                  value={formData.nombre} 
                  onChange={(e)=>{setFormData({...formData, nombre:e.target.value})}} 
                />
              </div>

              <div className="mb-3">
                <label>Correo electrónico*</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Escriba aquí"
                  required
                  name="correo"
                  value={formData.correo}
                  onChange={(e)=>{setFormData({...formData, correo:e.target.value})}}
                />
              </div>

              {/* Nuevo campo para teléfono */}
              <div className="mb-3">
                <label>Teléfono</label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="Escriba aquí"
                  name="telefono" 
                  value={formData.telefono} 
                  onChange={(e)=>{setFormData({...formData, telefono: filtrarLetrasInput(e.target.value)})}} 
                />
              </div>

              <div className="mb-3">
                <label>Contraseña*</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Escriba aquí"
                  required
                  name="correo" 
                  value={formData.contraseña} 
                  onChange={(e)=>{setFormData({...formData, contraseña:e.target.value})}} 
                />
              </div>

              <div className="mb-3">
                <label>Rol</label>
                <select
                  className="form-select"
                  name="rol" 
                  value={formData.cargo} 
                  onChange={(e)=>{setFormData({...formData, cargo:e.target.value})}} 
                >
                  <option value="">SELECCIONAR ROL</option> 
                  <option value="administrador">Administrador</option> 
                  <option value="recepcionista">Recepcionista</option> 
                  <option value="personal">Personal</option> 
                  <option value="contador">Contador</option> 
                  <option value="personalizado">Personalizado</option> 
                </select>
              </div>

              <h6 className="mt-4">Permisos</h6>
              {/* Remover la alerta cuando se implemente los permisos */}
              <div onClick={()=>addAlert("No disponible", "warning")} className="border rounded p-3 mb-4">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="gestionarUsuarios" 
                        // checked={formData.permisos.gestionarUsuarios} 
                        // onChange={handleChange} 
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
                        // checked={formData.permisos.reportesFacturacion} 
                        // onChange={handleChange} 
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
                        // checked={formData.permisos.consultasRecepcion} 
                        // onChange={handleChange
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
                        // checked={formData.permisos.informacionHabitaciones} 
                        // onChange={handleChange} 
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
                        // checked={formData.permisos.historialAcciones} 
                        // onChange={handleChange} 
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
                        // checked={formData.permisos.configurarServicios} 
                        // onChange={handleChange} 
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
              modalTitle={"¿Desea actualizar al usuario " + formData.nombre + "?"}
              textActionButton="Sí, actualizar datos"
              textShowModalButton="Guardar cambios"
              variantActionButton="success"
              variantShowModalButton="success"
              />
              <Button className="mx-2" variant="secondary" onClick={()=>navigate("/usuarios")}>Volver</Button>
            </form>
          </div>
          <PanelUsuario contrasena={formData.contraseña} nombreUsuario={formData.nombre} rol={formData.cargo}/>
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
        <div className="fw-bold text-primary">{nombreUsuario || 'Nombre de Usuario'}</div> {/* Mostrar nombre de usuario dinámico */}
        <div className="text-primary">
          <span role="img" aria-label="key">
            🔑
          </span>{" "}
          {contrasena || 'Contraseña'} {/* Mostrar contraseña dinámica */}
        </div>
      </div>
      <div className="text-center">
        <button className="btn btn-outline-warning btn-sm">{rol || 'Rol'}</button> {/* Mostrar rol dinámico */}
      </div>
    </div>
    {/* El botón de Registrar se movió dentro del formulario */}
  </div>
  )
}