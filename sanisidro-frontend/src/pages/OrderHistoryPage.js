import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { pedidosAPI } from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import InvoiceModal from '../components/InvoiceModal';
import './OrderHistoryPage.css';

const OrderHistoryPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarPedidos();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cargarPedidos = async () => {
    try {
      // Obtener usuario actual
      const userData = localStorage.getItem('user');
      if (!userData) {
        navigate('/login');
        return;
      }

      const user = JSON.parse(userData);
      
      // Obtener pedidos del usuario desde el backend
      const response = await pedidosAPI.obtenerPorEmail(user.email);
      
      // Transformar los datos del backend al formato esperado por el frontend
      const pedidosFormateados = response.data.map(pedido => ({
        invoiceNumber: pedido.id,
        date: pedido.fecha,
        time: pedido.hora || '00:00',
        paymentMethod: pedido.metodoPago || 'card',
        items: pedido.items || [],
        total: pedido.total
      }));
      
      setOrders(pedidosFormateados);
    } catch (error) {
      console.error('Error cargando pedidos:', error);
      // Si hay error, intentar cargar desde localStorage como fallback
      const savedOrders = localStorage.getItem('orderHistory');
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleViewInvoice = (order) => {
    setSelectedOrder(order);
    setIsInvoiceModalOpen(true);
  };

  const getPaymentMethodText = (method) => {
    return method === 'card' ? 'Tarjeta' : 'Yape';
  };

  const getPaymentMethodIcon = (method) => {
    return method === 'card' ? 'fa-credit-card' : 'fa-mobile-alt';
  };

  const toggleOrderItems = (invoiceNumber) => {
    setExpandedOrders(prev => ({
      ...prev,
      [invoiceNumber]: !prev[invoiceNumber]
    }));
  };

  if (loading) {
    return (
      <div className="order-history-page">
        <Header />
        <div className="order-history-container">
          <div className="container">
            <div className="loading">Cargando historial de compras...</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="order-history-page">
      <Header />

      <InvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        orderData={selectedOrder}
      />

      <div className="order-history-container">
        <div className="container">
          <h1 className="page-title">
            <i className="fas fa-history"></i> Historial de Compras
          </h1>

          {orders.length === 0 ? (
            <div className="empty-history">
              <i className="fas fa-shopping-bag"></i>
              <h3>No tienes compras registradas</h3>
              <p>Tus pedidos aparecerán aquí una vez que realices una compra</p>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order.invoiceNumber} className="order-card">
                  <div className="order-header">
                    <div className="order-number">
                      <i className="fas fa-receipt"></i>
                      <span>Pedido #{order.invoiceNumber}</span>
                    </div>
                    <div className="order-date">
                      <i className="fas fa-calendar"></i>
                      <span>{order.date} - {order.time}</span>
                    </div>
                  </div>

                  <div className="order-payment">
                    <i className={`fas ${getPaymentMethodIcon(order.paymentMethod)}`}></i>
                    <span>{getPaymentMethodText(order.paymentMethod)}</span>
                  </div>

                  <div className="order-items">
                    <div className="order-items-header" onClick={() => toggleOrderItems(order.invoiceNumber)}>
                      <h4>Productos:</h4>
                      <button className="toggle-items-btn">
                        <i className={`fas fa-chevron-${expandedOrders[order.invoiceNumber] ? 'up' : 'down'}`}></i>
                      </button>
                    </div>
                    {expandedOrders[order.invoiceNumber] && (
                      <ul className="items-list">
                        {order.items.map((item, index) => (
                          <li key={index}>
                            <span className="item-name">
                              {item.nombre} x{item.cantidad}
                            </span>
                            <span className="item-price">
                              S/ {(item.precio * item.cantidad).toFixed(2)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="order-footer">
                    <div className="order-total">
                      <span>Total:</span>
                      <span className="total-amount">S/ {order.total.toFixed(2)}</span>
                    </div>
                    <button 
                      className="btn-view-invoice"
                      onClick={() => handleViewInvoice(order)}
                    >
                      <i className="fas fa-file-invoice"></i> Ver Boleta
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderHistoryPage;
