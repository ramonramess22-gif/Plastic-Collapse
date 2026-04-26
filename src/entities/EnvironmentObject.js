/**
 * @file EnvironmentObject.js
 * @description Objeto interactuable del entorno (bombas de petróleo, tanques, etc.)
 * Al interactuar, muestra un diálogo del narrador.
 */

import DialogueSystem from '../systems/DialogueSystem.js';
import { DIALOGUES }  from '../data/dialogues.js';
import { DEPTHS }     from '../utils/Constants.js';

export default class EnvironmentObject {
  /**
   * @param {Phaser.Scene} scene
   * @param {Object}       config
   * @param {number}       config.x
   * @param {number}       config.y
   * @param {string}       config.textureKey
   * @param {string}       config.dialogueKey  - 'narrator.stage2_process'
   * @param {string}       [config.label]      - Texto del indicador de interacción
   */
  constructor(scene, config) {
    this.scene = scene;

    this.sprite = scene.physics.add.staticImage(
      config.x, config.y, config.textureKey
    );
    this.sprite.setDepth(config.depth ?? DEPTHS.ENVIRONMENT);

    // Resolver diálogo — nunca eval(), acceso por claves estáticas
    this._label = config.label ?? '';
    this._dialogueLines = this._resolveDialogue(config.dialogueKey);
  }

  _resolveDialogue(key) {
    if (!key || typeof key !== 'string') return null;
    const [group, subkey] = key.split('.');
    const groupObj = DIALOGUES[group];
    if (!groupObj) return null;
    const lines = groupObj[subkey];
    return Array.isArray(lines) ? lines : null;
  }

  interact() {
    if (!this._dialogueLines) return;
    if (DialogueSystem.isActive()) return;
    DialogueSystem.start('', this._dialogueLines);
  }

  distanceTo(px, py) {
    const dx = this.sprite.x - px;
    const dy = this.sprite.y - py;
    return Math.sqrt(dx * dx + dy * dy);
  }

  destroy() {
    this.sprite.destroy();
  }
}