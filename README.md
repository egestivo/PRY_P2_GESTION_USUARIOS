# 📚 Documentación Técnica - Sistema CoursArt

## 🎨 Introducción

Este proyecto es una red social artística universitaria llamada **CoursArt**, construida con **Lit Elements** (Web Components) en el frontend y **Node.js + Express + MySQL** en el backend. El sistema cuenta con autenticación JWT, roles de usuario (admin, artista, visitante) y funcionalidades completas de publicaciones, comentarios y favoritos.

---

## 🧩 Arquitectura Frontend - Lit Elements

### ¿Qué son Lit Elements?

**Lit** es una biblioteca moderna para crear **Web Components** reutilizables, encapsulados y con rendimiento optimizado. Cada componente tiene:

- **Shadow DOM**: Encapsulación de estilos y estructura
- **Propiedades Reactivas**: Actualización automática de la UI cuando cambian los datos
- **Ciclo de vida**: Métodos como `connectedCallback()`, `render()`, `updated()`

---

## 📂 Estructura de Componentes

```
frontend/src/
├── my-element.js              # Shell principal (router y navegación)
├── components/
│   ├── auth/
│   │   ├── user-login.js      # Formulario de inicio de sesión
│   │   └── user-register.js   # Formulario de registro
│   ├── usuario/
│   │   ├── perfil-usuario.js  # Vista de perfil de usuario
│   │   ├── editar-perfil.js   # Edición de perfil y cambio de contraseña
│   │   └── mini-perfil-card.js # Card pequeña de perfil en navbar
│   ├── publicacion/
│   │   ├── publicacion-listado.js # Feed de publicaciones
│   │   ├── publicacion-nueva.js   # Crear nueva publicación
│   │   ├── publicacion-editar.js  # Editar publicación
│   │   └── publicacion-detalle.js # Detalle de publicación
│   ├── comentario/
│   │   └── comentario-listado.js  # Listado y creación de comentarios
│   ├── favorito/
│   │   ├── favorito-boton.js      # Botón toggle para favoritos
│   │   └── favorito-listado.js    # Lista de favoritos del usuario
│   ├── admin/
│   │   └── admin-panel.js         # Panel de administración
│   ├── ui-snackbar.js             # Notificaciones toast
│   └── ui-confirm-dialog.js       # Diálogo de confirmación modal
```

---

## 🔥 Componentes Principales

### 1️⃣ `my-element.js` - Shell Principal

**Propósito**: Router y contenedor principal de la aplicación.

#### Propiedades Reactivas
```javascript
static properties = {
  page: { type: String },           // Página actual
  user: { type: Object },            // Usuario autenticado
  admin: { type: Boolean },          // Si es admin
  selectedPublicacion: { type: Object },
  editandoPublicacion: { type: Object }
};
```

#### Eventos Emitidos
- **NO emite eventos directamente** (es el nivel superior)

#### Eventos Escuchados
```javascript
// En connectedCallback():
this.addEventListener('login-success', this._onLogin);
this.addEventListener('register-success', this._onRegister);
this.addEventListener('editar-perfil', () => { this.page = 'editar-perfil'; });
this.addEventListener('perfil-actualizado', async (e) => { ... });
this.addEventListener('cancelar-edicion', () => { this.page = 'perfil'; });
this.addEventListener('ver-favoritos', () => { this.page = 'favoritos'; });
this.addEventListener('volver-perfil', () => { this.page = 'perfil'; });
this.addEventListener('ver-publicacion-favorita', async (e) => { ... });
this.addEventListener('ver-detalle', this._verDetalle);
this.addEventListener('editar-publicacion', this._editarPublicacion);
```

#### Navegación Interna
```javascript
_go(page) {
  this.page = page;
}
```

El router renderiza componentes basados en `this.page`:
- `'login'` → `<user-login>`
- `'register'` → `<user-register>`
- `'perfil'` → `<perfil-usuario>`
- `'editar-perfil'` → `<editar-perfil>`
- `'favoritos'` → `<favorito-listado>`
- `'nueva'` → `<publicacion-nueva>`
- `'detalle'` → `<publicacion-detalle>`
- `'admin'` → `<admin-panel>`
- Por defecto → `<publicacion-listado>` (feed)

---

### 2️⃣ `user-login.js` - Inicio de Sesión

