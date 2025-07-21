import { Router } from 'express';
import {
  obtenerCursosInscritos,
  entregarActividad,
  verCalificaciones
} from '../controladores/estudianteControlador.js';
import upload from '../config/upload.js';

const router = Router();

// Cursos
router.get('/cursos', obtenerCursosInscritos);

// Actividades
router.post('/actividades/:actividadId/entregar', upload.single('archivo'), entregarActividad);

// Calificaciones
router.get('/calificaciones', verCalificaciones);

export default router;