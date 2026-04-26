/**
 * PLASTIC COLLAPSE - COLOR PALETTE
 * Paleta de colores adaptable por etapa
 * Transición de colores vivos → grises según el colapso
 */

const COLOR_PALETTE = {
    // Etapa 1: Mundo Natural (colores vivos y naturales)
    stage1: {
        sky: '#87CEEB',
        grass: '#2D8659',
        water: '#1E90FF',
        tree: '#228B22',
        flower: '#FF69B4',
        npcSkin: '#F4A460',
        text: '#2C3E50'
    },
    
    // Etapa 2: Fábrica (aparecen grises, humo)
    stage2: {
        sky: '#A9B5C4',
        grass: '#3D9770',
        water: '#4A9FBF',
        tree: '#2D7A3E',
        factory: '#696969',
        smoke: '#CCCCCC',
        npcSkin: '#E8B8A0',
        text: '#3C4E60'
    },
    
    // Etapa 3: Advertencia (colores más oscuros)
    stage3: {
        sky: '#8B9DC3',
        grass: '#4D8570',
        water: '#5A7FAA',
        tree: '#1F5A2C',
        warning: '#FF6347',
        npcSkin: '#D9A58F',
        text: '#4C5E70'
    },
    
    // Etapa 4: Consecuencias (marchitez)
    stage4: {
        sky: '#7A8FAB',
        grass: '#5A7D6B',
        water: '#5A7087',
        tree: '#2D5A3D',
        dead: '#8B7355',
        pollution: '#A9A9A9',
        npcSkin: '#C9985F',
        text: '#555555'
    },
    
    // Etapa 5: Impacto Social (oscuridad)
    stage5: {
        sky: '#6B7B99',
        grass: '#6B8B7E',
        water: '#4A5A7A',
        fire: '#FF4500',
        conflict: '#DC143C',
        npcSkin: '#B8885F',
        text: '#333333'
    },
    
    // Etapa 6: Guerra (rojo, destrucción)
    stage6: {
        sky: '#5A6B8B',
        ground: '#3A4A5A',
        fire: '#FF0000',
        explosion: '#FFD700',
        ruin: '#654321',
        npcSkin: '#9A7060',
        text: '#222222'
    },
    
    // Etapa 7: Colapso Ecológico (silencio, desaturación)
    stage7: {
        sky: '#4A5A7A',
        ground: '#3A4A5A',
        dead: '#696969',
        ash: '#A9A9A9',
        silence: '#2F4F4F',
        npcSkin: '#8A7070',
        text: '#111111'
    },
    
    // Etapa 8: Mundo Final (gris total, muerte)
    stage8: {
        sky: '#333333',
        ground: '#222222',
        ash: '#808080',
        ruin: '#3A3A3A',
        empty: '#404040',
        npcSkin: '#5A4A4A',
        text: '#666666'
    },
    
    // Colores globales
    ui: {
        background: 'rgba(0, 0, 0, 0.8)',
        text: '#FFFFFF',
        accent: '#00FF00',
        warning: '#FF0000',
        dialogue: 'rgba(0, 0, 0, 0.9)'
    },
    
    // Efectos especiales
    effects: {
        smoke: 'rgba(200, 200, 200, 0.6)',
        fire: '#FF4500',
        water: '#1E90FF',
        poison: '#9932CC',
        ash: '#A9A9A9'
    }
};

/**
 * Función auxiliar para obtener paleta de una etapa
 * @param {number} stage - Número de etapa (1-8)
 * @returns {Object} Paleta de colores de la etapa
 */
function getStageColors(stage) {
    const stageKey = `stage${stage}`;
    return COLOR_PALETTE[stageKey] || COLOR_PALETTE.stage1;
}