import React, { useState } from 'react';
import { reservasAPI, reniecAPI } from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './ReservaPage.css';

const ReservaPage = () => {
  const [dniBusqueda, setDniBusqueda] = useState('');
  const [loadingReniec, setLoadingReniec] = useState(false);
  const [isNameEditable, setIsNameEditable] = useState(true);

  // --- Constantes de Horario de Negocio ---
  const BUSINESS_OPEN = "10:00";
  const BUSINESS_CLOSE = "21:00";

  // --- Obtener fecha local (evita error de UTC) ---
  const getTodayDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // --- LÓGICA CORE: Calcular Hora Mínima Permitida ---
  const calculateMinTime = () => {
    // Si no hay fecha elegida, no hay hora mínima (estará deshabilitado)
    if (!formData.fecha) return "";

    // Si la fecha elegida es FUTURA, la hora mínima es la apertura del negocio
    if (formData.fecha > getTodayDate()) {
      return BUSINESS_OPEN;
    }

    // Si la fecha es HOY, aplicamos la regla de "1 hora de anticipación"
    if (formData.fecha === getTodayDate()) {
      const now = new Date();
      now.setHours(now.getHours() + 1); // Sumar 1 hora
      now.setMinutes(now.getMinutes()); // Mantener minutos

      // Formatear a HH:MM
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const oneHourLaterString = `${hours}:${minutes}`;

      // Regla de Negocio:
      // Si "ahora + 1h" es antes de abrir (ej. son las 7am + 1h = 8am), el min es 10:00
      if (oneHourLaterString < BUSINESS_OPEN) {
        return BUSINESS_OPEN;
      }

      // Si "ahora + 1h" ya pasó el cierre, devolvemos el cierre (bloquea el día)
      if (oneHourLaterString > BUSINESS_CLOSE) {
        return BUSINESS_CLOSE;
      }

      return oneHourLaterString;
    }

    return BUSINESS_OPEN;
  };

  const buscarDni = async () => {
    if (!dniBusqueda) return alert('Por favor ingrese un DNI.');
    if (dniBusqueda.length !== 8) return alert('El DNI debe tener exactamente 8 dígitos.');

    setLoadingReniec(true);
    try {
      const response = await reniecAPI.consultar(dniBusqueda);
      const data = response.data;
      const nombreCompleto = data.full_name;

      setFormData(prev => ({
        ...prev,
        nombre: nombreCompleto
      }));

      setIsNameEditable(false);
    } catch (error) {
      console.error(error);
      setIsNameEditable(true);
      setFormData(prev => ({ ...prev, nombre: '' }));
      alert('No se encontraron datos para este DNI. Por favor ingrese el nombre manualmente.');
    } finally {
      setLoadingReniec(false);
    }
  };

  const handleDniChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length <= 8) {
      setDniBusqueda(val);
    }
  };

  const [formData, setFormData] = useState({
    email: '',
    fecha: '',
    hora: '',
    nombre: '',
    personas: '',
    telefono: '',
    notas: ''
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [reservationData, setReservationData] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Si cambia la fecha, reseteamos la hora para obligar a validarla de nuevo
    if (name === 'fecha') {
      setFormData(prev => ({ ...prev, fecha: value, hora: '' }));
      return;
    }

    if (name === 'telefono') {
      const numericValue = value.replace(/\D/g, '');
      if (numericValue.length <= 9) {
        setFormData(prev => ({ ...prev, [name]: numericValue }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // --- VALIDACIÓN ESTRICTA AL SALIR DEL CAMPO HORA ---
  const handleTimeBlur = (e) => {
    const selectedTime = e.target.value;
    if (!selectedTime) return;

    const minTime = calculateMinTime();

    // 1. Validar Rango de Negocio General (10:00 - 21:00)
    if (selectedTime < BUSINESS_OPEN || selectedTime > BUSINESS_CLOSE) {
      alert(`Nuestro horario de atención es de ${BUSINESS_OPEN} a ${BUSINESS_CLOSE}.`);
      setFormData(prev => ({ ...prev, hora: '' }));
      return;
    }

    // 2. Validar Hora Mínima Dinámica (Regla de 1 hora)
    if (selectedTime < minTime) {
      alert(`Para el día de hoy, las reservas deben ser a partir de las ${minTime} (1 hora de anticipación).`);
      setFormData(prev => ({ ...prev, hora: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.telefono.length !== 9) {
      alert('El teléfono debe tener exactamente 9 dígitos');
      return;
    }

    // Validación final de seguridad
    const minTime = calculateMinTime();
    if (formData.hora < minTime || formData.hora > BUSINESS_CLOSE) {
      alert("La hora seleccionada no es válida.");
      return;
    }

    try {
      const nuevaReserva = {
        nombre: formData.nombre,
        email: formData.email,
        telefono: formData.telefono,
        fecha: formData.fecha,
        hora: formData.hora,
        numeroPersonas: parseInt(formData.personas),
        comentarios: formData.notas || '',
        estado: 'pendiente'
      };

      await reservasAPI.crear(nuevaReserva);

      setReservationData({
        nombre: formData.nombre,
        fecha: formData.fecha,
        hora: formData.hora
      });

      setShowSuccessModal(true);

      setTimeout(() => {
        setFormData({
          email: '',
          fecha: '',
          hora: '',
          nombre: '',
          personas: '',
          telefono: '',
          notas: ''
        });
        setDniBusqueda('');
        setIsNameEditable(true);
      }, 3000);
    } catch (error) {
      console.error('Error al crear reserva:', error);
      alert('Error al crear la reserva. Por favor intenta nuevamente.');
    }
  };

  const closeModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <div className="reserva-page">
      <Header />

      <div className="reserva-container">
        <div className="container">
          <div className="reserva-content">
            <h1 className="reserva-title fade-in">Formulario de Reserva</h1>

            <form onSubmit={handleSubmit} className="reserva-form slide-in-left">

              {/* ... DNI, NOMBRE, EMAIL (IGUAL QUE ANTES) ... */}
              <div className="form-group">
                <label htmlFor="dniBusqueda">DNI (Consulta RENIEC)</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input type="text" id="dniBusqueda" value={dniBusqueda} onChange={handleDniChange} className="form-input" placeholder="Ingrese 8 dígitos" style={{ flex: 1 }} />
                  <button type="button" onClick={buscarDni} disabled={loadingReniec} className="reservar-btn" style={{ width: 'auto', margin: 0, padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>
                    {loadingReniec ? '...' : 'Buscar'}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="nombre">Nombre Completo</label>
                <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} className="form-input" required readOnly={!isNameEditable} style={{ backgroundColor: !isNameEditable ? '#e9ecef' : '#fff', cursor: !isNameEditable ? 'not-allowed' : 'text' }} placeholder={isNameEditable ? "Ingrese nombre" : "Dato obtenido de RENIEC"} />
              </div>

              <div className="form-group">
                <label htmlFor="email">Correo electronico</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="form-input" required />
              </div>

              {/* --- FECHA --- */}
              <div className="form-group">
                <label htmlFor="fecha">Fecha</label>
                <input
                  type="date"
                  id="fecha"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleChange}
                  className="form-input"
                  min={getTodayDate()}
                  required
                />
              </div>

              {/* --- HORA CON LÓGICA MEJORADA --- */}
              <div className="form-group">
                <label htmlFor="hora">Hora</label>
                <input
                  type="time"
                  id="hora"
                  name="hora"
                  value={formData.hora}
                  onChange={handleChange}
                  onBlur={handleTimeBlur} // <--- Validación al salir del campo
                  className="form-input"
                  required

                  // 1. Bloqueado si no hay fecha
                  disabled={!formData.fecha}

                  // 2. Intervalos de 15 minutos
                  step="900"

                  // 3. Mínimo Dinámico
                  min={calculateMinTime()}

                  // 4. Máximo Fijo (Cierre de reservas)
                  max={BUSINESS_CLOSE}
                />

                {/* Texto de ayuda dinámico */}
                <small style={{ color: '#666', fontSize: '0.8rem', marginTop: '5px', display: 'block' }}>
                  {!formData.fecha
                    ? "Seleccione primero una fecha."
                    : `Horario disponible: ${calculateMinTime()} a ${BUSINESS_CLOSE} (Intervalos 15 min).`
                  }
                </small>
              </div>

              {/* ... PERSONAS, TELEFONO, NOTAS (IGUAL QUE ANTES) ... */}
              <div className="form-group">
                <label htmlFor="personas">Numero de personas</label>
                <input type="number" id="personas" name="personas" value={formData.personas} onChange={handleChange} className="form-input" min="1" max="20" required />
              </div>

              <div className="form-group">
                <label htmlFor="telefono">Telefono (9 dígitos)</label>
                <input type="tel" id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} className="form-input" placeholder="987654321" maxLength="9" required />
              </div>

              <div className="form-group">
                <label htmlFor="notas">Notas o especificaciones (opcional)</label>
                <textarea id="notas" name="notas" value={formData.notas} onChange={handleChange} className="form-input" placeholder="Ej: Mesa cerca de la ventana..." rows="3" maxLength="200" />
                <small style={{ display: 'block', marginTop: '5px', color: '#6c757d', fontSize: '0.85rem' }}>{formData.notas.length}/200 caracteres</small>
              </div>

              <button type="submit" className="reservar-btn pulse">Reservar</button>
            </form>
          </div>
        </div>
      </div>

      {/* ... MODAL DE ÉXITO (MANTENER IGUAL) ... */}
      {showSuccessModal && (
        <div className="success-modal-overlay" onClick={closeModal}>
          <div className="success-modal" onClick={(e) => e.stopPropagation()}>
            <div className="success-icon">
              <svg viewBox="0 0 52 52" className="checkmark"><circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" /><path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" /></svg>
            </div>
            <h2 className="success-title">¡Reserva Recibida!</h2>
            <p className="success-message">Tu solicitud ha sido recibida.<br />{reservationData && (<><strong>{reservationData.nombre}</strong>, para el <strong>{reservationData.fecha}</strong> a las <strong>{reservationData.hora}</strong>.</>)}</p>
            <p className="success-submessage" style={{ background: '#fff3cd', padding: '15px', borderRadius: '8px', border: '2px solid #ffc107', marginTop: '15px' }}><i className="fas fa-info-circle" style={{ color: '#856404', marginRight: '8px' }}></i><strong style={{ color: '#856404' }}>Importante:</strong> Tu reserva está pendiente.</p>
            <button className="success-btn" onClick={closeModal}>Entendido</button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ReservaPage;