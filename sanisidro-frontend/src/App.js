import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import ReservationHistoryPage from './pages/ReservationHistoryPage';
import AboutPage from './pages/AboutPage';
import ReservaPage from './pages/ReservaPage';
import UbicacionPage from './pages/UbicacionPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TestRegister from './pages/TestRegister';
import AdminDashboard from './pages/AdminDashboard';
import AdminOrders from './pages/AdminOrders';
import AdminMenu from './pages/AdminMenu';
import AdminUsers from './pages/AdminUsers';
import AdminReservations from './pages/AdminReservations';
import AdminPromotions from './pages/AdminPromotions';
import MigrationPage from './pages/MigrationPage';
import ProtectedRoute from './components/ProtectedRoute';
import ReportsPage from './pages/ReportsPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/carrito" element={<CartPage />} />
              <Route path="/historial" element={<OrderHistoryPage />} />
              <Route path="/mis-reservaciones" element={<ReservationHistoryPage />} />
              <Route path="/nosotros" element={<AboutPage />} />
              <Route path="/reserva" element={<ReservaPage />} />
              <Route path="/ubicacion" element={<UbicacionPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/registro" element={<RegisterPage />} />
              <Route path="/test-register" element={<TestRegister />} />
              <Route path="/admin/dashboard" element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/orders" element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminOrders />
                </ProtectedRoute>
              } />
              <Route path="/admin/menu" element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminMenu />
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminUsers />
                </ProtectedRoute>
              } />
              <Route path="/admin/reservations" element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminReservations />
                </ProtectedRoute>
              } />
              <Route path="/admin/promotions" element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminPromotions />
                </ProtectedRoute>
              } />
              <Route path="/admin/migration" element={
                <ProtectedRoute requireAdmin={true}>
                  <MigrationPage />
                </ProtectedRoute>
              } />
              <Route path="/admin/reports" element={
                <ProtectedRoute> {/* Si usas protección de rutas */}
                  <ReportsPage />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;