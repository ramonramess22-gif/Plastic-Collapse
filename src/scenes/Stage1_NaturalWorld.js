/**
 * @file Stage1_NaturalWorld.js
 * @description Etapa 1 — Mundo Natural.
 *
 * El jugador despierta en un ecosistema sano: bosques frondosos,
 * fauna abundante, agua cristalina, aire limpio.
 * Esta etapa establece el contraste visual y emocional con el resto
 * del juego. Es la línea base del "mundo como debería ser".
 *
 * LÓGICA ESPECÍFICA:
 *   - Partículas de hojas y luz solar
 *   - Animales con patrulla simple
 *   - Diálogo narrador introductorio
 *   - Indicador visual de la fábrica al este del mapa
 *
 * SEGURIDAD: Sin eval(), sin código dinámico. Compatible con CSP strict.
 */

import BaseStageScene    from './BaseStageScene.js';
import TransitionManager from '../systems/TransitionManager.js';
import DialogueSystem    from '../systems/DialogueSystem.js';
import { DIALOGUES }     from '../data/dialogues.js';
import { STAGES, DEPTHS, GAME } from '../utils/Constants.js';
import { getPaletteForStage }   from '../utils/ColorPalette.js';

export default class Stage1_NaturalWorld extends BaseStageScene {

  constructor() {
    super(STAGES.STAGE_1);
    this._introShown = false;
  }

  // ─── HOOK DE CREACIÓN ─────────────────────────────────────────────────────────

  onStageCreate() {
    const palette = getPaletteForStage(STAGES.STAGE_1);

    // Cielo gradiente simulado con rectángulos (sin eval, pura geometría)
    this._drawSky(palette);

    // Partículas de hojas/luz
    this._createLeafParticles(palette);

    // Indicador visual de la fábrica (al este)
    this._createFactorySignpost();

    // Diálogo introductorio del narrador (tras breve delay)
    // SEGURIDAD: setTimeout con función flecha — no con string.
    setTimeout(() => {
      if (!this._introShown) {
        this._introShown = true;
        DialogueSystem.start('', DIALOGUES.narrator.stage1_intro);
      }
    }, 1200);
  }

  // ─── HOOK DE UPDATE ───────────────────────────────────────────────────────────

  onStageUpdate() {
    // Actualizar patrulla de animales
    for (const npc of this._npcs) {
      if (typeof npc.update === 'function') npc.update();
    }

    // Efecto de "respiración" del cielo: leve cambio de alpha en el overlay
    if (this._skyOverlay) {
      const t = this.time.now * 0.0003;
      this._skyOverlay.setAlpha(0.06 + Math.sin(t) * 0.02);
    }
  }

  // ─── MÉTODOS PRIVADOS ─────────────────────────────────────────────────────────

  /**
   * Cielo simulado con rectángulos de colores suaves.
   * Sin gradiente real de canvas (sólo rectángulos sólidos superpuestos).
   */
  _drawSky(palette) {
    const w = GAME.WIDTH;
    const h = GAME.HEIGHT;

    // Franja superior más clara (amanecer/día)
    this.add.rectangle(w / 2, h * 0.15, w, h * 0.3, palette.sky)
      .setAlpha(0.4)
      .setDepth(DEPTHS.GROUND);

    // Overlay de luz solar filtrada por el dosel del bosque
    this._skyOverlay = this.add.rectangle(w / 2, h / 2, w, h, 0xf0e060)
      .setAlpha(0.06)
      .setDepth(DEPTHS.GROUND + 0.5);
  }

  /**
   * Partículas de hojas usando el sistema de partículas de Phaser 3.
   * Sólo si el texture 'arrow_indicator' existe como proxy de partícula.
   * En producción se reemplazaría por una textura de hoja real.
   */
  _createLeafParticles(palette) {
    // El sistema de partículas de Phaser 3.60+ usa ParticleEmitter directamente
    // Verificamos disponibilidad del texture antes de intentar crear partículas
    if (!this.textures.exists('tree_healthy')) return;

    // Configuración segura de partículas (sin eval, sólo objetos de config)
    try {
      this._leafEmitter = this.add.particles(
        GAME.WIDTH / 2, -20, 'bee_healthy',
        {
          x:         { min: 0, max: GAME.WIDTH },
          y:         { start: -20, end: GAME.HEIGHT + 20 },
          speedX:    { min: -30, max: 30 },
          speedY:    { min: 20,  max: 60  },
          scale:     { min: 0.3, max: 0.6 },
          alpha:     { start: 0.8, end: 0   },
          lifespan:  6000,
          quantity:  1,
          frequency: 400,
          rotate:    { min: 0, max: 360 },
          tint:      palette.secondary,
          depth:     DEPTHS.DECORATIONS ?? 1,
        }
      );
    } catch (e) {
      // En versiones antiguas de Phaser la API de partículas difiere
      console.info('[Stage1] Partículas no disponibles:', e.message);
    }
  }

  /**
   * Cartel indicador que apunta hacia la fábrica.
   * Elemento de worldbuilding: el jugador sabe que la fábrica existe.
   */
  _createFactorySignpost() {
    const x = GAME.WIDTH - 80;
    const y = GAME.HEIGHT / 2;

    // Poste del cartel
    this.add.rectangle(x, y + 30, 8, 60, 0x5a3e1b).setDepth(DEPTHS.ENVIRONMENT);

    // Panel del cartel
    const panel = this.add.rectangle(x, y, 120, 36, 0x2a1a0a, 0.85)
      .setDepth(DEPTHS.ENVIRONMENT);

    // Texto del cartel
    this.add.text(x, y, '→ Fábrica', {
      fontFamily: 'monospace',
      fontSize:   '11px',
      color:      '#cc8844',
      align:      'center',
    })
    .setOrigin(0.5, 0.5)
    .setDepth(DEPTHS.ENVIRONMENT + 0.5);

    // Interactividad: click en el cartel avanza hacia etapa 2
    panel.setInteractive({ useHandCursor: true });
    panel.on('pointerdown', () => {
      TransitionManager.fadeToScene(this, STAGES.STAGE_2);
    });
  }
}