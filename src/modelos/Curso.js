import { pool } from '../config/database.js';

class Curso {
  /**
   * Obtiene todos los cursos disponibles para un estudiante con su progreso
   * @param {number} estudianteId - ID del estudiante
   * @returns {Promise<Array>} Lista de cursos con información de progreso
   */
  static async getCursosDisponibles(estudianteId) {
    try {
      const query = `
       SELECT 
  c.id,
  c.codigo,
  c.nombre AS title,
  c.imagen_url AS image,
  CONCAT(u.nombres, ' ', u.apellidos) AS teacher,
  COALESCE((
    SELECT COUNT(*) 
    FROM appEducativa.actividades act
    JOIN appEducativa.modulos m ON act.modulo_id = m.id
    WHERE m.curso_id = c.id
    AND NOT EXISTS (
      SELECT 1 FROM appEducativa.entregas e 
      WHERE e.actividad_id = act.id 
      AND e.estudiante_id = (SELECT id FROM appEducativa.usuarios WHERE email = 'aartega@utm.edu.ec')
    )
  ), 0) AS pending_tasks,
  COALESCE((
    SELECT MAX(e.fecha_entrega)
    FROM appEducativa.entregas e
    JOIN appEducativa.actividades a ON e.actividad_id = a.id
    JOIN appEducativa.modulos m ON a.modulo_id = m.id
    WHERE m.curso_id = c.id
    AND e.estudiante_id = (SELECT id FROM appEducativa.usuarios WHERE email = 'aartega@utm.edu.ec')
  ), NULL) AS last_accessed,
  appEducativa.obtener_progreso_curso((SELECT id FROM appEducativa.usuarios WHERE email = 'aartega@utm.edu.ec'), c.id) AS progress
FROM appEducativa.cursos c
JOIN appEducativa.periodos_academicos pa ON c.periodo_id = pa.id
JOIN appEducativa.usuarios u ON c.profesor_id = u.id
JOIN appEducativa.inscripciones i ON c.id = i.curso_id
WHERE i.estudiante_id = (SELECT id FROM appEducativa.usuarios WHERE email = 'aartega@utm.edu.ec')
AND c.estado = 'activo'
ORDER BY c.nombre;
      `;
      
      const { rows } = await pool.query(query, [estudianteId]);
      return rows;
    } catch (error) {
      console.error('Error en Curso.getCursosDisponibles:', error);
      throw error;
    }
  }

  /**
   * Obtiene un curso específico con información detallada de progreso
   * @param {number} cursoId - ID del curso
   * @param {number} estudianteId - ID del estudiante
   * @returns {Promise<Object>} Información detallada del curso
   */
 // modelos/estudiante/cursoModel.js
static async getCursosDisponibles(estudianteId) {
  try {
    // Primero obtenemos el email del estudiante
    const emailQuery = 'SELECT email FROM appEducativa.usuarios WHERE id = $1';
    const { rows: [usuario] } = await pool.query(emailQuery, [estudianteId]);
    
    if (!usuario) {
      throw new Error('Estudiante no encontrado');
    }

    const query = `
      SELECT 
        c.id,
        c.codigo,
        c.nombre AS title,
        c.imagen_url AS image,
        CONCAT(u.nombres, ' ', u.apellidos) AS teacher,
        COALESCE((
          SELECT COUNT(*) 
          FROM appEducativa.actividades act
          JOIN appEducativa.modulos m ON act.modulo_id = m.id
          WHERE m.curso_id = c.id
          AND NOT EXISTS (
            SELECT 1 FROM appEducativa.entregas e 
            WHERE e.actividad_id = act.id 
            AND e.estudiante_id = $1
          )
        ), 0) AS pending_tasks,
        COALESCE((
          SELECT MAX(e.fecha_entrega)
          FROM appEducativa.entregas e
          JOIN appEducativa.actividades a ON e.actividad_id = a.id
          JOIN appEducativa.modulos m ON a.modulo_id = m.id
          WHERE m.curso_id = c.id
          AND e.estudiante_id = $1
        ), NULL) AS last_accessed,
        appEducativa.obtener_progreso_curso($1, c.id) AS progress
      FROM appEducativa.cursos c
      JOIN appEducativa.periodos_academicos pa ON c.periodo_id = pa.id
      JOIN appEducativa.usuarios u ON c.profesor_id = u.id
      JOIN appEducativa.inscripciones i ON c.id = i.curso_id
      WHERE i.estudiante_id = $1
      AND c.estado = 'activo'
      ORDER BY c.nombre;
    `;
    
    const { rows } = await pool.query(query, [estudianteId]);
    return rows;
  } catch (error) {
    console.error('Error en getCursosDisponibles:', error);
    throw error;
  }
}
}

export default Curso;