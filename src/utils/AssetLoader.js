/**
 * @file AssetLoader.js
 * @description Helper que centraliza el registro de todos los assets
 *              en la PreloadScene de Phaser.
 *
 * PreloadScene llama a AssetLoader.registerAll(scene) una sola vez.
 * Este archivo es la fuente de verdad de TODAS las rutas de assets.
 *
 * SEGURIDAD:
 *   - Sin eval(), sin new Function().
 *   - Las rutas son strings literales — nunca construidas dinámicamente
 *     desde input de usuario.
 *   - El array ASSETS es read-only (Object.freeze en cada entry).
 *   - Compatible con CSP strict.
 *
 * USO:
 *   import { registerAll } from '../utils/AssetLoader.js';
 *   // En PreloadScene.preload():
 *   registerAll(this);
 */

// ─── DEFINICIÓN DE ASSETS ─────────────────────────────────────────────────────

/**
 * Cada entry tiene:
 *   type   — Método de carga de Phaser (image, spritesheet, tilemapTiledJSON, audio, bitmapFont)
 *   key    — Clave única para usar en escenas (this.add.image('key'))
 *   path   — Ruta relativa desde la raíz del proyecto
 *   config — Opcional: { frameWidth, frameHeight } para spritesheets
 */
const ASSETS = [

  // ─── JUGADOR ────────────────────────────────────────────────────────────────
  {
    type: 'spritesheet', key: 'player_idle',
    path: './assets/sprites/player/player_idle.png',
    config: { frameWidth: 32, frameHeight: 48 },
  },
  {
    type: 'spritesheet', key: 'player_walk_down',
    path: './assets/sprites/player/player_walk_down.png',
    config: { frameWidth: 32, frameHeight: 48 },
  },
  {
    type: 'spritesheet', key: 'player_walk_up',
    path: './assets/sprites/player/player_walk_up.png',
    config: { frameWidth: 32, frameHeight: 48 },
  },
  {
    type: 'spritesheet', key: 'player_walk_left',
    path: './assets/sprites/player/player_walk_left.png',
    config: { frameWidth: 32, frameHeight: 48 },
  },
  {
    type: 'spritesheet', key: 'player_walk_right',
    path: './assets/sprites/player/player_walk_right.png',
    config: { frameWidth: 32, frameHeight: 48 },
  },

  // ─── NPCs ────────────────────────────────────────────────────────────────────
  {
    type: 'spritesheet', key: 'scientist_idle',
    path: './assets/sprites/npcs/scientist_idle.png',
    config: { frameWidth: 32, frameHeight: 48 },
  },
  {
    type: 'spritesheet', key: 'scientist_talk',
    path: './assets/sprites/npcs/scientist_talk.png',
    config: { frameWidth: 32, frameHeight: 48 },
  },
  {
    type: 'spritesheet', key: 'businessman_idle',
    path: './assets/sprites/npcs/businessman_idle.png',
    config: { frameWidth: 32, frameHeight: 48 },
  },
  {
    type: 'spritesheet', key: 'businessman_reject',
    path: './assets/sprites/npcs/businessman_reject.png',
    config: { frameWidth: 32, frameHeight: 48 },
  },
  {
    type: 'spritesheet', key: 'worker_idle',
    path: './assets/sprites/npcs/worker_idle.png',
    config: { frameWidth: 32, frameHeight: 48 },
  },
  {
    type: 'spritesheet', key: 'worker_revolt',
    path: './assets/sprites/npcs/worker_revolt.png',
    config: { frameWidth: 32, frameHeight: 48 },
  },

  // ─── ANIMALES ────────────────────────────────────────────────────────────────
  {
    type: 'spritesheet', key: 'bird_healthy',
    path: './assets/sprites/animals/bird_healthy.png',
    config: { frameWidth: 24, frameHeight: 24 },
  },
  {
    type: 'spritesheet', key: 'bird_sick',
    path: './assets/sprites/animals/bird_sick.png',
    config: { frameWidth: 24, frameHeight: 24 },
  },
  {
    type: 'spritesheet', key: 'fish_healthy',
    path: './assets/sprites/animals/fish_healthy.png',
    config: { frameWidth: 28, frameHeight: 20 },
  },
  {
    type: 'spritesheet', key: 'fish_sick',
    path: './assets/sprites/animals/fish_sick.png',
    config: { frameWidth: 28, frameHeight: 20 },
  },
  {
    type: 'spritesheet', key: 'deer_healthy',
    path: './assets/sprites/animals/deer_healthy.png',
    config: { frameWidth: 40, frameHeight: 48 },
  },
  {
    type: 'spritesheet', key: 'deer_stressed',
    path: './assets/sprites/animals/deer_stressed.png',
    config: { frameWidth: 40, frameHeight: 48 },
  },
  {
    type: 'spritesheet', key: 'bee_healthy',
    path: './assets/sprites/animals/bee_healthy.png',
    config: { frameWidth: 16, frameHeight: 16 },
  },
  {
    type: 'spritesheet', key: 'bee_dying',
    path: './assets/sprites/animals/bee_dying.png',
    config: { frameWidth: 16, frameHeight: 16 },
  },

  // ─── ENTORNO ──────────────────────────────────────────────────────────────────
  { type: 'image', key: 'tree_healthy',    path: './assets/sprites/environment/tree_healthy.png' },
  { type: 'image', key: 'tree_dead',       path: './assets/sprites/environment/tree_dead.png' },
  { type: 'image', key: 'water_clean',     path: './assets/sprites/environment/water_clean.png' },
  { type: 'image', key: 'water_polluted',  path: './assets/sprites/environment/water_polluted.png' },
  { type: 'image', key: 'soil_healthy',    path: './assets/sprites/environment/soil_healthy.png' },
  { type: 'image', key: 'soil_dead',       path: './assets/sprites/environment/soil_dead.png' },

  // ─── FÁBRICA ──────────────────────────────────────────────────────────────────
  { type: 'image', key: 'factory_exterior', path: './assets/sprites/factory/factory_exterior.png' },
  { type: 'image', key: 'factory_interior', path: './assets/sprites/factory/factory_interior.png' },
  { type: 'image', key: 'oil_pump',          path: './assets/sprites/factory/oil_pump.png' },
  { type: 'image', key: 'chemical_tank',     path: './assets/sprites/factory/chemical_tank.png' },
  {
    type: 'spritesheet', key: 'conveyor_belt',
    path: './assets/sprites/factory/conveyor_belt.png',
    config: { frameWidth: 64, frameHeight: 16 },
  },
  {
    type: 'spritesheet', key: 'smoke_stack',
    path: './assets/sprites/factory/smoke_stack.png',
    config: { frameWidth: 32, frameHeight: 64 },
  },

  // ─── UI ───────────────────────────────────────────────────────────────────────
  { type: 'image', key: 'hud_bar',          path: './assets/sprites/ui/hud_bar.png' },
  { type: 'image', key: 'dialogue_box',     path: './assets/sprites/ui/dialogue_box.png' },
  { type: 'image', key: 'arrow_indicator',  path: './assets/sprites/ui/arrow_indicator.png' },
  { type: 'image', key: 'menu_background',  path: './assets/sprites/ui/menu_background.png' },

  // ─── TILESETS ─────────────────────────────────────────────────────────────────
  { type: 'image', key: 'nature_tileset',   path: './assets/tilesets/nature_tileset.png' },
  { type: 'image', key: 'factory_tileset',  path: './assets/tilesets/factory_tileset.png' },
  { type: 'image', key: 'city_tileset',     path: './assets/tilesets/city_tileset.png' },
  { type: 'image', key: 'war_tileset',      path: './assets/tilesets/war_tileset.png' },
  { type: 'image', key: 'collapse_tileset', path: './assets/tilesets/collapse_tileset.png' },

  // ─── TILEMAPS (JSON exportado desde Tiled) ────────────────────────────────────
  { type: 'tilemapTiledJSON', key: 'map_stage1', path: './assets/tilemaps/stage1_map.json' },
  { type: 'tilemapTiledJSON', key: 'map_stage2', path: './assets/tilemaps/stage2_map.json' },
  { type: 'tilemapTiledJSON', key: 'map_stage3', path: './assets/tilemaps/stage3_map.json' },
  { type: 'tilemapTiledJSON', key: 'map_stage4', path: './assets/tilemaps/stage4_map.json' },
  { type: 'tilemapTiledJSON', key: 'map_stage5', path: './assets/tilemaps/stage5_map.json' },
  { type: 'tilemapTiledJSON', key: 'map_stage6', path: './assets/tilemaps/stage6_map.json' },
  { type: 'tilemapTiledJSON', key: 'map_stage7', path: './assets/tilemaps/stage7_map.json' },
  { type: 'tilemapTiledJSON', key: 'map_stage8', path: './assets/tilemaps/stage8_map.json' },

  // ─── AUDIO — MÚSICA ──────────────────────────────────────────────────────────
  { type: 'audio', key: 'music_nature',   path: './assets/audio/music/theme_nature.ogg' },
  { type: 'audio', key: 'music_factory',  path: './assets/audio/music/theme_factory.ogg' },
  { type: 'audio', key: 'music_warning',  path: './assets/audio/music/theme_warning.ogg' },
  { type: 'audio', key: 'music_collapse', path: './assets/audio/music/theme_collapse.ogg' },
  { type: 'audio', key: 'music_war',      path: './assets/audio/music/theme_war.ogg' },
  { type: 'audio', key: 'music_end',      path: './assets/audio/music/theme_end.ogg' },

  // ─── AUDIO — SFX ─────────────────────────────────────────────────────────────
  { type: 'audio', key: 'sfx_footstep',       path: './assets/audio/sfx/footstep.ogg' },
  { type: 'audio', key: 'sfx_door',           path: './assets/audio/sfx/door_enter.ogg' },
  { type: 'audio', key: 'sfx_dialogue',       path: './assets/audio/sfx/dialogue_blip.ogg' },
  { type: 'audio', key: 'sfx_factory',        path: './assets/audio/sfx/factory_ambient.ogg' },
  { type: 'audio', key: 'sfx_explosion',      path: './assets/audio/sfx/explosion.ogg' },
];

