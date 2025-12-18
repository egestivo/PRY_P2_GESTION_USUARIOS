// routes/comentarioRoutes.js
// Rutas para CRUD de comentarios

const express = require('express');
const router = express.Router();
const comentarioController = require('../controllers/comentarioController');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Crear comentario (autenticado)
router.post('/', authenticateToken, comentarioController.create);
// Listar comentarios de una publicación
router.get('/publicacion/:publicacion_id', comentarioController.findByPublicacionId);
// Editar comentario (solo autor)
router.put('/:id', authenticateToken, comentarioController.update);
// Eliminar comentario (solo autor o admin)
router.delete('/:id', authenticateToken, comentarioController.remove);

module.exports = router;
