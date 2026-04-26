/**
 * @file ColorPalette.js
 * @description Paletas de color para cada etapa narrativa del juego.
 *
 * Cada paleta define colores semánticos usados por las escenas para:
 *   - Tintes de sprites (Phaser tint)
 *   - Partículas y efectos visuales
 *   - Overlay de ambiente
 *   - Colores CSS del HUD y diálogos
 *
 * SEGURIDAD:
 *   - Sólo objetos con Object.freeze() y literales.
 *   - Sin eval(), sin código dinámico.
 *
 * USO:
 *   import { getPaletteForStage, PALETTES } from './ColorPalette.js';
 *   const palette = getPaletteForStage('Stage1_NaturalWorld');
 */

import { STAGES } from './Constants.js';

// ─── PALETA BASE ──────────────────────────────────────────────────────────────

/** Colores neutros / UI que no cambian entre etapas */
export const BASE_PALETTE = Object.freeze({
  BLACK:        0x000000,
  WHITE:        0xffffff,
  TRANSPARENT:  0x000000,   // Phaser usa 0x000000 con alpha 0 para transparente
  UI_DARK:      0x0a0a14,
  UI_BORDER:    0x2a2a3a,
  DIALOGUE_BG:  0x0a0a14,
  TEXT_PRIMARY: '#ffffff',
  TEXT_MUTED:   '#8888aa',
  ACCENT:       '#fbbf24',
});

// ─── PALETAS POR ETAPA ────────────────────────────────────────────────────────

/**
 * Cada paleta expone:
 *   primary   — Color dominante del ambiente (Phaser hex int)
 *   secondary — Color secundario
 *   accent    — Color de acento / puntos de interés
 *   sky       — Color del cielo / fondo superior
 *   ground    — Color del suelo base
 *   water     — Color del agua (si aplica)
 *   ambient   — Color del overlay ambiental (con alpha bajo)
 *   hudAccent — Color CSS para el indicador de etapa en el HUD
 *   particle  — Color de partículas ambientales
 */

const PALETTE_STAGE_1 = Object.freeze({
  primary:   0x2d7a1b,   // Verde bosque exuberante
  secondary: 0x4aad2c,   // Verde hoja
  accent:    0xf0e060,   // Amarillo sol filtrado
  sky:       0x5ba3d9,   // Azul cielo limpio
  ground:    0x5a3e1b,   // Tierra fértil
  water:     0x3b9bd4,   // Agua cristalina
  ambient:   0x2d7a1b,   // Verde suave
  hudAccent: '#4ade80',
  particle:  0xf0e060,   // Partículas: polvo de luz / hojas
});

const PALETTE_STAGE_2 = Object.freeze({
  primary:   0x5a3820,   // Marrón industrial oxidado
  secondary: 0x8a6040,   // Beige metálico
  accent:    0xff8c00,   // Naranja de tuberías calientes
  sky:       0x7a6a5a,   // Cielo gris contaminado (inicio)
  ground:    0x3a2a18,   // Tierra compactada
  water:     0x4a3a28,   // Sin agua limpia
  ambient:   0x3a2a18,
  hudAccent: '#f97316',
  particle:  0xaaaaaa,   // Humo gris
});

const PALETTE_STAGE_3 = Object.freeze({
  primary:   0x1a2a3a,   // Azul oscuro — tensión / advertencia
  secondary: 0x2a3a4a,
  accent:    0x60a0ff,   // Azul brillante — esperanza del científico
  sky:       0x1a1a2a,
  ground:    0x2a2a1a,
  water:     0x1a3a5a,
  ambient:   0x1a2a3a,
  hudAccent: '#60a0ff',
  particle:  0x60a0ff,   // Partículas de alerta / datos
});

const PALETTE_STAGE_4 = Object.freeze({
  primary:   0x5a2a0a,   // Naranja quemado — tierra muerta
  secondary: 0x7a4a1a,
  accent:    0xff4400,   // Rojo contaminación
  sky:       0x4a3a1a,   // Cielo anaranjado tóxico
  ground:    0x3a1a0a,   // Tierra estéril
  water:     0x2a1a0a,   // Agua contaminada
  ambient:   0x5a2a0a,
  hudAccent: '#ef4444',
  particle:  0xff6600,   // Partículas: microplásticos flotantes
});

