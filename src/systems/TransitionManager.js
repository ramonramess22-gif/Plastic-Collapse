/**
 * PLASTIC COLLAPSE - TRANSITION MANAGER
 * Gestiona transiciones entre escenas
 */

class TransitionManager {
    constructor(scene) {
        this.scene = scene;
        this.isTransitioning = false;
    }

    /**
     * Transición Fade Out + Cambio de escena + Fade In
     * @param {string} targetScene - Nombre de la escena destino
     * @param {number} duration - Duración en ms
     */
    fadeTransition(targetScene, duration = CONSTANTS.TRANSITION_DURATION) {
        if (this.isTransitioning) return;

        this.isTransitioning = true;
        GLOBAL_EVENT_BUS.emit(EVENTS.TRANSITION_START);

        // Crear overlay
        const overlay = this.scene.add.rectangle(
            this.scene.game.config.width / 2,
            this.scene.game.config.height / 2,
            this.scene.game.config.width,
            this.scene.game.config.height,
            0x000000,
            0
        );
        overlay.setDepth(CONSTANTS.DEPTHS.UI + 100);

        // Fade out
        this.scene.tweens.add({
            targets: overlay,
            alpha: 1,
            duration: duration / 2,
            ease: 'Linear',
            onComplete: () => {
                // Cambiar escena
                this.scene.scene.start(targetScene);

                // La nueva escena hace fade in
                GLOBAL_EVENT_BUS.emit(EVENTS.TRANSITION_END);
                this.isTransitioning = false;
            }
        });
    }

    /**
     * Transición con deslizamiento (slide)
     * @param {string} targetScene
     * @param {string} direction - 'left', 'right', 'up', 'down'
     * @param {number} duration
     */
    slideTransition(targetScene, direction = 'left', duration = CONSTANTS.TRANSITION_DURATION) {
        if (this.isTransitioning) return;

        this.isTransitioning = true;
        GLOBAL_EVENT_BUS.emit(EVENTS.TRANSITION_START);

        const camera = this.scene.cameras.main;
        let targetX = camera.scrollX;
        let targetY = camera.scrollY;

        switch (direction) {
            case 'left':
                targetX -= this.scene.game.config.width;
                break;
            case 'right':
                targetX += this.scene.game.config.width;
                break;
            case 'up':
                targetY -= this.scene.game.config.height;
                break;
            case 'down':
                targetY += this.scene.game.config.height;
                break;
        }

        this.scene.tweens.add({
            targets: camera,
            scrollX: targetX,
            scrollY: targetY,
            duration: duration,
            ease: 'Linear',
            onComplete: () => {
                this.scene.scene.start(targetScene);
                GLOBAL_EVENT_BUS.emit(EVENTS.TRANSITION_END);
                this.isTransitioning = false;
            }
        });
    }

    /**
     * Transición de cortina (cortina que se cierra y abre)
     * @param {string} targetScene
     * @param {number} duration
     */
    curtainTransition(targetScene, duration = CONSTANTS.TRANSITION_DURATION) {
        if (this.isTransitioning) return;

        this.isTransitioning = true;
        GLOBAL_EVENT_BUS.emit(EVENTS.TRANSITION_START);

        const width = this.scene.game.config.width;
        const height = this.scene.game.config.height;

        // Cortinas izquierda y derecha
        const curtainLeft = this.scene.add.rectangle(width / 4, height / 2, width / 2, height, 0x000000);
        const curtainRight = this.scene.add.rectangle((3 * width) / 4, height / 2, width / 2, height, 0x000000);
        curtainLeft.setDepth(CONSTANTS.DEPTHS.UI + 100);
        curtainRight.setDepth(CONSTANTS.DEPTHS.UI + 100);

        // Cerrar cortinas
        this.scene.tweens.add({
            targets: [curtainLeft, curtainRight],
            alpha: 1,
            duration: duration / 2,
            ease: 'Linear',
            onComplete: () => {
                this.scene.scene.start(targetScene);

                // Abrir cortinas en la nueva escena
                setTimeout(() => {
                    GLOBAL_EVENT_BUS.emit(EVENTS.TRANSITION_END);
                }, 100);

                this.isTransitioning = false;
            }
        });
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = TransitionManager;
}