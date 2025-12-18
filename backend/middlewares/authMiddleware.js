// middlewares/authMiddleware.js
// Middleware para verificar JWT y roles

const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'chupa_el_perro';

// Verifica que el usuario esté autenticado
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token no proporcionado.' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token inválido.' });
    req.user = user;
    next();
  });
}

// Verifica que el usuario tenga uno de los roles permitidos
function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.rol)) {
      return res.status(403).json({ message: '¡Oops! Parece que no eres digno.' });
    }
    next();
  };
}

module.exports = { authenticateToken, authorizeRoles };
