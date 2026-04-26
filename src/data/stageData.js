/**
 * @file stageData.js
 * @description Configuración narrativa, de stats y de NPCs para cada etapa.
 *
 * Cada escena importa su configuración desde aquí en lugar de tener
 * los valores hardcodeados. Esto hace que ajustar la narrativa no
 * requiera editar las escenas.
 *
 * SEGURIDAD:
 *   - Sólo datos estáticos y literales.
 *   - Sin eval(), sin código ejecutable.
 *   - Object.freeze() en todos los niveles.
 *
 * USO:
 *   import { STAGE_DATA } from '../data/stageData.js';
 *   const config = STAGE_DATA['Stage1_NaturalWorld'];
 */

import { STAGES, STATS } from '../utils/Constants.js';

// ─── ESTRUCTURA DE CADA STAGE_DATA ───────────────────────────────────────────
/**
 * Cada entrada define:
 *   key          — Clave STAGES.* (redundante pero útil para debugging)
 *   tilemapKey   — Clave del mapa Tiled a cargar
 *   tilesetKey   — Clave del tileset a asignar
 *   musicKey     — Clave de audio de la música de fondo
 *   initialStats — Delta de stats al entrar a la etapa (relativo al estado actual)
 *   npcConfigs   — Array de configuraciones de NPCs a spawnear
 *   triggerZones — Zonas que al pisarlas disparan acciones (entrada a edificios, etc.)
 *   ambientParticles — Partículas ambientales (hojas, humo, ceniza...)
 */