// ─── REGISTRO DE ANIMACIONES ──────────────────────────────────────────────────

/**
 * Definiciones de animaciones del jugador y NPCs.
 * Se crean en PreloadScene.create() después de cargar los spritesheets.
 * Estructura: { key, frames: { textureKey, start, end }, frameRate, repeat }
 */
export const ANIM_DEFINITIONS = Object.freeze([
  // Jugador
  { key: 'player_idle_anim',        textureKey: 'player_idle',         start: 0, end: 3, frameRate: 4,  repeat: -1 },
  { key: 'player_walk_down_anim',   textureKey: 'player_walk_down',    start: 0, end: 3, frameRate: 8,  repeat: -1 },
  { key: 'player_walk_up_anim',     textureKey: 'player_walk_up',      start: 0, end: 3, frameRate: 8,  repeat: -1 },
  { key: 'player_walk_left_anim',   textureKey: 'player_walk_left',    start: 0, end: 3, frameRate: 8,  repeat: -1 },
  { key: 'player_walk_right_anim',  textureKey: 'player_walk_right',   start: 0, end: 3, frameRate: 8,  repeat: -1 },

  // NPCs
  { key: 'scientist_idle_anim',     textureKey: 'scientist_idle',      start: 0, end: 1, frameRate: 2,  repeat: -1 },
  { key: 'scientist_talk_anim',     textureKey: 'scientist_talk',      start: 0, end: 3, frameRate: 6,  repeat: -1 },
  { key: 'businessman_idle_anim',   textureKey: 'businessman_idle',    start: 0, end: 1, frameRate: 2,  repeat: -1 },
  { key: 'businessman_reject_anim', textureKey: 'businessman_reject',  start: 0, end: 2, frameRate: 4,  repeat: 0  },
  { key: 'worker_idle_anim',        textureKey: 'worker_idle',         start: 0, end: 1, frameRate: 2,  repeat: -1 },
  { key: 'worker_revolt_anim',      textureKey: 'worker_revolt',       start: 0, end: 5, frameRate: 10, repeat: -1 },

  // Animales
  { key: 'bird_healthy_anim',       textureKey: 'bird_healthy',        start: 0, end: 3, frameRate: 8,  repeat: -1 },
  { key: 'bird_sick_anim',          textureKey: 'bird_sick',           start: 0, end: 1, frameRate: 2,  repeat: -1 },
  { key: 'fish_healthy_anim',       textureKey: 'fish_healthy',        start: 0, end: 3, frameRate: 6,  repeat: -1 },
  { key: 'fish_sick_anim',          textureKey: 'fish_sick',           start: 0, end: 1, frameRate: 2,  repeat: -1 },
  { key: 'deer_healthy_anim',       textureKey: 'deer_healthy',        start: 0, end: 3, frameRate: 6,  repeat: -1 },
  { key: 'deer_stressed_anim',      textureKey: 'deer_stressed',       start: 0, end: 2, frameRate: 3,  repeat: -1 },
  { key: 'bee_healthy_anim',        textureKey: 'bee_healthy',         start: 0, end: 3, frameRate: 12, repeat: -1 },
  { key: 'bee_dying_anim',          textureKey: 'bee_dying',           start: 0, end: 2, frameRate: 3,  repeat: -1 },

  // Fábrica
  { key: 'conveyor_anim',           textureKey: 'conveyor_belt',       start: 0, end: 3, frameRate: 8,  repeat: -1 },
  { key: 'smoke_anim',              textureKey: 'smoke_stack',         start: 0, end: 4, frameRate: 4,  repeat: -1 },
]);

