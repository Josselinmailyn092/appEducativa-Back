import { pool } from '../config/database.js';
import bcrypt from 'bcryptjs';

class Usuario {
  static async findByEmail(email) {
    const query = 'SELECT * FROM appEducativa.usuarios WHERE email = $1'; // Nota el esquema.appEducativa
      const { rows } = await pool.query(query, [email]);
    return rows[0];
  }

  static async comparePassword(candidatePassword, storedPassword) {
    // Comparación directa sin hash (solo para desarrollo)
    return candidatePassword === storedPassword;
  }

  static async getById(id) {
    const query = 'SELECT id, cedula, nombres, apellidos, email, rol_id FROM usuarios WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
}

export default Usuario;