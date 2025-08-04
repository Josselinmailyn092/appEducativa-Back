import app from './app.js';

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

async function startServer() {
  const server = http.createServer(app);
  
  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.log(`⚠️  Puerto ${PORT} en uso, intentando con ${Number(PORT)+1}...`);
      setTimeout(() => {
        server.close();
        server.listen(Number(PORT)+1, HOST);
      }, 1000);
    } else {
      console.error('Error del servidor:', error);
      process.exit(1);
    }
  });

  server.on('listening', () => {
    const addr = server.address();
    const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
    debug(`Servidor escuchando en ${bind}`);
    console.log(`🚀 Servidor corriendo en http://${HOST}:${addr.port}`);
  });

  // Iniciar servidor
  server.listen(PORT, HOST);
}

// Manejo de señales para apagado limpio
process.on('SIGTERM', () => {
  console.log('SIGTERM recibido. Cerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT recibido. Cerrando servidor...');
  process.exit(0);
});

startServer().catch(err => {
  console.error('Error al iniciar servidor:', err);
  process.exit(1);
}) ;