// ================================================
// ROUTES: Clientes
// Definición de rutas para endpoints de clientes
// ================================================

const express = require('express');
const router = express.Router();
const clientsController = require('../controllers/clientsController');

// ==========================================
// RUTAS CRUD BÁSICAS
// ==========================================

// GET /api/clients - Obtener todos los clientes
router.get('/', clientsController.getAllClients);

// GET /api/clients/search?q=término - Buscar clientes
router.get('/search', clientsController.searchClients);

// GET /api/clients/:id - Obtener un cliente específico
router.get('/:id', clientsController.getClientById);

// GET /api/clients/:id/history - Historial de citas del cliente
router.get('/:id/history', clientsController.getClientHistory);

// POST /api/clients - Crear nuevo cliente
router.post('/', clientsController.createClient);

// PUT /api/clients/:id - Actualizar cliente
router.put('/:id', clientsController.updateClient);

// DELETE /api/clients/:id - Eliminar cliente
router.delete('/:id', clientsController.deleteClient);

// ==========================================
// EXPORTAR ROUTER
// ==========================================
module.exports = router;