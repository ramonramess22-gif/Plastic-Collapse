/**
 * @file ui/HUD.js
 * @description Componente HUD renderizado DENTRO del canvas de Phaser.
 *
 * Complementa al HUDManager (que gestiona el DOM overlay) con elementos
 * visuales que necesitan estar integrados en el canvas:
 *   - Iconos de stats junto a las barras (cuando se usan sprites del juego)
 *   - Efectos de flash al subir/bajar stats drásticamente
 *   - Notificaciones flotantes de cambio de stat ("−10 Biodiversidad")
 *   - Mini-mapa conceptual (opcional, fase futura)
 *
 * RELACIÓN CON HUDManager.js:
 *   HUDManager  → actualiza elementos DOM (barras HTML, textos)
 *   HUD.js      → renderiza feedback visual dentro del canvas Phaser
 *
 * SEGURIDAD: Sin eval(), sin new Function(). Compatible con CSP strict.
 *
 * USO (desde una escena Phaser):
 *   import HUD from '../ui/HUD.js';
 *   this._hud = new HUD(this);
 *   // En update():
 *   this._hud.update();
 *   // Al cambiar un stat:
 *   this._hud.showStatDelta('biodiversidad', -10);
 */

import EventBus from '../systems/EventBus.js';
import { EVENTS, STATS, DEPTHS, GAME } from '../utils/Constants.js';

// ─── CONFIGURACIÓN VISUAL ────────────────────────────────────────────────────

const FLASH_COLORS = Object.freeze({
  [STATS.ECONOMIA]:      0x22c55e,
  [STATS.CONTAMINACION]: 0xef4444,
  [STATS.BIODIVERSIDAD]: 0x06b6d4,
  [STATS.SALUD_HUMANA]:  0x3b82f6,
});

const DELTA_COLORS = Object.freeze({
  positive: '#44ff88',
  negative: '#ff4444',
  neutral:  '#ffffff',
});

export default class HUD {

  /**
   * @param {Phaser.Scene} scene - Escena Phaser que contiene este HUD
   */
  constructor(scene) {
    this.scene   = scene;
    this._active = true;

    // Pool de textos flotantes de delta (reutilizados para evitar GC)
    this._deltaPool  = [];
    this._deltaQueue = [];

    // Overlay de flash de pantalla completa (para cambios drásticos de stat)
    this._flashRect = scene.add.rectangle(
      GAME.WIDTH / 2, GAME.HEIGHT / 2,
      GAME.WIDTH, GAME.HEIGHT,
      0xff0000
    )
    .setAlpha(0)
    .setDepth(DEPTHS.HUD_CANVAS + 5)
    .setScrollFactor(0); // Fijo en pantalla independientemente de la cámara

    // Suscribir al EventBus para reaccionar a cambios de stat
    EventBus.on(EVENTS.STAT_UPDATE, this._onStatUpdate, this);

    // Pre-crear pool de 6 textos flotantes
    for (let i = 0; i < 6; i++) {
      const t = scene.add.text(0, 0, '', {
        fontFamily: 'monospace',
        fontSize:   '12px',
        color:      DELTA_COLORS.neutral,
        stroke:     '#000000',
        strokeThickness: 3,
      })
      .setAlpha(0)
      .setDepth(DEPTHS.HUD_CANVAS + 4)
      .setScrollFactor(0);

      this._deltaPool.push({ text: t, inUse: false });
    }
  }

  // ─── HANDLER DEL EVENTBUS ─────────────────────────────────────────────────

