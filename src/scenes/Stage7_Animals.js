/**
 * @file Stage7_Animals.js
 * @description Etapa 7 — Los Animales Hablan.
 * Los últimos supervivientes del mundo natural interactúan con el jugador
 * y narran el daño causado por la contaminación y la extracción de recursos.
 *
 * SEGURIDAD: Sin eval(), sin código dinámico. Compatible con CSP strict.
 */

import BaseStageScene from './BaseStageScene.js';
import { STAGES, DEPTHS, GAME } from '../utils/Constants.js';

export default class Stage7_Animals extends BaseStageScene {

  constructor() {
    super(STAGES.STAGE_7);
  }

  onStageCreate() {
    this._drawPostApocalypticNature();
  }

  onStageUpdate() {
    if (this._glowOverlay) {
      const t = this.time.now * 0.0008;
      this._glowOverlay.setAlpha(0.04 + Math.sin(t) * 0.02);
    }
  }

  _drawPostApocalypticNature() {
    const w = GAME.WIDTH;
    const h = GAME.HEIGHT;

    // Fondo oscuro con tenue verde residual
    this.add.rectangle(w / 2, h / 2, w, h, 0x0f1a0f).setDepth(DEPTHS.GROUND);

    // Árboles muertos
    const treeG = this.add.graphics().setDepth(DEPTHS.ENVIRONMENT);
    const treesX = [100, 250, 450, 620, 740];

    for (const tx of treesX) {
      treeG.fillStyle(0x1a1410, 1);
      treeG.fillRect(tx - 4, h * 0.3, 8, h * 0.4);

      // Ramas esqueléticas
      treeG.lineStyle(2, 0x1a1410, 0.8);
      treeG.lineBetween(tx, h * 0.35, tx - 30, h * 0.25);
      treeG.lineBetween(tx, h * 0.40, tx + 25, h * 0.30);
      treeG.lineBetween(tx, h * 0.45, tx - 20, h * 0.37);
    }

    // Suelo estéril con algo de vida residual
    treeG.fillStyle(0x1a200a, 0.5);
    treeG.fillRect(0, h * 0.65, w, h * 0.35);

    // Zona verde mínima — donde están los animales
    this.add.circle(w / 2, h * 0.55, 90, 0x1a2e1a, 0.5)
      .setDepth(DEPTHS.GROUND + 0.5);

    // Halo de esperanza muy sutil
    this._glowOverlay = this.add.circle(w / 2, h * 0.55, 110, 0x60c060)
      .setAlpha(0.05)
      .setDepth(DEPTHS.PARTICLES);

    // Instrucción al jugador
    this.add.text(w / 2, h - 25,
      '[ Acércate a los animales y presiona E para escuchar ]', {
        fontFamily: 'monospace',
        fontSize:   '9px',
        color:      '#44664444',
        align:      'center',
      }
    ).setOrigin(0.5, 1).setDepth(DEPTHS.HUD_CANVAS);
  }
}