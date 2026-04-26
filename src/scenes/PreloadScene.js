/**
 * PLASTIC COLLAPSE - PRELOAD SCENE
 * Carga de assets globales
 */

class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload() {
        console.log('📦 Cargando assets...');

        // Barra de carga
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();

        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 2 - 200, height / 2 - 30, 400, 50);

        const loadingText = this.add.text(
            width / 2,
            height / 2 - 50,
            'Cargando...',
            {
                fontSize: '20px',
                fill: '#ffffff'
            }
        );
        loadingText.setOrigin(0.5);

        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0x00ff00, 1);
            progressBar.fillRect(width / 2 - 195, height / 2 - 25, 390 * value, 40);
        });
    }

    create() {
        console.log('✅ Assets cargados');
        this.scene.start('MainMenuScene');
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = PreloadScene;
}