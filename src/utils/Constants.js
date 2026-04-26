/**
 * PLASTIC COLLAPSE - CONSTANTS
 * Configuración global de constantes del juego
 */

const CONSTANTS = {
    // Dimensiones del juego
    GAME_WIDTH: 800,
    GAME_HEIGHT: 600,
    TILE_SIZE: 32,
    
    // Velocidad del jugador (grid-based)
    PLAYER_SPEED: 100,
    PLAYER_MOVE_DISTANCE: 32,
    
    // Direcciones
    DIRECTIONS: {
        UP: 'up',
        DOWN: 'down',
        LEFT: 'left',
        RIGHT: 'right'
    },
    
    // Estados del jugador
    PLAYER_STATES: {
        IDLE: 'idle',
        MOVING: 'moving',
        INTERACTING: 'interacting',
        TALKING: 'talking'
    },
    
    // Etapas del juego (1-8)
    STAGES: {
        1: 'Stage1_NaturalWorld',
        2: 'Stage2_Factory',
        3: 'Stage3_Warning',
        4: 'Stage4_Consequences',
        5: 'Stage5_SocialImpact',
        6: 'Stage6_War',
        7: 'Stage7_Animals',
        8: 'Stage8_FinalWorld'
    },
    
    // Profundidad de renderizado
    DEPTHS: {
        BACKGROUND: 0,
        GROUND: 1,
        OBJECTS: 2,
        PLAYER: 3,
        NPCs: 3,
        EFFECTS: 4,
        UI: 1000
    },
    
    // Distancia de interacción (píxeles)
    INTERACTION_DISTANCE: 48,
    
    // Duración de transiciones
    TRANSITION_DURATION: 1000,
    
    // Tamaño de fuente para diálogos
    DIALOG_FONT_SIZE: 16,
    DIALOG_LINE_HEIGHT: 24
};