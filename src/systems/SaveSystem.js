/**
 * @file SaveSystem.js
 * @description Sistema de guardado y carga usando localStorage.
 *
 * SEGURIDAD — CRÍTICO:
 *   - Usa JSON.parse() / JSON.stringify() ÚNICAMENTE con datos estructurados.
 *   - NUNCA usa eval() para parsear datos del localStorage.
 *   - NUNCA ejecuta ningún valor leído del localStorage como código.
 *   - Valida la estructura del objeto cargado antes de pasarlo a GameState.
 *   - Compatible con CSP strict (sin script injection posible).
 *
 * MECANISMO DE SEGURIDAD vs. DATOS MALICIOSOS:
 *   Si alguien modifica manualmente el localStorage, validateSnapshot()
 *   filtra campos desconocidos y convierte tipos forzosamente.
 *   Ningún valor del storage puede ejecutar código porque nunca se
 *   llama eval() ni new Function() con esos datos.
 *
 * USO:
 *   import SaveSystem from '../systems/SaveSystem.js';
 *
 *   SaveSystem.save();           // Guarda el estado actual
 *   const ok = SaveSystem.load(); // Carga y devuelve true si había guardado
 *   SaveSystem.hasSave();        // true si existe guardado
 *   SaveSystem.deleteSave();     // Borra el guardado
 */

import EventBus  from './EventBus.js';
import GameState from './GameState.js';
import { EVENTS, GAME, STATS } from '../utils/Constants.js';

// ─── SCHEMA DE VALIDACIÓN ─────────────────────────────────────────────────────

/**
 * Campos permitidos en un snapshot guardado, con sus tipos esperados.
 * Cualquier campo no listado aquí es ignorado al cargar.
 *
 * SEGURIDAD: Esta lista blanca (allowlist) previene que datos extraños
 * inyectados en localStorage afecten al estado del juego.
 */
const SNAPSHOT_SCHEMA = Object.freeze({
  [STATS.ECONOMIA]:      'number',
  [STATS.CONTAMINACION]: 'number',
  [STATS.BIODIVERSIDAD]: 'number',
  [STATS.SALUD_HUMANA]:  'number',
  currentStage:          'string',
  stageIndex:            'number',
  visitedStages:         'array',
  gameStarted:           'boolean',
  gameEnded:             'boolean',
  savedAt:               'number',    // timestamp (Date.now())
  version:               'string',    // versión del juego al guardar
});

// ─── VALIDACIÓN ───────────────────────────────────────────────────────────────

/**
 * Valida y sanitiza un objeto cargado desde localStorage.
 * Devuelve un objeto limpio con sólo los campos del schema.
 *
 * @param {*} raw - Objeto parseado de JSON.parse()
 * @returns {Object|null} Snapshot sanitizado, o null si es inválido
 */
function validateSnapshot(raw) {
  // Si no es un objeto plano, rechazar
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return null;
  }

  const clean = {};

  for (const [field, expectedType] of Object.entries(SNAPSHOT_SCHEMA)) {
    const value = raw[field];

    if (value === undefined || value === null) {
      // Campo ausente — se saltará; GameState usará el default
      continue;
    }

    switch (expectedType) {
      case 'number':
        // Convertir a número y verificar que sea finito
        if (typeof value === 'number' && isFinite(value)) {
          clean[field] = value;
        }
        break;

      case 'string':
        // Sólo aceptar strings puros
        if (typeof value === 'string') {
          clean[field] = value;
        }
        break;

      case 'boolean':
        if (typeof value === 'boolean') {
          clean[field] = value;
        }
        break;

      case 'array':
        // Sólo arrays de strings
        if (Array.isArray(value)) {
          clean[field] = value.filter((item) => typeof item === 'string');
        }
        break;

      default:
        // Tipo desconocido — ignorar por seguridad
        break;
    }
  }

  return clean;
}

// ─── SISTEMA DE GUARDADO ──────────────────────────────────────────────────────

