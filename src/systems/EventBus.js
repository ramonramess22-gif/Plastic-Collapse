/**
 * PLASTIC COLLAPSE - EVENT BUS
 * Sistema de eventos global para comunicación entre sistemas
 */

class EventBus extends Phaser.Events.EventEmitter {
    constructor() {
        super();
        this.events = {};
    }
    
    /**
     * Emitir un evento
     * @param {string} event - Nombre del evento
     * @param {*} data - Datos a pasar
     */
    emit(event, data = null) {
        console.log(`[EVENT] ${event}`, data);
        super.emit(event, data);
    }
    
    /**
     * Escuchar un evento
     * @param {string} event - Nombre del evento
     * @param {Function} callback - Función callback
     */
    on(event, callback) {
        super.on(event, callback);
    }
    
    /**
     * Escuchar un evento una sola vez
     * @param {string} event - Nombre del evento
     * @param {Function} callback - Función callback
     */
    once(event, callback) {
        super.once(event, callback);
    }
    
    /**
     * Dejar de escuchar un evento
     * @param {string} event - Nombre del evento
     * @param {Function} callback - Función callback
     */
    off(event, callback) {
        super.off(event, callback);
    }
}

// Crear instancia global
const GLOBAL_EVENT_BUS = new EventBus();

// Eventos predefinidos
const EVENTS = {
    // Player
    PLAYER_MOVE: 'player:move',
    PLAYER_INTERACT: 'player:interact',
    PLAYER_TALK: 'player:talk',
    PLAYER_POSITION_CHANGE: 'player:positionChange',
    
    // Dialogue
    DIALOGUE_START: 'dialogue:start',
    DIALOGUE_END: 'dialogue:end',
    DIALOGUE_NEXT_PAGE: 'dialogue:nextPage',
    
    // Stage transitions
    STAGE_COMPLETE: 'stage:complete',
    STAGE_CHANGE: 'stage:change',
    TRANSITION_START: 'transition:start',
    TRANSITION_END: 'transition:end',
    
    // Game state
    GAME_PAUSE: 'game:pause',
    GAME_RESUME: 'game:resume',
    GAME_SAVE: 'game:save',
    GAME_LOAD: 'game:load',
    
    // HUD
    HUD_UPDATE: 'hud:update',
    HUD_SHOW_INTERACTION: 'hud:showInteraction',
    HUD_HIDE_INTERACTION: 'hud:hideInteraction',
    
    // Cinemática
    CINEMATIC_START: 'cinematic:start',
    CINEMATIC_END: 'cinematic:end',
    CINEMATIC_CAMERA_MOVE: 'cinematic:cameraMove',
    
    // Entorno
    ENVIRONMENT_CHANGE: 'environment:change',
    NPC_SPAWN: 'npc:spawn',
    NPC_DESPAWN: 'npc:despawn'
};