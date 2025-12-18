import { LitElement, html, css, unsafeCSS } from 'lit';
import bootstrapStyles from 'bootstrap/dist/css/bootstrap.min.css?inline';
import '../ui-snackbar.js';

export class EditarPerfil extends LitElement {
    static styles = [
        unsafeCSS(bootstrapStyles),
        css`
            :host {
                display: block;
                padding: 2rem 1rem;
            }
            .editar-container {
                max-width: 600px;
                margin: 0 auto;
            }
            .editar-card {
                background: white;
                border-radius: 24px;
                padding: 2.5rem;
                box-shadow: 0 8px 32px rgba(102, 126, 234, 0.15);
                animation: fadeInUp 0.5s ease;
            }
            .editar-title {
                font-size: 1.8rem;
                font-weight: 700;
                color: #333;
                margin-bottom: 2rem;
                text-align: center;
            }
            .form-label {
                font-weight: 600;
                color: #555;
                margin-bottom: 0.5rem;
            }
            .form-control {
                border-radius: 12px;
                border: 2px solid #e0e0e0;
                padding: 0.75rem 1rem;
                transition: all 0.3s ease;
            }
            .form-control:focus {
                border-color: #667eea;
                box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.15);
            }
            .form-control.is-valid {
                border-color: #28a745;
            }
            .form-control.is-invalid {
                border-color: #dc3545;
            }
            .btn-guardar {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border: none;
                padding: 0.75rem 2rem;
                border-radius: 12px;
                font-weight: 600;
                color: white;
                width: 100%;
                transition: all 0.3s ease;
            }
            .btn-guardar:hover:not(:disabled) {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
            }
            .btn-guardar:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }
            .btn-cancelar {
                background: transparent;
                border: 2px solid #6c757d;
                padding: 0.75rem 2rem;
                border-radius: 12px;
                font-weight: 600;
                color: #6c757d;
                width: 100%;
                margin-top: 1rem;
                transition: all 0.3s ease;
            }
            .btn-cancelar:hover {
                background: #6c757d;
                color: white;
            }
            .preview-foto {
                width: 120px;
                height: 120px;
                border-radius: 50%;
                object-fit: cover;
                border: 4px solid #667eea;
                margin: 0 auto 1.5rem;
                display: block;
            }
            @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(30px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `
    ];

    static properties = {
        usuario: { type: Object },
        loading: { type: Boolean }
    };

    constructor() {
        super();
        this.usuario = null;
        this.loading = false;
    }

    render() {
        if (!this.usuario) return html`<div class="text-center mt-5">⏳ Cargando...</div>`;

        const fotoUrl = this.usuario.fotografia 
            ? `${this.usuario.fotografia}?t=${Date.now()}` 
            : 'https://via.placeholder.com/120';

        return html`
            <ui-snackbar></ui-snackbar>
            <div class="editar-container">
                <div class="editar-card">
                    <h2 class="editar-title">✏️ Editar Perfil</h2>
                    
                    <img class="preview-foto" id="foto-preview" src="${fotoUrl}" alt="Foto de perfil" />
                    
                    <form @submit=${this._onSubmit} @input=${this._onInput} novalidate>
                        <div class="mb-3">
                            <label class="form-label">Nombre Completo</label>
                            <input 
                                type="text" 
                                class="form-control" 
                                name="nombre" 
                                value="${this.usuario.nombre || ''}"
                                required 
                                minlength="3"
                            />
                            <div class="invalid-feedback">El nombre debe tener al menos 3 caracteres</div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Nombre de Usuario</label>
                            <input 
                                type="text" 
                                class="form-control" 
                                name="username" 
                                value="${this.usuario.username || ''}"
                                required 
                                minlength="3"
                            />
                            <div class="invalid-feedback">El username debe tener al menos 3 caracteres</div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Correo Electrónico</label>
                            <input 
                                type="email" 
                                class="form-control" 
                                name="correo" 
                                value="${this.usuario.correo || ''}"
                                required
                            />
                            <div class="invalid-feedback">Ingresa un correo válido</div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Fecha de Nacimiento</label>
                            <input 
                                type="date" 
                                class="form-control" 
                                name="fecha_nacimiento" 
                                value="${this._getFechaFormateada()}"
                                required
                            />
                            <div class="invalid-feedback">Ingresa tu fecha de nacimiento</div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Foto de Perfil (opcional)</label>
                            <input 
                                type="file" 
                                class="form-control" 
                                name="fotografia"
                                accept="image/*"
                                @change=${this._onFotoChange}
                            />
                            <small class="text-muted">Deja vacío si no deseas cambiar la foto</small>
                        </div>

                        <hr style="border-color: #e0e0e0; margin: 2rem 0;" />

                        <h5 style="color: #555; margin-bottom: 1rem;">🔒 Cambiar Contraseña</h5>
                        
                        <div class="mb-3">
                            <label class="form-label">Contraseña Actual</label>
                            <input 
                                type="password" 
                                class="form-control" 
                                name="currentPassword"
                                id="currentPassword"
                                placeholder="Deja vacío si no quieres cambiarla"
                            />
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Contraseña Nueva</label>
                            <input 
                                type="password" 
                                class="form-control" 
                                name="newPassword"
                                id="newPassword"
                                placeholder="Deja vacío si no quieres cambiarla"
                                minlength="6"
                            />
                            <small class="text-muted">Mínimo 6 caracteres</small>
                        </div>

                        <button type="submit" class="btn btn-guardar" ?disabled=${this.loading}>
                            ${this.loading ? '⏳ Guardando...' : '💾 Guardar Cambios'}
                        </button>

                        <button type="button" class="btn btn-cancelar" @click=${this._cancelar} ?disabled=${this.loading}>
                            ❌ Cancelar
                        </button>
                    </form>
                </div>
            </div>
        `;
    }

