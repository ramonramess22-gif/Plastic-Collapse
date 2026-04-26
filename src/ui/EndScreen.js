/**
 * @file ui/EndScreen.js
 * @description Componente de construcción DOM para la pantalla final.
 *
 * Separa la lógica de construcción de EndScene.js para mayor modularidad.
 * EndScene crea una instancia de EndScreen y delega el renderizado DOM.
 *
 * CONTENIDO:
 *   1. Mensaje principal obligatorio: "Si no hay cambios, este será nuestro futuro"
 *   2. Panel de estadísticas finales del jugador
 *   3. Gráfico visual del colapso (barras de stats con colores críticos)
 *   4. Mensaje de cierre esperanzador
 *   5. Botón "Volver al inicio"
 *
 * SEGURIDAD:
 *   - textContent en todos los textos dinámicos — nunca innerHTML.
 *   - Sin eval(), sin new Function().
 *   - Compatible con CSP strict.
 *
 * USO:
 *   import EndScreen from '../ui/EndScreen.js';
 *   const screen = new EndScreen({
 *     containerId: 'end-screen-overlay',
 *     snapshot:    GameState.getSnapshot(),
 *     onRestart:   () => { ... },
 *   });
 *   screen.show();
 */

import { STATS } from '../utils/Constants.js';

// ─── DEFINICIÓN DE STATS PARA LA PANTALLA FINAL ───────────────────────────────

const STAT_DISPLAY = Object.freeze([
  { key: STATS.ECONOMIA,      label: 'Economía global',     color: '#22c55e', icon: '◆' },
  { key: STATS.CONTAMINACION, label: 'Contaminación',        color: '#ef4444', icon: '☠' },
  { key: STATS.BIODIVERSIDAD, label: 'Biodiversidad',        color: '#06b6d4', icon: '◈' },
  { key: STATS.SALUD_HUMANA,  label: 'Salud humana',         color: '#3b82f6', icon: '♥' },
]);

export default class EndScreen {

  /**
   * @param {Object}   opts
   * @param {string}   opts.containerId - ID del contenedor DOM
   * @param {Object}   opts.snapshot    - GameState.getSnapshot()
   * @param {Function} opts.onRestart   - Callback al hacer click en "Volver al inicio"
   */
  constructor(opts) {
    this._opts      = opts;
    this._container = document.getElementById(opts.containerId);
    this._elements  = [];
    this._listeners = [];
  }

  // ─── API PÚBLICA ──────────────────────────────────────────────────────────

  show() {
    if (!this._container) return;
    this._build();
    this._container.style.display        = 'flex';
    this._container.style.flexDirection  = 'column';
    this._container.style.alignItems     = 'center';
    this._container.style.justifyContent = 'center';
    this._container.style.padding        = '2rem';
    this._container.style.gap            = '0';
  }

  hide() {
    if (this._container) this._container.style.display = 'none';
  }

  destroy() {
    for (const { el, type, fn } of this._listeners) {
      el.removeEventListener(type, fn);
    }
    for (const el of this._elements) {
      if (el.parentNode) el.parentNode.removeChild(el);
    }
    this._elements  = [];
    this._listeners = [];
    this.hide();
  }

  // ─── CONSTRUCCIÓN ─────────────────────────────────────────────────────────

  _build() {
    if (!this._container) return;

    while (this._container.firstChild) {
      this._container.removeChild(this._container.firstChild);
    }
    this._elements  = [];
    this._listeners = [];

    this._buildMainMessage();
    this._buildSubMessage();
    this._buildStatsChart();
    this._buildCloseMessage();
    this._buildButtons();
  }

  _buildMainMessage() {
    const p = this._el('p');
    p.textContent = 'Si no hay cambios, este será nuestro futuro.';
    p.style.cssText = `
      font-family: monospace;
      font-size: clamp(1rem, 3vw, 1.6rem);
      color: #cc2222;
      text-align: center;
      letter-spacing: 0.06em;
      line-height: 1.5;
      max-width: 680px;
      margin-bottom: 0.8rem;
      opacity: 0;
      transition: opacity 1.4s ease-in;
    `;
    this._container.appendChild(p);
    // Trigger del fade in
    requestAnimationFrame(() => { p.style.opacity = '1'; });
  }

