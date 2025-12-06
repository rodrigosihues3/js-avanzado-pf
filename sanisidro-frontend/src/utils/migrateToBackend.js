import axios from 'axios';

const API_URL = 'http://104.197.34.63:8080/api';

// Función principal de migración
export const migrateLocalStorageToBackend = async () => {
  const results = {
    productos: { success: 0, errors: 0 },
    usuarios: { success: 0, errors: 0 },
    promociones: { success: 0, errors: 0 },
    pedidos: { success: 0, errors: 0 }
  };

  console.log('🚀 Iniciando migración de localStorage a MySQL...');

  try {
    // 1. Migrar Productos
    console.log('\n📦 Migrando productos...');
    const productos = JSON.parse(localStorage.getItem('adminProducts') || '[]');
    for (const producto of productos) {
      try {
        await axios.post(`${API_URL}/productos`, {
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          precio: parseFloat(producto.precio),
          categoria: producto.categoria,
          disponible: producto.disponible,
          imagen: producto.imagen
        });
        results.productos.success++;
        console.log(`✅ Producto migrado: ${producto.nombre}`);
      } catch (error) {
        results.productos.errors++;
        console.error(`❌ Error migrando producto ${producto.nombre}:`, error.response?.data || error.message);
      }
    }

    // 2. Migrar Usuarios
    console.log('\n👥 Migrando usuarios...');
    const usuarios = JSON.parse(localStorage.getItem('adminUsers') || '[]');
    for (const usuario of usuarios) {
      try {
        await axios.post(`${API_URL}/usuarios/registro`, {
          nombre: usuario.nombre,
          email: usuario.email,
          telefono: usuario.telefono,
          password: 'password123', // Contraseña por defecto
          pedidos: usuario.pedidos || 0,
          fechaRegistro: usuario.fechaRegistro,
          activo: usuario.activo !== false,
          esAdmin: false
        });
        results.usuarios.success++;
        console.log(`✅ Usuario migrado: ${usuario.nombre}`);
      } catch (error) {
        results.usuarios.errors++;
        console.error(`❌ Error migrando usuario ${usuario.nombre}:`, error.response?.data || error.message);
      }
    }

    // 3. Migrar Promociones
    console.log('\n🎁 Migrando promociones...');
    const promociones = JSON.parse(localStorage.getItem('adminPromotions') || '[]');
    for (const promo of promociones) {
      try {
        await axios.post(`${API_URL}/promociones`, {
          codigo: promo.codigo,
          descripcion: promo.descripcion,
          descuento: parseFloat(promo.descuento),
          tipoPromocion: promo.tipoPromocion || 'general',
          productosAplicables: promo.productosAplicables ? promo.productosAplicables.join(',') : null,
          montoMinimo: promo.montoMinimo || 0,
          cantidadMinima: promo.cantidadMinima || 0,
          fechaInicio: promo.fechaInicio,
          fechaFin: promo.fechaFin,
          activa: promo.activa !== false
        });
        results.promociones.success++;
        console.log(`✅ Promoción migrada: ${promo.codigo}`);
      } catch (error) {
        results.promociones.errors++;
        console.error(`❌ Error migrando promoción ${promo.codigo}:`, error.response?.data || error.message);
      }
    }

    // 4. Migrar Pedidos
    console.log('\n📋 Migrando pedidos...');
    const pedidos = JSON.parse(localStorage.getItem('adminOrders') || '[]');
    for (const pedido of pedidos) {
      try {
        await axios.post(`${API_URL}/pedidos`, {
          cliente: pedido.cliente,
          email: pedido.email,
          telefono: pedido.telefono,
          numeroFactura: pedido.numeroFactura,
          fecha: pedido.fecha,
          hora: pedido.hora || '00:00:00',
          subtotal: parseFloat(pedido.subtotal),
          descuento: parseFloat(pedido.descuento || 0),
          codigoPromo: pedido.codigoPromo,
          total: parseFloat(pedido.total),
          estado: pedido.estado || 'pendiente',
          metodoPago: pedido.metodoPago,
          detalles: JSON.stringify(pedido.detalles || [])
        });
        results.pedidos.success++;
        console.log(`✅ Pedido migrado: ${pedido.numeroFactura}`);
      } catch (error) {
        results.pedidos.errors++;
        console.error(`❌ Error migrando pedido ${pedido.numeroFactura}:`, error.response?.data || error.message);
      }
    }

    // Resumen final
    console.log('\n' + '='.repeat(50));
    console.log('📊 RESUMEN DE MIGRACIÓN');
    console.log('='.repeat(50));
    console.log(`✅ Productos: ${results.productos.success} exitosos, ${results.productos.errors} errores`);
    console.log(`✅ Usuarios: ${results.usuarios.success} exitosos, ${results.usuarios.errors} errores`);
    console.log(`✅ Promociones: ${results.promociones.success} exitosos, ${results.promociones.errors} errores`);
    console.log(`✅ Pedidos: ${results.pedidos.success} exitosos, ${results.pedidos.errors} errores`);
    console.log('='.repeat(50));

    const totalSuccess = results.productos.success + results.usuarios.success + 
                        results.promociones.success + results.pedidos.success;
    const totalErrors = results.productos.errors + results.usuarios.errors + 
                       results.promociones.errors + results.pedidos.errors;

    console.log(`\n🎉 Migración completada: ${totalSuccess} registros migrados, ${totalErrors} errores`);

    return results;

  } catch (error) {
    console.error('❌ Error general en la migración:', error);
    throw error;
  }
};

// Función para verificar datos migrados
export const verificarMigracion = async () => {
  console.log('\n🔍 Verificando datos migrados...');
  
  try {
    const productos = await axios.get(`${API_URL}/productos`);
    const usuarios = await axios.get(`${API_URL}/usuarios`);
    const promociones = await axios.get(`${API_URL}/promociones`);
    const pedidos = await axios.get(`${API_URL}/pedidos`);

    console.log(`📦 Productos en BD: ${productos.data.length}`);
    console.log(`👥 Usuarios en BD: ${usuarios.data.length}`);
    console.log(`🎁 Promociones en BD: ${promociones.data.length}`);
    console.log(`📋 Pedidos en BD: ${pedidos.data.length}`);

    return {
      productos: productos.data.length,
      usuarios: usuarios.data.length,
      promociones: promociones.data.length,
      pedidos: pedidos.data.length
    };
  } catch (error) {
    console.error('❌ Error verificando migración:', error);
    throw error;
  }
};
