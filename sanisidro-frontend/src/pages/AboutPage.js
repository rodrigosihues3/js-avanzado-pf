import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './AboutPage.css';

const AboutPage = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "¿Dónde comprar el mejor chicharrón de pollo del Perú?",
      answer: "En el Restaurante San Isidro encontrarás el mejor chicharrón de pollo del Perú, preparado con ingredientes frescos y nuestra receta secreta familiar. Visítanos en Av San Martín 1149, Ica, o realiza tu pedido a través de nuestra plataforma web."
    },
    {
      id: 2,
      question: "¿Dónde encontrar el restaurante San Isidro?",
      answer: "Nuestro restaurante se encuentra ubicado en Av San Martín 1149, Ica, Perú. Estamos en el corazón de Ica, ofreciendo la mejor gastronomía peruana en un ambiente acogedor y familiar. Abiertos de lunes a domingo de 12:00 PM a 11:00 PM. ¡Te esperamos!"
    },
    {
      id: 3,
      question: "¿Puedo hacer un pedido y recoger en local?",
      answer: "¡Por supuesto! Puedes realizar tu pedido a través de nuestra página web y recogerlo en nuestro local. Si tienes alguna duda, puedes contactar con nuestro equipo en el número de teléfono +51 56 237012. También ofrecemos servicio de delivery en la zona."
    }
  ];

  const toggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <div className="about-page">
      <Header />
      
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-background">
          <div className="container">
            <div className="hero-content fade-in">
              <h1>Nosotros</h1>
              <p>Conoce la historia detrás del mejor sabor peruano</p>
            </div>
          </div>
        </div>
      </section>

      {/* Carrusel de Imágenes */}
      <section className="image-carousel section">
        <div className="container">
          <div className="carousel-header fade-in">
            <h2>SAN ISIDRO</h2>
            <p>Nuestro Restaurante</p>
          </div>
          
          <div className="carousel-content">
            <div className="main-image slide-in-left">
              <img 
                src="/images/about/imagen1.jpg" 
                alt="Equipo del Restaurante San Isidro"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/600x400/667eea/ffffff?text=Equipo+San+Isidro';
                }}
              />
            </div>
            
            <div className="restaurant-info slide-in-right">
              <div className="restaurant-image">
                <img 
                  src="/images/about/imagen2.jpg" 
                  alt="Restaurante San Isidro"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300/764ba2/ffffff?text=Restaurante';
                  }}
                />
              </div>
              
              <div className="restaurant-description">
                <p>
                  En el corazón de Ica, el Restaurante San Isidro se erige como un destino de la 
                  gastronomía peruana en un ambiente acogedor. Nos especializamos en 
                  rescatar los sabores tradicionales de la región, ofreciendo platos preparados con 
                  ingredientes frescos y buena calidad, ya sea que nos visites para un almuerzo especial, 
                  una cena en familia o una reunión con amigos, San Isidro te garantiza un servicio 
                  cálido, un ambiente agradable y una experiencia culinaria que combina tradición y 
                  sabor.
                </p>
                
                <p>
                  Ven y descubre por qué somos una de las mejores opciones para disfrutar la auténtica 
                  comida peruana en Ica.
                </p>
              </div>
            </div>
          </div>

          {/* Galería de Imágenes Adicionales */}
          <div className="image-gallery fade-in">
            <div className="gallery-item">
              <img 
                src="/images/about/imagen3.jpg" 
                alt="Interior del restaurante"
              />
            </div>
            <div className="gallery-item">
              <img 
                src="/images/about/imagen4.jpg" 
                alt="Platos del restaurante"
              />
            </div>
            <div className="gallery-item">
              <img 
                src="/images/about/imagen5.jpg" 
                alt="Ambiente familiar"
              />
            </div>
            <div className="gallery-item">
              <img 
                src="/images/about/imagen6.jpg" 
                alt="Cocina del restaurante"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Preguntas Frecuentes */}
      <section className="faq-section section">
        <div className="container">
          <div className="faq-header fade-in">
            <h2>Preguntas Frecuentes</h2>
            <p>Encuentra respuestas a las consultas más comunes</p>
          </div>
          
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div 
                key={faq.id} 
                className={`faq-item fade-in ${openFaq === faq.id ? 'open' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <button 
                  className="faq-question"
                  onClick={() => toggleFaq(faq.id)}
                >
                  <span>{faq.question}</span>
                  <i className={`fas ${openFaq === faq.id ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                </button>
                
                <div className="faq-answer">
                  <div className="answer-content">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;