import React, { useState } from 'react';
import './PaymentModal.css';

const PaymentModal = ({ isOpen, onClose, onConfirm, total }) => {
    const [selectedMethod, setSelectedMethod] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [yapeNumber, setYapeNumber] = useState('');
    const [yapeName, setYapeName] = useState('');
    const [yapeCode, setYapeCode] = useState('');
    const [expiryError, setExpiryError] = useState('');

    if (!isOpen) return null;

    const validateExpiryDate = (date) => {
        if (date.length !== 5) return false;

        const [month, year] = date.split('/');
        const expMonth = parseInt(month, 10);
        const expYear = parseInt('20' + year, 10);

        if (expMonth < 1 || expMonth > 12) {
            return false;
        }

        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;

        if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
            return false;
        }

        return true;
    };

    const formatCardNumber = (value) => {
        const numbers = value.replace(/\D/g, '');
        const groups = numbers.match(/.{1,4}/g);
        return groups ? groups.join(' ') : numbers;
    };

    const handleCardNumberChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        if (value.length <= 16) {
            setCardNumber(formatCardNumber(value));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!selectedMethod) {
            alert('Por favor selecciona un método de pago');
            return;
        }

        if (selectedMethod === 'card') {
            if (!cardNumber || !cardName || !expiryDate || !cvv) {
                alert('Por favor completa todos los campos de la tarjeta');
                return;
            }

            if (!validateExpiryDate(expiryDate)) {
                setExpiryError('La fecha de vencimiento no es válida o tu tarjeta ya expiró');
                return;
            }

            if (cardNumber.replace(/\s/g, '').length !== 16) {
                alert('El número de tarjeta debe tener 16 dígitos');
                return;
            }
        }

        if (selectedMethod === 'yape') {
            if (!yapeNumber || !yapeName || !yapeCode) {
                alert('Por favor completa todos los campos de Yape');
                return;
            }

            if (yapeNumber.length !== 9) {
                alert('El número de Yape debe tener 9 dígitos');
                return;
            }

            if (yapeCode.length !== 6) {
                alert('El código de verificación debe tener 6 dígitos');
                return;
            }
        }

        // Enviar método de pago y datos del titular
        const paymentData = {
            method: selectedMethod,
            holderName: selectedMethod === 'card' ? cardName : yapeName,
            phone: selectedMethod === 'yape' ? yapeNumber : null
        };
        onConfirm(paymentData);
    };

    return (
        <div className="payment-modal-overlay" onClick={onClose}>
            <div className="payment-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="payment-modal-close" onClick={onClose}>
                    <i className="fas fa-times"></i>
                </button>

                <h2 className="payment-modal-title">
                    <i className="fas fa-credit-card"></i> Método de Pago
                </h2>

                <div className="payment-total">
                    <span>Total a pagar:</span>
                    <span className="payment-amount">S/ {total.toFixed(2)}</span>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="payment-methods">
                        <div
                            className={`payment-method-option ${selectedMethod === 'card' ? 'selected' : ''}`}
                            onClick={() => setSelectedMethod('card')}
                        >
                            <div className="payment-method-header">
                                <i className="fas fa-credit-card"></i>
                                <span>Tarjeta de Débito/Crédito</span>
                            </div>
                            <div className="payment-method-radio">
                                <input
                                    type="radio"
                                    name="payment"
                                    value="card"
                                    checked={selectedMethod === 'card'}
                                    onChange={() => setSelectedMethod('card')}
                                />
                            </div>
                        </div>

                        <div
                            className={`payment-method-option ${selectedMethod === 'yape' ? 'selected' : ''}`}
                            onClick={() => setSelectedMethod('yape')}
                        >
                            <div className="payment-method-header">
                                <i className="fas fa-mobile-alt"></i>
                                <span>Yape</span>
                            </div>
                            <div className="payment-method-radio">
                                <input
                                    type="radio"
                                    name="payment"
                                    value="yape"
                                    checked={selectedMethod === 'yape'}
                                    onChange={() => setSelectedMethod('yape')}
                                />
                            </div>
                        </div>
                    </div>

                    {selectedMethod === 'card' && (
                        <div className="payment-form">
                            <div className="form-group">
                                <label>Número de Tarjeta</label>
                                <input
                                    type="text"
                                    placeholder="1234 5678 9012 3456"
                                    value={cardNumber}
                                    onChange={handleCardNumberChange}
                                    maxLength="19"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Nombre del Titular</label>
                                <input
                                    type="text"
                                    placeholder="Como aparece en la tarjeta"
                                    value={cardName}
                                    onChange={(e) => setCardName(e.target.value.toUpperCase())}
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Fecha de Vencimiento</label>
                                    <input
                                        type="text"
                                        placeholder="MM/AA"
                                        value={expiryDate}
                                        onChange={(e) => {
                                            setExpiryError('');
                                            let value = e.target.value.replace(/\D/g, '');
                                            if (value.length >= 2) {
                                                value = value.slice(0, 2) + '/' + value.slice(2, 4);
                                            }
                                            setExpiryDate(value);
                                        }}
                                        maxLength="5"
                                        className={expiryError ? 'input-error' : ''}
                                        required
                                    />
                                    {expiryError && (
                                        <div className="error-message">
                                            <i className="fas fa-exclamation-circle"></i> {expiryError}
                                        </div>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label>CVV</label>
                                    <input
                                        type="text"
                                        placeholder="123"
                                        value={cvv}
                                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                                        maxLength="3"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {selectedMethod === 'yape' && (
                        <div className="payment-form">
                            <div className="yape-info">
                                <i className="fas fa-info-circle"></i>
                                <p>Realiza el pago a través de la app Yape al número que se mostrará en la boleta</p>
                            </div>

                            <div className="form-group">
                                <label>Nombre Completo</label>
                                <input
                                    type="text"
                                    placeholder="Tu nombre completo"
                                    value={yapeName}
                                    onChange={(e) => setYapeName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Tu número de Yape</label>
                                <input
                                    type="text"
                                    placeholder="987654321"
                                    value={yapeNumber}
                                    onChange={(e) => setYapeNumber(e.target.value.replace(/\D/g, '').slice(0, 9))}
                                    maxLength="9"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Código de Verificación (6 dígitos)</label>
                                <input
                                    type="text"
                                    placeholder="123456"
                                    value={yapeCode}
                                    onChange={(e) => setYapeCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    maxLength="6"
                                    required
                                />
                                <small className="form-hint">
                                    <i className="fas fa-info-circle"></i> Código de confirmación de Yape
                                </small>
                            </div>
                        </div>
                    )}

                    <div className="payment-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn-confirm">
                            <i className="fas fa-check"></i> Confirmar Pago
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PaymentModal;
