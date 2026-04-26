/**
 * @file HUDManager.js
 * @description Gestiona la actualización del HUD HTML superpuesto al canvas.
 *
 * Escucha eventos del EventBus y actualiza los elementos DOM:
 *   #bar-economia, #bar-contaminacion, #bar-biodiversidad, #bar-salud
 *   #val-economia, #val-contaminacion, #val-biodiversidad, #val-salud
 *   #hud-stage-number, #hud-stage-name
 *   #dialogue-container, #dialogue-speaker, #dialogue-text
 *   #interaction-hint
 *   #loading-bar, #loading-percentage, #loading-screen
 *
 * SEGURIDAD:
 *   - Usa textContent (nunca innerHTML) para datos provenientes del juego.
 *   - Sin eval(), sin new Function(), sin innerHTML con datos de usuario.
 *   - Los textos de diálogo siempre se asignan via textContent.
 *   - Compatible con CSP strict.
 *
 * USO:
 *   import HUDManager from '../systems/HUDManager.js';
 *   HUDManager.init();    // Llamar una sola vez en main.js
 *   HUDManager.destroy(); // Llamar al salir del juego
 */

import EventBus from './EventBus.js';
import {
  EVENTS, STATS, STAGES, STAGE_ORDER, STAGE_NAMES, TIMING
} from '../utils/Constants.js';

// ─── REFERENCIAS DOM (cacheadas al iniciar) ───────────────────────────────────

/**
 * Mapa de IDs DOM → referencias de elemento.
 * Se cachean en init() para evitar querySelector en cada frame.
 *
 * SEGURIDAD: getElementById no ejecuta código — sólo localiza elementos.
 */
const DOM = {
  // HUD overlay
  hudOverlay:          null,

  // Barras de stats
  barEconomia:         null,
  barContaminacion:    null,
  barBiodiversidad:    null,
  barSalud:            null,

  // Valores numéricos
  valEconomia:         null,
  valContaminacion:    null,
  valBiodiversidad:    null,
  valSalud:            null,

  // Indicador de etapa
  hudStageNumber:      null,
  hudStageName:        null,

  // Diálogo
  dialogueContainer:   null,
  dialogueSpeaker:     null,
  dialogueText:        null,

  // Indicador de interacción
  interactionHint:     null,

  // Carga
  loadingScreen:       null,
  loadingBar:          null,
  loadingPercentage:   null,
  loadingBarContainer: null,
};

// ─── ESTADO INTERNO DEL HUD ───────────────────────────────────────────────────

let _initialized = false;

// ─── HANDLERS (funciones estáticas — sin eval) ────────────────────────────────

/**
 * Actualiza una barra del HUD y su valor numérico.
 * @param {HTMLElement} barEl   - El div .hud-bar-fill
 * @param {HTMLElement} valEl   - El span .hud-stat-value
 * @param {number}      value   - 0–100
 */
function updateStatBar(barEl, valEl, value) {
  if (!barEl || !valEl) return;
  const pct = Math.round(Math.max(0, Math.min(100, value)));
  barEl.style.width = pct + '%';

  // ARIA: mantener aria-valuenow del track actualizado
  const track = barEl.parentElement;
  if (track) {
    track.setAttribute('aria-valuenow', String(pct));
  }

  // SEGURIDAD: textContent — no interpreta HTML ni JS
  valEl.textContent = String(pct);
}

/**
 * Devuelve el elemento barra y valor para una clave de stat.
 * Usa un switch estático — sin acceso dinámico a propiedades por string.
 *
 * @param {string} key - STATS.*
 * @returns {{ bar: HTMLElement|null, val: HTMLElement|null }}
 */
function getStatElements(key) {
  switch (key) {
    case STATS.ECONOMIA:
      return { bar: DOM.barEconomia, val: DOM.valEconomia };
    case STATS.CONTAMINACION:
      return { bar: DOM.barContaminacion, val: DOM.valContaminacion };
    case STATS.BIODIVERSIDAD:
      return { bar: DOM.barBiodiversidad, val: DOM.valBiodiversidad };
    case STATS.SALUD_HUMANA:
      return { bar: DOM.barSalud, val: DOM.valSalud };
    default:
      return { bar: null, val: null };
  }
}