  /**
   * Reacciona a cambios de stat:
   *   - Cambio grande (±20+) → flash de pantalla
   *   - Cualquier cambio → texto flotante de delta
   */
  _onStatUpdate({ key, value }) {
    // Recuperar valor anterior (se guarda en _prevStats)
    if (!this._prevStats) this._prevStats = {};
    const prev  = this._prevStats[key] ?? value;
    const delta = value - prev;
    this._prevStats[key] = value;

    if (delta === 0) return;

    // Mostrar texto flotante de delta en esquina superior izquierda del HUD
    const x = 110;
    const y = 40 + Object.values(STATS).indexOf(key) * 22;
    this.showStatDelta(key, delta, x, y);

    // Flash de pantalla para caídas graves (≤ −20 en un tick)
    if (delta <= -20) {
      this._flashScreen(FLASH_COLORS[key] ?? 0xff0000, 0.35);
    }
  }

  // ─── API PÚBLICA ──────────────────────────────────────────────────────────

  /**
   * Muestra un texto flotante de cambio de stat.
   * Usa el pool de textos para evitar crear/destruir objetos.
   *
   * @param {string} statKey - STATS.*
   * @param {number} delta   - Cantidad de cambio (+/-)
   * @param {number} x       - Posición X en pantalla (sin scroll)
   * @param {number} y       - Posición Y en pantalla
   */
  showStatDelta(statKey, delta, x, y) {
    // Obtener un texto libre del pool
    const slot = this._deltaPool.find((s) => !s.inUse);
    if (!slot) return; // Pool agotado — ignorar este delta

    const sign  = delta > 0 ? '+' : '';
    const color = delta > 0 ? DELTA_COLORS.positive : DELTA_COLORS.negative;
    const label = this._statLabel(statKey);

    slot.inUse = true;
    slot.text
      .setText(`${sign}${Math.round(delta)} ${label}`)
      .setColor(color)
      .setPosition(x ?? 20, y ?? 20)
      .setAlpha(1);

    // Animación: sube y desaparece
    this.scene.tweens.add({
      targets:  slot.text,
      y:        (y ?? 20) - 28,
      alpha:    0,
      duration: 1200,
      ease:     'Power2',
      onComplete: () => {
        slot.inUse = false;
      },
    });
  }

  /**
   * Flash de pantalla completa de un color.
   * Útil para impactos narrativos o cambios drásticos de stat.
   *
   * @param {number} color   - Color Phaser hex (0xRRGGBB)
   * @param {number} [alpha] - Alpha máximo del flash (0–1, default 0.25)
   */
  _flashScreen(color, alpha) {
    this._flashRect
      .setFillStyle(color)
      .setAlpha(alpha ?? 0.25);

    this.scene.tweens.add({
      targets:  this._flashRect,
      alpha:    0,
      duration: 600,
      ease:     'Power2',
    });
  }

  /**
   * Dispara un flash de pantalla manualmente desde una escena.
   * @param {number} color
   * @param {number} [alpha]
   */
  flashScreen(color, alpha) {
    this._flashScreen(color, alpha);
  }

  /**
   * Actualizar (llamar desde scene.update()).
   * Actualmente vacío — la lógica usa tweens de Phaser.
   * Reservado para futura lógica por frame.
   */
  update() {}

  // ─── HELPERS ─────────────────────────────────────────────────────────────

  /**
   * Etiqueta corta de cada stat para los textos flotantes.
   * Switch estático — sin acceso dinámico por string.
   */
  _statLabel(key) {
    switch (key) {
      case STATS.ECONOMIA:      return 'Eco';
      case STATS.CONTAMINACION: return 'Cont';
      case STATS.BIODIVERSIDAD: return 'Bio';
      case STATS.SALUD_HUMANA:  return 'Sal';
      default:                  return '';
    }
  }

  // ─── LIMPIEZA ─────────────────────────────────────────────────────────────

  /**
   * Destruir el HUD y limpiar listeners.
   * Llamar en scene.shutdown().
   */
  destroy() {
    EventBus.off(EVENTS.STAT_UPDATE, this._onStatUpdate, this);

    this._flashRect.destroy();

    for (const slot of this._deltaPool) {
      slot.text.destroy();
    }
    this._deltaPool  = [];
    this._active     = false;
  }
}