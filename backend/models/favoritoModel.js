// models/favoritoModel.js
// Modelo para operaciones con la tabla favoritos

const db = require('../config/db');

const Favorito = {
    // Agregar a favoritos
    async add(usuario_id, publicacion_id) {
        const [result] = await db.query(
            'INSERT INTO favoritos (usuario_id, publicacion_id) VALUES (?, ?)',
            [usuario_id, publicacion_id]
        );
        return result.insertId;
    },

    // Quitar de favoritos
    async remove(usuario_id, publicacion_id) {
        await db.query(
            'DELETE FROM favoritos WHERE usuario_id = ? AND publicacion_id = ?',
            [usuario_id, publicacion_id]
        );
    },

    // Listar favoritos de un usuario
    async findByUsuarioId(usuario_id) {
        const [rows] = await db.query(
            'SELECT f.*, p.titulo, p.descripcion, p.imagen FROM favoritos f JOIN publicaciones p ON f.publicacion_id = p.id WHERE f.usuario_id = ? ORDER BY f.fecha_guardado DESC',
            [usuario_id]
        );
        return rows;
    },

    // Verificar si una publicación está en favoritos
    async exists(usuario_id, publicacion_id) {
        const [rows] = await db.query(
            'SELECT id FROM favoritos WHERE usuario_id = ? AND publicacion_id = ?',
            [usuario_id, publicacion_id]
        );
        return rows.length > 0;
    }
};

module.exports = Favorito;
