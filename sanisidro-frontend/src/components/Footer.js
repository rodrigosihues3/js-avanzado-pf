import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Nuestra Ubicación</h3>
            <div className="location-item">
              <i className="fas fa-map-marker-alt"></i>
              <span>Av San Martín 1149, Ica, Perú</span>
            </div>
            <div className="location-item">
              <i className="fas fa-phone"></i>
              <span>+51 56 237012</span>
            </div>
            <div className="location-item">
              <i className="fas fa-envelope"></i>
              <span>info@restaurantesanisidro.com</span>
            </div>
            
            <div className="social-links">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <i className="fab fa-youtube"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h3>Enlaces Rápidos</h3>
            <a href="/nosotros" className="footer-link">Sobre Nosotros</a>
            <a href="/ubicacion" className="footer-link">Contáctanos</a>
            <a href="/reserva" className="footer-link">Reservaciones</a>
            <a href="/privacidad" className="footer-link">Política de Privacidad</a>
            <a href="/terminos" className="footer-link">Términos y Condiciones</a>
          </div>

          <div className="footer-section">
            <h3>Recursos</h3>
            <a href="/blog" className="footer-link">Blog</a>
            <a href="/ayuda" className="footer-link">Ayuda</a>
            <a href="/faqs" className="footer-link">FAQs</a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© <a href="/">Restaurante San Isidro</a>, Todos los Derechos Reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;