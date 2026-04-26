/**
 * @file PreloadScene.js
 * @description Carga todos los assets del juego usando AssetLoader.
 *              Reporta progreso al HUD via EventBus.
 *
 * SEGURIDAD: Sin eval(), sin código dinámico. Compatible con CSP strict.
 */

import { registerAll, createAnimations } from '../utils/AssetLoader.js';
import EventBus from '../systems/EventBus.js';
import { EVENTS, STAGES } from '../utils/Constants.js';

export default class PreloadScene extends Phaser.Scene {

  constructor() {
    super({ key: STAGES.PRELOAD });
  }

  preload() {
    // Escuchar progreso de carga de Phaser y emitirlo al HUD
    this.load.on('progress', (value) => {
      EventBus.emit(EVENTS.LOADING_PROGRESS, {
        percent: Math.round(value * 100),
      });
    });

    this.load.on('complete', () => {
      EventBus.emit(EVENTS.LOADING_COMPLETE);
    });

    // Registrar todos los assets definidos en AssetLoader.js
    registerAll(this);
  }

  create() {
    // Crear todas las animaciones definidas en AssetLoader.js
    createAnimations(this);

    // Ir al menú principal
    this.scene.start(STAGES.MAIN_MENU);
  }
}