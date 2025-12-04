import axios from 'axios';

const API_URL = 'https://backend-production-cbbe.up.railway.app/api';
// Para pruebas locales
// const API_URL = 'http://localhost:8080/api';

// Configuración de axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============ PRODUCTOS ============
export const productosAPI = {
  obtenerTodos: () => api.get('/productos'),
  obtenerPorId: (id) => api.get(`/productos/${id}`),
  obtenerPorCategoria: (categoria) => api.get(`/productos/categoria/${categoria}`),
  crear: (producto) => api.post('/productos', producto),
  actualizar: (id, producto) => api.put(`/productos/${id}`, producto),
  eliminar: (id) => api.delete(`/productos/${id}`),
};

// ============ USUARIOS ============
export const usuariosAPI = {
  obtenerTodos: () => api.get('/usuarios'),
  obtenerPorId: (id) => api.get(`/usuarios/${id}`),
  registrar: (usuario) => api.post('/usuarios/registro', usuario),
  login: (credentials) => api.post('/usuarios/login', credentials),
  actualizar: (id, usuario) => api.put(`/usuarios/${id}`, usuario),
  eliminar: (id) => api.delete(`/usuarios/${id}`),
};

// ============ PEDIDOS ============
export const pedidosAPI = {
  obtenerTodos: () => api.get('/pedidos'),
  obtenerPorId: (id) => api.get(`/pedidos/${id}`),
  obtenerPorEmail: (email) => api.get(`/pedidos/usuario/${email}`),
  crear: (pedido) => api.post('/pedidos', pedido),
  actualizarEstado: (id, estado) => api.put(`/pedidos/${id}/estado`, { estado }),
  eliminar: (id) => api.delete(`/pedidos/${id}`),
};

// ============ PROMOCIONES ============
export const promocionesAPI = {
  obtenerTodas: () => api.get('/promociones'),
  obtenerPorId: (id) => api.get(`/promociones/${id}`),
  obtenerPorCodigo: (codigo) => api.get(`/promociones/codigo/${codigo}`),
  crear: (promocion) => api.post('/promociones', promocion),
  actualizar: (id, promocion) => api.put(`/promociones/${id}`, promocion),
  eliminar: (id) => api.delete(`/promociones/${id}`),
};

// ============ RESERVAS ============
export const reservasAPI = {
  obtenerTodas: () => api.get('/reservas'),
  obtenerPorId: (id) => api.get(`/reservas/${id}`),
  obtenerPorEmail: (email) => api.get(`/reservas/usuario/${email}`),
  obtenerPorFecha: (fecha) => api.get(`/reservas/fecha/${fecha}`),
  obtenerPorEstado: (estado) => api.get(`/reservas/estado/${estado}`),
  crear: (reserva) => api.post('/reservas', reserva),
  actualizar: (id, reserva) => api.put(`/reservas/${id}`, reserva),
  eliminar: (id) => api.delete(`/reservas/${id}`),
};

export const reniecAPI = {
  consultar: (dni) => api.get(`/reniec/consulta/${dni}`)
};

export default api;
