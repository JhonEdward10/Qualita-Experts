import { useState } from 'react';
import qualitasimpleLogo from '../assets/image/qualita-simplelogo.png'

function Sidebar({ currentView, setCurrentView, handleLogout, user }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (view) => {
    setCurrentView(view);
    setIsOpen(false); // Cierra el menú en móvil
  };

  // Cerrar sidebar al hacer click fuera (solo en móvil)
  const handleOverlayClick = () => {
    if (isOpen) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Toggle móvil */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-qualitaGreen text-white p-2 rounded-lg shadow-lg hover:bg-green-600 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg">{isOpen ? '✕' : '☰'}</span>
      </button>

      {/* Overlay para móvil */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={handleOverlayClick}
        ></div>
      )}

      {/* Panel lateral - CAMBIOS AQUÍ */}
      <aside className={`
        h-screen w-64 bg-white shadow-lg z-40 transition-transform duration-300
        fixed top-0 left-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:sticky md:top-0
        overflow-y-auto
      `}>
        
        <div className="p-6 border-r border-qualitaGreen h-full flex flex-col justify-between">
          <div className="flex-1">
            <div className='text-center mb-6 pb-4 border-b border-gray-200'>
              <img src={qualitasimpleLogo} alt="Qualita Experts" className='h-12 w-auto mx-auto'/>
              {/* <div className='flex flex-col items-center'>
                <p className="text-xs text-qualitaOrange">Experts Panel</p>
              </div> */}
            </div>


            {/* Información del usuario */}
            {user && (
              <div className="mb-6 p-3 bg-gray-50 rounded-lg border-l-4 border-qualitaOrange">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-qualitaGreen rounded-full flex items-center justify-center text-white font-bold">
                    {user.fullName?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.fullName}
                    </p>
                    <p className="text-xs text-qualitaOrange truncate">
                      {user.role}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <nav className="space-y-2">
              <button 
                onClick={() => handleNavClick('dashboard')} 
                className={`block text-left w-full p-3 rounded-lg transition-colors ${
                  currentView === 'dashboard' 
                    ? 'bg-qualitaGreen text-white' 
                    : 'text-qualitaOrange hover:bg-qualitaGreen hover:text-white'
                }`}
              >
                <span className="flex items-center space-x-3">
                  <span>📊</span>
                  <span>Dashboard</span>
                </span>
              </button>

              <button 
                onClick={() => handleNavClick('reports')} 
                className={`block text-left w-full p-3 rounded-lg transition-colors ${
                  currentView === 'reports' 
                    ? 'bg-qualitaGreen text-white' 
                    : 'text-qualitaOrange hover:bg-qualitaGreen hover:text-white'
                }`}
              >
                <span className="flex items-center space-x-3">
                  <span>📊</span>
                  <span>Informes</span>
                </span>
              </button>
              
              <button 
                onClick={() => handleNavClick('clients')} 
                className={`block text-left w-full p-3 rounded-lg transition-colors ${
                  currentView === 'clients' 
                    ? 'bg-qualitaGreen text-white' 
                    : 'text-qualitaOrange hover:bg-qualitaGreen hover:text-white'
                }`}
              >
                <span className="flex items-center space-x-3">
                  <span>👥</span>
                  <span>Clientes</span>
                </span>
              </button>
              
              <button 
                onClick={() => handleNavClick('profile')} 
                className={`block text-left w-full p-3 rounded-lg transition-colors ${
                  currentView === 'profile' 
                    ? 'bg-qualitaGreen text-white' 
                    : 'text-qualitaOrange hover:bg-qualitaGreen hover:text-white'
                }`}
              >
                <span className="flex items-center space-x-3">
                  <span>👤</span>
                  <span>Mi Perfil</span>
                </span>
              </button>
            </nav>
          </div>
          
          {/* Botón cerrar sesión siempre al fondo */}
          <div className="pt-4">
            <button 
              onClick={handleLogout} 
              className="mt-6 w-full p-3 text-center bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-colors border border-red-200"
            >
              <span className="flex items-center justify-center space-x-2">
                <span>🚪</span>
                <span>Cerrar Sesión</span>
              </span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;