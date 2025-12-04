import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { getCartTotal, getCartCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setShowUserDropdown(false);
    navigate('/');
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <Link to="/" className="logo">
            <div className="logo-text">
              <span className="logo-main">San Isidro</span>
              <span className="logo-sub">Restaurant</span>
            </div>
          </Link>

          {/* Navigation Desktop */}
          <nav className="nav-desktop">
            <Link to="/menu" className={`nav-link ${isActive('/menu') ? 'active' : ''}`} title="carta">
              <i className="fas fa-utensils"></i>
            </Link>
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`} title="local">
              <i className="fas fa-home"></i>
            </Link>
            <Link to="/nosotros" className={`nav-link ${isActive('/nosotros') ? 'active' : ''}`} title="usuarios">
              <i className="fas fa-users"></i>
            </Link>
            <Link to="/reserva" className={`nav-link ${isActive('/reserva') ? 'active' : ''}`} title="reservas">
              <i className="fas fa-calendar-alt"></i>
            </Link>
            <Link to="/ubicacion" className={`nav-link ${isActive('/ubicacion') ? 'active' : ''}`} title="ubicacion">
              <i className="fas fa-map-marker-alt"></i>
            </Link>
          </nav>

          {/* Cart & Mobile Menu */}
          <div className="header-actions">
            <Link to="/historial" className="history-button" title="Historial de Compras">
              <i className="fas fa-history"></i>
            </Link>

            <Link to="/mis-reservaciones" className="reservations-button" title="Mis Reservaciones">
              <i className="fas fa-calendar-check"></i>
            </Link>

            <Link to="/carrito" className="cart-button">
              <i className="fas fa-shopping-cart"></i>
              <span className="cart-text">S/ {getCartTotal().toFixed(2)}</span>
              {getCartCount() > 0 && (
                <span className="cart-badge bounce">{getCartCount()}</span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="user-dropdown-container">
                <button 
                  className="user-button"
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  title={user?.nombre}
                >
                  <i className="fas fa-user"></i>
                  <span className="user-name">{user?.nombre}</span>
                </button>
                {showUserDropdown && (
                  <div className="user-dropdown">
                    {user?.esAdmin && (
                      <button 
                        className="manage-button" 
                        onClick={() => {
                          navigate('/admin/dashboard');
                          setShowUserDropdown(false);
                        }}
                      >
                        <i className="fas fa-cog"></i>
                        Gestionar
                      </button>
                    )}
                    <button className="logout-button" onClick={handleLogout}>
                      <i className="fas fa-sign-out-alt"></i>
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="user-icon" title="Iniciar Sesión">
                <i className="fas fa-user"></i>
              </Link>
            )}

            <button 
              className="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className={`nav-mobile ${isMobileMenuOpen ? 'open' : ''}`}>
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
            <i className="fas fa-home"></i>
            Inicio
          </Link>
          <Link to="/menu" className={`nav-link ${isActive('/menu') ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
            <i className="fas fa-utensils"></i>
            Menú
          </Link>
          <Link to="/historial" className={`nav-link ${isActive('/historial') ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
            <i className="fas fa-history"></i>
            Historial
          </Link>
          <Link to="/mis-reservaciones" className={`nav-link ${isActive('/mis-reservaciones') ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
            <i className="fas fa-calendar-check"></i>
            Mis Reservaciones
          </Link>
          <Link to="/nosotros" className={`nav-link ${isActive('/nosotros') ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
            <i className="fas fa-users"></i>
            Nosotros
          </Link>
          <Link to="/reserva" className={`nav-link ${isActive('/reserva') ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
            <i className="fas fa-calendar-alt"></i>
            Reservas
          </Link>
          <Link to="/ubicacion" className={`nav-link ${isActive('/ubicacion') ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
            <i className="fas fa-map-marker-alt"></i>
            Ubicación
          </Link>

          {isAuthenticated ? (
            <>
              <div className="nav-link user-info-mobile">
                <i className="fas fa-user"></i>
                {user?.nombre}
              </div>
              {user?.esAdmin && (
                <Link 
                  to="/admin/dashboard" 
                  className={`nav-link ${isActive('/admin/dashboard') ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <i className="fas fa-cog"></i>
                  Gestionar
                </Link>
              )}
              <button 
                className="nav-link logout-mobile"
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
              >
                <i className="fas fa-sign-out-alt"></i>
                Cerrar Sesión
              </button>
            </>
          ) : (
            <Link to="/login" className={`nav-link ${isActive('/login') ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
              <i className="fas fa-user"></i>
              Iniciar Sesión
            </Link>
          )}

          <Link to="/admin/login" className={`nav-link ${isActive('/admin/login') ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
            <i className="fas fa-user-shield"></i>
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
