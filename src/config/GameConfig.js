/**
 * @file GameConfig.js
 * @description Configuración central del juego Phaser.
 *
 * Este archivo importa TODAS las escenas y exporta el objeto de configuración
 * que main.js pasa a new Phaser.Game(config).
 *
 * ORDEN DE IMPORTACIÓN:
 * El orden en el array scene[] determina el orden en que Phaser las registra.
 * La primera escena del array es la que arranca al inicializar el juego.
 *
 * SEGURIDAD:
 *   - Sin eval(), sin código dinámico.
 *   - Configuración estática con Object.freeze().
 *   - Compatible con CSP strict.
 */

// ─── IMPORTACIÓN DE ESCENAS (en orden de ejecución) ──────────────────────────

import BootScene           from '../scenes/BootScene.js';
import PreloadScene        from '../scenes/PreloadScene.js';
import MainMenuScene       from '../scenes/MainMenuScene.js';
import Stage1_NaturalWorld from '../scenes/Stage1_NaturalWorld.js';
import Stage2_Factory      from '../scenes/Stage2_Factory.js';
import Stage3_Warning      from '../scenes/Stage3_Warning.js';
import Stage4_Consequences from '../scenes/Stage4_Consequences.js';
import Stage5_SocialImpact from '../scenes/Stage5_SocialImpact.js';
import Stage6_War          from '../scenes/Stage6_War.js';
import Stage7_Animals      from '../scenes/Stage7_Animals.js';
import Stage8_FinalWorld   from '../scenes/Stage8_FinalWorld.js';
import EndScene            from '../scenes/EndScene.js';

import { GAME } from '../utils/Constants.js';

// ─── CONFIGURACIÓN DE PHASER ──────────────────────────────────────────────────

/**
 * Objeto de configuración de Phaser.Game.
 *
 * type: Phaser.AUTO → Phaser detecta automáticamente WebGL o Canvas2D.
 *       Si WebGL no está disponible (dispositivos antiguos), usa Canvas2D.
 *       Ambos son seguros y no requieren eval() ni código dinámico.
 *
 * parent: 'game-container' → Phaser inserta el <canvas> dentro de #game-container,
 *         que ya está definido en index.html.
 *
 * scale: Phaser.Scale.FIT + CENTER_BOTH → el canvas se escala para caber en
 *        la ventana manteniendo la relación de aspecto 4:3 (800×600).
 */
const GameConfig = {
  type:            Phaser.AUTO,
  width:           GAME.WIDTH,
  height:          GAME.HEIGHT,
  parent:          'game-container',
  backgroundColor: '#0a0a0a',

  // ── Escalado responsive ────────────────────────────────────────────────────
  scale: {
    mode:         Phaser.Scale.FIT,
    autoCenter:   Phaser.Scale.CENTER_BOTH,
    width:        GAME.WIDTH,
    height:       GAME.HEIGHT,
    min: { width: 320,        height: 240        },
    max: { width: GAME.WIDTH * 2, height: GAME.HEIGHT * 2 },
  },

  // ── Física Arcade (sin colisiones complejas, sólo AABB) ───────────────────
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },  // Top-down: sin gravedad
      debug:   false,            // Cambiar a true durante desarrollo
    },
  },

  // ── Configuración del renderer ────────────────────────────────────────────
  render: {
    antialias:       false,   // false = pixel art nítido (sin suavizado)
    pixelArt:        true,    // Activa renderizado óptimo para pixel art
    roundPixels:     true,    // Evita sub-pixel rendering en sprites
    transparent:     false,
    clearBeforeRender: true,
  },

  // ── Audio ─────────────────────────────────────────────────────────────────
  audio: {
    disableWebAudio: false,   // Preferir WebAudio API cuando esté disponible
  },

  // ── Input ─────────────────────────────────────────────────────────────────
  input: {
    keyboard:      true,
    mouse:         true,
    touch:         true,
    gamepad:       false,
  },

  // ── Callbacks del ciclo de vida ───────────────────────────────────────────
  callbacks: {
    /**
     * Se llama justo antes de que Phaser arranque.
     * Aquí podemos registrar plugins globales si los hubiera.
     * SEGURIDAD: Sin eval(), sin código dinámico.
     */
    preBoot: function(game) {
      // Nada por ahora — reservado para plugins futuros
    },

    /**
     * Se llama después de que Phaser arranca completamente.
     */
    postBoot: function(game) {
      console.info(`[${GAME.TITLE}] v${GAME.VERSION} — Motor Phaser iniciado.`);
    },
  },

  // ── ESCENAS (en orden de registro) ────────────────────────────────────────
  //
  // La primera escena arranca automáticamente.
  // Las demás se cargan con scene.start('NombreEscena').
  //
  // TODAS las escenas deben estar aquí para que Phaser las conozca.
  scene: [
    BootScene,            // 1. Splash / configuración inicial
    PreloadScene,         // 2. Carga de assets
    MainMenuScene,        // 3. Menú principal
    Stage1_NaturalWorld,  // 4. Mundo natural
    Stage2_Factory,       // 5. Fábrica de plástico
    Stage3_Warning,       // 6. Advertencia del científico
    Stage4_Consequences,  // 7. Consecuencias ambientales
    Stage5_SocialImpact,  // 8. Impacto social
    Stage6_War,           // 9. Guerra
    Stage7_Animals,       // 10. Animales hablan
    Stage8_FinalWorld,    // 11. Mundo final
    EndScene,             // 12. Pantalla final
  ],
};

export default GameConfig;