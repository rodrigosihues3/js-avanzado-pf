import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import './InvoiceModal.css';

const InvoiceModal = ({ isOpen, onClose, orderData }) => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  if (!isOpen || !orderData) return null;

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(200, 232, 108);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setFontSize(24);
    doc.setTextColor(44, 62, 80);
    doc.text('RESTAURANTE SAN ISIDRO', 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text('Av San Martín 1149, Ica - Perú', 105, 28, { align: 'center' });
    doc.text('Tel: +51 56 237012 | www.sanisidro.com', 105, 34, { align: 'center' });
    
    // Invoice info
    doc.setFontSize(16);
    doc.setTextColor(44, 62, 80);
    doc.text('BOLETA DE VENTA', 105, 55, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text(`N° ${orderData.invoiceNumber}`, 20, 70);
    doc.text(`Fecha: ${orderData.date}`, 20, 76);
    doc.text(`Hora: ${orderData.time}`, 20, 82);
    
    // Mostrar nombre del cliente si está disponible
    if (orderData.customerName) {
      doc.text(`Cliente: ${orderData.customerName}`, 20, 88);
    }
    
    const paymentMethodText = orderData.paymentMethod === 'card' ? 'Tarjeta de Débito/Crédito' : 'Yape';
    const paymentY = orderData.customerName ? 94 : 88;
    doc.text(`Método de Pago: ${paymentMethodText}`, 20, paymentY);
    
    // Items table
    const tableData = orderData.items.map(item => [
      item.nombre,
      item.cantidad.toString(),
      `S/ ${item.precio.toFixed(2)}`,
      `S/ ${(item.precio * item.cantidad).toFixed(2)}`
    ]);
    
    const tableStartY = orderData.customerName ? 106 : 100;
    let finalY = tableStartY;
    
    autoTable(doc, {
      startY: tableStartY,
      head: [['Producto', 'Cantidad', 'Precio Unit.', 'Subtotal']],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: [74, 144, 226],
        textColor: 255,
        fontSize: 11,
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 10,
        cellPadding: 5
      },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 30, halign: 'center' },
        2: { cellWidth: 40, halign: 'right' },
        3: { cellWidth: 40, halign: 'right' }
      },
      didDrawPage: function (data) {
        finalY = data.cursor.y;
      }
    });
    
    // Totals
    finalY = finalY + 10;
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    
    if (orderData.subtotal) {
      doc.text(`Subtotal: S/ ${orderData.subtotal.toFixed(2)}`, 190, finalY, { align: 'right' });
      finalY += 6;
    }
    
    if (orderData.descuento > 0) {
      doc.setTextColor(220, 53, 69);
      const discountText = orderData.codigoPromo 
        ? `Descuento (${orderData.codigoPromo}): - S/ ${orderData.descuento.toFixed(2)}`
        : `Descuento: - S/ ${orderData.descuento.toFixed(2)}`;
      doc.text(discountText, 190, finalY, { align: 'right' });
      finalY += 8;
      doc.setTextColor(44, 62, 80);
    }
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(`TOTAL: S/ ${orderData.total.toFixed(2)}`, 190, finalY, { align: 'right' });
    
    // Footer
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(108, 117, 125);
    doc.text('¡Gracias por su compra!', 105, finalY + 20, { align: 'center' });
    doc.text('Conserve esta boleta para cualquier reclamo', 105, finalY + 26, { align: 'center' });
    
    doc.save(`Boleta_${orderData.invoiceNumber}.pdf`);
    
    // Mostrar mensaje de éxito
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  const getPaymentMethodText = (method) => {
    return method === 'card' ? 'Tarjeta de Débito/Crédito' : 'Yape';
  };

  return (
    <div className="invoice-modal-overlay" onClick={onClose}>
      <div className="invoice-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="invoice-modal-close" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>

        <div className="invoice-success-icon">
          <i className="fas fa-check-circle"></i>
        </div>

        <h2 className="invoice-title">¡Compra Exitosa!</h2>
        <p className="invoice-subtitle">Tu pedido ha sido procesado correctamente</p>

        <div className="invoice-container">
          <div className="invoice-header">
            <div className="restaurant-info">
              <h3>RESTAURANTE SAN ISIDRO</h3>
              <p>Av San Martín 1149, Ica - Perú</p>
              <p>Tel: +51 56 237012</p>
            </div>
            <div className="invoice-info">
              <h4>BOLETA DE VENTA</h4>
              <p>N° {orderData.invoiceNumber}</p>
              <p>{orderData.date} - {orderData.time}</p>
            </div>
          </div>

          <div className="invoice-payment-method">
            <i className="fas fa-credit-card"></i>
            <span>Método de Pago: {getPaymentMethodText(orderData.paymentMethod)}</span>
          </div>

          <div className="invoice-items">
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cant.</th>
                  <th>Precio</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {orderData.items.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <div className="item-name">{item.nombre}</div>
                      {item.comentarios && (
                        <div className="item-comments">
                          <i className="fas fa-comment-dots"></i> {item.comentarios}
                        </div>
                      )}
                    </td>
                    <td className="text-center">{item.cantidad}</td>
                    <td className="text-right">S/ {item.precio.toFixed(2)}</td>
                    <td className="text-right">S/ {(item.precio * item.cantidad).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="invoice-totals">
            {orderData.subtotal && (
              <div className="invoice-subtotal">
                <span>Subtotal</span>
                <span>S/ {orderData.subtotal.toFixed(2)}</span>
              </div>
            )}
            {orderData.descuento > 0 && (
              <div className="invoice-discount">
                <span>
                  Descuento {orderData.codigoPromo && `(${orderData.codigoPromo})`}
                </span>
                <span className="discount-amount">- S/ {orderData.descuento.toFixed(2)}</span>
              </div>
            )}
            <div className="invoice-total">
              <span>TOTAL</span>
              <span className="total-amount">S/ {orderData.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="invoice-footer">
            <p>¡Gracias por su compra!</p>
            <p>Conserve esta boleta para cualquier reclamo</p>
          </div>
        </div>

        <div className="invoice-actions">
          <button className="btn-download" onClick={downloadPDF}>
            <i className="fas fa-download"></i> Descargar PDF
          </button>
          <button className="btn-close" onClick={onClose}>
            Cerrar
          </button>
        </div>

        {showSuccessMessage && (
          <div className="download-success-message">
            <i className="fas fa-check-circle"></i>
            <span>La boleta se ha descargado exitosamente</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceModal;
