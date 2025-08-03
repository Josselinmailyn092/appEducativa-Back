import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import { pool } from './config/database.js';
import errorHandler from './middleware/errorHandler.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Importación de rutas
import authRutas from './rutas/authRutas.js';
import userRutas from './rutas/userRuta.js';
// import profesorRutas from './rutas/profesorRutas.js';
import cursoRoutes from './rutas/cursoRutas.js';
import archivoRutas from './rutas/archivoRutas.js';
// Configuración inicial de __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Definición de rutas de uploads después de inicializar __dirname
const uploadsPath = path.join(__dirname, '..', '..', 'uploads');
const subfolders = ['materiales', 'entregas'];

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

// Archivos estáticos - usa la ruta correcta
app.use('/uploads', express.static(uploadsPath));

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
app.use('/api/auth', authRutas);
app.use('/api/user', userRutas);
// app.use('/api/profesor', profesorRutas);
app.use('/api', cursoRoutes);
app.use('/api/archivos', archivoRutas);
// Manejo de errores
app.use(errorHandler);

// Crear estructura de carpetas
function setupUploadsFolder() {
  try {
    if (!fs.existsSync(uploadsPath)) {
      fs.mkdirSync(uploadsPath, { recursive: true });
      console.log(`Carpeta uploads creada en: ${uploadsPath}`);
    }

    subfolders.forEach(folder => {
      const folderPath = path.join(uploadsPath, folder);
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
        console.log(`Subcarpeta ${folder} creada en: ${folderPath}`);
      }
    });

    // Verificar permisos
    fs.accessSync(uploadsPath, fs.constants.R_OK | fs.constants.W_OK);
    console.log('Permisos correctos en la carpeta uploads');

    return true;
  } catch (error) {
    console.error('Error al configurar carpetas:', error);
    return false;
  }
}

// Ejecutar la verificación
setupUploadsFolder();

export default app;