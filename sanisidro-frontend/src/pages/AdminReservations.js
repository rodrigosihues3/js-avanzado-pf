import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { reservasAPI } from '../services/api';
import './AdminReservations.css';

const AdminReservations = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [filter, setFilter] = useState('todas');
  const [, setLoading] = useState(true);

  useEffect(() => {
    cargarReservas();
  }, []);

  const cargarReservas = async () => {
    try {
      setLoading(true);
      const response = await reservasAPI.obtenerTodas();
      // Convertir el formato del backend al formato del frontend
      const reservasFormateadas = response.data.map(r => ({
        id: r.id,
        cliente: r.nombre,
        fecha: Array.isArray(r.fecha) 
          ? `${r.fecha[0]}-${String(r.fecha[1]).padStart(2, '0')}-${String(r.fecha[2]).padStart(2, '0')}`
          : r.fecha,
        hora: Array.isArray(r.hora)
          ? `${String(r.hora[0]).padStart(2, '0')}:${String(r.hora[1]).padStart(2, '0')}`
          : r.hora,
        personas: r.numeroPersonas,
        telefono: r.telefono,
        email: r.email,
        estado: r.estado,
        notas: r.comentarios || ''
      }));
      setReservations(reservasFormateadas);
    } catch (error) {
      console.error('Error cargando reservas:', error);
      alert('Error al cargar reservas');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredReservations = () => {
    if (filter === 'todas') return reservations;
    return reservations.filter(res => res.estado === filter);
  };

  const handleStatusChange = async (reservationId, newStatus) => {
    try {
      const reserva = reservations.find(r => r.id === reservationId);
      await reservasAPI.actualizar(reservationId, {
        nombre: reserva.cliente,
        email: reserva.email,
        telefono: reserva.telefono,
        fecha: reserva.fecha,
        hora: reserva.hora,
        numeroPersonas: reserva.personas,
        comentarios: reserva.notas,
        estado: newStatus
      });
      await cargarReservas();
    } catch (error) {
      console.error('Error actualizando reserva:', error);
      alert('Error al actualizar reserva');
    }
  };

  const handleDelete = async (reservationId) => {
    if (window.confirm('¿Estás seguro de eliminar esta reserva?')) {
      try {
        await reservasAPI.eliminar(reservationId);
        alert('✅ Reserva eliminada exitosamente');
        await cargarReservas();
      } catch (error) {
        console.error('Error eliminando reserva:', error);
        alert('Error al eliminar reserva');
      }
    }
  };

  const handleSaveChanges = () => {
    localStorage.setItem('adminReservations', JSON.stringify(reservations));
    alert('✅ Cambios guardados exitosamente');
  };

  const getStatusBadge = (estado) => {
    const badges = {
      pendiente: { text: 'Pendiente', class: 'badge-pending' },
      confirmada: { text: 'Confirmada', class: 'badge-confirmed' },
      cancelada: { text: 'Cancelada', class: 'badge-cancelled' }
    };
    return badges[estado] || badges.pendiente;
  };

  const getTodayReservations = () => {
    const today = new Date().toISOString().split('T')[0];
    return reservations.filter(res => res.fecha === today && res.estado !== 'cancelada').length;
  };

  return (
    <div className="admin-reservations">
      <div className="admin-header">
        <div className="header-left">
          <button onClick={() => navigate('/admin/dashboard')} className="back-btn">
            <i className="fas fa-arrow-left"></i> Dashboard
          </button>
          <button onClick={() => navigate('/')} className="home-btn-header">
            <i className="fas fa-home"></i> Inicio
          </button>
        </div>
        <h1>Gestión de Reservas</h1>
        <button onClick={handleSaveChanges} className="save-btn">
          <i className="fas fa-save"></i> Guardar Cambios
        </button>
      </div>

      <div className="reservations-container">
        <div className="reservations-summary">
          <div className="summary-card">
            <i className="fas fa-calendar-day"></i>
            <div>
              <h3>{getTodayReservations()}</h3>
              <p>Reservas Hoy</p>
            </div>
          </div>
          <div className="summary-card">
            <i className="fas fa-check-circle"></i>
            <div>
              <h3>{reservations.filter(r => r.estado === 'confirmada').length}</h3>
              <p>Confirmadas</p>
            </div>
          </div>
          <div className="summary-card">
            <i className="fas fa-clock"></i>
            <div>
              <h3>{reservations.filter(r => r.estado === 'pendiente').length}</h3>
              <p>Pendientes</p>
            </div>
          </div>
        </div>

        <div className="reservations-filters">
          <button 
            className={`filter-btn ${filter === 'todas' ? 'active' : ''}`}
            onClick={() => setFilter('todas')}
          >
            Todas ({reservations.length})
          </button>
          <button 
            className={`filter-btn ${filter === 'pendiente' ? 'active' : ''}`}
            onClick={() => setFilter('pendiente')}
          >
            Pendientes ({reservations.filter(r => r.estado === 'pendiente').length})
          </button>
          <button 
            className={`filter-btn ${filter === 'confirmada' ? 'active' : ''}`}
            onClick={() => setFilter('confirmada')}
          >
            Confirmadas ({reservations.filter(r => r.estado === 'confirmada').length})
          </button>
          <button 
            className={`filter-btn ${filter === 'cancelada' ? 'active' : ''}`}
            onClick={() => setFilter('cancelada')}
          >
            Canceladas ({reservations.filter(r => r.estado === 'cancelada').length})
          </button>
        </div>

        <div className="reservations-grid">
          {getFilteredReservations().map(reservation => {
            const badge = getStatusBadge(reservation.estado);
            return (
              <div key={reservation.id} className="reservation-card">
                <div className="reservation-header">
                  <div className="reservation-id">#{reservation.id}</div>
                  <span className={`status-badge ${badge.class}`}>
                    {badge.text}
                  </span>
                </div>
                <div className="reservation-body">
                  <h3>{reservation.cliente}</h3>
                  <div className="reservation-details">
                    <div className="detail-item">
                      <i className="fas fa-calendar"></i>
                      <span>{reservation.fecha}</span>
                    </div>
                    <div className="detail-item">
                      <i className="fas fa-clock"></i>
                      <span>{reservation.hora}</span>
                    </div>
                    <div className="detail-item">
                      <i className="fas fa-users"></i>
                      <span>{reservation.personas} personas</span>
                    </div>
                    <div className="detail-item">
                      <i className="fas fa-phone"></i>
                      <span>{reservation.telefono}</span>
                    </div>
                  </div>
                  {reservation.notas && (
                    <div className="reservation-notes">
                      <i className="fas fa-sticky-note"></i>
                      <span>{reservation.notas}</span>
                    </div>
                  )}
                </div>
                <div className="reservation-actions">
                  <select 
                    value={reservation.estado}
                    onChange={(e) => handleStatusChange(reservation.id, e.target.value)}
                    className="status-select"
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="confirmada">Confirmada</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                  <button 
                    onClick={() => handleDelete(reservation.id)}
                    className="delete-btn"
                    title="Eliminar reserva"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {getFilteredReservations().length === 0 && (
          <div className="no-results">
            <i className="fas fa-calendar-times"></i>
            <p>No hay reservas en esta categoría</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReservations;
