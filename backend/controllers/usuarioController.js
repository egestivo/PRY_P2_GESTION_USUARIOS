// controllers/usuarioController.js
// Controlador para administración de usuarios (solo admin)

const db = require('../config/db');

const Usuario = require('../models/usuarioModel');
const bcrypt = require('bcryptjs');
const path = require('path');
module.exports = {
    // Actualizar perfil de usuario (solo el propio usuario)
    async update(req, res) {
        try {
            const { id } = req.params;
            // Solo el propio usuario puede actualizar su perfil
            if (parseInt(id) !== req.user.id) {
                return res.status(403).json({ message: 'No autorizado.' });
            }
            // Obtener datos actuales
            const usuarioActual = await Usuario.findById(id);
            if (!usuarioActual) {
                return res.status(404).json({ message: 'Usuario no encontrado.' });
            }
            // Usar los datos enviados o mantener los actuales
            const nombre = req.body.nombre || usuarioActual.nombre;
            const username = req.body.username || usuarioActual.username;
            const correo = req.body.correo || usuarioActual.correo;
            const fecha_nacimiento = req.body.fecha_nacimiento || usuarioActual.fecha_nacimiento;
            let fotografia = usuarioActual.fotografia;
            if (req.file) {
                fotografia = '/uploads/user_photos/' + req.file.filename;
            }
            await Usuario.update(id, { nombre, username, correo, fotografia, fecha_nacimiento });
            
            const usuarioActualizado = await Usuario.findById(id);
            res.json(usuarioActualizado);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al actualizar perfil.' });
        }
    },
    // Listar todos los usuarios con paginación y filtro
    async findAll(req, res) {
        try {
            let { page = 1, limit = 10, search = '' } = req.query;
            page = parseInt(page);
            limit = parseInt(limit);
            const offset = (page - 1) * limit;
            // Filtro por nombre o correo
            const filtro = `%${search}%`;
            const [rows] = await db.query(
                `SELECT id, username, nombre, correo, fotografia, fecha_nacimiento, fecha_registro
                 FROM usuarios
                 WHERE nombre LIKE ? OR correo LIKE ?
                 ORDER BY fecha_registro DESC
                 LIMIT ? OFFSET ?`,
                [filtro, filtro, limit, offset]
            );
            // Total para frontend
            const [totalRows] = await db.query(
                `SELECT COUNT(*) as total FROM usuarios WHERE nombre LIKE ? OR correo LIKE ?`,
                [filtro, filtro]
            );
            res.json({
                data: rows,
                page,
                limit,
                total: totalRows[0].total
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al obtener usuarios.' });
        }
    },

    // Eliminar usuario por id
    async remove(req, res) {
        try {
            const { id } = req.params;
            await db.query('DELETE FROM usuarios WHERE id = ?', [id]);
            res.json({ message: 'Usuario eliminado' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al eliminar usuario.' });
        }
    }
    ,

    // Cambiar contraseña del propio usuario
    async changePassword(req, res) {
        try {
            const { id } = req.params;
            const idNum = parseInt(id);
            if (req.user.id !== idNum) return res.status(403).json({ message: 'No autorizado.' });

            const { currentPassword, newPassword } = req.body;
            if (!currentPassword || !newPassword) return res.status(400).json({ message: 'currentPassword y newPassword son obligatorios.' });

            const usuario = await Usuario.findById(id);
            if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado.' });

            const match = await bcrypt.compare(currentPassword, usuario.contrasena);
            if (!match) return res.status(401).json({ message: 'Contraseña actual incorrecta.' });

            const hash = await bcrypt.hash(newPassword, 10);
            await Usuario.updatePassword(id, hash);

            res.json({ message: 'Contraseña actualizada correctamente.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al cambiar contraseña.' });
        }
    }
};
