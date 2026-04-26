/**
 * @file NPC.js
 * @description Clase base para todos los NPCs del juego.
 *
 * Scientist, Businessman, AnimalNPC extienden esta clase.
 * Provee: sprite, animación idle, rango de interacción, diálogo.
 *
 * SEGURIDAD:
 *   - Sin eval(), sin new Function().
 *   - dialogueKey es sólo un string para lookup en DIALOGUES — nunca se ejecuta.
 *   - Compatible con CSP strict.
 */

import DialogueSystem from '../systems/DialogueSystem.js';
import { DIALOGUES }  from '../data/dialogues.js';
import { DEPTHS }     from '../utils/Constants.js';

/**
 * Resuelve una ruta de diálogo como 'scientist.stage3_warning_intro'
 * en el objeto de líneas correspondiente.
 *
 * SEGURIDAD: Usa split('.') y acceso por clave sobre el objeto DIALOGUES —
 * nunca eval() ni new Function(). Si la clave no existe, devuelve null.
 *
 * @param {string} key - Ruta con puntos: 'grupo.subkey'
 * @returns {string[]|null}
 */
function resolveDialogueKey(key) {
  if (!key || typeof key !== 'string') return null;

  const parts = key.split('.');
  if (parts.length !== 2) return null;

  const [group, subkey] = parts;

  // Acceso explícito en dos pasos — sin eval
  const groupObj = DIALOGUES[group];
  if (!groupObj) return null;

  const lines = groupObj[subkey];
  if (!Array.isArray(lines)) return null;

  return lines;
}

export default class NPC {

  /**
   * @param {Phaser.Scene} scene
   * @param {Object}       config
   * @param {number}       config.x
   * @param {number}       config.y
   * @param {string}       config.textureKey    - Clave del spritesheet idle
   * @param {string}       config.idleAnim      - Clave de la animación idle
   * @param {string}       [config.talkAnim]    - Clave de la animación al hablar
   * @param {string}       [config.dialogueKey] - Ruta 'grupo.subkey' en DIALOGUES
   * @param {string}       [config.speakerName] - Nombre que aparece en la caja de diálogo
   * @param {number}       [config.depth]       - Depth de renderizado
   */
  constructor(scene, config) {
    this.scene       = scene;
    this._config     = config;
    this._idleAnim   = config.idleAnim   ?? null;
    this._talkAnim   = config.talkAnim   ?? config.idleAnim ?? null;
    this.speakerName = config.speakerName ?? 'NPC';

    // Resolver las líneas de diálogo una sola vez al crear el NPC
    this._dialogueLines = resolveDialogueKey(config.dialogueKey ?? null);

    // Crear el sprite
    this.sprite = scene.physics.add.staticSprite(
      config.x,
      config.y,
      config.textureKey
    );
    this.sprite.setDepth(config.depth ?? DEPTHS.NPC_BELOW);

    // Reproducir animación idle si existe
    if (this._idleAnim && scene.anims.exists(this._idleAnim)) {
      this.sprite.play(this._idleAnim);
    }
  }

  // ─── INTERACCIÓN ─────────────────────────────────────────────────────────────

  /**
   * Lanzar el diálogo asociado al NPC.
   * Llamado desde Player._handleInteraction() al presionar E.
   */
  interact() {
    if (!this._dialogueLines || this._dialogueLines.length === 0) return;
    if (DialogueSystem.isActive()) return;

    // Cambiar a animación de hablar
    if (this._talkAnim && this.scene.anims.exists(this._talkAnim)) {
      this.sprite.play(this._talkAnim);
    }

    DialogueSystem.start(
      this.speakerName,
      this._dialogueLines,
      () => this._onDialogueEnd()
    );
  }

  /**
   * Callback al terminar el diálogo — vuelve a idle.
   */
  _onDialogueEnd() {
    if (this._idleAnim && this.scene.anims.exists(this._idleAnim)) {
      this.sprite.play(this._idleAnim);
    }
  }

  // ─── DISTANCIA ───────────────────────────────────────────────────────────────

  /**
   * Distancia euclídea al jugador.
   * @param {number} playerX
   * @param {number} playerY
   * @returns {number}
   */
  distanceTo(playerX, playerY) {
    const dx = this.sprite.x - playerX;
    const dy = this.sprite.y - playerY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // ─── LIMPIEZA ─────────────────────────────────────────────────────────────────

  destroy() {
    this.sprite.destroy();
  }
}