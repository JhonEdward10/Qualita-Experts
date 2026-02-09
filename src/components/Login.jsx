import { useState } from "react";
import React from "react";
import ApiService from "../services/api";
import qualitaLogo from '../assets/image/qualita-logo.png'
import qualitasimpleLogo from '../assets/image/qualita-simplelogo.png'

//Recibe una función del componente padre (App.jsx) que se ejecutará cuando el login sea exitoso
const Login = ({ onLogin }) => {
  const [username, setUsername] = useState(''); //Guarda lo que el usuario escribe en el campo "Usuario"
  const [password, setPassword] = useState(''); // Guarda lo que el usuario escribe en el campo "Contraseña"
  const [error, setError] = useState(''); //Guarda mensajes de error, ej:"usuario incorrecto"
  const [loading, setLoading] = useState(false); //Indica si está procesando el login true o false

  //Credenciales validas
  // const validCredentials = [
  //   { username: "admin", password: "123", role: "administrador", fullName: "German Muñoz"},
  //   { username: "user1", password: "321", role: "usuario", fullName: "Jhon Mendez"}
  // ];


  const handleLogin = async () => {
    if (!username || !password) {
      setError('Por favor ingresa usuario y contraseña');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await ApiService.login(username, password);
      
      // Adaptar los datos según lo que devuelva tu API
      const userData = {
        username: response.username || response.user || username,
        fullName: response.fullName || response.full_name || response.name || 'Usuario',
        role: response.role || response.user_type || response.tipo || 'Usuario',
        id: response.id || response.user_id,
        // Agregar otros campos según tu API
      };

      onLogin(userData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

return (
  <div className="min-h-screen bg-qualitaGray flex items-center justify-center"
      style={{
      backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)), url(${qualitaLogo})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      }}>
    <div className="bg-white p-8 rounded-lg shadow-md w-96 border-l-4 border-qualitaGreen">
      <img 
        src={qualitasimpleLogo} 
        alt="Qualita Experts" 
        className="h-16 w-auto mx-auto mb-4"
      />
      <h2 className="text-2xl font-bold text-center mb-6 text-qualitaGreen">
        Iniciar Sesión
      </h2>
      <div className="space-y-4">

        {/* Inicio de Sesion */}

        <div>
          <label className="block text-qualitaGreen text-sm font-bold mb-2">
            Usuario:
          </label>
          <input type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-qualitaGreen"
            placeholder="Ingrese su usuario"
          />
        </div>

        {/* Contraseña */}

        <div>
          <label className="block text-qualitaGreen text-sm font-bold mb-2">
            Contraseña:
          </label>
          <input type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            placeholder="Ingrese su contraseña"
          />
        </div>
                
        {/* Error */}
        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Boton */}

        <button
          onClick={handleLogin}
          disabled={loading || !username || !password}
          className="w-full bg-qualitaGreen text-white py-2 px-4 rounded-md hover:bg-qualitaOrange disabled:opacity-50"
        >
          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>


        {/* Prueba */}

        <div className="mt-6 p-3 bg-qualitaGray rounded text-sm border border-qualitaGreen">
          <p className="block text-qualitaGreen text-sm font-bold mb-2">Credenciales de prueba:</p>
          <p>Usuario: <code>user1</code> - Contraseña: <code>123</code></p>
        </div>  
      </div>
    </div>
  </div>
)
};

export default Login;