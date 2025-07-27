// src/services/userService.js
import Usuario from '../modelos/Usuario.js';

class UserService {
  static async getUserProfile(id) {
    try {
      const user = await Usuario.findByIdd(id);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }
      
      // Eliminar información sensible
      const { password_hash, ...userData } = user;
      return userData;
    } catch (error) {
      console.error('Error en UserService.getUserProfile:', error);
      throw error;
    }
  }
}

export default UserService;