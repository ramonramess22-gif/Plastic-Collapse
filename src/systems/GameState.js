/**
 * @file GameState.js
 * @description Singleton del estado global del juego.
 *
 * Gestiona las 4 variables del sistema:
 *   - economia      (0–100)  Salud económica global
 *   - contaminacion (0–100)  Nivel acumulado de contaminación
 *   - biodiversidad (0–100)  Riqueza de especies y ecosistemas
 *   - salud_humana  (0–100)  Bienestar de la población
 *
 * Y el estado narrativo:
 *   - currentStage   Escena activa (clave STAGES.*)
 *   - stageIndex     Índice numérico (0–7)
 *   - visitedStages  Set de escenas ya visitadas
 *
 * SEGURIDAD:
 *   - Sin eval(), sin new Function(), sin setTimeout con strings.
 *   - Los valores se validan siempre con clamp() antes de aplicarse.
 *   - Sin acceso directo a las propiedades privadas desde fuera del módulo.
 *   - Compatible con CSP strict.
 *
 * USO:
 *   import GameState from '../systems/GameState.js';
 *
 *   GameState.setStat('contaminacion', 45);
 *   GameState.modifyStat('biodiversidad', -10);
 *   const val = GameState.getStat('economia');   // → número
 *   const snap = GameState.getSnapshot();         // → objeto plano
 */

import EventBus          from './EventBus.js';
import { EVENTS, STATS, STATS_INITIAL, STATS_BOUNDS, STAGES, STAGE_ORDER }
  from '../utils/Constants.js';

// ─── ESTADO INTERNO (privado al módulo) ───────────────────────────────────────

/**
 * Objeto de estado interno.
 * No se exporta directamente — sólo se accede via los métodos del GameState.
 * Esto previene mutaciones accidentales desde otros módulos.
 */
const _state = {
  // Variables del sistema
  [STATS.ECONOMIA]:      STATS_INITIAL[STATS.ECONOMIA],
  [STATS.CONTAMINACION]: STATS_INITIAL[STATS.CONTAMINACION],
  [STATS.BIODIVERSIDAD]: STATS_INITIAL[STATS.BIODIVERSIDAD],
  [STATS.SALUD_HUMANA]:  STATS_INITIAL[STATS.SALUD_HUMANA],

  // Estado narrativo
  currentStage:  STAGES.STAGE_1,
  stageIndex:    0,
  visitedStages: new Set(),

  // Flags de juego
  gameStarted:   false,
  gameEnded:     false,
};

// ─── UTILIDAD INTERNA ─────────────────────────────────────────────────────────

/**
 * Limita un número al rango [min, max].
 * Operación aritmética pura — sin eval ni código dinámico.
 *
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/**
 * Verifica que una clave sea una stat válida.
 * @param {string} key
 * @returns {boolean}
 */
function isValidStat(key) {
  return Object.values(STATS).includes(key);
}

// ─── API PÚBLICA DEL GAMESTATE ───────────────────────────────────────────────

