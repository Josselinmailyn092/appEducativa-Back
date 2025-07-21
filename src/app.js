// src/app.js
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import { pool } from './config/database.js';
import errorHandler from './middleware/errorHandler.js';

import estudianteRutas from './rutas/estudianteRutas.js';
import profesorRutas from './rutas/profesorRutas.js';
import authRutas from './rutas/authRutas.js';

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

// Rutas
app.use('/api/estudiante', estudianteRutas);
app.use('/api/profesor', profesorRutas);
app.use('/api/auth', authRutas);

// Manejo de errores
app.use(errorHandler);

export default app;