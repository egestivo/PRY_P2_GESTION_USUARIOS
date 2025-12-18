import { LitElement, html, css, unsafeCSS } from 'lit';
import bootstrapStyles from 'bootstrap/dist/css/bootstrap.min.css?inline';
import '../ui-snackbar.js';
import '../ui-confirm-dialog.js';

export class AdminPanel extends LitElement {
    static styles = [
        unsafeCSS(bootstrapStyles),
        css`
            :host {
                display: block;
                padding: 2rem 1rem;
                min-height: 100vh;
            }
            .admin-container {
                max-width: 850px;
                margin: 0 auto;
            }
            .admin-card {
                background: rgba(30, 27, 75, 0.7);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(139, 92, 246, 0.3);
                border-radius: 24px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
                overflow: hidden;
            }
            .admin-header {
                background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #ef4444 100%);
                padding: 2rem;
                text-align: center;
            }
            .admin-header h3 {
                color: white;
                font-weight: 900;
                font-size: 2rem;
                margin: 0 0 0.5rem 0;
                text-shadow: 0 4px 20px rgba(0,0,0,0.3);
            }
            .admin-header p {
                color: rgba(255, 255, 255, 0.95);
                margin: 0;
                font-size: 1rem;
            }
            .admin-body {
                padding: 2rem;
            }
            .section-title {
                font-size: 1.4rem;
                font-weight: 700;
                color: #f1f5f9;
                margin-bottom: 1.5rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            .user-item {
                background: rgba(139, 92, 246, 0.1);
                backdrop-filter: blur(10px);
                border-radius: 16px;
                padding: 1.2rem 1.5rem;
                margin-bottom: 1rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                transition: all 0.3s ease;
                border: 2px solid rgba(139, 92, 246, 0.2);
            }
            .user-item:hover {
                background: rgba(139, 92, 246, 0.2);
                border-color: #8b5cf6;
                transform: translateX(6px);
                box-shadow: 0 4px 20px rgba(139, 92, 246, 0.3);
            }
            .user-info {
                display: flex;
                align-items: center;
                gap: 1.2rem;
            }
            .user-avatar {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                object-fit: cover;
                border: 3px solid #8b5cf6;
                box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
            }
            .user-details h6 {
                margin: 0;
                font-weight: 700;
                color: #f1f5f9;
                font-size: 1.05rem;
            }
            .user-details p {
                margin: 0;
                font-size: 0.9rem;
                color: #94a3b8;
            }
            .user-role {
                background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                color: white;
                padding: 0.4rem 1rem;
                border-radius: 20px;
                font-size: 0.85rem;
                font-weight: 600;
                margin-right: 0.75rem;
                box-shadow: 0 2px 8px rgba(139, 92, 246, 0.4);
            }
            .btn-delete {
                background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                color: white;
                border: none;
                border-radius: 12px;
                padding: 0.65rem 1.25rem;
                font-weight: 700;
                transition: all 0.3s ease;
            }
            .btn-delete:hover {
                background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
                transform: translateY(-3px);
                box-shadow: 0 6px 25px rgba(239, 68, 68, 0.6);
            }
            .empty-state {
                text-align: center;
                padding: 3rem 1rem;
                color: #64748b;
            }
            .empty-state-icon {
                font-size: 3rem;
                margin-bottom: 1rem;
            }
            .fade-in {
                animation: fadeIn 0.6s ease;
            }
            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `
    ];

    static properties = {
        usuarios: { type: Array },
        loading: { type: Boolean }
    };

    constructor() {
        super();
        this.usuarios = [];
        this.loading = false;
    }

    connectedCallback() {
        super.connectedCallback();
        this._cargarUsuarios();
    }

    async _cargarUsuarios() {
        this.loading = true;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/usuarios/admin/usuarios', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Error al cargar usuarios');
            const data = await res.json();
            this.usuarios = data.data || data;
        } catch (err) {
            this._showSnackbar('Error al cargar usuarios: ' + err.message);
        } finally {
            this.loading = false;
        }
    }

    render() {
        return html`
            <ui-snackbar></ui-snackbar>
            <ui-confirm-dialog></ui-confirm-dialog>
            <div class="admin-container fade-in">
                <div class="admin-card">
                    <div class="admin-header">
                        <h3>🛡️ Panel de Administración</h3>
                        <p>Gestiona los usuarios de la plataforma</p>
                    </div>
                    <div class="admin-body">
                        <h4 class="section-title">
                            👥 Usuarios Registrados
                        </h4>
                        ${this.loading ? html`
                            <div class="text-center">
                                <div class="spinner-border text-primary" role="status">
                                    <span class="visually-hidden">Cargando...</span>
                                </div>
                            </div>
                        ` : this.usuarios.length === 0 ? html`
                            <div class="empty-state">
                                <div class="empty-state-icon">👤</div>
                                <p>No hay usuarios registrados aún</p>
                            </div>
                        ` : this.usuarios.filter(u => u.username !== 'wiinteradm').map(u => {
                            const fotoUrl = u.fotografia ? `http://localhost:1234${u.fotografia}` : 'https://via.placeholder.com/45';
                            return html`
                            <div class="user-item">
                                <div class="user-info">
                                    <img class="user-avatar" src="${fotoUrl}" alt="${u.nombre}" />
                                    <div class="user-details">
                                        <h6>${u.nombre}</h6>
                                        <p>@${u.username} • ${u.correo}</p>
                                    </div>
                                </div>
                                <div class="d-flex align-items-center">
                                    <span class="user-role">${u.rol || 'usuario'}</span>
                                    <button class="btn btn-delete" @click=${() => this._eliminarUsuario(u)}>
                                        🗑️ Eliminar
                                    </button>
                                </div>
                            </div>
                        `;})}
                        
                        <div class="mt-4 p-3 bg-light rounded">
                            <p class="mb-2 text-muted" style="font-size: 0.9rem;">
                                ℹ️ <strong>Nota:</strong> Para eliminar publicaciones, ve al feed y podrás eliminar cualquier publicación directamente desde allí.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    _showSnackbar(msg, color = '#dc3545') {
        window.dispatchEvent(new CustomEvent('ui-snackbar', {
            detail: { message: msg, color },
        }));
    }

    async _eliminarUsuario(u) {
        const dialog = this.shadowRoot.querySelector('ui-confirm-dialog');
        const confirmed = await dialog.show({
            title: '⚠️ Eliminar Usuario',
            message: `¿Estás seguro de eliminar a ${u.nombre}? Esta acción no se puede deshacer.`,
            confirmText: 'Eliminar',
            cancelText: 'Cancelar',
            icon: '🗑️'
        });

        if (!confirmed) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/usuarios/${u.id}`, { 
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('No se pudo eliminar usuario');
            this.usuarios = this.usuarios.filter(us => us.id !== u.id);
            this._showSnackbar('Usuario eliminado correctamente', '#28a745');
        } catch (err) {
            this._showSnackbar(err.message);
        }
    }
}
customElements.define('admin-panel', AdminPanel);
