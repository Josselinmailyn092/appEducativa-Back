import UserService from '../services/userService.js';

// Asegurar que devuelve los datos en el formato correcto
export const getProfile = async (req, res) => {
  try {
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({ 
        success: false, 
        message: 'Se requiere ID de usuario' 
      });
    }

    const user = await UserService.getUserProfile(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Formato consistente para el frontend
    res.json({
      success: true,
      user: {
        id: user.id,
        nombres: user.nombres,
        apellidos: user.apellidos,
        email: user.email,
        rol: user.rol_id // o user.rol según tu DB
      }
    });
  } catch (error) {
    console.error('Error en userControlador.getProfile:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error al obtener perfil' 
    });
  }
};