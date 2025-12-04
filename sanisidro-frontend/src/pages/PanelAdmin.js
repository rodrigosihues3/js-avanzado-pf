import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import '../styles/PanelAdmin.css'; // Creamos este CSS después

// Componente simple de ejemplo para mostrar al hacer clic en el menú
const DashboardHome = () => (
    <div className="panel-content-area">
        <h1>Bienvenido al Panel de Administración</h1>
        <p>Utilice el menú lateral para gestionar Usuarios, la Carta y Reportes.</p>
    </div>
);

const PanelAdmin = () => {
    // useLocation nos ayuda a saber qué enlace está activo
    const location = useLocation();

    return (
        <div className="admin-layout">
            
            {/* -------------------- MENÚ LATERAL (SIDEBAR) -------------------- */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    {/* Logo/Nombre del Restaurante */}
                    <h2>SAN ISIDRO</h2>
                    <p className="sidebar-subtitle">ADMIN</p>
                </div>

                <nav className="sidebar-nav">
                    <ul>
                        {/* 1. Inicio del Panel (Ruta Base) */}
                        <li>
                            <Link 
                                to="/admin/panel" 
                                className={`nav-link ${location.pathname === '/admin/panel' ? 'active' : ''}`}
                            >
                                🏠 Dashboard
                            </Link>
                        </li>
                        
                        {/* 2. Usuarios/Admins */}
                        <li>
                            <Link 
                                to="usuarios" // Ruta relativa: /admin/panel/usuarios
                                className={`nav-link ${location.pathname.startsWith('/admin/panel/usuarios') ? 'active' : ''}`}
                            >
                                🧑‍💻 Usuarios (Admins)
                            </Link>
                        </li>
                        
                        {/* 3. Carta (Modificar) */}
                        <li>
                            <Link 
                                to="carta" // Ruta relativa: /admin/panel/carta
                                className={`nav-link ${location.pathname.startsWith('/admin/panel/carta') ? 'active' : ''}`}
                            >
                                🍽️ Carta (Modificar)
                            </Link>
                        </li>
                        
                        {/* 4. Reportes (Pedidos) */}
                        <li>
                            <Link 
                                to="reportes" // Ruta relativa: /admin/panel/reportes
                                className={`nav-link ${location.pathname.startsWith('/admin/panel/reportes') ? 'active' : ''}`}
                            >
                                📊 Reportes (Pedidos)
                            </Link>
                        </li>
                        
                        {/* 5. Cerrar Sesión (Importante) */}
                        <li className="logout-item">
                             <Link to="/admin/login" className="nav-link logout-link">
                                🚪 Cerrar Sesión
                            </Link>
                        </li>
                    </ul>
                </nav>
            </aside>
            
            {/* -------------------- CONTENIDO PRINCIPAL -------------------- */}
            <main className="main-content">
                {/* El <Outlet /> mostrará el contenido de las sub-rutas anidadas.
                  Si no hay sub-ruta (estamos en /admin/panel), mostramos el DashboardHome.
                */}
                {location.pathname === '/admin/panel' ? <DashboardHome /> : <Outlet />}
            </main>
        </div>
    );
};

export default PanelAdmin;