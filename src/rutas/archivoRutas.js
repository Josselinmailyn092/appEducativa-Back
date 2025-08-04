import express from 'express';
import { descargarArchivo, verArchivo } from '../controladores/archivosController.js';

const router = express.Router();

// Ruta para descargar archivos
router.get('/descargar/:tipo/:nombreArchivo', descargarArchivo);

// Ruta para ver archivos en el navegador
router.get('/ver/:tipo/:nombreArchivo', verArchivo);

export default router;