const GameState = {

  // ── LECTURA ────────────────────────────────────────────────────────────────

  /**
   * Devuelve el valor actual de una stat.
   * @param {string} key - Una de las claves STATS.*
   * @returns {number}
   */
  getStat(key) {
    if (!isValidStat(key)) {
      console.warn(`[GameState] getStat: clave desconocida "${key}"`);
      return 0;
    }
    return _state[key];
  },

  /**
   * Devuelve el nombre de la escena activa.
   * @returns {string}
   */
  getCurrentStage() {
    return _state.currentStage;
  },

  /**
   * Devuelve el índice numérico de la etapa actual (0–7).
   * @returns {number}
   */
  getStageIndex() {
    return _state.stageIndex;
  },

  /**
   * Devuelve un snapshot plano del estado (para SaveSystem y debugging).
   * El objeto devuelto es una copia — no una referencia al estado interno.
   * @returns {Object}
   */
  getSnapshot() {
    return {
      [STATS.ECONOMIA]:      _state[STATS.ECONOMIA],
      [STATS.CONTAMINACION]: _state[STATS.CONTAMINACION],
      [STATS.BIODIVERSIDAD]: _state[STATS.BIODIVERSIDAD],
      [STATS.SALUD_HUMANA]:  _state[STATS.SALUD_HUMANA],
      currentStage:          _state.currentStage,
      stageIndex:            _state.stageIndex,
      visitedStages:         [..._state.visitedStages],
      gameStarted:           _state.gameStarted,
      gameEnded:             _state.gameEnded,
    };
  },

  // ── ESCRITURA ──────────────────────────────────────────────────────────────

  /**
   * Establece el valor absoluto de una stat y emite STAT_UPDATE.
   * El valor se valida con clamp() antes de aplicarse.
   *
   * @param {string} key   - Clave STATS.*
   * @param {number} value - Nuevo valor (se clampea a 0–100)
   */
  setStat(key, value) {
    if (!isValidStat(key)) {
      console.warn(`[GameState] setStat: clave desconocida "${key}"`);
      return;
    }
    const clamped = clamp(Number(value), STATS_BOUNDS.MIN, STATS_BOUNDS.MAX);
    _state[key] = clamped;
    EventBus.emit(EVENTS.STAT_UPDATE, { key, value: clamped });
  },

  /**
   * Modifica una stat por un delta (positivo o negativo).
   * El resultado se clampea automáticamente a 0–100.
   *
   * @param {string} key   - Clave STATS.*
   * @param {number} delta - Cantidad a sumar (negativa para restar)
   *
   * @example
   *   GameState.modifyStat(STATS.CONTAMINACION, +15);  // sube 15
   *   GameState.modifyStat(STATS.BIODIVERSIDAD, -10);  // baja 10
   */
  modifyStat(key, delta) {
    if (!isValidStat(key)) {
      console.warn(`[GameState] modifyStat: clave desconocida "${key}"`);
      return;
    }
    const current = _state[key];
    this.setStat(key, current + Number(delta));
  },

  /**
   * Actualiza múltiples stats en una sola operación.
   * Emite STAT_BATCH_UPDATE con el snapshot completo al finalizar.
   *
   * @param {Object} updates - { economia: 80, contaminacion: 30, ... }
   *
   * @example
   *   GameState.batchUpdate({ contaminacion: 40, biodiversidad: 60 });
   */
  batchUpdate(updates) {
    for (const [key, value] of Object.entries(updates)) {
      if (isValidStat(key)) {
        _state[key] = clamp(Number(value), STATS_BOUNDS.MIN, STATS_BOUNDS.MAX);
      }
    }
    // Emitir un solo evento con el estado completo actualizado
    EventBus.emit(EVENTS.STAT_BATCH_UPDATE, this.getSnapshot());
  },

  /**
   * Actualiza la etapa narrativa actual.
   * Emite STAGE_CHANGED para que HUDManager actualice el indicador de etapa.
   *
   * @param {string} stageKey - Una de las claves STAGES.*
   */
  setCurrentStage(stageKey) {
    const index = STAGE_ORDER.indexOf(stageKey);
    _state.currentStage = stageKey;
    _state.stageIndex   = index >= 0 ? index : 0;
    _state.visitedStages.add(stageKey);

    EventBus.emit(EVENTS.STAGE_CHANGED, {
      stageKey,
      index: _state.stageIndex,
    });
  },

  /**
   * Marca el juego como iniciado.
   */
  startGame() {
    _state.gameStarted = true;
    _state.gameEnded   = false;
  },

  /**
   * Marca el juego como terminado.
   */
  endGame() {
    _state.gameEnded = true;
  },

  // ── RESTAURACIÓN ──────────────────────────────────────────────────────────

  /**
   * Restaura el estado desde un snapshot (usado por SaveSystem al cargar).
   * Valida cada campo antes de aplicarlo — nunca ejecuta código del snapshot.
   *
   * @param {Object} snapshot - Objeto plano guardado en localStorage
   */
  loadFromSnapshot(snapshot) {
    if (!snapshot || typeof snapshot !== 'object') {
      console.warn('[GameState] loadFromSnapshot: snapshot inválido');
      return;
    }

    // Restaurar stats con validación
    for (const key of Object.values(STATS)) {
      if (typeof snapshot[key] === 'number') {
        _state[key] = clamp(snapshot[key], STATS_BOUNDS.MIN, STATS_BOUNDS.MAX);
      }
    }

    // Restaurar estado narrativo con validación de tipos
    if (typeof snapshot.currentStage === 'string') {
      _state.currentStage = snapshot.currentStage;
    }
    if (typeof snapshot.stageIndex === 'number') {
      _state.stageIndex = clamp(snapshot.stageIndex, 0, STAGE_ORDER.length - 1);
    }
    if (Array.isArray(snapshot.visitedStages)) {
      _state.visitedStages = new Set(
        snapshot.visitedStages.filter((s) => typeof s === 'string')
      );
    }
    if (typeof snapshot.gameStarted === 'boolean') {
      _state.gameStarted = snapshot.gameStarted;
    }

    // Emitir batch update para sincronizar el HUD
    EventBus.emit(EVENTS.STAT_BATCH_UPDATE, this.getSnapshot());
  },

  /**
   * Resetea el estado a los valores iniciales.
   * Llamado por SaveSystem.resetSave() y el botón "Nueva partida".
   */
  reset() {
    _state[STATS.ECONOMIA]      = STATS_INITIAL[STATS.ECONOMIA];
    _state[STATS.CONTAMINACION] = STATS_INITIAL[STATS.CONTAMINACION];
    _state[STATS.BIODIVERSIDAD] = STATS_INITIAL[STATS.BIODIVERSIDAD];
    _state[STATS.SALUD_HUMANA]  = STATS_INITIAL[STATS.SALUD_HUMANA];

    _state.currentStage  = STAGES.STAGE_1;
    _state.stageIndex    = 0;
    _state.visitedStages = new Set();
    _state.gameStarted   = false;
    _state.gameEnded     = false;

    EventBus.emit(EVENTS.GAME_RESET);
    EventBus.emit(EVENTS.STAT_BATCH_UPDATE, this.getSnapshot());
  },
};

export default GameState;