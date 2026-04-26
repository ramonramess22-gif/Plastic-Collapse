/**
 * @file Stage3_Warning.js
 * @description Etapa 3 — La Advertencia.
 *
 * El Dr. García confronta a los empresarios en la sala de juntas.
 * Los empresarios ignoran sistemáticamente todas las advertencias.
 * Momento pivote narrativo: el jugador es testigo de la decisión
 * que condena al planeta.
 *
 * SEGURIDAD: Sin eval(), sin código dinámico. Compatible con CSP strict.
 */

import BaseStageScene  from './BaseStageScene.js';
import DialogueSystem  from '../systems/DialogueSystem.js';
import GameState       from '../systems/GameState.js';
import { DIALOGUES }   from '../data/dialogues.js';
import { STAGES, STATS, DEPTHS, GAME } from '../utils/Constants.js';
import { getPaletteForStage }          from '../utils/ColorPalette.js';

export default class Stage3_Warning extends BaseStageScene {
  constructor() {
    super(STAGES.STAGE_3);
    this._sequencePlayed = false;
  }

  onStageCreate() {
    this._drawBoardroom();
    this._setupWarningSequence();
  }

  onStageUpdate() {}

  _drawBoardroom() {
    const palette = getPaletteForStage(STAGES.STAGE_3);
    const w = GAME.WIDTH;
    const h = GAME.HEIGHT;

    // Sala oscura con mesa de conferencias
    this.add.rectangle(w / 2, h / 2, w, h, 0x0a0a18).setDepth(DEPTHS.GROUND);

    // Mesa de conferencias
    this.add.rectangle(w / 2, h * 0.55, 500, 80, 0x1a1a0a)
      .setStrokeStyle(2, 0x3a3a2a)
      .setDepth(DEPTHS.ENVIRONMENT);

    // Proyector / pantalla de presentación
    this.add.rectangle(w / 2, h * 0.22, 320, 160, 0x1a2a3a)
      .setStrokeStyle(2, 0x2a3a4a)
      .setDepth(DEPTHS.ENVIRONMENT);

    // Texto de la presentación científica en la "pantalla"
    const slideLines = [
      'MICROPLÁSTICOS EN SANGRE HUMANA: +78%',
      'DISRUPTORES ENDOCRINOS: NIVEL CRÍTICO',
      'COLAPSO CADENA TRÓFICA: INMINENTE',
    ];
    slideLines.forEach((line, i) => {
      this.add.text(w / 2, h * 0.16 + i * 18, line, {
        fontFamily: 'monospace',
        fontSize:   '9px',
        color:      '#ff4444',
      }).setOrigin(0.5, 0).setDepth(DEPTHS.ENVIRONMENT + 1);
    });

    // Luz de proyector sobre el científico
    this.add.circle(300, h * 0.55, 60, 0x6090ff, 0.1)
      .setDepth(DEPTHS.ENVIRONMENT - 0.5);
  }

  _setupWarningSequence() {
    // Secuencia automática: científico habla → empresarios rechazan
    // SEGURIDAD: setTimeout con función flecha
    setTimeout(() => {
      if (this._sequencePlayed) return;
      this._sequencePlayed = true;

      // Primera advertencia del científico
      DialogueSystem.start(
        'Dr. García',
        DIALOGUES.scientist.stage3_warning_intro,
        () => {
          // Tras la advertencia, el empresario responde
          setTimeout(() => {
            DialogueSystem.start(
              'CEO Vargas',
              DIALOGUES.businessman.stage3_dismissal_1,
              () => {
                // El científico insiste
                setTimeout(() => {
                  DialogueSystem.start(
                    'Dr. García',
                    DIALOGUES.scientist.stage3_ignored,
                    () => {
                      // Las stats empeoran porque ignoraron la advertencia
                      GameState.modifyStat(STATS.CONTAMINACION, +8);
                      GameState.modifyStat(STATS.BIODIVERSIDAD, -5);
                    }
                  );
                }, 600);
              }
            );
          }, 400);
        }
      );
    }, 1000);
  }
}