  _buildSubMessage() {
    const p = this._el('p');
    p.textContent = 'No es ciencia ficción. Es la proyección directa de las tendencias actuales.';
    p.style.cssText = `
      font-family: monospace;
      font-size: clamp(0.7rem, 1.8vw, 0.9rem);
      color: #5a2222;
      text-align: center;
      letter-spacing: 0.08em;
      line-height: 1.7;
      max-width: 540px;
      margin-bottom: 1.8rem;
      opacity: 0;
      transition: opacity 1.4s ease-in 0.7s;
    `;
    this._container.appendChild(p);
    requestAnimationFrame(() => { p.style.opacity = '1'; });
  }

  _buildStatsChart() {
    const snap = this._opts.snapshot ?? {};

    const chart = this._el('div');
    chart.style.cssText = `
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.8rem 2.5rem;
      background: rgba(12, 0, 0, 0.55);
      border: 1px solid rgba(100,0,0,0.3);
      border-radius: 8px;
      padding: 1.2rem 2rem;
      margin-bottom: 1.5rem;
      opacity: 0;
      transition: opacity 1.4s ease-in 1.2s;
      width: 100%;
      max-width: 500px;
    `;
    this._container.appendChild(chart);
    requestAnimationFrame(() => { chart.style.opacity = '1'; });

    for (const def of STAT_DISPLAY) {
      const value = Math.round(snap[def.key] ?? 0);

      // Fila de stat
      const row = this._el('div');
      row.style.cssText = 'display:flex;flex-direction:column;gap:5px;';

      // Etiqueta + icono
      const header = this._el('div');
      header.style.cssText = `
        display: flex;
        align-items: center;
        gap: 5px;
        font-family: monospace;
        font-size: 10px;
        color: #555;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      `;

      const icon = this._el('span');
      icon.textContent    = def.icon;
      icon.style.color    = def.color;
      icon.style.fontSize = '12px';

      const lbl = this._el('span');
      lbl.textContent = def.label;

      header.appendChild(icon);
      header.appendChild(lbl);

      // Barra visual
      const track = this._el('div');
      track.style.cssText = `
        height: 5px;
        background: rgba(255,255,255,0.06);
        border-radius: 3px;
        overflow: hidden;
      `;

      const fill = this._el('div');
      fill.style.cssText = `
        height: 100%;
        width: 0%;
        border-radius: 3px;
        background: ${def.color};
        transition: width 1.2s ease-out 1.5s;
      `;
      track.appendChild(fill);

      // Animamos la barra
      requestAnimationFrame(() => {
        fill.style.width = value + '%';
      });

      // Valor numérico
      const val = this._el('div');
      val.textContent = String(value) + '%';
      val.style.cssText = `
        font-family: monospace;
        font-size: 1.1rem;
        color: ${def.color};
        line-height: 1;
      `;

      row.appendChild(header);
      row.appendChild(track);
      row.appendChild(val);
      chart.appendChild(row);
    }
  }

  _buildCloseMessage() {
    const p = this._el('p');
    p.textContent = 'Aún estás a tiempo de que este mundo sea diferente.';
    p.style.cssText = `
      font-family: monospace;
      font-size: clamp(0.75rem, 1.8vw, 0.9rem);
      color: #226622;
      text-align: center;
      letter-spacing: 0.1em;
      margin-bottom: 1.8rem;
      opacity: 0;
      transition: opacity 1.4s ease-in 2s;
    `;
    this._container.appendChild(p);
    requestAnimationFrame(() => { p.style.opacity = '1'; });
  }

  _buildButtons() {
    const group = this._el('div');
    group.style.cssText = 'display:flex;gap:1rem;flex-wrap:wrap;justify-content:center;';
    this._container.appendChild(group);

    const btn = this._createBtn('Volver al inicio', '#4ade80', this._opts.onRestart);
    group.appendChild(btn);
  }

  // ─── HELPERS ─────────────────────────────────────────────────────────────

  _el(tag) {
    const el = document.createElement(tag);
    this._elements.push(el);
    return el;
  }

  _listen(el, type, fn) {
    el.addEventListener(type, fn);
    this._listeners.push({ el, type, fn });
  }

  _createBtn(label, color, onClick) {
    const btn = this._el('button');
    btn.textContent = label;
    btn.style.cssText = `
      font-family: monospace;
      font-size: 0.85rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: ${color};
      background: transparent;
      border: 1px solid ${color}44;
      border-radius: 4px;
      padding: 0.6rem 1.8rem;
      cursor: pointer;
      transition: border-color 0.15s, background 0.15s;
    `;

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
}