const PALETTE_STAGE_5 = Object.freeze({
  primary:   0x2a1010,   // Rojo oscuro — conflicto
  secondary: 0x3a1a1a,
  accent:    0xff2020,   // Rojo intenso — revuelta
  sky:       0x1a1010,
  ground:    0x1a1010,
  water:     0x1a1010,
  ambient:   0x2a1010,
  hudAccent: '#dc2626',
  particle:  0xff4040,   // Brasas / chispas
});

const PALETTE_STAGE_6 = Object.freeze({
  primary:   0x1a1a1a,   // Casi negro — guerra total
  secondary: 0x2a2a2a,
  accent:    0xff6600,   // Naranjas de incendio
  sky:       0x0a0a0a,   // Cielo negro de humo
  ground:    0x1a1410,   // Escombros
  water:     0x0a0a0a,
  ambient:   0x1a1a1a,
  hudAccent: '#f97316',
  particle:  0xcccccc,   // Ceniza
});

const PALETTE_STAGE_7 = Object.freeze({
  primary:   0x1a2e1a,   // Verde tenue — naturaleza dañada
  secondary: 0x2a3e2a,
  accent:    0x60c060,   // Verde esperanza (los animales hablan)
  sky:       0x1a2a1a,
  ground:    0x2a3a1a,
  water:     0x1a3a2a,
  ambient:   0x1a2e1a,
  hudAccent: '#86efac',
  particle:  0x60c060,   // Polvo de vida residual
});

const PALETTE_STAGE_8 = Object.freeze({
  primary:   0x0f0f0f,   // Negro — colapso total
  secondary: 0x1a1a1a,
  accent:    0x404040,   // Gris — sin esperanza visible
  sky:       0x080808,
  ground:    0x0f0f0f,
  water:     0x080808,
  ambient:   0x0f0f0f,
  hudAccent: '#6b7280',
  particle:  0x303030,   // Ceniza fina
});

// ─── MAPA DE PALETAS ─────────────────────────────────────────────────────────

/**
 * Mapa completo: clave de etapa → paleta.
 * Las escenas importan getPaletteForStage() en lugar de acceder aquí
 * directamente, para mayor encapsulación.
 */
export const PALETTES = Object.freeze({
  [STAGES.STAGE_1]: PALETTE_STAGE_1,
  [STAGES.STAGE_2]: PALETTE_STAGE_2,
  [STAGES.STAGE_3]: PALETTE_STAGE_3,
  [STAGES.STAGE_4]: PALETTE_STAGE_4,
  [STAGES.STAGE_5]: PALETTE_STAGE_5,
  [STAGES.STAGE_6]: PALETTE_STAGE_6,
  [STAGES.STAGE_7]: PALETTE_STAGE_7,
  [STAGES.STAGE_8]: PALETTE_STAGE_8,
});

// ─── API PÚBLICA ──────────────────────────────────────────────────────────────

/**
 * Devuelve la paleta para una etapa dada.
 * Si la clave no existe, devuelve la paleta de Stage 1 como fallback seguro.
 *
 * @param {string} stageKey - Una de las claves STAGES.*
 * @returns {Readonly<Object>} Paleta de colores congelada
 *
 * @example
 *   const palette = getPaletteForStage(STAGES.STAGE_3);
 *   this.cameras.main.setBackgroundColor(palette.primary);
 */
export function getPaletteForStage(stageKey) {
  return PALETTES[stageKey] ?? PALETTE_STAGE_1;
}

/**
 * Interpola linealmente entre dos colores Phaser (enteros hex 0xRRGGBB).
 * Usado para transiciones suaves de color entre etapas.
 *
 * @param {number} colorA - Color inicial (hex int)
 * @param {number} colorB - Color final (hex int)
 * @param {number} t      - Factor 0.0–1.0
 * @returns {number} Color interpolado (hex int)
 *
 * SEGURIDAD: Opera con aritmética pura, sin eval ni strings.
 *
 * @example
 *   const mid = lerpColor(0x2d7a1b, 0x5a3820, 0.5);
 */
export function lerpColor(colorA, colorB, t) {
  // Extraer canales RGB de cada color
  const rA = (colorA >> 16) & 0xff;
  const gA = (colorA >>  8) & 0xff;
  const bA =  colorA        & 0xff;

  const rB = (colorB >> 16) & 0xff;
  const gB = (colorB >>  8) & 0xff;
  const bB =  colorB        & 0xff;

  // Interpolar cada canal
  const r = Math.round(rA + (rB - rA) * t);
  const g = Math.round(gA + (gB - gA) * t);
  const b = Math.round(bA + (bB - bA) * t);

  // Reensamblar en entero hex
  return (r << 16) | (g << 8) | b;
}