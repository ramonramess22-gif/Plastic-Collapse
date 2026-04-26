/**
 * @file EndScene.js
 * @description Escena final. Delega la construcción DOM a ui/EndScreen.js.
 *
 * SEGURIDAD: Sin eval(), sin innerHTML con datos externos. Compatible con CSP strict.
 */

import EndScreen   from '../ui/EndScreen.js';
import GameState   from '../systems/GameState.js';
import SaveSystem  from '../systems/SaveSystem.js';
import { STAGES }  from '../utils/Constants.js';

export default class EndScene extends Phaser.Scene {

  constructor() {
    super({ key: STAGES.END });
    this._screen = null;
  }

  create() {
    this.cameras.main.setBackgroundColor(0x000000);

    // Fade out
    const overlay = document.getElementById('scene-transition');
    if (overlay) {
      overlay.classList.remove('fade-in');
      overlay.classList.add('fade-out');
    }

    // Ocultar el HUD
    const hud = document.getElementById('hud-overlay');
    if (hud) hud.style.display = 'none';

    this._screen = new EndScreen({
      containerId: 'end-screen-overlay',
      snapshot:    GameState.getSnapshot(),
      onRestart:   () => {
        const hud2 = document.getElementById('hud-overlay');
        if (hud2) hud2.style.display = 'block';
        SaveSystem.resetSave();
        this._screen?.hide();
        this.scene.start(STAGES.MAIN_MENU);
      },
    });

    this._screen.show();
  }

  shutdown() {
    if (this._screen) {
      this._screen.destroy();
      this._screen = null;
    }
  }
}