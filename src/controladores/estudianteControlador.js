import { pool } from '../config/database.js';

export const obtenerCursosInscritos = async (req, res) => {
  try {
    const estudianteId = req.usuario.id;
    
    const query = `
      SELECT c.*, p.nombre as periodo_nombre 
      FROM cursos c
      JOIN inscripciones i ON c.id = i.curso_id
      JOIN periodos_academicos p ON c.periodo_id = p.id
      WHERE i.estudiante_id = $1`;
    
    const result = await pool.query(query, [estudianteId]);
    res.json(result.rows);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const entregarActividad = async (req, res) => {
  try {
    const { contenido } = req.body;
    const actividadId = req.params.actividadId;
    const estudianteId = req.usuario.id;
    
    let query, values;
    
    if (req.file) {
      // Entrega con archivo
      query = `
        INSERT INTO entregas (actividad_id, estudiante_id, archivo_url, tamano_bytes, tipo_mime)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`;
      
      values = [
        actividadId,
        estudianteId,
        req.file.path,
        req.file.size,
        req.file.mimetype
      ];
    } else {
      // Entrega con texto
      query = `
        INSERT INTO entregas (actividad_id, estudiante_id, contenido)
        VALUES ($1, $2, $3)
        RETURNING *`;
      
      values = [actividadId, estudianteId, contenido];
    }
    
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const verCalificaciones = async (req, res) => {
  try {
    const estudianteId = req.usuario.id;
    
    const query = `
      SELECT e.*, a.titulo as actividad_titulo, c.nombre as curso_nombre
      FROM entregas e
      JOIN actividades a ON e.actividad_id = a.id
      JOIN modulos m ON a.modulo_id = m.id
      JOIN cursos c ON m.curso_id = c.id
      WHERE e.estudiante_id = $1 AND e.calificacion IS NOT NULL`;
    
    const result = await pool.query(query, [estudianteId]);
    res.json(result.rows);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};