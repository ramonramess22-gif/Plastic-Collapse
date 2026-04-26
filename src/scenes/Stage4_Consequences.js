/**
 * @file Stage4_Consequences.js
 * @description Etapa 4 — Consecuencias Ambientales y Biológicas.
 *
 * El mundo comienza a desintegrarse. El mismo mapa de la Etapa 1
 * ahora aparece distorsionado, oscuro, fragmentado.
 * Los animales sanos son reemplazados por sus versiones enfermas.
 * Aparecen microplásticos flotando en el aire.
 * El científico ya no está — fue ignorado y se fue.
 *
 * CONSECUENCIAS MOSTRADAS:
 *   - Fragmentación de hábitat (barreras en el tilemap)
 *   - Disrupción química (tintes de sprites)
 *   - Ruptura de cadena trófica (animales enfermos hablando)
 *   - Estrés térmico (overlay naranja pulsante)
 *   - Acidificación (agua oscurecida)
 *   - Microevolución / selección artificial (texto en pantalla)
 *   - Caos endocrino / daño neuronal (efectos visuales en cámara)
 *   - Hacia la Sexta Extinción (stats al mínimo histórico)
 *
 * SEGURIDAD: Sin eval(), sin código dinámico. Compatible con CSP strict.
 */

import BaseStageScene  from './BaseStageScene.js';
import DialogueSystem  from '../systems/DialogueSystem.js';
import GameState       from '../systems/GameState.js';
import { DIALOGUES }   from '../data/dialogues.js';
import { STAGES, STATS, DEPTHS, GAME } from '../utils/Constants.js';
import { getPaletteForStage, lerpColor } from '../utils/ColorPalette.js';

export default class Stage4_Consequences extends BaseStageScene {
  constructor() {
    super(STAGES.STAGE_4);
    this._degradeTimer = 0;
    this._heatPulse    = 0;
  }

  onStageCreate() {
    const palette = getPaletteForStage(STAGES.STAGE_4);
    this._drawDegradedWorld(palette);
    this._createHeatOverlay();
    this._createMicroplasticParticles(palette);
    this._showConsequencesText();
  }

  onStageUpdate() {
    // Pulso de calor: overlay naranja que parpadea lentamente
    this._heatPulse += 0.02;
    if (this._heatOverlay) {
      this._heatOverlay.setAlpha(0.12 + Math.sin(this._heatPulse) * 0.08);
    }

    // Degradar biodiversidad y salud gradualmente
    this._degradeTimer++;
    if (this._degradeTimer % 180 === 0) { // Cada ~3 segundos a 60fps
      GameState.modifyStat(STATS.BIODIVERSIDAD, -2);
      GameState.modifyStat(STATS.SALUD_HUMANA,  -1);
    }
  }

  _drawDegradedWorld(palette) {
    const w = GAME.WIDTH;
    const h = GAME.HEIGHT;

    // Fondo de tierra quemada
    this.add.rectangle(w / 2, h / 2, w, h, palette.primary)
      .setDepth(DEPTHS.GROUND);

    // Suelo agrietado simulado con líneas
    const g = this.add.graphics().setDepth(DEPTHS.GROUND + 0.5);
    g.lineStyle(1, 0x8a4010, 0.3);
    for (let i = 0; i < 20; i++) {
      const x1 = Math.random() * w;
      const y1 = Math.random() * h;
      g.lineBetween(x1, y1, x1 + (Math.random() - 0.5) * 100, y1 + (Math.random() - 0.5) * 100);
    }

    // "Fragmentación de hábitat" — barreras visuales
    this._drawHabitatFragments(w, h);

    // Agua contaminada (zona inferior)
    if (this.textures.exists('water_polluted')) {
      this.add.tileSprite(w / 2, h * 0.85, w, 80, 'water_polluted')
        .setTint(0x2a1a0a)
        .setDepth(DEPTHS.GROUND + 1);
    } else {
      this.add.rectangle(w / 2, h * 0.85, w, 80, 0x2a1a08)
        .setDepth(DEPTHS.GROUND + 1);
    }
  }

  _drawHabitatFragments(w, h) {
    // Muros/barreras que fragmentan el mapa visualmente
    const g = this.add.graphics().setDepth(DEPTHS.OBJECTS ?? 2);
    g.fillStyle(0x3a1a00, 0.7);

    // Fragmentos de hábitat: áreas aisladas entre sí
    g.fillRect(200, 100, 8, 200);  // Barrera vertical izquierda
    g.fillRect(550, 200, 8, 250);  // Barrera vertical derecha
    g.fillRect(200, 300, 350, 8);  // Barrera horizontal

    // Etiqueta educativa
    this.add.text(w / 2, 50, 'FRAGMENTACIÓN DE HÁBITAT', {
      fontFamily: 'monospace',
      fontSize:   '10px',
      color:      '#ff6600aa',
      align:      'center',
    }).setOrigin(0.5, 0).setDepth(DEPTHS.HUD_CANVAS);
  }

  _createHeatOverlay() {
    this._heatOverlay = this.add.rectangle(
      GAME.WIDTH / 2, GAME.HEIGHT / 2,
      GAME.WIDTH, GAME.HEIGHT,
      0xff4400
    )
    .setAlpha(0.15)
    .setDepth(DEPTHS.PARTICLES);
  }

  _createMicroplasticParticles(palette) {
    if (!this.textures.exists('bee_healthy')) return;
    try {
      this.add.particles(GAME.WIDTH / 2, GAME.HEIGHT / 2, 'bee_healthy', {
        x:         { min: 0,           max: GAME.WIDTH  },
        y:         { min: 0,           max: GAME.HEIGHT },
        speedX:    { min: -20,         max: 20          },
        speedY:    { min: -20,         max: 20          },
        scale:     { min: 0.05,        max: 0.2         },
        alpha:     { start: 0.6,       end: 0.1         },
        tint:      0xff8800,
        lifespan:  4000,
        quantity:  2,
        frequency: 100,
        depth:     DEPTHS.PARTICLES,
      });
    } catch (e) {
      console.info('[Stage4] Partículas no disponibles:', e.message);
    }
  }

  _showConsequencesText() {
    // Términos científicos del daño — aparecen secuencialmente
    const terms = [
      { text: 'DISRUPCIÓN ENDOCRINA',    x: 150, y: 140, delay: 1000 },
      { text: 'RUPTURA CADENA TRÓFICA',  x: 500, y: 220, delay: 2500 },
      { text: 'COLAPSO POBLACIONAL',     x: 300, y: 400, delay: 4000 },
      { text: 'SEXTA EXTINCIÓN',         x: 600, y: 350, delay: 5500 },
    ];

    for (const term of terms) {
      setTimeout(() => {
        const t = this.add.text(term.x, term.y, term.text, {
          fontFamily: 'monospace',
          fontSize:   '9px',
          color:      '#ff440066',
        })
        .setOrigin(0.5)
        .setDepth(DEPTHS.HUD_CANVAS)
        .setAlpha(0);

        this.tweens.add({
          targets:  t,
          alpha:    0.6,
          duration: 800,
          ease:     'Power2',
        });
      }, term.delay);
    }

    // Diálogo narrador tras unos segundos
    setTimeout(() => {
      DialogueSystem.start('', DIALOGUES.narrator.stage4_consequences);
    }, 7000);
  }
}