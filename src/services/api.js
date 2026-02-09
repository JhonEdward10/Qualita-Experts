const BASE_URL = '/api';

class ApiService {
  // Función para hacer login y obtener token
  static async login(username, password) {
    try {
      const response = await fetch(`${BASE_URL}/auth_token.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password
        })
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      
      // Guardar token y datos en localStorage
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user_data', JSON.stringify(data));
      }

      return data;
    } catch (error) {
      console.error('Error en login:', error);
      throw new Error('Error de autenticación. Verifica tus credenciales.');
    }
  }

  // Función para obtener lista de usuarios
  static async getUsers() {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await fetch(`${BASE_URL}/list_users.php`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          // También podríamos usar otras formas de enviar el token:
          // 'X-Auth-Token': token,
          // 'Token': token,
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expirado o inválido
          this.logout();
          throw new Error('Sesión expirada. Por favor inicia sesión nuevamente.');
        }
        throw new Error(`Error al obtener usuarios: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw error;
    }
  }

  // Función para cerrar sesión
  static logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  }

  // Función para verificar si hay sesión activa
  static isAuthenticated() {
    return !!localStorage.getItem('auth_token');
  }

  // Función para obtener datos del usuario desde localStorage
  static getCurrentUser() {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  }
}

export default ApiService;