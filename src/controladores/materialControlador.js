import { pool } from '../config/database.js';
import fs from 'fs';
import path from 'path';

export const subirMaterial = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No se subieron archivos' });
    }

    const { moduloId, cursoId } = req.params;
    const usuarioId = req.usuario.id; // Asumiendo que tienes middleware de autenticación

    // Registrar archivos en la base de datos
    const resultados = await Promise.all(
      req.files.map(async (file) => {
        const query = `
          INSERT INTO archivos 
          (nombre, ruta, tipo, tamanio, usuario_id, curso_id, modulo_id)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING *`;
        
        const values = [
          file.originalname,
          file.path,
          file.mimetype,
          file.size,
          usuarioId,
          cursoId,
          moduloId
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
      })
    );

    res.status(201).json(resultados);
  } catch (error) {
    console.error('Error al subir material:', error);
    
    // Limpiar archivos subidos si hay error
    if (req.files) {
      req.files.forEach(file => {
        try { fs.unlinkSync(file.path); } catch (err) { console.error(err); }
      });
    }
    
    res.status(500).json({ 
      error: 'Error al subir material educativo',
      detalle: error.message 
    });
  }
};

export const descargarMaterial = async (req, res) => {
  try {
    const { archivoId } = req.params;
    
    // Obtener información del archivo
    const query = 'SELECT * FROM archivos WHERE id = $1';
    const result = await pool.query(query, [archivoId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }
    
    const archivo = result.rows[0];
    const filePath = archivo.ruta;
    
    // Verificar que el archivo existe físicamente
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'El archivo no existe en el servidor' });
    }
    
    // Configurar headers para la descarga
    res.setHeader('Content-Type', archivo.tipo);
    res.setHeader('Content-Disposition', `attachment; filename="${archivo.nombre}"`);
    res.setHeader('Content-Length', archivo.tamanio);
    
    // Stream el archivo al cliente
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
    
  } catch (error) {
    console.error('Error al descargar material:', error);
    res.status(500).json({ 
      error: 'Error al descargar el archivo',
      detalle: error.message 
    });
  }
};

export const listarMaterialesCurso = async (req, res) => {
  try {
    const { cursoId } = req.params;
    
    const query = `
      SELECT a.*, u.nombres || ' ' || u.apellidos as nombre_profesor
      FROM archivos a
      JOIN usuarios u ON a.usuario_id = u.id
      WHERE a.curso_id = $1 AND a.visible = true
      ORDER BY a.fecha_subida DESC`;
    
    const result = await pool.query(query, [cursoId]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};