import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { pedidosAPI, usuariosAPI, promocionesAPI } from '../services/api';
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
    // 1. Si no hay promo aplicada, descuento es 0
    if (!appliedPromo) return 0;

    // 2. Normalizar el porcentaje de descuento (asegurar que sea número)
    const descuentoPorcentaje = Number(appliedPromo.descuento) || 0;

    // Debug para ver qué está llegando
    console.log('--- CALCULANDO DESCUENTO ---');
    console.log('Promo:', appliedPromo.codigo);
    console.log('Porcentaje:', descuentoPorcentaje);
    console.log('Tipo:', appliedPromo.tipoPromocion);

    // 3. CASO: Promoción General (Aplica a todo el subtotal)
    if (appliedPromo.tipoPromocion === 'general' || appliedPromo.tipoPromocion === 'porcentaje') {
      const descuentoCalculado = (subtotal * descuentoPorcentaje) / 100;
      return descuentoCalculado;
    }

    // 4. CASO: Monto Fijo (Descuento directo en dinero, ej: S/ 20.00)
    // Agrego este caso por si tu promo es de tipo 'monto_fijo' como vi en tu SQL
    if (appliedPromo.tipoPromocion === 'monto_fijo') {
      return descuentoPorcentaje; // En este caso el "porcentaje" es el monto real
    }

    // 5. CASO: Producto Específico
    if (appliedPromo.tipoPromocion === 'producto' && appliedPromo.productosAplicables) {
      // Normalizar la lista de IDs permitidos a números
      const idsValidos = Array.isArray(appliedPromo.productosAplicables)
        ? appliedPromo.productosAplicables
        : String(appliedPromo.productosAplicables).split(',').map(Number);

      // Filtrar items del carrito que coincidan
      const applicableItems = cartItems.filter(item =>
        idsValidos.includes(Number(item.id))
      );

      // Calcular subtotal solo de esos items
      const applicableSubtotal = applicableItems.reduce((sum, item) => {
        const precio = Number(item.precio) || 0;
        // Unificar propiedad de cantidad (quantity vs cantidad)
        const cantidad = Number(item.quantity || item.cantidad) || 0;
        return sum + (precio * cantidad);
      }, 0);

      const descuentoCalculado = (applicableSubtotal * descuentoPorcentaje) / 100;
      return descuentoCalculado;
    }

    return 0;
  };

  const discount = calculateDiscount() || 0;
  const total = (subtotal - discount) || subtotal;

  // Aplicar código promocional
  // Aplicar código promocional
  const handleApplyPromo = async () => {
    setPromoError('');

    if (!promoCode.trim()) {
      setPromoError('Por favor ingresa un código');
      return;
    }

    try {
      // CORRECCIÓN: Usamos el nombre exacto que está en tu api.js
      const response = await promocionesAPI.obtenerPorCodigo(promoCode.toUpperCase());

      // Axios devuelve la data dentro de .data
      const promo = response.data;

      // Validar si la respuesta vino vacía (algunos backends devuelven 200 OK pero body vacío si no encuentran)
      if (!promo || !promo.codigo) {
        setPromoError('Código no encontrado');
        return;
      }

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

      // Convertir productosAplicables de string a array
      if (promo.productosAplicables && typeof promo.productosAplicables === 'string') {
        promo.productosAplicables = promo.productosAplicables.split(',').map(id => parseInt(id));
      }

      // Validar monto mínimo
      if (promo.montoMinimo && subtotal < promo.montoMinimo) {
        setPromoError(`Monto mínimo requerido: S/ ${promo.montoMinimo}`);
        return;
      }

      // Validar cantidad mínima
      const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || item.cantidad || 0), 0);
      if (promo.cantidadMinima && totalItems < promo.cantidadMinima) {
        setPromoError(`Cantidad mínima requerida: ${promo.cantidadMinima} productos`);
        return;
      }

      // Validar productos específicos
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
      // Manejo de error si el backend devuelve 404 o 500
      if (error.response && error.response.status === 404) {
        setPromoError('Código no encontrado');
      } else {
        setPromoError('Código inválido o error de conexión');
      }
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
    const userStatus = checkUserStatus();
    if (!userStatus.isActive) {
      setIsPaymentModalOpen(false);
      setToast({ message: `❌ ${userStatus.message}`, type: 'error' });
      return;
    }

    const now = new Date();
    // Generar ID de factura único
    const invoiceNumber = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;

    const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;

    const nombreCliente = paymentData.holderName || (user ? user.nombre : 'Cliente Invitado');
    const telefonoCliente = paymentData.phone || (user ? user.telefono : null);

    const fechaPeru = new Intl.DateTimeFormat('es-PE', {
      timeZone: 'America/Lima',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(now).split('/').reverse().join('-');

    try {
      const pedidoData = {
        cliente: nombreCliente,
        nombreCliente: nombreCliente,
        email: user ? user.email : null,
        telefono: telefonoCliente,
        numeroFactura: invoiceNumber,

        // Usar la fecha corregida
        fecha: fechaPeru,

        hora: now.toLocaleTimeString('es-PE', { hour12: false, timeZone: 'America/Lima' }),
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

      // ... (resto del código igual: actualizar usuario, modal factura, etc) ...

      // Datos para mostrar en la factura (también corregimos la fecha visual)
      const order = {
        invoiceNumber,
        date: fechaPeru, // Usar fecha corregida
        time: now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Lima' }),
        // ... resto de campos igual
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
      setAppliedPromo(null);
      setPromoCode('');
      setPromoError('');

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