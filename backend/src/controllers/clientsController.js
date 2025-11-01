// ================================================
// CONTROLLER: Clientes
// Lógica de negocio para gestión de clientes
// ================================================

const db = require('../config/database');

// ==========================================
// GET ALL - Obtener todos los clientes
// ==========================================
const getAllClients = async (req, res) => {
  try {
    // Query con ordenamiento
    const result = await db.query(
      'SELECT * FROM clients ORDER BY created_at DESC'
    );

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener clientes'
    });
  }
};

// ==========================================
// GET ONE - Obtener un cliente específico
// ==========================================
const getClientById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      'SELECT * FROM clients WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: `Cliente con ID ${id} no encontrado`
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error al obtener cliente:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener cliente'
    });
  }
};

// ==========================================
// CREATE - Crear nuevo cliente
// ==========================================
const createClient = async (req, res) => {
  try {
    const { name, email, phone, notes } = req.body;

    // Validaciones básicas
    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        error: 'Nombre y teléfono son obligatorios'
      });
    }

    // Validar email si se proporciona
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          error: 'Email inválido'
        });
      }
    }

    // Validar formato de teléfono básico
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        error: 'Formato de teléfono inválido'
      });
    }

    // Insertar cliente (RETURNING devuelve el cliente creado)
    const result = await db.query(
      `INSERT INTO clients (name, email, phone, notes)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, email || null, phone, notes || null]
    );

    res.status(201).json({
      success: true,
      message: 'Cliente creado exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error al crear cliente:', error);

    // Manejar error de email duplicado
    if (error.code === '23505' && error.constraint === 'clients_email_key') {
      return res.status(409).json({
        success: false,
        error: 'Ya existe un cliente con ese email'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Error al crear cliente'
    });
  }
};

// ==========================================
// UPDATE - Actualizar cliente existente
// ==========================================
const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, notes } = req.body;

    // Verificar que el cliente existe
    const checkClient = await db.query(
      'SELECT id FROM clients WHERE id = $1',
      [id]
    );

    if (checkClient.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: `Cliente con ID ${id} no encontrado`
      });
    }

    // Validar email si se proporciona
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          error: 'Email inválido'
        });
      }
    }

    // Validar teléfono si se proporciona
    if (phone) {
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({
          success: false,
          error: 'Formato de teléfono inválido'
        });
      }
    }

    // Actualizar solo los campos proporcionados
    const result = await db.query(
      `UPDATE clients 
       SET name = COALESCE($1, name),
           email = COALESCE($2, email),
           phone = COALESCE($3, phone),
           notes = COALESCE($4, notes),
           updated_at = NOW()
       WHERE id = $5
       RETURNING *`,
      [name, email, phone, notes, id]
    );

    res.json({
      success: true,
      message: 'Cliente actualizado exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error al actualizar cliente:', error);

    // Manejar error de email duplicado
    if (error.code === '23505' && error.constraint === 'clients_email_key') {
      return res.status(409).json({
        success: false,
        error: 'Ya existe otro cliente con ese email'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Error al actualizar cliente'
    });
  }
};

// ==========================================
// DELETE - Eliminar cliente
// ==========================================
const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si el cliente tiene citas
    const appointments = await db.query(
      'SELECT COUNT(*) as count FROM appointments WHERE client_id = $1',
      [id]
    );

    const appointmentCount = parseInt(appointments.rows[0].count);

    if (appointmentCount > 0) {
      return res.status(409).json({
        success: false,
        error: `No se puede eliminar. El cliente tiene ${appointmentCount} cita(s) registrada(s)`,
        appointmentCount
      });
    }

    // Eliminar cliente
    const result = await db.query(
      'DELETE FROM clients WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: `Cliente con ID ${id} no encontrado`
      });
    }

    res.json({
      success: true,
      message: 'Cliente eliminado exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error al eliminar cliente:', error);
    res.status(500).json({
      success: false,
      error: 'Error al eliminar cliente'
    });
  }
};

// ==========================================
// GET CLIENT HISTORY - Historial de citas
// ==========================================
const getClientHistory = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el cliente existe
    const checkClient = await db.query(
      'SELECT * FROM clients WHERE id = $1',
      [id]
    );

    if (checkClient.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: `Cliente con ID ${id} no encontrado`
      });
    }

    // Obtener historial de citas
    const result = await db.query(
      `SELECT 
        a.id,
        a.appointment_datetime,
        a.status,
        a.notes,
        s.name as staff_name,
        srv.name as service_name,
        srv.price
      FROM appointments a
      LEFT JOIN staff s ON a.staff_id = s.id
      LEFT JOIN services srv ON a.service_id = srv.id
      WHERE a.client_id = $1
      ORDER BY a.appointment_datetime DESC`,
      [id]
    );

    res.json({
      success: true,
      client: checkClient.rows[0],
      appointments: result.rows,
      totalAppointments: result.rows.length
    });
  } catch (error) {
    console.error('Error al obtener historial:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener historial del cliente'
    });
  }
};

// ==========================================
// SEARCH - Buscar clientes
// ==========================================
const searchClients = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Parámetro de búsqueda "q" es requerido'
      });
    }

    const searchTerm = `%${q}%`;
    const result = await db.query(
      `SELECT * FROM clients 
       WHERE name ILIKE $1 
          OR email ILIKE $1 
          OR phone ILIKE $1
       ORDER BY name`,
      [searchTerm]
    );

    res.json({
      success: true,
      count: result.rows.length,
      searchTerm: q,
      data: result.rows
    });
  } catch (error) {
    console.error('Error al buscar clientes:', error);
    res.status(500).json({
      success: false,
      error: 'Error al buscar clientes'
    });
  }
};

// ==========================================
// EXPORTAR FUNCIONES
// ==========================================
module.exports = {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  getClientHistory,
  searchClients
};