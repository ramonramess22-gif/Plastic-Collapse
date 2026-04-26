/**
 * PLASTIC COLLAPSE - BASE STAGE SCENE
 * Escena base reutilizable para todas las etapas
 */

class BaseStageScene extends Phaser.Scene {
    constructor(config) {
        super(config);
        this.stageNumber = config.stageNumber || 1;
        this.player = null;
        this.npcs = [];
        this.environmentObjects = [];
        this.dialogueSystem = null;
        this.transitionManager = null;
        this.hudManager = null;
        this.dialogueBox = null;
        this.nameBox = null;
    }

    /**
     * Precargar assets
     */
    preload() {
        // Los sprites se cargarán con placeholders automáticamente
        this.loadPlaceholders();
    }

    /**
     * Cargar placeholders para esta etapa
     */
    loadPlaceholders() {
        // Player
        if (!this.textures.exists('player_placeholder')) {
            const playerGraphics = this.make.graphics({ x: 0, y: 0, add: false });
            playerGraphics.fillStyle(0x4169E1, 1);
            playerGraphics.fillRect(0, 0, 32, 32);
            playerGraphics.generateTexture('player_placeholder', 32, 32);
            playerGraphics.destroy();
        }

        // NPCs
        const npcTypes = ['generic', 'scientist', 'businessman', 'animal'];
        npcTypes.forEach(type => {
            const key = `npc_${type}_placeholder`;
            if (!this.textures.exists(key)) {
                const graphics = this.make.graphics({ x: 0, y: 0, add: false });
                const colors = {
                    generic: 0xFF6B9D,
                    scientist: 0x4169E1,
                    businessman: 0xFFD700,
                    animal: 0x8B4513
                };
                graphics.fillStyle(colors[type] || 0xFF0000, 1);
                graphics.fillRect(0, 0, 32, 32);
                graphics.generateTexture(key, 32, 32);
                graphics.destroy();
            }
        });

        // Environment
        const envTypes = ['tree', 'grass', 'water', 'factory', 'sign'];
        envTypes.forEach(type => {
            const key = `env_${type}_placeholder`;
            if (!this.textures.exists(key)) {
                const graphics = this.make.graphics({ x: 0, y: 0, add: false });
                const colors = {
                    tree: 0x228B22,
                    grass: 0x90EE90,
                    water: 0x1E90FF,
                    factory: 0x696969,
                    sign: 0x8B4513
                };
                graphics.fillStyle(colors[type] || 0x888888, 1);
                graphics.fillRect(0, 0, 32, 32);
                graphics.generateTexture(key, 32, 32);
                graphics.destroy();
            }
        });
    }

    /**
     * Crear escena
     */
    create() {
        // Fondo
        const palette = getPaletteByStage(this.stageNumber);
        this.cameras.main.setBackgroundColor(palette.background);

        // Crear sistemas
        this.dialogueSystem = new DialogueSystem(this);
        this.transitionManager = new TransitionManager(this);
        this.hudManager = new HUDManager(this);

        // Crear HUD
        this.hudManager.createHUD();

        // Crear cajas de diálogo
        this.createDialogueUI();

        // Crear jugador
        this.player = new Player(this, CONSTANTS.TILE_SIZE * 5, CONSTANTS.TILE_SIZE * 5);

        // Crear NPCs y objetos ambientales
        this.createStageContent();

        // Eventos
        this.setupEventListeners();

        // Cámara sigue al jugador
        this.cameras.main.startFollow(this.player.sprite);
        this.cameras.main.setBounds(0, 0, CONSTANTS.TILE_SIZE * 25, CONSTANTS.TILE_SIZE * 18);
    }

    /**
     * Crear cajas de diálogo
     */
    createDialogueUI() {
        const width = this.game.config.width;
        const height = this.game.config.height;

        // Caja de diálogo principal
        this.dialogueBox = this.add.text(
            20,
            height - 130,
            '',
            {
                fontSize: '14px',
                fill: '#ecf0f1',
                fontFamily: 'Arial',
                wordWrap: { width: width - 60 }
            }
        );
        this.dialogueBox.setDepth(CONSTANTS.DEPTHS.UI);
        this.dialogueBox.setVisible(false);

        // Caja de nombre
        this.nameBox = this.add.text(
            20,
            height - 145,
            '',
            {
                fontSize: '16px',
                fill: '#f39c12',
                fontFamily: 'Arial',
                fontStyle: 'bold'
            }
        );
        this.nameBox.setDepth(CONSTANTS.DEPTHS.UI);
        this.nameBox.setVisible(false);
    }

