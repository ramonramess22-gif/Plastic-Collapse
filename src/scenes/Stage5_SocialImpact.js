/**
 * @file Stage5_SocialImpact.js — Etapa 5: Impacto Social
 * Precariedad laboral, revueltas de trabajadores, inicio de conflictos.
 * SEGURIDAD: Sin eval(), sin código dinámico. Compatible con CSP strict.
 */

import BaseStageScene  from './BaseStageScene.js';
import DialogueSystem  from '../systems/DialogueSystem.js';
import GameState       from '../systems/GameState.js';
import { DIALOGUES }   from '../data/dialogues.js';
import { STAGES, STATS, DEPTHS, GAME } from '../utils/Constants.js';

export default class Stage5_SocialImpact extends BaseStageScene {
  constructor() {
    super(STAGES.STAGE_5);
    this._revoltStarted = false;
  }

  onStageCreate() {
    this._drawCityUnrest();
    this._startRevoltSequence();
  }

  onStageUpdate() {
    // Agitar NPCs trabajadores (pequeño movimiento aleatorio)
    if (this._revoltStarted) {
      for (const npc of this._npcs) {
        if (npc.sprite && !npc.sprite.body?.isStatic) {
          // Los NPCs estáticos no se mueven — sólo efecto visual de vibración
          const jitter = (Math.random() - 0.5) * 0.5;
          npc.sprite.setX(npc.sprite.x + jitter);
        }
      }
    }
  }

  _drawCityUnrest() {
    const w = GAME.WIDTH;
    const h = GAME.HEIGHT;

    // Edificios de ciudad deteriorados
    const buildingData = [
      { x: 80,  y: 300, w: 100, h: 250, color: 0x2a2a2a },
      { x: 220, y: 280, w: 120, h: 280, color: 0x1a1a1a },
      { x: 380, y: 260, w: 140, h: 300, color: 0x252525 },
      { x: 560, y: 290, w: 110, h: 270, color: 0x1e1e1e },
      { x: 700, y: 310, w: 90,  h: 250, color: 0x2a2020 },
    ];

    const g = this.add.graphics().setDepth(DEPTHS.GROUND);
    for (const b of buildingData) {
      g.fillStyle(b.color, 1);
      g.fillRect(b.x - b.w / 2, h - b.h, b.w, b.h);

      // Ventanas con luces irregulares (conflicto)
      g.fillStyle(0xff6600, 0.3);
      for (let wy = h - b.h + 20; wy < h - 20; wy += 30) {
        for (let wx = b.x - b.w / 2 + 10; wx < b.x + b.w / 2 - 10; wx += 20) {
          if (Math.random() > 0.4) {
            g.fillRect(wx, wy, 10, 14);
          }
        }
      }
    }

    // Calle
    g.fillStyle(0x1a1a1a, 1);
    g.fillRect(0, h - 80, w, 80);

    // Fuegos en la calle (triángulos simples = llamas)
    g.fillStyle(0xff4400, 0.7);
    const firePositions = [180, 340, 520, 680];
    for (const fx of firePositions) {
      g.fillTriangle(fx - 12, h - 80, fx + 12, h - 80, fx, h - 120);
      g.fillStyle(0xff8800, 0.5);
      g.fillTriangle(fx - 8, h - 80, fx + 8, h - 80, fx, h - 105);
    }
  }

  _startRevoltSequence() {
    setTimeout(() => {
      DialogueSystem.start('Obrero', DIALOGUES.workers.precarity, () => {
        setTimeout(() => {
          this._revoltStarted = true;
          DialogueSystem.start('Obrero', DIALOGUES.workers.revolt, () => {
            GameState.modifyStat(STATS.ECONOMIA,     -15);
            GameState.modifyStat(STATS.SALUD_HUMANA, -10);
          });
        }, 800);
      });
    }, 1200);
  }
}