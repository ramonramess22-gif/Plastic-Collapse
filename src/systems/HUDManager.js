/**
 * PLASTIC COLLAPSE - HUD MANAGER
 * Gestiona la interfaz visual (minimap, indicadores, etc)
 */

class HUDManager {
    constructor(scene) {
        this.scene = scene;
        this.hud = null;
        this.hudVisible = true;
    }

    /**
     * Crear HUD
     */
    createHUD() {
        const width = this.scene.game.config.width;
        const height = this.scene.game.config.height;

        // Contenedor principal
        this.hud = this.scene.add.container(0, 0);
        this.hud.setDepth(CONSTANTS.DEPTHS.UI);

        // Fondo del HUD (arriba)
        const hudBg = this.scene.add.rectangle(0, 20, width, 40, 0x2c3e50, 0.8);
        this.hud.add(hudBg);

        // Indicador de etapa
        this.stageText = this.scene.add.text(10, 30, `Stage ${GAME_STATE.currentStage}/8`, {
            fontSize: '16px',
            fill: '#ecf0f1',
            fontFamily: 'Arial'
        });
        this.stageText.setOrigin(0, 0.5);
        this.hud.add(this.stageText);

        // Posición del jugador
        this.positionText = this.scene.add.text(width - 150, 30, 'X: 0 Y: 0', {
            fontSize: '12px',
            fill: '#95a5a6',
            fontFamily: 'Arial'
        });
        this.positionText.setOrigin(1, 0.5);
        this.hud.add(this.positionText);

        // Indicador de interacción (abajo centro)
        this.interactionIndicator = this.scene.add.text(
            width / 2,
            height - 30,
            'Presiona [E] para interactuar',
            {
                fontSize: '12px',
                fill: '#f39c12',
                fontFamily: 'Arial',
                align: 'center'
            }
        );
        this.interactionIndicator.setOrigin(0.5);
        this.interactionIndicator.setVisible(false);
        this.hud.add(this.interactionIndicator);

        return this.hud;
    }

    /**
     * Actualizar posición del jugador en HUD
     */
    updatePlayerPosition(x, y) {
        this.positionText.setText(`X: ${x} Y: ${y}`);
    }

    /**
     * Actualizar número de etapa
     */
    updateStage(stage) {
        this.stageText.setText(`Stage ${stage}/8`);
    }

    /**
     * Mostrar/ocultar indicador de interacción
     */
    showInteractionIndicator(show = true) {
        if (this.interactionIndicator) {
            this.interactionIndicator.setVisible(show);
        }
    }

    /**
     * Mostrar notificación temporal
     */
    showNotification(message, duration = 2000) {
        const width = this.scene.game.config.width;
        const height = this.scene.game.config.height;

        const notification = this.scene.add.text(
            width / 2,
            height / 2,
            message,
            {
                fontSize: '24px',
                fill: '#ecf0f1',
                fontFamily: 'Arial',
                align: 'center',
                backgroundColor: '#2c3e50',
                padding: { x: 20, y: 10 }
            }
        );
        notification.setOrigin(0.5);
        notification.setDepth(CONSTANTS.DEPTHS.UI + 1);

        this.scene.tweens.add({
            targets: notification,
            alpha: { from: 1, to: 0 },
            duration,
            ease: 'Linear',
            onComplete: () => notification.destroy()
        });
    }

    /**
     * Limpiar HUD
     */
    destroy() {
        if (this.hud) {
            this.hud.destroy();
        }
    }
}