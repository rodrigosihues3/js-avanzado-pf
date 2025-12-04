import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { pedidosAPI, usuariosAPI } from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ExtrasModal from '../components/ExtrasModal';
import Toast from '../components/Toast';
import PaymentModal from '../components/PaymentModal';
import InvoiceModal from '../components/InvoiceModal';
import './CartPage.css';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, updateComments, getCartTotal, addToCart, clearCart } = useCart();
  const [isExtrasModalOpen, setIsExtrasModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [toast, setToast] = useState(null);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');

  const handleAddExtra = (extra) => {
    addToCart(extra);
    setToast({
      message: `✓ ${extra.nombre} agregado al carrito`,
      type: 'success'
    });
  };

  // Calcular totales con descuento
  const subtotal = getCartTotal();
  
  const calculateDiscount = () => {
    if (!appliedPromo) return 0;

    const descuentoPorcentaje = parseFloat(appliedPromo.descuento) || 0;
    console.log('Promoción aplicada:', appliedPromo);
    console.log('Tipo:', appliedPromo.tipoPromocion);
    console.log('Descuento %:', descuentoPorcentaje);

    // Si es promoción general, aplica a todo el carrito
    if (appliedPromo.tipoPromocion === 'general') {
      const descuentoCalculado = (subtotal * descuentoPorcentaje) / 100;
      console.log('Descuento general:', descuentoCalculado);
      return descuentoCalculado;
    }

    // Si es promoción de producto específico, solo aplica a esos productos
    if (appliedPromo.tipoPromocion === 'producto' && appliedPromo.productosAplicables) {
      console.log('Productos aplicables:', appliedPromo.productosAplicables);
      console.log('Items en carrito:', cartItems.map(i => ({ id: i.id, nombre: i.nombre, precio: i.precio, quantity: i.quantity, cantidad: i.cantidad })));
      
      const applicableItems = cartItems.filter(item => 
        appliedPromo.productosAplicables.includes(item.id)
      );
      
      console.log('Items que califican:', applicableItems);
      
      const applicableSubtotal = applicableItems.reduce((sum, item) => {
        const precio = parseFloat(item.precio) || 0;
        const cantidad = parseInt(item.quantity || item.cantidad) || 0;
        console.log(`Item: ${item.nombre}, Precio: ${precio}, Cantidad: ${cantidad}, Subtotal: ${precio * cantidad}`);
        return sum + (precio * cantidad);
      }, 0);
      
      console.log('Subtotal aplicable:', applicableSubtotal);
      
      const descuentoCalculado = (applicableSubtotal * descuentoPorcentaje) / 100;
      console.log('Descuento calculado:', descuentoCalculado);
      
      return descuentoCalculado;
    }

    return 0;
  };

  const discount = calculateDiscount() || 0;
  const total = (subtotal - discount) || subtotal;

  // Aplicar código promocional
  const handleApplyPromo = async () => {
    setPromoError('');
    
    if (!promoCode.trim()) {
      setPromoError('Por favor ingresa un código');
      return;
    }

    try {
      // Obtener promoción del backend por código
      const response = await fetch(`https://backend-production-cbbe.up.railway.app/api/promociones/codigo/${promoCode.toUpperCase()}`);
      
      if (!response.ok) {
        setPromoError('Código inválido');
        return;
      }

      const promo = await response.json();
      const today = new Date().toISOString().split('T')[0];
      
      // Formatear fechas si vienen como array
      const formatearFecha = (fecha) => {
        if (!fecha) return null;
        if (Array.isArray(fecha)) {
          return `${fecha[0]}-${String(fecha[1]).padStart(2, '0')}-${String(fecha[2]).padStart(2, '0')}`;
        }
        return fecha;
      };

      const fechaInicio = formatearFecha(promo.fechaInicio);
      const fechaFin = formatearFecha(promo.fechaFin);
      
      // Validar promoción
      if (!promo.activa) {
        setPromoError('Esta promoción no está activa');
        return;
      }

      if (fechaInicio > today) {
        setPromoError('Esta promoción aún no ha comenzado');
        return;
      }

      if (fechaFin < today) {
        setPromoError('Esta promoción ha expirado');
        return;
      }

      // Convertir productosAplicables de string a array si es necesario
      if (promo.productosAplicables && typeof promo.productosAplicables === 'string') {
        promo.productosAplicables = promo.productosAplicables.split(',').map(id => parseInt(id));
      }

      // Validar requisitos mínimos
      if (promo.montoMinimo && subtotal < promo.montoMinimo) {
        setPromoError(`Monto mínimo requerido: S/ ${promo.montoMinimo}`);
        return;
      }

      const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || item.cantidad || 0), 0);
      if (promo.cantidadMinima && totalItems < promo.cantidadMinima) {
        setPromoError(`Cantidad mínima requerida: ${promo.cantidadMinima} productos`);
        return;
      }

      // Si es promoción de producto específico, verificar que haya productos aplicables en el carrito
      if (promo.tipoPromocion === 'producto' && promo.productosAplicables) {
        const hasApplicableProducts = cartItems.some(item => 
          promo.productosAplicables.includes(item.id)
        );
        
        if (!hasApplicableProducts) {
          setPromoError('Esta promoción no aplica a los productos en tu carrito');
          return;
        }
      }

      setAppliedPromo(promo);
      setPromoCode('');
      setToast({
        message: `✓ Código ${promo.codigo} aplicado - ${promo.descuento}% de descuento`,
        type: 'success'
      });
    } catch (error) {
      console.error('Error aplicando promoción:', error);
      setPromoError('Código inválido');
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
    setPromoError('');
    setToast({
      message: 'Código promocional removido',
      type: 'info'
    });
  };



  // Verificar si el usuario está activo
  const checkUserStatus = () => {
    const userData = localStorage.getItem('user');
    if (!userData) return { isActive: true, message: '' }; // Invitados pueden comprar
    
    const user = JSON.parse(userData);
    const savedUsers = localStorage.getItem('adminUsers');
    
    if (savedUsers) {
      const users = JSON.parse(savedUsers);
      const userAccount = users.find(u => u.email === user.email);
      
      if (userAccount && !userAccount.activo) {
        return { 
          isActive: false, 
          message: 'Tu cuenta ha sido desactivada. Contacta con el administrador para más información.' 
        };
      }
    }
    
    return { isActive: true, message: '' };
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    
    // Verificar estado del usuario
    const userStatus = checkUserStatus();
    if (!userStatus.isActive) {
      setToast({
        message: `❌ ${userStatus.message}`,
        type: 'error'
      });
      return;
    }
    
    setIsPaymentModalOpen(true);
  };

  const handlePaymentConfirm = async (paymentData) => {
    // Verificar nuevamente el estado del usuario antes de procesar el pago
    const userStatus = checkUserStatus();
    if (!userStatus.isActive) {
      setIsPaymentModalOpen(false);
      setToast({
        message: `❌ ${userStatus.message}`,
        type: 'error'
      });
      return;
    }
    
    const now = new Date();
    const invoiceNumber = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
    
    const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;
    
    // Usar el nombre del formulario de pago si está disponible, sino el del usuario
    const nombreCliente = paymentData.holderName || (user ? user.nombre : 'Cliente Invitado');
    const telefonoCliente = paymentData.phone || (user ? user.telefono : null);
    
    try {
      // Guardar pedido en MySQL
      const pedidoData = {
        cliente: nombreCliente,
        nombreCliente: nombreCliente,
        email: user ? user.email : null,
        telefono: telefonoCliente,
        numeroFactura: invoiceNumber,
        fecha: now.toISOString().split('T')[0],
        hora: now.toLocaleTimeString('es-PE', { hour12: false }),
        subtotal: subtotal,
        descuento: discount,
        codigoPromo: appliedPromo ? appliedPromo.codigo : null,
        total: total,
        estado: 'pendiente',
        metodoPago: paymentData.method,
        detalles: JSON.stringify(cartItems),
        items: cartItems.map(item => ({
          nombre: item.nombre,
          cantidad: item.cantidad,
          precio: item.precio
        }))
      };

      await pedidosAPI.crear(pedidoData);

      // Actualizar contador de pedidos del usuario si está logueado
      if (user && user.id) {
        try {
          const usuarioActual = await usuariosAPI.obtenerPorId(user.id);
          await usuariosAPI.actualizar(user.id, {
            ...usuarioActual.data,
            pedidos: (usuarioActual.data.pedidos || 0) + 1
          });
        } catch (error) {
          console.error('Error actualizando contador de pedidos:', error);
        }
      }

      // Datos para mostrar en la factura
      const order = {
        invoiceNumber,
        date: now.toLocaleDateString('es-PE'),
        time: now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
        paymentMethod: paymentData.method,
        customerName: nombreCliente,
        customerPhone: telefonoCliente,
        items: cartItems,
        subtotal: subtotal,
        descuento: discount,
        codigoPromo: appliedPromo ? appliedPromo.codigo : null,
        total: total
      };

      setOrderData(order);
      setIsPaymentModalOpen(false);
      setIsInvoiceModalOpen(true);
      clearCart();
      
      setToast({
        message: '✅ Pedido realizado exitosamente',
        type: 'success'
      });
    } catch (error) {
      console.error('Error guardando pedido:', error);
      setToast({
        message: '❌ Error al procesar el pedido',
        type: 'error'
      });
    }
  };

  return (
    <div className="cart-page">
      <Header />
      
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <ExtrasModal
        isOpen={isExtrasModalOpen}
        onClose={() => setIsExtrasModalOpen(false)}
        onAddExtra={handleAddExtra}
      />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onConfirm={handlePaymentConfirm}
        total={total}
      />

      <InvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        orderData={orderData}
      />
      
      <div className="cart-container">
        <div className="container">
          <h1 className="cart-title">Mi carrito</h1>

          <div className="cart-content">
            <div className="cart-items-section">
              <div className="cart-table-header">
                <div className="header-product">Producto</div>
                <div className="header-price">Precio</div>
                <div className="header-subtotal">Subtotal</div>
              </div>

              {cartItems.length === 0 ? (
                <div className="empty-cart">
                  <i className="fas fa-shopping-cart"></i>
                  <h3>Tu carrito está vacío</h3>
                  <p>Agrega productos desde el menú</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="cart-item-wrapper">
                    <div className="cart-item">
                      <div className="item-product">
                        <img src={item.imagen} alt={item.nombre} />
                        <span>{item.nombre}</span>
                      </div>

                      <div className="item-price">
                        <span>S/ {item.precio.toFixed(2)}</span>
                      </div>

                      <div className="item-quantity">
                        <button 
                          className="quantity-btn"
                          onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                        >
                          −
                        </button>
                        <span className="quantity">{item.cantidad}</span>
                        <button 
                          className="quantity-btn"
                          onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                        >
                          +
                        </button>
                      </div>

                      <div className="item-subtotal">
                        <span>S/ {(item.precio * item.cantidad).toFixed(2)}</span>
                      </div>

                      <div className="item-actions">
                        <button 
                          className="action-btn" 
                          onClick={() => removeFromCart(item.id)}
                          title="Eliminar"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                    
                    {/* Solo mostrar comentarios para platos principales, no para extras */}
                    {!item.id.toString().startsWith('extra-') && (
                      <div className="item-comments">
                        <i className="fas fa-comment-dots"></i>
                        <input
                          type="text"
                          placeholder="Comentarios (ej: sin cebolla, sin ají, etc.)"
                          value={item.comentarios || ''}
                          onChange={(e) => updateComments(item.id, e.target.value)}
                          className="comments-input"
                        />
                      </div>
                    )}
                  </div>
                ))
              )}

              {/* Botón de Agregar Extras */}
              {cartItems.length > 0 && (
                <div className="add-extras-section">
                  <h3 className="extras-title">
                    <i className="fas fa-plus-circle"></i> Extras y Adicionales
                  </h3>
                  <p className="extras-description">
                    ¿Quieres agregar bebidas, cremas o adicionales a tu pedido?
                  </p>
                  <button 
                    className="add-extras-btn"
                    onClick={() => setIsExtrasModalOpen(true)}
                  >
                    <i className="fas fa-plus"></i> Agregar extras
                  </button>
                </div>
              )}
            </div>

            <div className="cart-summary">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>S/ {subtotal.toFixed(2)}</span>
              </div>

              {/* Sección de Código Promocional */}
              <div className="promo-section">
                <h4>¿Tienes un código promocional?</h4>
                {!appliedPromo ? (
                  <div className="promo-input-group">
                    <input
                      type="text"
                      placeholder="Ingresa tu código"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      className="promo-input"
                    />
                    <button onClick={handleApplyPromo} className="apply-promo-btn">
                      Aplicar
                    </button>
                  </div>
                ) : (
                  <div className="applied-promo">
                    <div className="promo-info">
                      <i className="fas fa-tag"></i>
                      <span>{appliedPromo.codigo} - {appliedPromo.descuento}% OFF</span>
                    </div>
                    <button onClick={handleRemovePromo} className="remove-promo-btn">
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                )}
                {promoError && <p className="promo-error">{promoError}</p>}
              </div>

              {appliedPromo && (
                <div className="summary-row discount-row">
                  <span>Descuento ({appliedPromo.descuento}%)</span>
                  <span className="discount-amount">- S/ {discount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="summary-row total-row">
                <span>Total Pedido</span>
                <span>S/ {total.toFixed(2)}</span>
              </div>

              <button 
                className="checkout-btn" 
                disabled={cartItems.length === 0}
                onClick={handleCheckout}
              >
                FINALIZAR COMPRA
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CartPage;