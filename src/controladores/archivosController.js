import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Configuración de directorios
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const baseUploadsPath = path.join(__dirname, '..', 'uploads');

// Tipos MIME para diferentes extensiones
const tiposMIME = {
  '.pdf': 'application/pdf',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.txt': 'text/plain',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.xls': 'application/vnd.ms-excel',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.ppt': 'application/vnd.ms-powerpoint',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  '.zip': 'application/zip',
  '.rar': 'application/x-rar-compressed'
};

/**
 * Controlador para descargar archivos
 */
export const descargarArchivo = (req, res) => {
    try {
        const { tipo, nombreArchivo } = req.params;
        
        // Validar tipo de archivo
        const tiposPermitidos = ['materiales', 'entregas'];
        if (!tiposPermitidos.includes(tipo)) {
            return res.status(400).json({ 
                error: 'Tipo de archivo no válido', 
                tiposPermitidos 
            });
        }

        // Construir ruta completa al archivo
        const rutaArchivo = path.join(baseUploadsPath, tipo, nombreArchivo);
        
        // Verificar si el archivo existe
        if (!fs.existsSync(rutaArchivo)) {
            console.log(`Archivo no encontrado en: ${rutaArchivo}`);
            console.log(`Buscando en directorio: ${baseUploadsPath}`);
            return res.status(404).json({ 
                error: 'Archivo no encontrado',
                rutaBuscada: rutaArchivo,
                directorioBase: baseUploadsPath
            });
        }

        // Obtener estadísticas del archivo
        const stats = fs.statSync(rutaArchivo);
        
        // Determinar el tipo MIME
        const extension = path.extname(nombreArchivo).toLowerCase();
        const contentType = tiposMIME[extension] || 'application/octet-stream';

        // Configurar headers para descarga
        res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(nombreArchivo)}"`);
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Length', stats.size);

        // Crear stream de lectura y enviar el archivo
        const fileStream = fs.createReadStream(rutaArchivo);
        fileStream.pipe(res);

        // Manejar errores del stream
        fileStream.on('error', (err) => {
            console.error('Error al leer el archivo:', err);
            res.status(500).json({ error: 'Error al leer el archivo' });
        });

    } catch (error) {
        console.error('Error en descargarArchivo:', error);
        res.status(500).json({ 
            error: 'Error interno del servidor',
            detalles: error.message 
        });
    }
};

/**
 * Controlador para ver archivos en el navegador
 */
export const verArchivo = (req, res) => {
    try {
        const { tipo, nombreArchivo } = req.params;
        
        // Validar tipo de archivo
        const tiposPermitidos = ['materiales', 'entregas'];
        if (!tiposPermitidos.includes(tipo)) {
            return res.status(400).json({ 
                error: 'Tipo de archivo no válido', 
                tiposPermitidos 
            });
        }

        // Construir ruta completa al archivo
        const rutaArchivo = path.join(baseUploadsPath, tipo, nombreArchivo);
        
        // Verificar si el archivo existe
        if (!fs.existsSync(rutaArchivo)) {
            console.log(`Archivo no encontrado en: ${rutaArchivo}`);
            return res.status(404).json({ 
                error: 'Archivo no encontrado',
                rutaBuscada: rutaArchivo
            });
        }

        // Determinar el tipo MIME
        const extension = path.extname(nombreArchivo).toLowerCase();
        const contentType = tiposMIME[extension] || 'application/octet-stream';
        
        // Configurar headers para visualización
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(nombreArchivo)}"`);

        // Enviar el archivo
        const fileStream = fs.createReadStream(rutaArchivo);
        fileStream.pipe(res);

        fileStream.on('error', (err) => {
            console.error('Error al leer el archivo:', err);
            res.status(500).json({ error: 'Error al leer el archivo' });
        });

    } catch (error) {
        console.error('Error en verArchivo:', error);
        res.status(500).json({ 
            error: 'Error interno del servidor',
            detalles: error.message 
        });
    }
};

// Exportamos ambos controladores
export default {
    descargarArchivo,
    verArchivo
};