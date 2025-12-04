import React from 'react';
// Si usas el Link de react-router-dom, DEBES importarlo
// import { Link } from 'react-router-dom'; 

const Index = () => {
  // Un componente React SIEMPRE debe devolver (return) algo.
  return (
    <div style={{ padding: '50px', backgroundColor: 'lightcoral' }}>
      <h1>¡INDEX FUNCIONA!</h1>
      <p>Si ves este texto, el error está en otro lado.</p>
    </div>
  );
};

// El componente DEBE ser exportado
export default Index;