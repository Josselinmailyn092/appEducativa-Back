# Estructura de Carpetas del Proyecto Backend

```bash
/src
 ├── config/               # Configuración base (DB, env)
 ├── controladores/        # Lógica para manejar peticiones
 ├── modelos/              # Modelos de acceso a la base de datos
 ├── rutas/                # Definición de rutas Express
 ├── services/             # Lógica intermedia entre modelo y controlador
 ├── middleware/           # Middlewares personalizados (errores, uploads)
 ├── uploads/              # Archivos subidos
 └── app.js                # Configuración principal del servidor
index.js                   # Punto de entrada del backend
.env                       # Variables de entorno
