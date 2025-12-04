-- ============================================
-- CONSULTAS ÚTILES - SAN ISIDRO RESTAURANT
-- ============================================

USE sanisidro_db;

-- ============================================
-- PRODUCTOS
-- ============================================

-- Ver todos los productos
SELECT * FROM productos ORDER BY categoria, nombre;

-- Ver productos por categoría
SELECT * FROM productos WHERE categoria = 'platos';

-- Ver productos disponibles
SELECT * FROM productos WHERE disponible = true;

-- Agregar producto nuevo
INSERT INTO productos (nombre, descripcion, precio, categoria, disponible, imagen)
VALUES ('Nombre del Producto', 'Descripción', 25.90, 'platos', true, '/images/menu/imagen.jpg');

-- Actualizar precio de un producto
UPDATE productos SET precio = 30.00 WHERE id = 1;

-- Eliminar producto
DELETE FROM productos WHERE id = 1;

-- ============================================
-- USUARIOS
-- ============================================

-- Ver todos los usuarios
SELECT id, nombre, email, telefono, pedidos, activo, es_admin, fecha_creacion 
FROM usuarios 
ORDER BY fecha_creacion DESC;

-- Ver solo administradores
SELECT * FROM usuarios WHERE es_admin = true;

-- Crear usuario administrador
INSERT INTO usuarios (nombre, email, telefono, password, pedidos, activo, es_admin)
VALUES ('Admin', 'admin@sanisidro.com', '999999999', 'admin123', 0, true, true);

-- Convertir usuario en administrador
UPDATE usuarios SET es_admin = true WHERE email = 'usuario@ejemplo.com';

-- Desactivar usuario
UPDATE usuarios SET activo = false WHERE id = 1;

-- ============================================
-- PEDIDOS
-- ============================================

-- Ver todos los pedidos
SELECT id, cliente, email, fecha, hora, total, estado, metodo_pago
FROM pedidos 
ORDER BY fecha DESC, hora DESC;

-- Ver pedidos pendientes
SELECT * FROM pedidos WHERE estado = 'pendiente';

-- Ver pedidos de un cliente
SELECT * FROM pedidos WHERE email = 'cliente@ejemplo.com';

-- Actualizar estado de pedido
UPDATE pedidos SET estado = 'completado' WHERE id = 1;

-- Ver pedidos del día
SELECT * FROM pedidos WHERE fecha = CURDATE();

-- Total de ventas del día
SELECT SUM(total) as total_ventas FROM pedidos WHERE fecha = CURDATE();

-- ============================================
-- PROMOCIONES
-- ============================================

-- Ver todas las promociones
SELECT * FROM promociones ORDER BY fecha_inicio DESC;

-- Ver promociones activas
SELECT * FROM promociones WHERE activa = true;

-- Ver promociones vigentes hoy
SELECT * FROM promociones 
WHERE activa = true 
AND fecha_inicio <= CURDATE() 
AND fecha_fin >= CURDATE();

-- Crear promoción
INSERT INTO promociones (codigo, descripcion, descuento, tipo_promocion, fecha_inicio, fecha_fin, activa)
VALUES ('PROMO10', 'Descuento 10%', 10, 'general', '2025-01-01', '2025-12-31', true);

-- Desactivar promoción
UPDATE promociones SET activa = false WHERE id = 1;

-- ============================================
-- ESTADÍSTICAS
-- ============================================

-- Total de productos por categoría
SELECT categoria, COUNT(*) as total 
FROM productos 
GROUP BY categoria;

-- Total de pedidos por estado
SELECT estado, COUNT(*) as total 
FROM pedidos 
GROUP BY estado;

-- Ventas totales
SELECT SUM(total) as ventas_totales FROM pedidos;

-- Producto más vendido (requiere parsear JSON de detalles)
SELECT COUNT(*) as total_pedidos FROM pedidos;

-- Usuarios más activos
SELECT nombre, email, pedidos 
FROM usuarios 
WHERE pedidos > 0 
ORDER BY pedidos DESC 
LIMIT 10;

-- ============================================
-- MANTENIMIENTO
-- ============================================

-- Ver estructura de una tabla
DESCRIBE productos;
DESCRIBE usuarios;
DESCRIBE pedidos;
DESCRIBE promociones;

-- Contar registros en cada tabla
SELECT 'productos' as tabla, COUNT(*) as total FROM productos
UNION ALL
SELECT 'usuarios', COUNT(*) FROM usuarios
UNION ALL
SELECT 'pedidos', COUNT(*) FROM pedidos
UNION ALL
SELECT 'promociones', COUNT(*) FROM promociones;

-- Limpiar datos de prueba (¡CUIDADO!)
-- DELETE FROM pedidos WHERE cliente = 'Cliente Invitado';
-- DELETE FROM usuarios WHERE email LIKE '%test%';

-- ============================================
-- BACKUP Y RESTAURACIÓN
-- ============================================

-- Para hacer backup desde línea de comandos:
-- mysqldump -u root -p sanisidro_db > backup_sanisidro.sql

-- Para restaurar desde línea de comandos:
-- mysql -u root -p sanisidro_db < backup_sanisidro.sql


-- ============================================
-- ACTUALIZACIÓN DE ESQUEMA
-- ============================================

-- Agregar columna nombre_cliente a la tabla pedidos si no existe
ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS nombre_cliente VARCHAR(255) AFTER cliente;

-- Actualizar nombre_cliente con el valor de cliente para registros existentes
UPDATE pedidos SET nombre_cliente = cliente WHERE nombre_cliente IS NULL;
