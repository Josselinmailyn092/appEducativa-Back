// import express from 'express';
// import pool from '../../config/database.js';
// import authenticate from '../../middleware/authenticate.js';

// const router = express.Router();

// // Obtener cursos de un estudiante
// router.get('/:estudianteId/cursos', authenticate, async (req, res) => {
//   try {
//     const { estudianteId } = req.params;
    
//     const query = `
//       SELECT 
//         c.id,
//         c.codigo,
//         c.nombre AS titulo,
//         c.descripcion,
//         c.imagen_url AS imagen,
//         CONCAT(u.nombres, ' ', u.apellidos) AS profesor,
//         pa.nombre AS periodo,
//         calcular_promedio_estudiante($1, c.id) AS progreso,
//         COUNT(a.id) FILTER (WHERE e.id IS NULL) AS tareas_pendientes,
//         MAX(e.fecha_entrega) AS ultimo_acceso
//       FROM inscripciones i
//       JOIN cursos c ON i.curso_id = c.id
//       JOIN usuarios u ON c.profesor_id = u.id
//       JOIN periodos_academicos pa ON c.periodo_id = pa.id
//       LEFT JOIN modulos m ON c.id = m.curso_id
//       LEFT JOIN actividades a ON m.id = a.modulo_id
//       LEFT JOIN entregas e ON a.id = e.actividad_id AND e.estudiante_id = $1
//       WHERE i.estudiante_id = $1
//       GROUP BY c.id, u.nombres, u.apellidos, pa.nombre
//       ORDER BY MAX(e.fecha_entrega) DESC NULLS LAST
//     `;
    
//     const { rows } = await pool.query(query, [estudianteId]);
    
//     res.json({
//       success: true,
//       data: rows
//     });
//   } catch (error) {
//     console.error('Error al obtener cursos del estudiante:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Error al obtener cursos del estudiante' 
//     });
//   }
// });

// export default router;