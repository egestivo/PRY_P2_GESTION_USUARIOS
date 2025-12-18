// models/rolModel.js
// Modelo para operaciones con la tabla roles y usuario_rol

const db = require('../config/db');

const Rol = {
    // Busca el id de un rol por su nombre
    async findIdByNombre(nombre) {
        const [rows] = await db.query('SELECT id FROM roles WHERE nombre = ?', [nombre]);
        return rows[0] ? rows[0].id : null;
    },

    // Asigna un rol a un usuario
    async asignarRol(usuario_id, rol_id) {
        await db.query('INSERT INTO usuario_rol (usuario_id, rol_id) VALUES (?, ?)', [usuario_id, rol_id]);
    },

    // Obtiene el rol de un usuario
    async getRolByUsuarioId(usuario_id) {
        const [rows] = await db.query('SELECT r.nombre FROM roles r JOIN usuario_rol ur ON r.id = ur.rol_id WHERE ur.usuario_id = ?', [usuario_id]);
        return rows[0] ? rows[0].nombre : null;
    }
};

module.exports = Rol;
