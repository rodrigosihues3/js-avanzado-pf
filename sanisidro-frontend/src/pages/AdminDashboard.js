import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { pedidosAPI, usuariosAPI, productosAPI, reservasAPI } from '../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);
  const [stats, setStats] = useState({
    totalPedidos: 0,
    usuariosRegistrados: 0,
    productos: 0,
    reservasHoy: 0,
    reservasTotales: 0
  });

  useEffect(() => {
    const data = localStorage.getItem('adminData');
    if (data) {
      setAdminData(JSON.parse(data));
    } else {
      setAdminData({
        nombre: 'Kevin',
        apellido: 'Arteaga',
        usuario: 'admin',
        gmail: 'admin@sanisidro.com'
      });
    }

    calculateStats();

    const interval = setInterval(() => {
      calculateStats();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const calculateStats = async () => {
    try {
      const pedidosResponse = await pedidosAPI.obtenerTodos();
      const orders = pedidosResponse.data || [];

      const productosResponse = await productosAPI.obtenerTodos();
      const products = productosResponse.data || [];

      const usuariosResponse = await usuariosAPI.obtenerTodos();
      const users = usuariosResponse.data || [];

      const reservasResponse = await reservasAPI.obtenerTodas();
      const reservations = reservasResponse.data || [];

      const today = new Date().toISOString().split('T')[0];
      const reservasHoy = reservations.filter(r => {
        const reservaFecha = Array.isArray(r.fecha)
          ? `${r.fecha[0]}-${String(r.fecha[1]).padStart(2, '0')}-${String(r.fecha[2]).padStart(2, '0')}`
          : r.fecha;
        return reservaFecha === today;
      }).length;

      setStats({
        totalPedidos: orders.length,
        usuariosRegistrados: users.length,
        productos: products.length,
        reservasHoy: reservasHoy,
        reservasTotales: reservations.length
      });
    } catch (error) {
      console.error('Error cargando estadisticas:', error);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Estas seguro de que deseas cerrar sesion?')) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');
      navigate('/');
    }
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  if (!adminData) {
    return (
      <div className="dashboard-loading">
        <p>Cargando datos del administrador...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-container">
        <div className="welcome-card">
          <h2>Bienvenido, Administrador!</h2>
          <div className="admin-info">
            <div className="info-item">
              <span className="info-label">Usuario:</span>
              <span className="info-value">{adminData.usuario}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Correo:</span>
              <span className="info-value">{adminData.gmail}</span>
            </div>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <i className="fas fa-chart-bar stat-icon"></i>
            </div>
            <div className="stat-content">
              <h3>Total Pedidos</h3>
              <p className="stat-number">{stats.totalPedidos}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <i className="fas fa-users stat-icon"></i>
            </div>
            <div className="stat-content">
              <h3>Usuarios Registrados</h3>
              <p className="stat-number">{stats.usuariosRegistrados}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <i className="fas fa-utensils stat-icon"></i>
            </div>
            <div className="stat-content">
              <h3>Productos</h3>
              <p className="stat-number">{stats.productos}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <i className="fas fa-calendar-check stat-icon"></i>
            </div>
            <div className="stat-content">
              <h3>Reservas Totales</h3>
              <p className="stat-number">{stats.reservasTotales}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <i className="fas fa-calendar-day stat-icon"></i>
            </div>
            <div className="stat-content">
              <h3>Reservas Hoy</h3>
              <p className="stat-number">{stats.reservasHoy}</p>
            </div>
          </div>
        </div>

        <div className="actions-section">
          <h3>Acciones Rapidas</h3>
          <div className="actions-grid">
            <button className="action-btn" onClick={() => handleNavigate('/admin/reports')}>
              <div className="action-icon-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <i className="fas fa-chart-line" style={{ fontSize: '2rem' }}></i>
              </div>
              <span className="action-text">Reportes Gerenciales</span>
            </button>
            <button className="action-btn" onClick={() => handleNavigate('/admin/orders')}>
              <div className="action-icon-wrapper">
                <img src="/images/admin/pedidos.png" alt="Pedidos" className="action-icon-img" />
              </div>
              <span className="action-text">Gestionar Pedidos</span>
            </button>
            <button className="action-btn" onClick={() => handleNavigate('/admin/menu')}>
              <div className="action-icon-wrapper">
                <img src="/images/admin/menu.png" alt="Menu" className="action-icon-img" />
              </div>
              <span className="action-text">Gestionar Menu</span>
            </button>
            <button className="action-btn" onClick={() => handleNavigate('/admin/users')}>
              <div className="action-icon-wrapper">
                <img src="/images/admin/usuarios.png" alt="Usuarios" className="action-icon-img" />
              </div>
              <span className="action-text">Gestionar Usuarios</span>
            </button>
            <button className="action-btn" onClick={() => handleNavigate('/admin/reservations')}>
              <div className="action-icon-wrapper">
                <img src="/images/admin/reservas.png" alt="Reservas" className="action-icon-img" />
              </div>
              <span className="action-text">Gestionar Reservas</span>
            </button>
            <button className="action-btn" onClick={() => handleNavigate('/admin/promotions')}>
              <div className="action-icon-wrapper">
                <img src="/images/admin/promociones.png" alt="Promociones" className="action-icon-img" />
              </div>
              <span className="action-text">Gestionar Promociones</span>
            </button>
          </div>
        </div>

        <div className="logout-section">
          <button onClick={() => navigate('/')} className="home-btn">
            <i className="fas fa-home"></i> Volver al Inicio
          </button>
          <button onClick={handleLogout} className="logout-btn">
            <i className="fas fa-sign-out-alt"></i> Cerrar Sesion
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
