// src/rutas/userRutas.js
import { Router } from 'express';
import { getProfile } from '../controladores/userControlador.js';

const router = Router();

// Ruta para obtener perfil de usuario
router.get('/profile', getProfile);

export default router;