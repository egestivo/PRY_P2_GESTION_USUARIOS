// server.js
// Punto de entrada del servidor

const app = require('./app');
const { crearAdminSiNoExiste } = require('./utils/initAdmin');
const PORT = process.env.PORT || 1234;

// Inicializar servidor
app.listen(PORT, async () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
    
    // Crear usuario admin si no existe
    await crearAdminSiNoExiste();
});