// ─── HANDLERS DEL EVENTBUS ────────────────────────────────────────────────────

function onStatUpdate({ key, value }) {
  const { bar, val } = getStatElements(key);
  updateStatBar(bar, val, value);
}

function onStatBatchUpdate(snapshot) {
  updateStatBar(DOM.barEconomia,      DOM.valEconomia,      snapshot[STATS.ECONOMIA]);
  updateStatBar(DOM.barContaminacion, DOM.valContaminacion, snapshot[STATS.CONTAMINACION]);
  updateStatBar(DOM.barBiodiversidad, DOM.valBiodiversidad, snapshot[STATS.BIODIVERSIDAD]);
  updateStatBar(DOM.barSalud,         DOM.valSalud,         snapshot[STATS.SALUD_HUMANA]);
}

function onStageChanged({ stageKey, index }) {
  if (!DOM.hudStageNumber || !DOM.hudStageName) return;

  const humanIndex  = index + 1;
  const totalStages = STAGE_ORDER.length - 1; // Sin contar EndScene
  const stageName   = STAGE_NAMES[stageKey] ?? stageKey;

  // SEGURIDAD: textContent — nunca innerHTML
  DOM.hudStageNumber.textContent = `Etapa ${humanIndex} / ${totalStages}`;
  DOM.hudStageName.textContent   = stageName;
}

function onLoadingProgress({ percent }) {
  if (!DOM.loadingBar || !DOM.loadingPercentage) return;
  const pct = Math.round(Math.max(0, Math.min(100, percent)));
  DOM.loadingBar.style.width      = pct + '%';
  DOM.loadingPercentage.textContent = pct + '%';

  if (DOM.loadingBarContainer) {
    DOM.loadingBarContainer.setAttribute('aria-valuenow', String(pct));
  }
}

function onLoadingComplete() {
  if (!DOM.loadingScreen) return;
  DOM.loadingScreen.classList.add('hidden');

  // Mostrar el HUD una vez cargado el juego
  if (DOM.hudOverlay) {
    DOM.hudOverlay.style.display = 'block';
  }
}

function onInteractionShow({ x, y }) {
  if (!DOM.interactionHint) return;
  DOM.interactionHint.style.display = 'block';
  DOM.interactionHint.style.left    = Math.round(x - 16) + 'px';
  DOM.interactionHint.style.top     = Math.round(y - 40) + 'px';
}

function onInteractionHide() {
  if (!DOM.interactionHint) return;
  DOM.interactionHint.style.display = 'none';
}

// ─── API PÚBLICA ──────────────────────────────────────────────────────────────

