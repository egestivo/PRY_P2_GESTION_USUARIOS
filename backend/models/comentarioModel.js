// models/comentarioModel.js
// Modelo para operaciones con la tabla comentarios

const db = require('../config/db');

const Comentario = {
    // Crear un comentario
    async create({ usuario_id, publicacion_id, texto }) {
        const [result] = await db.query(
            'INSERT INTO comentarios (usuario_id, publicacion_id, texto) VALUES (?, ?, ?)',
            [usuario_id, publicacion_id, texto]
        );
        return result.insertId;
    },

    // Obtener comentarios de una publicación
    async findByPublicacionId(publicacion_id) {
        const [rows] = await db.query(
            'SELECT c.*, u.username, u.fotografia FROM comentarios c JOIN usuarios u ON c.usuario_id = u.id WHERE c.publicacion_id = ? ORDER BY c.fecha ASC',
            [publicacion_id]
        );
        return rows;
    },

    // Editar un comentario (solo autor)
    async update(id, texto) {
        await db.query('UPDATE comentarios SET texto = ? WHERE id = ?', [texto, id]);
    },

    // Eliminar un comentario (solo autor o admin)
    async remove(id) {
        await db.query('DELETE FROM comentarios WHERE id = ?', [id]);
    },

    // Obtener un comentario por id
    async findById(id) {
        const [rows] = await db.query('SELECT * FROM comentarios WHERE id = ?', [id]);
        return rows[0];
    }
};

module.exports = Comentario;
