import { LitElement, css, html, unsafeCSS } from 'lit';
import bootstrapStyles from 'bootstrap/dist/css/bootstrap.min.css?inline';
import './components/ui-snackbar.js';
import './components/auth/user-login.js';
import './components/auth/user-register.js';
import './components/usuario/perfil-usuario.js';
import './components/usuario/mini-perfil-card.js';
import './components/usuario/editar-perfil.js';
import './components/publicacion/publicacion-listado.js';
import './components/publicacion/publicacion-nueva.js';
import './components/publicacion/publicacion-editar.js';
import './components/publicacion/publicacion-detalle.js';
import './components/comentario/comentario-listado.js';
import './components/favorito/favorito-boton.js';
import './components/favorito/favorito-listado.js';
import './components/admin/admin-panel.js';

export class MyElement extends LitElement {
  static properties = {
    page: { type: String },
    user: { type: Object },
    selectedPublicacion: { type: Object },
    editandoPublicacion: { type: Object },
    admin: { type: Boolean }
  };

  constructor() {
    super();
    this.page = 'login';
    this.user = null;
    this.selectedPublicacion = null;
    this.editandoPublicacion = null;
    this.admin = false;
  }

  render() {
    return html`
      <ui-snackbar></ui-snackbar>
      
      ${this.page !== 'login' && this.page !== 'register' ? html`
        <nav class="navbar navbar-expand-lg navbar-light navbar-custom">
          <div class="container-fluid">
            <a class="navbar-brand" href="#" @click=${() => this._go('listado')}>🎨 CoursArt</a>
            <div class="d-flex gap-2 align-items-center">
              ${this.user ? html`
                <mini-perfil-card .usuario=${this.user} @ver-perfil=${() => this._go('perfil')}></mini-perfil-card>
                ${this.user.rol === 'artista' ? html`
                  <button class="btn btn-outline-primary btn-nav" @click=${() => this._go('nueva')}>
                    ➕ Nueva publicación
                  </button>
                ` : ''}
                ${this.admin ? html`
                  <button class="btn btn-outline-danger btn-nav" @click=${() => this._go('admin')}>
                    🛡️ Admin
                  </button>
                ` : ''}
                <button class="btn btn-outline-dark btn-nav" @click=${this._logout}>
                  🚪 Salir
                </button>
              ` : html`
                <button class="btn btn-outline-primary btn-nav" @click=${() => this._go('login')}>Login</button>
                <button class="btn btn-outline-success btn-nav" @click=${() => this._go('register')}>Registro</button>
              `}
            </div>
          </div>
        </nav>
      ` : ''}

      <main>
        ${this.page === 'login' ? html`
          <user-login @login-success=${this._onLogin} @ir-registro=${() => this._go('register')}></user-login>
        ` : this.page === 'register' ? html`
          <user-register @register-success=${this._onRegister} @ir-login=${() => this._go('login')}></user-register>
        ` : this.page === 'perfil' ? html`
          <perfil-usuario .usuario=${this.user} .currentUser=${this.user}></perfil-usuario>
        ` : this.page === 'editar-perfil' ? html`
          <editar-perfil .usuario=${this.user}></editar-perfil>
        ` : this.page === 'nueva' ? html`
          ${this.user?.rol === 'artista' ? html`
            <publicacion-nueva @publicacion-creada=${this._goListado}></publicacion-nueva>
          ` : html`
            <div class="alert alert-warning text-center m-5">
              ⚠️ Solo los artistas pueden crear publicaciones.
            </div>
          `}
        ` : this.page === 'editar' && this.editandoPublicacion ? html`
          <publicacion-editar .publicacion=${this.editandoPublicacion} @publicacion-editada=${this._goListado}></publicacion-editar>
        ` : this.page === 'detalle' && this.selectedPublicacion ? html`
          <publicacion-detalle .publicacion=${this.selectedPublicacion}></publicacion-detalle>
          <favorito-boton .publicacionId=${this.selectedPublicacion.id}></favorito-boton>
          <comentario-listado .user=${this.user} .publicacionId=${this.selectedPublicacion.id}></comentario-listado>
        ` : this.page === 'favoritos' ? html`
          <favorito-listado .usuarioId=${this.user?.id}></favorito-listado>
        ` : this.page === 'admin' && this.admin ? html`
          <admin-panel></admin-panel>
        ` : html`
          <publicacion-listado
            .user=${this.user}
            @ver-detalle=${this._verDetalle}
            @editar-publicacion=${this._editarPublicacion}
          ></publicacion-listado>
        `}
      </main>
    `;
  }

  _go(page) {
    this.page = page;
    this.selectedPublicacion = null;
    this.editandoPublicacion = null;
  }

