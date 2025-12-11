import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { productosAPI } from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import './MenuPage.css';

const MenuPage = () => {
  const { addToCart } = useCart();
  const [toast, setToast] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      const response = await productosAPI.obtenerPorCategoria("Fondos");
      // Filtrar solo platos disponibles
      const availablePlatos = response.data
        .filter(p => p.disponible)
        .map(p => ({
          id: p.id,
          nombre: p.nombre,
          descripcion: p.descripcion,
          precio: p.precio,
          imagen: p.imagen || '/images/menu/chicharron-aji.jpg'
        }));
      setMenuItems(availablePlatos);
    } catch (error) {
      console.error('Error cargando productos:', error);
      setToast({
        message: '❌ Error al cargar el menú',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item) => {
    addToCart(item);
    setToast({
      message: `✓ ${item.nombre} agregado al carrito`,
      type: 'success'
    });
  };

  if (loading) {
    return (
      <div className="menu-page">
        <Header />
        <div className="menu-container">
          <div className="container">
            <div className="loading">Cargando menú...</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="menu-page">
      <Header />
      
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="menu-container">
        <div className="container">
          <h1 className="menu-title">Carta de Comidas</h1>
          
          <div className="menu-grid">
            {menuItems.map((item) => (
              <div key={item.id} className="menu-card">
                <div className="card-left">
                  <h3 className="card-title">{item.nombre}</h3>
                  <p className="card-description">{item.descripcion}</p>
                  <div className="card-footer">
                    <span className="card-price">S/ {item.precio.toFixed(2)}</span>
                    <button 
                      className="add-to-cart-btn"
                      onClick={() => handleAddToCart(item)}
                    >
                      <i className="fas fa-shopping-cart"></i>
                      Añadir al carrito
                    </button>
                  </div>
                </div>
                <div className="card-right">
                  <img src={item.imagen} alt={item.nombre} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MenuPage;