import { LitElement, html, css, unsafeCSS } from 'lit';
import bootstrapStyles from 'bootstrap/dist/css/bootstrap.min.css?inline';
import '../ui-snackbar.js';

export class ComentarioListado extends LitElement {
    static styles = [
        unsafeCSS(bootstrapStyles),
        css`
            :host {
                display: block;
                padding: 1rem;
            }
            .comentarios-container {
                max-width: 680px;
                margin: 0 auto;
            }
            .comentario-card {
                background: white;
                border-radius: 20px;
                padding: 2rem;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
                animation: fadeInUp 0.5s ease;
            }
            .comentario-title {
                font-size: 1.5rem;
                font-weight: 700;
                color: #333;
                margin-bottom: 1.5rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            .nuevo-comentario-box {
                background: #f8f9fa;
                border-radius: 16px;
                padding: 1.5rem;
                margin-bottom: 1.5rem;
            }
            .comentario-textarea {
                border-radius: 12px;
                border: 2px solid #e0e0e0;
                padding: 1rem;
                transition: all 0.3s ease;
                resize: none;
            }
            .comentario-textarea:focus {
                border-color: #667eea;
                box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.15);
            }
            .btn-comentar {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border: none;
                padding: 0.65rem 1.5rem;
                border-radius: 10px;
                font-weight: 600;
                color: white;
                transition: all 0.3s ease;
            }
            .btn-comentar:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
            }
            .comentarios-list {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }
            .comentario-item {
                background: #f8f9fa;
                border-radius: 12px;
                padding: 1.2rem;
                border: none;
                transition: all 0.3s ease;
                animation: fadeIn 0.5s ease;
            }
            .comentario-item:hover {
                background: #e9ecef;
                transform: translateX(4px);
            }
            .comentario-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 0.5rem;
            }
            .comentario-autor {
                font-weight: 700;
                color: #667eea;
                font-size: 0.95rem;
            }
            .comentario-fecha {
                font-size: 0.8rem;
                color: #999;
            }
            .comentario-texto {
                color: #333;
                line-height: 1.5;
                margin-bottom: 0.5rem;
            }
            .btn-eliminar-comentario {
                background: transparent;
                border: 1px solid #dc3545;
                color: #dc3545;
                padding: 0.4rem 0.8rem;
                border-radius: 8px;
                font-size: 0.85rem;
                font-weight: 600;
                transition: all 0.3s ease;
            }
            .btn-eliminar-comentario:hover {
                background: #dc3545;
                color: white;
            }
            .btn-editar-comentario {
                background: transparent;
                border: 1px solid #667eea;
                color: #667eea;
                padding: 0.4rem 0.8rem;
                border-radius: 8px;
                font-size: 0.85rem;
                font-weight: 600;
                transition: all 0.3s ease;
                margin-right: 0.5rem;
            }
            .btn-editar-comentario:hover {
                background: #667eea;
                color: white;
            }
            .comentario-actions {
                display: flex;
                gap: 0.5rem;
            }
            .edit-textarea {
                width: 100%;
                border-radius: 8px;
                border: 2px solid #667eea;
                padding: 0.75rem;
                margin-bottom: 0.5rem;
                resize: none;
            }
            .edit-actions {
                display: flex;
                gap: 0.5rem;
            }
            .btn-guardar-edit {
                background: #28a745;
                border: none;
                color: white;
                padding: 0.4rem 1rem;
                border-radius: 8px;
                font-weight: 600;
            }
            .btn-cancelar-edit {
                background: #6c757d;
                border: none;
                color: white;
                padding: 0.4rem 1rem;
                border-radius: 8px;
                font-weight: 600;
            }
            .empty-state {
                text-align: center;
                padding: 2rem;
                color: #999;
            }
            .empty-state-icon {
                font-size: 3rem;
                margin-bottom: 1rem;
            }
            .fade-in { animation: fadeIn 0.5s; }
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `
    ];

    static properties = {
        comentarios: { type: Array },
        loading: { type: Boolean },
        user: { type: Object },
        publicacionId: { type: Number },
        editandoComentarioId: { type: Number }
    };

