import { LitElement, html, css, unsafeCSS } from 'lit';
import bootstrapStyles from 'bootstrap/dist/css/bootstrap.min.css?inline';

export class MiniPerfilCard extends LitElement {
    static styles = [
        unsafeCSS(bootstrapStyles),
        css`
            :host {
                display: inline-block;
            }
            .mini-perfil {
                cursor: pointer;
                transition: all 0.3s ease;
            }
            .perfil-card {
                background: rgba(102, 126, 234, 0.1);
                border-radius: 12px;
                padding: 0.5rem 0.85rem;
                display: flex;
                align-items: center;
                gap: 0.65rem;
                border: 2px solid transparent;
                transition: all 0.3s ease;
            }
            .perfil-card:hover {
                background: rgba(102, 126, 234, 0.15);
                border-color: #667eea;
                transform: translateY(-2px);
            }
            .perfil-img {
                width: 38px;
                height: 38px;
                border-radius: 50%;
                object-fit: cover;
                border: 2px solid #667eea;
            }
            .perfil-info {
                display: flex;
                flex-direction: column;
                gap: 0.1rem;
            }
            .perfil-nombre {
                font-weight: 700;
                color: #333;
                font-size: 0.9rem;
                margin: 0;
                line-height: 1.1;
            }
            .perfil-username {
                font-size: 0.75rem;
                color: #667eea;
                margin: 0;
                line-height: 1.1;
                font-weight: 600;
            }
        `
    ];

    static properties = {
        usuario: { type: Object }
    };

    constructor() {
        super();
        this.usuario = null;
    }

    render() {
        if (!this.usuario) return html``;
        const fotoUrl = this.usuario.fotografia 
            ? `${this.usuario.fotografia}?t=${Date.now()}` 
            : 'https://via.placeholder.com/45';
        return html`
            <div class="mini-perfil" @click=${this._verPerfil}>
                <div class="perfil-card">
                    <img class="perfil-img" src="${fotoUrl}" alt="Foto" />
                    <div class="perfil-info">
                        <p class="perfil-nombre text-warning">${this.usuario.nombre}</p>
                        <p class="perfil-username">@${this.usuario.username}</p>
                    </div>
                </div>
            </div>
        `;
    }

    _verPerfil() {
        this.dispatchEvent(new CustomEvent('ver-perfil', { bubbles: true, composed: true }));
    }
}
customElements.define('mini-perfil-card', MiniPerfilCard);
