// controllers/favoritoController.js
// Controlador para favoritos

const Favorito = require('../models/favoritoModel');

module.exports = {
    // Agregar a favoritos
    async add(req, res) {
        try {
            const usuario_id = req.user.id;
            const { publicacion_id } = req.body;
            if (!publicacion_id) return res.status(400).json({ message: 'publicacion_id es obligatorio.' });
            const exists = await Favorito.exists(usuario_id, publicacion_id);
            if (exists) return res.status(409).json({ message: 'Ya está en favoritos.' });
            const id = await Favorito.add(usuario_id, publicacion_id);
            res.status(201).json({ message: 'Agregado a favoritos', id });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al agregar a favoritos.' });
        }
    },

    // Quitar de favoritos
    async remove(req, res) {
        try {
            const usuario_id = req.user.id;
            const { publicacion_id } = req.body;
            if (!publicacion_id) return res.status(400).json({ message: 'publicacion_id es obligatorio.' });
            await Favorito.remove(usuario_id, publicacion_id);
            res.json({ message: 'Eliminado de favoritos' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al quitar de favoritos.' });
        }
    },

    // Listar favoritos de un usuario
    async findByUsuarioId(req, res) {
        try {
            const usuario_id = req.user.id;
            const favoritos = await Favorito.findByUsuarioId(usuario_id);
            res.json(favoritos);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al obtener favoritos.' });
        }
    },

    // Listar favoritos de un usuario público (por id)
    async findByUsuarioIdPublic(req, res) {
        try {
            const usuario_id = req.params.usuario_id;
            const favoritos = await Favorito.findByUsuarioId(usuario_id);
            res.json(favoritos);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al obtener favoritos.' });
        }
    },

    // Verificar si una publicación está en favoritos
    async exists(req, res) {
        try {
            const usuario_id = req.user.id;
            const { publicacion_id } = req.params;
            const exists = await Favorito.exists(usuario_id, publicacion_id);
            res.json({ exists });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al verificar favorito.' });
        }
    }
};
