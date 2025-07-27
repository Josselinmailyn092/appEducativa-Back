import Curso from '../modelos/Curso.js';
const DEFAULT_STUDENT_ID = 1;
const cursoController = {
  /**
   * Obtiene todos los cursos disponibles para un estudiante
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  getCursosByEstudiante: async (req, res) => {
    try {
      // Obtener el ID del estudiante desde el token/auth o parámetros
      const estudianteId = req.user?.id || req.params.estudianteId|| DEFAULT_STUDENT_ID;
      
      if (!estudianteId) {
        return res.status(400).json({
          success: false,
          message: 'Se requiere el ID del estudiante'
        });
      }

      const cursos = await Curso.getCursosDisponibles(estudianteId);
      
      res.json({
        success: true,
        data: cursos
      });
    } catch (error) {
      console.error('Error en cursoController.getCursosByEstudiante:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener los cursos',
        error: error.message
      });
    }
  },

  /**
   * Obtiene un curso específico con su progreso
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  getCursoById: async (req, res) => {
    try {
      const { cursoId } = req.params;
      const estudianteId = req.user?.id || req.query.estudianteId || DEFAULT_STUDENT_ID;
      
      if (!estudianteId || !cursoId) {
        return res.status(400).json({
          success: false,
          message: 'Se requieren el ID del curso y del estudiante'
        });
      }

      // Puedes modificar tu modelo para incluir este método
      const curso = await Curso.getCursoConProgreso(cursoId, estudianteId);
      
      if (!curso) {
        return res.status(404).json({
          success: false,
          message: 'Curso no encontrado'
        });
      }

      res.json({
        success: true,
        data: curso
      });
    } catch (error) {
      console.error('Error en cursoController.getCursoById:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener el curso',
        error: error.message
      });
    }
  }
};
export { cursoController };
