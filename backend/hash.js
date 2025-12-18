const bcrypt = require('bcryptjs');

const nuevaClave = 'winters20042'; // Cambia esto por la contraseña que quieras
bcrypt.hash(nuevaClave, 10, (err, hash) => {
  if (err) throw err;
  console.log('Hash generado:', hash);
});