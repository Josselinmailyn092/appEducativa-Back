import { Router } from 'express';
import { 
  getCursosByEstudiante, 
  getCursosByProfesor,
  createCurso
} from '../controladores/cursoControlador.js';

const router = Router();

router.get('/estudiante/:estudianteId', getCursosByEstudiante);
router.get('/profesor/:profesorId', getCursosByProfesor);
router.post('/', createCurso);

export default router;