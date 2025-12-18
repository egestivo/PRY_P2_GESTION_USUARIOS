// routes/usuarioRoutes.js
// Ejemplo de rutas protegidas por JWT y rol

const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middlewares/authMiddleware');
const usuarioController = require('../controllers/usuarioController');
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/user_photos'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// Obtener usuario por ID
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const Usuario = require('../models/usuarioModel');
        const usuario = await Usuario.findById(req.params.id);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        delete usuario.contrasena;
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener usuario' });
    }
});

// Actualizar perfil de usuario (solo el propio usuario, acepta nueva foto)
router.put('/:id', authenticateToken, upload.single('fotografia'), usuarioController.update);

// Cambiar contraseña (solo propio usuario)
router.post('/:id/change-password', authenticateToken, usuarioController.changePassword);

// Ruta solo para usuarios autenticados
router.get('/perfil', authenticateToken, (req, res) => {
    res.json({ message: 'Perfil de usuario', user: req.user });
});

// Eliminar usuario (propio perfil o admin puede eliminar cualquiera)
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const idNum = parseInt(id);
        
        if (req.user.id !== idNum && req.user.rol !== 'admin') {
            return res.status(403).json({ message: 'No autorizado' });
        }
        
        // Verificar si el usuario a eliminar es el admin principal
        const Usuario = require('../models/usuarioModel');
        const usuarioAEliminar = await Usuario.findById(id);
        
        if (usuarioAEliminar && usuarioAEliminar.username === 'wiinteradm') {
            return res.status(403).json({ message: 'No se puede eliminar el usuario administrador principal' });
        }
        
        const db = require('../config/db');
        await db.query('DELETE FROM usuarios WHERE id = ?', [id]);
        res.json({ message: 'Usuario eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar usuario' });
    }
});

// Administración: Listar todos los usuarios (solo admin)
router.get('/admin/usuarios', authenticateToken, authorizeRoles('admin'), usuarioController.findAll);

// Rutas de ejemplo de roles
router.get('/admin', authenticateToken, authorizeRoles('admin'), (req, res) => {
    res.json({ message: 'Solo admin puede ver esto', user: req.user });
});
router.get('/artista', authenticateToken, authorizeRoles('artista'), (req, res) => {
    res.json({ message: 'Solo artista puede ver esto', user: req.user });
});
router.get('/visitante', authenticateToken, authorizeRoles('visitante'), (req, res) => {
    res.json({ message: 'Solo visitante puede ver esto', user: req.user });
});

module.exports = router;