    /**
     * Crear contenido de la escena (NPCs, objetos)
     * Debe ser sobrescrito por clases hijas
     */
    createStageContent() {
        // Las escenas específicas implementarán esto
    }

    /**
     * Configurar listeners de eventos
     */
    setupEventListeners() {
        // Movimiento del jugador
        GLOBAL_EVENT_BUS.on(EVENTS.PLAYER_MOVE, (data) => {
            this.hudManager.updatePlayerPosition(data.x, data.y);
            this.checkNPCInteraction();
        });

        // Interacción
        GLOBAL_EVENT_BUS.on(EVENTS.PLAYER_INTERACT, () => {
            this.checkNPCInteraction();
        });

        // Cambio de página de diálogo
        GLOBAL_EVENT_BUS.on(EVENTS.DIALOGUE_NEXT_PAGE, () => {
            if (this.dialogueSystem.hasNextPage()) {
                this.dialogueSystem.nextPage(this.dialogueBox, this.nameBox);
            } else {
                this.dialogueSystem.endDialogue(this.dialogueBox, this.nameBox);
            }
        });
    }

    /**
     * Verificar interacción con NPCs
     */
    checkNPCInteraction() {
        const playerPos = this.player.sprite;
        let hasNearbyNPC = false;

        this.npcs.forEach(npc => {
            const distance = Phaser.Math.Distance.Between(
                playerPos.x,
                playerPos.y,
                npc.sprite.x,
                npc.sprite.y
            );

            if (distance < CONSTANTS.INTERACTION_DISTANCE) {
                hasNearbyNPC = true;
                npc.setInteractionIndicatorVisible(true);

                // Si presiona E, iniciar diálogo
                if (this.input.keyboard.checkDown(this.input.keyboard.keys[Phaser.Input.Keyboard.KeyCodes.E], 500)) {
                    const dialogueKey = npc.getDialogueKey() || npc.getDialogueByStage?.();
                    if (dialogueKey && DIALOGUES[dialogueKey]) {
                        this.dialogueSystem.startDialogue(
                            DIALOGUES[dialogueKey],
                            this.dialogueBox,
                            this.nameBox
                        );
                    }
                }
            } else {
                npc.setInteractionIndicatorVisible(false);
            }
        });

        this.hudManager.showInteractionIndicator(hasNearbyNPC);
    }

    /**
     * Actualizar escena cada frame
     */
    update() {
        // Actualizar NPCs
        this.npcs.forEach(npc => npc.update());

        // Actualizar objetos ambientales
        this.environmentObjects.forEach(obj => obj.update());

        // Actualizar HUD
        this.hudManager.updateStage(GAME_STATE.currentStage);
    }

    /**
     * Crear NPC en la escena
     * @param {number} x
     * @param {number} y
     * @param {string} npcType
     * @param {string} dialogueKey
     */
    addNPC(x, y, npcType = 'generic', dialogueKey = null) {
        let npc;
        switch (npcType) {
            case 'scientist':
                npc = new Scientist(this, x, y);
                break;
            case 'businessman':
                npc = new Businessman(this, x, y);
                break;
            case 'animal':
                npc = new AnimalNPC(this, x, y);
                break;
            default:
                npc = new NPC(this, x, y, npcType);
        }
        if (dialogueKey) npc.setDialogue(dialogueKey);
        this.npcs.push(npc);
        return npc;
    }

    /**
     * Crear objeto ambiental
     * @param {number} x
     * @param {number} y
     * @param {string} objectType
     */
    addEnvironmentObject(x, y, objectType = 'tree') {
        const obj = new EnvironmentObject(this, x, y, objectType);
        this.environmentObjects.push(obj);
        return obj;
    }

    /**
     * Avanzar a siguiente etapa
     * @param {number} targetStage
     */
    advanceToStage(targetStage) {
        GAME_STATE.currentStage = targetStage;
        const sceneName = CONSTANTS.STAGES[targetStage];
        if (sceneName) {
            this.transitionManager.fadeTransition(sceneName);
        }
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = BaseStageScene;
}