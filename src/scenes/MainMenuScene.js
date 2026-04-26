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
        const bg = this.add.rectangle(width / 2, height / 2, width, height, 0x1a1a1a);

        // Título
        const title = this.add.text(width / 2, height / 3, 'PLASTIC COLLAPSE', {
            fontSize: '48px',
            fill: '#f39c12',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        });
        title.setOrigin(0.5);

        // Subtítulo
        const subtitle = this.add.text(
            width / 2,
            height / 3 + 60,
            'Una experiencia narrativa sobre el colapso ambiental',
            {
                fontSize: '14px',
                fill: '#ecf0f1',
                fontFamily: 'Arial',
                align: 'center'
            }
        );
        subtitle.setOrigin(0.5);

        // Botón JUGAR
        const playButton = this.add.rectangle(width / 2, height / 2 + 50, 200, 50, 0x2ecc71);
        const playText = this.add.text(width / 2, height / 2 + 50, 'JUGAR', {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        });
        playText.setOrigin(0.5);
        playText.setDepth(1);

        playButton.setInteractive();
        playButton.on('pointerdown', () => {
            this.scene.start('Stage1_NaturalWorld');
        });
        playButton.on('pointerover', () => {
            playButton.setFillStyle(0x27ae60);
        });
        playButton.on('pointerout', () => {
            playButton.setFillStyle(0x2ecc71);
        });

        // Botón CARGAR
        const loadButton = this.add.rectangle(width / 2, height / 2 + 120, 200, 50, 0x3498db);
        const loadText = this.add.text(width / 2, height / 2 + 120, 'CARGAR', {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        });
        loadText.setOrigin(0.5);
        loadText.setDepth(1);

        loadButton.setInteractive();
        loadButton.on('pointerdown', () => {
            const saveData = SAVE_SYSTEM.load(1);
            if (saveData) {
                this.scene.start(CONSTANTS.STAGES[GAME_STATE.currentStage]);
            }
        });

        // Información en pantalla
        const info = this.add.text(
            10,
            height - 30,
            'Usa flechas para moverte | E para interactuar | Experimenta el colapso',
            {
                fontSize: '12px',
                fill: '#95a5a6',
                fontFamily: 'Arial'
            }
        );
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = MainMenuScene;
}