export const STAGE_DATA = Object.freeze({

  // ─── ETAPA 1: MUNDO NATURAL ─────────────────────────────────────────────────
  [STAGES.STAGE_1]: Object.freeze({
    key:        STAGES.STAGE_1,
    tilemapKey: 'map_stage1',
    tilesetKey: 'nature_tileset',
    musicKey:   'music_nature',

    // Stats al inicio de la etapa 1 (valores absolutos del mundo sano)
    initialStats: Object.freeze({
      [STATS.ECONOMIA]:      85,
      [STATS.CONTAMINACION]:  2,
      [STATS.BIODIVERSIDAD]: 98,
      [STATS.SALUD_HUMANA]:  95,
    }),

    // NPCs a crear en esta etapa
    npcConfigs: Object.freeze([
      { type: 'animal', key: 'bird_healthy',  anim: 'bird_healthy_anim',  x: 320, y: 200, dialogueKey: null },
      { type: 'animal', key: 'deer_healthy',  anim: 'deer_healthy_anim',  x: 540, y: 340, dialogueKey: null },
      { type: 'animal', key: 'bee_healthy',   anim: 'bee_healthy_anim',   x: 200, y: 280, dialogueKey: null },
      { type: 'animal', key: 'fish_healthy',  anim: 'fish_healthy_anim',  x: 650, y: 440, dialogueKey: null },
    ]),

    // Zonas de trigger: al entrar el jugador → transición a otra escena
    triggerZones: Object.freeze([
      {
        id:          'factory_entrance',
        x: 750, y: 300, width: 32, height: 32,
        targetScene: STAGES.STAGE_2,
        label:       'Fábrica Vargas & Mora →',
      },
    ]),

    ambientParticles: Object.freeze({ type: 'leaves', color: 0x4aad2c, count: 12 }),
  }),

  // ─── ETAPA 2: FÁBRICA ───────────────────────────────────────────────────────
  [STAGES.STAGE_2]: Object.freeze({
    key:        STAGES.STAGE_2,
    tilemapKey: 'map_stage2',
    tilesetKey: 'factory_tileset',
    musicKey:   'music_factory',

    // Al entrar a la fábrica, la contaminación sube
    initialStats: Object.freeze({
      [STATS.ECONOMIA]:      92,
      [STATS.CONTAMINACION]: 18,
      [STATS.BIODIVERSIDAD]: 80,
      [STATS.SALUD_HUMANA]:  88,
    }),

    npcConfigs: Object.freeze([
      { type: 'npc', key: 'worker_idle', anim: 'worker_idle_anim', x: 200, y: 350, dialogueKey: 'workers.precarity' },
      { type: 'npc', key: 'businessman_idle', anim: 'businessman_idle_anim', x: 580, y: 200, dialogueKey: 'businessman.stage3_dismissal_1' },
    ]),

    triggerZones: Object.freeze([
      {
        id:          'factory_exit',
        x: 50, y: 300, width: 32, height: 32,
        targetScene: STAGES.STAGE_3,
        label:       '← Salir de la fábrica',
      },
      {
        id:          'oil_pump_zone',
        x: 150, y: 180, width: 64, height: 64,
        targetScene: null,   // null = muestra diálogo, no cambia escena
        dialogueKey: 'narrator.stage2_process',
        label:       'Examinar bomba de extracción',
      },
    ]),

    ambientParticles: Object.freeze({ type: 'smoke', color: 0xaaaaaa, count: 8 }),
  }),

  // ─── ETAPA 3: ADVERTENCIA ───────────────────────────────────────────────────
  [STAGES.STAGE_3]: Object.freeze({
    key:        STAGES.STAGE_3,
    tilemapKey: 'map_stage3',
    tilesetKey: 'city_tileset',
    musicKey:   'music_warning',

    initialStats: Object.freeze({
      [STATS.ECONOMIA]:      88,
      [STATS.CONTAMINACION]: 28,
      [STATS.BIODIVERSIDAD]: 70,
      [STATS.SALUD_HUMANA]:  82,
    }),

    npcConfigs: Object.freeze([
      {
        type: 'npc', key: 'scientist_idle', anim: 'scientist_idle_anim',
        x: 300, y: 280,
        dialogueKey: 'scientist.stage3_warning_intro',
        talkAnim:    'scientist_talk_anim',
      },
      {
        type: 'npc', key: 'businessman_idle', anim: 'businessman_idle_anim',
        x: 520, y: 280,
        dialogueKey: 'businessman.stage3_dismissal_1',
      },
      {
        type: 'npc', key: 'businessman_idle', anim: 'businessman_idle_anim',
        x: 620, y: 310,
        dialogueKey: 'businessman.stage3_dismissal_2',
      },
    ]),

    triggerZones: Object.freeze([
      {
        id:          'to_stage4',
        x: 760, y: 300, width: 32, height: 32,
        targetScene: STAGES.STAGE_4,
        label:       'Continuar →',
      },
    ]),

    ambientParticles: Object.freeze({ type: 'dust', color: 0x606080, count: 6 }),
  }),

  // ─── ETAPA 4: CONSECUENCIAS ─────────────────────────────────────────────────
  [STAGES.STAGE_4]: Object.freeze({
    key:        STAGES.STAGE_4,
    tilemapKey: 'map_stage4',
    tilesetKey: 'nature_tileset',  // Mismo tileset pero con tintes oscuros
    musicKey:   'music_collapse',

    initialStats: Object.freeze({
      [STATS.ECONOMIA]:      70,
      [STATS.CONTAMINACION]: 52,
      [STATS.BIODIVERSIDAD]: 42,
      [STATS.SALUD_HUMANA]:  65,
    }),

    npcConfigs: Object.freeze([
      { type: 'animal', key: 'bird_sick',    anim: 'bird_sick_anim',    x: 240, y: 200, dialogueKey: 'animals.bird' },
      { type: 'animal', key: 'fish_sick',    anim: 'fish_sick_anim',    x: 560, y: 380, dialogueKey: 'animals.fish' },
      { type: 'animal', key: 'deer_stressed',anim: 'deer_stressed_anim',x: 400, y: 300, dialogueKey: 'animals.deer' },
      { type: 'animal', key: 'bee_dying',    anim: 'bee_dying_anim',    x: 320, y: 150, dialogueKey: 'animals.bee' },
    ]),

    triggerZones: Object.freeze([
      {
        id: 'to_stage5',
        x: 760, y: 300, width: 32, height: 32,
        targetScene: STAGES.STAGE_5,
        label: 'Continuar →',
      },
    ]),

    ambientParticles: Object.freeze({ type: 'microplastics', color: 0xff6600, count: 20 }),
  }),

  // ─── ETAPA 5: IMPACTO SOCIAL ────────────────────────────────────────────────
  [STAGES.STAGE_5]: Object.freeze({
    key:        STAGES.STAGE_5,
    tilemapKey: 'map_stage5',
    tilesetKey: 'city_tileset',
    musicKey:   'music_collapse',

    initialStats: Object.freeze({
      [STATS.ECONOMIA]:      55,
      [STATS.CONTAMINACION]: 65,
      [STATS.BIODIVERSIDAD]: 30,
      [STATS.SALUD_HUMANA]:  50,
    }),

    npcConfigs: Object.freeze([
      { type: 'npc', key: 'worker_revolt', anim: 'worker_revolt_anim', x: 200, y: 320, dialogueKey: 'workers.revolt' },
      { type: 'npc', key: 'worker_revolt', anim: 'worker_revolt_anim', x: 350, y: 340, dialogueKey: 'workers.revolt' },
      { type: 'npc', key: 'businessman_idle', anim: 'businessman_idle_anim', x: 600, y: 200, dialogueKey: 'businessman.stage5_confronted' },
    ]),

    triggerZones: Object.freeze([
      {
        id: 'to_stage6',
        x: 760, y: 300, width: 32, height: 32,
        targetScene: STAGES.STAGE_6,
        label: 'Continuar →',
      },
    ]),

    ambientParticles: Object.freeze({ type: 'sparks', color: 0xff4040, count: 15 }),
  }),

  // ─── ETAPA 6: GUERRA ────────────────────────────────────────────────────────
  [STAGES.STAGE_6]: Object.freeze({
    key:        STAGES.STAGE_6,
    tilemapKey: 'map_stage6',
    tilesetKey: 'war_tileset',
    musicKey:   'music_war',

    initialStats: Object.freeze({
      [STATS.ECONOMIA]:      22,
      [STATS.CONTAMINACION]: 80,
      [STATS.BIODIVERSIDAD]: 18,
      [STATS.SALUD_HUMANA]:  28,
    }),

    npcConfigs: Object.freeze([]),  // No hay NPCs con quién hablar en la guerra

    triggerZones: Object.freeze([
      {
        id: 'to_stage7',
        x: 760, y: 300, width: 32, height: 32,
        targetScene: STAGES.STAGE_7,
        label: 'Seguir adelante →',
      },
    ]),

    ambientParticles: Object.freeze({ type: 'ash', color: 0xcccccc, count: 25 }),
  }),

  // ─── ETAPA 7: ANIMALES ──────────────────────────────────────────────────────
  [STAGES.STAGE_7]: Object.freeze({
    key:        STAGES.STAGE_7,
    tilemapKey: 'map_stage7',
    tilesetKey: 'nature_tileset',
    musicKey:   'music_end',

    initialStats: Object.freeze({
      [STATS.ECONOMIA]:      15,
      [STATS.CONTAMINACION]: 85,
      [STATS.BIODIVERSIDAD]: 12,
      [STATS.SALUD_HUMANA]:  20,
    }),

    npcConfigs: Object.freeze([
      { type: 'animal', key: 'deer_stressed', anim: 'deer_stressed_anim', x: 250, y: 300, dialogueKey: 'animals.deer',
        speakerName: 'Ciervo' },
      { type: 'animal', key: 'bird_sick',     anim: 'bird_sick_anim',     x: 420, y: 180, dialogueKey: 'animals.bird',
        speakerName: 'Pájaro' },
      { type: 'animal', key: 'fish_sick',     anim: 'fish_sick_anim',     x: 600, y: 400, dialogueKey: 'animals.fish',
        speakerName: 'Pez' },
      { type: 'animal', key: 'bee_dying',     anim: 'bee_dying_anim',     x: 150, y: 240, dialogueKey: 'animals.bee',
        speakerName: 'Abeja' },
      {
        type: 'npc', key: 'scientist_idle', anim: 'scientist_idle_anim',
        x: 400, y: 320,
        dialogueKey: 'scientist.stage7_reflection',
        speakerName: 'Dr. García',
        talkAnim:    'scientist_talk_anim',
      },
    ]),

    triggerZones: Object.freeze([
      {
        id: 'to_stage8',
        x: 760, y: 300, width: 32, height: 32,
        targetScene: STAGES.STAGE_8,
        label: 'Ver el final →',
      },
    ]),

    ambientParticles: Object.freeze({ type: 'dust', color: 0x30c060, count: 5 }),
  }),

  // ─── ETAPA 8: MUNDO FINAL ───────────────────────────────────────────────────
  [STAGES.STAGE_8]: Object.freeze({
    key:        STAGES.STAGE_8,
    tilemapKey: 'map_stage8',
    tilesetKey: 'collapse_tileset',
    musicKey:   'music_end',

    initialStats: Object.freeze({
      [STATS.ECONOMIA]:       5,
      [STATS.CONTAMINACION]: 95,
      [STATS.BIODIVERSIDAD]:  5,
      [STATS.SALUD_HUMANA]:  10,
    }),

    npcConfigs: Object.freeze([]),

    triggerZones: Object.freeze([
      {
        id: 'to_end',
        x: 400, y: 560, width: 800, height: 40,  // Toda la zona inferior
        targetScene: STAGES.END,
        label: null,
      },
    ]),

    ambientParticles: Object.freeze({ type: 'ash', color: 0x202020, count: 30 }),
  }),
});