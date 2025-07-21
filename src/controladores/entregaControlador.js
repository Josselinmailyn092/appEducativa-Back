import { pool } from '../config/database.js';
import fs from 'fs';

export const entregarTarea = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No se subieron archivos' });
    }

    const { actividadId } = req.params;
    const estudianteId = req.usuario.id;

    // Verificar si ya existe una entrega para esta actividad
    const verificarQuery = `
      SELECT id FROM entregas 
      WHERE actividad_id = $1 AND estudiante_id = $2`;
    const verificarResult = await pool.query(verificarQuery, [actividadId, estudianteId]);
    
    if (verificarResult.rows.length > 0) {
      // Eliminar archivos anteriores si es una nueva versión
      const entregaId = verificarResult.rows[0].id;
      const archivosQuery = 'SELECT archivo_url FROM entregas WHERE id = $1';
      const archivosResult = await pool.query(archivosQuery, [entregaId]);
      
      if (archivosResult.rows[0].archivo_url) {
        try { fs.unlinkSync(archivosResult.rows[0].archivo_url); } catch (err) { console.error(err); }
      }
    }

    // Registrar entrega en la base de datos
    const query = `
      INSERT INTO entregas 
      (actividad_id, estudiante_id, archivo_url, tamano_bytes, tipo_mime)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (actividad_id, estudiante_id) 
      DO UPDATE SET 
        archivo_url = EXCLUDED.archivo_url,
        tamano_bytes = EXCLUDED.tamano_bytes,
        tipo_mime = EXCLUDED.tipo_mime,
        fecha_entrega = NOW(),
        estado = 'entregado'
      RETURNING *`;
    
    // Asumimos que solo permitimos un archivo principal para la entrega
    const file = req.files[0];
    const values = [
      actividadId,
      estudianteId,
      file.path,
      file.size,
      file.mimetype
    ];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al entregar tarea:', error);
    
    // Limpiar archivos subidos si hay error
    if (req.files) {
      req.files.forEach(file => {
        try { fs.unlinkSync(file.path); } catch (err) { console.error(err); }
      });
    }
    
    res.status(500).json({ 
      error: 'Error al entregar la tarea',
      detalle: error.message 
    });
  }
};

export const descargarEntrega = async (req, res) => {
  try {
    const { entregaId } = req.params;
    
    // Obtener información de la entrega
    const query = 'SELECT * FROM entregas WHERE id = $1';
    const result = await pool.query(query, [entregaId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Entrega no encontrada' });
    }
    
    const entrega = result.rows[0];
    
    if (!entrega.archivo_url) {
      return res.status(404).json({ error: 'No hay archivo asociado a esta entrega' });
    }
    
    // Verificar que el archivo existe físicamente
    if (!fs.existsSync(entrega.archivo_url)) {
      return res.status(404).json({ error: 'El archivo de entrega no existe en el servidor' });
    }
    
    // Configurar headers para la descarga
    res.setHeader('Content-Type', entrega.tipo_mime);
    res.setHeader('Content-Disposition', `attachment; filename="entrega-${entregaId}${path.extname(entrega.archivo_url)}"`);
    res.setHeader('Content-Length', entrega.tamano_bytes);
    
    // Stream el archivo al cliente
    const fileStream = fs.createReadStream(entrega.archivo_url);
    fileStream.pipe(res);
    
  } catch (error) {
    console.error('Error al descargar entrega:', error);
    res.status(500).json({ 
      error: 'Error al descargar la entrega',
      detalle: error.message 
    });
  }
};