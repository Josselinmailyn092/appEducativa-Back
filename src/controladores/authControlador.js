import Usuario from '../modelos/Usuario.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar datos de entrada
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Faltan campos requeridos' 
      });
    }

    // Buscar usuario
    const user = await Usuario.findByEmail(email);
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Credenciales inválidas' 
      });
    }

    // Verificar contraseña
    const isMatch = await Usuario.comparePassword(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: 'Credenciales inválidas' 
      });
    }

    // Eliminar información sensible
    const { password_hash, ...userData } = user;

    res.json({
      success: true,
      user: userData 
    });

  } catch (error) {
    console.error('Error en authControlador.login:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor' 
    });
  }
};

export const logout = (req, res) => {
  res.json({ success: true, message: 'Sesión cerrada correctamente' });
};