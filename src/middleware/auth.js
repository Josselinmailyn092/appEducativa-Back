// src/middleware/auth.js
const Usuario = require('../modelos/Usuario');

exports.authenticate = async (req, res, next) => {
  try {
    // Aquí implementarás la autenticación con token cuando lo agregues
    // Por ahora solo verifica si hay un usuario en la sesión
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'No autorizado' 
      });
    }

    const user = await Usuario.getById(req.session.userId);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Usuario no encontrado' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Error en middleware auth:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error de autenticación' 
    });
  }
};

exports.authorize = (role) => {
  return (req, res, next) => {
    // role puede ser 'student' o 'teacher'
    const requiredRoleId = role === 'teacher' ? 2 : 1;
    
    if (req.user.rol_id !== requiredRoleId) {
      return res.status(403).json({ 
        success: false, 
        message: 'No tienes permiso para realizar esta acción' 
      });
    }
    next();
  };
};