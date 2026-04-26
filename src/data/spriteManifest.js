/**
 * PLASTIC COLLAPSE - SPRITE MANIFEST
 * Catalogo de sprites con rutas y dimensiones
 * 
 * Cuando agregues un sprite real, reemplaza solo la ruta specific
 * Ejemplo:
 *   sprites.player.down = 'assets/sprites/player_down.png';
 * 
 * Los placeholders se generan automáticamente si la ruta no existe
 */

const SPRITE_MANIFEST = {
    // PLAYER SPRITES
    player: {
        idle_down: null,    // Generará placeholder si no existe
        idle_up: null,
        idle_left: null,
        idle_right: null,
        walk_down: null,
        walk_up: null,
        walk_left: null,
        walk_right: null
    },

    // NPC SPRITES
    npcs: {
        generic: {
            idle_down: null,
            idle_up: null,
            idle_left: null,
            idle_right: null,
            walk_down: null,
            walk_up: null,
            walk_left: null,
            walk_right: null
        },
        scientist: {
            idle_down: null,
            idle_up: null,
            walk_down: null,
            walk_up: null
        },
        businessman: {
            idle_down: null,
            idle_up: null,
            walk_down: null,
            walk_up: null
        },
        animal: {
            idle: null,
            move: null
        }
    },

    // ENVIRONMENTAL SPRITES
    environment: {
        tree: null,
        grass: null,
        water: null,
        factory: null,
        sign: null,
        house: null
    },

    // UI SPRITES
    ui: {
        dialogue_box: null,
        interaction_indicator: null
    },

    // TILESET
    tilesets: {
        grass: null,
        forest: null,
        city: null,
        wasteland: null
    }
};

/**
 * Función para registrar un sprite en el manifest
 * @param {string} category - Categoría (player, npcs, environment, etc)
 * @param {string} key - Clave del sprite
 * @param {string} url - URL del sprite (SOLO si tienes el archivo real)
 */
function registerSprite(category, key, url) {
    if (SPRITE_MANIFEST[category] && SPRITE_MANIFEST[category][key] !== undefined) {
        SPRITE_MANIFEST[category][key] = url;
        console.log(`[SPRITE REGISTERED] ${category}.${key}`);
    } else {
        console.warn(`[SPRITE ERROR] ${category}.${key} no existe en manifest`);
    }
}

/**
 * Obtener sprite del manifest
 * @param {string} category
 * @param {string} key
 * @returns {string|null}
 */
function getSprite(category, key) {
    const sprite = SPRITE_MANIFEST[category]?.[key];
    return sprite || null;
}

/**
 * Listar todos los sprites sin cargar (null = placeholder)
 * @returns {Array}
 */
function getPlaceholderSprites() {
    const placeholders = [];
    
    Object.entries(SPRITE_MANIFEST).forEach(([category, items]) => {
        if (typeof items === 'object') {
            Object.entries(items).forEach(([key, value]) => {
                if (value === null) {
                    placeholders.push(`${category}.${key}`);
                }
            });
        }
    });

    return placeholders;
}