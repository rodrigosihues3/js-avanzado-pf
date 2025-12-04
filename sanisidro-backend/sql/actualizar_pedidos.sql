-- Script para actualizar la tabla pedidos con todos los campos necesarios

-- Agregar columna nombre_cliente si no existe
ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS nombre_cliente VARCHAR(255);

-- Agregar columna metodo_pago si no existe (con guion bajo)
ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS metodo_pago VARCHAR(50);

-- Aumentar tamaño de la columna detalles si es necesario
ALTER TABLE pedidos 
MODIFY COLUMN detalles VARCHAR(5000);

-- Verificar estructura de la tabla
DESCRIBE pedidos;

-- Consultar pedidos existentes
SELECT * FROM pedidos ORDER BY fecha_creacion DESC LIMIT 10;
