/**
 * PLASTIC COLLAPSE - BOOT SCENE
 * Inicialización técnica del juego
 */

class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        console.log('⚙️ Inicializando Plastic Collapse...');
    }

    create() {
        // Inicializar sistemas globales
        console.log('✅ Sistemas globales inicializados');

        // Pasar a PreloadScene
        this.scene.start('PreloadScene');
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = BootScene;
}