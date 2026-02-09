import React from "react";
import { useState } from "react";

//Pasa el perfil creado y panel para que el usuario vea su perfil completo y pueda cambiar su contraseña

const UserProfile = ({user, onUpdateUser}) => {

    const [currentPassword, setCurrentPassword] = useState(''); // La contraseña actual que escribe el usuario
    const [newPassword, setNewPassword] = useState(''); // Nueva contraseña
    const [confirmPassword, setConfirmPassword] = useState(''); //confirmar la nueva contraseña
    const [error, setError] = useState(''); // error si se escribe mal la contraseña
    const [success, setSuccess] = useState(''); //contraseña exitosa
    const [loading, setLoading] = useState(''); // cargando mientras se procesa el estado

    const [isEditing, setIsEditing] = useState(false); //se quiere editar?
    const [fullName, setFullName] = useState(user.fullName); //Edita el nombre completo

    const handleChangePassword = () => {
        setLoading(true);
        setError('');
        setSuccess('');

        // ¿Están todos los campos llenos?
        if (!currentPassword || !newPassword || !confirmPassword) {
        setError('Todos los campos son obligatorios');
        setLoading(false);
        return;  // Salir de la función
        };

        // ¿La contraseña actual es correcta?
        if (currentPassword !== user.password) {
        setError('La contraseña actual es incorrecta');
        setLoading(false);
        return;
        };

        // ¿Las nuevas contraseñas coinciden?
        if (newPassword !== confirmPassword) {
        setError('Las contraseñas nuevas no coinciden');
        setLoading(false);
        return;
        };

        // ¿La nueva contraseña es suficientemente larga?
        if (newPassword.length < 3) {
        setError('La nueva contraseña debe tener al menos 3 caracteres');
        setLoading(false);
        return;
        };

        //funcion cambiar contraseña
        setTimeout(() => {
        const updatedUser = { ...user, password: newPassword }; // Crear copia del usuario con nueva contraseña
        onUpdateUser(updatedUser);                              // Enviar al componente padre
        setSuccess('Contraseña cambiada exitosamente');         // Mostrar mensaje de éxito
  
        // Limpiar todos los campos
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setLoading(false);
        }, 1000);

        };

        //Funcion Actualizar perfil
        const handleUpdateProfile = () => {
        setLoading(true);

        setTimeout(() => {
        const updatedUser = { ...user, fullName: fullName };
        onUpdateUser(updatedUser);
        setIsEditing(false);
        setSuccess('Información actualizada exitosamente');
        setLoading(false);  

        }, 1000)
   
    };

      return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 bg-qualitaGray">
      {/* Información del Usuario */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-qualitaGreen">Mi Perfil</h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-qualitaGreen text-white px-4 py-2 rounded hover:bg-qualitaOrange"
          >
            {isEditing ? 'Cancelar' : 'Editar'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-qualitaGreen text-sm font-bold mb-2">
              Nombre Completo:
            </label>
            {isEditing ? (
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-qualitaGreen"
              />
            ) : (
              <p className="text-qualitaGreen bg-qualitaGray p-2 rounded">{user.fullName}</p>
            )}
          </div>

          <div>
            <label className="block text-qualitaGreen text-sm font-bold mb-2">
              Usuario:
            </label>
            <p className="text-qualitaGreen bg-qualitaGray p-2 rounded">{user.username}</p>
          </div>

          <div>
            <label className="block text-qualitaGreen text-sm font-bold mb-2">
              Rol:
            </label>
            <p className="text-qualitaGreen bg-qualitaGray p-2 rounded">{user.role}</p>
          </div>
        </div>

        {isEditing && (
          <div className="mt-4">
            <button
              onClick={handleUpdateProfile}
              disabled={loading}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        )}
      </div>

      {/* Cambio de Contraseña */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-qualitaGreen mb-4">Cambiar Contraseña</h3>
        
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-qualitaGreen text-sm font-bold mb-2">
              Contraseña Actual:
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-qualitaGreen"
              placeholder="Ingrese su contraseña actual"
            />
          </div>

          <div>
            <label className="block text-qualitaGreen text-sm font-bold mb-2">
              Nueva Contraseña:
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-qualitaGreen"
              placeholder="Ingrese su nueva contraseña"
            />
          </div>

          <div>
            <label className="block text-qualitaGreen text-sm font-bold mb-2">
              Confirmar Nueva Contraseña:
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-qualitaGreen"
              placeholder="Confirme su nueva contraseña"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {success}
            </div>
          )}

          <button
            onClick={handleChangePassword}
            disabled={loading}
            className="bg-qualitaGreen text-white px-6 py-2 rounded hover:bg-qualitaOrange disabled:opacity-50"
          >
            {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
          </button>
        </div>
      </div>
    </div>
  );

};

export default UserProfile;