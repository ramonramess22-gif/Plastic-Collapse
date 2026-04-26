/**
 * @file EventBus.js
 * @description Singleton de comunicación desacoplada entre módulos del juego.
 *
 * PATRÓN:
 *   Pub/Sub (Publisher-Subscriber) usando Phaser.Events.EventEmitter.
 *   Permite que GameState, HUDManager, escenas y entidades se comuniquen
 *   sin importarse directamente entre sí.
 *
 * SEGURIDAD:
 *   - Sin eval(), sin new Function(), sin setTimeout con strings.
 *   - Todos los nombres de evento son constantes importadas de Constants.js.
 *   - Los listeners son funciones definidas estáticamente — nunca strings.
 *   - Compatible con CSP strict.
 *
 * USO:
 *   import EventBus from '../systems/EventBus.js';
 *   import { EVENTS } from '../utils/Constants.js';
 *
 *   // Emitir un evento:
 *   EventBus.emit(EVENTS.STAT_UPDATE, { key: 'economia', value: 80 });
 *
 *   // Escuchar un evento (con limpieza al destruir la escena):
 *   EventBus.on(EVENTS.STAT_UPDATE, this.handleStatUpdate, this);
 *   // En destroy(): EventBus.off(EVENTS.STAT_UPDATE, this.handleStatUpdate, this);
 *
 * ADVERTENCIA SOBRE MEMORY LEAKS:
 *   Siempre llama EventBus.off() en el método destroy() o shutdown() de
 *   cualquier escena o clase que suscriba listeners. De lo contrario,
 *   los listeners se acumulan entre cambios de escena.
 */

// ─── SINGLETON ────────────────────────────────────────────────────────────────

/**
 * Instancia única del EventEmitter de Phaser.
 *
 * Usamos Phaser.Events.EventEmitter en lugar de implementar uno propio
 * porque ya viene incluido en Phaser, es estable y tiene soporte de contexto
 * (el tercer argumento de on/off) que previene problemas de binding manual.
 *
 * NOTA: window.Phaser debe estar disponible porque index.html carga
 * phaser.min.js antes del módulo main.js. Si por alguna razón Phaser no
 * está disponible, se usa el EventEmitter mínimo interno definido abajo.
 */
let emitter;

if (typeof window !== 'undefined' && window.Phaser) {
  emitter = new window.Phaser.Events.EventEmitter();
} else {
  // Fallback mínimo para entornos sin Phaser (tests unitarios, Node.js)
  emitter = createMinimalEmitter();
}

// ─── FALLBACK EMITTER (para tests / entornos sin Phaser) ─────────────────────

/**
 * Implementación mínima y segura de EventEmitter.
 * No usa eval(), no usa strings como código.
 *
 * @returns {Object} Objeto con on, off, emit, removeAllListeners
 */
function createMinimalEmitter() {
  /** @type {Map<string, Array<{fn: Function, ctx: any}>>} */
  const listeners = new Map();

  return {
    /**
     * Suscribe una función a un evento.
     * @param {string}   eventName - Nombre del evento (usar constante EVENTS.*)
     * @param {Function} fn        - Handler (función definida, nunca string)
     * @param {*}        [ctx]     - Contexto (this) para el handler
     */
    on(eventName, fn, ctx) {
      if (!listeners.has(eventName)) {
        listeners.set(eventName, []);
      }
      listeners.get(eventName).push({ fn, ctx });
      return this;
    },

    /**
     * Desuscribe una función de un evento.
     * @param {string}   eventName
     * @param {Function} fn
     * @param {*}        [ctx]
     */
    off(eventName, fn, ctx) {
      if (!listeners.has(eventName)) return this;
      const filtered = listeners.get(eventName).filter(
        (entry) => !(entry.fn === fn && entry.ctx === ctx)
      );
      listeners.set(eventName, filtered);
      return this;
    },

    /**
     * Emite un evento con datos opcionales.
     * @param {string} eventName
     * @param {...*}   args
     */
    emit(eventName, ...args) {
      if (!listeners.has(eventName)) return this;
      // Copiamos el array antes de iterar para evitar mutaciones durante emit
      const entries = [...listeners.get(eventName)];
      for (const { fn, ctx } of entries) {
        fn.apply(ctx ?? null, args);
      }
      return this;
    },

    /**
     * Elimina todos los listeners de un evento (o todos si no se especifica).
     * @param {string} [eventName]
     */
    removeAllListeners(eventName) {
      if (eventName) {
        listeners.delete(eventName);
      } else {
        listeners.clear();
      }
      return this;
    },

    /** Alias de on() para compatibilidad con la API de Phaser */
    addListener(eventName, fn, ctx) {
      return this.on(eventName, fn, ctx);
    },

    /** Alias de off() para compatibilidad */
    removeListener(eventName, fn, ctx) {
      return this.off(eventName, fn, ctx);
    },
  };
}

// ─── EXPORT ───────────────────────────────────────────────────────────────────

/**
 * El EventBus es un singleton: la misma instancia en todos los módulos.
 * Cualquier import de este archivo devuelve el mismo objeto.
 */
export default emitter;