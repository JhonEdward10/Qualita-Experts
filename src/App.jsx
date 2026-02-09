import { useState, useEffect } from 'react'
import Login from './components/Login';
import UserProfile from './components/userProfile';
import ClientPanel from './components/ClientPanel';
import Sidebar from './components/SideBar';
import './App.css'
import ApiService from './services/api';
import Reports from './components/Reports';
import Navbar from './components/Navbar';
import qualitaLogo from './assets/image/qualita-simplelogo.png'
import qualitasimpleLogo from './assets/image/qualita-logo.png'


function App() {
  // Estado para manejar el usuario logueado
  const [user, setUser] = useState(null);

  //Controlar qué vista mostrar
  const [currentView, setCurrentView] = useState('dashboard');

  //Controla la carga pantalla
  const [loading, setLoading] = useState(true);

  //Se necesita para agregar estados en usuarios activos
  const [clientsCount, setClientsCount] = useState(0);
  const [statsLoading, setStatsLoading] = useState(false);

   // Verificar sesión al cargar la app
  useEffect(() => {
    const checkAuth = () => {
      if (ApiService.isAuthenticated()) {
        const userData = ApiService.getCurrentUser();
        if (userData) {
          setUser(userData);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const fetchStats = async () => {
  try {
    setStatsLoading(true);
      const userData = await ApiService.getUsers();
      const count = Array.isArray(userData) ? userData.length : 0;
      setClientsCount(count);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
      setClientsCount(0);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
  if (user) {
    fetchStats();
  }
  }, [user]);

  // Función que se ejecuta cuando el login es exitoso
  const handleLogin = (userData) => {
    setUser(userData); // Guarda los datos del usuario
    setCurrentView('dashboard'); // Mostrar dashboard al loguearse
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    ApiService.logout();
    setUser(null); // Borra los datos del usuario
    setCurrentView('dashboard'); // Reset vista
  };

  //Actualizar datos
  const handleUpdateUser = (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem('user_data', JSON.stringify(updatedUserData));
  };

   if (loading) {
    return (
      <div className="min-h-screen bg-qualitaGray flex items-center justify-center relative">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${qualitasimpleLogo})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: 0.08
          }}
        ></div>
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-qualitaGreen mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }
  
  // Si no hay usuario logueado, mostrar Login
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  // Si hay usuario logueado, mostrar Dashboard
  return (
    <div className="min-h-screen bg-qualitaGray flex"
          style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)), url(${qualitasimpleLogo})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}>


      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        handleLogout={handleLogout}
        user={user} // ← Pasar el usuario al sidebar
      /> 
        
      {/* Contenido principal */}
      <main className="flex-1 flex flex-col">
        {/* Header opcional para mostrar título de sección */}
        <header className="bg-white shadow-sm border-b px-6 py-4 ml-0 md:ml-0">
          <div className="ml-12 md:ml-0"> {/* Espacio para el toggle móvil */}
            <h1 className="text-xl md:text-2xl font-bold text-qualitaGreen capitalize">
              {currentView === 'dashboard' && 'Dashboard Principal'}
              {currentView === 'clients' && 'Gestión de Clientes'}
              {currentView === 'profile' && 'Mi Perfil'}
            </h1>
          </div>
        </header>

        {/* Área de contenido */}
        <div className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="max-w-6xl mx-auto w-full">
            
            {currentView === 'dashboard' && (    
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Card principal de bienvenida */}
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow border-l-4 border-qualitaGreen">
                  <h2 className="text-2xl font-bold mb-4 text-qualitaGreen">¡Bienvenido de nuevo!</h2>
                  <div className="space-y-2">
                    <p><strong className="text-qualitaOrange">Nombre:</strong> {user.fullName}</p>
                    <p><strong className="text-qualitaOrange">Usuario:</strong> {user.username}</p>
                    <p><strong className="text-qualitaOrange">Rol:</strong> {user.role}</p>
                  </div>
                </div>

                {/* Card de acciones rápidas */}
                <div className="bg-white p-6 rounded-lg shadow border-l-4 border-qualitaOrange">
                  <h3 className="text-lg font-semibold text-qualitaOrange mb-4">Acciones Rápidas</h3>
                  <div className="space-y-3">
                    <button 
                      onClick={() => setCurrentView('clients')}
                      className="w-full text-left p-3 bg-gray-50 hover:bg-qualitaGreen hover:text-white rounded-lg transition-colors"
                    >
                      <span className="flex items-center space-x-2">
                        <span>👥</span>
                        <span>Ver Clientes</span>
                      </span>
                    </button>
                    <button 
                      onClick={() => setCurrentView('profile')}
                      className="w-full text-left p-3 bg-gray-50 hover:bg-qualitaGreen hover:text-white rounded-lg transition-colors"
                    >
                      <span className="flex items-center space-x-2">
                        <span>👤</span>
                        <span>Mi Perfil</span>
                      </span>
                    </button>
                  </div>
                </div>

                {/* Card de estadísticas */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Resumen</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Clientes Registrados:</span>
                      {statsLoading ? (
                        <div className="animate-pulse bg-gray-200 h-8 w-8 rounded"></div>
                          ):(
                      <span className="text-2xl font-bold text-qualitaGreen">{clientsCount}</span>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Estado:</span>
                      <span className="px-3 py-1 bg-green-100 text-qualitaGreen rounded-full text-sm font-medium">
                        Activo
                      </span>
                    </div>
                    <button
                      onClick={fetchStats}
                      className="w-full text-sm text-qualitaOrange hover:text-orange-600 mt-2"
                    >
                    Actualizar estadísticas
                    </button>
                  </div>
                </div>

                {/* Card de información adicional */}
                <div className="lg:col-span-2 bg-gradient-to-r from-qualitaGreen to-green-600 text-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-2">Sistema Qualita Experts</h3>
                  <p className="text-green-100">Panel de administración para gestión de clientes y usuarios.</p>
                </div>
              </div>
            )}

            {currentView === 'reports' && (
              <div className="bg-white bg-opacity-95 rounded-lg backdrop-blur-sm p-1">
              <Reports />
              </div>
            )}

            {currentView === 'profile' && (
              <UserProfile 
                user={user} 
                onUpdateUser={handleUpdateUser} 
              />
            )}
          
            {currentView === 'clients' && (
              <ClientPanel />
            )}
          </div>
        </div>
      </main>    
    </div>
  );
}

export default App