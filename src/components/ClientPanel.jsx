import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';

const ClientPanel = () => {

  // const users = [    
  //   { id: 1, name: 'Juan Pérez', email: 'juan@email.com', phone: '123-456-7890', company: 'D Sierra' },
  //   { id: 2, name: 'María García', email: 'maria@email.com', phone: '098-765-4321', company: 'San Antonio' },
  //   { id: 3, name: 'Carlos López', email: 'carlos@email.com', phone: '555-123-4567', company: 'Surtiplaza' },
  // ];

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: ''
  });

  // Cargar usuarios desde la API al montar el componente
  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError('');
      const userData = await ApiService.getUsers();
      
      // Adaptar los datos de la API al formato que espera tu componente
      const formattedClients = Array.isArray(userData) ? userData.map(user => ({
        id: user.id || user.user_id,
        name: user.name || user.full_name || user.fullName || 'Sin nombre',
        email: user.email || 'Sin email',
        phone: user.phone || user.telefono || 'Sin teléfono',
        company: user.company || user.empresa || 'Sin empresa'
      })) : [];
      
      setClients(formattedClients);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleCreateClient = () => {
    setFormData({ name: '', email: '', phone: '', company: '' });
    setEditingClient(null);
    setShowForm(true);
  };

  const handleEditClient = (client) => {
    setFormData(client);
    setEditingClient(client);
    setShowForm(true);
  };

  const handleSaveClient = (e) => {
    e.preventDefault();

    if (editingClient) {
      setClients(clients.map(client => 
        client.id === editingClient.id 
          ? { ...formData, id: editingClient.id }
          : client
      ));
    } else {
      //crea nuevo cliente
      const newClient = {
        id: Math.max(...clients.map(c => c.id), 0) + 1,
        ...formData
      };
      setClients([...clients, newClient]);
    }

    setShowForm(false);
    setEditingClient(null);
  };

  const handleDeleteClient = (clientId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      setClients(clients.filter(client => client.id !== clientId));
    }
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Mostrar loading mientras carga
  if (loading) {
    return (
      <div className="w-full">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-qualitaGreen mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando clientes...</p>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar error si falla la carga
  if (error) {
    return (
      <div className="w-full">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 text-center">
            <div className="text-red-500 mb-4 text-4xl">⚠️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar clientes</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchClients}
              className="bg-qualitaGreen text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 sm:p-6 border-b bg-gray-50">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-0">Panel de Clientes ({clients.length}) </h2>
          <div className="flex gap-2">
            <button
              onClick={fetchClients}
              className="bg-qualitaOrange text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center justify-center gap-2"
            >
              <span>🔄</span>
              <span>Actualizar</span>
            </button>
            <button
            onClick={handleCreateClient}
            className="bg-qualitaGreen text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center justify-center gap-2 w-full sm:w-auto"
            >
            <span className="text-lg">+</span>
            <span>Crear Cliente</span>
            </button>
          </div>
        </div>

        {/* Vista Desktop - Tabla */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teléfono
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Empresa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {client.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {client.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {client.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {client.company}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEditClient(client)}
                      className="text-qualitaGreen hover:text-green-900 font-medium"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteClient(client.id)}
                      className="text-red-600 hover:text-red-900 font-medium"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Vista Mobile - Cards */}
        <div className="lg:hidden">
          <div className="divide-y divide-gray-200">
            {clients.map((client) => (
              <div key={client.id} className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      {client.name}
                    </h3>
                    <p className="text-sm text-qualitaOrange font-medium">
                      {client.company}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 mr-2">📧</span>
                    <span className="truncate">{client.email}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 mr-2">📱</span>
                    <span>{client.phone}</span>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => handleEditClient(client)}
                    className="flex-1 bg-qualitaGreen text-white py-2 px-3 rounded text-sm font-medium hover:bg-green-600 transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteClient(client.id)}
                    className="flex-1 bg-red-500 text-white py-2 px-3 rounded text-sm font-medium hover:bg-red-600 transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Si no hay clientes */}
        {clients.length === 0 && (
          <div className="text-center py-12 px-4">
            <div className="text-gray-400 text-6xl mb-4">👥</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay clientes</h3>
            <p className="text-gray-500 mb-4">Comienza creando tu primer cliente</p>
            <button
              onClick={handleCreateClient}
              className="bg-qualitaGreen text-white px-6 py-2 rounded-lg hover:bg-green-600"
            >
              Crear Primer Cliente
            </button>
          </div>
        )}
      </div>

      {/* Modal/Formulario - Responsive */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-screen overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-bold mb-4">
                {editingClient ? 'Editar Cliente' : 'Crear Nuevo Cliente'}
              </h3>
              
              <form onSubmit={handleSaveClient} className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-qualitaGreen"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-qualitaGreen"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-qualitaGreen"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Empresa
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-qualitaGreen"
                  />
                </div>

                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-qualitaGreen text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    {editingClient ? 'Actualizar' : 'Crear'} Cliente
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientPanel;