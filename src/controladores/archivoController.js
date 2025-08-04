// archivoController.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const downloadFile = async (req, res) => {
  try {
    const { tipo, nombreArchivo } = req.params;
    
    // Normalización de rutas
    const tipoNormalizado = tipo.toLowerCase() === 'materials' ? 'materiales' : tipo;
    const uploadsPath = path.join(__dirname, '..', '..', 'uploads');
    const filePath = path.join(uploadsPath, tipoNormalizado, nombreArchivo);

    // Verificación robusta del archivo
    if (!fs.existsSync(filePath)) {
      const availableFiles = fs.existsSync(path.join(uploadsPath, tipoNormalizado)) 
        ? fs.readdirSync(path.join(uploadsPath, tipoNormalizado))
        : [];
      
      return res.status(404).json({
        success: false,
        message: 'Archivo no encontrado',
        details: {
          rutaBuscada: filePath,
          archivosDisponibles: availableFiles,
          directorioUploads: uploadsPath
        }
      });
    }

    // Determinar tipo MIME
    const fileExt = path.extname(nombreArchivo).toLowerCase();
    const contentType = getContentType(fileExt);

    // Configurar headers
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(nombreArchivo)}"`);
    
    // Stream del archivo
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
    
    fileStream.on('error', (error) => {
      console.error('Error al leer el archivo:', error);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: 'Error al leer el archivo',
          error: error.message
        });
      }
    });

  } catch (error) {
    console.error('Error en el controlador:', error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }
};

function getContentType(ext) {
  const types = {
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.zip': 'application/zip',
    '.txt': 'text/plain',
    '.jpg': 'image/jpeg',
    '.png': 'image/png'
  };
  return types[ext] || 'application/octet-stream';
}