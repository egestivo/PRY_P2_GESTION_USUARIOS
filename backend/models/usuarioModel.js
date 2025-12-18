
// models/usuarioModel.js
// Modelo para operaciones con la tabla usuarios

const db = require('../config/db');

const Usuario = {
    // Busca un usuario por correo
    async findByEmail(correo) {
        const [rows] = await db.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
        return rows[0];
    },

    // Busca un usuario por username
    async findByUsername(username) {
        const [rows] = await db.query('SELECT * FROM usuarios WHERE username = ?', [username]);
        return rows[0];
    },

    // Crea un nuevo usuario (ahora acepta fotografía)
    async create({ username, nombre, correo, contrasena, fotografia, fecha_nacimiento }) {
        const [result] = await db.query(
            'INSERT INTO usuarios (username, nombre, correo, contrasena, fotografia, fecha_nacimiento) VALUES (?, ?, ?, ?, ?, ?)',
            [username, nombre, correo, contrasena, fotografia, fecha_nacimiento]
        );
        return result.insertId;
    },

    // Busca un usuario por id
    async findById(id) {
        const [rows] = await db.query('SELECT * FROM usuarios WHERE id = ?', [id]);
        return rows[0];
    },

        // Actualizar datos de usuario (incluye foto)
    async update(id, { nombre, username, correo, fotografia, fecha_nacimiento }) {
        await db.query(
            'UPDATE usuarios SET nombre = ?, username = ?, correo = ?, fotografia = ?, fecha_nacimiento = ? WHERE id = ?',
            [nombre, username, correo, fotografia, fecha_nacimiento, id]
        );
    }

    ,

    // Actualizar contraseña (hash ya generado)
    async updatePassword(id, nuevaContrasenaHash) {
        await db.query(
            'UPDATE usuarios SET contrasena = ? WHERE id = ?',
            [nuevaContrasenaHash, id]
        );
    }
};

module.exports = Usuario;