  _onLogin(e) {
    this.user = e.detail.usuario;
    this.admin = this.user && this.user.rol === 'admin';
    this.page = 'listado';
    window.dispatchEvent(new CustomEvent('ui-snackbar', { detail: { message: '¡Bienvenido!', color: '#198754' } }));
  }

  _onRegister(e) {
    this.user = e.detail.usuario;
    this.admin = this.user && this.user.rol === 'admin';
    this.page = 'listado';
    window.dispatchEvent(new CustomEvent('ui-snackbar', { detail: { message: '¡Registro exitoso!', color: '#198754' } }));
  }

  _logout() {
    this.user = null;
    this.admin = false;
    this.page = 'login';
    localStorage.removeItem('token');
    window.dispatchEvent(new CustomEvent('ui-snackbar', { detail: { message: 'Sesión cerrada', color: '#6c757d' } }));
  }

  _verDetalle(e) {
    this.selectedPublicacion = e.detail;
    this.page = 'detalle';
  }

  _editarPublicacion(e) {
    this.editandoPublicacion = e.detail;
    this.page = 'editar';
  }

  connectedCallback() {
    super.connectedCallback();
    
    this.addEventListener('editar-perfil', () => {
      this.page = 'editar-perfil';
    });
    
    this.addEventListener('perfil-eliminado', () => {
      this.page = 'listado';
    });
    
    this.addEventListener('perfil-actualizado', async (e) => {
      if (e.detail) {
        this.user = { ...e.detail };
        this.requestUpdate();
      } else {
        await this._recargarUsuario();
      }
      this.page = 'perfil';
    });
    
    this.addEventListener('cancelar-edicion', () => {
      this.page = 'perfil';
    });

    this.addEventListener('ver-favoritos', (e) => {
      this.page = 'favoritos';
    });

    this.addEventListener('volver-perfil', () => {
      this.page = 'perfil';
    });

    this.addEventListener('ver-publicacion-favorita', async (e) => {
      const pubId = e.detail.publicacion_id;
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/publicaciones/${pubId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const pub = await res.json();
          this.selectedPublicacion = pub;
          this.page = 'detalle';
        }
      } catch (err) {
        console.error('Error al cargar publicación:', err);
      }
    });
  }

  async _recargarUsuario() {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const res = await fetch(`/api/usuarios/${this.user.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        this.user = { ...data };
        this.requestUpdate();
      }
    } catch (err) {
      window.dispatchEvent(new CustomEvent('ui-snackbar', {
        detail: { message: '❌ Error al recargar datos de usuario', color: '#dc3545' }
      }));
    }
  }

  static styles = [
    unsafeCSS(bootstrapStyles),
    css`
      :host {
        display: block;
        min-height: 100vh;
        background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 25%, #4c1d95 50%, #7f1d1d 75%, #0f172a 100%);
        background-attachment: fixed;
      }
      .navbar-custom {
        background: rgba(15, 23, 42, 0.95) !important;
        backdrop-filter: blur(20px);
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
        padding: 1rem 2rem;
        border-bottom: 1px solid rgba(139, 92, 246, 0.2);
      }
      .navbar-brand {
        font-weight: 900;
        font-size: 1.6rem;
        background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #f59e0b 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-shadow: 0 0 30px rgba(139, 92, 246, 0.5);
      }
      .btn-nav {
        border-radius: 12px;
        padding: 0.5rem 1.25rem;
        font-weight: 600;
        transition: all 0.3s ease;
        border: 2px solid transparent;
      }
      .btn-outline-primary {
        border-color: #8b5cf6;
        color: #a78bfa;
        background: rgba(139, 92, 246, 0.1);
      }
      .btn-outline-primary:hover {
        background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
        color: white;
        border-color: transparent;
        transform: translateY(-2px);
        box-shadow: 0 4px 20px rgba(139, 92, 246, 0.6);
      }
      .btn-outline-success {
        border-color: #10b981;
        color: #34d399;
        background: rgba(16, 185, 129, 0.1);
      }
      .btn-outline-success:hover {
        background: #10b981;
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 4px 20px rgba(16, 185, 129, 0.6);
      }
      .btn-outline-danger {
        border-color: #ef4444;
        color: #f87171;
        background: rgba(239, 68, 68, 0.1);
      }
      .btn-outline-danger:hover {
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 4px 20px rgba(239, 68, 68, 0.6);
      }
      .btn-outline-dark {
        border-color: #6366f1;
        color: #818cf8;
        background: rgba(99, 102, 241, 0.1);
      }
      .btn-outline-dark:hover {
        background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 4px 20px rgba(99, 102, 241, 0.6);
      }
      main {
        min-height: calc(100vh - 80px);
      }
    `
  ];

  _goListado() {
    this.page = 'listado';
  }
}

window.customElements.define('my-element', MyElement);
