// multerConfig.js
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = path.join(__dirname, '..', '..', 'uploads');
    
    // Normalización de nombres de carpeta
    if (file.fieldname === 'material') {
      uploadPath = path.join(uploadPath, 'materiales'); // Cambiado a 'materiales'
    } else if (file.fieldname === 'entrega') {
      uploadPath = path.join(uploadPath, 'entregas');
    }
    
    // Crear directorio si no existe
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Filtro de tipos de archivo
const fileFilter = (req, file, cb) => {
  const allowedTypes = {
    'material': [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ],
    'entrega': [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ],
    'avatar': [
      'image/jpeg',
      'image/png',
      'image/gif'
    ]
  };

  if (allowedTypes[file.fieldname]?.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Tipo de archivo no permitido para ${file.fieldname}`), false);
  }
};

// Configuración de Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB
    files: 5 // Máximo 5 archivos
  }
});

// Middlewares específicos
const uploadMaterial = upload.fields([{ name: 'material', maxCount: 5 }]);
const uploadEntrega = upload.fields([{ name: 'entrega', maxCount: 3 }]);
const uploadAvatar = upload.single('avatar');

// Exportaciones nombradas explícitas
export { 
  uploadMaterial,
  uploadEntrega,
  uploadAvatar,
  upload as default
};