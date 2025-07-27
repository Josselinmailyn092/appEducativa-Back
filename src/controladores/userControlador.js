// src/controladores/userControlador.js
import UserService from '../services/userService.js';

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

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Error en userControlador.getProfile:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error al obtener perfil' 
    });
  }
};