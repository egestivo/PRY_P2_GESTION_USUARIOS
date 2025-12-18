import { LitElement, html, css, unsafeCSS } from 'lit';
import bootstrapStyles from 'bootstrap/dist/css/bootstrap.min.css?inline';
import '../ui-snackbar.js';

export class FavoritoListado extends LitElement {
    static styles = [
        unsafeCSS(bootstrapStyles),
        css`
            :host {
                display: block;
                padding: 2rem 1rem;
                min-height: 100vh;
            }
            .favoritos-container {
                max-width: 700px;
                margin: 0 auto;
            }
            .favoritos-title {
                color: #f1f5f9;
                font-size: 2rem;
                font-weight: 900;
                margin-bottom: 1.5rem;
                text-align: center;
                background: linear-gradient(135deg, #f59e0b 0%, #ec4899 50%, #8b5cf6 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
            .back-btn {
                background: rgba(139, 92, 246, 0.2);
                border: 2px solid rgba(139, 92, 246, 0.5);
                color: #c4b5fd;
                padding: 0.6rem 1.5rem;
                border-radius: 12px;
                font-weight: 600;
                transition: all 0.3s ease;
                margin-bottom: 1.5rem;
            }
            .back-btn:hover {
                background: rgba(139, 92, 246, 0.4);
                border-color: #8b5cf6;
                transform: translateX(-5px);
            }
            .fav-card {
                background: rgba(30, 27, 75, 0.7);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(245, 158, 11, 0.3);
                border-radius: 20px;
                margin-bottom: 1.5rem;
                overflow: hidden;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
                transition: all 0.3s ease;
                animation: fadeInUp 0.5s ease;
                cursor: pointer;
            }
            .fav-card:hover {
                transform: translateY(-6px);
                box-shadow: 0 12px 40px rgba(245, 158, 11, 0.4);
                border-color: rgba(245, 158, 11, 0.6);
            }
            .fav-img {
                width: 100%;
                max-height: 400px;
                object-fit: cover;
                transition: all 0.3s ease;
                filter: brightness(0.95);
            }
            .fav-card:hover .fav-img {
                filter: brightness(1.05);
            }
            .fav-body {
                padding: 1.25rem 1.5rem;
            }
            .fav-title {
                font-size: 1.3rem;
                font-weight: 700;
                color: #f1f5f9;
                margin-bottom: 0.5rem;
            }
            .fav-description {
                color: #cbd5e1;
                margin-bottom: 0.8rem;
                line-height: 1.5;
            }
            .fav-fecha {
                color: #94a3b8;
                font-size: 0.85rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            .empty-state {
                background: rgba(30, 27, 75, 0.5);
                border: 2px dashed rgba(139, 92, 246, 0.3);
                border-radius: 20px;
                padding: 3rem 2rem;
                text-align: center;
                color: #cbd5e1;
            }
            .empty-state-icon {
                font-size: 4rem;
                margin-bottom: 1rem;
            }
            @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(30px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `
    ];

    static properties = {
        favoritos: { type: Array },
        loading: { type: Boolean },
        usuarioId: { type: Number }
    };

    constructor() {
        super();
        this.favoritos = [];
        this.loading = false;
        this.usuarioId = null;
    }

    connectedCallback() {
        super.connectedCallback();
        if (this.usuarioId) {
            this._cargarFavoritos();
        }
    }

    async _cargarFavoritos() {
        this.loading = true;
        try {
            const res = await fetch(`/api/favoritos/usuario/${this.usuarioId}`);
            if (!res.ok) throw new Error('Error al cargar favoritos');
            this.favoritos = await res.json();
        } catch (err) {
            this._showSnackbar('❌ ' + err.message);
        } finally {
            this.loading = false;
        }
    }

    render() {
        return html`
            <ui-snackbar></ui-snackbar>
            <div class="favoritos-container">
                <button class="btn back-btn" @click=${this._volver}>
                    ← Volver al perfil
                </button>

                <h2 class="favoritos-title">⭐ Mis Favoritos</h2>

                ${this.loading ? html`
                    <div class="text-center text-light mt-5">
                        <div class="spinner-border text-warning" role="status">
                            <span class="visually-hidden">Cargando...</span>
                        </div>
                        <p class="mt-3">Cargando favoritos...</p>
                    </div>
                ` : this.favoritos.length === 0 ? html`
                    <div class="empty-state">
                        <div class="empty-state-icon">📭</div>
                        <h4>No tienes favoritos guardados</h4>
                        <p>Guarda publicaciones que te gusten para verlas aquí</p>
                    </div>
                ` : this.favoritos.map(fav => {
                    const imgUrl = fav.imagen ? `${fav.imagen}` : 'https://via.placeholder.com/600x400';
                    return html`
                        <div class="fav-card" @click=${() => this._verPublicacion(fav)}>
                            <img class="fav-img" src="${imgUrl}" alt="${fav.titulo}" />
                            <div class="fav-body">
                                <div class="fav-title">${fav.titulo}</div>
                                <div class="fav-description">${fav.descripcion || 'Sin descripción'}</div>
                                <div class="fav-fecha">
                                    <span>⭐</span>
                                    <span>Guardado el ${this._formatFecha(fav.fecha_guardado)}</span>
                                </div>
                            </div>
                        </div>
                    `;
                })}
            </div>
        `;
    }

    _formatFecha(fecha) {
        if (!fecha) return 'Hace poco';
        const date = new Date(fecha);
        return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    }

    _verPublicacion(fav) {
        this.dispatchEvent(new CustomEvent('ver-publicacion-favorita', {
            detail: { publicacion_id: fav.publicacion_id },
            bubbles: true,
            composed: true
        }));
    }

    _volver() {
        this.dispatchEvent(new CustomEvent('volver-perfil', {
            bubbles: true,
            composed: true
        }));
    }

    _showSnackbar(msg, color = '#dc3545') {
        window.dispatchEvent(new CustomEvent('ui-snackbar', {
            detail: { message: msg, color },
        }));
    }
}
customElements.define('favorito-listado', FavoritoListado);
