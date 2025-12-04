import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { reservasAPI } from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './ReservationHistoryPage.css';

const ReservationHistoryPage = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [filter, setFilter] = useState('todas');
  const [, setLoading] = useState(true);

  useEffect(() => {
    cargarReservas();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const cargarReservas = async () => {
    try {
      // Obtener usuario actual
      const userData = localStorage.getItem('user');
      console.log('userData desde localStorage:', userData);
      
      if (!userData) {
        console.log('No hay usuario en localStorage, redirigiendo a login');
        navigate('/login');
        return;
      }

      const user = JSON.parse(userData);
      console.log('Usuario parseado:', user);
      console.log('Email del usuario:', user.email);
      
      // Obtener reservas del usuario desde el backend
      console.log('Buscando reservas para email:', user.email);
      const response = await reservasAPI.obtenerPorEmail(user.email);
      console.log('Reservas recibidas del backend:', response.data);
      
      // Convertir formato del backend al frontend
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
        notas: r.comentarios || '',
        fechaCreacion: r.fechaCreacion
      }));
      
      setReservations(reservasFormateadas);
    } catch (error) {
      console.error('Error cargando reservas:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredReservations = () => {
    if (filter === 'todas') return reservations;
    return reservations.filter(res => res.estado === filter);
  };

  const getStatusBadge = (estado) => {
    const badges = {
      pendiente: { 
        text: 'Pendiente', 
        class: 'badge-pending',
        icon: 'fa-clock',
        description: 'Tu reserva está en espera de confirmación'
      },
      confirmada: { 
        text: 'Confirmada', 
        class: 'badge-confirmed',
        icon: 'fa-check-circle',
        description: 'Tu reserva ha sido confirmada. ¡Te esperamos!'
      },
      cancelada: { 
        text: 'Cancelada', 
        class: 'badge-cancelled',
        icon: 'fa-times-circle',
        description: 'Esta reserva fue cancelada'
      }
    };
    return badges[estado] || badges.pendiente;
  };

  const formatDate = (dateString) => {
    // Parsear la fecha correctamente para evitar problemas de zona horaria
    const [year, month, day] = dateString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const isUpcoming = (fecha, hora) => {
    const reservationDateTime = new Date(`${fecha}T${hora}`);
    const now = new Date();
    return reservationDateTime > now;
  };

  return (
    <div className="reservation-history-page">
      <Header />

      <div className="reservation-history-container">
        <div className="container">
          <h1 className="page-title">
            <i className="fas fa-calendar-check"></i> Mis Reservaciones
          </h1>

          <div className="filters">
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

          {getFilteredReservations().length === 0 ? (
            <div className="empty-history">
              <i className="fas fa-calendar-times"></i>
              <h3>No tienes reservaciones {filter !== 'todas' ? `en estado "${filter}"` : ''}</h3>
              <p>Tus reservaciones aparecerán aquí una vez que realices una</p>
              <button 
                className="btn-make-reservation"
                onClick={() => navigate('/reserva')}
              >
                <i className="fas fa-plus"></i> Hacer una Reservación
              </button>
            </div>
          ) : (
            <div className="reservations-list">
              {getFilteredReservations().map((reservation) => {
                const badge = getStatusBadge(reservation.estado);
                const upcoming = isUpcoming(reservation.fecha, reservation.hora);
                
                return (
                  <div key={reservation.id} className={`reservation-card ${reservation.estado}`}>
                    <div className="reservation-status-banner">
                      <span className={`status-badge ${badge.class}`}>
                        <i className={`fas ${badge.icon}`}></i>
                        {badge.text}
                      </span>
                      {upcoming && reservation.estado !== 'cancelada' && (
                        <span className="upcoming-badge">
                          <i className="fas fa-star"></i> Próxima
                        </span>
                      )}
                    </div>

                    <div className="reservation-body">
                      <div className="reservation-info">
                        <div className="info-row">
                          <div className="info-item">
                            <i className="fas fa-calendar"></i>
                            <div>
                              <span className="info-label">Fecha</span>
                              <span className="info-value">{formatDate(reservation.fecha)}</span>
                            </div>
                          </div>
                          <div className="info-item">
                            <i className="fas fa-clock"></i>
                            <div>
                              <span className="info-label">Hora</span>
                              <span className="info-value">{reservation.hora}</span>
                            </div>
                          </div>
                        </div>

                        <div className="info-row">
                          <div className="info-item">
                            <i className="fas fa-users"></i>
                            <div>
                              <span className="info-label">Personas</span>
                              <span className="info-value">{reservation.personas} {reservation.personas === 1 ? 'persona' : 'personas'}</span>
                            </div>
                          </div>
                          <div className="info-item">
                            <i className="fas fa-phone"></i>
                            <div>
                              <span className="info-label">Teléfono</span>
                              <span className="info-value">{reservation.telefono}</span>
                            </div>
                          </div>
                        </div>

                        {reservation.notas && (
                          <div className="reservation-notes">
                            <i className="fas fa-sticky-note"></i>
                            <div>
                              <span className="info-label">Notas</span>
                              <span className="info-value">{reservation.notas}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="reservation-status-message">
                        <i className={`fas ${badge.icon}`}></i>
                        <p>{badge.description}</p>
                      </div>
                    </div>

                    <div className="reservation-footer">
                      <span className="reservation-id">ID: #{reservation.id}</span>
                      {reservation.estado === 'pendiente' && (
                        <span className="help-text">
                          <i className="fas fa-info-circle"></i>
                          Recibirás una confirmación pronto
                        </span>
                      )}
                      {reservation.estado === 'confirmada' && upcoming && (
                        <span className="help-text success">
                          <i className="fas fa-check"></i>
                          ¡Te esperamos!
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ReservationHistoryPage;
