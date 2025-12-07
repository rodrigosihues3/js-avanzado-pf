import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const ReportsPage = () => {
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);

  const lookerEmbedUrl = "https://lookerstudio.google.com/embed/reporting/12b6b52e-4196-40c3-a7d6-cdae85a34b0c/page/KZ4hF";

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Estilo base compartido para que ambos botones se vean iguales y ordenados
  const buttonStyle = {
    margin: 0,
    padding: '10px 20px',
    height: 'auto',
    minHeight: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontSize: '0.9rem',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    color: 'white',
    width: 'auto',
    whiteSpace: 'nowrap',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  return (
    <div className="admin-dashboard">

      <div className="dashboard-container" style={{ maxWidth: '1400px' }}>

        <div className="welcome-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h2>Reportes Gerenciales</h2>
            <p style={{ color: '#666', marginTop: '5px' }}>Análisis en tiempo real del rendimiento del restaurante.</p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => navigate('/admin/dashboard')}
              style={{
                ...buttonStyle,
                backgroundColor: '#3498db'
              }}
            >
              <i className="fas fa-arrow-left"></i> Volver al Panel
            </button>

            <button
              onClick={handleRefresh}
              style={{
                ...buttonStyle,
                backgroundColor: '#e67e22'
              }}
            >
              <i className="fas fa-sync-alt"></i> Actualizar Reporte
            </button>
          </div>
        </div>

        {/* CONTENEDOR DEL REPORTE */}
        <div className="looker-container" style={{
          marginTop: '20px',
          width: '100%',
          height: '2770px',
          overflow: 'hidden',
          backgroundColor: 'transparent'
        }}>
          <iframe
            key={refreshKey}
            src={lookerEmbedUrl}
            style={{
              border: 0,
              width: '100%',
              height: '100%',
              borderRadius: '12px',
              backgroundColor: '#ffffff'
            }}
            allowFullScreen
            title="Reporte San Isidro"
          ></iframe>
        </div>

      </div>
    </div>
  );
};

export default ReportsPage;