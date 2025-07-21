import { Router } from 'express';
import { uploadMaterial } from '../config/upload.js';
import { subirMaterial } from '../controladores/profesorControlador.js';

const router = Router();

router.post('/cursos/:id/materiales', uploadMaterial, subirMaterial);

export default router;