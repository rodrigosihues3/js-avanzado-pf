-- Verificar estructura de la tabla pedidos
DESCRIBE pedidos;

-- Ver los últimos pedidos con sus descuentos
SELECT 
    id,
    cliente,
    fecha,
    subtotal,
    descuento,
    codigo_promo,
    total,
    estado
FROM pedidos 
ORDER BY fecha_creacion DESC 
LIMIT 10;

-- Verificar si las columnas existen
SHOW COLUMNS FROM pedidos LIKE 'descuento';
SHOW COLUMNS FROM pedidos LIKE 'codigo_promo';
