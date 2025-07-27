const Cursos = require('../modelos/Curso');

const courseController = {
  getAvailableCourses: async (req, res) => {
    try {
      // En una aplicación real, el studentId vendría del token JWT
      const studentId = req.user.id; // Asumiendo que tenemos autenticación
      
      // Para propósitos de demostración, usaremos un ID fijo
      // const studentId = 1; // ID de Andreina Artega en tu base de datos
      
      const Cursos = await Course.getAvailableCourses(studentId);
      res.json(courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      res.status(500).json({ message: 'Error al obtener los cursos' });
    }
  }
};

module.exports = courseController;