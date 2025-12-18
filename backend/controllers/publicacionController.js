// controllers/publicacionController.js
// Controlador para CRUD de publicaciones

const Publicacion = require('../models/publicacionModel');

module.exports = {
    // Crear publicación (solo artista)
    async create(req, res) {
        try {
            const { titulo, descripcion } = req.body;
            const usuario_id = req.user.id;
            // La imagen viene de req.file si se subió
            let imagen = null;
            if (req.file) {
                imagen = '/uploads/' + req.file.filename;
            }
            if (!titulo || !descripcion || !imagen) {
                return res.status(400).json({ message: 'Todos los campos son obligatorios (incluye imagen).' });
            }
            const id = await Publicacion.create({ usuario_id, titulo, descripcion, imagen });
            res.status(201).json({ message: 'Publicación creada', id, imagen });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al crear publicación.' });
        }
    },

    // Listar todas las publicaciones con paginación y filtro
    async findAll(req, res) {
        try {
            let { page = 1, limit = 10, search = '' } = req.query;
            page = parseInt(page);
            limit = parseInt(limit);
            const offset = (page - 1) * limit;
            const filtro = `%${search}%`;
            const db = require('../config/db');
            const [rows] = await db.query(
                `SELECT 
                    p.*,
                    u.nombre as autor,
                    u.username as autor_username,
                    u.fotografia as autor_foto,
                    u.id as autor_id,
                    DATE_FORMAT(p.fecha_publicacion, '%d/%m/%Y %H:%i') as fecha
                FROM publicaciones p
                LEFT JOIN usuarios u ON p.usuario_id = u.id
                WHERE p.titulo LIKE ? OR p.descripcion LIKE ? 
                ORDER BY p.fecha_publicacion DESC 
                LIMIT ? OFFSET ?`,
                [filtro, filtro, limit, offset]
            );
            const [totalRows] = await db.query(
                `SELECT COUNT(*) as total FROM publicaciones WHERE titulo LIKE ? OR descripcion LIKE ?`,
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
            res.status(500).json({ message: 'Error al obtener publicaciones.' });
        }
    },

    // Obtener una publicación por id
    async findById(req, res) {
        try {
            const { id } = req.params;
            const db = require('../config/db');
            const [rows] = await db.query(
                `SELECT 
                    p.*,
                    u.nombre as autor,
                    u.username as autor_username,
                    u.fotografia as autor_foto,
                    u.id as autor_id,
                    DATE_FORMAT(p.fecha_publicacion, '%d/%m/%Y %H:%i') as fecha
                FROM publicaciones p
                LEFT JOIN usuarios u ON p.usuario_id = u.id
                WHERE p.id = ?`,
                [id]
            );
            if (!rows[0]) return res.status(404).json({ message: 'No encontrada.' });
            res.json(rows[0]);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al obtener publicación.' });
        }
    },

    // Actualizar publicación (solo autor, admin NO puede editar)
    async update(req, res) {
        try {
            const { id } = req.params;
            const { titulo, descripcion } = req.body;
            
            if (!titulo || !descripcion) {
                return res.status(400).json({ message: 'Título y descripción son obligatorios.' });
            }
            
            const publicacion = await Publicacion.findById(id);
            if (!publicacion) return res.status(404).json({ message: 'No encontrada.' });
            
            // Solo el autor puede editar
            if (publicacion.usuario_id !== req.user.id) {
                return res.status(403).json({ message: 'Solo el autor puede editar.' });
            }
            
            // Solo actualizar título y descripción (sin tocar imagen ni etiquetas)
            await Publicacion.update(id, { titulo, descripcion });
            
            res.json({ message: 'Publicación actualizada' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al actualizar publicación.' });
        }
    },

    // Eliminar publicación (autor o admin)
    async remove(req, res) {
        try {
            const { id } = req.params;
            const db = require('../config/db');
            const [rows] = await db.query('SELECT usuario_id FROM publicaciones WHERE id = ?', [id]);
            
            if (!rows[0]) return res.status(404).json({ message: 'No encontrada.' });
            
            const publicacion = rows[0];
            if (publicacion.usuario_id !== req.user.id && req.user.rol !== 'admin') {
                return res.status(403).json({ message: 'No autorizado.' });
            }
            
            await Publicacion.remove(id);
            res.json({ message: 'Publicación eliminada' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al eliminar publicación.' });
        }
    },

    // Listar publicaciones de un usuario
    async findByUsuarioId(req, res) {
        try {
            const { usuario_id } = req.params;
            const publicaciones = await Publicacion.findByUsuarioId(usuario_id);
            res.json(publicaciones);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al obtener publicaciones del usuario.' });
        }
    }
};
