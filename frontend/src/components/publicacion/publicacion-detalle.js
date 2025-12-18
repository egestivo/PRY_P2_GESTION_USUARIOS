import { LitElement, html, css, unsafeCSS } from 'lit';
import bootstrapStyles from 'bootstrap/dist/css/bootstrap.min.css?inline';
import '../ui-snackbar.js';

export class PublicacionDetalle extends LitElement {
    static styles = [
        unsafeCSS(bootstrapStyles),
        css`
            :host {
                display: block;
                padding: 1.5rem 1rem;
            }
            .detalle-container {
                max-width: 800px;
                margin: 0 auto;
            }
            .detalle-card {
                background: white;
                border-radius: 20px;
                overflow: hidden;
                box-shadow: 0 4px 20px rgba(102, 126, 234, 0.12);
                animation: fadeInUp 0.4s ease;
            }
            .detalle-header {
                padding: 1.5rem 2rem;
                border-bottom: 1px solid #f5f5f5;
                background: linear-gradient(135deg, rgba(102, 126, 234, 0.03) 0%, rgba(118, 75, 162, 0.03) 100%);
            }
            .detalle-title {
                font-size: 1.6rem;
                font-weight: 700;
                color: #333;
                margin-bottom: 1rem;
                line-height: 1.3;
            }
            .detalle-meta {
                display: flex;
                align-items: center;
                gap: 0.8rem;
            }
            .autor-avatar {
                width: 42px;
                height: 42px;
                border-radius: 50%;
                object-fit: cover;
                border: 2px solid #667eea;
            }
            .autor-info {
                flex: 1;
            }
            .autor-nombre {
                font-weight: 600;
                color: #667eea;
                font-size: 1rem;
                margin-bottom: 2px;
            }
            .autor-fecha {
                color: #999;
                font-size: 0.85rem;
            }
            .detalle-imagen-wrapper {
                width: 100%;
                max-height: 450px;
                overflow: hidden;
                background: #f8f9fa;
                display: flex;
                align-items: center;
                justify-content: center;
                border-top: 1px solid #f0f0f0;
                border-bottom: 1px solid #f0f0f0;
            }
            .detalle-imagen {
                width: 100%;
                height: auto;
                max-height: 450px;
                object-fit: contain;
                display: block;
            }
            .detalle-body {
                padding: 1.5rem 2rem;
            }
            .detalle-descripcion {
                font-size: 1rem;
                line-height: 1.6;
                color: #555;
                margin-bottom: 1rem;
                white-space: pre-wrap;
                word-wrap: break-word;
            }
            .detalle-etiquetas {
                display: flex;
                flex-wrap: wrap;
                gap: 0.4rem;
                margin-top: 1rem;
                padding-top: 1rem;
                border-top: 1px solid #f0f0f0;
            }
            .etiqueta {
                padding: 0.4rem 0.9rem;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border-radius: 16px;
                font-size: 0.85rem;
                font-weight: 600;
            }
            .fade-in { animation: fadeIn 0.5s; }
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(30px); }
                to { opacity: 1; transform: translateY(0); }
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
        if (!this.publicacion) return html`<div class="text-center mt-5">⏳ Cargando publicación...</div>`;
        
        const imagenUrl = this.publicacion.imagen 
            ? `http://localhost:1234${this.publicacion.imagen}` 
            : 'https://via.placeholder.com/700x350';
        
        const autorFoto = this.publicacion.autor_foto 
            ? `http://localhost:1234${this.publicacion.autor_foto}` 
            : 'https://via.placeholder.com/50';
        
        return html`
            <ui-snackbar></ui-snackbar>
            <div class="detalle-container">
                <div class="detalle-card">
                    <div class="detalle-header">
                        <h1 class="detalle-title">${this.publicacion.titulo}</h1>
                        <div class="detalle-meta">
                            <img class="autor-avatar" src="${autorFoto}" alt="${this.publicacion.autor || 'Autor'}" />
                            <div class="autor-info">
                                <div class="autor-nombre">${this.publicacion.autor || 'Anónimo'}</div>
                                <div class="autor-fecha">📅 ${this.publicacion.fecha || 'Fecha desconocida'}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="detalle-imagen-wrapper">
                        <img class="detalle-imagen" src="${imagenUrl}" alt="${this.publicacion.titulo}" />
                    </div>
                    
                    <div class="detalle-body">
                        <div class="detalle-descripcion">
                            ${this.publicacion.descripcion || 'Sin descripción'}
                        </div>
                        
                        ${this.publicacion.etiquetas ? html`
                            <div class="detalle-etiquetas">
                                ${this.publicacion.etiquetas.split(',').map(tag => html`
                                    <span class="etiqueta">#${tag.trim()}</span>
                                `)}
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    _showSnackbar(msg, color = '#dc3545') {
        window.dispatchEvent(new CustomEvent('ui-snackbar', {
            detail: { message: msg, color },
        }));
    }
}
customElements.define('publicacion-detalle', PublicacionDetalle);
