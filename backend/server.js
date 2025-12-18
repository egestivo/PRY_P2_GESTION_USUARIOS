// server.js
// Punto de entrada del servidor

const app = require('./app');
const { crearAdminSiNoExiste } = require('./utils/initAdmin');
const PORT = process.env.PORT || 1234;
const HOST = '0.0.0.0'; // Escuchar en todas las interfaces de red

// Inicializar servidor
app.listen(PORT, HOST, async () => {
    console.log(`Servidor escuchando en http://${HOST}:${PORT}`);
    console.log(`Accesible en red local en http://<tu-ip>:${PORT}`);
    
    // Crear usuario admin si no existe
    await crearAdminSiNoExiste();
});