const HUDManager = {

  /**
   * Inicializa el HUDManager:
   *   1. Cachea todas las referencias DOM.
   *   2. Suscribe los handlers al EventBus.
   *
   * Debe llamarse UNA SOLA VEZ desde main.js, antes de que las escenas
   * empiecen a emitir eventos.
   */
  init() {
    if (_initialized) {
      console.warn('[HUDManager] Ya fue inicializado.');
      return;
    }

    // Cachear referencias DOM — getElementBy*Id es seguro, no ejecuta código
    DOM.hudOverlay          = document.getElementById('hud-overlay');
    DOM.barEconomia         = document.getElementById('bar-economia');
    DOM.barContaminacion    = document.getElementById('bar-contaminacion');
    DOM.barBiodiversidad    = document.getElementById('bar-biodiversidad');
    DOM.barSalud            = document.getElementById('bar-salud');
    DOM.valEconomia         = document.getElementById('val-economia');
    DOM.valContaminacion    = document.getElementById('val-contaminacion');
    DOM.valBiodiversidad    = document.getElementById('val-biodiversidad');
    DOM.valSalud            = document.getElementById('val-salud');
    DOM.hudStageNumber      = document.getElementById('hud-stage-number');
    DOM.hudStageName        = document.getElementById('hud-stage-name');
    DOM.dialogueContainer   = document.getElementById('dialogue-container');
    DOM.dialogueSpeaker     = document.getElementById('dialogue-speaker');
    DOM.dialogueText        = document.getElementById('dialogue-text');
    DOM.interactionHint     = document.getElementById('interaction-hint');
    DOM.loadingScreen       = document.getElementById('loading-screen');
    DOM.loadingBar          = document.getElementById('loading-bar');
    DOM.loadingPercentage   = document.getElementById('loading-percentage');
    DOM.loadingBarContainer = document.getElementById('loading-bar-container');

    // Suscribir handlers con contexto null (son funciones puras)
    EventBus.on(EVENTS.STAT_UPDATE,       onStatUpdate);
    EventBus.on(EVENTS.STAT_BATCH_UPDATE, onStatBatchUpdate);
    EventBus.on(EVENTS.STAGE_CHANGED,     onStageChanged);
    EventBus.on(EVENTS.LOADING_PROGRESS,  onLoadingProgress);
    EventBus.on(EVENTS.LOADING_COMPLETE,  onLoadingComplete);
    EventBus.on(EVENTS.INTERACTION_SHOW,  onInteractionShow);
    EventBus.on(EVENTS.INTERACTION_HIDE,  onInteractionHide);

    _initialized = true;
    console.info('[HUDManager] Inicializado.');
  },

  /**
   * Muestra el diálogo de un NPC.
   * SEGURIDAD: speaker y text se asignan via textContent — nunca innerHTML.
   *
   * @param {string} speaker - Nombre del hablante
   * @param {string} text    - Línea de diálogo a mostrar
   */
  showDialogue(speaker, text) {
    if (!DOM.dialogueContainer) return;

    // SEGURIDAD: textContent previene XSS si los textos vienen de fuentes
    // externas. En este proyecto los textos son constantes de dialogues.js,
    // pero la práctica se mantiene para consistencia y seguridad por capas.
    if (DOM.dialogueSpeaker) DOM.dialogueSpeaker.textContent = speaker;
    if (DOM.dialogueText)    DOM.dialogueText.textContent    = text;

    DOM.dialogueContainer.style.display = 'block';
  },

  /**
   * Oculta la caja de diálogo.
   */
  hideDialogue() {
    if (!DOM.dialogueContainer) return;
    DOM.dialogueContainer.style.display = 'none';
    if (DOM.dialogueSpeaker) DOM.dialogueSpeaker.textContent = '';
    if (DOM.dialogueText)    DOM.dialogueText.textContent    = '';
  },

  /**
   * Actualiza el texto del diálogo sin cambiar el hablante.
   * Usado por DialogueSystem para el efecto typewriter.
   * SEGURIDAD: textContent — nunca innerHTML.
   *
   * @param {string} text - Texto a mostrar (parcial en typewriter)
   */
  updateDialogueText(text) {
    if (DOM.dialogueText) {
      DOM.dialogueText.textContent = text;
    }
  },

  /**
   * Desuscribe todos los handlers del EventBus.
   * Llamar cuando el juego se destruya para evitar memory leaks.
   */
  destroy() {
    EventBus.off(EVENTS.STAT_UPDATE,       onStatUpdate);
    EventBus.off(EVENTS.STAT_BATCH_UPDATE, onStatBatchUpdate);
    EventBus.off(EVENTS.STAGE_CHANGED,     onStageChanged);
    EventBus.off(EVENTS.LOADING_PROGRESS,  onLoadingProgress);
    EventBus.off(EVENTS.LOADING_COMPLETE,  onLoadingComplete);
    EventBus.off(EVENTS.INTERACTION_SHOW,  onInteractionShow);
    EventBus.off(EVENTS.INTERACTION_HIDE,  onInteractionHide);

    _initialized = false;
    console.info('[HUDManager] Destruido.');
  },
};

export default HUDManager;