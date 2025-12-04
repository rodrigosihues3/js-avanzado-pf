-- Script para asegurar que la tabla pedidos tenga las columnas de descuento

-- Verificar si existe la columna descuento
SELECT COUNT(*) 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'sanisidro_db' 
  AND TABLE_NAME = 'pedidos' 
  AND COLUMN_NAME = 'descuento';

-- Agregar columna descuento si no existe
ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS descuento DOUBLE DEFAULT 0.0;

-- Verificar si existe la columna codigo_promo
SELECT COUNT(*) 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'sanisidro_db' 
  AND TABLE_NAME = 'pedidos' 
  AND COLUMN_NAME = 'codigo_promo';

-- Agregar columna codigo_promo si no existe
ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS codigo_promo VARCHAR(50);

-- Verificar estructura final
DESCRIBE pedidos;

-- Probar inserción de pedido con descuento
-- INSERT INTO pedidos (cliente, nombre_cliente, email, numero_factura, fecha, hora, subtotal, descuento, codigo_promo, total, estado, metodo_pago, detalles)
-- VALUES ('Test', 'Test Cliente', 'test@test.com', 'TEST-001', CURDATE(), CURTIME(), 50.00, 5.00, 'PROMO10', 45.00, 'pendiente', 'efectivo', '[]');

-- Ver últimos pedidos
SELECT id, cliente, fecha, subtotal, descuento, codigo_promo, total, estado
FROM pedidos 
ORDER BY fecha_creacion DESC 
LIMIT 5;
