import React, { useState, useEffect } from 'react';
import { promocionesAPI } from '../services/api';
import './PromotionsBanner.css';

const PromotionsBanner = () => {
  const [promotions, setPromotions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    cargarPromociones();
  }, []);

  const cargarPromociones = async () => {
    try {
      const response = await promocionesAPI.obtenerTodas();
      const allPromotions = response.data;
      console.log('📢 Promociones del backend:', allPromotions);
      console.log('📢 Total promociones:', allPromotions.length);
      
      // Filtrar promociones activas con margen de 7 días
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      
      // Calcular fecha dentro de 7 días
      const sevenDaysLater = new Date(today);
      sevenDaysLater.setDate(today.getDate() + 7);
      const sevenDaysLaterStr = sevenDaysLater.toISOString().split('T')[0];
      
      console.log('📅 Fecha de hoy:', todayStr);
      console.log('📅 Fecha +7 días:', sevenDaysLaterStr);
      
      const activePromotions = allPromotions.filter(promo => {
        // Convertir fechas de array a string si es necesario
        const formatearFecha = (fecha) => {
          if (!fecha) return null;
          if (Array.isArray(fecha)) {
            return `${fecha[0]}-${String(fecha[1]).padStart(2, '0')}-${String(fecha[2]).padStart(2, '0')}`;
          }
          return fecha;
        };

        const fechaInicio = formatearFecha(promo.fechaInicio);
        const fechaFin = formatearFecha(promo.fechaFin);

        console.log(`Promoción: ${promo.descripcion}`);
        console.log(`  - Activa: ${promo.activa}`);
        console.log(`  - Fecha inicio: ${fechaInicio}`);
        console.log(`  - Fecha fin: ${fechaFin}`);
        
        // Mostrar si:
        // 1. Está activa
        // 2. La fecha de inicio es hoy o dentro de los próximos 7 días
        // 3. La fecha de fin no ha pasado
        const cumpleFechas = fechaInicio <= sevenDaysLaterStr && fechaFin >= todayStr;
        console.log(`  - ¿Cumple fechas?: ${cumpleFechas}`);
        
        return promo.activa && cumpleFechas;
      });
      
      console.log('✅ Promociones activas:', activePromotions.length);
      setPromotions(activePromotions);
    } catch (error) {
      console.error('❌ Error cargando promociones:', error);
    }
  };

  useEffect(() => {
    if (promotions.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === promotions.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000); // Cambia cada 5 segundos

      return () => clearInterval(interval);
    }
  }, [promotions.length]);

  if (promotions.length === 0) {
    return null; // No mostrar nada si no hay promociones
  }

  const currentPromotion = promotions[currentIndex];
  
  console.log('🎯 Promoción actual:', currentPromotion);
  console.log('📝 Título:', currentPromotion.titulo);
  console.log('📝 Descripción:', currentPromotion.descripcion);
  console.log('🖼️ Imagen:', currentPromotion.imagen);

  // Convertir fechas de array a string si es necesario
  const formatearFechaStr = (fecha) => {
    if (!fecha) return null;
    if (Array.isArray(fecha)) {
      return `${fecha[0]}-${String(fecha[1]).padStart(2, '0')}-${String(fecha[2]).padStart(2, '0')}`;
    }
    return fecha;
  };

  // Verificar si la promoción es futura
  const today = new Date().toISOString().split('T')[0];
  const fechaInicioStr = formatearFechaStr(currentPromotion.fechaInicio);
  const isFuturePromotion = fechaInicioStr > today;
  
  // Formatear fecha de inicio
  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? promotions.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === promotions.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="promotions-banner">
      {promotions.length > 1 && (
        <button className="banner-arrow banner-arrow-left" onClick={handlePrevious}>
          <i className="fas fa-chevron-left"></i>
        </button>
      )}
      
      <div className="promotion-content">
        <div className="promotion-icon">
          {currentPromotion.imagen ? (
            <img 
              src={currentPromotion.imagen}
              alt={currentPromotion.titulo || 'Promoción'} 
              className="promotion-banner-img"
              onError={(e) => {
                e.target.style.display = 'none';
                const parent = e.target.parentElement;
                if (!parent.querySelector('.fas')) {
                  const icon = document.createElement('i');
                  icon.className = 'fas fa-gift';
                  parent.appendChild(icon);
                }
              }}
            />
          ) : (
            <i className="fas fa-gift"></i>
          )}
        </div>
        <div className="promotion-text">
          <div className="promotion-title-row">
            <h3>{currentPromotion.titulo || currentPromotion.descripcion}</h3>
            {isFuturePromotion && (
              <span className="coming-soon-badge">
                <i className="fas fa-clock"></i> Próximamente
              </span>
            )}
          </div>
          {currentPromotion.titulo && currentPromotion.descripcion && (
            <p>{currentPromotion.descripcion}</p>
          )}
          {isFuturePromotion && (
            <div className="start-date-info">
              <i className="fas fa-calendar-alt"></i>
              <span>Inicia el {formatDate(fechaInicioStr)}</span>
            </div>
          )}
          <div className="promotion-code">
            <span className="code-label">Código:</span>
            <span className="code-value">{currentPromotion.codigo}</span>
            <span className="discount-badge">{currentPromotion.descuento}% OFF</span>
          </div>
          {(currentPromotion.cantidadMinima > 1 || currentPromotion.montoMinimo > 0) && (
            <div className="promotion-requirements">
              {currentPromotion.cantidadMinima > 1 && (
                <span className="requirement">
                  <i className="fas fa-shopping-cart"></i> Mín. {currentPromotion.cantidadMinima} productos
                </span>
              )}
              {currentPromotion.montoMinimo > 0 && (
                <span className="requirement">
                  <i className="fas fa-dollar-sign"></i> Compra mín. S/ {(parseFloat(currentPromotion.montoMinimo) || 0).toFixed(2)}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      
      {promotions.length > 1 && (
        <div className="promotion-dots">
          {promotions.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      )}

      {promotions.length > 1 && (
        <button className="banner-arrow banner-arrow-right" onClick={handleNext}>
          <i className="fas fa-chevron-right"></i>
        </button>
      )}
    </div>
  );
};

export default PromotionsBanner;
