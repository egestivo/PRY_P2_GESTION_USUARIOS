import { LitElement, html, css, unsafeCSS } from 'lit';
import bootstrapStyles from 'bootstrap/dist/css/bootstrap.min.css?inline';
import '../ui-snackbar.js';

export class UserRegister extends LitElement {
    static styles = [
        unsafeCSS(bootstrapStyles),
        css`
            :host {
                display: block;
                min-height: 100vh;
                background: linear-gradient(135deg, #1e3c72 0%, #2a5298 25%, #7e22ce 75%, #dc2626 100%);
                overflow: hidden;
            }
            .register-wrapper {
                min-height: 100vh;
                padding: 2rem 1rem;
            }
            .register-container {
                max-width: 1000px;
                margin: 0 auto;
            }
            .register-card {
                background: rgba(255, 255, 255, 0.98);
                backdrop-filter: blur(20px);
                border-radius: 24px;
                box-shadow: 0 20px 80px rgba(0, 0, 0, 0.3);
                overflow: hidden;
            }
            .register-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #ff6b6b 100%);
                padding: 2rem;
                text-align: center;
            }
            .register-header h2 {
                color: white;
                font-weight: 900;
                font-size: 2.5rem;
                margin: 0;
                text-shadow: 0 4px 20px rgba(0,0,0,0.3);
            }
            .register-header p {
                color: rgba(255, 255, 255, 0.95);
                font-size: 1.1rem;
                margin: 0.5rem 0 0 0;
            }
            .register-body {
                padding: 2.5rem;
            }
            .form-control, .form-select {
                border-radius: 12px;
                border: 2px solid #e0e0e0;
                padding: 0.75rem 1rem;
                transition: all 0.3s ease;
            }
            .form-control:focus, .form-select:focus {
                border-color: #667eea;
                box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.15);
            }
            .form-control.is-valid {
                border-color: #28a745;
            }
            .form-control.is-invalid {
                border-color: #dc3545;
            }
            .password-match {
                border-color: #28a745 !important;
            }
            .password-mismatch {
                border-color: #dc3545 !important;
            }
            .btn-register {
                background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%);
                border: none;
                border-radius: 12px;
                padding: 0.95rem 1.5rem;
                font-weight: 700;
                font-size: 1.1rem;
                transition: all 0.3s ease;
                box-shadow: 0 4px 20px rgba(255, 107, 107, 0.4);
                color: white;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .btn-register:hover:not(:disabled) {
                transform: translateY(-2px);
                box-shadow: 0 6px 25px rgba(255, 107, 107, 0.6);
                background: linear-gradient(135deg, #ff5252 0%, #feb236 100%);
            }
            .edad-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
                height: 100%;
            }
            .edad-label {
                font-size: 0.85rem;
                color: rgba(255, 255, 255, 0.7);
                font-weight: 500;
                letter-spacing: 0.5px;
                text-transform: uppercase;
            }
            .edad-badge {
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.75rem 1.5rem;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border-radius: 25px;
                font-weight: 700;
                font-size: 1.1rem;
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
                border: 2px solid rgba(255, 255, 255, 0.2);
            }
            .fade-in {
                animation: fadeIn 0.6s ease;
            }
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .rol-option {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 0.85rem 1.2rem;
                cursor: pointer;
                border-radius: 12px;
                transition: all 0.3s ease;
                background: rgba(102, 126, 234, 0.05);
                border: 2px solid transparent;
            }
            .rol-option:hover {
                background: rgba(102, 126, 234, 0.1);
                border-color: #667eea;
                transform: translateX(4px);
            }
            .rol-option.selected {
                background: rgba(102, 126, 234, 0.15);
                border-color: #667eea;
            }
            .rol-icon {
                font-size: 1.5rem;
                opacity: 0;
                transform: scale(0);
                transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            }
            .rol-icon.show {
                opacity: 1;
                transform: scale(1);
            }
            .form-label {
                font-weight: 600;
                color: #444;
                margin-bottom: 0.5rem;
                font-size: 0.95rem;
            }
            .form-check-input:checked {
                background-color: #667eea;
                border-color: #667eea;
            }
            .footer-link {
                text-align: center;
                margin-top: 2rem;
                padding-top: 2rem;
                border-top: 2px solid #f0f0f0;
            }
            .footer-link p {
                color: #666;
                margin-bottom: 0.75rem;
            }
            .btn-login {
                border: 2px solid #667eea;
                color: #667eea;
                border-radius: 12px;
                padding: 0.65rem 2rem;
                font-weight: 600;
                transition: all 0.3s ease;
                background: transparent;
            }
            .btn-login:hover {
                background: #667eea;
                color: white;
                transform: translateY(-2px);
            }
        `
    ];