#### Eventos Emitidos
```javascript
// Al hacer login exitoso
this.dispatchEvent(new CustomEvent('login-success', {
  detail: { token, user },
  bubbles: true,
  composed: true
}));

// Al hacer clic en "Registrarse"
this.dispatchEvent(new CustomEvent('ir-registro', {
  bubbles: true,
  composed: true
}));
```

#### Event Handlers `@click`
```javascript
@submit=${this._onSubmit}  // Envía credenciales al backend
```

#### Flujo de Autenticación
1. Usuario ingresa correo/contraseña
2. `_onSubmit()` → `POST /api/auth/login`
3. Backend valida con `bcrypt.compare()`
4. Backend genera JWT con `jsonwebtoken`
5. Frontend guarda token en `localStorage`
6. Emite evento `login-success` con `{ token, user }`
7. `my-element` escucha evento → actualiza `this.user` → renderiza navbar

---

### 3️⃣ `user-register.js` - Registro de Usuario

#### Propiedades Reactivas
```javascript
edad: { type: Number },
showEdad: { type: Boolean },
passwordsMatch: { type: Boolean }
```

#### Eventos Emitidos
```javascript
// Al registrarse exitosamente
this.dispatchEvent(new CustomEvent('register-success', {
  detail: { token, user },
  bubbles: true,
  composed: true
}));

// Al hacer clic en "Iniciar Sesión"
this.dispatchEvent(new CustomEvent('ir-login', {
  bubbles: true,
  composed: true
}));
```

#### Event Handlers `@input` y `@change`
```javascript
@change=${this._onFechaChange}       // Calcula edad automáticamente
@input=${this._checkPasswordMatch}   // Valida que las contraseñas coincidan
@submit=${this._onSubmit}            // Envía formulario con FormData
```

#### Validación de Contraseñas
```javascript
_checkPasswordMatch(e) {
  const password = this.renderRoot.querySelector('[name="contrasena"]');
  const repeatPassword = this.renderRoot.querySelector('[name="repetir_contrasena"]');
  
  if (password.value === repeatPassword.value) {
    repeatPassword.classList.add('password-match', 'is-valid');
    repeatPassword.classList.remove('is-invalid');
    this.passwordsMatch = true;
  } else {
    repeatPassword.classList.add('is-invalid');
    repeatPassword.classList.remove('is-valid', 'password-match');
    this.passwordsMatch = false;
  }
}
```

#### Cálculo de Edad
```javascript
_onFechaChange(e) {
  const fecha = e.target.value;
  if (fecha) {
    const edad = this._calcularEdad(fecha);
    this.edad = edad;
    this.showEdad = true;
  } else {
    this.showEdad = false;
  }
}

_calcularEdad(fecha) {
  const hoy = new Date();
  const nacimiento = new Date(fecha);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
}
```

---

### 4️⃣ `perfil-usuario.js` - Perfil de Usuario

#### Propiedades Reactivas
```javascript
usuario: { type: Object },           // Usuario del perfil mostrado
currentUser: { type: Object },       // Usuario autenticado
confirmandoEliminar: { type: Boolean }
```

#### Eventos Emitidos
```javascript
// Al hacer clic en "Editar Perfil"
this.dispatchEvent(new CustomEvent('editar-perfil', {
  detail: this.usuario,
  bubbles: true,
  composed: true
}));

// Al hacer clic en "Ver Favoritos"
this.dispatchEvent(new CustomEvent('ver-favoritos', {
  detail: { usuarioId: this.usuario.id },
  bubbles: true,
  composed: true
}));

// Después de eliminar perfil
this.dispatchEvent(new CustomEvent('perfil-eliminado', {
  bubbles: true,
  composed: true
}));
```

#### Event Handlers `@click`
```javascript
@click=${this._editarPerfil}        // Navega a editar-perfil
@click=${this._verFavoritos}        // Navega a favoritos
@click=${this._confirmarEliminar}   // Primer clic (confirmación)
@click=${this._eliminarPerfil}      // Segundo clic (ejecuta DELETE)
```

#### Lógica de Permisos
```javascript
_mostrarBotones() {
  const esPropietario = this.currentUser && this.currentUser.id === this.usuario.id;
  const esAdmin = this.currentUser && this.currentUser.rol === 'admin';
  return esPropietario || esAdmin;
}

_mostrarVerFavoritos() {
  if (!this.usuario || !this.usuario.rol) return false;
  return this.usuario.rol !== 'admin'; // Admin no tiene botón de favoritos
}
```

