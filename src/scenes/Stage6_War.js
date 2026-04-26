/**
 * @file Stage6_War.js
 * @description Etapa 6 — Guerra.
 * Ciudades destruidas. Barrios en ruinas. Crisis social total.
 *
 * SEGURIDAD: Sin eval(), sin código dinámico. Compatible con CSP strict.
 */

import BaseStageScene  from './BaseStageScene.js';
import DialogueSystem  from '../systems/DialogueSystem.js';
import GameState       from '../systems/GameState.js';
import { DIALOGUES }   from '../data/dialogues.js';
import { STAGES, STATS, DEPTHS, GAME } from '../utils/Constants.js';

export default class Stage6_War extends BaseStageScene {
  constructor() {
    super(STAGES.STAGE_6);
    this._ashTimer  = 0;
    this._damageTick = null;
  }

  onStageCreate() {
    this._drawWarzone();
    this._showWarNarration();
    this._startDamageTick();
  }

  onStageUpdate() {
    this._ashTimer++;
    if (this._ashOverlay) {
      this._ashOverlay.setAlpha(0.3 + Math.sin(this._ashTimer * 0.01) * 0.1);
    }
  }

  _drawWarzone() {
    const w = GAME.WIDTH;
    const h = GAME.HEIGHT;

    this.add.rectangle(w / 2, h / 2, w, h, 0x0a0808).setDepth(DEPTHS.GROUND);

    const ruinsG = this.add.graphics().setDepth(DEPTHS.GROUND + 0.5);
    const ruins = [
      { x: 60,  h: 160 }, { x: 200, h: 250 }, { x: 380, h: 220 },
      { x: 560, h: 240 }, { x: 720, h: 200 },
    ];

    for (const r of ruins) {
      const rw = 100 + Math.random() * 40;
      ruinsG.fillStyle(0x1a1410, 1);
      ruinsG.fillRect(r.x - rw / 2, h - r.h, rw, r.h);

      // Tejado destruido
      ruinsG.fillStyle(0x252010, 1);
      const topY = h - r.h;
      for (let tx = r.x - rw / 2; tx < r.x + rw / 2; tx += 10) {
        const rh = 5 + Math.abs(Math.sin(tx * 0.3)) * 15;
        ruinsG.fillRect(tx, topY - rh, 8, rh);
      }

      // Ventanas oscuras rotas
      ruinsG.fillStyle(0x0a0808, 0.8);
      for (let wy = topY + 15; wy < h - 20; wy += 25) {
        for (let wx = r.x - rw / 2 + 8; wx < r.x + rw / 2 - 8; wx += 18) {
          if ((wx + wy) % 3 !== 0) ruinsG.fillRect(wx, wy, 10, 14);
        }
      }
    }

    // Calle con escombros
    ruinsG.fillStyle(0x2a2020, 0.8);
    ruinsG.fillRect(0, h - 60, w, 60);

    // Llamas intensas
    const fireG = this.add.graphics().setDepth(DEPTHS.PARTICLES);
    const bigFires = [150, 300, 490, 640];
    for (const fx of bigFires) {
      fireG.fillStyle(0xff2200, 0.6);
      fireG.fillTriangle(fx - 20, h - 60, fx + 20, h - 60, fx, h - 130);
      fireG.fillStyle(0xff6600, 0.5);
      fireG.fillTriangle(fx - 12, h - 60, fx + 12, h - 60, fx, h - 110);
      fireG.fillStyle(0xffaa00, 0.4);
      fireG.fillTriangle(fx - 6,  h - 60, fx + 6,  h - 60, fx, h - 90);
    }

    this._ashOverlay = this.add.rectangle(w / 2, h / 2, w, h, 0x0a0808)
      .setAlpha(0.35)
      .setDepth(DEPTHS.PARTICLES + 1);
  }

  _showWarNarration() {
    // SEGURIDAD: setTimeout con función flecha
    setTimeout(() => {
      DialogueSystem.start('', DIALOGUES.narrator.stage6_war_enter);
    }, 1500);
  }

  _startDamageTick() {
    // SEGURIDAD: setInterval con función flecha — NO con string
    this._damageTick = setInterval(() => {
      GameState.modifyStat(STATS.ECONOMIA,      -3);
      GameState.modifyStat(STATS.SALUD_HUMANA,  -4);
      GameState.modifyStat(STATS.BIODIVERSIDAD, -1);
    }, 2500);
  }

  shutdown() {
    if (this._damageTick) {
      clearInterval(this._damageTick);
      this._damageTick = null;
    }
    super.shutdown();
  }
}