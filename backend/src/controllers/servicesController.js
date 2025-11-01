// ================================================
// CONTROLLER: Servicios
// Lógica de negocio para gestión de servicios
// ================================================

const db = require('../config/database');

// ==========================================
// GET ALL - Obtener todos los servicios
// ==========================================
const getAllServices = async (req, res) => {
  try {
    const { active } = req.query;

    let query = 'SELECT * FROM services';
    const params = [];

    // Filtrar por servicios activos si se especifica
    if (active === 'true') {
      query += ' WHERE is_active = true';
    } else if (active === 'false') {
      query += ' WHERE is_active = false';
    }

    query += ' ORDER BY name';

    const result = await db.query(query, params);

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Error al obtener servicios:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener servicios'
    });
  }
};

// ==========================================
// GET ONE - Obtener un servicio específico
// ==========================================
const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      'SELECT * FROM services WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: `Servicio con ID ${id} no encontrado`
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error al obtener servicio:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener servicio'
    });
  }
};

// ==========================================
// CREATE - Crear nuevo servicio
// ==========================================
const createService = async (req, res) => {
  try {
    const { name, description, duration_minutes, price } = req.body;

    // Validaciones
    if (!name || !duration_minutes || price === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Nombre, duración y precio son obligatorios'
      });
    }

    // Validar duración positiva
    if (duration_minutes <= 0) {
      return res.status(400).json({
        success: false,
        error: 'La duración debe ser mayor a 0 minutos'
      });
    }

    // Validar precio positivo
    if (price < 0) {
      return res.status(400).json({
        success: false,
        error: 'El precio no puede ser negativo'
      });
    }

    // Validar duración razonable (máximo 8 horas = 480 minutos)
    if (duration_minutes > 480) {
      return res.status(400).json({
        success: false,
        error: 'La duración no puede exceder 480 minutos (8 horas)'
      });
    }

    // Insertar servicio
    const result = await db.query(
      `INSERT INTO services (name, description, duration_minutes, price)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, description || null, duration_minutes, price]
    );

    res.status(201).json({
      success: true,
      message: 'Servicio creado exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error al crear servicio:', error);
    res.status(500).json({
      success: false,
      error: 'Error al crear servicio'
    });
  }
};

// ==========================================
// UPDATE - Actualizar servicio
// ==========================================
const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, duration_minutes, price, is_active } = req.body;

    // Verificar que el servicio existe
    const checkService = await db.query(
      'SELECT id FROM services WHERE id = $1',
      [id]
    );

    if (checkService.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: `Servicio con ID ${id} no encontrado`
      });
    }

    // Validar duración si se proporciona
    if (duration_minutes !== undefined) {
      if (duration_minutes <= 0 || duration_minutes > 480) {
        return res.status(400).json({
          success: false,
          error: 'La duración debe estar entre 1 y 480 minutos'
        });
      }
    }

    // Validar precio si se proporciona
    if (price !== undefined && price < 0) {
      return res.status(400).json({
        success: false,
        error: 'El precio no puede ser negativo'
      });
    }

    // Actualizar servicio
    const result = await db.query(
      `UPDATE services 
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           duration_minutes = COALESCE($3, duration_minutes),
           price = COALESCE($4, price),
           is_active = COALESCE($5, is_active)
       WHERE id = $6
       RETURNING *`,
      [name, description, duration_minutes, price, is_active, id]
    );

    res.json({
      success: true,
      message: 'Servicio actualizado exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error al actualizar servicio:', error);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar servicio'
    });
  }
};

// ==========================================
// DELETE - Eliminar servicio (soft delete)
// ==========================================
const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const { permanent } = req.query;

    // Verificar si el servicio tiene citas
    const appointments = await db.query(
      `SELECT COUNT(*) as count FROM appointments 
       WHERE service_id = $1 AND status NOT IN ('cancelled', 'no_show')`,
      [id]
    );

    const appointmentCount = parseInt(appointments.rows[0].count);

    // Si tiene citas activas, no permitir eliminación permanente
    if (appointmentCount > 0 && permanent === 'true') {
      return res.status(409).json({
        success: false,
        error: `No se puede eliminar permanentemente. El servicio tiene ${appointmentCount} cita(s) activa(s)`,
        appointmentCount,
        suggestion: 'Usa soft delete (is_active = false) en su lugar'
      });
    }

    let result;

    if (permanent === 'true') {
      // Eliminación permanente
      result = await db.query(
        'DELETE FROM services WHERE id = $1 RETURNING *',
        [id]
      );
    } else {
      // Soft delete (marcar como inactivo)
      result = await db.query(
        'UPDATE services SET is_active = false WHERE id = $1 RETURNING *',
        [id]
      );
    }

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: `Servicio con ID ${id} no encontrado`
      });
    }

    res.json({
      success: true,
      message: permanent === 'true' 
        ? 'Servicio eliminado permanentemente' 
        : 'Servicio desactivado exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error al eliminar servicio:', error);
    res.status(500).json({
      success: false,
      error: 'Error al eliminar servicio'
    });
  }
};

// ==========================================
// ACTIVATE - Reactivar servicio
// ==========================================
const activateService = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      'UPDATE services SET is_active = true WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: `Servicio con ID ${id} no encontrado`
      });
    }

    res.json({
      success: true,
      message: 'Servicio activado exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error al activar servicio:', error);
    res.status(500).json({
      success: false,
      error: 'Error al activar servicio'
    });
  }
};

// ==========================================
// GET POPULAR - Servicios más solicitados
// ==========================================
const getPopularServices = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const result = await db.query(
      `SELECT 
        s.id,
        s.name,
        s.description,
        s.price,
        s.duration_minutes,
        COUNT(a.id) as booking_count,
        SUM(s.price) as total_revenue
      FROM services s
      LEFT JOIN appointments a ON s.id = a.service_id
      WHERE s.is_active = true
        AND (a.status = 'completed' OR a.status IS NULL)
      GROUP BY s.id, s.name, s.description, s.price, s.duration_minutes
      ORDER BY booking_count DESC
      LIMIT $1`,
      [parseInt(limit)]
    );

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Error al obtener servicios populares:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener servicios populares'
    });
  }
};

// ==========================================
// EXPORTAR FUNCIONES
// ==========================================
module.exports = {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  activateService,
  getPopularServices
};