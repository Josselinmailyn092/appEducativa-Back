// routes/cursoRoutes.js
import { Router } from 'express';
import { cursoController } from '../controladores/cursoControlador.js';

const router = Router();

// Proteger esta ruta con autenticación
router.get('/mis-cursos/:estudianteId', cursoController.getCursosByEstudiante);

export default router;