/**
 * PLASTIC COLLAPSE - MAIN MENU SCENE
 * Menú principal del juego
 */

class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Fondo
        this.cameras.main.setBackgroundColor(0x1a1a1a);

        // Título
        const title = this.add.text(
            width / 2,
            height / 4,
            'PLASTIC COLLAPSE',
            {
                fontSize: '48px',
                fill: '#ff0000',
                fontFamily: 'Arial',
                fontStyle: 'bold'
            }
        );
        title.setOrigin(0.5);

        // Subtítulo
        const subtitle = this.add.text(
            width / 2,
            height / 4 + 60,
            'Un viaje narrativo sobre el colapso ambiental',
            {
                fontSize: '16px',
                fill: '#cccccc',
                fontFamily: 'Arial'
            }
        );
        subtitle.setOrigin(0.5);

        // Botón Jugar
        const playButton = this.add.text(
            width / 2,
            height / 2,
            '[ JUGAR ]',
            {
                fontSize: '24px',
                fill: '#00ff00',
                fontFamily: 'Arial',
                backgroundColor: '#1a3a1a',
                padding: { x: 20, y: 10 }
            }
        );
        playButton.setOrigin(0.5);
        playButton.setInteractive();
        playButton.on('pointerover', () => playButton.setFill('#ffff00'));
        playButton.on('pointerout', () => playButton.setFill('#00ff00'));
        playButton.on('pointerdown', () => {
            this.scene.start(CONSTANTS.STAGES[1]);
        });

        // Botón Controles
        const controlsButton = this.add.text(
            width / 2,
            height / 2 + 60,
            '[ CONTROLES ]',
            {
                fontSize: '18px',
                fill: '#00ccff',
                fontFamily: 'Arial'
            }
        );
        controlsButton.setOrigin(0.5);
        controlsButton.setInteractive();
        controlsButton.on('pointerdown', () => {
            this.showControls();
        });

        // Info
        const info = this.add.text(
            width / 2,
            height - 40,
            'Una reflexión sobre cómo las decisiones pequeñas llevan al colapso irreversible',
            {
                fontSize: '12px',
                fill: '#666666',
                fontFamily: 'Arial',
                align: 'center',
                wordWrap: { width: width - 40 }
            }
        );
        info.setOrigin(0.5);
    }

    /**
     * Mostrar controles
     */
    showControls() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        const controlsText = this.add.text(
            width / 2,
            height / 2,
            'CONTROLES\n\n' +
            'Flechas: Moverse\n' +
            'E: Interactuar / Siguiente diálogo\n' +
            '\nPresiona cualquier tecla para volver',
            {
                fontSize: '18px',
                fill: '#ffffff',
                fontFamily: 'Arial',
                align: 'center',
                backgroundColor: '#2c3e50',
                padding: { x: 30, y: 30 }
            }
        );
        controlsText.setOrigin(0.5);

        this.input.keyboard.once('keydown', () => {
            controlsText.destroy();
        });
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = MainMenuScene;
}