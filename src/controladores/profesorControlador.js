import { uploadMaterial } from '../config/upload.js';

export const subirMaterial = async (req, res) => {
  try {
    if (!req.files?.material) {
      return res.status(400).json({ error: 'No se subieron archivos' });
    }

    const { moduloId, cursoId } = req.body;
    const materiales = req.files.material.map(file => ({
      nombre: file.originalname,
      ruta: file.path,
      tipo: file.mimetype,
      tamanio: file.size,
      modulo_id: moduloId,
      curso_id: cursoId,
      usuario_id: req.usuario.id
    }));

    // Insertar en base de datos
    const query = `
      INSERT INTO archivos 
      (nombre, ruta, tipo, tamanio, modulo_id, curso_id, usuario_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`;
    
    const resultados = await Promise.all(
      materiales.map(material => 
        pool.query(query, Object.values(material))
      )
    );

    res.status(201).json(resultados.map(r => r.rows[0]));
  } catch (error) {
    console.error('Error al subir material:', error);
    res.status(500).json({ 
      error: 'Error al subir material',
      detalle: error.message 
    });
  }
};