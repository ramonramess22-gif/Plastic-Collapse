/**
 * PLASTIC COLLAPSE - PLAYER
 * Entidad del jugador con movimiento en grid y animaciones 4D
 */

class Player {
    constructor(scene, x, y) {
        this.scene = scene;
        this.gridX = Math.floor(x / CONSTANTS.TILE_SIZE);
        this.gridY = Math.floor(y / CONSTANTS.TILE_SIZE);
        this.currentDirection = CONSTANTS.DIRECTIONS.DOWN;
        this.isMoving = false;
        this.canMove = true;
        this.state = CONSTANTS.PLAYER_STATES.IDLE;

        // Crear sprite del jugador
        this.sprite = scene.add.sprite(x, y, 'player_placeholder');
        this.sprite.setScale(1);
        this.sprite.setDepth(CONSTANTS.DEPTHS.PLAYER);

        // Animar sprite
        this.createAnimations();
        this.setupInputs();
    }

    /**
     * Crear animaciones del jugador
     */
    createAnimations() {
        // Animaciones en 4 direcciones
        const directions = ['down', 'up', 'left', 'right'];

        directions.forEach(dir => {
            // Idle
            if (!this.scene.anims.exists(`player_idle_${dir}`)) {
                this.scene.anims.create({
                    key: `player_idle_${dir}`,
                    frames: this.scene.anims.generateFrameNumbers('player_placeholder', { start: 0, end: 0 }),
                    frameRate: 1,
                    repeat: -1
                });
            }

            // Walk
            if (!this.scene.anims.exists(`player_walk_${dir}`)) {
                this.scene.anims.create({
                    key: `player_walk_${dir}`,
                    frames: this.scene.anims.generateFrameNumbers('player_placeholder', { start: 0, end: 3 }),
                    frameRate: 8,
                    repeat: -1
                });
            }
        });
    }

    /**
     * Configurar inputs del jugador
     */
    setupInputs() {
        const keys = this.scene.input.keyboard.createCursorKeys();
        const eKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        // Movimiento con flechas
        this.scene.input.keyboard.on('keydown', (event) => {
            if (GAME_STATE.isInDialogue) return; // No mover si está en diálogo

            switch (event.keyCode) {
                case Phaser.Input.Keyboard.KeyCodes.UP:
                    this.moveInDirection(CONSTANTS.DIRECTIONS.UP);
                    break;
                case Phaser.Input.Keyboard.KeyCodes.DOWN:
                    this.moveInDirection(CONSTANTS.DIRECTIONS.DOWN);
                    break;
                case Phaser.Input.Keyboard.KeyCodes.LEFT:
                    this.moveInDirection(CONSTANTS.DIRECTIONS.LEFT);
                    break;
                case Phaser.Input.Keyboard.KeyCodes.RIGHT:
                    this.moveInDirection(CONSTANTS.DIRECTIONS.RIGHT);
                    break;
            }
        });

        // Interacción con tecla E
        eKey.on('down', () => {
            if (!this.isMoving && !GAME_STATE.isInDialogue) {
                GLOBAL_EVENT_BUS.emit(EVENTS.PLAYER_INTERACT, {
                    x: this.gridX,
                    y: this.gridY,
                    direction: this.currentDirection
                });
            } else if (GAME_STATE.isInDialogue) {
                // Pasar a siguiente página de diálogo
                GLOBAL_EVENT_BUS.emit(EVENTS.DIALOGUE_NEXT_PAGE);
            }
        });
    }

    /**
     * Mover en dirección
     * @param {string} direction - up, down, left, right
     */
    moveInDirection(direction) {
        if (!this.canMove || this.isMoving) return;

        this.currentDirection = direction;
        this.state = CONSTANTS.PLAYER_STATES.MOVING;
        this.isMoving = true;

        let newGridX = this.gridX;
        let newGridY = this.gridY;

        // Calcular nueva posición
        switch (direction) {
            case CONSTANTS.DIRECTIONS.UP:
                newGridY -= 1;
                break;
            case CONSTANTS.DIRECTIONS.DOWN:
                newGridY += 1;
                break;
            case CONSTANTS.DIRECTIONS.LEFT:
                newGridX -= 1;
                break;
            case CONSTANTS.DIRECTIONS.RIGHT:
                newGridX += 1;
                break;
        }

        // Verificar límites y colisiones
        if (this.canMoveTo(newGridX, newGridY)) {
            // Animar movimiento
            this.scene.tweens.add({
                targets: this.sprite,
                x: newGridX * CONSTANTS.TILE_SIZE,
                y: newGridY * CONSTANTS.TILE_SIZE,
                duration: CONSTANTS.PLAYER_SPEED,
                ease: 'Linear',
                onComplete: () => {
                    this.gridX = newGridX;
                    this.gridY = newGridY;
                    this.isMoving = false;
                    this.state = CONSTANTS.PLAYER_STATES.IDLE;
                    GLOBAL_EVENT_BUS.emit(EVENTS.PLAYER_MOVE, { x: this.gridX, y: this.gridY });
                }
            });
        } else {
            this.isMoving = false;
        }
    }

    /**
     * Verificar si puede mover a posición
     * @param {number} gridX
     * @param {number} gridY
     * @returns {boolean}
     */
    canMoveTo(gridX, gridY) {
        // Límites del mapa (aproximado)
        const mapWidth = 25;
        const mapHeight = 18;

        if (gridX < 0 || gridX >= mapWidth || gridY < 0 || gridY >= mapHeight) {
            return false;
        }

        // Aquí se añadirían verificaciones de colisiones con tilemaps
        return true;
    }

    /**
     * Obtener posición en píxeles
     */
    getPixelPosition() {
        return {
            x: this.sprite.x,
            y: this.sprite.y
        };
    }

    /**
     * Teleportar a posición (sin animación)
     * @param {number} gridX
     * @param {number} gridY
     */
    teleportTo(gridX, gridY) {
        this.gridX = gridX;
        this.gridY = gridY;
        this.sprite.x = gridX * CONSTANTS.TILE_SIZE;
        this.sprite.y = gridY * CONSTANTS.TILE_SIZE;
        GLOBAL_EVENT_BUS.emit(EVENTS.PLAYER_MOVE, { x: gridX, y: gridY });
    }

    /**
     * Cambiar estado del jugador
     * @param {string} newState
     */
    setState(newState) {
        this.state = newState;
        this.canMove = (newState === CONSTANTS.PLAYER_STATES.IDLE || newState === CONSTANTS.PLAYER_STATES.MOVING);
    }

    /**
     * Destruir jugador
     */
    destroy() {
        if (this.sprite) {
            this.sprite.destroy();
        }
    }
}