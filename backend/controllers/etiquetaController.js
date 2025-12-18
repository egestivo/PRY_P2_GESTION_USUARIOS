// controllers/etiquetaController.js
// Controlador para CRUD de etiquetas y asignación a publicaciones

const Etiqueta = require('../models/etiquetaModel');

module.exports = {
    // Crear etiqueta
    async create(req, res) {
        try {
            const { nombre } = req.body;
            if (!nombre) return res.status(400).json({ message: 'El nombre es obligatorio.' });
            const id = await Etiqueta.create(nombre);
            res.status(201).json({ message: 'Etiqueta creada', id });
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ message: 'La etiqueta ya existe.' });
            }
            console.error(error);
            res.status(500).json({ message: 'Error al crear etiqueta.' });
        }
    },

    // Listar todas las etiquetas
    async findAll(req, res) {
        try {
            const etiquetas = await Etiqueta.findAll();
            res.json(etiquetas);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al obtener etiquetas.' });
        }
    },

    // Asignar etiquetas a una publicación (máx 3)
    async asignarEtiquetas(req, res) {
        try {
            const { publicacion_id, etiquetas } = req.body; // etiquetas: array de ids
            if (!publicacion_id || !Array.isArray(etiquetas)) {
                return res.status(400).json({ message: 'Datos incompletos.' });
            }
            await Etiqueta.asignarEtiquetas(publicacion_id, etiquetas);
            res.json({ message: 'Etiquetas asignadas' });
        } catch (error) {
            if (error.message.includes('Máximo 3 etiquetas')) {
                return res.status(400).json({ message: error.message });
            }
            console.error(error);
            res.status(500).json({ message: 'Error al asignar etiquetas.' });
        }
    },

    // Obtener etiquetas de una publicación
    async findByPublicacionId(req, res) {
        try {
            const { publicacion_id } = req.params;
            const etiquetas = await Etiqueta.findByPublicacionId(publicacion_id);
            res.json(etiquetas);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al obtener etiquetas.' });
        }
    },

    // Listar publicaciones por etiqueta
    async findPublicacionesByEtiquetaId(req, res) {
        try {
            const { etiqueta_id } = req.params;
            const publicaciones = await Etiqueta.findPublicacionesByEtiquetaId(etiqueta_id);
            res.json(publicaciones);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al obtener publicaciones.' });
        }
    }
};
