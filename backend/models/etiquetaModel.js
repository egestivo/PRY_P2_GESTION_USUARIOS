// models/etiquetaModel.js
// Modelo para operaciones con la tabla etiquetas y publicacion_etiqueta

const db = require('../config/db');

const Etiqueta = {
    // Crear una etiqueta
    async create(nombre) {
        const [result] = await db.query('INSERT INTO etiquetas (nombre) VALUES (?)', [nombre]);
        return result.insertId;
    },

    // Listar todas las etiquetas
    async findAll() {
        const [rows] = await db.query('SELECT * FROM etiquetas ORDER BY nombre ASC');
        return rows;
    },

    // Asignar etiquetas a una publicación (máx 3)
    async asignarEtiquetas(publicacion_id, etiquetas) {
        if (etiquetas.length > 3) throw new Error('Máximo 3 etiquetas por publicación');
        // Eliminar etiquetas previas
        await db.query('DELETE FROM publicacion_etiqueta WHERE publicacion_id = ?', [publicacion_id]);
        // Insertar nuevas etiquetas
        for (const etiqueta_id of etiquetas) {
            await db.query('INSERT INTO publicacion_etiqueta (publicacion_id, etiqueta_id) VALUES (?, ?)', [publicacion_id, etiqueta_id]);
        }
    },

    // Obtener etiquetas de una publicación
    async findByPublicacionId(publicacion_id) {
        const [rows] = await db.query(
            'SELECT e.* FROM etiquetas e JOIN publicacion_etiqueta pe ON e.id = pe.etiqueta_id WHERE pe.publicacion_id = ?',
            [publicacion_id]
        );
        return rows;
    },

    // Listar publicaciones por etiqueta
    async findPublicacionesByEtiquetaId(etiqueta_id) {
        const [rows] = await db.query(
            'SELECT p.* FROM publicaciones p JOIN publicacion_etiqueta pe ON p.id = pe.publicacion_id WHERE pe.etiqueta_id = ? ORDER BY p.fecha_publicacion DESC',
            [etiqueta_id]
        );
        return rows;
    }
};

module.exports = Etiqueta;
