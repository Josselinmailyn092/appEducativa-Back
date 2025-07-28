import { pool } from '../config/database.js';

class Curso {
  static async getCursosDisponibles(estudianteId) {
    try {
      const query = `
        SELECT 
          c.id,
          c.codigo,
          c.nombre AS title,
          c.imagen_url AS image,
          CONCAT(u.nombres, ' ', u.apellidos) AS teacher,
          COUNT(DISTINCT a.id) AS total_actividades,
          COUNT(DISTINCT e.id) AS actividades_completadas,
          MAX(e.fecha_entrega) AS last_accessed,
          appEducativa.obtener_progreso_curso($1, c.id) AS progress
        FROM cursos c
        JOIN usuarios u ON c.profesor_id = u.id
        JOIN inscripciones i ON c.id = i.curso_id
        LEFT JOIN modulos m ON c.id = m.curso_id
        LEFT JOIN actividades a ON m.id = a.modulo_id
        LEFT JOIN entregas e ON a.id = e.actividad_id AND e.estudiante_id = $1
        WHERE i.estudiante_id = $1
        AND c.estado = 'activo'
        GROUP BY c.id, u.nombres, u.apellidos
        ORDER BY c.nombre
      `;
      
      const { rows } = await pool.query(query, [estudianteId]);
      return rows;
    } catch (error) {
      console.error('Error en Curso.getCursosDisponibles:', error);
      throw error;
    }
  }

  static async getDetalleCurso(cursoId) {
    try {
      const query = `
        SELECT 
          c.*,
          CONCAT(u.nombres, ' ', u.apellidos) AS profesor_nombre,
          pa.nombre AS periodo_nombre
        FROM cursos c
        JOIN usuarios u ON c.profesor_id = u.id
        JOIN periodos_academicos pa ON c.periodo_id = pa.id
        WHERE c.id = $1
      `;
      
      const { rows } = await pool.query(query, [cursoId]);
      return rows[0] || null;
    } catch (error) {
      console.error('Error en Curso.getDetalleCurso:', error);
      throw error;
    }
  }
}

export default Curso;