import { LitElement, html, css, unsafeCSS } from 'lit';
import bootstrapStyles from 'bootstrap/dist/css/bootstrap.min.css?inline';
import '../ui-snackbar.js';
import '../favorito/favorito-boton.js';

export class PublicacionListado extends LitElement {
    static styles = [
        unsafeCSS(bootstrapStyles),
        css`
            :host {
                display: block;
                padding: 2rem 1rem;
                min-height: 100vh;
            }
            .feed-container {
                max-width: 700px;
                margin: 0 auto;
            }
            .feed-title {
                color: #f1f5f9;
                font-size: 2rem;
                font-weight: 900;
                margin-bottom: 1.5rem;
                text-align: center;
                background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #f59e0b 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
            .search-bar {
                border-radius: 30px;
                padding: 0.9rem 1.5rem;
                border: 2px solid rgba(139, 92, 246, 0.3);
                transition: all 0.3s ease;
                font-size: 0.95rem;
                background: rgba(15, 23, 42, 0.6);
                color: #e2e8f0;
                backdrop-filter: blur(10px);
            }
            .search-bar::placeholder {
                color: #94a3b8;
            }
            .search-bar:focus {
                border-color: #8b5cf6;
                box-shadow: 0 0 0 0.2rem rgba(139, 92, 246, 0.3);
                background: rgba(15, 23, 42, 0.8);
            }
            .post-card {
                background: rgba(30, 27, 75, 0.7);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(139, 92, 246, 0.2);
                border-radius: 24px;
                margin-bottom: 1.8rem;
                overflow: hidden;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
                transition: all 0.3s ease;
                animation: fadeInUp 0.5s ease;
            }
            .post-card:hover {
                transform: translateY(-6px);
                box-shadow: 0 12px 40px rgba(139, 92, 246, 0.4);
                border-color: rgba(139, 92, 246, 0.5);
            }
            .post-header {
                display: flex;
                align-items: center;
                gap: 0.85rem;
                padding: 1.25rem 1.5rem 1rem 1.5rem;
                background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%);
                border-bottom: 1px solid rgba(139, 92, 246, 0.2);
            }
            .author-img {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                object-fit: cover;
                border: 3px solid #8b5cf6;
                box-shadow: 0 4px 12px rgba(139, 92, 246, 0.5);
            }
            .author-info {
                flex: 1;
            }
            .author-info h5 {
                margin: 0 0 0.15rem 0;
                color: #f1f5f9;
                font-weight: 700;
                font-size: 1.05rem;
            }
            .author-info small {
                color: #94a3b8;
                font-size: 0.85rem;
            }
            .post-img {
                width: 100%;
                max-height: 500px;
                object-fit: cover;
                cursor: pointer;
                transition: all 0.3s ease;
                filter: brightness(0.95);
            }
            .post-img:hover {
                filter: brightness(1.05);
            }
            .post-body {
                padding: 1.25rem 1.5rem;
            }
            .post-title {
                font-size: 1.4rem;
                font-weight: 700;
                color: #f1f5f9;
                margin-bottom: 0.6rem;
                line-height: 1.3;
            }
            .post-description {
                color: #cbd5e1;
                margin-bottom: 1rem;
                line-height: 1.6;
            }
            .post-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
                margin-bottom: 1rem;
            }
            .tag {
                background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                color: white;
                padding: 0.4rem 1rem;
                border-radius: 20px;
                font-size: 0.8rem;
                font-weight: 600;
                box-shadow: 0 2px 8px rgba(139, 92, 246, 0.4);
            }
            .post-actions {
                display: flex;
                gap: 0.6rem;
                padding-top: 1rem;
                border-top: 1px solid rgba(139, 92, 246, 0.2);
            }
            .btn-action {
                flex: 1;
                border-radius: 12px;
                font-weight: 600;
                transition: all 0.3s ease;
                padding: 0.7rem;
                backdrop-filter: blur(10px);
            }
            .btn-outline-primary {
                border-color: #8b5cf6;
                color: #c4b5fd;
                background: rgba(139, 92, 246, 0.1);
            }
            .btn-outline-primary:hover {
                background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
                color: white;
                border-color: transparent;
                transform: translateY(-2px);
                box-shadow: 0 4px 16px rgba(139, 92, 246, 0.6);
            }
            .btn-outline-warning {
                border-color: #f59e0b;
                color: #fbbf24;
                background: rgba(245, 158, 11, 0.1);
            }
            .btn-outline-warning:hover {
                background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                color: white;
                transform: translateY(-2px);
                box-shadow: 0 4px 16px rgba(245, 158, 11, 0.6);
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
                box-shadow: 0 4px 16px rgba(239, 68, 68, 0.6);
            }
            .btn-sm {
                padding: 0.5rem 1rem;
                font-size: 0.875rem;
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
    publicaciones: { type: Array },
    loading: { type: Boolean },
    user: { type: Object }
  };

    constructor() {
        super();
        this.publicaciones = [];
        this.loading = false;
        this._allPublicaciones = [];
    }

    connectedCallback() {
        super.connectedCallback();
        this._cargarPublicaciones();
    }

    async _cargarPublicaciones() {
        this.loading = true;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/publicaciones?limit=100', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (!res.ok) throw new Error('Error al cargar publicaciones');
            
            const result = await res.json();
            const data = result.data || result;
            this._allPublicaciones = data;
            this.publicaciones = data;
        } catch (err) {
            this._showSnackbar('❌ ' + err.message);
        } finally {
            this.loading = false;
        }
    }

    render() {
        return html`
            <ui-snackbar></ui-snackbar>
            <div class="feed-container">
                <h2 class="feed-title">🎨 Feed</h2>
                <div class="mb-4">
                    <input class="form-control search-bar" placeholder="🔍 Buscar arte por título o etiqueta..." @input=${this._onBuscar} />
                </div>
                
                ${this.publicaciones.length === 0 ? html`
                    <div class="post-card">
                        <div class="post-body text-center">
                            <p class="text-light font-monospace">No hay publicaciones aún. ¡Sé el primero en compartir tu arte!</p>
                        </div>
                    </div>
                ` : this.publicaciones.map(pub => {
                    const autorFoto = pub.autor_foto ? `http://localhost:1234${pub.autor_foto}` : 'https://via.placeholder.com/50';
                    const pubImagen = pub.imagen ? `http://localhost:1234${pub.imagen}` : 'https://via.placeholder.com/600x400';
                    return html`
                    <div class="post-card">
                        <div class="post-header">
                            <img class="author-img" src="${autorFoto}" alt="${pub.autor || 'Autor'}" />
                            <div class="author-info">
                                <h5>${pub.autor || 'Anónimo'}</h5>
                                <small>${pub.fecha || 'Hace poco'}</small>
                            </div>
                        </div>
                        <img class="post-img" src="${pubImagen}" alt="${pub.titulo}" @click=${() => this._verDetalle(pub)} />
                        <div class="post-body">
                            <div class="post-title">${pub.titulo}</div>
                            <div class="post-description">${pub.descripcion || ''}</div>
                            ${pub.etiquetas ? html`
                                <div class="post-tags">
                                    ${pub.etiquetas.split(',').map(t => html`<span class="tag">#${t.trim()}</span>`)}
                                </div>
                            ` : ''}
                            <div class="post-actions">
                                <button class="btn btn-outline-primary btn-action" @click=${() => this._verDetalle(pub)}>
                                    💬 Ver comentarios
                                </button>
                                <favorito-boton .publicacionId=${pub.id}></favorito-boton>
                                ${this._puedeEditar(pub) ? html`
                                    <button class="btn btn-outline-secondary btn-sm" @click=${e => this._editar(e, pub)}>
                                        ✏️ Editar
                                    </button>
                                ` : ''}
                                ${this._puedeEliminar(pub) ? html`
                                    <button class="btn btn-outline-danger btn-sm" @click=${e => this._confirmarEliminar(e, pub)}>
                                        🗑️ Eliminar
                                    </button>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                `;})}
            </div>
        `;
    }

    _puedeEditar(pub) {
        if (!this.user) return false;
        return this.user.id === pub.autor_id;
    }

    _puedeEliminar(pub) {
        if (!this.user) return false;
        return this.user.rol === 'admin' || this.user.id === pub.autor_id;
    }

    _confirmarEliminar(e, pub) {
        e.stopPropagation();
        this._showSnackbar(`⚠️ Eliminar "${pub.titulo}"? Haz clic de nuevo en eliminar para confirmar`, '#ff9800');
        
        const btn = e.target.closest('button');
        btn.style.background = '#dc3545';
        btn.style.color = 'white';
        btn.textContent = '⚠️ Confirmar';
        
        const confirmarHandler = (ev) => {
            ev.stopPropagation();
            this._eliminar(pub);
            btn.removeEventListener('click', confirmarHandler);
        };
        
        btn.addEventListener('click', confirmarHandler);
        
        setTimeout(() => {
            btn.style.background = '';
            btn.style.color = '';
            btn.textContent = '🗑️ Eliminar';
            btn.removeEventListener('click', confirmarHandler);
        }, 3000);
    }

    async _eliminar(pub) {
        try {
            const token = localStorage.getItem('token');
            
            if (!token) {
                this._showSnackbar('⚠️ No hay sesión activa. Por favor, inicia sesión nuevamente.');
                return;
            }
            
            const res = await fetch(`/api/publicaciones/${pub.id}`, {
                method: 'DELETE',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!res.ok) {
                let errorMsg = 'Error al eliminar publicación';
                try {
                    const err = await res.json();
                    errorMsg = err.message || errorMsg;
                } catch (parseErr) {
                    errorMsg = `Error ${res.status}: ${res.statusText}`;
                }
                throw new Error(errorMsg);
            }
            
            this._showSnackbar('✅ Publicación eliminada correctamente', '#28a745');
            await this._cargarPublicaciones();
        } catch (err) {
            this._showSnackbar('❌ ' + err.message);
        }
    }

    _showSnackbar(msg, color = '#dc3545') {
        window.dispatchEvent(new CustomEvent('ui-snackbar', {
            detail: { message: msg, color },
        }));
    }

    _onBuscar(e) {
        const filtro = e.target.value.toLowerCase();
        this.publicaciones = this._allPublicaciones.filter(pub =>
            pub.titulo.toLowerCase().includes(filtro) ||
            (pub.etiquetas || '').toLowerCase().includes(filtro)
        );
    }

    set publicacionesData(data) {
        this._allPublicaciones = data;
        this.publicaciones = data;
    }

    _verDetalle(pub) {
        this.dispatchEvent(new CustomEvent('ver-detalle', { detail: pub, bubbles: true, composed: true }));
    }

    _editar(e, pub) {
        e.stopPropagation();
        this.dispatchEvent(new CustomEvent('editar-publicacion', { detail: pub, bubbles: true, composed: true }));
    }
  }

customElements.define('publicacion-listado', PublicacionListado);