    render() {
        return html`
        <ui-snackbar></ui-snackbar>
        <div class="register-wrapper">
            <div class="register-container">
                <div class="register-card fade-in">
                    <div class="register-header">
                        <h2>🎨 Únete a CoursArt</h2>
                        <p>Crea tu cuenta y comparte tu arte o el de los demás, con el mundo</p>
                    </div>
                    <div class="register-body">
                        <form @submit=${this._onSubmit} @input=${this._onInput} autocomplete="off" novalidate>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Nombre de usuario</label>
                                    <input class="form-control" name="username" required minlength="3" />
                                    <div class="invalid-feedback">Mínimo 3 caracteres.</div>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Nombre completo</label>
                                    <input class="form-control" name="nombre" required />
                                    <div class="invalid-feedback">El nombre es obligatorio.</div>
                                </div>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Correo electrónico</label>
                                <input class="form-control" type="email" name="correo" required />
                                <div class="invalid-feedback">Ingresa un correo válido.</div>
                            </div>

                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Contraseña</label>
                                    <input 
                                        class="form-control" 
                                        type="password" 
                                        name="contrasena" 
                                        required 
                                        minlength="6"
                                        @input=${this._checkPasswordMatch} />
                                    <div class="form-text">Mínimo 6 caracteres</div>
                                    <div class="invalid-feedback">Mínimo 6 caracteres.</div>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Repetir contraseña</label>
                                    <input 
                                        class="form-control" 
                                        type="password" 
                                        name="repetir_contrasena" 
                                        required
                                        @input=${this._checkPasswordMatch} />
                                    <div class="invalid-feedback">Las contraseñas no coinciden.</div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Fecha de nacimiento</label>
                                    <input class="form-control" type="date" name="fecha_nacimiento" required @change=${this._onFechaChange} />
                                    <div class="invalid-feedback">Fecha obligatoria.</div>
                                </div>
                                <div class="col-md-6 mb-3">
                                    ${this.showEdad && this.edad !== null ? html`
                                        <div class="edad-container fade-in">
                                            <span class="edad-label">Tu edad</span>
                                            <div class="edad-badge">
                                                <span>✨</span>
                                                <span>${this.edad} años</span>
                                            </div>
                                        </div>
                                    ` : html`<div style="height: 100%;">&nbsp;</div>`}
                                </div>
                            </div>

                            <div class="mb-3">
                                <label class="form-label d-block">Selecciona tu rol</label>
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="rol-option ${this.rolSeleccionado === 'artista' ? 'selected' : ''}" @click=${() => this._selectRol('artista')}>
                                            <input class="form-check-input" type="radio" name="rol" id="rol-artista" value="artista" required .checked=${this.rolSeleccionado === 'artista'} />
                                            <label class="form-check-label" for="rol-artista">Artista</label>
                                            <span class="rol-icon ${this.rolSeleccionado === 'artista' ? 'show' : ''}">🎨</span>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="rol-option ${this.rolSeleccionado === 'visitante' ? 'selected' : ''}" @click=${() => this._selectRol('visitante')}>
                                            <input class="form-check-input" type="radio" name="rol" id="rol-visitante" value="visitante" required .checked=${this.rolSeleccionado === 'visitante'} />
                                            <label class="form-check-label" for="rol-visitante">Visitante</label>
                                            <span class="rol-icon ${this.rolSeleccionado === 'visitante' ? 'show' : ''}">👁️</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="invalid-feedback d-block" style="display: ${this.rolInvalid ? 'block' : 'none'} !important;">Selecciona un rol.</div>
                            </div>

                            <div class="mb-4">
                                <label class="form-label">Fotografía de perfil (opcional)</label>
                                <input class="form-control" type="file" name="fotografia" accept="image/*" />
                                <div class="form-text">Si no subes una foto, se usará una imagen por defecto</div>
                            </div>

                            <button class="btn btn-register w-100" ?disabled=${this.loading}>
                                ${this.loading ? html`<span class="spinner-border spinner-border-sm"></span>` : 'Crear Cuenta'}
                            </button>

                            <div class="footer-link">
                                <p>¿Ya posees una cuenta?</p>
                                <button type="button" class="btn btn-login" @click=${this._irLogin}>
                                    Iniciar Sesión
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
    }
    _onInput(e) {
        const form = e.target.form || e.currentTarget;
        if (!form) return;
        // Validación visual instantánea y feedback específico
        for (const el of form.elements) {
            if ((el.tagName === 'INPUT' && el.type !== 'radio' && el.name !== 'repetir_contrasena') || el.tagName === 'SELECT') {
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

    _selectRol(rol) {
        this.rolSeleccionado = rol;
        this.rolInvalid = false;
        this.requestUpdate();
    }

    _checkPasswordMatch(e) {
        const form = e.target.form;
        const password = form.querySelector('[name="contrasena"]');
        const repeatPassword = form.querySelector('[name="repetir_contrasena"]');
        
        if (password.value && repeatPassword.value) {
            if (password.value === repeatPassword.value) {
                repeatPassword.classList.remove('password-mismatch', 'is-invalid');
                repeatPassword.classList.add('password-match', 'is-valid');
                this.passwordsMatch = true;
            } else {
                repeatPassword.classList.remove('password-match', 'is-valid');
                repeatPassword.classList.add('password-mismatch', 'is-invalid');
                this.passwordsMatch = false;
            }
        }
    }

    _irLogin() {
        this.dispatchEvent(new CustomEvent('ir-login', { bubbles: true, composed: true }));
    }

    _showSnackbar(msg, color = '#dc3545') {
        window.dispatchEvent(new CustomEvent('ui-snackbar', {
            detail: { message: msg, color },
        }));
    }

    _onFechaChange(e) {
        const fecha = e.target.value;
        if (fecha) {
            const edad = this._calcularEdad(fecha);
            this.edad = edad;
            this.showEdad = true;
        } else {
            this.showEdad = false;
        }
    }

    _calcularEdad(fecha) {
        const hoy = new Date();
        const nacimiento = new Date(fecha);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const m = hoy.getMonth() - nacimiento.getMonth();
        if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }
        return edad;
    }

    async _onSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const password = form.querySelector('[name="contrasena"]');
        const repeatPassword = form.querySelector('[name="repetir_contrasena"]');
        
        // Validar que las contraseñas coincidan
        if (password.value !== repeatPassword.value) {
            this._showSnackbar('Las contraseñas no coinciden.');
            repeatPassword.classList.add('is-invalid');
            return;
        }
        
        let valid = true;
        // Validación manual antes de enviar
        for (const el of form.elements) {
            if ((el.tagName === 'INPUT' && el.type !== 'radio' && el.name !== 'repetir_contrasena') || el.tagName === 'SELECT') {
                if (!el.checkValidity()) {
                    el.classList.add('is-invalid');
                    valid = false;
                }
            }
        }
        
        // Validar rol seleccionado
        if (!this.rolSeleccionado) {
            this.rolInvalid = true;
            valid = false;
        }
        
        if (!valid) {
            this._showSnackbar('Por favor corrige los campos marcados.');
            return;
        }
        
        this.loading = true;
        const fd = new FormData(form);
        // Remover el campo repetir_contrasena antes de enviar
        fd.delete('repetir_contrasena');
        
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                body: fd
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Error');
            
            if (data.token) {
                localStorage.setItem('token', data.token);
            }
            
            this.dispatchEvent(new CustomEvent('register-success', { detail: data, bubbles: true, composed: true }));
        } catch (err) {
            this._showSnackbar(err.message);
        } finally {
            this.loading = false;
        }
    }

    static properties = {
        edad: { type: Number },
        showEdad: { type: Boolean },
        loading: { type: Boolean },
        rolSeleccionado: { type: String },
        rolInvalid: { type: Boolean },
        passwordsMatch: { type: Boolean }
    };

    constructor() {
        super();
        this.edad = null;
        this.showEdad = false;
        this.loading = false;
        this.rolSeleccionado = '';
        this.rolInvalid = false;
        this.passwordsMatch = false;
    }
}
customElements.define('user-register', UserRegister);

