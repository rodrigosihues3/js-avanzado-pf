import React, { useState } from 'react';
import { migrateLocalStorageToBackend, verificarMigracion } from '../utils/migrateToBackend';
import './MigrationPage.css';

const MigrationPage = () => {
  const [migrating, setMigrating] = useState(false);
  const [results, setResults] = useState(null);
  const [verification, setVerification] = useState(null);
  const [logs, setLogs] = useState([]);

  // Capturar console.log para mostrar en la UI
  const originalLog = console.log;
  const originalError = console.error;

  const addLog = (message, type = 'info') => {
    setLogs(prev => [...prev, { message, type, time: new Date().toLocaleTimeString() }]);
  };

  const handleMigrate = async () => {
    if (!window.confirm('⚠️ ¿Estás seguro de migrar los datos de localStorage a MySQL?\n\nEsto copiará todos los datos sin eliminar el localStorage.')) {
      return;
    }

    setMigrating(true);
    setResults(null);
    setLogs([]);

    // Interceptar console.log
    console.log = (...args) => {
      originalLog(...args);
      addLog(args.join(' '), 'info');
    };

    console.error = (...args) => {
      originalError(...args);
      addLog(args.join(' '), 'error');
    };

    try {
      const migrationResults = await migrateLocalStorageToBackend();
      setResults(migrationResults);
      addLog('✅ Migración completada exitosamente', 'success');
    } catch (error) {
      addLog(`❌ Error en la migración: ${error.message}`, 'error');
    } finally {
      setMigrating(false);
      // Restaurar console.log
      console.log = originalLog;
      console.error = originalError;
    }
  };

  const handleVerify = async () => {
    try {
      const verificationResults = await verificarMigracion();
      setVerification(verificationResults);
    } catch (error) {
      alert('Error verificando datos: ' + error.message);
    }
  };

  const getLocalStorageStats = () => {
    const productos = JSON.parse(localStorage.getItem('adminProducts') || '[]');
    const usuarios = JSON.parse(localStorage.getItem('adminUsers') || '[]');
    const promociones = JSON.parse(localStorage.getItem('adminPromotions') || '[]');
    const pedidos = JSON.parse(localStorage.getItem('adminOrders') || '[]');

    return {
      productos: productos.length,
      usuarios: usuarios.length,
      promociones: promociones.length,
      pedidos: pedidos.length
    };
  };

  const localStats = getLocalStorageStats();

  return (
    <div className="migration-page">
      <div className="migration-container">
        <h1>🔄 Migración de Datos</h1>
        <p className="subtitle">Migrar datos de localStorage a MySQL</p>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>📦 Productos</h3>
            <p className="stat-number">{localStats.productos}</p>
            <span>en localStorage</span>
          </div>
          <div className="stat-card">
            <h3>👥 Usuarios</h3>
            <p className="stat-number">{localStats.usuarios}</p>
            <span>en localStorage</span>
          </div>
          <div className="stat-card">
            <h3>🎁 Promociones</h3>
            <p className="stat-number">{localStats.promociones}</p>
            <span>en localStorage</span>
          </div>
          <div className="stat-card">
            <h3>📋 Pedidos</h3>
            <p className="stat-number">{localStats.pedidos}</p>
            <span>en localStorage</span>
          </div>
        </div>

        <div className="actions">
          <button 
            onClick={handleMigrate} 
            disabled={migrating}
            className="migrate-btn"
          >
            {migrating ? '⏳ Migrando...' : '🚀 Iniciar Migración'}
          </button>
          <button 
            onClick={handleVerify}
            className="verify-btn"
          >
            🔍 Verificar Datos en BD
          </button>
        </div>

        {verification && (
          <div className="verification-results">
            <h3>✅ Datos en Base de Datos MySQL</h3>
            <div className="stats-grid">
              <div className="stat-card success">
                <h4>📦 Productos</h4>
                <p className="stat-number">{verification.productos}</p>
              </div>
              <div className="stat-card success">
                <h4>👥 Usuarios</h4>
                <p className="stat-number">{verification.usuarios}</p>
              </div>
              <div className="stat-card success">
                <h4>🎁 Promociones</h4>
                <p className="stat-number">{verification.promociones}</p>
              </div>
              <div className="stat-card success">
                <h4>📋 Pedidos</h4>
                <p className="stat-number">{verification.pedidos}</p>
              </div>
            </div>
          </div>
        )}

        {results && (
          <div className="migration-results">
            <h3>📊 Resultados de la Migración</h3>
            <div className="results-grid">
              <div className="result-item">
                <span>📦 Productos:</span>
                <span className="success">{results.productos.success} ✅</span>
                <span className="error">{results.productos.errors} ❌</span>
              </div>
              <div className="result-item">
                <span>👥 Usuarios:</span>
                <span className="success">{results.usuarios.success} ✅</span>
                <span className="error">{results.usuarios.errors} ❌</span>
              </div>
              <div className="result-item">
                <span>🎁 Promociones:</span>
                <span className="success">{results.promociones.success} ✅</span>
                <span className="error">{results.promociones.errors} ❌</span>
              </div>
              <div className="result-item">
                <span>📋 Pedidos:</span>
                <span className="success">{results.pedidos.success} ✅</span>
                <span className="error">{results.pedidos.errors} ❌</span>
              </div>
            </div>
          </div>
        )}

        {logs.length > 0 && (
          <div className="logs-container">
            <h3>📝 Logs de Migración</h3>
            <div className="logs">
              {logs.map((log, index) => (
                <div key={index} className={`log-entry ${log.type}`}>
                  <span className="log-time">{log.time}</span>
                  <span className="log-message">{log.message}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="warning-box">
          <h4>⚠️ Importante:</h4>
          <ul>
            <li>Esta migración NO eliminará los datos de localStorage</li>
            <li>Los datos se copiarán a la base de datos MySQL</li>
            <li>Asegúrate de que el backend esté corriendo en https://backend-production-cbbe.up.railway.app</li>
            <li>Los usuarios migrados tendrán contraseña por defecto: "password123"</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MigrationPage;
