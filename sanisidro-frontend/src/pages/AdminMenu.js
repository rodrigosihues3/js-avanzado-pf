import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productosAPI } from '../services/api';
import './AdminMenu.css';

const AdminMenu = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: 'platos',
    disponible: true,
    imagen: ''
  });

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      const response = await productosAPI.obtenerTodos();
      setProducts(response.data);
    } catch (error) {
      console.error('Error cargando productos:', error);
      alert('Error al cargar productos. Verifica que el backend esté corriendo.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const productoData = {
        ...formData,
        precio: parseFloat(formData.precio)
      };

      if (editingProduct) {
        // Actualizar producto existente
        await productosAPI.actualizar(editingProduct.id, productoData);
        alert('✅ Producto actualizado exitosamente');
      } else {
        // Crear nuevo producto
        await productosAPI.crear(productoData);
        alert('✅ Producto creado exitosamente');
      }
      
      cargarProductos();
      closeModal();
    } catch (error) {
      console.error('Error guardando producto:', error);
      alert('❌ Error al guardar producto: ' + (error.response?.data?.message || error.message));
    }
  };

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({
        nombre: '',
        descripcion: '',
        precio: '',
        categoria: 'platos',
        disponible: true,
        imagen: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await productosAPI.eliminar(productId);
        alert('✅ Producto eliminado exitosamente');
        cargarProductos();
      } catch (error) {
        console.error('Error eliminando producto:', error);
        alert('❌ Error al eliminar producto');
      }
    }
  };

  const toggleAvailability = async (product) => {
    try {
      await productosAPI.actualizar(product.id, {
        ...product,
        disponible: !product.disponible
      });
      cargarProductos();
    } catch (error) {
      console.error('Error actualizando disponibilidad:', error);
      alert('❌ Error al actualizar disponibilidad');
    }
  };

  if (loading) {
    return (
      <div className="admin-menu">
        <div className="loading">Cargando productos...</div>
      </div>
    );
  }

  return (
    <div className="admin-menu">
      <div className="admin-header">
        <div className="header-left">
          <button onClick={() => navigate('/admin/dashboard')} className="back-btn">
            <i className="fas fa-arrow-left"></i> Dashboard
          </button>
          <button onClick={() => navigate('/')} className="home-btn-header">
            <i className="fas fa-home"></i> Inicio
          </button>
        </div>
        <h1>Gestión de Menú</h1>
        <div className="header-right">
          <button onClick={() => openModal()} className="add-btn">
            <i className="fas fa-plus"></i> Agregar Producto
          </button>
        </div>
      </div>

      <div className="menu-container">
        {products.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-utensils"></i>
            <h3>No hay productos</h3>
            <p>Agrega tu primer producto al menú</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map(product => (
              <div key={product.id} className={`product-card ${!product.disponible ? 'unavailable' : ''}`}>
                <div className="product-header">
                  <h3>{product.nombre}</h3>
                  <span className={`availability-badge ${product.disponible ? 'available' : 'unavailable'}`}>
                    {product.disponible ? 'Disponible' : 'No disponible'}
                  </span>
                </div>
                <p className="product-description">{product.descripcion}</p>
                <div className="product-footer">
                  <span className="product-price">S/ {product.precio.toFixed(2)}</span>
                  <span className="product-category">{product.categoria}</span>
                </div>
                <div className="product-actions">
                  <button onClick={() => toggleAvailability(product)} className="toggle-btn">
                    <i className={`fas ${product.disponible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                  <button onClick={() => openModal(product)} className="edit-btn">
                    <i className="fas fa-edit"></i>
                  </button>
                  <button onClick={() => handleDelete(product.id)} className="delete-btn">
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal para agregar/editar producto */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingProduct ? 'Editar Producto' : 'Agregar Producto'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre del Producto</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  rows="3"
                  required
                />
              </div>
              <div className="form-group">
                <label>URL de Imagen</label>
                <input
                  type="text"
                  name="imagen"
                  value={formData.imagen}
                  onChange={handleInputChange}
                  placeholder="/images/menu/nombre-imagen.jpg"
                />
                <small style={{ color: '#6c757d', fontSize: '0.85rem', marginTop: '0.5rem', display: 'block' }}>
                  Ejemplo: /images/menu/chicharron-aji.jpg
                </small>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Precio (S/)</label>
                  <input
                    type="number"
                    name="precio"
                    value={formData.precio}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Categoría</label>
                  <select
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleInputChange}
                  >
                    <option value="platos">Platos</option>
                    <option value="entradas">Entradas</option>
                    <option value="bebidas">Bebidas</option>
                    <option value="adicionales">Adicionales</option>
                    <option value="cremas">Cremas y Salsas</option>
                    <option value="postres">Postres</option>
                  </select>
                </div>
              </div>
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="disponible"
                    checked={formData.disponible}
                    onChange={handleInputChange}
                  />
                  Producto disponible
                </label>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={closeModal} className="cancel-btn">
                  Cancelar
                </button>
                <button type="submit" className="submit-btn">
                  {editingProduct ? 'Actualizar' : 'Agregar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMenu;