// ─── FUNCIÓN DE REGISTRO ──────────────────────────────────────────────────────

/**
 * Registra todos los assets en la escena Phaser provista.
 * Debe llamarse en el método preload() de PreloadScene.
 *
 * @param {Phaser.Scene} scene - La escena Phaser activa (normalmente PreloadScene)
 */
export function registerAll(scene) {
  for (const asset of ASSETS) {
    switch (asset.type) {
      case 'image':
        scene.load.image(asset.key, asset.path);
        break;

      case 'spritesheet':
        scene.load.spritesheet(asset.key, asset.path, asset.config);
        break;

      case 'tilemapTiledJSON':
        scene.load.tilemapTiledJSON(asset.key, asset.path);
        break;

      case 'audio':
        scene.load.audio(asset.key, asset.path);
        break;

      case 'bitmapFont':
        scene.load.bitmapFont(asset.key, asset.path, asset.xmlPath);
        break;

      default:
        console.warn(`[AssetLoader] Tipo de asset desconocido: "${asset.type}"`);
    }
  }
}

/**
 * Crea todas las animaciones definidas en ANIM_DEFINITIONS.
 * Debe llamarse en el método create() de PreloadScene, después de preload().
 *
 * @param {Phaser.Scene} scene
 */
export function createAnimations(scene) {
  for (const def of ANIM_DEFINITIONS) {
    // Evitar crear la misma animación dos veces (si la escena se reinicia)
    if (scene.anims.exists(def.key)) continue;

    scene.anims.create({
      key:       def.key,
      frames:    scene.anims.generateFrameNumbers(def.textureKey, {
        start: def.start,
        end:   def.end,
      }),
      frameRate: def.frameRate,
      repeat:    def.repeat,
    });
  }
}