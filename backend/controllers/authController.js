// controllers/authController.js
// Controlador para registro y login de usuarios

const Usuario = require('../models/usuarioModel');
const Rol = require('../models/rolModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Cargar variables de entorno
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'chupa_el_perro';

module.exports = {
    // Registro de usuario con foto
    async register(req, res) {
        try {
            const { username, nombre, correo, contrasena, fecha_nacimiento, rol } = req.body;
            // La foto viene en req.file, si no hay foto usar default
            let fotografia = '/uploads/user_photos/default-photo.png';
            if (req.file) {
                fotografia = '/uploads/user_photos/' + req.file.filename;
            }
            if (!username || !nombre || !correo || !contrasena || !fecha_nacimiento || !rol) {
                return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
            }
            // Verificar si el correo o username ya existen
            const existeCorreo = await Usuario.findByEmail(correo);
            const existeUsername = await Usuario.findByUsername(username);
            if (existeCorreo || existeUsername) {
                return res.status(409).json({ message: 'Correo o usuario ya registrado.' });
            }
            // Hashear contraseña
            const hash = await bcrypt.hash(contrasena, 10);
            const userId = await Usuario.create({ username, nombre, correo, contrasena: hash, fotografia, fecha_nacimiento });
            // Buscar el id del rol seleccionado
            const rolId = await Rol.findIdByNombre(rol);
            if (!rolId) {
                return res.status(400).json({ message: 'Rol inválido.' });
            }
            // Asignar el rol al usuario
            await Rol.asignarRol(userId, rolId);
            return res.status(201).json({ message: 'Usuario registrado correctamente', userId });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error en el registro.' });
        }
    },

    // Login de usuario (por correo o username)
    async login(req, res) {
        try {
            const { identificador, contrasena } = req.body;
            if (!identificador || !contrasena) {
                return res.status(400).json({ message: 'Username/correo y contraseña son obligatorios.' });
            }
            // Buscar por correo o username
            let usuario = await Usuario.findByEmail(identificador);
            if (!usuario) {
                usuario = await Usuario.findByUsername(identificador);
            }
            if (!usuario) {
                return res.status(401).json({ message: 'Credenciales inválidas.' });
            }
            const match = await bcrypt.compare(contrasena, usuario.contrasena);
            if (!match) {
                return res.status(401).json({ message: 'Credenciales inválidas.' });
            }
            // Obtener el rol real del usuario
            const rol = await require('../models/rolModel').getRolByUsuarioId(usuario.id);
            // Generar token JWT con el rol real
            const token = jwt.sign({ id: usuario.id, username: usuario.username, rol }, JWT_SECRET, { expiresIn: '2h' });
            return res.json({
                message: 'Login exitoso',
                token,
                usuario: {
                    id: usuario.id,
                    username: usuario.username,
                    nombre: usuario.nombre,
                    correo: usuario.correo,
                    fotografia: usuario.fotografia,
                    fecha_nacimiento: usuario.fecha_nacimiento,
                    rol
                }
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error en el login.' });
        }
    }
};
