/**
 * @file BootScene.js
 * @description Primera escena que ejecuta Phaser. Muestra splash y configura
 *              ajustes mínimos del motor antes de pasar a PreloadScene.
 *
 * SEGURIDAD: Sin eval(), sin código dinámico. Compatible con CSP strict.
 */

import { STAGES, TIMING } from '../utils/Constants.js';

export default class BootScene extends Phaser.Scene {

  constructor() {
    super({ key: STAGES.BOOT });
  }

  preload() {
    // En Boot sólo cargamos el logo/splash si lo hubiera.
    // Los assets del juego se cargan en PreloadScene.
  }

  create() {
    // Configuración global del motor de física (Arcade)
    this.physics.world.setBounds(0, 0, 800, 600);

    // Pequeña pausa para el splash, luego PreloadScene
    // SEGURIDAD: setTimeout recibe una función flecha — no un string.
    setTimeout(() => {
      this.scene.start(STAGES.PRELOAD);
    }, TIMING.SPLASH_DURATION);
  }
}