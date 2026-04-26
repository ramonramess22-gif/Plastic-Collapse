/**
 * @file DialogueSystem.js
 * @description Sistema de diálogos para NPCs con efecto typewriter.
 *
 * Gestiona:
 *   - Cola de líneas de diálogo de un NPC
 *   - Efecto de aparición letra por letra (typewriter)
 *   - Avance con tecla SPACE o click
 *   - Eventos de inicio y fin de diálogo
 *   - Bloqueo del movimiento del jugador durante diálogos
 *
 * SEGURIDAD:
 *   - Sin eval(), sin new Function(), sin setTimeout con strings.
 *   - El efecto typewriter usa requestAnimationFrame + timestamp delta
 *     en lugar de setInterval con strings.
 *   - Los textos de diálogo son constantes de dialogues.js — nunca datos
 *     de entrada de usuario.
 *   - textContent en lugar de innerHTML para todo texto visible.
 *
 * USO:
 *   import DialogueSystem from '../systems/DialogueSystem.js';
 *   import { DIALOGUES } from '../data/dialogues.js';
 *
 *   // Iniciar diálogo de un NPC
 *   DialogueSystem.start('Dr. García', DIALOGUES.scientist.stage3);
 *
 *   // Avanzar manualmente (si el jugador presiona SPACE)
 *   DialogueSystem.advance();
 *
 *   // Verificar si hay diálogo activo
 *   if (DialogueSystem.isActive()) { ... }
 */

import EventBus    from './EventBus.js';
import HUDManager  from './HUDManager.js';
import { EVENTS, TIMING } from '../utils/Constants.js';

// ─── ESTADO INTERNO ───────────────────────────────────────────────────────────

const _dialogue = {
  active:       false,
  speaker:      '',
  lines:        [],        // Array de strings con todas las líneas
  currentLine:  0,         // Índice de la línea actual
  fullText:     '',        // Texto completo de la línea actual
  displayText:  '',        // Texto visible hasta ahora (typewriter)
  charIndex:    0,         // Índice del siguiente carácter a mostrar
  lastCharTime: 0,         // Timestamp del último carácter añadido (ms)
  animId:       null,      // ID de requestAnimationFrame (para cancelar)
  finished:     false,     // true cuando se mostró todo el texto de la línea
  onComplete:   null,      // Callback opcional al cerrar el diálogo
};

// ─── TYPEWRITER (sin setInterval ni setTimeout con strings) ───────────────────

/**
 * Loop de animación del efecto typewriter.
 * Usa requestAnimationFrame para ser compatible con CSP strict.
 *
 * SEGURIDAD: requestAnimationFrame acepta una FUNCIÓN definida estáticamente
 * (nunca un string). Es seguro bajo CSP strict-dynamic.
 *
 * @param {number} timestamp - Timestamp de alta precisión provisto por rAF
 */
function typewriterLoop(timestamp) {
  if (!_dialogue.active) return;

  // Calcular si ha pasado suficiente tiempo para el siguiente carácter
  if (timestamp - _dialogue.lastCharTime >= TIMING.DIALOGUE_BLIP) {
    _dialogue.lastCharTime = timestamp;

    if (_dialogue.charIndex < _dialogue.fullText.length) {
      // Añadir siguiente carácter
      _dialogue.charIndex++;
      _dialogue.displayText = _dialogue.fullText.slice(0, _dialogue.charIndex);

      // Actualizar DOM via HUDManager (textContent — seguro)
      HUDManager.updateDialogueText(_dialogue.displayText);

      // Emitir evento de "blip" de sonido (DialogueBox en escena escucha esto)
      if (_dialogue.charIndex % 2 === 0) {
        EventBus.emit(EVENTS.DIALOGUE_NEXT); // Reutilizamos para blip de sonido
      }
    } else {
      // Se completó la línea actual
      _dialogue.finished = true;
      return; // Detener el loop — esperamos input del jugador
    }
  }

  // Continuar el loop sólo si no terminó
  if (!_dialogue.finished) {
    _dialogue.animId = requestAnimationFrame(typewriterLoop);
  }
}

/**
 * Cancela el loop de animación si está corriendo.
 */
function cancelTypewriter() {
  if (_dialogue.animId !== null) {
    cancelAnimationFrame(_dialogue.animId);
    _dialogue.animId = null;
  }
}

