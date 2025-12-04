import React from 'react';
import '../styles/Carta.css'; // Vamos a crear este archivo en el siguiente paso

// 1. Datos Ficticios (Mock Data) para el Menú
const menuData = [
  {
    id: 1,
    nombre: "Lomo Saltado Clásico",
    descripcion: "Lomos de res salteados al wok con cebolla, tomate, ají amarillo y un toque de salsa de soya. Servido con papas fritas y arroz blanco.",
    precio: 45.00,
    categoria: "Platos Fuertes",
    imagen: "/images/lomo.jpg" // Necesitarás poner esta imagen en public/images/
  },
  {
    id: 2,
    nombre: "Causa Rellena de Pulpa de Cangrejo",
    descripcion: "Masa de papa amarilla sazonada con limón y ají, rellena de una fresca ensalada de pulpa de cangrejo y aguacate.",
    precio: 35.00,
    categoria: "Entradas",
    imagen: "/images/causa.jpg"
  },
  {
    id: 3,
    nombre: "Pisco Sour Tradicional",
    descripcion: "El cóctel nacional. Pisco, jugo de limón, jarabe de goma, clara de huevo y un toque de amargo de angostura.",
    precio: 20.00,
    categoria: "Bebidas y Cócteles",
    imagen: "/images/pisco.jpg"
  },
  // Puedes añadir más platos aquí
];

// 2. Componente de la Carta
const Carta = () => {
  
  // Usaremos un Set para obtener todas las categorías únicas automáticamente
  const categorias = [...new Set(menuData.map(item => item.categoria))];

  return (
    <div className="carta-page">
      
      <section className="carta-hero">
        <h1 className="carta-title">Nuestra Carta</h1>
        <p className="carta-subtitle">Sabores peruanos con la esencia de Ica.</p>
      </section>

      <main className="carta-menu-container">
        {categorias.map(categoria => (
          <div key={categoria} className="menu-categoria">
            <h2 className="categoria-title">{categoria}</h2>
            <div className="platos-grid">
              
              {/* Filtra y mapea los platos de esta categoría */}
              {menuData
                .filter(item => item.categoria === categoria)
                .map(plato => (
                  <div key={plato.id} className="plato-card">
                    <img 
                      src={plato.imagen || "/images/default-plato.jpg"} // Usa una imagen por defecto si no existe
                      alt={plato.nombre}
                      className="plato-image"
                    />
                    <div className="plato-info">
                      <h3 className="plato-nombre">{plato.nombre}</h3>
                      <p className="plato-descripcion">{plato.descripcion}</p>
                      <div className="plato-footer">
                        <span className="plato-precio">S/ {plato.precio.toFixed(2)}</span>
                        <button className="add-to-cart-btn">Añadir al Carro</button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </main>

    </div>
  );
};

export default Carta;