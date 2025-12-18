import { LitElement, html, css, unsafeCSS } from 'lit';
import bootstrapStyles from 'bootstrap/dist/css/bootstrap.min.css?inline';
import '../ui-snackbar.js';

export class PublicacionEditar extends LitElement {
    static styles = [
        unsafeCSS(bootstrapStyles),
        css`
            .publicacion-card { max-width: 600px; margin: 2rem auto; }
            .fade-in { animation: fadeIn 1s; }
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            .preview-img {
                width: 100%;
                max-height: 300px;
                object-fit: cover;
                border-radius: 8px;
                margin-bottom: 1rem;
            }
            .preview-label {
                font-size: 0.875rem;
                color: #6c757d;
                margin-bottom: 0.5rem;
            }
        `
    ];

    static properties = {
        publicacion: { type: Object },
        loading: { type: Boolean }
    };

    constructor() {
        super();
        this.publicacion = null;
        this.loading = false;
    }

    render() {
        if (!this.publicacion) return html`<div class="text-center mt-5">Cargando publicación...</div>`;
        return html`
      <ui-snackbar></ui-snackbar>
      <div class="card publicacion-card fade-in shadow">
        <div class="card-body">
          <h3 class="card-title mb-4 text-center">✏️ Editar Publicación</h3>
          
          ${this.publicacion.imagen ? html`
            <div class="mb-3">
              <label class="preview-label">Imagen actual:</label>
              <img class="preview-img" src="${this.publicacion.imagen}" alt="${this.publicacion.titulo}" />
            </div>
          ` : ''}
          
          <form @submit=${this._onSubmit} @input=${this._onInput} autocomplete="off" novalidate>
            <div class="mb-3">
              <label class="form-label">Título</label>
              <input class="form-control" name="titulo" .value=${this.publicacion.titulo || ''} required minlength="3" />
              <div class="invalid-feedback">El título es obligatorio y debe tener al menos 3 caracteres.</div>
            </div>
            <div class="mb-3">
              <label class="form-label">Descripción</label>
              <textarea class="form-control" name="descripcion" rows="3" required minlength="10">${this.publicacion.descripcion || ''}</textarea>
              <div class="invalid-feedback">La descripción es obligatoria y debe tener al menos 10 caracteres.</div>
            </div>
            
            <div class="alert alert-info">
              ℹ️ La imagen y etiquetas no se pueden editar. Solo puedes cambiar el título y la descripción.
            </div>
            
            <button class="btn btn-primary w-100" ?disabled=${this.loading}>
              ${this.loading ? html`<span class="spinner-border spinner-border-sm"></span>` : 'Guardar Cambios'}
            </button>
          </form>
        </div>
      </div>
    `;
    }

    _onInput(e) {
        const form = e.target.form || e.currentTarget;
        if (!form) return;
        // Validación visual instantánea
        for (const el of form.elements) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                if (el.checkValidity()) {
                    el.classList.remove('is-invalid');
                    el.classList.add('is-valid');
                } else {
                    el.classList.remove('is-valid');
                    if (el.value || el.type === 'file') el.classList.add('is-invalid');
                    else el.classList.remove('is-invalid');
                }
            }
        }
    }

    _showSnackbar(msg, color = '#dc3545') {
        window.dispatchEvent(new CustomEvent('ui-snackbar', {
            detail: { message: msg, color },
        }));
    }

    async _onSubmit(e) {
        e.preventDefault();
        const form = e.target;
        let valid = true;
        // Validación manual antes de enviar
        for (const el of form.elements) {
            if ((el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') && !el.checkValidity()) {
                el.classList.add('is-invalid');
                valid = false;
            }
        }
        if (!valid) {
            this._showSnackbar('Por favor corrige los campos marcados.');
            return;
        }
        this.loading = true;
        
        // Enviar solo título y descripción (sin FormData, sin imagen)
        const titulo = form.titulo.value.trim();
        const descripcion = form.descripcion.value.trim();
        
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/publicaciones/${this.publicacion.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ titulo, descripcion })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Error al actualizar');
            this.dispatchEvent(new CustomEvent('publicacion-editada', { detail: data, bubbles: true, composed: true }));
            this._showSnackbar('¡Publicación actualizada!', '#198754');
        } catch (err) {
            this._showSnackbar(err.message);
        } finally {
            this.loading = false;
        }
    }
}
customElements.define('publicacion-editar', PublicacionEditar);