    constructor() {
        super();
        this.comentarios = [];
        this.loading = false;
        this.publicacionId = null;
        this.editandoComentarioId = null;
    }

    connectedCallback() {
        super.connectedCallback();
        if (this.publicacionId) {
            this._cargarComentarios();
        }
    }

    updated(changedProperties) {
        if (changedProperties.has('publicacionId') && this.publicacionId) {
            this._cargarComentarios();
        }
    }

    async _cargarComentarios() {
        if (!this.publicacionId) return;
        
        this.loading = true;
        try {
            const res = await fetch(`/api/comentarios/publicacion/${this.publicacionId}?limit=100`);
            
            if (!res.ok) throw new Error('Error al cargar comentarios');
            
            const result = await res.json();
            this.comentarios = result.data || result;
        } catch (err) {
            this._showSnackbar('❌ ' + err.message);
        } finally {
            this.loading = false;
        }
    }

    render() {
        return html`
            <ui-snackbar></ui-snackbar>
            <div class="comentarios-container">
                <div class="comentario-card">
                    <h4 class="comentario-title">
                        💬 Comentarios
                        <span style="font-size: 0.9rem; color: #999; font-weight: 400;">(${this.comentarios.length})</span>
                    </h4>
                    
                    <div class="nuevo-comentario-box">
                        <textarea 
                            class="form-control comentario-textarea" 
                            rows="3" 
                            placeholder="✍️ Escribe un comentario..." 
                            id="nuevo-comentario" 
                            required 
                            minlength="3" 
                            @input=${this._onInput}
                        ></textarea>
                        <div class="invalid-feedback">El comentario es obligatorio y debe tener al menos 3 caracteres.</div>
                        <button class="btn btn-comentar mt-3" @click=${this._agregarComentario}>
                            💬 Publicar Comentario
                        </button>
                    </div>
                    
                    ${this.comentarios.length === 0 ? html`
                        <div class="empty-state">
                            <div class="empty-state-icon">💭</div>
                            <p>No hay comentarios aún. ¡Sé el primero en comentar!</p>
                        </div>
                    ` : html`
                        <div class="comentarios-list">
                            ${this.comentarios.map(com => html`
                                <div class="comentario-item" data-comment-id="${com.id}">
                                    <div class="comentario-header">
                                        <div>
                                            <span class="comentario-autor">${com.autor || 'Anónimo'}</span>
                                            <span class="comentario-fecha"> • ${com.fecha || 'Hace poco'}</span>
                                        </div>
                                        ${(this._puedeEditar(com) || this._puedeEliminar(com)) ? html`
                                            <div class="comentario-actions">
                                                ${this._puedeEditar(com) ? html`
                                                    <button class="btn-editar-comentario" @click=${() => this._editarComentario(com)}>
                                                        ✏️ Editar
                                                    </button>
                                                ` : ''}
                                                ${this._puedeEliminar(com) ? html`
                                                    <button class="btn-eliminar-comentario" @click=${() => this._confirmarEliminarComentario(com)}>
                                                        🗑️ Eliminar
                                                    </button>
                                                ` : ''}
                                            </div>
                                        ` : ''}
                                    </div>
                                    ${this.editandoComentarioId === com.id ? html`
                                        <textarea 
                                            class="edit-textarea" 
                                            rows="3"
                                            id="edit-textarea-${com.id}"
                                            .value=${com.texto}
                                        ></textarea>
                                        <div class="edit-actions">
                                            <button class="btn-guardar-edit" @click=${() => this._guardarEdicion(com)}>
                                                💾 Guardar
                                            </button>
                                            <button class="btn-cancelar-edit" @click=${() => this._cancelarEdicion()}>
                                                ❌ Cancelar
                                            </button>
                                        </div>
                                    ` : html`
                                        <div class="comentario-texto">${com.texto}</div>
                                    `}
                                </div>
                            `)}
                        </div>
                    `}
                </div>
            </div>
        `;
    }

