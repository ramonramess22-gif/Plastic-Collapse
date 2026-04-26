/**
 * @file Stage2_Factory.js
 * @description Etapa 2 — La Fábrica de Plástico.
 *
 * Interior de la fábrica Vargas & Mora S.A.
 * Muestra visualmente: extracción de petróleo, procesamiento químico,
 * producción de plástico, emisión de humo y residuos.
 *
 * Elementos visuales:
 *   - Bomba de extracción de petróleo (animada)
 *   - Tanques de químicos con etiquetas de advertencia
 *   - Cinta transportadora animada (conveyor_belt)
 *   - Chimeneas con emisión de humo (smoke_stack)
 *   - Trabajadores caminando
 *   - Humo de partículas gris sobre las chimeneas
 *
 * Al entrar, el jugador ve el diálogo narrador stage2_factory_enter.
 * Al examinar cada máquina, aparece el diálogo stage2_process correspondiente.
 *
 * SEGURIDAD: Sin eval(), sin código dinámico. Compatible con CSP strict.
 */

import BaseStageScene    from './BaseStageScene.js';
import EnvironmentObject from '../entities/EnvironmentObject.js';
import DialogueSystem    from '../systems/DialogueSystem.js';
import GameState         from '../systems/GameState.js';
import { DIALOGUES }     from '../data/dialogues.js';
import { STAGES, STATS, DEPTHS, GAME } from '../utils/Constants.js';
import { getPaletteForStage }          from '../utils/ColorPalette.js';

export default class Stage2_Factory extends BaseStageScene {

  constructor() {
    super(STAGES.STAGE_2);
    this._introShown = false;
    this._envObjects = [];
  }

  onStageCreate() {
    const palette = getPaletteForStage(STAGES.STAGE_2);

    // Fondo industrial
    this._drawFactoryBackground(palette);

    // Objetos interactuables de la fábrica
    this._createFactoryMachinery();

    // Humo de chimeneas (partículas)
    this._createSmokeParticles(palette);

    // Estática del motor industrial (ruido de fondo visual)
    this._createVibrationEffect();

    // Diálogo de entrada a la fábrica
    setTimeout(() => {
      if (!this._introShown) {
        this._introShown = true;
        DialogueSystem.start('', DIALOGUES.narrator.stage2_factory_enter);
      }
    }, 800);

    // La contaminación sube gradualmente mientras el jugador está en la fábrica
    this._pollutionInterval = setInterval(() => {
      GameState.modifyStat(STATS.CONTAMINACION, +1);
      GameState.modifyStat(STATS.BIODIVERSIDAD, -1);
    }, 3000);
    // SEGURIDAD: setInterval recibe función flecha — NO un string.
  }

  onStageUpdate() {
    // Animar el conveyor belt (desplazamiento de tileX si existe la capa)
    if (this._conveyorSprite) {
      this._conveyorSprite.tilePositionX += 1.5;
    }

    // Comprobar interacción con objetos de entorno
    if (this._player) {
      this._checkEnvObjectProximity();
    }
  }

  // ─── MÉTODOS PRIVADOS ─────────────────────────────────────────────────────────

  _drawFactoryBackground(palette) {
    const w = GAME.WIDTH;
    const h = GAME.HEIGHT;

    // Suelo de concreto
    this.add.rectangle(w / 2, h * 0.75, w, h * 0.5, 0x3a3028)
      .setDepth(DEPTHS.GROUND);

    // Pared trasera
    this.add.rectangle(w / 2, h * 0.3, w, h * 0.6, 0x2a2018)
      .setDepth(DEPTHS.GROUND);

    // Líneas de estructura industrial
    const g = this.add.graphics().setDepth(DEPTHS.GROUND + 0.5);
    g.lineStyle(2, 0x4a3a28, 0.4);
    // Vigas verticales
    for (let x = 100; x < w; x += 150) {
      g.lineBetween(x, 0, x, h * 0.7);
    }
    // Vigas horizontales
    g.lineBetween(0, h * 0.2, w, h * 0.2);
    g.lineBetween(0, h * 0.5, w, h * 0.5);

    // Overlay de humo ambiental (bajo alpha)
    this.add.rectangle(w / 2, h / 2, w, h, 0x403020)
      .setAlpha(0.3)
      .setDepth(DEPTHS.GROUND + 1);
  }

