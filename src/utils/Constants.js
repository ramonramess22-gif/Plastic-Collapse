/**
 * @file Constants.js
 * @description Constantes globales del proyecto Plastic Collapse.
 *
 * SEGURIDAD:
 *   - Archivo puramente declarativo: sólo Object.freeze() y literales.
 *   - Sin eval(), sin new Function(), sin código dinámico.
 *   - Compatible con CSP strict-dynamic.
 *
 * USO:
 *   import { GAME, STAGES, STATS, KEYS, EVENTS, LAYERS, DEPTHS } from './Constants.js';
 */

// ─── CONFIGURACIÓN DEL JUEGO ─────────────────────────────────────────────────

/**
 * Dimensiones y propiedades base del juego.
 * Todas las escenas y el canvas usan estos valores de referencia.
 */
export const GAME = Object.freeze({
  WIDTH:          800,
  HEIGHT:         600,
  TITLE:          'Plastic Collapse',
  VERSION:        '1.0.0',
  SAVE_KEY:       'plastic_collapse_save',   // Clave en localStorage
  TILE_SIZE:      32,                        // Píxeles por tile
  PLAYER_SPEED:   140,                       // Velocidad base del jugador (px/s)
  INTERACT_RANGE: 48,                        // Rango de interacción con NPCs (px)
});

// ─── ETAPAS NARRATIVAS ───────────────────────────────────────────────────────

/**
 * Identificadores de etapa.
 * Se usan como claves para stageData.js y como nombres de escena Phaser.
 */
export const STAGES = Object.freeze({
  BOOT:         'BootScene',
  PRELOAD:      'PreloadScene',
  MAIN_MENU:    'MainMenuScene',
  STAGE_1:      'Stage1_NaturalWorld',
  STAGE_2:      'Stage2_Factory',
  STAGE_3:      'Stage3_Warning',
  STAGE_4:      'Stage4_Consequences',
  STAGE_5:      'Stage5_SocialImpact',
  STAGE_6:      'Stage6_War',
  STAGE_7:      'Stage7_Animals',
  STAGE_8:      'Stage8_FinalWorld',
  END:          'EndScene',
});

/**
 * Orden secuencial de las etapas del juego (sin boot/preload/menú).
 * TransitionManager lo usa para saber a qué escena avanzar.
 */
export const STAGE_ORDER = Object.freeze([
  STAGES.STAGE_1,
  STAGES.STAGE_2,
  STAGES.STAGE_3,
  STAGES.STAGE_4,
  STAGES.STAGE_5,
  STAGES.STAGE_6,
  STAGES.STAGE_7,
  STAGES.STAGE_8,
  STAGES.END,
]);

// ─── VARIABLES DEL SISTEMA (STATS) ───────────────────────────────────────────

/**
 * Claves de las 4 variables globales del sistema.
 * GameState.js las usa como propiedades.
 * HUDManager.js las usa para buscar los elementos DOM (#bar-*, #val-*).
 */
export const STATS = Object.freeze({
  ECONOMIA:       'economia',
  CONTAMINACION:  'contaminacion',
  BIODIVERSIDAD:  'biodiversidad',
  SALUD_HUMANA:   'salud_humana',
});

/** Valores iniciales de cada stat al comenzar el juego */
export const STATS_INITIAL = Object.freeze({
  [STATS.ECONOMIA]:      100,
  [STATS.CONTAMINACION]:   0,
  [STATS.BIODIVERSIDAD]: 100,
  [STATS.SALUD_HUMANA]:  100,
});

/** Límites mínimo y máximo de cualquier stat */
export const STATS_BOUNDS = Object.freeze({
  MIN: 0,
  MAX: 100,
});

// ─── TECLAS DE CONTROL ───────────────────────────────────────────────────────

/**
 * Códigos de tecla para el input del jugador.
 * Player.js usa estas constantes — nunca strings mágicos.
 */
export const KEYS = Object.freeze({
  UP:        'UP',
  DOWN:      'DOWN',
  LEFT:      'LEFT',
  RIGHT:     'RIGHT',
  W:         'W',
  A:         'A',
  S:         'S',
  D:         'D',
  INTERACT:  'E',        // Tecla de interacción con NPCs/objetos
  SPACE:     'SPACE',    // Avanzar diálogo
  ESCAPE:    'ESC',      // Menú de pausa / cerrar diálogo
});

// ─── EVENTOS DEL EVENTBUS ────────────────────────────────────────────────────

/**
 * Nombres de eventos del sistema EventBus.
 * Todos los emit() y on() deben usar estas constantes — nunca strings literales.
 *
 * Convención: 'dominio:accion'
 */
