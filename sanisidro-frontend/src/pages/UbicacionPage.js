import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './UbicacionPage.css';

const UbicacionPage = () => {
  return (
    <div className="ubicacion-page">
      <Header />
      
      <div className="ubicacion-container">
        <div className="container">
          <h1 className="ubicacion-title fade-in">Ubicacion</h1>
          
          <div className="direccion-section slide-in-left">
            <h2>Dirección</h2>
            <div className="direccion-info">
              <div className="info-item">
                <i className="fas fa-map-marker-alt"></i>
                <div>
                  <h3>Restaurante San Isidro</h3>
                  <p>Av San Martín 1149, Ica, Perú</p>
                </div>
              </div>
              <div className="info-item">
                <i className="fas fa-phone"></i>
                <div>
                  <h3>Teléfono</h3>
                  <p>+51 56 237012</p>
                </div>
              </div>
              <div className="info-item">
                <i className="fas fa-envelope"></i>
                <div>
                  <h3>Email</h3>
                  <p>info@restaurantesanisidro.com</p>
                </div>
              </div>
              <div className="info-item">
                <i className="fas fa-clock"></i>
                <div>
                  <h3>Horario</h3>
                  <p>Lunes a Domingo: 12:00 PM - 11:00 PM</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mapa-section slide-in-right">
            <div className="mapa-container">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3870.0708211880283!2d-75.7275384!3d-14.0729952!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9110e290c34bb1f9%3A0x1e412d437f2dbfac!2sRestaurante%20San%20Isidro!5e0!3m2!1ses-419!2spe!4v1761280522030!5m2!1ses-419!2spe"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Restaurante San Isidro - Av San Martín 1149, Ica"
              ></iframe>
              <div className="map-overlay">
                <button className="view-larger-btn">
                  View larger map
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UbicacionPage;