// ─── HELPERS INTERNOS ─────────────────────────────────────────────────────────

/**
 * Muestra la línea indicada por _dialogue.currentLine.
 */
function showCurrentLine() {
  _dialogue.fullText    = _dialogue.lines[_dialogue.currentLine] ?? '';
  _dialogue.displayText = '';
  _dialogue.charIndex   = 0;
  _dialogue.lastCharTime = 0;
  _dialogue.finished    = false;

  cancelTypewriter();

  HUDManager.showDialogue(_dialogue.speaker, '');

  // Iniciar el typewriter con requestAnimationFrame (seguro con CSP)
  _dialogue.animId = requestAnimationFrame(typewriterLoop);
}

/**
 * Cierra el diálogo y limpia el estado.
 */
function closeDialogue() {
  cancelTypewriter();

  _dialogue.active      = false;
  _dialogue.speaker     = '';
  _dialogue.lines       = [];
  _dialogue.currentLine = 0;
  _dialogue.fullText    = '';
  _dialogue.displayText = '';
  _dialogue.finished    = false;

  HUDManager.hideDialogue();
  EventBus.emit(EVENTS.DIALOGUE_END);

  // Llamar callback si fue provisto
  if (typeof _dialogue.onComplete === 'function') {
    const cb = _dialogue.onComplete;
    _dialogue.onComplete = null;
    cb();
  }
}

// ─── API PÚBLICA ──────────────────────────────────────────────────────────────

const DialogueSystem = {

  /**
   * Inicia una secuencia de diálogo.
   *
   * @param {string}   speaker    - Nombre del NPC hablante
   * @param {string[]} lines      - Array de strings con las líneas
   * @param {Function} [onComplete] - Callback al cerrar el diálogo
   *
   * @example
   *   DialogueSystem.start('Dr. García', [
   *     'Los microplásticos están en toda la cadena trófica.',
   *     'Deben detener la producción inmediatamente.',
   *   ]);
   */
  start(speaker, lines, onComplete) {
    if (!Array.isArray(lines) || lines.length === 0) {
      console.warn('[DialogueSystem] start: lines vacío o inválido.');
      return;
    }

    // Si ya había un diálogo activo, cancelarlo
    if (_dialogue.active) {
      cancelTypewriter();
    }

    _dialogue.active      = true;
    _dialogue.speaker     = typeof speaker === 'string' ? speaker : '';
    _dialogue.lines       = lines.filter((l) => typeof l === 'string');
    _dialogue.currentLine = 0;
    _dialogue.onComplete  = typeof onComplete === 'function' ? onComplete : null;

    EventBus.emit(EVENTS.DIALOGUE_START, { speaker, lines });
    showCurrentLine();
  },

  /**
   * Avanza el diálogo:
   *   - Si el typewriter no terminó → muestra el texto completo (skip)
   *   - Si terminó y hay más líneas → muestra la siguiente
   *   - Si terminó y no hay más    → cierra el diálogo
   *
   * Llamar desde Player.js cuando se presiona SPACE o se hace click.
   */
  advance() {
    if (!_dialogue.active) return;

    if (!_dialogue.finished) {
      // Skip: mostrar el texto completo de la línea actual inmediatamente
      cancelTypewriter();
      _dialogue.displayText = _dialogue.fullText;
      _dialogue.charIndex   = _dialogue.fullText.length;
      _dialogue.finished    = true;
      HUDManager.updateDialogueText(_dialogue.displayText);
      return;
    }

    // Avanzar a la siguiente línea
    _dialogue.currentLine++;

    if (_dialogue.currentLine < _dialogue.lines.length) {
      showCurrentLine();
    } else {
      closeDialogue();
    }
  },

  /**
   * Cierra el diálogo inmediatamente (sin mostrar líneas restantes).
   * Útil cuando el jugador se aleja del NPC.
   */
  close() {
    if (!_dialogue.active) return;
    closeDialogue();
  },

  /**
   * @returns {boolean} true si hay un diálogo activo
   */
  isActive() {
    return _dialogue.active;
  },

  /**
   * @returns {boolean} true si el texto actual se muestra completo
   */
  isFinished() {
    return _dialogue.finished;
  },
};

export default DialogueSystem;