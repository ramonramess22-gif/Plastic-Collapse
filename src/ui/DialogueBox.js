/**
 * @file ui/DialogueBox.js
 * @description Componente Phaser que gestiona los efectos de SONIDO
 *              de la caja de diálogo (el "blip" de cada carácter)
 *              y reproduce el sfx de interacción al abrir/cerrar.
 *
 * El VISUAL de la caja de diálogo está en el DOM (#dialogue-container),
 * gestionado por HUDManager.js y DialogueSystem.js.
 * Este componente sólo aporta la capa de audio que necesita acceso
 * al sistema de sonido de Phaser (this.scene.sound).
 *
 * SEGURIDAD: Sin eval(), sin new Function(). Compatible con CSP strict.
 *
 * USO (desde una escena):
 *   import DialogueBox from '../ui/DialogueBox.js';
 *   this._dialogueBox = new DialogueBox(this);
 *   // En shutdown():
 *   this._dialogueBox.destroy();
 */

import EventBus from '../systems/EventBus.js';
import { EVENTS, AUDIO } from '../utils/Constants.js';

export default class DialogueBox {

  /**
   * @param {Phaser.Scene} scene
   */
  constructor(scene) {
    this.scene       = scene;
    this._blipCount  = 0;   // Contador para no reproducir blip en cada carácter

    // Pre-cargar referencia al sfx (si el audio fue cargado)
    this._sfxBlip = scene.cache.audio.has('sfx_dialogue')
      ? scene.sound.add('sfx_dialogue', {
          volume: AUDIO.SFX_VOLUME_DEFAULT * 0.5,
          loop:   false,
        })
      : null;

    this._sfxDoor = scene.cache.audio.has('sfx_door')
      ? scene.sound.add('sfx_door', {
          volume: AUDIO.SFX_VOLUME_DEFAULT * 0.7,
          loop:   false,
        })
      : null;

    // Suscribir al EventBus
    EventBus.on(EVENTS.DIALOGUE_START, this._onDialogueStart, this);
    EventBus.on(EVENTS.DIALOGUE_END,   this._onDialogueEnd,   this);
    EventBus.on(EVENTS.DIALOGUE_NEXT,  this._onCharBlip,      this);
  }

  // ─── HANDLERS ────────────────────────────────────────────────────────────

  _onDialogueStart() {
    this._blipCount = 0;
    // Sonido de apertura del diálogo (puerta/transición)
    if (this._sfxDoor && !this._sfxDoor.isPlaying) {
      this._sfxDoor.play();
    }
  }

  _onDialogueEnd() {
    // Mismo sonido al cerrar
    if (this._sfxDoor && !this._sfxDoor.isPlaying) {
      this._sfxDoor.play();
    }
  }

  /**
   * Reproduce el blip de carácter.
   * No reproduce en cada evento — sólo cada 2 caracteres para no saturar.
   */
  _onCharBlip() {
    this._blipCount++;
    if (this._blipCount % 2 !== 0) return;

    if (this._sfxBlip && !this._sfxBlip.isPlaying) {
      this._sfxBlip.play();
    }
  }

  // ─── LIMPIEZA ─────────────────────────────────────────────────────────────

  destroy() {
    EventBus.off(EVENTS.DIALOGUE_START, this._onDialogueStart, this);
    EventBus.off(EVENTS.DIALOGUE_END,   this._onDialogueEnd,   this);
    EventBus.off(EVENTS.DIALOGUE_NEXT,  this._onCharBlip,      this);

    if (this._sfxBlip) { this._sfxBlip.destroy(); }
    if (this._sfxDoor) { this._sfxDoor.destroy(); }
  }
}