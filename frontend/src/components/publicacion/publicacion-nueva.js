import { LitElement, html, css, unsafeCSS } from 'lit';
import bootstrapStyles from 'bootstrap/dist/css/bootstrap.min.css?inline';
import '../ui-snackbar.js';

export class PublicacionNueva extends LitElement {
    static styles = [
        unsafeCSS(bootstrapStyles),
        css`
            .publicacion-card { max-width: 600px; margin: 2rem auto; }
            .fade-in { animation: fadeIn 1s; }
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        `
    ];

    static properties = {
        loading: { type: Boolean }
    };

    constructor() {
        super();
        this.loading = false;
    }

    render() {
        return html`
            <ui-snackbar></ui-snackbar>
            <div class="card publicacion-card fade-in shadow">
                <div class="card-body">
                <h3 class="card-title mb-4 text-center">Nueva Publicación</h3>
                <form @submit=${this._onSubmit} @input=${this._onInput} autocomplete="off" novalidate>
                    <div class="mb-3">
                    <label class="form-label">Título</label>
                    <input class="form-control" name="titulo" required minlength="3" />
                    <div class="invalid-feedback">El título es obligatorio y debe tener al menos 3 caracteres.</div>
                    </div>
                    <div class="mb-3">
                    <label class="form-label">Descripción</label>
                    <textarea class="form-control" name="descripcion" rows="3" required minlength="10"></textarea>
                    <div class="invalid-feedback">La descripción es obligatoria y debe tener al menos 10 caracteres.</div>
                    </div>
                    <div class="mb-3">
                    <label class="form-label">Imagen</label>
                    <input class="form-control" type="file" name="imagen" accept="image/*" required />
                    <div class="invalid-feedback">La imagen es obligatoria.</div>
                    </div>
                    <div class="mb-3">
                    <label class="form-label">Etiquetas (separadas por coma)</label>
                    <input class="form-control" name="etiquetas" placeholder="arte, digital, pintura..." />
                    <div class="form-text">Opcional: ayuda a otros a encontrar tu publicación</div>
                    </div>
                    <button class="btn btn-success w-100" ?disabled=${this.loading}>
                    ${this.loading ? html`<span class="spinner-border spinner-border-sm"></span>` : 'Publicar'}
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
        const fd = new FormData(form);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/publicaciones', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: fd
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Error al crear publicación');
            this.dispatchEvent(new CustomEvent('publicacion-creada', { detail: data, bubbles: true, composed: true }));
            form.reset();
            // Limpiar clases de validación
            for (const el of form.elements) {
                el.classList.remove('is-valid', 'is-invalid');
            }
            this._showSnackbar('¡Publicación creada con éxito!', '#198754');
        } catch (err) {
            this._showSnackbar(err.message);
        } finally {
            this.loading = false;
        }
    }
}
customElements.define('publicacion-nueva', PublicacionNueva);
