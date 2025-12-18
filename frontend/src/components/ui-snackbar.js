import { LitElement, html, css } from 'lit';

export class UiSnackbar extends LitElement {
    static styles = css`
        .snackbar {
            min-width: 250px;
            background: var(--snackbar-bg, #dc3545);
            color: #fff;
            text-align: center;
            border-radius: 8px;
            padding: 12px 24px;
            position: fixed;
            left: 50%;
            top: 30px;
            transform: translateX(-50%);
            z-index: 9999;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.4s, top 0.4s;
            font-size: 1rem;
            }
            .snackbar.show {
            opacity: 1;
            pointer-events: auto;
            top: 60px;
        }
    `;

    static properties = {
        message: { type: String },
        show: { type: Boolean },
        duration: { type: Number }
    };

    constructor() {
        super();
        this.message = '';
        this.show = false;
        this.duration = 3500;
        this._timeout = null;
        window.addEventListener('ui-snackbar', this._onSnackbarEvent.bind(this));
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener('ui-snackbar', this._onSnackbarEvent.bind(this));
    }

    render() {
        return html`
            <div class="snackbar${this.show ? ' show' : ''}">${this.message}</div>
        `;
    }

    _onSnackbarEvent(e) {
        const { message, duration, color } = e.detail;
        this.message = message;
        this.duration = duration || 3500;
        if (color) {
            this.style.setProperty('--snackbar-bg', color);
        } else {
            this.style.removeProperty('--snackbar-bg');
        }
        this.show = true;
        if (this._timeout) clearTimeout(this._timeout);
        this._timeout = setTimeout(() => {
            this.show = false;
        }, this.duration);
    }
}
customElements.define('ui-snackbar', UiSnackbar);
