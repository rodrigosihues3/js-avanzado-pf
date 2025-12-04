import React, { useState, useEffect } from 'react';
import './ExtrasModal.css';

const ExtrasModal = ({ isOpen, onClose, onAddExtra }) => {
  const [extras, setExtras] = useState({
    bebidas: [],
    adicionales: [],
    cremas: []
  });

  useEffect(() => {
    if (isOpen) {
      // Cargar productos desde el backend
      fetch('https://backend-production-cbbe.up.railway.app/api/productos')
        .then(response => response.json())
        .then(products => {
          // Filtrar por categoría y disponibilidad
          const bebidas = products
            .filter(p => p.disponible && p.categoria === 'bebidas')
            .map(p => ({
              id: `extra-${p.id}`,
              nombre: p.nombre,
              precio: p.precio,
              imagen: p.imagen || '/images/menu/coca-cola.jpg'
            }));

          const adicionales = products
            .filter(p => p.disponible && p.categoria === 'adicionales')
            .map(p => ({
              id: `extra-${p.id}`,
              nombre: p.nombre,
              precio: p.precio,
              imagen: p.imagen || '/images/menu/papas.jpg'
            }));

          const cremas = products
            .filter(p => p.disponible && p.categoria === 'cremas')
            .map(p => ({
              id: `extra-${p.id}`,
              nombre: p.nombre,
              precio: p.precio,
              imagen: p.imagen || '/images/menu/mayonesa.jpg'
            }));

          setExtras({ bebidas, adicionales, cremas });
        })
        .catch(error => {
          console.error('Error al cargar extras:', error);
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Extras y Adicionales</h2>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="modal-body">
          {/* Bebidas */}
          <div className="extras-category">
            <h3 className="category-title">
              <i className="fas fa-glass-whiskey"></i> Bebidas
            </h3>
            <div className="extras-list">
              {extras.bebidas.map((extra) => (
                <div key={extra.id} className="extra-item">
                  <div className="extra-item-image">
                    <img 
                      src={extra.imagen} 
                      alt={extra.nombre}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/150/4a90e2/ffffff?text=Bebida';
                      }}
                    />
                  </div>
                  <div className="extra-item-info">
                    <div className="extra-item-name">{extra.nombre}</div>
                    <div className="extra-item-footer">
                      <span className="extra-item-price">S/ {extra.precio.toFixed(2)}</span>
                      <button 
                        className="extra-add-button"
                        onClick={() => onAddExtra(extra)}
                      >
                        <i className="fas fa-plus"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Adicionales */}
          <div className="extras-category">
            <h3 className="category-title">
              <i className="fas fa-utensils"></i> Adicionales
            </h3>
            <div className="extras-list">
              {extras.adicionales.map((extra) => (
                <div key={extra.id} className="extra-item">
                  <div className="extra-item-image">
                    <img 
                      src={extra.imagen} 
                      alt={extra.nombre}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/150/27ae60/ffffff?text=Adicional';
                      }}
                    />
                  </div>
                  <div className="extra-item-info">
                    <div className="extra-item-name">{extra.nombre}</div>
                    <div className="extra-item-footer">
                      <span className="extra-item-price">S/ {extra.precio.toFixed(2)}</span>
                      <button 
                        className="extra-add-button"
                        onClick={() => onAddExtra(extra)}
                      >
                        <i className="fas fa-plus"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cremas */}
          <div className="extras-category">
            <h3 className="category-title">
              <i className="fas fa-pepper-hot"></i> Cremas
            </h3>
            <div className="extras-list">
              {extras.cremas.map((extra) => (
                <div key={extra.id} className="extra-item">
                  <div className="extra-item-image">
                    <img 
                      src={extra.imagen} 
                      alt={extra.nombre}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/150/e74c3c/ffffff?text=Crema';
                      }}
                    />
                  </div>
                  <div className="extra-item-info">
                    <div className="extra-item-name">{extra.nombre}</div>
                    <div className="extra-item-footer">
                      <span className="extra-item-price">S/ {extra.precio.toFixed(2)}</span>
                      <button 
                        className="extra-add-button"
                        onClick={() => onAddExtra(extra)}
                      >
                        <i className="fas fa-plus"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="modal-done-btn" onClick={onClose}>
            <i className="fas fa-check"></i> Listo
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExtrasModal;
