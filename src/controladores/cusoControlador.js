const Curso = require('../modelos/Curso');

exports.getCursos = async (req, res, next) => {
  try {
    const cursos = await Curso.find();
    res.status(200).json(cursos);
  } catch (error) {
    next(error);
  }
};

exports.getCursoById = async (req, res, next) => {
  try {
    // Aquí es donde podría ocurrir el error si req.params.id no existe
    const curso = await Curso.findById(req.params.id);
    if (!curso) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }
    res.status(200).json(curso);
  } catch (error) {
    next(error);
  }
};

// ... otros métodos del controlador