import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './RegisterPage.css';

const RegisterPage = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Calcular la seguridad de la contraseña
    const passwordStrength = useMemo(() => {
        const password = formData.password;
        if (!password) return { level: 'none', text: '', percentage: 0 };

        let strength = 0;
        let text = '';
        let level = '';

        // Criterios de seguridad
        if (password.length >= 6) strength += 25;
        if (password.length >= 10) strength += 25;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 20;
        if (/\d/.test(password)) strength += 15;
        if (/[^a-zA-Z0-9]/.test(password)) strength += 15;

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
    }, [formData.password]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Validación especial para teléfono: solo números y máximo 9 dígitos
        if (name === 'telefono') {
            const numericValue = value.replace(/\D/g, '');
            if (numericValue.length <= 9) {
                setFormData(prev => ({
                    ...prev,
                    [name]: numericValue
                }));
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        // Debug: mostrar cuando cambia la contraseña
        if (name === 'password') {
            console.log('🔐 Contraseña cambiada:', value);
            console.log('📊 Nivel de seguridad:', passwordStrength);
        }

        // Limpiar error del campo cuando el usuario empieza a escribir
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Validar nombre
        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es requerido';
        } else if (formData.nombre.trim().length < 3) {
            newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
        }

        // Validar email
        if (!formData.email) {
            newErrors.email = 'El correo electrónico es requerido';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'El correo electrónico no es válido';
        }

        // Validar teléfono
        if (!formData.telefono) {
            newErrors.telefono = 'El teléfono es requerido';
        } else if (formData.telefono.length !== 9) {
            newErrors.telefono = 'El teléfono debe tener exactamente 9 dígitos';
        }

        // Validar contraseña
        if (!formData.password) {
            newErrors.password = 'La contraseña es requerida';
        } else if (formData.password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }

        // Validar confirmación de contraseña
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Debes confirmar tu contraseña';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            const userData = {
                nombre: formData.nombre,
                email: formData.email,
                telefono: formData.telefono,
                password: formData.password
            };

            const result = await register(userData);
            
            if (result.success) {
                setShowSuccessModal(true);
                // Redirigir después de 2.5 segundos
                setTimeout(() => {
                    navigate('/');
                }, 2500);
            } else {
                setErrors({ general: result.error || 'Error al registrar usuario' });
            }
        }
    };

    const closeModal = () => {
        setShowSuccessModal(false);
        navigate('/');
    };

    return (
        <div className="register-page">
            <Header />

            <div className="register-container">
                <div className="container">
                    <div className="register-content">
                        <div className="register-card fade-in">
                            <h1 className="register-title">Crear Cuenta</h1>
                            <p className="register-subtitle">Únete a nuestra comunidad</p>

                            <form onSubmit={handleSubmit} className="register-form">
                                <div className="form-group">
                                    <label htmlFor="nombre">Nombre completo</label>
                                    <input
                                        type="text"
                                        id="nombre"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        className={`form-input ${errors.nombre ? 'error' : ''}`}
                                        placeholder="Juan Pérez"
                                    />
                                    {errors.nombre && <span className="error-message">{errors.nombre}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">Correo electrónico</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`form-input ${errors.email ? 'error' : ''}`}
                                        placeholder="tu@email.com"
                                    />
                                    {errors.email && <span className="error-message">{errors.email}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="telefono">Teléfono (9 dígitos)</label>
                                    <input
                                        type="tel"
                                        id="telefono"
                                        name="telefono"
                                        value={formData.telefono}
                                        onChange={handleChange}
                                        className={`form-input ${errors.telefono ? 'error' : ''}`}
                                        placeholder="987654321"
                                        maxLength="9"
                                    />
                                    {errors.telefono && <span className="error-message">{errors.telefono}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="password">Contraseña</label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`form-input ${errors.password ? 'error' : ''}`}
                                        placeholder="••••••••"
                                    />
                                    {formData.password && formData.password.length > 0 && (
                                        <div className="password-strength" style={{
                                            marginTop: '12px',
                                            padding: '10px',
                                            background: '#f8f9fa',
                                            borderRadius: '8px'
                                        }}>
                                            <div className="strength-bar" style={{
                                                width: '100%',
                                                height: '8px',
                                                background: '#e9ecef',
                                                borderRadius: '4px',
                                                overflow: 'hidden',
                                                marginBottom: '8px'
                                            }}>
                                                <div
                                                    className={`strength-fill strength-${passwordStrength.level}`}
                                                    style={{
                                                        width: `${passwordStrength.percentage}%`,
                                                        height: '100%',
                                                        transition: 'all 0.3s ease',
                                                        background: passwordStrength.level === 'low' ? '#e74c3c' :
                                                            passwordStrength.level === 'medium' ? '#f39c12' :
                                                                passwordStrength.level === 'good' ? '#3498db' : '#2ecc71'
                                                    }}
                                                ></div>
                                            </div>
                                            <span className={`strength-text strength-${passwordStrength.level}`} style={{
                                                fontSize: '14px',
                                                fontWeight: '600',
                                                color: passwordStrength.level === 'low' ? '#e74c3c' :
                                                    passwordStrength.level === 'medium' ? '#f39c12' :
                                                        passwordStrength.level === 'good' ? '#3498db' : '#2ecc71'
                                            }}>
                                                Seguridad: {passwordStrength.text}
                                            </span>
                                        </div>
                                    )}
                                    {errors.password && <span className="error-message">{errors.password}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="confirmPassword">Confirmar contraseña</label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                                        placeholder="••••••••"
                                    />
                                    {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                                </div>

                                <button type="submit" className="register-btn pulse">
                                    Registrarse
                                </button>
                            </form>

                            <div className="register-footer">
                                <p>¿Ya tienes una cuenta? <Link to="/login" className="login-link">Inicia sesión aquí</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de éxito */}
            {showSuccessModal && (
                <div className="success-modal-overlay" onClick={closeModal}>
                    <div className="success-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="success-icon">
                            <svg viewBox="0 0 52 52" className="checkmark">
                                <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
                                <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                            </svg>
                        </div>
                        <h2 className="success-title">¡Registro Exitoso!</h2>
                        <p className="success-message">
                            Bienvenido <strong>{formData.nombre}</strong>.<br />
                            Tu cuenta ha sido creada exitosamente.<br />
                            Redirigiendo a la página principal...
                        </p>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default RegisterPage;
