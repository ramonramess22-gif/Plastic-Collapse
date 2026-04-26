/**
 * @file ui/MainMenu.js
 * @description Lógica de construcción y comportamiento del menú principal.
 *
 * Separa la lógica del menú de MainMenuScene.js para mayor modularidad.
 * MainMenuScene crea una instancia de MainMenu y delega la construcción DOM.
 *
 * RESPONSABILIDADES:
 *   - Construir el árbol DOM del menú de forma segura
 *   - Gestionar el estado de los botones (hover, active)
 *   - Emitir callbacks al caller (MainMenuScene) para las acciones
 *   - Limpiar el DOM al destruirse
 *
 * SEGURIDAD:
 *   - Todos los textos usan textContent — nunca innerHTML.
 *   - Sin eval(), sin new Function().
 *   - Los event listeners usan funciones definidas estáticamente.
 *   - Compatible con CSP strict.
 *
 * USO:
 *   import MainMenu from '../ui/MainMenu.js';
 *   const menu = new MainMenu({
 *     containerId: 'main-menu-overlay',
 *     hasSave:     true,
 *     saveDate:    '14/04/2026',
 *     onStart:     () => { ... },
 *     onContinue:  () => { ... },
 *   });
 *   menu.show();
 *   // Cuando se destruya la escena:
 *   menu.destroy();
 */

// ─── ESTILOS INLINE CONSTANTES (nunca generados dinámicamente) ────────────────

const STYLES = Object.freeze({
  container: `
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0;
    padding: 2rem;
  `,
  title: `
    font-family: monospace;
    font-size: clamp(1.8rem, 4.5vw, 3rem);
    color: #4ade80;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-bottom: 0.4rem;
    text-align: center;
  `,
  subtitle: `
    font-family: monospace;
    font-size: clamp(0.7rem, 1.8vw, 0.9rem);
    color: #2a4a2a;
    letter-spacing: 0.2em;
    margin-bottom: 2.5rem;
    text-align: center;
  `,
  btnGroup: `
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
    align-items: center;
    width: 100%;
  `,
  btnBase: `
    font-family: monospace;
    font-size: clamp(0.8rem, 2vw, 1rem);
    letter-spacing: 0.15em;
    text-transform: uppercase;
    background: transparent;
    border-radius: 4px;
    padding: 0.7rem 2.5rem;
    cursor: pointer;
    min-width: 280px;
    transition: border-color 0.15s, background 0.15s;
    border: 1px solid;
  `,
  separator: `
    width: 120px;
    height: 1px;
    background: rgba(255,255,255,0.06);
    margin: 1.2rem 0 0.8rem;
  `,
  optRow: `
    display: flex;
    gap: 1.5rem;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
  `,
  optLabel: `
    font-family: monospace;
    font-size: 11px;
    color: #2a4a2a;
    display: flex;
    gap: 0.4rem;
    align-items: center;
    cursor: pointer;
    user-select: none;
  `,
  version: `
    font-family: monospace;
    font-size: 9px;
    color: #1a2a1a;
    margin-top: 1.5rem;
    letter-spacing: 0.1em;
  `,
});

// ─── CLASE PRINCIPAL ─────────────────────────────────────────────────────────

export default class MainMenu {

  /**
   * @param {Object}   opts
   * @param {string}   opts.containerId - ID del elemento DOM contenedor
   * @param {boolean}  opts.hasSave     - Si existe un guardado previo
   * @param {string}   [opts.saveDate]  - Fecha del guardado formateada
   * @param {string}   opts.gameTitle   - Título del juego
   * @param {string}   opts.gameVersion - Versión del juego
   * @param {Function} opts.onStart     - Callback "Nueva partida"
   * @param {Function} [opts.onContinue]- Callback "Continuar"
   * @param {Function} [opts.onMusicToggle] - Callback toggle música
   * @param {Function} [opts.onSfxToggle]   - Callback toggle sfx
   */
  constructor(opts) {
    this._opts      = opts;
    this._container = document.getElementById(opts.containerId);
    this._elements  = [];   // Referencias a elementos creados — para limpiar
    this._listeners = [];   // { el, type, fn } — para removeEventListener
  }

  // ─── API PÚBLICA ──────────────────────────────────────────────────────────

  /** Construye y muestra el menú */
  show() {
    if (!this._container) return;
    this._build();
    this._container.style.display = 'flex';
    this._container.style.cssText += STYLES.container;
  }

  /** Oculta el menú sin destruirlo */
  hide() {
    if (this._container) this._container.style.display = 'none';
  }

