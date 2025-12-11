import React, { useState, useEffect } from 'react';
import { productosAPI } from '../services/api'; // <--- IMPORTANTE: Usamos tu servicio centralizado
import './ExtrasModal.css';

const ExtrasModal = ({ isOpen, onClose, onAddExtra }) => {
  const [extras, setExtras] = useState({
    bebidas: [],
    entradas: [], // Usaremos Entradas como "Piqueos"
    postres: []   // Usaremos Postres en vez de Cremas
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      cargarExtras();
    }
  }, [isOpen]);

  const cargarExtras = async () => {
    setLoading(true);
    try {
      // Usamos la API para traer todos los productos
      // Asumo que tu API tiene un método obtenerTodos, si no, usa el endpoint base
      const response = await productosAPI.obtenerTodos();
      const products = response.data;

      // 1. Filtrar BEBIDAS (Categoría Real: 'Bebidas')
      const bebidas = products
        .filter(p => p.disponible && p.categoria === 'Bebidas')
        .map(p => ({
          id: p.id, // Mantenemos el ID original para que coincida con el carrito
          nombre: p.nombre,
          precio: p.precio,
          imagen: p.imagen || '/images/menu/bebida-default.jpg',
          categoria: 'Bebidas'
        }));

      // 2. Filtrar ENTRADAS (Categoría Real: 'Entradas' -> Para la sección "Piqueos")
      const entradas = products
        .filter(p => p.disponible && p.categoria === 'Entradas')
        .map(p => ({
          id: p.id,
          nombre: p.nombre,
          precio: p.precio,
          imagen: p.imagen || '/images/menu/entrada-default.jpg',
          categoria: 'Entradas'
        }));

      // 3. Filtrar POSTRES (Categoría Real: 'Postres')
      const postres = products
        .filter(p => p.disponible && p.categoria === 'Postres')
        .map(p => ({
          id: p.id,
          nombre: p.nombre,
          precio: p.precio,
          imagen: p.imagen || '/images/menu/postre-default.jpg',
          categoria: 'Postres'
        }));

      setExtras({ bebidas, entradas, postres });

    } catch (error) {
      console.error('Error al cargar extras:', error);
    } finally {
      setLoading(false);
    }
  };

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
          <h2>Complementa tu pedido</h2>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="modal-body">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>Cargando opciones...</div>
          ) : (
            <>
              {/* SECCIÓN 1: BEBIDAS */}
              {extras.bebidas.length > 0 && (
                <div className="extras-category">
                  <h3 className="category-title">
                    <i className="fas fa-glass-whiskey"></i> Bebidas
                  </h3>
                  <div className="extras-list">
                    {extras.bebidas.map((item) => (
                      <ExtraCard key={item.id} item={item} onAdd={onAddExtra} color="#4a90e2" />
                    ))}
                  </div>
                </div>
              )}

              {/* SECCIÓN 2: PIQUEOS / ENTRADAS */}
              {extras.entradas.length > 0 && (
                <div className="extras-category">
                  <h3 className="category-title">
                    <i className="fas fa-utensils"></i> Entradas y Piqueos
                  </h3>
                  <div className="extras-list">
                    {extras.entradas.map((item) => (
                      <ExtraCard key={item.id} item={item} onAdd={onAddExtra} color="#e67e22" />
                    ))}
                  </div>
                </div>
              )}

              {/* SECCIÓN 3: POSTRES */}
              {extras.postres.length > 0 && (
                <div className="extras-category">
                  <h3 className="category-title">
                    <i className="fas fa-cookie-bite"></i> Postres
                  </h3>
                  <div className="extras-list">
                    {extras.postres.map((item) => (
                      <ExtraCard key={item.id} item={item} onAdd={onAddExtra} color="#e91e63" />
                    ))}
                  </div>
                </div>
              )}

              {/* Mensaje si no hay nada */}
              {extras.bebidas.length === 0 && extras.entradas.length === 0 && extras.postres.length === 0 && (
                <p style={{ textAlign: 'center', color: '#666' }}>No hay extras disponibles por el momento.</p>
              )}
            </>
          )}
        </div>

        <div className="modal-footer">
          <button className="modal-done-btn" onClick={onClose}>
            <i className="fas fa-check"></i> Listo, volver al carrito
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente auxiliar para no repetir código HTML de las tarjetas
const ExtraCard = ({ item, onAdd, color }) => (
  <div className="extra-item">
    <div className="extra-item-image">
      <img
        src={item.imagen}
        alt={item.nombre}
        onError={(e) => { e.target.src = 'https://placehold.co/150x150?text=Foto'; }}
      />
    </div>
    <div className="extra-item-info">
      <div className="extra-item-name">{item.nombre}</div>
      <div className="extra-item-footer">
        <span className="extra-item-price">S/ {item.precio.toFixed(2)}</span>
        <button
          className="extra-add-button"
          onClick={() => onAdd(item)}
          style={{ backgroundColor: color }}
        >
          <i className="fas fa-plus"></i>
        </button>
      </div>
    </div>
  </div>
);

export default ExtrasModal;