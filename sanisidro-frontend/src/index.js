import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'; // Mantenemos el CSS base
import App from './App';

// 1. Obtén el contenedor raíz del HTML (el div con id="root")
const container = document.getElementById('root');

// 2. Crea la raíz de React 18
const root = createRoot(container);

// 3. Renderiza tu componente principal (<App />)
root.render(
  // <React.StrictMode> ayuda a encontrar errores comunes en el desarrollo
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Si usaste la plantilla de create-react-app, puedes eliminar el archivo
// reportWebVitals.js y también borrar la importación y la llamada a reportWebVitals()
// para simplificar tu código.
