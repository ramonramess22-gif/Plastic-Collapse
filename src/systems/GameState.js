/**
 * PLASTIC COLLAPSE - GAME STATE
 * Sistema de estado global del juego
 */

class GameState {
    constructor() {
        this.currentStage = 1;
        this.playerPosition = { x: 0, y: 0 };
        this.playerDirection = CONSTANTS.DIRECTIONS.DOWN;
        this.isInDialogue = false;
        this.completedDialogues = new Set();
        this.inventory = [];
        this.flags = {}; // Flags para eventos narrativos
        this.environmentState = {}; // Estado del entorno por etapa
        this.visitedLocations = new Set();
        this.gameStarted = false;
        this.gamePaused = false;
        this.cinematicActive = false;
    }
    
    /**
     * Avanzar a la siguiente etapa
     */
    advanceStage() {
        if (this.currentStage < 8) {
            this.currentStage++;
            GLOBAL_EVENT_BUS.emit(EVENTS.STAGE_CHANGE, { newStage: this.currentStage });
        } else {
            GLOBAL_EVENT_BUS.emit(EVENTS.GAME_PAUSE, { reason: 'Game Complete' });
        }
    }
    
    /**
     * Establecer posición del jugador
     * @param {number} x - Coordenada X
     * @param {number} y - Coordenada Y
     */
    setPlayerPosition(x, y) {
        this.playerPosition = { x, y };
        GLOBAL_EVENT_BUS.emit(EVENTS.PLAYER_POSITION_CHANGE, this.playerPosition);
    }
    
    /**
     * Establecer dirección del jugador
     * @param {string} direction - Dirección (up, down, left, right)
     */
    setPlayerDirection(direction) {
        this.playerDirection = direction;
    }
    
    /**
     * Marcar un diálogo como completado
     * @param {string} dialogueId - ID único del diálogo
     */
    completeDialogue(dialogueId) {
        this.completedDialogues.add(dialogueId);
    }
    
    /**
     * Verificar si un diálogo fue completado
     * @param {string} dialogueId - ID único del diálogo
     * @returns {boolean}
     */
    isDialogueCompleted(dialogueId) {
        return this.completedDialogues.has(dialogueId);
    }
    
    /**
     * Establecer un flag narrativo
     * @param {string} flagName - Nombre del flag
     * @param {*} value - Valor del flag
     */
    setFlag(flagName, value) {
        this.flags[flagName] = value;
        console.log(`[FLAG] ${flagName} = ${value}`);
    }
    
    /**
     * Obtener valor de un flag
     * @param {string} flagName - Nombre del flag
     * @returns {*}
     */
    getFlag(flagName) {
        return this.flags[flagName];
    }
    
    /**
     * Verificar si una ubicación fue visitada
     * @param {string} locationId - ID de la ubicación
     */
    markLocationVisited(locationId) {
        this.visitedLocations.add(locationId);
    }
    
    /**
     * Pausa el juego
     */
    pause() {
        this.gamePaused = true;
        GLOBAL_EVENT_BUS.emit(EVENTS.GAME_PAUSE);
    }
    
    /**
     * Reanuda el juego
     */
    resume() {
        this.gamePaused = false;
        GLOBAL_EVENT_BUS.emit(EVENTS.GAME_RESUME);
    }
    
    /**
     * Inicia una cinemática
     */
    startCinematic() {
        this.cinematicActive = true;
        GLOBAL_EVENT_BUS.emit(EVENTS.CINEMATIC_START);
    }
    
    /**
     * Termina una cinemática
     */
    endCinematic() {
        this.cinematicActive = false;
        GLOBAL_EVENT_BUS.emit(EVENTS.CINEMATIC_END);
    }
    
    /**
     * Obtener estado actual como JSON
     * @returns {Object}
     */
    toJSON() {
        return {
            currentStage: this.currentStage,
            playerPosition: this.playerPosition,
            playerDirection: this.playerDirection,
            completedDialogues: Array.from(this.completedDialogues),
            flags: this.flags,
            visitedLocations: Array.from(this.visitedLocations),
            inventory: this.inventory
        };
    }
    
    /**
     * Cargar estado desde JSON
     * @param {Object} data - Datos guardados
     */
    fromJSON(data) {
        if (!data) return;
        this.currentStage = data.currentStage || 1;
        this.playerPosition = data.playerPosition || { x: 0, y: 0 };
        this.playerDirection = data.playerDirection || CONSTANTS.DIRECTIONS.DOWN;
        this.completedDialogues = new Set(data.completedDialogues || []);
        this.flags = data.flags || {};
        this.visitedLocations = new Set(data.visitedLocations || []);
        this.inventory = data.inventory || [];
    }
}

// Crear instancia global
const GAME_STATE = new GameState();