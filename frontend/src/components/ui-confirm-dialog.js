import { LitElement, html, css } from 'lit';

export class UiConfirmDialog extends LitElement {
    static styles = css`
        :host {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9999;
            align-items: center;
            justify-content: center;
        }
        :host([open]) {
            display: flex;
        }
        .overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(8px);
            animation: fadeIn 0.3s ease;
        }
        .dialog {
            position: relative;
            background: linear-gradient(135deg, rgba(30, 27, 75, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%);
            border: 2px solid rgba(139, 92, 246, 0.4);
            border-radius: 24px;
            padding: 2rem;
            max-width: 450px;
            width: 90%;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            animation: slideUp 0.3s ease;
            backdrop-filter: blur(20px);
        }
        .dialog-icon {
            text-align: center;
            font-size: 3.5rem;
            margin-bottom: 1rem;
            animation: pulse 0.6s ease;
        }
        .dialog-title {
            color: #f1f5f9;
            font-size: 1.5rem;
            font-weight: 700;
            text-align: center;
            margin-bottom: 0.75rem;
        }
        .dialog-message {
            color: #cbd5e1;
            text-align: center;
            margin-bottom: 2rem;
            line-height: 1.6;
            font-size: 1rem;
        }
        .dialog-actions {
            display: flex;
            gap: 1rem;
        }
        .btn {
            flex: 1;
            padding: 0.85rem 1.5rem;
            border: none;
            border-radius: 12px;
            font-weight: 700;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .btn-cancel {
            background: rgba(100, 116, 139, 0.2);
            color: #94a3b8;
            border: 2px solid rgba(100, 116, 139, 0.4);
        }
        .btn-cancel:hover {
            background: rgba(100, 116, 139, 0.3);
            border-color: #64748b;
            color: #cbd5e1;
            transform: translateY(-2px);
        }
        .btn-confirm {
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            color: white;
            box-shadow: 0 4px 20px rgba(239, 68, 68, 0.4);
        }
        .btn-confirm:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 25px rgba(239, 68, 68, 0.6);
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }
    `;

    static properties = {
        open: { type: Boolean, reflect: true },
        title: { type: String },
        message: { type: String },
        confirmText: { type: String },
        cancelText: { type: String },
        icon: { type: String }
    };

    constructor() {
        super();
        this.open = false;
        this.title = '¿Estás seguro?';
        this.message = 'Esta acción no se puede deshacer.';
        this.confirmText = 'Confirmar';
        this.cancelText = 'Cancelar';
        this.icon = '⚠️';
        this._resolvePromise = null;
    }

    render() {
        return html`
            <div class="overlay" @click=${this._cancel}></div>
            <div class="dialog">
                <div class="dialog-icon">${this.icon}</div>
                <h3 class="dialog-title">${this.title}</h3>
                <p class="dialog-message">${this.message}</p>
                <div class="dialog-actions">
                    <button class="btn btn-cancel" @click=${this._cancel}>
                        ${this.cancelText}
                    </button>
                    <button class="btn btn-confirm" @click=${this._confirm}>
                        ${this.confirmText}
                    </button>
                </div>
            </div>
        `;
    }

    show(options = {}) {
        this.title = options.title || this.title;
        this.message = options.message || this.message;
        this.confirmText = options.confirmText || this.confirmText;
        this.cancelText = options.cancelText || this.cancelText;
        this.icon = options.icon || this.icon;
        this.open = true;

        return new Promise((resolve) => {
            this._resolvePromise = resolve;
        });
    }

    _confirm() {
        this.open = false;
        if (this._resolvePromise) {
            this._resolvePromise(true);
            this._resolvePromise = null;
        }
    }

    _cancel() {
        this.open = false;
        if (this._resolvePromise) {
            this._resolvePromise(false);
            this._resolvePromise = null;
        }
    }
}

customElements.define('ui-confirm-dialog', UiConfirmDialog);
