import React from 'react';

// EL NOMBRE DE LA FUNCIÓN DEBE COINCIDIR CON EL NOMBRE DEL ARCHIVO (por convención)
const Carta = () => { 
  return (
    <div style={{ padding: '20px' }}>
      <h1>Página de la Carta / Menú</h1>
      <p>Contenido de prueba para verificar la navegación.</p>
    </div>
  );
};

// ESTA LÍNEA ES CRÍTICA: Debe estar presente para que App.js lo pueda importar
export default Carta;