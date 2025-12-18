import { LitElement, html, css, unsafeCSS } from 'lit';
import bootstrapStyles from 'bootstrap/dist/css/bootstrap.min.css?inline';
import '../ui-snackbar.js';

export class UserLogin extends LitElement {
    static styles = [
        unsafeCSS(bootstrapStyles),
        css`
            :host {
                display: block;
                min-height: 100vh;
                background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e22ce 100%);
                overflow: hidden;
            }
            .login-wrapper {
                min-height: 100vh;
                display: flex;
                align-items: center;
            }
            .login-left {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                position: relative;
                overflow: hidden;
            }
            .login-left::before {
                content: '';
                position: absolute;
                width: 500px;
                height: 500px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 50%;
                top: -250px;
                left: -250px;
            }
            .login-left::after {
                content: '';
                position: absolute;
                width: 400px;
                height: 400px;
                background: rgba(255, 255, 255, 0.08);
                border-radius: 50%;
                bottom: -200px;
                right: -200px;
            }
            .brand-logo {
                position: relative;
                z-index: 2;
                text-align: center;
            }
            .brand-logo h1 {
                color: white;
                font-size: 4rem;
                font-weight: 900;
                margin: 0;
                text-shadow: 0 4px 20px rgba(0,0,0,0.3);
                letter-spacing: -2px;
            }
            .brand-logo p {
                color: rgba(255, 255, 255, 0.95);
                font-size: 1.2rem;
                margin-top: 1rem;
                font-weight: 300;
            }
            .login-right {
                background: white;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 3rem 2rem;
            }
            .login-form-container {
                width: 100%;
                max-width: 450px;
            }
            .login-form-container h2 {
                color: #333;
                font-weight: 700;
                font-size: 2rem;
                margin-bottom: 0.5rem;
            }
            .login-form-container .subtitle {
                color: #666;
                margin-bottom: 2rem;
                font-size: 1rem;
            }
            .form-control {
                border-radius: 12px;
                border: 2px solid #e0e0e0;
                padding: 0.85rem 1.2rem;
                transition: all 0.3s ease;
                font-size: 1rem;
            }
            .form-control:focus {
                border-color: #667eea;
                box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.15);
            }
            .form-control.is-valid {
                border-color: #28a745;
                background-image: none;
            }
            .form-control.is-invalid {
                border-color: #dc3545;
            }
            .btn-primary {
                background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%);
                border: none;
                border-radius: 12px;
                padding: 0.95rem 1.5rem;
                font-weight: 700;
                font-size: 1.05rem;
                transition: all 0.3s ease;
                box-shadow: 0 4px 20px rgba(255, 107, 107, 0.4);
                color: white;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .btn-primary:hover:not(:disabled) {
                transform: translateY(-2px);
                box-shadow: 0 6px 25px rgba(255, 107, 107, 0.6);
                background: linear-gradient(135deg, #ff5252 0%, #feb236 100%);
            }
            .btn-primary:active:not(:disabled) {
                transform: translateY(0);
            }
            .btn-outline-secondary {
                border: 2px solid #667eea;
                color: #667eea;
                border-radius: 12px;
                padding: 0.65rem 1.5rem;
                font-weight: 600;
                transition: all 0.3s ease;
            }
            .btn-outline-secondary:hover {
                background: #667eea;
                color: white;
                transform: translateY(-2px);
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
            .form-label {
                font-weight: 600;
                color: #444;
                margin-bottom: 0.5rem;
                font-size: 0.95rem;
            }
            .divider {
                text-align: center;
                margin: 1.5rem 0;
                position: relative;
            }
            .divider::before {
                content: '';
                position: absolute;
                left: 0;
                top: 50%;
                width: 100%;
                height: 1px;
                background: #e0e0e0;
            }
            .divider span {
                background: white;
                padding: 0 1rem;
                color: #999;
                position: relative;
                z-index: 1;
            }
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
            <div class="login-wrapper">
                <div class="row g-0 w-100">
                    <div class="col-md-6 login-left">
                        <div class="brand-logo fade-in">
                            <img src="../../public/CoursArtLogo.png" style="max-width: 10rem;" alt="Logo" />
                        </div>
                        <div class="brand-logo fade-in">
                            <h1>CoursArt</h1>
                            <p>Conecta, crea y comparte tu arte o el de los demás, con el mundo!</p>
                        </div>
                    </div>
                    <div class="col-md-6 login-right">
                        <div class="login-form-container fade-in">
                            <h2>¡Bienvenido!</h2>
                            <p class="subtitle">Inicia sesión para continuar</p>
                            
                            <form @submit=${this._onSubmit} @input=${this._onInput} autocomplete="off" novalidate>
                                <div class="mb-3">
                                    <label class="form-label">Usuario o correo</label>
                                    <input class="form-control" name="identificador" required minlength="3" />
                                    <div class="invalid-feedback">El usuario o correo es obligatorio y debe tener al menos 3 caracteres.</div>
                                </div>
                                <div class="mb-4">
                                    <label class="form-label">Contraseña</label>
                                    <input class="form-control" type="password" name="contrasena" required minlength="6" />
                                    <div class="invalid-feedback">La contraseña es obligatoria y debe tener al menos 6 caracteres.</div>
                                </div>
                                <button class="btn btn-primary w-100 mb-3" ?disabled=${this.loading}>
                                    ${this.loading ? html`<span class="spinner-border spinner-border-sm"></span>` : 'Iniciar Sesión'}
                                </button>
                                
                                <div class="divider">
                                    <span>¿No tienes cuenta?</span>
                                </div>
                                
                                <button type="button" class="btn btn-outline-secondary w-100" @click=${this._irRegistro}>
                                    Crear cuenta nueva
                                </button>
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
        for (const el of form.elements) {
            if (el.tagName === 'INPUT') {
                if (el.checkValidity()) {
                    el.classList.remove('is-invalid');
                    el.classList.add('is-valid');
                } else {
                    el.classList.remove('is-valid');
                    if (el.value) el.classList.add('is-invalid');
                    else el.classList.remove('is-invalid');
                }
            }
        }
    }

    _irRegistro() {
        this.dispatchEvent(new CustomEvent('ir-registro', { bubbles: true, composed: true }));
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
        for (const el of form.elements) {
            if (el.tagName === 'INPUT' && !el.checkValidity()) {
                el.classList.add('is-invalid');
                valid = false;
            }
        }
        if (!valid) {
            this._showSnackbar('Por favor completa los campos correctamente');
            return;
        }
        this.loading = true;
        const fd = new FormData(form);
        const body = Object.fromEntries(fd.entries());
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Error');
            
            if (data.token) {
                localStorage.setItem('token', data.token);
            }
            
            this.dispatchEvent(new CustomEvent('login-success', { detail: data, bubbles: true, composed: true }));
        } catch (err) {
            this._showSnackbar(err.message);
        } finally {
            this.loading = false;
        }
    }
}
customElements.define('user-login', UserLogin);
