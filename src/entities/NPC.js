/**
 * PLASTIC COLLAPSE - NPC BASE CLASS
 * Base para todos los NPCs del juego
 */

class NPC {
    constructor(scene, x, y, npcType = 'generic') {
        this.scene = scene;
        this.gridX = Math.floor(x / CONSTANTS.TILE_SIZE);
        this.gridY = Math.floor(y / CONSTANTS.TILE_SIZE);
        this.npcType = npcType;
        this.dialogueKey = null;
        this.isMoving = false;
        this.currentDirection = CONSTANTS.DIRECTIONS.DOWN;
        this.moveTimer = 0;
        this.moveInterval = Phaser.Math.Between(2000, 5000);

        // Crear sprite
        this.sprite = scene.add.sprite(x, y, `npc_${npcType}_placeholder`);
        this.sprite.setScale(1);
        this.sprite.setDepth(CONSTANTS.DEPTHS.NPCs);

        // Indicador de interacción
        this.interactionRange = CONSTANTS.INTERACTION_DISTANCE;
        this.createInteractionIndicator();
    }

    /**
     * Crear indicador visual de que se puede interactuar
     */
    createInteractionIndicator() {
        this.indicator = this.scene.add.graphics();
        this.indicator.fillStyle(0xf39c12, 0.5);
        this.indicator.fillCircle(0, 0, 4);
        this.indicator.setDepth(CONSTANTS.DEPTHS.OBJECTS);
        this.indicator.setPosition(this.sprite.x, this.sprite.y - 20);
    }

    /**
     * Establecer diálogo para este NPC
     * @param {string} dialogueKey - Clave del diálogo
     */
    setDialogue(dialogueKey) {
        this.dialogueKey = dialogueKey;
    }

    /**
     * Actualizar NPC cada frame
     */
    update() {
        // Movimiento natural
        this.moveTimer++;
        if (this.moveTimer > this.moveInterval && !this.isMoving) {
            this.moveRandomly();
            this.moveTimer = 0;
            this.moveInterval = Phaser.Math.Between(2000, 5000);
        }

        // Actualizar indicador
        if (this.indicator) {
            this.indicator.setPosition(this.sprite.x, this.sprite.y - 20);
        }
    }

    /**
     * Mover aleatoriamente
     */
    moveRandomly() {
        const directions = [
            CONSTANTS.DIRECTIONS.UP,
            CONSTANTS.DIRECTIONS.DOWN,
            CONSTANTS.DIRECTIONS.LEFT,
            CONSTANTS.DIRECTIONS.RIGHT
        ];

        const randomDirection = Phaser.Utils.Array.GetRandom(directions);
        const oldX = this.gridX;
        const oldY = this.gridY;

        switch (randomDirection) {
            case CONSTANTS.DIRECTIONS.UP:
                this.gridY -= 1;
                break;
            case CONSTANTS.DIRECTIONS.DOWN:
                this.gridY += 1;
                break;
            case CONSTANTS.DIRECTIONS.LEFT:
                this.gridX -= 1;
                break;
            case CONSTANTS.DIRECTIONS.RIGHT:
                this.gridX += 1;
                break;
        }

        // Validar posición
        if (!this.isValidPosition(this.gridX, this.gridY)) {
            this.gridX = oldX;
            this.gridY = oldY;
            return;
        }

        this.currentDirection = randomDirection;
        this.isMoving = true;

        // Animar movimiento
        this.scene.tweens.add({
            targets: this.sprite,
            x: this.gridX * CONSTANTS.TILE_SIZE,
            y: this.gridY * CONSTANTS.TILE_SIZE,
            duration: CONSTANTS.PLAYER_SPEED,
            ease: 'Linear',
            onComplete: () => {
                this.isMoving = false;
            }
        });
    }

    /**
     * Verificar si posición es válida
     * @param {number} gridX
     * @param {number} gridY
     * @returns {boolean}
     */
    isValidPosition(gridX, gridY) {
        const mapWidth = 25;
        const mapHeight = 18;
        return gridX >= 0 && gridX < mapWidth && gridY >= 0 && gridY < mapHeight;
    }

    /**
     * Mostrar/ocultar indicador de interacción
     * @param {boolean} visible
     */
    setInteractionIndicatorVisible(visible) {
        if (this.indicator) {
            this.indicator.setVisible(visible);
        }
    }

    /**
     * Obtener diálogo
     * @returns {string|null}
     */
    getDialogueKey() {
        return this.dialogueKey;
    }

    /**
     * Destruir NPC
     */
    destroy() {
        if (this.sprite) {
            this.sprite.destroy();
        }
        if (this.indicator) {
            this.indicator.destroy();
        }
    }
}