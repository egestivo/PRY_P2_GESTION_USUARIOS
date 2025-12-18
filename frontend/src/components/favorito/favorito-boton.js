import { LitElement, html, css } from 'lit';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../ui-snackbar.js';

export class FavoritoBoton extends LitElement {
    static styles = css`
        .fav-btn { 
            font-size: 1.5rem; 
            cursor: pointer; 
            background: none; 
            border: none; 
            padding: 0.5rem 1rem;
            transition: all 0.3s ease;
            border-radius: 8px;
        }
        .fav-btn:hover { 
            transform: scale(1.1);
            background: rgba(255, 193, 7, 0.1);
        }
    `;

    static properties = {
        favorito: { type: Boolean },
        publicacionId: { type: Number }
    };

    constructor() {
        super();
        this.favorito = false;
        this.publicacionId = null;
    }

    connectedCallback() {
        super.connectedCallback();
        this._checkEstado();
    }

    async _checkEstado() {
        if (!this.publicacionId) return;
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const res = await fetch(`/api/favoritos/exists/${this.publicacionId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) return;
            const data = await res.json();
            this.favorito = !!data.exists;
        } catch (err) {
            // silently ignore
        }
    }

    render() {
        return html`
      <ui-snackbar></ui-snackbar>
      <button class="fav-btn" @click=${this._toggleFavorito} title="${this.favorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}">
        ${this.favorito ? '⭐' : '☆'}
      </button>
    `;
    }

    _showSnackbar(msg, color = '#dc3545') {
        window.dispatchEvent(new CustomEvent('ui-snackbar', {
            detail: { message: msg, color },
        }));
    }

    async _toggleFavorito(e) {
        e.stopPropagation();
        if (!this.publicacionId) return this._showSnackbar('ID de publicación no definido');
        
        const token = localStorage.getItem('token');
        if (!token) return this._showSnackbar('⚠️ Debes iniciar sesión para guardar favoritos');

        try {
            if (this.favorito) {
                const res = await fetch(`/api/favoritos/remove`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ publicacion_id: this.publicacionId })
                });
                if (!res.ok) throw new Error('No se pudo quitar de favoritos');
                this.favorito = false;
                this._showSnackbar('Eliminado de favoritos', '#198754');
            } else {
                const res = await fetch(`/api/favoritos/add`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ publicacion_id: this.publicacionId })
                });
                if (!res.ok) throw new Error('No se pudo agregar a favoritos');
                this.favorito = true;
                this._showSnackbar('Agregado a favoritos ⭐', '#198754');
            }
            this.dispatchEvent(new CustomEvent('favorito-cambiado', { detail: { favorito: this.favorito }, bubbles: true, composed: true }));
        } catch (err) {
            this._showSnackbar(err.message);
        }
    }
}
customElements.define('favorito-boton', FavoritoBoton);
