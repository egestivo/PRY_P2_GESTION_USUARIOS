# 🌐 Instrucciones para acceder desde Red Local

## 📋 Pasos para iniciar el proyecto en red local

### 1. Iniciar Backend (Terminal 1)
```bash
cd backend
node server.js
```
✅ El backend ahora escuchará en `0.0.0.0:1234` (accesible desde toda la red local)

### 2. Iniciar Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```
✅ Vite mostrará algo como:
```
➜  Local:   http://localhost:5173/
➜  Network: http://192.168.1.100:5173/
```

### 3. Acceder desde otros dispositivos

**Desde tu computadora:**
- `http://localhost:5173`

**Desde otros dispositivos en la misma red WiFi:**
- `http://192.168.x.x:5173` (usa la IP que muestra Vite en "Network")

---

## 🔧 Configuraciones aplicadas

### Backend (`server.js`)
```javascript
const HOST = '0.0.0.0'; // Escucha en todas las interfaces de red
app.listen(PORT, HOST, ...);
```

### Backend (`app.js`)
- ✅ CORS configurado para aceptar cualquier origen
- ✅ Headers CORS en archivos estáticos `/uploads/`
- ✅ Carpeta uploads servida públicamente

### Frontend (`vite.config.js`)
```javascript
server: {
    host: '0.0.0.0', // Accesible desde red local
    proxy: {
        '/api': { target: 'http://localhost:1234', ... },
        '/uploads': { target: 'http://localhost:1234', ... }
    }
}
```

### Frontend (Componentes)
- ✅ Todas las URLs de imágenes cambiadas de `http://localhost:1234/uploads/...` a `/uploads/...`
- ✅ El proxy de Vite redirige automáticamente las peticiones al backend

---

## 📸 Rutas de imágenes

**Antes (❌ no funcionaba en red local):**
```javascript
const fotoUrl = `http://localhost:1234${usuario.fotografia}`;
```

**Ahora (✅ funciona en cualquier dispositivo):**
```javascript
const fotoUrl = `${usuario.fotografia}`; // /uploads/user_photos/...
```

El proxy de Vite redirige `/uploads/*` → `http://localhost:1234/uploads/*`

---

## 🎨 Componentes actualizados

- ✅ `perfil-usuario.js` - Foto de perfil
- ✅ `mini-perfil-card.js` - Avatar en navbar
- ✅ `editar-perfil.js` - Preview de foto
- ✅ `admin-panel.js` - Avatares de usuarios
- ✅ `publicacion-listado.js` - Imágenes de publicaciones y avatares
- ✅ `publicacion-detalle.js` - Imagen principal y avatar del autor
- ✅ `favorito-listado.js` - Imágenes de favoritos

---

## 🔍 Verificar funcionamiento

1. Abre el navegador en otro dispositivo
2. Accede a `http://192.168.x.x:5173` (tu IP de red local)
3. Inicia sesión o regístrate
4. Verifica que:
   - ✅ Fotos de perfil se vean correctamente
   - ✅ Imágenes de publicaciones carguen
   - ✅ Avatares en comentarios y listados aparezcan
   - ✅ Favoritos muestren las imágenes

---

## 🚀 Usuario Admin por defecto

**Credenciales:**
- Username: `wiinteradm`
- Password: `winters20042`
- Correo: `admin@winters.co`

Este usuario se crea automáticamente al iniciar el backend.

---

## 💡 Notas importantes

- **Ambos dispositivos** (servidor y cliente) deben estar en la **misma red WiFi**
- **No cerrar las terminales** del backend y frontend mientras uses la app
- Si cambias de red, la IP puede cambiar (vuelve a verificar la IP que muestra Vite)
- El puerto `1234` (backend) y `5173` (frontend) deben estar libres

---

## 🛠️ Troubleshooting

**Las imágenes no cargan:**
1. Verifica que el backend esté corriendo en `http://0.0.0.0:1234`
2. Verifica que Vite muestre la dirección "Network"
3. Reinicia ambos servidores (backend y frontend)

**No puedo acceder desde otro dispositivo:**
1. Verifica que ambos dispositivos estén en la misma red WiFi
2. Desactiva firewall temporalmente (solo para pruebas)
3. Usa la IP que muestra Vite en "Network", no localhost

**Errores CORS:**
- Ya están configurados, pero si aparecen, reinicia el backend

---

¡Listo! 🎉 Ahora CoursArt funciona perfectamente en red local.
