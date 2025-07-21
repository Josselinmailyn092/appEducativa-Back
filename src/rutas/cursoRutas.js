const express = require('express');
const router = express.Router();
const cursoControlador = require('../controladores/cursoControlador');

// Obtener todos los cursos
router.get('/', cursoControlador.getCursos);

// Obtener un curso por ID
router.get('/:id', cursoControlador.getCursoById);

// Crear un nuevo curso
router.post('/', cursoControlador.createCurso);

// Actualizar un curso
router.put('/:id', cursoControlador.updateCurso);

// Eliminar un curso
router.delete('/:id', cursoControlador.deleteCurso);

module.exports = router;