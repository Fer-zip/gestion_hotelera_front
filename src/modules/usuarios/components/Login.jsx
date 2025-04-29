import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useAuth } from '../../../shared/context/AuthContext';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth(); // Obtener la función login del contexto

  const handleLogin = (e) => {
    e.preventDefault();

    const userData = { nombreUsuario: username, contrasena: password };
    login(userData);
  };

  return (
    <div className="login-container">
      {/* Columna Izquierda */}
      <div className="login-left">
        <h2>Bienvenido de nuevo</h2>
        <div className="logo-circle">
          <p>Logo de<br />Sistema/<br />Hotelería</p>
        </div>
        <div className="left-footer">
           Ingrese sus credenciales para acceder al sistema
        </div>
      </div>

      {/* Columna Derecha */}
      <div className="login-right">
        <div className="login-icon">
          <i className="bi bi-person-circle"></i>
        </div>
        <h3 className="login-title">Iniciar Sesión</h3>
        <Form className="login-form" onSubmit={handleLogin}> 
          <Form.Group className="mb-3">
            <Form.Label>Nombre de Usuario</Form.Label>
            <Form.Control
              type="text"
              placeholder="Escriba aquí"
              value={username} // Bind value
              onChange={(e) => setUsername(e.target.value)} 
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Escriba aquí"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </Form.Group>

          <Button variant="success" type="submit" className="w-100">
            Acceder
          </Button>

          <p className="login-note">
            Si no puedes acceder a tu cuenta, consulta al administrador por tus credenciales
          </p>
        </Form>
      </div>
    </div>
  );
}

export default Login;
