import { Router } from 'express';
import { uploadMaterialEducativo } from '../config/upload.js';
import { 
  subirMaterial, 
  descargarMaterial, 
  listarMaterialesCurso 
} from '../controladores/materialControlador.js';

const router = Router();

// Subir materiales educativos (profesor)
router.post('/cursos/:cursoId/modulos/:moduloId/materiales', 
  uploadMaterialEducativo, 
  subirMaterial
);

// Listar materiales de un curso
router.get('/cursos/:cursoId/materiales', listarMaterialesCurso);

// Descargar material
router.get('/materiales/:archivoId/descargar', descargarMaterial);

export default router;