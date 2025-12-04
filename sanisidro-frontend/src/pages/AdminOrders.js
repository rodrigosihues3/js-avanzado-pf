import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { pedidosAPI } from '../services/api';
import './AdminOrders.css';

const AdminOrders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [filter, setFilter] = useState('todos');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarPedidos();
    }, []);

    const cargarPedidos = async () => {
        try {
            setLoading(true);
            console.log('Cargando pedidos desde el servidor...');
            const response = await pedidosAPI.obtenerTodos();
            console.log('Pedidos recibidos:', response.data.length);
            const pedidosFormateados = response.data.map(p => {
                let items = [];
                let comentarios = '';

                // Parsear el campo detalles si es un JSON
                if (p.detalles) {
                    try {
                        const detallesArray = JSON.parse(p.detalles);
                        if (Array.isArray(detallesArray)) {
                            items = detallesArray;
                            // Extraer comentarios de los items
                            const comentariosItems = detallesArray
                                .filter(item => item.comentarios)
                                .map(item => `${item.nombre}: ${item.comentarios}`);
                            comentarios = comentariosItems.join(', ');
                        }
                    } catch (e) {
                        // Si no es JSON, usar el texto tal cual
                        comentarios = p.detalles;
                    }
                }

                return {
                    ...p,
                    fecha: Array.isArray(p.fecha)
                        ? `${p.fecha[0]}-${String(p.fecha[1]).padStart(2, '0')}-${String(p.fecha[2]).padStart(2, '0')}`
                        : p.fecha,
                    hora: Array.isArray(p.hora)
                        ? `${String(p.hora[0]).padStart(2, '0')}:${String(p.hora[1]).padStart(2, '0')}`
                        : p.hora,
                    items: items,
                    comentarios: comentarios
                };
            });
            console.log('Pedidos formateados:', pedidosFormateados.map(p => ({ id: p.id, estado: p.estado })));
            setOrders(pedidosFormateados);
        } catch (error) {
            console.error('Error cargando pedidos:', error);
            alert('Error al cargar pedidos. Verifica que el backend esté corriendo.');
        } finally {
            setLoading(false);
        }
    };

    const getFilteredOrders = () => {
        if (filter === 'todos') return orders;
        return orders.filter(order => order.estado === filter);
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            console.log(`Actualizando pedido ${orderId} a estado: ${newStatus}`);
            const response = await pedidosAPI.actualizarEstado(orderId, newStatus);
            console.log('Respuesta del servidor:', response.data);

            // Actualizar el estado local inmediatamente
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === orderId
                        ? { ...order, estado: newStatus }
                        : order
                )
            );

            // Recargar todos los pedidos para asegurar sincronización
            await cargarPedidos();
            console.log('Pedidos recargados exitosamente');
        } catch (error) {
            console.error('Error actualizando estado:', error);
            console.error('Detalles del error:', error.response?.data);
            alert('❌ Error al actualizar el estado del pedido');
        }
    };

    const handleDelete = async (orderId) => {
        if (window.confirm('¿Estás seguro de eliminar este pedido?')) {
            try {
                await pedidosAPI.eliminar(orderId);
                alert('✅ Pedido eliminado exitosamente');
                await cargarPedidos();
            } catch (error) {
                console.error('Error eliminando pedido:', error);
                alert('❌ Error al eliminar el pedido');
            }
        }
    };

    const getStatusBadge = (estado) => {
        const badges = {
            pendiente: { text: 'Pendiente', class: 'badge-pending' },
            preparando: { text: 'Preparando', class: 'badge-preparing' },
            listo: { text: 'Listo', class: 'badge-ready' },
            entregado: { text: 'Entregado', class: 'badge-delivered' },
            cancelado: { text: 'Cancelado', class: 'badge-cancelled' }
        };
        return badges[estado] || badges.pendiente;
    };

    const getTodayOrders = () => {
        const today = new Date().toISOString().split('T')[0];
        return orders.filter(order => order.fecha === today).length;
    };

    const getTotalRevenue = () => {
        return orders
            .filter(order => order.estado !== 'cancelado')
            .reduce((sum, order) => sum + (order.total || 0), 0);
    };

    if (loading) {
        return (
            <div className="admin-orders">
                <div className="loading-message">
                    <p>Cargando pedidos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-orders">
            <div className="admin-header">
                <div className="header-left">
                    <button onClick={() => navigate('/admin/dashboard')} className="back-btn">
                        <i className="fas fa-arrow-left"></i> Dashboard
                    </button>
                    <button onClick={() => navigate('/')} className="home-btn-header">
                        <i className="fas fa-home"></i> Inicio
                    </button>
                </div>
                <h1>Gestión de Pedidos</h1>
                <button onClick={cargarPedidos} className="refresh-btn">
                    <i className="fas fa-sync-alt"></i> Actualizar
                </button>
            </div>

            <div className="orders-container">
                <div className="orders-summary">
                    <div className="summary-card">
                        <i className="fas fa-shopping-bag"></i>
                        <div>
                            <h3>{getTodayOrders()}</h3>
                            <p>Pedidos Hoy</p>
                        </div>
                    </div>
                    <div className="summary-card">
                        <i className="fas fa-dollar-sign"></i>
                        <div>
                            <h3>S/ {getTotalRevenue().toFixed(2)}</h3>
                            <p>Ingresos Totales</p>
                        </div>
                    </div>
                    <div className="summary-card">
                        <i className="fas fa-clock"></i>
                        <div>
                            <h3>{orders.filter(o => o.estado === 'pendiente').length}</h3>
                            <p>Pendientes</p>
                        </div>
                    </div>
                </div>

                <div className="orders-filters">
                    <button
                        className={`filter-btn ${filter === 'todos' ? 'active' : ''}`}
                        onClick={() => setFilter('todos')}
                    >
                        Todos ({orders.length})
                    </button>
                    <button
                        className={`filter-btn ${filter === 'pendiente' ? 'active' : ''}`}
                        onClick={() => setFilter('pendiente')}
                    >
                        Pendientes ({orders.filter(o => o.estado === 'pendiente').length})
                    </button>
                    <button
                        className={`filter-btn ${filter === 'preparando' ? 'active' : ''}`}
                        onClick={() => setFilter('preparando')}
                    >
                        Preparando ({orders.filter(o => o.estado === 'preparando').length})
                    </button>
                    <button
                        className={`filter-btn ${filter === 'listo' ? 'active' : ''}`}
                        onClick={() => setFilter('listo')}
                    >
                        Listos ({orders.filter(o => o.estado === 'listo').length})
                    </button>
                    <button
                        className={`filter-btn ${filter === 'entregado' ? 'active' : ''}`}
                        onClick={() => setFilter('entregado')}
                    >
                        Entregados ({orders.filter(o => o.estado === 'entregado').length})
                    </button>
                </div>

                <div className="orders-grid">
                    {getFilteredOrders().map(order => {
                        const badge = getStatusBadge(order.estado);
                        return (
                            <div key={order.id} className="order-card">
                                <div className="order-header">
                                    <div className="order-id">
                                        <i className="fas fa-receipt"></i>
                                        #{order.numeroFactura || order.id}
                                    </div>
                                    <span className={`status-badge ${badge.class}`}>
                                        {badge.text}
                                    </span>
                                </div>
                                <div className="order-body">
                                    <h3>{order.nombreCliente || order.cliente}</h3>
                                    <div className="order-details">
                                        <div className="detail-item">
                                            <i className="fas fa-calendar"></i>
                                            <span>{order.fecha}</span>
                                        </div>
                                        <div className="detail-item">
                                            <i className="fas fa-clock"></i>
                                            <span>{order.hora}</span>
                                        </div>
                                        <div className="detail-item">
                                            <i className="fas fa-phone"></i>
                                            <span>{order.telefono || 'N/A'}</span>
                                        </div>
                                        <div className="detail-item">
                                            <i className="fas fa-envelope"></i>
                                            <span>{order.email || 'N/A'}</span>
                                        </div>
                                        {order.metodoPago && (
                                            <div className="detail-item">
                                                <i className="fas fa-credit-card"></i>
                                                <span>{order.metodoPago}</span>
                                            </div>
                                        )}
                                    </div>

                                    {order.items && order.items.length > 0 && (
                                        <div className="order-items-list">
                                            <h4><i className="fas fa-utensils"></i> Artículos del Pedido:</h4>
                                            {order.items.map((item, index) => (
                                                <div key={index} className="item-row">
                                                    <div className="item-info">
                                                        <span className="item-name">{item.nombre}</span>
                                                        <span className="item-quantity">x{item.cantidad}</span>
                                                    </div>
                                                    <span className="item-price">S/ {(item.precio * item.cantidad).toFixed(2)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {order.comentarios && (
                                        <div className="order-notes">
                                            <i className="fas fa-comment"></i>
                                            <span>{order.comentarios}</span>
                                        </div>
                                    )}

                                    <div className="order-pricing">
                                        <div className="pricing-row">
                                            <span>Subtotal:</span>
                                            <span>S/ {order.subtotal?.toFixed(2)}</span>
                                        </div>
                                        {order.descuento > 0 && (
                                            <div className="pricing-row discount">
                                                <span>Descuento {order.codigoPromo && `(${order.codigoPromo})`}:</span>
                                                <span>- S/ {order.descuento?.toFixed(2)}</span>
                                            </div>
                                        )}
                                        <div className="pricing-row total">
                                            <span>Total:</span>
                                            <span>S/ {order.total?.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="order-actions">
                                    <select
                                        value={order.estado}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        className="status-select"
                                    >
                                        <option value="pendiente">Pendiente</option>
                                        <option value="preparando">Preparando</option>
                                        <option value="listo">Listo</option>
                                        <option value="entregado">Entregado</option>
                                        <option value="cancelado">Cancelado</option>
                                    </select>
                                    <button
                                        onClick={() => handleDelete(order.id)}
                                        className="delete-btn"
                                        title="Eliminar pedido"
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {getFilteredOrders().length === 0 && (
                    <div className="no-results">
                        <i className="fas fa-shopping-bag"></i>
                        <p>No hay pedidos en esta categoría</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminOrders;
