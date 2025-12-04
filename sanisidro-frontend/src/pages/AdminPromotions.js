import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { promocionesAPI, productosAPI } from '../services/api';
import './AdminPromotions.css';

const AdminPromotions = () => {
  const navigate = useNavigate();
  const [promotions, setPromotions] = useState([]);
  const [, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    descuento: '',
    codigo: '',
    fechaInicio: '',
    fechaFin: '',
    activa: true,
    imagen: null,
    tipoPromocion: 'general',
    productosAplicables: [],
    cantidadMinima: 1,
    montoMinimo: 0
  });
  const [availableProducts, setAvailableProducts] = useState([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      console.log('🔄 Cargando promociones y productos...');
      const [promosResponse, productsResponse] = await Promise.all([
        promocionesAPI.obtenerTodas(),
        productosAPI.obtenerTodos()
      ]);
      
      console.log('📥 Promociones recibidas del backend:', promosResponse.data);
      console.log('📊 Total de promociones:', promosResponse.data.length);
      
      // Convertir productosAplicables de string a array
      const promosConvertidas = promosResponse.data.map(promo => ({
        ...promo,
        id: promo.id, // Asegurar que el ID esté presente
        productosAplicables: promo.productosAplicables 
          ? promo.productosAplicables.split(',').map(id => parseInt(id))
          : []
      }));
      
      console.log('✅ Promociones procesadas:', promosConvertidas);
      setPromotions(promosConvertidas);
      setAvailableProducts(productsResponse.data);
    } catch (error) {
      console.error('❌ Error cargando datos:', error);
      alert('Error al cargar datos');
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

  const handleProductSelection = (productId) => {
    setFormData(prev => {
      const isSelected = prev.productosAplicables.includes(productId);
      return {
        ...prev,
        productosAplicables: isSelected
          ? prev.productosAplicables.filter(id => id !== productId)
          : [...prev.productosAplicables, productId]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar campos requeridos
    if (!formData.codigo || !formData.titulo || !formData.descripcion || !formData.descuento) {
      alert('❌ Por favor completa todos los campos requeridos');
      return;
    }

    if (!formData.fechaInicio || !formData.fechaFin) {
      alert('❌ Por favor selecciona las fechas de inicio y fin');
      return;
    }
    
    try {
      const promocionData = {
        codigo: formData.codigo.toUpperCase(),
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        descuento: parseFloat(formData.descuento),
        tipoPromocion: formData.tipoPromocion || 'general',
        productosAplicables: formData.productosAplicables && formData.productosAplicables.length > 0 
          ? formData.productosAplicables.join(',') 
          : null,
        montoMinimo: parseFloat(formData.montoMinimo) || 0.0,
        cantidadMinima: parseInt(formData.cantidadMinima) || 0,
        fechaInicio: formData.fechaInicio,
        fechaFin: formData.fechaFin,
        activa: formData.activa !== false,
        imagen: formData.imagen || null
      };

      console.log('📤 Enviando promoción al backend:', JSON.stringify(promocionData, null, 2));

      let response;
      if (editingPromotion) {
        console.log('🔄 Actualizando promoción ID:', editingPromotion.id);
        response = await promocionesAPI.actualizar(editingPromotion.id, promocionData);
        console.log('✅ Respuesta del backend (actualizar):', response.data);
      } else {
        console.log('➕ Creando nueva promoción');
        response = await promocionesAPI.crear(promocionData);
        console.log('✅ Respuesta del backend (crear):', response.data);
      }
      
      console.log('🔄 Recargando lista de promociones...');
      await cargarDatos();
      console.log('✅ Lista de promociones recargada');
      
      closeModal();
      alert(editingPromotion ? '✅ Promoción actualizada exitosamente' : '✅ Promoción creada exitosamente');
    } catch (error) {
      console.error('❌ Error guardando promoción:', error);
      console.error('📋 Detalles del error:', error.response?.data);
      console.error('📋 Mensaje de error:', JSON.stringify(error.response?.data, null, 2));
      console.error('📋 Status:', error.response?.status);
      console.error('📋 Headers:', error.response?.headers);
      
      let errorMessage = 'Error desconocido';
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        } else {
          errorMessage = JSON.stringify(error.response.data);
        }
      } else {
        errorMessage = error.message;
      }
      
      alert('❌ Error al guardar promoción: ' + errorMessage);
    }
  };

  const openModal = (promotion = null) => {
    if (promotion) {
      setEditingPromotion(promotion);
      setFormData(promotion);
    } else {
      setEditingPromotion(null);
      setFormData({
        titulo: '',
        descripcion: '',
        descuento: '',
        codigo: '',
        fechaInicio: '',
        fechaFin: '',
        activa: true,
        imagen: '',
        tipoPromocion: 'general',
        productosAplicables: [],
        cantidadMinima: 1,
        montoMinimo: 0
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPromotion(null);
  };

  const handleDelete = async (promotionId) => {
    if (window.confirm('¿Estás seguro de eliminar esta promoción?')) {
      try {
        await promocionesAPI.eliminar(promotionId);
        alert('✅ Promoción eliminada exitosamente');
        await cargarDatos();
      } catch (error) {
        console.error('Error eliminando promoción:', error);
        alert('❌ Error al eliminar promoción');
      }
    }
  };

  const toggleActive = async (promotion) => {
    try {
      // Convertir fechas a formato YYYY-MM-DD si vienen como array
      const formatearFecha = (fecha) => {
        if (!fecha) return null;
        if (Array.isArray(fecha)) {
          // Si es array [2025, 10, 27], convertir a "2025-10-27"
          return `${fecha[0]}-${String(fecha[1]).padStart(2, '0')}-${String(fecha[2]).padStart(2, '0')}`;
        }
        return fecha;
      };

      const promocionData = {
        codigo: promotion.codigo,
        descripcion: promotion.descripcion,
        descuento: parseFloat(promotion.descuento),
        tipoPromocion: promotion.tipoPromocion || 'general',
        productosAplicables: promotion.productosAplicables && promotion.productosAplicables.length > 0
          ? (Array.isArray(promotion.productosAplicables) 
              ? promotion.productosAplicables.join(',') 
              : promotion.productosAplicables)
          : null,
        montoMinimo: parseFloat(promotion.montoMinimo) || 0.0,
        cantidadMinima: parseInt(promotion.cantidadMinima) || 0,
        fechaInicio: formatearFecha(promotion.fechaInicio),
        fechaFin: formatearFecha(promotion.fechaFin),
        activa: !promotion.activa
      };
      
      console.log('Actualizando promoción:', promocionData);
      await promocionesAPI.actualizar(promotion.id, promocionData);
      alert(`✅ Promoción ${!promotion.activa ? 'activada' : 'desactivada'} exitosamente`);
      await cargarDatos();
    } catch (error) {
      console.error('Error actualizando promoción:', error);
      console.error('Detalles:', error.response?.data);
      alert('❌ Error al actualizar promoción: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="admin-promotions">
      <div className="admin-header">
        <div className="header-left">
          <button onClick={() => navigate('/admin/dashboard')} className="back-btn">
            <i className="fas fa-arrow-left"></i> Dashboard
          </button>
          <button onClick={() => navigate('/')} className="home-btn-header">
            <i className="fas fa-home"></i> Inicio
          </button>
        </div>
        <h1>Gestión de Promociones</h1>
        <div className="header-right">
          <button onClick={() => openModal()} className="add-btn">
            <i className="fas fa-plus"></i> Agregar Promoción
          </button>
        </div>
      </div>

      <div className="promotions-container">
        <div className="promotions-grid">
          {promotions.map(promotion => (
            <div key={promotion.id} className={`promotion-card ${!promotion.activa ? 'inactive' : ''}`}>
              <div className="promotion-header">
                <h3>{promotion.titulo}</h3>
                <span className={`status-badge ${promotion.activa ? 'active' : 'inactive'}`}>
                  {promotion.activa ? 'Activa' : 'Inactiva'}
                </span>
              </div>
              <p className="promotion-description">{promotion.descripcion}</p>
              <div className="promotion-details">
                <div className="detail-item">
                  <i className="fas fa-percentage"></i>
                  <span>{promotion.descuento}% de descuento</span>
                </div>
                <div className="detail-item">
                  <i className="fas fa-tag"></i>
                  <span>Código: {promotion.codigo}</span>
                </div>
                <div className="detail-item">
                  <i className="fas fa-calendar"></i>
                  <span>{promotion.fechaInicio} - {promotion.fechaFin}</span>
                </div>
                {promotion.tipoPromocion === 'producto' && (
                  <div className="detail-item">
                    <i className="fas fa-utensils"></i>
                    <span>Productos específicos ({promotion.productosAplicables?.length || 0})</span>
                  </div>
                )}
                {promotion.cantidadMinima > 1 && (
                  <div className="detail-item">
                    <i className="fas fa-shopping-cart"></i>
                    <span>Mín. {promotion.cantidadMinima} unidades</span>
                  </div>
                )}
                {promotion.montoMinimo > 0 && (
                  <div className="detail-item">
                    <i className="fas fa-dollar-sign"></i>
                    <span>Mín. S/ {(parseFloat(promotion.montoMinimo) || 0).toFixed(2)}</span>
                  </div>
                )}
              </div>
              <div className="promotion-actions">
                <button onClick={() => toggleActive(promotion)} className="toggle-btn">
                  <i className={`fas ${promotion.activa ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
                <button onClick={() => openModal(promotion)} className="edit-btn">
                  <i className="fas fa-edit"></i>
                </button>
                <button onClick={() => handleDelete(promotion.id)} className="delete-btn">
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingPromotion ? 'Editar Promoción' : 'Agregar Promoción'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Título de la Promoción</label>
                <input
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleInputChange}
                  placeholder="Ej: 2x1 en chicharrón"
                  required
                />
              </div>
              <div className="form-group">
                <label>Descripción de la Promoción</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Ej: Compra un chicharrón clásico y lleva otro gratis"
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Descuento (%)</label>
                  <input
                    type="number"
                    name="descuento"
                    value={formData.descuento}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Código Promocional</label>
                  <input
                    type="text"
                    name="codigo"
                    value={formData.codigo}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Fecha Inicio</label>
                  <input
                    type="date"
                    name="fechaInicio"
                    value={formData.fechaInicio}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Fecha Fin</label>
                  <input
                    type="date"
                    name="fechaFin"
                    value={formData.fechaFin}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Imagen de la Promoción</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      // Verificar tamaño (máximo 2MB)
                      if (file.size > 2000000) {
                        alert('⚠️ La imagen es muy grande. Por favor usa una imagen menor a 2MB');
                        return;
                      }
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setFormData(prev => ({
                          ...prev,
                          imagen: reader.result
                        }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  style={{padding: '0.5rem', border: '2px dashed #4a90e2', borderRadius: '8px', cursor: 'pointer'}}
                />
                <small style={{color: '#666', marginTop: '0.5rem', display: 'block'}}>
                  Selecciona una imagen de tu computadora (máximo 2MB)
                </small>
                {formData.imagen && (
                  <div className="image-preview">
                    <p>Vista previa:</p>
                    <img 
                      src={formData.imagen} 
                      alt="Preview" 
                      style={{maxWidth: '200px', maxHeight: '200px', borderRadius: '8px', objectFit: 'cover'}}
                    />
                  </div>
                )}
              </div>

              {/* Tipo de Promoción */}
              <div className="form-group">
                <label>Tipo de Promoción</label>
                <select
                  name="tipoPromocion"
                  value={formData.tipoPromocion}
                  onChange={handleInputChange}
                >
                  <option value="general">General (Aplica a cualquier pedido)</option>
                  <option value="producto">Producto Específico</option>
                </select>
              </div>

              {/* Productos Aplicables */}
              {formData.tipoPromocion === 'producto' && (
                <div className="form-group">
                  <label>Productos Aplicables (selecciona uno o más)</label>
                  <div className="products-selection">
                    {availableProducts.length === 0 ? (
                      <p className="no-products-message">
                        No hay productos disponibles. Por favor, agrega productos desde "Gestionar Menú" primero.
                      </p>
                    ) : (
                      availableProducts
                        .filter(p => p.categoria === 'platos' || p.categoria === 'entradas')
                        .map(product => (
                          <label key={product.id} className="product-checkbox">
                            <input
                              type="checkbox"
                              checked={formData.productosAplicables.includes(product.id)}
                              onChange={() => handleProductSelection(product.id)}
                            />
                            <span>{product.nombre}</span>
                          </label>
                        ))
                    )}
                    {availableProducts.length > 0 && 
                     availableProducts.filter(p => p.categoria === 'platos' || p.categoria === 'entradas').length === 0 && (
                      <p className="no-products-message">
                        No hay platos disponibles. Los productos deben tener categoría "platos" o "entradas".
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Requisitos */}
              <div className="form-row">
                <div className="form-group">
                  <label>Cantidad Mínima</label>
                  <input
                    type="number"
                    name="cantidadMinima"
                    value={formData.cantidadMinima}
                    onChange={handleInputChange}
                    min="1"
                  />
                  <small>Cantidad mínima de productos para aplicar la promoción</small>
                </div>
                <div className="form-group">
                  <label>Monto Mínimo (S/)</label>
                  <input
                    type="number"
                    name="montoMinimo"
                    value={formData.montoMinimo}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                  />
                  <small>Monto mínimo de compra para aplicar la promoción</small>
                </div>
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="activa"
                    checked={formData.activa}
                    onChange={handleInputChange}
                  />
                  Promoción activa
                </label>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={closeModal} className="cancel-btn">
                  Cancelar
                </button>
                <button type="submit" className="submit-btn">
                  {editingPromotion ? 'Actualizar' : 'Agregar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPromotions;