#### Patrón de Confirmación Doble Clic
```javascript
_confirmarEliminar() {
  this._showSnackbar('⚠️ Haz clic de nuevo para confirmar eliminación', '#ff9800');
  this.confirmandoEliminar = true;
  
  setTimeout(() => {
    this.confirmandoEliminar = false; // Cancela después de 3 segundos
  }, 3000);
}

async _eliminarPerfil() {
  const res = await fetch(`/api/usuarios/${this.usuario.id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  // Si eliminó su propia cuenta, cerrar sesión
  if (esPropio) {
    localStorage.clear();
    window.location.reload();
  }
}
```

---

### 5️⃣ `editar-perfil.js` - Editar Perfil y Cambiar Contraseña

#### Eventos Emitidos
```javascript
// Al guardar cambios exitosamente
this.dispatchEvent(new CustomEvent('perfil-actualizado', {
  detail: data, // Usuario actualizado desde backend
  bubbles: true,
  composed: true
}));

// Al cancelar edición
this.dispatchEvent(new CustomEvent('cancelar-edicion', {
  bubbles: true,
  composed: true
}));
```

#### Event Handlers
```javascript
@submit=${this._onSubmit}           // Guarda perfil y contraseña
@input=${this._onInput}             // Valida campos en tiempo real
@change=${this._onFotoChange}       // Preview de foto antes de subir
@click=${this._cancelar}            // Botón cancelar
```

#### Validación en Tiempo Real
```javascript
_onInput(e) {
  const input = e.target;
  if (input.tagName === 'INPUT' && input.type !== 'file') {
    if (input.checkValidity()) {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
    } else {
      input.classList.remove('is-valid');
      if (input.value) input.classList.add('is-invalid');
    }
  }
}
```

#### Cambio de Contraseña
```javascript
async _onSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const fd = new FormData(form);
  
  const currentPassword = form.currentPassword.value.trim();
  const newPassword = form.newPassword.value.trim();
  
  // 1. Actualizar perfil (PUT /api/usuarios/:id)
  const res = await fetch(`/api/usuarios/${this.usuario.id}`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` },
    body: fd // FormData incluye nombre, correo, foto, etc
  });
  
  // 2. Si hay contraseñas, cambiarlas (POST /api/usuarios/:id/change-password)
  if (currentPassword && newPassword) {
    if (newPassword.length < 6) {
      throw new Error('La contraseña nueva debe tener al menos 6 caracteres');
    }
    
    const resPass = await fetch(`/api/usuarios/${this.usuario.id}/change-password`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ currentPassword, newPassword })
    });
    
    // Backend valida contraseña actual con bcrypt.compare()
    // Backend hashea nueva contraseña con bcrypt.hash()
    // Backend actualiza DB: UPDATE usuarios SET contrasena = ?
  }
  
  // 3. Emitir evento de éxito
  this.dispatchEvent(new CustomEvent('perfil-actualizado', { ... }));
}
```

---

### 6️⃣ `favorito-boton.js` - Botón de Favoritos

#### Propiedades Reactivas
```javascript
favorito: { type: Boolean },         // Estado actual (marcado o no)
publicacionId: { type: Number }      // ID de la publicación
```

#### Eventos Emitidos
```javascript
// Después de toggle exitoso
this.dispatchEvent(new CustomEvent('favorito-cambiado', {
  detail: { favorito: this.favorito },
  bubbles: true,
  composed: true
}));
```

#### Event Handlers `@click`
```javascript
@click=${this._toggleFavorito}  // Toggle favorito (add/remove)
```

#### Verificación de Estado Inicial
```javascript
connectedCallback() {
  super.connectedCallback();
  this._checkEstado();
}

async _checkEstado() {
  if (!this.publicacionId) return;
  const token = localStorage.getItem('token');
  if (!token) return; // Usuario no autenticado
  
  const res = await fetch(`/api/favoritos/exists/${this.publicacionId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await res.json();
  this.favorito = !!data.exists; // Actualiza UI automáticamente
}
```

#### Toggle Favorito
```javascript
async _toggleFavorito(e) {
  e.stopPropagation(); // Evita propagar click a elementos padres
  
  const token = localStorage.getItem('token');
  if (!token) return this._showSnackbar('⚠️ Debes iniciar sesión');
  
  if (this.favorito) {
    // Quitar de favoritos
    await fetch(`/api/favoritos/remove`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ publicacion_id: this.publicacionId })
    });
    this.favorito = false;
    this._showSnackbar('Eliminado de favoritos', '#198754');
  } else {
    // Agregar a favoritos
    await fetch(`/api/favoritos/add`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ publicacion_id: this.publicacionId })
    });
    this.favorito = true;
    this._showSnackbar('Agregado a favoritos ⭐', '#198754');
  }
  
  this.dispatchEvent(new CustomEvent('favorito-cambiado', { ... }));
}
```

---

### 7️⃣ `favorito-listado.js` - Lista de Favoritos

#### Propiedades Reactivas
```javascript
favoritos: { type: Array },
loading: { type: Boolean },
usuarioId: { type: Number }
```

#### Eventos Emitidos
```javascript
// Al hacer clic en una publicación favorita
this.dispatchEvent(new CustomEvent('ver-publicacion-favorita', {
  detail: { publicacion_id: fav.publicacion_id },
  bubbles: true,
  composed: true
}));

