// ================================================
// ROUTES: Servicios
// Definición de rutas para endpoints de servicios
// ================================================

const express = require('express');
const router = express.Router();
const servicesController = require('../controllers/servicesController');

// ==========================================
// RUTAS CRUD BÁSICAS
// ==========================================

// GET /api/services - Obtener todos los servicios
// Query params: ?active=true/false
router.get('/', servicesController.getAllServices);

// GET /api/services/popular - Servicios más solicitados
router.get('/popular', servicesController.getPopularServices);

// GET /api/services/:id - Obtener un servicio específico
router.get('/:id', servicesController.getServiceById);

// POST /api/services - Crear nuevo servicio
router.post('/', servicesController.createService);

// PUT /api/services/:id - Actualizar servicio
router.put('/:id', servicesController.updateService);

// PATCH /api/services/:id/activate - Reactivar servicio
router.patch('/:id/activate', servicesController.activateService);

// DELETE /api/services/:id - Eliminar servicio (soft delete por defecto)
// Query params: ?permanent=true para eliminación permanente
router.delete('/:id', servicesController.deleteService);

// ==========================================
// EXPORTAR ROUTER
// ==========================================
module.exports = router;