  /** Oculta y limpia todos los elementos DOM creados */
  destroy() {
    // Eliminar todos los event listeners registrados
    for (const { el, type, fn } of this._listeners) {
      el.removeEventListener(type, fn);
    }
    this._listeners = [];

    // Eliminar todos los elementos del DOM
    for (const el of this._elements) {
      if (el.parentNode) el.parentNode.removeChild(el);
    }
    this._elements = [];

    this.hide();
  }

  // ─── CONSTRUCCIÓN DOM ─────────────────────────────────────────────────────

  _build() {
    if (!this._container) return;

    // Limpiar contenido previo
    while (this._container.firstChild) {
      this._container.removeChild(this._container.firstChild);
    }
    this._elements  = [];
    this._listeners = [];

    this._buildTitle();
    this._buildButtons();
    this._buildSeparator();
    this._buildOptions();
    this._buildVersion();
  }

  _buildTitle() {
    const title = this._el('h1', STYLES.title);
    title.textContent = this._opts.gameTitle ?? 'Plastic Collapse';
    this._container.appendChild(title);

    const sub = this._el('p', STYLES.subtitle);
    sub.textContent = 'Un mundo que todavía podemos salvar';
    this._container.appendChild(sub);
  }

  _buildButtons() {
    const group = this._el('div', STYLES.btnGroup);
    this._container.appendChild(group);

    // Botón principal — Nueva partida
    const btnStart = this._createBtn(
      'Iniciar nueva partida',
      '#4ade80',
      this._opts.onStart
    );
    group.appendChild(btnStart);

    // Botón Continuar — sólo si hay guardado
    if (this._opts.hasSave && typeof this._opts.onContinue === 'function') {
      const label = this._opts.saveDate
        ? `Continuar — ${this._opts.saveDate}`
        : 'Continuar partida';

      const btnContinue = this._createBtn(label, '#60a0ff', this._opts.onContinue);
      group.appendChild(btnContinue);
    }
  }

  _buildSeparator() {
    const sep = this._el('div', STYLES.separator);
    this._container.appendChild(sep);
  }

  _buildOptions() {
    const row = this._el('div', STYLES.optRow);
    this._container.appendChild(row);

    // Toggle música
    const musicLabel = this._createToggle(
      'opt-music', 'Música', true,
      this._opts.onMusicToggle
    );
    row.appendChild(musicLabel);

    // Toggle sfx
    const sfxLabel = this._createToggle(
      'opt-sfx', 'Efectos', true,
      this._opts.onSfxToggle
    );
    row.appendChild(sfxLabel);
  }

  _buildVersion() {
    const ver = this._el('p', STYLES.version);
    ver.textContent = `v${this._opts.gameVersion ?? '1.0.0'}`;
    this._container.appendChild(ver);
  }

  // ─── HELPERS ─────────────────────────────────────────────────────────────

  /**
   * Crea un elemento DOM registrado para limpieza.
   * SEGURIDAD: createElement + cssText. Sin innerHTML.
   */
  _el(tag, cssText) {
    const el = document.createElement(tag);
    if (cssText) el.style.cssText = cssText;
    this._elements.push(el);
    return el;
  }

  /**
   * Registra un event listener para limpieza posterior.
   * SEGURIDAD: addEventListener con función — nunca string.
   */
  _listen(el, type, fn) {
    el.addEventListener(type, fn);
    this._listeners.push({ el, type, fn });
  }

  /**
   * Crea un botón de menú.
   * SEGURIDAD: textContent. Sin innerHTML.
   */
  _createBtn(label, color, onClick) {
    const btn      = this._el('button', STYLES.btnBase);
    btn.textContent = label;
    btn.style.color        = color;
    btn.style.borderColor  = color + '44';

    if (typeof onClick === 'function') {
      this._listen(btn, 'click', onClick);
    }

    this._listen(btn, 'mouseover', () => {
      btn.style.borderColor = color;
      btn.style.background  = color + '11';
    });
    this._listen(btn, 'mouseout', () => {
      btn.style.borderColor = color + '44';
      btn.style.background  = 'transparent';
    });

    return btn;
  }

  /**
   * Crea un toggle de opción (checkbox + label).
   * SEGURIDAD: textContent. Sin innerHTML.
   */
  _createToggle(id, labelText, defaultChecked, onChange) {
    const label    = this._el('label', STYLES.optLabel);
    const checkbox = this._el('input', '');
    checkbox.type    = 'checkbox';
    checkbox.checked = defaultChecked;
    checkbox.id      = id;

    if (typeof onChange === 'function') {
      this._listen(checkbox, 'change', (e) => onChange(e.target.checked));
    }

    const span = this._el('span', '');
    span.textContent = labelText;

    label.appendChild(checkbox);
    label.appendChild(span);
    return label;
  }
}