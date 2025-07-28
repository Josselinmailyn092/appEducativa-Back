import Curso from '../modelos/Curso.js';


export const getCursosByEstudiante = async (req, res) => {
  try {
    const { estudianteId } = req.params;
    
    const cursos = await Curso.getCursosDisponibles(estudianteId);
    
    res.json({
      success: true,
      data: cursos
    });
  } catch (error) {
    console.error('Error en cursoControlador.getCursosByEstudiante:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener cursos del estudiante' 
    });
  }
};

export const getCursosByProfesor = async (req, res) => {
  try {
    const { profesorId } = req.params;
    
    const query = `
      SELECT c.*, 
             COUNT(i.estudiante_id) as estudiantes,
             pa.nombre as periodo_nombre
      FROM cursos c
      LEFT JOIN inscripciones i ON c.id = i.curso_id
      JOIN periodos_academicos pa ON c.periodo_id = pa.id
      WHERE c.profesor_id = $1
      GROUP BY c.id, pa.nombre
      ORDER BY c.nombre
    `;
    
    const { rows } = await pool.query(query, [profesorId]);
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error en cursoControlador.getCursosByProfesor:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener cursos del profesor' 
    });
  }
};

export const createCurso = async (req, res) => {
  try {
    const { codigo, nombre, descripcion, objetivos, profesor_id, periodo_id, creditos, paralelo } = req.body;
    
    const query = `
      INSERT INTO cursos (codigo, nombre, descripcion, objetivos, profesor_id, periodo_id, creditos, paralelo)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    
    const { rows } = await pool.query(query, [
      codigo, nombre, descripcion, objetivos, profesor_id, periodo_id, creditos, paralelo
    ]);
    
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Error en cursoControlador.createCurso:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al crear curso' 
    });
  }
};