const SaveSystem = {

  /**
   * Guarda el estado actual del juego en localStorage.
   * Emite EVENTS.GAME_SAVE al completar.
   *
   * @returns {boolean} true si el guardado fue exitoso
   */
  save() {
    try {
      const snapshot = GameState.getSnapshot();

      // Añadir metadatos de guardado
      snapshot.savedAt  = Date.now();
      snapshot.version  = GAME.VERSION;

      // SEGURIDAD: JSON.stringify convierte a texto seguro.
      // Nunca usamos datos del snapshot para construir código.
      const serialized = JSON.stringify(snapshot);

      localStorage.setItem(GAME.SAVE_KEY, serialized);
      EventBus.emit(EVENTS.GAME_SAVE);

      console.info('[SaveSystem] Partida guardada.');
      return true;

    } catch (error) {
      // localStorage puede lanzar en modo privado o si está lleno
      console.warn('[SaveSystem] Error al guardar:', error.message);
      return false;
    }
  },

  /**
   * Carga el estado guardado desde localStorage y lo aplica a GameState.
   * Emite EVENTS.GAME_LOAD si el proceso fue exitoso.
   *
   * @returns {boolean} true si había un guardado válido y se cargó
   */
  load() {
    try {
      const raw = localStorage.getItem(GAME.SAVE_KEY);

      if (!raw) {
        console.info('[SaveSystem] No se encontró partida guardada.');
        return false;
      }

      // SEGURIDAD: JSON.parse sólo construye estructuras de datos (Object,
      // Array, string, number, boolean, null). NUNCA ejecuta código.
      // No usamos eval() ni new Function() para parsear.
      let parsed;
      try {
        parsed = JSON.parse(raw);
      } catch {
        console.warn('[SaveSystem] El guardado está corrupto (JSON inválido). Borrando.');
        this.deleteSave();
        return false;
      }

      // Validar y sanitizar antes de aplicar
      const snapshot = validateSnapshot(parsed);

      if (!snapshot) {
        console.warn('[SaveSystem] Snapshot inválido. Borrando guardado corrupto.');
        this.deleteSave();
        return false;
      }

      // Verificar compatibilidad de versión (opcional — aviso pero no bloquea)
      if (snapshot.version && snapshot.version !== GAME.VERSION) {
        console.warn(
          `[SaveSystem] Versión del guardado (${snapshot.version}) ` +
          `difiere de la versión actual (${GAME.VERSION}). ` +
          `Cargando de todas formas.`
        );
      }

      GameState.loadFromSnapshot(snapshot);
      EventBus.emit(EVENTS.GAME_LOAD);

      console.info('[SaveSystem] Partida cargada exitosamente.');
      return true;

    } catch (error) {
      console.warn('[SaveSystem] Error inesperado al cargar:', error.message);
      return false;
    }
  },

  /**
   * Comprueba si existe un guardado sin cargarlo.
   * @returns {boolean}
   */
  hasSave() {
    try {
      return localStorage.getItem(GAME.SAVE_KEY) !== null;
    } catch {
      return false;
    }
  },

  /**
   * Elimina el guardado del localStorage.
   * Llamado por "Nueva partida" o cuando el guardado está corrupto.
   */
  deleteSave() {
    try {
      localStorage.removeItem(GAME.SAVE_KEY);
      console.info('[SaveSystem] Guardado eliminado.');
    } catch (error) {
      console.warn('[SaveSystem] Error al eliminar guardado:', error.message);
    }
  },

  /**
   * Borra el guardado y resetea GameState a valores iniciales.
   * Usado por el botón "Nueva partida".
   */
  resetSave() {
    this.deleteSave();
    GameState.reset();
  },

  /**
   * Devuelve los metadatos del guardado (fecha, versión) sin cargarlo.
   * Útil para mostrar "Continuar — guardado el DD/MM/YYYY" en el menú.
   *
   * @returns {{ savedAt: Date|null, version: string|null }}
   */
  getSaveMetadata() {
    try {
      const raw = localStorage.getItem(GAME.SAVE_KEY);
      if (!raw) return { savedAt: null, version: null };

      const parsed = JSON.parse(raw);
      return {
        savedAt: typeof parsed.savedAt === 'number'
          ? new Date(parsed.savedAt)
          : null,
        version: typeof parsed.version === 'string'
          ? parsed.version
          : null,
      };
    } catch {
      return { savedAt: null, version: null };
    }
  },
};

export default SaveSystem;