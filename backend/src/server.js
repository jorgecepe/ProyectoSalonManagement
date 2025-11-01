// ================================================
// SERVER - Express + PostgreSQL
// Servidor principal con todas las rutas
// ================================================

const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// MIDDLEWARE
// ==========================================
app.use(cors());
app.use(express.json());

// Importar DB (esto hará el test de conexión)
const db = require('./config/database');

// ==========================================
// IMPORTAR RUTAS
// ==========================================
const clientsRoutes = require('./routes/clients');
const servicesRoutes = require('./routes/services');

// ==========================================
// RUTAS PRINCIPALES
// ==========================================

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: '✅ Tienda Online Management API',
    version: '1.0.0',
    status: 'running',
    project: 'Sistema de Gestión de Peluquería',
    endpoints: {
      health: '/api/health',
      clients: '/api/clients',
      services: '/api/services'
    }
  });
});

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({
      status: 'healthy',
      database: 'connected',
      timestamp: result.rows[0].now
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      database: 'disconnected',
      error: error.message
    });
  }
});

// ==========================================
// MONTAR RUTAS DE RECURSOS
// ==========================================
app.use('/api/clients', clientsRoutes);
app.use('/api/services', servicesRoutes);

// ==========================================
// MANEJO DE ERRORES
// ==========================================

// 404 - Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Ruta no encontrada',
    path: req.path,
    method: req.method
  });
});

// Error handler global
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({
    success: false,
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ==========================================
// INICIAR SERVIDOR
// ==========================================
app.listen(PORT, () => {
  console.log('\n' + '='.repeat(50));
  console.log('🚀 Servidor corriendo en http://localhost:' + PORT);
  console.log('='.repeat(50));
  console.log('\n📊 Endpoints disponibles:');
  console.log('   GET  http://localhost:' + PORT + '/');
  console.log('   GET  http://localhost:' + PORT + '/api/health');
  console.log('\n👥 Clientes:');
  console.log('   GET    http://localhost:' + PORT + '/api/clients');
  console.log('   GET    http://localhost:' + PORT + '/api/clients/:id');
  console.log('   GET    http://localhost:' + PORT + '/api/clients/search?q=término');
  console.log('   GET    http://localhost:' + PORT + '/api/clients/:id/history');
  console.log('   POST   http://localhost:' + PORT + '/api/clients');
  console.log('   PUT    http://localhost:' + PORT + '/api/clients/:id');
  console.log('   DELETE http://localhost:' + PORT + '/api/clients/:id');
  console.log('\n💈 Servicios:');
  console.log('   GET    http://localhost:' + PORT + '/api/services');
  console.log('   GET    http://localhost:' + PORT + '/api/services/:id');
  console.log('   GET    http://localhost:' + PORT + '/api/services/popular');
  console.log('   POST   http://localhost:' + PORT + '/api/services');
  console.log('   PUT    http://localhost:' + PORT + '/api/services/:id');
  console.log('   PATCH  http://localhost:' + PORT + '/api/services/:id/activate');
  console.log('   DELETE http://localhost:' + PORT + '/api/services/:id');
  console.log('\n' + '='.repeat(50) + '\n');
});

// Cerrar conexiones al terminar
process.on('SIGINT', async () => {
  console.log('\n🛑 Cerrando servidor...');
  await db.pool.end();
  process.exit(0);
});