// Archivo de prueba para verificar que el indicador de seguridad funciona
import React, { useState, useMemo } from 'react';

const TestRegister = () => {
    const [password, setPassword] = useState('');

    const passwordStrength = useMemo(() => {
        if (!password) return { level: 'none', text: '', percentage: 0 };

        let strength = 0;
        if (password.length >= 6) strength += 25;
        if (password.length >= 10) strength += 25;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 20;
        if (/\d/.test(password)) strength += 15;
        if (/[^a-zA-Z0-9]/.test(password)) strength += 15;

        let text = '';
        let level = '';
        if (strength < 30) {
            text = 'Baja';
            level = 'low';
        } else if (strength < 50) {
            text = 'Media';
            level = 'medium';
        } else if (strength < 75) {
            text = 'Buena';
            level = 'good';
        } else {
            text = 'Excelente';
            level = 'excellent';
        }

        return { level, text, percentage: strength };
    }, [password]);

    return (
        <div style={{ padding: '50px', maxWidth: '500px', margin: '0 auto' }}>
            <h1>Prueba del Indicador de Seguridad</h1>
            
            <div style={{ marginTop: '30px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
                    Contraseña:
                </label>
                <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Escribe una contraseña..."
                    style={{
                        width: '100%',
                        padding: '15px',
                        fontSize: '16px',
                        border: '2px solid #ddd',
                        borderRadius: '8px'
                    }}
                />
                
                {password && (
                    <div style={{ marginTop: '15px' }}>
                        <div style={{
                            width: '100%',
                            height: '8px',
                            background: '#e9ecef',
                            borderRadius: '4px',
                            overflow: 'hidden',
                            marginBottom: '10px'
                        }}>
                            <div style={{
                                width: `${passwordStrength.percentage}%`,
                                height: '100%',
                                background: passwordStrength.level === 'low' ? '#e74c3c' :
                                           passwordStrength.level === 'medium' ? '#f39c12' :
                                           passwordStrength.level === 'good' ? '#3498db' : '#2ecc71',
                                transition: 'all 0.3s ease'
                            }}></div>
                        </div>
                        <p style={{
                            fontSize: '14px',
                            fontWeight: 'bold',
                            color: passwordStrength.level === 'low' ? '#e74c3c' :
                                   passwordStrength.level === 'medium' ? '#f39c12' :
                                   passwordStrength.level === 'good' ? '#3498db' : '#2ecc71'
                        }}>
                            Seguridad: {passwordStrength.text} ({passwordStrength.percentage}%)
                        </p>
                    </div>
                )}
            </div>

            <div style={{ marginTop: '30px', padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
                <h3>Información de Debug:</h3>
                <p><strong>Contraseña:</strong> {password || '(vacío)'}</p>
                <p><strong>Nivel:</strong> {passwordStrength.level || 'none'}</p>
                <p><strong>Texto:</strong> {passwordStrength.text || 'N/A'}</p>
                <p><strong>Porcentaje:</strong> {passwordStrength.percentage}%</p>
            </div>

            <div style={{ marginTop: '30px', padding: '20px', background: '#e3f2fd', borderRadius: '8px' }}>
                <h3>Prueba estas contraseñas:</h3>
                <ul>
                    <li><code>123456</code> - Baja (25%)</li>
                    <li><code>password123</code> - Media (40%)</li>
                    <li><code>Password123</code> - Buena (65%)</li>
                    <li><code>Password123!</code> - Excelente (80%)</li>
                </ul>
            </div>
        </div>
    );
};

export default TestRegister;
