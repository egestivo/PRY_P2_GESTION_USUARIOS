// utils/initAdmin.js
// Crea el usuario administrador si no existe

const Usuario = require('../models/usuarioModel');
const Rol = require('../models/rolModel');
const bcrypt = require('bcryptjs');

async function crearAdminSiNoExiste() {
    try {
        // Buscar si existe el usuario admin
        const adminExistente = await Usuario.findByUsername('wiinteradm');
        
        if (adminExistente) {
            console.log('✅ Usuario admin ya existe');
            return;
        }

        console.log('📝 Creando usuario administrador...');
        
        // Datos del admin
        const adminData = {
            username: 'wiinteradm',
            nombre: 'Administrador',
            correo: 'admin@winters.co',
            contrasena: await bcrypt.hash('winters20042', 10),
            fotografia: '/uploads/user_photos/default-photo.jpg',
            fecha_nacimiento: '2004-01-01'
        };

        // Crear usuario
        const adminId = await Usuario.create(adminData);
        
        // Asignar rol admin
        await Rol.asignarRol(adminId, 1);
        
        console.log('✅ Usuario administrador creado exitosamente');
        console.log('   Username: wiinteradm');
        console.log('   Correo: admin@winters.co');
        console.log('   Contraseña: winters20042');
    } catch (error) {
        console.error('❌ Error al crear usuario admin:', error);
    }
}

module.exports = { crearAdminSiNoExiste };
