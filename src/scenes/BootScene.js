/**
 * PLASTIC COLLAPSE - BOOT SCENE
 * Escena inicial de boot - Carga configuración y inicializa sistema
 */

class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene', active: true });
    }

    preload() {
        // Cargar assets mínimos para el boot
        console.log('🔧 BOOT: Inicializando sistema...');
    }

    create() {
        // Inicializar sistemas globales
        console.log('✓ Sistemas globales inicializados');
        
        // Ir a preload
        this.scene.start('PreloadScene');
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = BootScene;
}