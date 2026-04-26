/**
 * PLASTIC COLLAPSE - BASE STAGE SCENE
 * Clase base para todas las escenas de etapas
 * Contiene lógica compartida y estructura común
 */

class BaseStageScene extends Phaser.Scene {
    constructor(config) {
        super(config);
        this.stageNumber = 1;
        this.player = null;
        this.npcs = [];
        this.environmentObjects = [];
        this.transitionManager = null;
        this.dialogueSystem = null;
        this.hudManager = null;
    }

    init() {
        // Inicializar sistemas
        this.transitionManager = new TransitionManager(this);
        this.dialogueSystem = new DialogueSystem(this);
        this.hudManager = new HUDManager(this);
    }

    create() {
        // Crear fondo
        const palette = getPaletteByStage(this.stageNumber);
        this.cameras.main.setBackgroundColor(palette.background);

        // Crear HUD
        this.hudManager.createHUD();

        // Crear jugador en posición inicial
        this.createPlayer(400, 300);

        // Crear NPCs y objetos (override en subclases)
        this.createStageContent();

        // Configurar eventos
        this.setupEvents();

        console.log(`✓ Stage ${this.stageNumber} creada`);
    }

    /**
     * Crear jugador
     * @param {number} x
     * @param {number} y
     */
    createPlayer(x, y) {
        this.player = new Player(this, x, y);
    }

    /**
     * Crear contenido de la etapa (override en subclases)
     */
    createStageContent() {
        // Override en subclases
    }

    /**
     * Crear NPC
     * @param {number} x
     * @param {number} y
     * @param {string} npcType - 'generic', 'scientist', 'businessman', 'animal'
     * @param {string} dialogueKey - Clave del diálogo
     */
    createNPC(x, y, npcType = 'generic', dialogueKey = null) {
        let npc;

        if (npcType === 'scientist') {
            npc = new Scientist(this, x, y);
        } else if (npcType === 'businessman') {
            npc = new Businessman(this, x, y);
        } else if (npcType === 'animal') {
            npc = new AnimalNPC(this, x, y);
        } else {
            npc = new NPC(this, x, y, 'generic');
        }

        if (dialogueKey) {
            npc.setDialogue(dialogueKey);
        }

        this.npcs.push(npc);
        return npc;
    }

    /**
     * Crear objeto de entorno
     * @param {number} x
     * @param {number} y
     * @param {string} objectType - 'tree', 'rock', 'factory', etc
     */
    createEnvironmentObject(x, y, objectType = 'tree') {
        const obj = new EnvironmentObject(this, x, y, objectType);
        this.environmentObjects.push(obj);
        return obj;
    }

    /**
     * Configurar eventos
     */
    setupEvents() {
        // Interacción con jugador
        GLOBAL_EVENT_BUS.on(EVENTS.PLAYER_INTERACT, this.handlePlayerInteraction, this);

        // Cambio de diálogo
        GLOBAL_EVENT_BUS.on(EVENTS.DIALOGUE_NEXT_PAGE, this.handleDialogueNext, this);
        GLOBAL_EVENT_BUS.on(EVENTS.DIALOGUE_END, this.handleDialogueEnd, this);
    }

    /**
     * Manejar interacción del jugador
     */
    handlePlayerInteraction(data) {
        // Verificar si hay NPC cerca
        const nearbyNPC = this.findNearbyNPC(data.x, data.y, data.direction);
        if (nearbyNPC && nearbyNPC.getDialogueKey()) {
            this.startDialogue(nearbyNPC);
        }
    }

    /**
     * Encontrar NPC cercano
     */
    findNearbyNPC(gridX, gridY, direction) {
        // Calcular posición en frente del jugador
        let checkX = gridX;
        let checkY = gridY;

        switch (direction) {
            case CONSTANTS.DIRECTIONS.UP:
                checkY -= 1;
                break;
            case CONSTANTS.DIRECTIONS.DOWN:
                checkY += 1;
                break;
            case CONSTANTS.DIRECTIONS.LEFT:
                checkX -= 1;
                break;
            case CONSTANTS.DIRECTIONS.RIGHT:
                checkX += 1;
                break;
        }

        // Buscar NPC en esa posición
        return this.npcs.find(npc => npc.gridX === checkX && npc.gridY === checkY);
    }

    /**
     * Iniciar diálogo con NPC
     */
    startDialogue(npc) {
        const dialogueKey = npc.getDialogueKey();
        if (dialogueKey && DIALOGUES[dialogueKey]) {
            GAME_STATE.isInDialogue = true;
            this.dialogueSystem.startDialogue(
                DIALOGUES[dialogueKey],
                null,
                null
            );
        }
    }

    /**
     * Siguiente página del diálogo
     */
    handleDialogueNext() {
        this.dialogueSystem.nextPage();
    }

    /**
     * Fin del diálogo
     */
    handleDialogueEnd() {
        GAME_STATE.isInDialogue = false;
    }

    /**
     * Actualizar lógica por frame
     */
    update() {
        // Actualizar NPCs
        this.npcs.forEach(npc => npc.update());

        // Actualizar objetos de entorno
        this.environmentObjects.forEach(obj => obj.update());

        // Actualizar HUD
        if (this.player) {
            this.hudManager.updatePlayerPosition(this.player.gridX, this.player.gridY);
        }
    }

    /**
     * Avanzar a siguiente etapa
     */
    nextStage() {
        if (this.stageNumber < 8) {
            GAME_STATE.advanceStage();
            const nextSceneKey = CONSTANTS.STAGES[this.stageNumber + 1];
            this.transitionManager.fadeTransition(nextSceneKey);
        } else {
            this.transitionManager.fadeTransition('EndScene');
        }
    }

    /**
     * Limpiar escena
     */
    shutdown() {
        GLOBAL_EVENT_BUS.off(EVENTS.PLAYER_INTERACT, this.handlePlayerInteraction, this);
        GLOBAL_EVENT_BUS.off(EVENTS.DIALOGUE_NEXT_PAGE, this.handleDialogueNext, this);
        GLOBAL_EVENT_BUS.off(EVENTS.DIALOGUE_END, this.handleDialogueEnd, this);

        this.npcs.forEach(npc => npc.destroy());
        this.environmentObjects.forEach(obj => obj.destroy());
        if (this.player) {
            this.player.destroy();
        }
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = BaseStageScene;
}