export const EVENTS = Object.freeze({
  // Stats / HUD
  STAT_UPDATE:          'stat:update',        // { key: STATS.X, value: number }
  STAT_BATCH_UPDATE:    'stat:batchUpdate',   // { economia, contaminacion, ... }

  // Diálogo
  DIALOGUE_START:       'dialogue:start',     // { speaker, lines: [] }
  DIALOGUE_NEXT:        'dialogue:next',      // sin payload
  DIALOGUE_END:         'dialogue:end',       // sin payload

  // Escenas / transiciones
  SCENE_TRANSITION_IN:  'scene:fadeIn',       // sin payload
  SCENE_TRANSITION_OUT: 'scene:fadeOut',      // sin payload
  STAGE_COMPLETE:       'stage:complete',     // { stageKey }
  STAGE_CHANGED:        'stage:changed',      // { stageKey, stageName, index }

  // Interacción
  INTERACTION_SHOW:     'interact:show',      // { x, y } posición en canvas
  INTERACTION_HIDE:     'interact:hide',      // sin payload
  PLAYER_INTERACT:      'player:interact',    // { target: NPC|Object }

  // Sistema
  GAME_SAVE:            'game:save',          // sin payload
  GAME_LOAD:            'game:load',          // sin payload
  GAME_RESET:           'game:reset',         // sin payload
  LOADING_PROGRESS:     'loading:progress',   // { percent: 0-100 }
  LOADING_COMPLETE:     'loading:complete',   // sin payload
});

// ─── CAPAS DEL TILEMAP ───────────────────────────────────────────────────────

/**
 * Nombres de capas en los archivos Tiled JSON (*.json en assets/tilemaps/).
 * Deben coincidir exactamente con los nombres de layer en el editor Tiled.
 */
export const LAYERS = Object.freeze({
  GROUND:       'Ground',       // Capa base del suelo
  DECORATIONS:  'Decorations',  // Elementos decorativos sin colisión
  OBJECTS:      'Objects',      // Objetos interactuables (colisión)
  COLLISIONS:   'Collisions',   // Capa invisible de colisiones
  ABOVE_PLAYER: 'AbovePlayer',  // Se renderiza sobre el jugador (profundidad)
  TRIGGERS:     'Triggers',     // Zonas de trigger (entradas a edificios, etc.)
});

// ─── PROFUNDIDADES DE RENDERIZADO ────────────────────────────────────────────

/**
 * Z-order (depth) en el canvas de Phaser.
 * Mayor valor = se renderiza encima.
 */
export const DEPTHS = Object.freeze({
  GROUND:       0,
  ENVIRONMENT:  1,
  NPC_BELOW:    2,
  PLAYER:       5,
  NPC_ABOVE:    6,
  PARTICLES:    8,
  ABOVE_ALL:    10,
  HUD_CANVAS:   20,   // Elementos HUD dibujados en canvas (no DOM)
});

// ─── COLORES POR ETAPA (hexadecimal Phaser) ───────────────────────────────────

/**
 * Color de fondo de cada etapa para el canvas de Phaser.
 * Los valores son enteros hexadecimales Phaser (0xRRGGBB).
 * ColorPalette.js los extiende con paletas completas por etapa.
 */
export const STAGE_BG_COLORS = Object.freeze({
  [STAGES.STAGE_1]: 0x2d5a1b,   // Verde bosque sano
  [STAGES.STAGE_2]: 0x3d2b1a,   // Marrón industrial
  [STAGES.STAGE_3]: 0x1a2a3a,   // Azul oscuro — tensión
  [STAGES.STAGE_4]: 0x4a2c0a,   // Naranja quemado — consecuencias
  [STAGES.STAGE_5]: 0x2a1a1a,   // Rojo oscuro — conflicto social
  [STAGES.STAGE_6]: 0x1a1a1a,   // Negro — guerra
  [STAGES.STAGE_7]: 0x1a2e1a,   // Verde tenue — encuentro animales
  [STAGES.STAGE_8]: 0x0f0f0f,   // Casi negro — colapso total
});

// ─── NOMBRES LEGIBLES DE ETAPAS ──────────────────────────────────────────────

/** Nombres que se muestran en el HUD (#hud-stage-name) y en transiciones */
export const STAGE_NAMES = Object.freeze({
  [STAGES.STAGE_1]: 'Mundo Natural',
  [STAGES.STAGE_2]: 'La Fábrica',
  [STAGES.STAGE_3]: 'La Advertencia',
  [STAGES.STAGE_4]: 'Consecuencias',
  [STAGES.STAGE_5]: 'Impacto Social',
  [STAGES.STAGE_6]: 'La Guerra',
  [STAGES.STAGE_7]: 'Los Animales Hablan',
  [STAGES.STAGE_8]: 'El Mundo Final',
  [STAGES.END]:     'Fin',
});

// ─── CONFIGURACIÓN DE AUDIO ──────────────────────────────────────────────────

export const AUDIO = Object.freeze({
  MUSIC_VOLUME_DEFAULT: 0.5,
  SFX_VOLUME_DEFAULT:   0.8,
  MUSIC_FADE_DURATION:  1500,   // ms para fadeIn/fadeOut de música
});

// ─── TIEMPOS Y DURACIONES ────────────────────────────────────────────────────

export const TIMING = Object.freeze({
  TRANSITION_FADE:   400,    // ms del fade negro entre escenas
  DIALOGUE_BLIP:     40,     // ms entre cada carácter del efecto typewriter
  HUD_UPDATE_SPEED:  500,    // ms de transición CSS de las barras HUD
  SPLASH_DURATION:   2000,   // ms que dura la pantalla de BootScene
});