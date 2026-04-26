/**
 * @file MainMenuScene.js
 * @description Escena del menú principal.
 * Delega la construcción DOM a ui/MainMenu.js.
 *
 * SEGURIDAD: Sin eval(), sin innerHTML con datos externos. Compatible con CSP strict.
 */

import MainMenu   from '../ui/MainMenu.js';
import SaveSystem from '../systems/SaveSystem.js';
import GameState  from '../systems/GameState.js';
import { STAGES, GAME } from '../utils/Constants.js';

export default class MainMenuScene extends Phaser.Scene {

  constructor() {
    super({ key: STAGES.MAIN_MENU });
    this._menu = null;
  }

  create() {
    this.cameras.main.setBackgroundColor(0x0a100a);

    // Fade out del overlay negro
    const overlay = document.getElementById('scene-transition');
    if (overlay) {
      overlay.classList.remove('fade-in');
      overlay.classList.add('fade-out');
    }

    const meta       = SaveSystem.getSaveMetadata();
    const saveDateStr = meta.savedAt
      ? meta.savedAt.toLocaleDateString('es-EC')
      : '';

    this._menu = new MainMenu({
      containerId: 'main-menu-overlay',
      hasSave:     SaveSystem.hasSave(),
      saveDate:    saveDateStr,
      gameTitle:   GAME.TITLE,
      gameVersion: GAME.VERSION,

      onStart: () => {
        SaveSystem.resetSave();
        GameState.startGame();
        this._closeAndGo(STAGES.STAGE_1);
      },

      onContinue: () => {
        if (SaveSystem.load()) {
          GameState.startGame();
          this._closeAndGo(GameState.getCurrentStage());
        }
      },

      onMusicToggle: (enabled) => {
        if (enabled) {
          this.sound?.resumeAll();
        } else {
          this.sound?.pauseAll();
        }
      },

      onSfxToggle: (enabled) => {
        // Se puede expandir con un volumen global de SFX
        console.info('[MainMenu] SFX:', enabled);
      },
    });

    this._menu.show();
  }

  _closeAndGo(sceneKey) {
    if (this._menu) {
      this._menu.hide();
    }
    this.scene.start(sceneKey);
  }

  shutdown() {
    if (this._menu) {
      this._menu.destroy();
      this._menu = null;
    }
  }
}