import React from "react";

const Navbar = ({ currentView, setCurrentView, handleLogout}) => (
    <nav className="bg-qualitaGreen text-white p-4 shadow-md">
      <div className="flex justify-between items-center">
        <h1  
        onClick={() => setCurrentView('dashboard')}
        className="text-xl font-bold">Qualita Experts</h1>
        <div className="space-x-4">
          <button 
            onClick={() => setCurrentView('dashboard')}
            className={`px-4 py-2 rounded ${currentView === 'dashboard' ? 
            'bg-qualitaOrange text-white' : 'bg-white text-qualitaGreen hover:bg-qualitaOrange hover:text-white'}`}
          >
            Dashboard
          </button>


          <button 
            onClick={() => setCurrentView('clients')}
            className={`px-4 py-2 rounded ${currentView === 'clients' ? 
           'bg-qualitaOrange text-white' : 'bg-white text-qualitaGreen hover:bg-qualitaOrange hover:text-white'}`}
          >
            Clientes
          </button>

          <button 
            onClick={() => setCurrentView('profile')}
            className={`px-4 py-2 rounded ${currentView === 'profile' ? 
            'bg-qualitaOrange text-white' : 'bg-white text-qualitaGreen hover:bg-qualitaOrange hover:text-white'}`}
          >
            Mi Perfil
          </button>
          <button 
            onClick={handleLogout}
            className="bg-qualitaGreen hover:bg-qualitaOrange text-white font-semibold py-2 px-4 rounded border border-white"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  );

export default Navbar;