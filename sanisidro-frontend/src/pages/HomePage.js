import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PromotionsBanner from '../components/PromotionsBanner';
import './HomePage.css';

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);

  const slides = [
    {
      id: 1,
      image: '/images/carousel/slide1.jpg',
      title: 'Bienvenidos a San Isidro',
      subtitle: 'Auténtica comida peruana en Ica'
    },
    {
      id: 2,
      image: '/images/carousel/slide2.jpg',
      title: 'Disfruta de nuestra variedad',
      subtitle: 'Los mejores platillos de la región'
    },
    {
      id: 3,
      image: '/images/carousel/slide3.jpg',
      title: 'Ambiente familiar',
      subtitle: 'Un lugar acogedor para compartir'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const toggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <div className="home-page">
      <Header />

      {/* Banner Superior */}
      <div className="top-banner">
        <p>RECOGE SOLO EN EL LOCAL</p>
      </div>

      {/* Hero Section con Carrusel */}
      <section className="hero-section">
        <div className="carousel">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="carousel-overlay">
                <h1 className="carousel-title">{slide.title}</h1>
                <p className="carousel-subtitle">{slide.subtitle}</p>
              </div>
            </div>
          ))}

          <button className="carousel-btn prev" onClick={prevSlide}>
            <i className="fas fa-chevron-left"></i>
          </button>
          <button className="carousel-btn next" onClick={nextSlide}>
            <i className="fas fa-chevron-right"></i>
          </button>

          <div className="carousel-indicators">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Banner de Promociones */}
      <section className="promotions-section">
        <div className="container">
          <PromotionsBanner />
        </div>
      </section>

      {/* Sección Nosotros */}
      <section className="about-section">
        <div className="container">
          <h2 className="section-title">San isidro</h2>

          <div className="about-images">
            <img src="/images/restaurante-interior.jpg" alt="Restaurante San Isidro" />
            <img src="/images/equipo-sanisidro.jpg" alt="Equipo San Isidro" />
          </div>

          <div className="about-text">
            <p>
              En el corazón de Ica, el Restaurante San Isidro te invita a compartir la riqueza de la gastronomía peruana y
              la tradición iqueña. Desde nuestros inicios, hemos trabajado con dedicación para ofrecer a nuestros clientes una experiencia
              culinaria única, donde cada plato cuenta una historia.
            </p>
            <p>
              Nuestro compromiso es brindar un servicio de calidad, con un ambiente agradable, a familias donde cada visitante se sienta
              como en casa. Nos especializamos en mantener vivos los sabores tradicionales, especialmente el mismo tiempo con toques modernos,
              que deleitan a todos los paladares.
            </p>
            <p>
              Ven por el restaurante, somos un lugar de encuentro donde la buena comida y la hospitalidad se unen para crear momentos
              únicos. San Isidro, todo lo que puedes disfrutar en el 999999999
            </p>
          </div>
        </div>
      </section>

      {/* Preguntas Frecuentes */}
      <section className="faq-section">
        <div className="container">
          <h2 className="section-title">Preguntas Frecuentes</h2>

          <div className="faq-list">
            <div className={`faq-item ${openFaq === 1 ? 'open' : ''}`}>
              <button className="faq-question" onClick={() => toggleFaq(1)}>
                <span>¿Dónde comprar el mejor chicharrón de pollo del Perú?</span>
                <i className={`fas ${openFaq === 1 ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
              </button>
              <div className="faq-answer">
                <div className="answer-content">
                  <p>
                    En el Restaurante San Isidro encontrarás el mejor chicharrón de pollo del Perú, preparado con 
                    ingredientes frescos y nuestra receta secreta familiar. Visítanos en Av San Martín 1149, Ica, 
                    o realiza tu pedido a través de nuestra plataforma web.
                  </p>
                </div>
              </div>
            </div>

            <div className={`faq-item ${openFaq === 2 ? 'open' : ''}`}>
              <button className="faq-question" onClick={() => toggleFaq(2)}>
                <span>¿Dónde encontrar el restaurante San Isidro?</span>
                <i className={`fas ${openFaq === 2 ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
              </button>
              <div className="faq-answer">
                <div className="answer-content">
                  <p>
                    Nuestro restaurante se encuentra ubicado en <strong>Av San Martín 1149, Ica, Perú</strong>. 
                    Estamos en el corazón de Ica, ofreciendo la mejor gastronomía peruana en un ambiente acogedor 
                    y familiar. Abiertos de <strong>lunes a domingo de 12:00 PM a 11:00 PM</strong>. ¡Te esperamos!
                  </p>
                </div>
              </div>
            </div>

            <div className={`faq-item ${openFaq === 3 ? 'open' : ''}`}>
              <button className="faq-question" onClick={() => toggleFaq(3)}>
                <span>¿Puedo hacer un pedido y recoger en local?</span>
                <i className={`fas ${openFaq === 3 ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
              </button>
              <div className="faq-answer">
                <div className="answer-content">
                  <p>
                    ¡Por supuesto! Puedes hacer un pedido online y recoger en nuestro local. Si tienes alguna duda, 
                    puedes contactar con nuestro equipo en el número de teléfono <strong>+51 56 237012</strong> que 
                    aparece en nuestra web o por las redes sociales del Restaurante San Isidro.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;