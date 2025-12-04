import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usuariosAPI } from '../services/api';
import './AdminUsers.css';

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const response = await usuariosAPI.obtenerTodos();
      const usuarios = response.data.map(user => ({
        ...user,
        fechaRegistro: Array.isArray(user.fechaRegistro)
          ? `${user.fechaRegistro[0]}-${String(user.fechaRegistro[1]).padStart(2, '0')}-${String(user.fechaRegistro[2]).padStart(2, '0')}`
          : user.fechaRegistro
      }));
      setUsers(usuarios);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
      alert('Error al cargar usuarios. Verifica que el backend esté corriendo.');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredUsers = () => {
    return users.filter(user => 
      user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const toggleUserStatus = async (userId) => {
    try {
      const user = users.find(u => u.id === userId);
      const updatedUser = { ...user, activo: !user.activo };
      await usuariosAPI.actualizar(userId, updatedUser);
      
      const updatedUsers = users.map(u => 
        u.id === userId ? updatedUser : u
      );
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      alert('❌ Error al actualizar el estado del usuario');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      try {
        await usuariosAPI.eliminar(userId);
        const updatedUsers = users.filter(user => user.id !== userId);
        setUsers(updatedUsers);
        alert('✅ Usuario eliminado exitosamente');
      } catch (error) {
        console.error('Error eliminando usuario:', error);
        alert('❌ Error al eliminar el usuario');
      }
    }
  };

  const handleSaveChanges = () => {
    alert('✅ Los cambios se guardan automáticamente');
  };

  if (loading) {
    return (
      <div className="admin-users">
        <div className="loading-message">
          <p>Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-users">
      <div className="admin-header">
        <div className="header-left">
          <button onClick={() => navigate('/admin/dashboard')} className="back-btn">
            <i className="fas fa-arrow-left"></i> Dashboard
          </button>
          <button onClick={() => navigate('/')} className="home-btn-header">
            <i className="fas fa-home"></i> Inicio
          </button>
        </div>
        <h1>Gestión de Usuarios</h1>
        <button onClick={handleSaveChanges} className="save-btn">
          <i className="fas fa-save"></i> Guardar Cambios
        </button>
      </div>

      <div className="users-container">
        <div className="users-header">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="users-stats">
            <div className="stat-item">
              <span className="stat-label">Total Usuarios:</span>
              <span className="stat-value">{users.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Activos:</span>
              <span className="stat-value">{users.filter(u => u.activo).length}</span>
            </div>
          </div>
        </div>

        <div className="users-grid">
          {getFilteredUsers().map(user => (
            <div key={user.id} className={`user-card ${!user.activo ? 'inactive' : ''}`}>
              <div className="user-avatar">
                <i className="fas fa-user-circle"></i>
              </div>
              <div className="user-info">
                <h3>{user.nombre}</h3>
                <p className="user-email">
                  <i className="fas fa-envelope"></i> {user.email}
                </p>
                <p className="user-phone">
                  <i className="fas fa-phone"></i> {user.telefono || 'N/A'}
                </p>
                <div className="user-meta">
                  <span className="meta-item">
                    <i className="fas fa-shopping-bag"></i> {user.pedidos || 0} pedidos
                  </span>
                  <span className="meta-item">
                    <i className="fas fa-calendar"></i> {user.fechaRegistro}
                  </span>
                </div>
                <div className="user-status">
                  <span className={`status-badge ${user.activo ? 'active' : 'inactive'}`}>
                    {user.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>
              <div className="user-actions">
                <button 
                  onClick={() => toggleUserStatus(user.id)}
                  className={`toggle-btn ${user.activo ? 'deactivate' : 'activate'}`}
                  title={user.activo ? 'Desactivar' : 'Activar'}
                >
                  <i className={`fas ${user.activo ? 'fa-user-slash' : 'fa-user-check'}`}></i>
                </button>
                <button 
                  onClick={() => handleDeleteUser(user.id)}
                  className="delete-btn"
                  title="Eliminar usuario"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          ))}
        </div>

        {getFilteredUsers().length === 0 && (
          <div className="no-results">
            <i className="fas fa-search"></i>
            <p>No se encontraron usuarios</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
