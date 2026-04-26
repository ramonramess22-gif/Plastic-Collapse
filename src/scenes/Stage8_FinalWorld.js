/**
 * @file Stage8_FinalWorld.js
 * @description Etapa 8 — El Mundo Final.
 * Ecosistemas colapsados. Baja biodiversidad crítica. Sociedad deteriorada.
 * Silencio casi total. El jugador camina por un mundo vacío.
 * Tras la narración final, transición automática a EndScene.
 *
 * SEGURIDAD: Sin eval(), sin código dinámico. Compatible con CSP strict.
 */

import BaseStageScene    from './BaseStageScene.js';
import TransitionManager from '../systems/TransitionManager.js';
import DialogueSystem    from '../systems/DialogueSystem.js';
import GameState         from '../systems/GameState.js';
import { DIALOGUES }     from '../data/dialogues.js';
import { STAGES, STATS, DEPTHS, GAME } from '../utils/Constants.js';

export default class Stage8_FinalWorld extends BaseStageScene {

  constructor() {
    super(STAGES.STAGE_8);
    this._frameCount   = 0;
    this._advancing    = false;
  }

  onStageCreate() {
    // Fijar stats al mínimo del colapso total
    GameState.batchUpdate({
      [STATS.ECONOMIA]:       5,
      [STATS.CONTAMINACION]: 95,
      [STATS.BIODIVERSIDAD]:  5,
      [STATS.SALUD_HUMANA]:  10,
    });

    this._drawCollapsedWorld();
    this._showFinalNarration();
  }

  onStageUpdate() {
    this._frameCount++;

    // Vibración muy sutil de la cámara — mundo inestable
    if (this._frameCount % 120 === 0) {
      this.cameras.main.shake(300, 0.001);
    }

    // Auto-avance al EndScene después de 18 segundos
    if (this._frameCount > 60 * 18 && !this._advancing) {
      this._advancing = true;
      TransitionManager.fadeToScene(this, STAGES.END);
    }
  }

  _drawCollapsedWorld() {
    const w = GAME.WIDTH;
    const h = GAME.HEIGHT;

    // Casi negro total
    this.add.rectangle(w / 2, h / 2, w, h, 0x080808).setDepth(DEPTHS.GROUND);

    const g = this.add.graphics().setDepth(DEPTHS.GROUND + 0.5);

    // Suelo estéril
    g.fillStyle(0x0f0f0f, 1);
    g.fillRect(0, h * 0.7, w, h * 0.3);

    // Grietas profundas en el suelo
    g.lineStyle(1, 0x1a0800, 0.5);
    const crackStarts = [80, 180, 300, 420, 560, 680];
    for (const sx of crackStarts) {
      const sy = h * 0.7;
      g.lineBetween(sx, sy, sx + 40,  sy + 60);
      g.lineBetween(sx, sy, sx - 30,  sy + 50);
      g.lineBetween(sx + 20, sy + 30, sx + 60, sy + 70);
    }

    // Cielo completamente vacío — sin nubes, sin luz
    g.fillStyle(0x040404, 0.95);
    g.fillRect(0, 0, w, h * 0.7);

    // Polvo fino cayendo (rectángulos pequeños)
    g.fillStyle(0x1a1a1a, 0.15);
    for (let i = 0; i < 40; i++) {
      const px = (i * 53) % w;
      const py = (i * 37) % (h * 0.7);
      g.fillRect(px, py, 2, 4);
    }

    // Estadísticas del colapso en pantalla — impacto visual máximo
    const statsLines = [
      { text: 'BIODIVERSIDAD GLOBAL: 5%',           y: h * 0.20 },
      { text: 'CONTAMINACIÓN ACUMULADA: NIVEL 95',  y: h * 0.28 },
      { text: 'ECONOMÍA: COLAPSO SISTÉMICO',        y: h * 0.36 },
      { text: 'SALUD HUMANA: CRÍTICA',              y: h * 0.44 },
      { text: 'EXTINCIÓN: ACTIVA',                  y: h * 0.52 },
    ];

    for (const sl of statsLines) {
      this.add.text(w / 2, sl.y, sl.text, {
        fontFamily: 'monospace',
        fontSize:   '10px',
        color:      '#660000aa',
        align:      'center',
      }).setOrigin(0.5).setDepth(DEPTHS.HUD_CANVAS);
    }

    // Texto central — el más impactante
    const centralText = this.add.text(w / 2, h * 0.62, 'EL MUNDO QUE PUDO SER', {
      fontFamily: 'monospace',
      fontSize:   '14px',
      color:      '#22222200',
      align:      'center',
    }).setOrigin(0.5).setDepth(DEPTHS.HUD_CANVAS);

    // Aparece lentamente — fade in
    this.tweens.add({
      targets:  centralText,
      alpha:    0.4,
      duration: 4000,
      delay:    3000,
      ease:     'Power1',
    });
  }

  _showFinalNarration() {
    // SEGURIDAD: setTimeout con función flecha
    setTimeout(() => {
      DialogueSystem.start(
        '',
        DIALOGUES.narrator.stage8_final,
        () => {
          // Tras el diálogo, esperar y luego avanzar al EndScene
          setTimeout(() => {
            if (!this._advancing) {
              this._advancing = true;
              TransitionManager.fadeToScene(this, STAGES.END);
            }
          }, 3000);
        }
      );
    }, 2000);
  }
}