// Al hacer clic en "Volver al perfil"
this.dispatchEvent(new CustomEvent('volver-perfil', {
  bubbles: true,
  composed: true
}));
```

#### Event Handlers `@click`
```javascript
@click=${() => this._verPublicacion(fav)}  // Ver detalle de publicación
@click=${this._volver}                      // Volver al perfil
```

#### Carga de Favoritos
```javascript
connectedCallback() {
  super.connectedCallback();
  if (this.usuarioId) {
    this._cargarFavoritos();
  }
}

async _cargarFavoritos() {
  this.loading = true;
  const res = await fetch(`/api/favoritos/usuario/${this.usuarioId}`);
  this.favoritos = await res.json();
  this.loading = false;
}
```

**Backend Endpoint**: `GET /api/favoritos/usuario/:usuario_id` (público, no requiere auth)

---

### 8️⃣ `publicacion-listado.js` - Feed de Publicaciones

#### Propiedades Reactivas
```javascript
publicaciones: { type: Array },
loading: { type: Boolean },
user: { type: Object }
```

#### Eventos Emitidos
```javascript
// Al hacer clic en una publicación
this.dispatchEvent(new CustomEvent('ver-detalle', {
  detail: pub,
  bubbles: true,
  composed: true
}));

// Al hacer clic en "Editar"
this.dispatchEvent(new CustomEvent('editar-publicacion', {
  detail: pub,
  bubbles: true,
  composed: true
}));
```

#### Event Handlers
```javascript
@input=${this._onBuscar}                    // Busca por título/etiquetas
@click=${() => this._verDetalle(pub)}       // Ver detalle
@click=${e => this._editar(e, pub)}         // Editar publicación
@click=${e => this._confirmarEliminar(e, pub)}  // Eliminar (doble clic)
```

#### Integración de Favoritos
```html
<favorito-boton .publicacionId=${pub.id}></favorito-boton>
```

El botón de favoritos se renderiza dentro de cada card, permitiendo al usuario marcar/desmarcar favoritos directamente desde el feed.

#### Búsqueda en Tiempo Real
```javascript
_onBuscar(e) {
  const filtro = e.target.value.toLowerCase();
  this.publicaciones = this._allPublicaciones.filter(pub =>
    pub.titulo.toLowerCase().includes(filtro) ||
    (pub.etiquetas || '').toLowerCase().includes(filtro)
  );
}
```

#### Patrón de Confirmación Doble Clic
```javascript
_confirmarEliminar(e, pub) {
  e.stopPropagation();
  this._showSnackbar(`⚠️ Eliminar "${pub.titulo}"? Haz clic de nuevo`, '#ff9800');
  
  const btn = e.target.closest('button');
  btn.style.background = '#dc3545';
  btn.textContent = '⚠️ Confirmar';
  
  const confirmarHandler = (ev) => {
    ev.stopPropagation();
    this._eliminar(pub);
    btn.removeEventListener('click', confirmarHandler);
  };
  
  btn.addEventListener('click', confirmarHandler);
  
  setTimeout(() => {
    btn.style.background = '';
    btn.textContent = '🗑️ Eliminar';
    btn.removeEventListener('click', confirmarHandler);
  }, 3000);
}
```

---

### 9️⃣ `ui-confirm-dialog.js` - Diálogo de Confirmación

Este componente **reemplaza los `confirm()` nativos** con un modal profesional basado en Promises.

#### Propiedades Reactivas
```javascript
open: { type: Boolean },
title: { type: String },
message: { type: String },
confirmText: { type: String },
cancelText: { type: String },
icon: { type: String }
```

#### API Pública
```javascript
async show(options = {}) {
  this.title = options.title || this.title;
  this.message = options.message || this.message;
  this.confirmText = options.confirmText || 'Confirmar';
  this.cancelText = options.cancelText || 'Cancelar';
  this.icon = options.icon || '⚠️';
  this.open = true;
  
  return new Promise((resolve) => {
    this._resolvePromise = resolve;
  });
}
```

#### Uso en Otros Componentes
```javascript
// En admin-panel.js
async _eliminarUsuario(u) {
  const dialog = this.shadowRoot.querySelector('ui-confirm-dialog');
  
  const confirmed = await dialog.show({
    title: '⚠️ Eliminar Usuario',
    message: `¿Estás seguro de eliminar a ${u.nombre}?`,
    confirmText: 'Sí, eliminar',
    cancelText: 'Cancelar',
    icon: '🗑️'
  });
  
  if (!confirmed) return;
  
  // Ejecutar eliminación...
  const res = await fetch(`/api/usuarios/${u.id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
}
```

#### Event Handlers Internos
```javascript
_confirm() {
  this.open = false;
  if (this._resolvePromise) this._resolvePromise(true);
}

_cancel() {
  this.open = false;
  if (this._resolvePromise) this._resolvePromise(false);
}
```

**Ventajas sobre `confirm()` nativo**:
- Estilo personalizado (glassmorphism oscuro)
- Animaciones suaves
- No bloquea el thread principal
- API basada en Promises (async/await)
- Iconos y textos personalizables

---

### 🔟 `ui-snackbar.js` - Notificaciones Toast

Sistema de notificaciones **sin `alert()` ni `console.log()`**.

#### Event Listener Global
```javascript
connectedCallback() {
  super.connectedCallback();
  window.addEventListener('ui-snackbar', this._show.bind(this));
}

_show(e) {
  this.message = e.detail.message;
  this.color = e.detail.color || '#dc3545';
  this.visible = true;
  
  setTimeout(() => {
    this.visible = false;
  }, 3000);
}
```

#### Uso desde Cualquier Componente
```javascript
_showSnackbar(msg, color = '#dc3545') {
  window.dispatchEvent(new CustomEvent('ui-snackbar', {
    detail: { message: msg, color },
  }));
}

// Ejemplos de uso:
this._showSnackbar('✅ Publicación creada', '#28a745'); // Verde (éxito)
this._showSnackbar('⚠️ Campo obligatorio', '#ff9800');  // Naranja (warning)
this._showSnackbar('❌ Error al guardar', '#dc3545');  // Rojo (error)
```

**Colores comunes**:
- `#28a745` - Verde (éxito)
- `#198754` - Verde oscuro
- `#ff9800` - Naranja (warning)
- `#dc3545` - Rojo (error)
- `#667eea` - Morado (info)

---

## 🔄 Flujo de Eventos en la Aplicación

### Ejemplo: Creación de Publicación

```
1. Usuario hace clic en "Nueva publicación" (navbar)
   ↓
2. my-element escucha @click → this.page = 'nueva'
   ↓
3. Renderiza <publicacion-nueva>
   ↓
4. Usuario llena formulario y hace clic en "Publicar"
   ↓
5. publicacion-nueva._onSubmit() → POST /api/publicaciones
   ↓
6. Backend guarda en DB, retorna publicación creada
   ↓
7. publicacion-nueva emite evento 'publicacion-creada'
   ↓
8. my-element escucha evento → this.page = 'listado'
   ↓
9. publicacion-listado._cargarPublicaciones() → GET /api/publicaciones
   ↓
10. Renderiza feed con nueva publicación incluida
```

### Ejemplo: Toggle Favorito

```
1. Usuario hace clic en ⭐ en una publicación
   ↓
2. favorito-boton._toggleFavorito() → stopPropagation()
   ↓
3. Verifica if (this.favorito) → quitar : agregar
   ↓
4. POST /api/favoritos/add con { publicacion_id: X }
   ↓
5. Backend inserta en tabla favoritos: (usuario_id, publicacion_id)
   ↓
6. favorito-boton.favorito = true (actualiza UI automáticamente)
   ↓
7. Emite evento 'favorito-cambiado' (opcional, para estadísticas)
   ↓
8. Muestra snackbar: "Agregado a favoritos ⭐"
```

### Ejemplo: Ver Favoritos

```
1. Usuario hace clic en "⭐ Ver Favoritos" en perfil
   ↓
2. perfil-usuario._verFavoritos() → emite 'ver-favoritos'
   ↓
3. my-element escucha evento → this.page = 'favoritos'
   ↓
4. Renderiza <favorito-listado .usuarioId=${this.user.id}>
   ↓
5. favorito-listado.connectedCallback() → _cargarFavoritos()
   ↓
6. GET /api/favoritos/usuario/:usuarioId
   ↓
7. Backend consulta:
   SELECT f.*, p.titulo, p.imagen
   FROM favoritos f
   JOIN publicaciones p ON f.publicacion_id = p.id
   WHERE f.usuario_id = ?
   ↓
8. Renderiza lista de publicaciones favoritas
   ↓
9. Usuario hace clic en una publicación → emite 'ver-publicacion-favorita'
   ↓
10. my-element escucha evento → GET /api/publicaciones/:id → this.page = 'detalle'
```

### Ejemplo: Cambio de Contraseña

```
1. Usuario hace clic en "✏️ Editar Perfil"
   ↓
2. perfil-usuario._editarPerfil() → emite 'editar-perfil'
   ↓
3. my-element escucha evento → this.page = 'editar-perfil'
   ↓
4. Renderiza <editar-perfil .usuario=${this.user}>
   ↓
5. Usuario llena "Contraseña Actual" y "Contraseña Nueva"
   ↓
6. Usuario hace clic en "💾 Guardar Cambios"
   ↓
7. editar-perfil._onSubmit() ejecuta:
   a) PUT /api/usuarios/:id (actualiza nombre, correo, foto)
   b) POST /api/usuarios/:id/change-password con:
      { currentPassword: "...", newPassword: "..." }
   ↓
8. Backend valida:
   - Busca usuario: SELECT * FROM usuarios WHERE id = ?
   - Compara: bcrypt.compare(currentPassword, usuario.contrasena)
   - Si match: bcrypt.hash(newPassword, 10)
   - Actualiza: UPDATE usuarios SET contrasena = ? WHERE id = ?
   ↓
9. editar-perfil emite 'perfil-actualizado'
   ↓
10. my-element escucha evento → this.page = 'perfil'
```

---

## 🛠️ Patrones y Técnicas Utilizadas

### 1. **Patrón Publish-Subscribe (Eventos Personalizados)**

Todos los componentes comunican cambios mediante eventos personalizados:

```javascript
// Emisor
this.dispatchEvent(new CustomEvent('mi-evento', {
  detail: { data: 'valor' },
  bubbles: true,      // Burbujea hacia arriba en el DOM
  composed: true      // Atraviesa Shadow DOM
}));

// Receptor (en my-element o componente padre)
this.addEventListener('mi-evento', (e) => {
  console.log(e.detail.data); // 'valor'
});
```

### 2. **Patrón Promise-Based API (ui-confirm-dialog)**

```javascript
const confirmed = await dialog.show({ title: '...', message: '...' });
if (confirmed) {
  // Usuario confirmó
} else {
  // Usuario canceló
}
```

### 3. **Patrón Doble Clic para Confirmación**

Evita eliminaciones accidentales sin usar modales:

```javascript
_confirmarEliminar() {
  this.confirmandoEliminar = true;
  setTimeout(() => {
    this.confirmandoEliminar = false; // Auto-cancela después de 3s
  }, 3000);
}

async _eliminarPerfil() {
  if (!this.confirmandoEliminar) return;
  // Ejecuta DELETE...
}
```

### 4. **Cache Busting para Imágenes**

```javascript
const fotoUrl = `http://localhost:1234${this.usuario.fotografia}?t=${Date.now()}`;
```

Evita que el navegador use fotos antiguas en caché al agregar timestamp único.

### 5. **Validación en Tiempo Real**

```javascript
@input=${this._onInput}

_onInput(e) {
  const input = e.target;
  if (input.checkValidity()) {
    input.classList.add('is-valid');
  } else {
    input.classList.add('is-invalid');
  }
}
```

Feedback visual inmediato mientras el usuario escribe.

### 6. **FormData para Multipart/Form-Data**

```javascript
const form = e.target;
const fd = new FormData(form);

fetch('/api/usuarios/:id', {
  method: 'PUT',
  body: fd // Incluye archivos (foto) y campos de texto
});
```

### 7. **Shadow DOM y Encapsulación**

Cada componente Lit tiene su propio Shadow DOM:

```javascript
const dialog = this.shadowRoot.querySelector('ui-confirm-dialog');
```

Los estilos y elementos están encapsulados, no interfieren con otros componentes.

---

## 🔐 Autenticación y Autorización

### JWT Flow

```
1. Login: POST /api/auth/login
   ↓
2. Backend valida credenciales con bcrypt
   ↓
3. Backend genera JWT:
   const token = jwt.sign({ id, rol }, 'chupa_el_perro', { expiresIn: '1d' });
   ↓
4. Frontend guarda en localStorage:
   localStorage.setItem('token', token);
   ↓
5. Todas las peticiones autenticadas incluyen header:
   headers: { 'Authorization': `Bearer ${token}` }
   ↓
6. Backend middleware authenticateToken verifica:
   jwt.verify(token, 'chupa_el_perro', (err, user) => {
     req.user = user; // { id, rol }
     next();
   });
```

### Protección de Rutas

**Backend**:
```javascript
router.post('/favoritos/add', authenticateToken, favoritoController.add);
router.get('/admin/usuarios', authenticateToken, authorizeRoles('admin'), ...);
```

**Frontend**:
```javascript
// En render():
${this.user?.rol === 'artista' ? html`
  <button>Nueva publicación</button>
` : ''}
```

---

## 📦 Backend - Endpoints Principales

### Auth
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión

### Usuarios
- `GET /api/usuarios/:id` - Obtener usuario por ID
- `PUT /api/usuarios/:id` - Actualizar perfil (auth)
- `POST /api/usuarios/:id/change-password` - Cambiar contraseña (auth)
- `DELETE /api/usuarios/:id` - Eliminar usuario (auth, admin o propio)
- `GET /api/usuarios/admin/usuarios` - Listar usuarios (admin)

### Publicaciones
- `GET /api/publicaciones` - Listar publicaciones
- `GET /api/publicaciones/:id` - Obtener publicación por ID
- `POST /api/publicaciones` - Crear publicación (auth, artista)
- `PUT /api/publicaciones/:id` - Actualizar publicación (auth, autor)
- `DELETE /api/publicaciones/:id` - Eliminar publicación (auth, admin o autor)

### Favoritos
- `POST /api/favoritos/add` - Agregar a favoritos (auth)
- `POST /api/favoritos/remove` - Quitar de favoritos (auth)
- `GET /api/favoritos` - Listar favoritos del usuario autenticado (auth)
- `GET /api/favoritos/usuario/:usuario_id` - Listar favoritos de un usuario (público)
- `GET /api/favoritos/exists/:publicacion_id` - Verificar si está en favoritos (auth)

### Comentarios
- `GET /api/comentarios/publicacion/:publicacion_id` - Listar comentarios
- `POST /api/comentarios` - Crear comentario (auth)
- `DELETE /api/comentarios/:id` - Eliminar comentario (auth, admin o autor)

---

## 🎯 Resumen de Conceptos Clave

### Eventos Personalizados (`CustomEvent`)

**Son la forma principal de comunicación entre componentes en Lit.**

```javascript
// Emisor (hijo)
this.dispatchEvent(new CustomEvent('evento-personalizado', {
  detail: { valor: 42 },
  bubbles: true,
  composed: true
}));

// Receptor (padre, en el template)
<mi-componente @evento-personalizado=${this._handleEvento}></mi-componente>

// Handler
_handleEvento(e) {
  console.log(e.detail.valor); // 42
}
```

### Event Handlers `@click`, `@input`, `@submit`

**Lit usa sintaxis `@evento` para event listeners en el template.**

```javascript
// @click - Click en elemento
<button @click=${this._handleClick}>Clic aquí</button>

// @input - Cambio en input en tiempo real
<input @input=${this._handleInput} />

// @change - Cambio finalizado en input (blur)
<input @change=${this._handleChange} />

// @submit - Envío de formulario
<form @submit=${this._handleSubmit} novalidate>
```

### Propiedades Reactivas

**Cambiar una propiedad reactiva automáticamente re-renderiza el componente.**

```javascript
static properties = {
  count: { type: Number },
  usuario: { type: Object }
};

constructor() {
  super();
  this.count = 0;
}

increment() {
  this.count++; // Automáticamente actualiza UI
}
```

### Shadow DOM y `this.renderRoot`

**Cada componente Lit tiene su propio DOM encapsulado.**

```javascript
// Acceso a elementos dentro del Shadow DOM:
const input = this.renderRoot.querySelector('input[name="username"]');
const dialog = this.shadowRoot.querySelector('ui-confirm-dialog');
```

### Spread Operator para Actualizar Objetos

```javascript
// Actualizar usuario preservando referencia reactiva:
this.user = { ...this.user, fotografia: '/nueva/ruta.jpg' };
```

---

## 🚀 Cómo Ejecutar el Proyecto

### Backend
```bash
cd backend
npm install
node server.js
# Corre en http://localhost:1234
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Corre en http://localhost:5173
```

### Base de Datos
```bash
mysql -u root -p < database_dump.sql
```

---

## 📝 Notas para Defensa del Proyecto

### Preguntas Comunes

**¿Por qué Lit Elements en lugar de React/Vue?**
- Lit es más ligero (5KB vs 40KB+ de React)
- Web Components nativos, interoperables con cualquier framework
- Shadow DOM nativo para encapsulación real
- Rendimiento superior (Virtual DOM es innecesario)

**¿Cómo funciona la reactividad en Lit?**
- Propiedades reactivas (`static properties`)
- Cambios automáticos detectados via Proxy
- Re-render eficiente solo de partes modificadas

**¿Cómo se comunican los componentes?**
- Eventos personalizados (`CustomEvent`) con `bubbles: true, composed: true`
- Atraviesan Shadow DOM y burbujean hasta `my-element`

**¿Cómo evitan alerts y console.log?**
- `ui-snackbar.js` para notificaciones toast
- `ui-confirm-dialog.js` para confirmaciones modales Promise-based
- 0 `alert()`, `confirm()`, o `console.log()` en producción

**¿Cómo funciona el sistema de favoritos?**
1. Usuario hace clic en `<favorito-boton>`
2. Componente verifica estado con `GET /api/favoritos/exists/:id`
3. Toggle: `POST /api/favoritos/add` o `POST /api/favoritos/remove`
4. Backend inserta/elimina en tabla `favoritos` (usuario_id, publicacion_id)
5. Vista de favoritos: `GET /api/favoritos/usuario/:id` (público)

**¿Cómo funciona el cambio de contraseña?**
1. Usuario llena campos en `editar-perfil.js`
2. Frontend envía: `POST /api/usuarios/:id/change-password`
3. Backend valida contraseña actual con `bcrypt.compare()`
4. Backend hashea nueva con `bcrypt.hash(newPassword, 10)`
5. Backend actualiza: `UPDATE usuarios SET contrasena = ?`

---

## 🎨 Temas de Diseño

- **Colores**: Gradientes azul-morado-rosa (`#667eea`, `#764ba2`, `#ec4899`)
- **Botones**: Naranja-amarillo (`#ff6b6b`, `#feca57`)
- **Glassmorphism**: `backdrop-filter: blur(20px)` + `rgba(30, 27, 75, 0.7)`
- **Animaciones**: `fadeIn`, `fadeInUp`, `slideUp`, `pulse`
- **Tema oscuro**: Degradados `#0f172a` → `#1e1b4b` → `#4c1d95` → `#7f1d1d`

---

## ✅ Checklist de Funcionalidades

- [x] Autenticación JWT con roles (admin, artista, visitante)
- [x] CRUD Publicaciones con imágenes
- [x] CRUD Comentarios
- [x] Sistema de Favoritos (toggle, listar)
- [x] Editar perfil con foto
- [x] Cambiar contraseña (contraseña actual + nueva)
- [x] Panel de administración (listar, eliminar usuarios)
- [x] Validación en tiempo real (contraseñas, email, campos obligatorios)
- [x] Notificaciones toast (ui-snackbar)
- [x] Diálogos de confirmación (ui-confirm-dialog)
- [x] Cache busting para imágenes
- [x] Tema oscuro completo
- [x] 0 alerts, 0 console.log en frontend
- [x] Responsive design con Bootstrap 5

---

**Autor**: Sistema CoursArt - Red Social Artística Universitaria  
**Tecnologías**: Lit Elements, Node.js, Express, MySQL, JWT, bcrypt, Multer, Bootstrap 5  
**Fecha**: Diciembre 2025
