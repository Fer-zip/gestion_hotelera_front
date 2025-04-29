import React, { useState, useEffect } from 'react';
import { Button,Row,Col, Table, Form, InputGroup, Container } from 'react-bootstrap';
import './GestionUsuario.css';
import { useOutletContext, useNavigate } from 'react-router-dom';
import DashboardNote from '../../../components/DashboardNote';
import ActionCardDashboard from '../../../components/ActionCard';
import HoverIcon from '../../../utils/HoverIcon/HoverIcon';
import { PersonPlusFill } from 'react-bootstrap-icons';
import RESTServicio from '../../../services/RESTServicio';
import { useTemporalAlert } from '../../../shared/context/TemporalAlertContext';
import PopUpWithAction from '../../../shared/modals/PopUpWithAction';


function GestionUsuario() {
  // Colocarle titulo al Dashboard
  const {setTituloDashboard} = useOutletContext();
  const [usuarios, setUsuarios] = useState([]);
  const navigate = useNavigate();
  const {addAlert} = useTemporalAlert();
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda
  const {Get, Delete, GetById} = RESTServicio("empleados");

  // Función para manejar la búsqueda y carga inicial
  const handleSearch = async () => {
    if (searchTerm.trim() !== '') {
    try {
      const data = await GetById(searchTerm);
      setUsuarios(data);
    } catch (error) {
      addAlert(`Error al buscar usuario con DNI ${searchTerm}:`, "danger");
    }
  } else {
    try {
      const data = await Get();
      setUsuarios(data);
    } catch (error) {
      addAlert("Error al obtener los usuarios desde la base de datos", "danger")
      setUsuarios([]);
    }
    }
  };

  const onEditarUsuario = async (dni) => {
    navigate("/actualizar-usuario/" + dni)
  }

  const onEliminarUsuario = async (dni) => {
    try{
      await Delete(dni)
      // Actualizar tabla
      const data = await Get();
      setUsuarios(data);
      addAlert('Usuario eliminado con DNI: ' + dni, "warning")
    }catch (error){
      addAlert("Error al retirar el usuario con DNI: " + dni, "danger")
    }
  }

  
  useEffect(() => {
    setTituloDashboard("Gestión de usuarios");
    handleSearch(''); 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setTituloDashboard]); 

    return (
      <Container fluid>
        
        {/* Contenido principal */}
        <DashboardNote variant="tertiary" note="Administre a todos los usuarios del sistema, remueva registros, añada usuarios para sus trabajadores y consulte estadísticas acerca de ellos."/>      

        {/* Cartas de accion */}
        <Row className="mb-3">
          <Col md={3}>
            <ActionCardDashboard 
            linkTo="/registrar-usuario"
            titleCard="Nuevo Usuario"
            icon={<HoverIcon 
              iconoNormal={<PersonPlusFill color="#CFE2FF" size={30} className="mx-2 mb-2" />}
              iconoHover={<PersonPlusFill color="#FFF" size={30} className="mx-2 mb-2" />} />}
            />
          </Col>
        </Row>

          <Row>
            <h2>Todos los Usuarios</h2>
          </Row>
  
          {/* Buscador */}
          <div className="search-section">
            <InputGroup className="mb-3">
              <Form.Control
                placeholder="Buscar por DNI o usuario"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button variant="success" onClick={handleSearch}>Buscar</Button>
            </InputGroup>
          </div>
  
  
          {/* Tabla de usuarios */}
            <Table striped bordered hover>
            <thead>
              <tr>
                <th>DNI</th>
                <th>Nombre de usuario</th>
                <th>Nombres completos</th>
                <th>Cargo/Rol</th>
                <th>Contraseña</th>
                <th>Email</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario, index) =>
              (
               <tr key={`${usuario.dni}-${index}`}> {/* Usando DNI y índice como clave única */}
                 <td>{usuario.dni}</td>
                 <td>{usuario.nombre}</td>
                 <td>{usuario.nombre} {usuario.apellido}</td>
                 <td>{usuario.cargo}</td> 
                 <td>{usuario.contraseña}</td>
                 <td>{usuario.correo}</td>
                 <td>
                   <Button variant="info" size="sm" onClick={()=>onEditarUsuario(usuario.dni)}>Editar</Button>{' '}
                   <PopUpWithAction 
                   action={async ()=>onEliminarUsuario(usuario.dni)}
                   haveCancellButton={true}
                   modalContent={<p>El usuario no podrá acceder a las operaciones de sistema de ahora en adelante y en los registros se le marcará como Retirado</p>}
                   modalTitle='¿Está seguro de retirar a este usuario?'
                   textActionButton='Sí, retirar usuario'
                   textShowModalButton='Retirar'
                   variantActionButton='danger'
                   variantShowModalButton='danger'
                   />
                 </td>
               </tr>
             ))}
            </tbody>
          </Table>
      </Container>
    );
  }
  
  export default GestionUsuario;