    _getFechaFormateada() {
        if (!this.usuario.fecha_nacimiento) return '';
        const fecha = new Date(this.usuario.fecha_nacimiento);
        return fecha.toISOString().split('T')[0];
    }

    _onFotoChange(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                const preview = this.renderRoot.querySelector('#foto-preview');
                if (preview) preview.src = ev.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    _onInput(e) {
        const input = e.target;
        if (input.tagName === 'INPUT' && input.type !== 'file') {
            if (input.checkValidity()) {
                input.classList.remove('is-invalid');
                input.classList.add('is-valid');
            } else {
                input.classList.remove('is-valid');
                if (input.value) input.classList.add('is-invalid');
                else input.classList.remove('is-invalid');
            }
        }
    }

    async _onSubmit(e) {
        e.preventDefault();
        const form = e.target;
        
        let valid = true;
        for (const el of form.elements) {
            if (el.tagName === 'INPUT' && el.type !== 'file' && el.type !== 'password' && !el.checkValidity()) {
                el.classList.add('is-invalid');
                valid = false;
            }
        }
        
        if (!valid) {
            this._showSnackbar('⚠️ Por favor corrige los campos marcados');
            return;
        }
        
        this.loading = true;
        const fd = new FormData(form);
        
        // Extraer contraseñas para validar cambio
        const currentPassword = form.currentPassword.value.trim();
        const newPassword = form.newPassword.value.trim();
        
        try {
            const token = localStorage.getItem('token');
            
            if (!token) {
                this._showSnackbar('⚠️ No hay sesión activa');
                return;
            }
            
            // Actualizar perfil (nombre, correo, foto, etc)
            const res = await fetch(`/api/usuarios/${this.usuario.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: fd
            });
            
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Error al actualizar perfil');
            
            // Si hay contraseñas, intentar cambiarlas
            if (currentPassword && newPassword) {
                if (newPassword.length < 6) {
                    throw new Error('La contraseña nueva debe tener al menos 6 caracteres');
                }
                
                const resPass = await fetch(`/api/usuarios/${this.usuario.id}/change-password`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ currentPassword, newPassword })
                });
                
                const dataPass = await resPass.json();
                if (!resPass.ok) throw new Error(dataPass.message || 'Error al cambiar contraseña');
                
                this._showSnackbar('✅ Perfil y contraseña actualizados correctamente', '#28a745');
            } else if (currentPassword || newPassword) {
                this._showSnackbar('⚠️ Debes llenar ambos campos de contraseña para cambiarla', '#ff9800');
            } else {
                this._showSnackbar('✅ Perfil actualizado correctamente', '#28a745');
            }
            
            setTimeout(() => {
                this.dispatchEvent(new CustomEvent('perfil-actualizado', { 
                    detail: data,
                    bubbles: true, 
                    composed: true 
                }));
            }, 1000);
        } catch (err) {
            this._showSnackbar('❌ ' + err.message);
        } finally {
            this.loading = false;
        }
    }

    _cancelar() {
        this.dispatchEvent(new CustomEvent('cancelar-edicion', { 
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
customElements.define('editar-perfil', EditarPerfil);
