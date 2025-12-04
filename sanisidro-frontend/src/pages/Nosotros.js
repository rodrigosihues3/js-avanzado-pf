import React from 'react';
// 1. IMPORTAR EL CSS CREADO
import '../styles/Nosotros.css';

// Ya que no usamos <Link> ni navegamos dentro de esta página,
// eliminamos la línea de importación de Link para resolver la advertencia de ESLint.

const Nosotros = () => {

  return (
    // Aplicamos la clase principal
    <div className="nosotros-page">
      
      {/* SECCIÓN PRINCIPAL: Hero */}
      <section className="nosotros-hero">
        <h1 className="nosotros-hero-title">Nuestra Historia</h1>
        <p className="nosotros-hero-subtitle">Más que un restaurante, una tradición en Ica.</p>
      </section>

      {/* SECCIÓN: Filosofía */}
      <section className="nosotros-section">
        <h2 className="nosotros-section-title">La Filosofía San Isidro</h2>
        <p className="nosotros-section-text">
          Fundado en el corazón de Ica en 2010, San Isidro nació de la pasión por la
          cocina peruana que honra la tradición, pero que se atreve a innovar. Nuestro enfoque 
          se centra en el uso de ingredientes locales, frescos y de temporada, apoyando 
          directamente a los agricultores de la región. Creemos que la buena comida es una experiencia 
          completa: sabor, ambiente y servicio impecable.
        </p>
      </section>

      {/* SECCIÓN: Imagen del Chef/Ubicación */}
      <div className="nosotros-image-container">
        {/*
          IMPORTANTE: La ruta /ica-restaurant.jpg funciona porque el archivo está
          en la carpeta 'public' de React.
        */}
        <img 
          src="/ica-restaurant.jpg" 
          alt="Foto del Restaurante o el Chef principal de San Isidro en Ica"
          className="nosotros-chef-image"
        />
      </div>

      {/* SECCIÓN: La Ubicación Iqueña - Usamos la clase de ubicación */}
      <section className="nosotros-section nosotros-location-section">
        <h2 className="nosotros-section-title">Ica: Nuestra Casa, Nuestra Inspiración</h2>
        <p className="nosotros-section-text">
          Estar ubicados en Ica nos permite tener acceso a los mejores productos de la costa 
          y valles. Desde los piscos más refinados hasta la riqueza de los ingredientes del desierto 
          y el mar, cada plato en San Isidro es un homenaje a la identidad gastronómica iqueña.
        </p>
      </section>

      {/* SECCIÓN: Equipo */}
      <section className="nosotros-section">
        <h2 className="nosotros-section-title">Conozca a Nuestro Chef</h2>
        <p className="nosotros-section-text">
          El Chef Juan Pérez, nativo de Ica, lidera nuestra cocina. Con experiencia internacional, 
          ha regresado a sus raíces para ofrecer una carta que equilibra la nostalgia con la sorpresa.
        </p>
      </section>
      
    </div>
  );
};

export default Nosotros;