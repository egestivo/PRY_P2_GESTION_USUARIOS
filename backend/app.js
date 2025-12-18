// app.js
// Configuración principal de Express
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const multer = require('multer');
const path = require('path');

const app = express();

// Middlewares globales
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Configuración de almacenamiento de Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'uploads'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// Exponer la carpeta uploads como pública
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas de autenticación
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Rutas de publicaciones
const publicacionRoutes = require('./routes/publicacionRoutes');
app.use('/api/publicaciones', publicacionRoutes);

// Rutas de comentarios
const comentarioRoutes = require('./routes/comentarioRoutes');
app.use('/api/comentarios', comentarioRoutes);

// Rutas de etiquetas
const etiquetaRoutes = require('./routes/etiquetaRoutes');
app.use('/api/etiquetas', etiquetaRoutes);

// Rutas de favoritos
const favoritoRoutes = require('./routes/favoritoRoutes');
app.use('/api/favoritos', favoritoRoutes);

// Rutas protegidas de usuario
const usuarioRoutes = require('./routes/usuarioRoutes');
app.use('/api/usuarios', usuarioRoutes);


// Middleware de manejo de errores
// const errorHandler = require('./middlewares/errorHandler');
// app.use(errorHandler);

module.exports = app;
