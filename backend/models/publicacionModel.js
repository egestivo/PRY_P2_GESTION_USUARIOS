// models/publicacionModel.js
// Modelo para operaciones con la tabla publicaciones

const db = require('../config/db');

const Publicacion = {
    // Crear una publicación
    async create({ usuario_id, titulo, descripcion, imagen }) {
        const [result] = await db.query(
            'INSERT INTO publicaciones (usuario_id, titulo, descripcion, imagen) VALUES (?, ?, ?, ?)',
            [usuario_id, titulo, descripcion, imagen]
        );
        return result.insertId;
    },

    // Obtener todas las publicaciones
    async findAll() {
        const [rows] = await db.query('SELECT * FROM publicaciones ORDER BY fecha_publicacion DESC');
        return rows;
    },

    // Obtener una publicación por id
    async findById(id) {
        const [rows] = await db.query('SELECT * FROM publicaciones WHERE id = ?', [id]);
        return rows[0];
    },

    // Actualizar una publicación
    async update(id, { titulo, descripcion, imagen, etiquetas }) {
        // Si imagen es proporcionada, actualizarla también
        if (imagen !== undefined) {
            await db.query(
                'UPDATE publicaciones SET titulo = ?, descripcion = ?, imagen = ?, etiquetas = ? WHERE id = ?',
                [titulo, descripcion, imagen, etiquetas, id]
            );
        } else {
            // Solo actualizar título y descripción, sin tocar imagen ni etiquetas
            await db.query(
                'UPDATE publicaciones SET titulo = ?, descripcion = ? WHERE id = ?',
                [titulo, descripcion, id]
            );
        }
    },

    // Eliminar una publicación
    async remove(id) {
        await db.query('DELETE FROM publicaciones WHERE id = ?', [id]);
    },

    // Obtener publicaciones de un usuario
    async findByUsuarioId(usuario_id) {
        const [rows] = await db.query('SELECT * FROM publicaciones WHERE usuario_id = ? ORDER BY fecha_publicacion DESC', [usuario_id]);
        return rows;
    }
};

module.exports = Publicacion;
