import { LitElement, html, css, unsafeCSS } from 'lit';
import bootstrapStyles from 'bootstrap/dist/css/bootstrap.min.css?inline';
import '../ui-snackbar.js';

export class PerfilUsuario extends LitElement {
    static styles = [
        unsafeCSS(bootstrapStyles),
        css`
            :host {
                display: block;
                padding: 2rem 1rem;
            }
            .perfil-container {
                max-width: 680px;
                margin: 0 auto;
            }
            .perfil-card {
                background: white;
                border-radius: 24px;
                padding: 2.5rem;
                box-shadow: 0 8px 32px rgba(102, 126, 234, 0.15);
                animation: fadeInUp 0.5s ease;
            }
            .perfil-header {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 1.5rem;
                margin-bottom: 2rem;
                padding-bottom: 2rem;
                border-bottom: 2px solid #f0f0f0;
            }
            .perfil-img {
                width: 140px;
                height: 140px;
                object-fit: cover;
                border-radius: 50%;
                border: 4px solid #667eea;
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
            }
            .perfil-name {
                font-size: 2rem;
                font-weight: 700;
                color: #333;
                margin: 0;
            }
            .perfil-username {
                font-size: 1.1rem;
                color: #667eea;
                font-weight: 600;
            }
            .perfil-rol {
                display: inline-block;
                padding: 0.4rem 1rem;
                border-radius: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                font-size: 0.85rem;
                font-weight: 600;
                text-transform: uppercase;
            }
            .perfil-details {
                display: flex;
                flex-direction: column;
                gap: 1rem;
                margin-bottom: 2rem;
            }
            .detail-row {
                display: flex;
                align-items: center;
                padding: 1rem;
                background: #f8f9fa;
                border-radius: 12px;
                gap: 1rem;
            }
            .detail-icon {
                font-size: 1.5rem;
                min-width: 40px;
                text-align: center;
            }
            .detail-content {
                flex: 1;
            }
            .detail-label {
                font-size: 0.8rem;
                color: #666;
                margin-bottom: 0.2rem;
            }
            .detail-value {
                font-size: 1rem;
                font-weight: 600;
                color: #333;
            }
            .perfil-actions {
                display: flex;
                gap: 1rem;
                justify-content: center;
            }
            .btn-primary-gradient {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border: none;
                padding: 0.75rem 2rem;
                border-radius: 12px;
                font-weight: 600;
                transition: all 0.3s ease;
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
            }
            .btn-primary-gradient:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
            }
            .btn-delete {
                background: #dc3545;
                border: none;
                padding: 0.75rem 2rem;
                border-radius: 12px;
                font-weight: 600;
                transition: all 0.3s ease;
                color: white;
            }
            .btn-delete:hover {
                background: #c82333;
                transform: translateY(-2px);
            }
            .fade-in { animation: fadeIn 1s; }
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(30px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `
    ];

    static properties = {
        usuario: { type: Object },
        currentUser: { type: Object },
        confirmandoEliminar: { type: Boolean }
    };

    constructor() {
        super();
        this.usuario = null;
        this.currentUser = null;
        this.confirmandoEliminar = false;
    }