  _createFactoryMachinery() {
    // Sólo creamos los objetos si los textures existen
    // En caso contrario, usamos rectángulos placeholder

    // ── Bomba de petróleo ──────────────────────────────────────────────────────
    if (this.textures.exists('oil_pump')) {
      this._oilPump = this.add.image(160, 380, 'oil_pump')
        .setDepth(DEPTHS.ENVIRONMENT)
        .setScale(1.2);

      // Animación de subida/bajada de la bomba (tween sinusoidal)
      this.tweens.add({
        targets:  this._oilPump,
        y:        395,
        duration: 1200,
        ease:     'Sine.InOut',
        yoyo:     true,
        repeat:   -1,
      });
    } else {
      // Placeholder
      this.add.rectangle(160, 380, 60, 80, 0x8a5020)
        .setDepth(DEPTHS.ENVIRONMENT);
      this.add.text(160, 380, 'Bomba\nPetróleo', {
        fontFamily: 'monospace', fontSize: '9px', color: '#cc8844', align: 'center',
      }).setOrigin(0.5).setDepth(DEPTHS.ENVIRONMENT + 0.5);
    }

    // ── Tanques químicos ───────────────────────────────────────────────────────
    const tankPositions = [320, 420, 520];
    for (const tx of tankPositions) {
      if (this.textures.exists('chemical_tank')) {
        this.add.image(tx, 360, 'chemical_tank')
          .setDepth(DEPTHS.ENVIRONMENT);
      } else {
        this.add.rectangle(tx, 360, 48, 72, 0x3a5a3a)
          .setDepth(DEPTHS.ENVIRONMENT);
        this.add.text(tx, 360, '⚠', {
          fontFamily: 'monospace', fontSize: '16px', color: '#ffcc00',
        }).setOrigin(0.5).setDepth(DEPTHS.ENVIRONMENT + 0.5);
      }
    }

    // ── Cinta transportadora (TilingSprite para animación de scroll) ───────────
    if (this.textures.exists('conveyor_belt')) {
      this._conveyorSprite = this.add.tileSprite(400, 460, 600, 16, 'conveyor_belt')
        .setDepth(DEPTHS.ENVIRONMENT);
    } else {
      this.add.rectangle(400, 460, 600, 16, 0x5a4030)
        .setDepth(DEPTHS.ENVIRONMENT);
    }

    // ── Chimeneas ─────────────────────────────────────────────────────────────
    const chimneyPositions = [640, 720];
    for (const cx of chimneyPositions) {
      if (this.textures.exists('smoke_stack')) {
        const chimney = this.add.sprite(cx, 300, 'smoke_stack')
          .setDepth(DEPTHS.ENVIRONMENT);
        if (this.anims.exists('smoke_anim')) {
          chimney.play('smoke_anim');
        }
      } else {
        this.add.rectangle(cx, 300, 28, 100, 0x2a2020)
          .setDepth(DEPTHS.ENVIRONMENT);
      }
    }

    // ── Objetos interactuables con diálogos del narrador ─────────────────────
    this._envObjects.push(
      new EnvironmentObject(this, {
        x:           160,
        y:           340,
        textureKey:  this.textures.exists('oil_pump') ? 'oil_pump' : 'hud_bar',
        dialogueKey: 'narrator.stage2_process',
        label:       'Examinar extracción de petróleo',
      })
    );
  }

  _createSmokeParticles(palette) {
    if (!this.textures.exists('tree_healthy')) return;

    try {
      this._smokeEmitter = this.add.particles(640, 240, 'bee_healthy', {
        x:         { min: -10, max: 10 },
        y:         { start: 0, end: -120 },
        speedX:    { min: -15, max: 15  },
        speedY:    { min: -40, max: -20 },
        scale:     { start: 0.8, end: 2.5 },
        alpha:     { start: 0.5, end: 0   },
        tint:      0xaaaaaa,
        lifespan:  2500,
        quantity:  1,
        frequency: 200,
        depth:     DEPTHS.PARTICLES ?? 8,
      });
    } catch (e) {
      console.info('[Stage2] Partículas de humo no disponibles:', e.message);
    }
  }

  _createVibrationEffect() {
    // Leve "vibración" de cámara periódica que simula maquinaria pesada
    // SEGURIDAD: setInterval con función flecha — NO con string
    this._vibrationInterval = setInterval(() => {
      if (this.cameras?.main) {
        this.cameras.main.shake(200, 0.002);
      }
    }, 5000);
  }

  _checkEnvObjectProximity() {
    if (!this._player) return;
    const px = this._player.x;
    const py = this._player.y;

    for (const obj of this._envObjects) {
      if (obj.distanceTo(px, py) < 50) {
        obj.interact();
        break;
      }
    }
  }

  shutdown() {
    // Limpiar intervalos antes del shutdown base
    if (this._pollutionInterval) {
      clearInterval(this._pollutionInterval);
      this._pollutionInterval = null;
    }
    if (this._vibrationInterval) {
      clearInterval(this._vibrationInterval);
      this._vibrationInterval = null;
    }

    for (const obj of this._envObjects) obj.destroy();
    this._envObjects = [];

    super.shutdown();
  }
}