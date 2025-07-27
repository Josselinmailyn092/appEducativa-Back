// src/app.js (versión corregida)
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import { pool } from './config/database.js';
import errorHandler from './middleware/errorHandler.js';

// RUTAS (corregir estas importaciones)
import authRutas from './rutas/authRutas.js';
import userRutas from './rutas/userRuta.js'; // Asegúrate que el nombre del archivo coincida
import profesorRutas from './rutas/profesorRutas.js';
import cursoRoutes from './rutas/cursoRutas.js';

const app = express();

// Middlewares
app.use(helmet());
app.use(morgan('dev'));
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Archivos estáticos
app.use('/uploads', express.static('uploads'));

// Conexión a la base de datos
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error de conexión a la base de datos:', err);
  } else {
    console.log('Conexión a la base de datos establecida');
    release();
  }
});

// Rutas (orden importante)
app.use('/api/auth', authRutas);
app.use('/api/user', userRutas); // Esta debe estar antes que rutas más genéricas
app.use('/api/profesor', profesorRutas);
app.use('/api', cursoRoutes); // Esta ruta genérica debe ir al final

// Manejo de errores
app.use(errorHandler);

export default app; // Eliminar el }; extra que estaba aquí