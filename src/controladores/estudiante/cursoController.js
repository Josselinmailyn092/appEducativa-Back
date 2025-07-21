const path = require('path');
const CursoEstudiante = require('../../../modelos/estudiante/cursoModel');
const fileService = require('../../../services/fileService');

class CursoController {
  // Obtener cursos disponibles
  async getCursosDisponibles(req, res) {
    try {
      const cursos = await CursoEstudiante.getCursosDisponibles();
      res.json(cursos);
    } catch (error) {
      console.error('Error al obtener cursos disponibles:', error);
      res.status(500).json({ error: 'Error al obtener cursos disponibles' });
    }
  }

  // Obtener cursos inscritos
  async getCursosInscritos(req, res) {
    try {
      const { estudianteId } = req.params;
      
      if (!estudianteId) {
        return res.status(400).json({ error: 'ID de estudiante requerido' });
      }

      const cursos = await CursoEstudiante.getCursosInscritos(estudianteId);
      res.json(cursos);
    } catch (error) {
      console.error('Error al obtener cursos inscritos:', error);
      res.status(500).json({ error: 'Error al obtener cursos inscritos' });
    }
  }

  // Descargar contenido
  async downloadContenido(req, res) {
    try {
      const { contenidoId } = req.params;
      const contenido = await CursoEstudiante.getContenidoDescargable(contenidoId);
      
      if (!contenido) {
        return res.status(404).json({ error: 'Contenido no encontrado' });
      }

      const filePath = path.join(__dirname, '../../public/uploads', contenido.url);
      res.download(filePath, contenido.titulo + path.extname(contenido.url));
    } catch (error) {
      console.error('Error al descargar contenido:', error);
      res.status(500).json({ error: 'Error al descargar el archivo' });
    }
  }
}

module.exports = new CursoController();