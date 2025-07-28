// import express from 'express';
// import pool from '../../config/database.js';
// import authenticate from '../../middleware/authenticate.js';

// const router = express.Router();

// // Obtener cursos de un profesor
// router.get('/:profesorId/cursos', authenticate, async (req, res) => {
//   try {
//     const { profesorId } = req.params;
    
//     const query = `
//       SELECT 
//         c.id,
//         c.codigo,
//         c.nombre AS titulo,
//         c.descripcion,
//         c.imagen_url AS imagen,
//         pa.nombre AS periodo,
//         COUNT(DISTINCT i.estudiante_id) AS estudiantes,
//         COUNT(DISTINCT m.id) AS modulos,
//         c.estado,
//         c.fecha_creacion,
//         c.fecha_cierre
//       FROM cursos c
//       JOIN periodos_academicos pa ON c.periodo_id = pa.id
//       LEFT JOIN inscripciones i ON c.id = i.curso_id
//       LEFT JOIN modulos m ON c.id = m.curso_id
//       WHERE c.profesor_id = $1
//       GROUP BY c.id, pa.nombre
//       ORDER BY c.fecha_creacion DESC
//     `;
    
//     const { rows } = await pool.query(query, [profesorId]);
    
//     res.json({
//       success: true,
//       data: rows
//     });
//   } catch (error) {
//     console.error('Error al obtener cursos del profesor:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Error al obtener cursos del profesor' 
//     });
//   }
// });

// // Crear nuevo curso
// router.post('/', authenticate, async (req, res) => {
//   try {
//     const { 
//       codigo, 
//       nombre, 
//       descripcion, 
//       objetivos, 
//       profesor_id, 
//       periodo_id, 
//       creditos, 
//       paralelo 
//     } = req.body;
    
//     const query = `
//       INSERT INTO cursos (
//         codigo, nombre, descripcion, objetivos, 
//         profesor_id, periodo_id, creditos, paralelo
//       )
//       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
//       RETURNING *
//     `;
    
//     const { rows } = await pool.query(query, [
//       codigo, nombre, descripcion, objetivos, 
//       profesor_id, periodo_id, creditos, paralelo
//     ]);
    
//     // Notificar a los estudiantes (si es necesario)
    
//     res.json({
//       success: true,
//       data: rows[0],
//       message: 'Curso creado exitosamente'
//     });
//   } catch (error) {
//     console.error('Error al crear curso:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Error al crear curso' 
//     });
//   }
// });

// export default router;