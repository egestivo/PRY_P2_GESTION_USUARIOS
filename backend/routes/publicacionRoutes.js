// routes/publicacionRoutes.js
// Rutas para CRUD de publicaciones

const express = require('express');
const router = express.Router();
const publicacionController = require('../controllers/publicacionController');

const { authenticateToken, authorizeRoles } = require('../middlewares/authMiddleware');
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// Crear publicación (solo artista, acepta imagen)
router.post('/', authenticateToken, authorizeRoles('artista'), upload.single('imagen'), publicacionController.create);
// Listar todas las publicaciones
router.get('/', publicacionController.findAll);
// Obtener una publicación por id
router.get('/:id', publicacionController.findById);


// Actualizar publicación (solo autor, solo título y descripción)
router.put('/:id', authenticateToken, publicacionController.update);
// Eliminar publicación (solo autor o admin)
router.delete('/:id', authenticateToken, publicacionController.remove);
// Eliminar publicación como admin (puede eliminar cualquier publicación)
router.delete('/admin/:id', authenticateToken, authorizeRoles('admin'), publicacionController.remove);
// Listar publicaciones de un usuario
router.get('/usuario/:usuario_id', publicacionController.findByUsuarioId);

module.exports = router;