    _puedeEditar(com) {
        if (!this.user) return false;
        return this.user.id === com.autor_id;
    }

    _puedeEliminar(com) {
        if (!this.user) return false;
        return this.user.rol === 'admin' || this.user.id === com.autor_id;
    }

    _editarComentario(com) {
        this.editandoComentarioId = com.id;
    }

    _cancelarEdicion() {
        this.editandoComentarioId = null;
    }

    async _guardarEdicion(com) {
        const textarea = this.renderRoot.querySelector(`#edit-textarea-${com.id}`);
        const nuevoTexto = textarea.value.trim();

        if (!nuevoTexto || nuevoTexto.length < 3) {
            this._showSnackbar('⚠️ El comentario debe tener al menos 3 caracteres');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/comentarios/${com.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ texto: nuevoTexto })
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Error al editar comentario');
            }

            this._showSnackbar('✅ Comentario actualizado', '#28a745');
            this.editandoComentarioId = null;
            await this._cargarComentarios();
        } catch (err) {
            this._showSnackbar('❌ ' + err.message);
        }
    }

    _onInput(e) {
        const textarea = e.target;
        if (!textarea) return;
        // Validación visual instantánea
        if (textarea.checkValidity()) {
            textarea.classList.remove('is-invalid');
            textarea.classList.add('is-valid');
        } else {
            textarea.classList.remove('is-valid');
            if (textarea.value) textarea.classList.add('is-invalid');
            else textarea.classList.remove('is-invalid');
        }
    }

    _showSnackbar(msg, color = '#dc3545') {
        window.dispatchEvent(new CustomEvent('ui-snackbar', {
            detail: { message: msg, color },
        }));
    }

    async _agregarComentario() {
        if (!this.publicacionId) {
            this._showSnackbar('⚠️ No se pudo identificar la publicación');
            return;
        }

        const textarea = this.renderRoot.querySelector('#nuevo-comentario');
        const texto = textarea.value.trim();
        
        if (!textarea.checkValidity()) {
            textarea.classList.add('is-invalid');
            this._showSnackbar('⚠️ El comentario debe tener al menos 3 caracteres');
            return;
        }
        
        if (!texto) {
            textarea.classList.add('is-invalid');
            this._showSnackbar('⚠️ El comentario no puede estar vacío');
            return;
        }
        
        try {
            const token = localStorage.getItem('token');
            
            if (!token) {
                this._showSnackbar('⚠️ Debes iniciar sesión para comentar');
                return;
            }
            
            const res = await fetch('/api/comentarios', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    publicacion_id: this.publicacionId,
                    texto 
                })
            });
            
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Error al comentar');
            
            textarea.value = '';
            textarea.classList.remove('is-valid', 'is-invalid');
            this._showSnackbar('✅ Comentario agregado', '#28a745');
            
            await this._cargarComentarios();
        } catch (err) {
            this._showSnackbar('❌ ' + err.message);
        }
    }

    _confirmarEliminarComentario(com) {
        this._showSnackbar('⚠️ Haz clic de nuevo en eliminar para confirmar', '#ff9800');
        
        const item = this.renderRoot.querySelector(`[data-comment-id="${com.id}"]`);
        if (!item) return;
        
        const btn = item.querySelector('.btn-eliminar-comentario');
        btn.style.background = '#dc3545';
        btn.style.color = 'white';
        btn.textContent = '⚠️ Confirmar';
        
        const confirmarHandler = () => {
            this._eliminarComentario(com);
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

    async _eliminarComentario(com) {
        try {
            const token = localStorage.getItem('token');
            
            if (!token) {
                this._showSnackbar('⚠️ Debes iniciar sesión');
                return;
            }
            
            const res = await fetch(`/api/comentarios/${com.id}`, { 
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'No se pudo eliminar');
            }
            
            this._showSnackbar('✅ Comentario eliminado', '#28a745');
            await this._cargarComentarios();
        } catch (err) {
            this._showSnackbar('❌ ' + err.message);
        }
    }
}
customElements.define('comentario-listado', ComentarioListado);