    render() {
        if (!this.usuario) return html`<div class="text-center mt-5">⏳ Cargando perfil...</div>`;
        
        const fotoUrl = this.usuario.fotografia 
            ? `http://localhost:1234${this.usuario.fotografia}?t=${Date.now()}` 
            : 'https://via.placeholder.com/140';
        
        // Formatear fecha de nacimiento como yyyy-mm-dd
        let fechaNacimiento = '-';
        if (this.usuario.fecha_nacimiento) {
            const fecha = new Date(this.usuario.fecha_nacimiento);
            fechaNacimiento = fecha.toISOString().split('T')[0];
        }

        // Verificar permisos
        const esPropietario = this.currentUser && this.currentUser.id === this.usuario.id;
        const puedeEditar = esPropietario;
        const puedeEliminar = this._puedeEliminar();

        return html`
            <ui-snackbar></ui-snackbar>
            <div class="perfil-container">
                <div class="perfil-card">
                    <div class="perfil-header">
                        <img class="perfil-img" src="${fotoUrl}" alt="Foto de perfil" />
                        <div style="text-align: center;">
                            <h2 class="perfil-name">${this.usuario.nombre}</h2>
                            <div class="perfil-username">@${this.usuario.username}</div>
                            <div class="mt-2">
                                <span class="perfil-rol">${this.usuario.rol || 'usuario'}</span>
                            </div>
                        </div>
                    </div>

                    <div class="perfil-details">
                        <div class="detail-row">
                            <div class="detail-icon">📧</div>
                            <div class="detail-content">
                                <div class="detail-label">Correo Electrónico</div>
                                <div class="detail-value">${this.usuario.correo}</div>
                            </div>
                        </div>

                        <div class="detail-row">
                            <div class="detail-icon">🎂</div>
                            <div class="detail-content">
                                <div class="detail-label">Fecha de Nacimiento</div>
                                <div class="detail-value">${fechaNacimiento}</div>
                            </div>
                        </div>

                        <div class="detail-row">
                            <div class="detail-icon">👤</div>
                            <div class="detail-content">
                                <div class="detail-label">Nombre de Usuario</div>
                                <div class="detail-value">${this.usuario.username}</div>
                            </div>
                        </div>

                        <div class="detail-row">
                            <div class="detail-icon">🎨</div>
                            <div class="detail-content">
                                <div class="detail-label">Rol</div>
                                <div class="detail-value">${this._getRolDescripcion(this.usuario.rol)}</div>
                            </div>
                        </div>
                    </div>

                    ${this._mostrarBotones() ? html`
                        <div class="perfil-actions">
                            ${this._mostrarVerFavoritos() ? html`
                                <button class="btn btn-warning" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border: none; padding: 0.75rem 2rem; border-radius: 12px; font-weight: 600; color: white;" @click=${this._verFavoritos}>
                                    ⭐ Ver Favoritos
                                </button>
                            ` : ''}
                            ${puedeEditar ? html`
                                <button class="btn btn-primary-gradient" @click=${this._editarPerfil}>
                                    ✏️ Editar Perfil
                                </button>
                            ` : ''}
                            ${puedeEliminar ? html`
                                <button 
                                    class="btn btn-delete" 
                                    style="${this.confirmandoEliminar ? 'background: #dc3545; color: white;' : ''}"
                                    @click=${this.confirmandoEliminar ? this._eliminarPerfil : this._confirmarEliminar}
                                >
                                    ${this.confirmandoEliminar ? '⚠️ Confirmar Eliminación' : '🗑️ Eliminar Perfil'}
                                </button>
                            ` : ''}
                        </div>
                    ` : html`
                        <div class="text-center text-muted">
                            <small>👁️ Vista de perfil público</small>
                        </div>
                    `}
                </div>
            </div>
        `;
    }

    _getRolDescripcion(rol) {
        const roles = {
            'admin': '🛡️ Administrador',
            'artista': '🎨 Artista',
            'visitante': '👁️ Visitante'
        };
        return roles[rol] || rol;
    }

    _mostrarBotones() {
        const esPropietario = this.currentUser && this.currentUser.id === this.usuario.id;
        const esAdmin = this.currentUser && this.currentUser.rol === 'admin';
        return esPropietario || esAdmin;
    }

    _puedeEliminar() {
        // No se puede eliminar el admin principal
        if (this.usuario && this.usuario.username === 'wiinteradm') return false;
        
        const esPropietario = this.currentUser && this.currentUser.id === this.usuario.id;
        const esAdmin = this.currentUser && this.currentUser.rol === 'admin';
        return esPropietario || esAdmin;
    }

    _mostrarVerFavoritos() {
        if (!this.usuario || !this.usuario.rol) return false;
        return this.usuario.rol !== 'admin';
    }

    _verFavoritos() {
        this.dispatchEvent(new CustomEvent('ver-favoritos', {
            detail: { usuarioId: this.usuario.id },
            bubbles: true,
            composed: true
        }));
    }

    _editarPerfil() {
        this.dispatchEvent(new CustomEvent('editar-perfil', { 
            detail: this.usuario, 
            bubbles: true, 
            composed: true 
        }));
    }

    _confirmarEliminar() {
        const esPropio = this.currentUser && this.currentUser.id === this.usuario.id;
        const mensaje = esPropio 
            ? '⚠️ Haz clic de nuevo para confirmar eliminación de tu cuenta'
            : `⚠️ Haz clic de nuevo para confirmar eliminación de ${this.usuario.nombre}`;
        
        this._showSnackbar(mensaje, '#ff9800');
        this.confirmandoEliminar = true;
        
        setTimeout(() => {
            this.confirmandoEliminar = false;
        }, 3000);
    }

    async _eliminarPerfil() {
        const esPropio = this.currentUser && this.currentUser.id === this.usuario.id;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/usuarios/${this.usuario.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Error al eliminar perfil');
            }

            this._showSnackbar('✅ Perfil eliminado correctamente', '#28a745');
            
            // Si eliminó su propia cuenta, cerrar sesión
            if (esPropio) {
                setTimeout(() => {
                    localStorage.clear();
                    window.location.reload();
                }, 1500);
            } else {
                // Si admin eliminó otro usuario, volver a la lista
                setTimeout(() => {
                    this.dispatchEvent(new CustomEvent('perfil-eliminado', { 
                        bubbles: true, 
                        composed: true 
                    }));
                }, 1500);
            }
        } catch (err) {
            this._showSnackbar('❌ ' + err.message);
        }
    }

    _showSnackbar(msg, color = '#dc3545') {
        window.dispatchEvent(new CustomEvent('ui-snackbar', {
            detail: { message: msg, color },
        }));
    }
}
customElements.define('perfil-usuario', PerfilUsuario);
