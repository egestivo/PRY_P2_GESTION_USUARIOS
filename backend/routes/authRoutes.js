// routes/authRoutes.js
// Rutas para autenticación (registro y login)

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Multer para guardar fotos de usuario en /uploads/user_photos
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, '../uploads/user_photos'));
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
		cb(null, uniqueSuffix + '-' + file.originalname);
	}
});
const upload = multer({ storage });

// Registro con foto
router.post('/register', upload.single('fotografia'), authController.register);
// Login
router.post('/login', authController.login);

module.exports = router;
