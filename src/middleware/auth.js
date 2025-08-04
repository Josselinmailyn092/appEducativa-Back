import Usuario from '../modelos/Usuario.js';

// Middleware de autenticación
const authenticate = async (req, res, next) => {
 next();
};

// Middleware de autorización
const authorize = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ 
        success: false, 
        message: 'No autorizado para esta acción' 
      });
    }
    next();
  };
};

// Exportaciones explícitas
export { authenticate, authorize };