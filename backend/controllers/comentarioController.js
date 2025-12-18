// controllers/comentarioController.js
// Controlador para CRUD de comentarios

const Comentario = require('../models/comentarioModel');

module.exports = {
    // Crear comentario
    async create(req, res) {
        try {
            const { publicacion_id, texto } = req.body;
            const usuario_id = req.user.id;
            if (!publicacion_id || !texto) {
                return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
            }
            const id = await Comentario.create({ usuario_id, publicacion_id, texto });
            res.status(201).json({ message: 'Comentario creado', id });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al crear comentario.' });
        }
    },

    // Listar comentarios de una publicación con paginación y filtro
    async findByPublicacionId(req, res) {
        try {
            const { publicacion_id } = req.params;
            let { page = 1, limit = 10, search = '' } = req.query;
            page = parseInt(page);
            limit = parseInt(limit);
            const offset = (page - 1) * limit;
            const filtro = `%${search}%`;
            const db = require('../config/db');
            const [rows] = await db.query(
                `SELECT 
                    c.*,
                    u.nombre as autor,
                    u.username as autor_username,
                    u.fotografia as autor_foto,
                    u.id as autor_id,
                    DATE_FORMAT(c.fecha, '%d/%m/%Y %H:%i') as fecha
                FROM comentarios c 
                JOIN usuarios u ON c.usuario_id = u.id 
                WHERE c.publicacion_id = ? AND c.texto LIKE ? 
                ORDER BY c.fecha DESC 
                LIMIT ? OFFSET ?`,
                [publicacion_id, filtro, limit, offset]
            );
            const [totalRows] = await db.query(
                `SELECT COUNT(*) as total FROM comentarios WHERE publicacion_id = ? AND texto LIKE ?`,
                [publicacion_id, filtro]
            );
            res.json({
                data: rows,
                page,
                limit,
                total: totalRows[0].total
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al obtener comentarios.' });
        }
    },

    // Editar comentario (solo autor, admin NO puede editar)
    async update(req, res) {
        try {
            const { id } = req.params;
            const { texto } = req.body;
            const comentario = await Comentario.findById(id);
            if (!comentario) return res.status(404).json({ message: 'No encontrado.' });
            if (comentario.usuario_id !== req.user.id) {
                return res.status(403).json({ message: 'Solo el autor puede editar.' });
            }
            await Comentario.update(id, texto);
            res.json({ message: 'Comentario actualizado' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al actualizar comentario.' });
        }
    },

    // Eliminar comentario (solo autor o admin)
    async remove(req, res) {
        try {
            const { id } = req.params;
            const comentario = await Comentario.findById(id);
            if (!comentario) return res.status(404).json({ message: 'No encontrado.' });
            if (comentario.usuario_id !== req.user.id && req.user.rol !== 'admin') {
                return res.status(403).json({ message: 'No autorizado.' });
            }
            await Comentario.remove(id);
            res.json({ message: 'Comentario eliminado' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al eliminar comentario.' });
        }
    }
};
