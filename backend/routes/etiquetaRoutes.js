// routes/etiquetaRoutes.js
// Rutas para CRUD de etiquetas y asignación a publicaciones

const express = require('express');
const router = express.Router();
const etiquetaController = require('../controllers/etiquetaController');
const { authenticateToken, authorizeRoles } = require('../middlewares/authMiddleware');

// Crear etiqueta (solo admin o artista)
router.post('/', authenticateToken, authorizeRoles('admin', 'artista'), etiquetaController.create);
// Listar todas las etiquetas
router.get('/', etiquetaController.findAll);
// Asignar etiquetas a una publicación (solo artista o admin)
router.post('/asignar', authenticateToken, authorizeRoles('admin', 'artista'), etiquetaController.asignarEtiquetas);
// Obtener etiquetas de una publicación
router.get('/publicacion/:publicacion_id', etiquetaController.findByPublicacionId);
// Listar publicaciones por etiqueta
router.get('/publicaciones/:etiqueta_id', etiquetaController.findPublicacionesByEtiquetaId);

module.exports = router;
