// routes/favoritoRoutes.js
// Rutas para favoritos

const express = require('express');
const router = express.Router();
const favoritoController = require('../controllers/favoritoController');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Agregar a favoritos
router.post('/add', authenticateToken, favoritoController.add);
// Quitar de favoritos
router.post('/remove', authenticateToken, favoritoController.remove);
// Listar favoritos del usuario autenticado
router.get('/', authenticateToken, favoritoController.findByUsuarioId);
// Listar favoritos de un usuario (público)
router.get('/usuario/:usuario_id', favoritoController.findByUsuarioIdPublic);
// Verificar si una publicación está en favoritos
router.get('/exists/:publicacion_id', authenticateToken, favoritoController.exists);

module.exports = router;
