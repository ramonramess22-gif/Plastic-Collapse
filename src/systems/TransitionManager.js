/**
 * @file TransitionManager.js
 * @description Gestiona las transiciones visuales entre escenas y al entrar/salir
 *              de edificios, usando el overlay #scene-transition del DOM.
 *
 * MECANISMO:
 *   El div #scene-transition (position: absolute, z-index: 100) es un overlay
 *   negro. Sus transiciones CSS (opacity 0→1→0) crean el efecto de fade.
 *   JavaScript sólo añade/quita clases CSS — no genera animaciones JS.
 *
 * SEGURIDAD:
 *   - Sin eval(), sin new Function().
 *   - Sin setTimeout/setInterval con strings.
 *   - El delay de transición usa setTimeout con una FUNCIÓN FLECHA (seguro).
 *     setTimeout(callback, ms) donde callback es una función, no un string.
 *   - Compatible con CSP strict.
 *
 * USO:
 *   import TransitionManager from '../systems/TransitionManager.js';
 *
 *   // Fade out → cambiar escena → fade in
 *   await TransitionManager.fadeToScene(this, 'Stage2_Factory');
 *
 *   // Fade al entrar a un edificio
 *   await TransitionManager.fadeIn();
 *   // ... cambiar mapa ...
 *   await TransitionManager.fadeOut();
 */

import EventBus from './EventBus.js';
import { EVENTS, TIMING } from '../utils/Constants.js';

// ─── REFERENCIA DOM ───────────────────────────────────────────────────────────

let _overlay = null;
let _busy    = false;   // Previene transiciones simultáneas

// ─── HELPERS ──────────────────────────────────────────────────────────────────

/**
 * Cachea la referencia al overlay (se llama con lazy init).
 * @returns {HTMLElement|null}
 */
function getOverlay() {
  if (!_overlay) {
    _overlay = document.getElementById('scene-transition');
  }
  return _overlay;
}

/**
 * Envuelve setTimeout en una Promise para poder usar async/await.
 * SEGURIDAD: El primer argumento de setTimeout es una función flecha
 * (función definida), NUNCA un string — esto es seguro con CSP strict.
 *
 * @param {number} ms - Milisegundos a esperar
 * @returns {Promise<void>}
 */
function waitMs(ms) {
  return new Promise((resolve) => {
    // ✅ SEGURO: setTimeout recibe una función, no un string.
    setTimeout(resolve, ms);
  });
}

// ─── API PÚBLICA ──────────────────────────────────────────────────────────────

const TransitionManager = {

  /**
   * Fade a negro (overlay aparece).
   * Devuelve una Promise que resuelve cuando la transición termina.
   *
   * @returns {Promise<void>}
   */
  async fadeIn() {
    const overlay = getOverlay();
    if (!overlay) return;

    EventBus.emit(EVENTS.SCENE_TRANSITION_IN);
    overlay.classList.remove('fade-out');
    overlay.classList.add('fade-in');

    // Esperar la duración de la transición CSS
    await waitMs(TIMING.TRANSITION_FADE + 50); // +50ms margen
  },

  /**
   * Fade desde negro (overlay desaparece).
   * Devuelve una Promise que resuelve cuando la transición termina.
   *
   * @returns {Promise<void>}
   */
  async fadeOut() {
    const overlay = getOverlay();
    if (!overlay) return;

    EventBus.emit(EVENTS.SCENE_TRANSITION_OUT);
    overlay.classList.remove('fade-in');
    overlay.classList.add('fade-out');

    await waitMs(TIMING.TRANSITION_FADE + 50);
  },

  /**
   * Realiza una transición completa a otra escena de Phaser:
   *   1. Fade a negro
   *   2. Lanza la nueva escena
   *   3. Fade desde negro
   *
   * @param {Phaser.Scene} currentScene - La escena Phaser activa (this)
   * @param {string}       targetScene  - Clave de la escena destino (STAGES.*)
   * @param {Object}       [data]       - Datos opcionales para la nueva escena
   * @returns {Promise<void>}
   */
  async fadeToScene(currentScene, targetScene, data) {
    if (_busy) return;
    _busy = true;

    try {
      await this.fadeIn();

      // Iniciar la nueva escena y detener la actual
      currentScene.scene.start(targetScene, data ?? {});

      // El fadeOut lo llama la nueva escena en su create()
      // via TransitionManager.fadeOut()
    } finally {
      _busy = false;
    }
  },

  /**
   * Limpia el estado del overlay (útil si hay un error y queda negro).
   */
  reset() {
    const overlay = getOverlay();
    if (!overlay) return;
    overlay.classList.remove('fade-in', 'fade-out');
    overlay.style.opacity = '0';
    _busy = false;
  },

  /**
   * @returns {boolean} true si hay una transición en curso
   */
  isBusy() {
    return _busy;
  },
};

export default TransitionManager;