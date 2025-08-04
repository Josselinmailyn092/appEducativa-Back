// import express from 'express';
// import { downloadFile } from '../controladores/archivosController.js';

// const router = express.Router();

// // Ruta pública para descargar archivos (sin autenticación)
// router.get('/descargar-publico/:tipo/:nombreArchivo', downloadFile);

// // Ruta protegida (mantén esta si necesitas ambas)
// router.get('/descargar/:tipo/:nombreArchivo', downloadFile);



// // En tus rutas
// router.get('/diagnostico-archivos', (req, res) => {
//   const uploadsPath = path.join(__dirname, '..', '..', 'uploads');
//   const rutaMateriales = path.join(uploadsPath, 'materiales');
  
//   try {
//     const existeUploads = fs.existsSync(uploadsPath);
//     const existeCarpeta = fs.existsSync(rutaMateriales);
//     const archivos = existeCarpeta ? fs.readdirSync(rutaMateriales) : [];
    
//     // Verificar permisos
//     let puedeLeer = false;
//     let puedeEscribir = false;
    
//     if (existeCarpeta) {
//       try {
//         fs.accessSync(rutaMateriales, fs.constants.R_OK);
//         puedeLeer = true;
//       } catch (e) {}
      
//       try {
//         fs.accessSync(rutaMateriales, fs.constants.W_OK);
//         puedeEscribir = true;
//       } catch (e) {}
//     }
    
//     return res.json({
//       rutaCompletaUploads: uploadsPath,
//       rutaMateriales,
//       existeUploads,
//       existeCarpetaMateriales: existeCarpeta,
//       permisos: {
//         lectura: puedeLeer,
//         escritura: puedeEscribir
//       },
//       archivos,
//       archivoBuscado: 'pdf_prueba_actividades.pdf',
//       existeArchivo: archivos.includes('pdf_prueba_actividades.pdf'),
//       estructura: {
//         directorioActual: __dirname,
//         proceso: {
//           cwd: process.cwd(),
//           platform: process.platform,
//           uid: process.getuid ? process.getuid() : null,
//           gid: process.getgid ? process.getgid() : null
//         }
//       }
//     });
//   } catch (error) {
//     return res.status(500).json({ 
//       error: error.message,
//       stack: error.stack
//     });
//   }
// });

// export default router;