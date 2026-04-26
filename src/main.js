/**
 * PLASTIC COLLAPSE - INICIALIZADOR PRINCIPAL (CON DEBUG)
 * 
 * Este archivo inicializa Phaser y crea la instancia del juego.
 * Versión mejorada con debugging detallado.
 */

console.log('%c=== PLASTIC COLLAPSE ===', 'color: #00ff00; font-weight: bold; font-size: 16px');
console.log('%c Versión 1.0 - Desarrollo', 'color: #ffff00; font-size: 12px');
console.log('%c Una experiencia narrativa sobre el colapso ambiental', 'color: #999999; font-size: 11px');

// Verificar que GameConfig existe
console.log('[main.js] Verificando GameConfig...');
if (typeof GameConfig === 'undefined') {
    console.error('[main.js] ✗ GameConfig NO está definido. Verifica que config.js esté cargado.');
} else {
    console.log('[main.js] ✓ GameConfig cargado correctamente');
    console.log('[main.js] Game Width:', GameConfig.GAME_WIDTH);
    console.log('[main.js] Game Height:', GameConfig.GAME_HEIGHT);
}

// Verificar que BootScene existe
console.log('[main.js] Verificando BootScene...');
if (typeof BootScene === 'undefined') {
    console.error('[main.js] ✗ BootScene NO está definida. Verifica que BootScene.js esté cargado.');
} else {
    console.log('[main.js] ✓ BootScene cargada correctamente');
}

// Verificar que PreloadScene existe
console.log('[main.js] Verificando PreloadScene...');
if (typeof PreloadScene === 'undefined') {
    console.error('[main.js] ✗ PreloadScene NO está definida. Verifica que PreloadScene.js esté cargado.');
} else {
    console.log('[main.js] ✓ PreloadScene cargada correctamente');
}

// Verificar que MainScene existe
console.log('[main.js] Verificando MainScene...');
if (typeof MainScene === 'undefined') {
    console.error('[main.js] ✗ MainScene NO está definida. Verifica que MainScene.js esté cargado.');
} else {
    console.log('[main.js] ✓ MainScene cargada correctamente');
}

/**
 * Configuración de Phaser
 */
const phaserConfig = {
    type: Phaser.AUTO,
    width: GameConfig.GAME_WIDTH,
    height: GameConfig.GAME_HEIGHT,
    parent: 'game-container',
    
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 0 }
        }
    },

    render: {
        pixelArt: true,
        antialias: false,
        antialiasGL: false,
        backgroundColor: '#1a1a1a'
    },

    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        expandParent: true,
        fullscreenTarget: 'game-container'
    },

    scene: [BootScene, PreloadScene, MainScene],

    audio: {
        disableWebAudio: false
    }
};

console.log('[main.js] Configuración de Phaser lista');
console.log('[main.js] Creando instancia del juego...');

/**
 * Esperar a que el DOM esté listo
 */
function initializeGame() {
    console.log('[main.js] DOM listo, inicializando Phaser...');
    
    try {
        const game = new Phaser.Game(phaserConfig);
        
        console.log('[main.js] ✓ Instancia de Phaser creada exitosamente');
        console.log('[main.js] Configuración:', phaserConfig);
        
        // Guardar referencia global
        window.plasticCollapseGame = game;
        console.log('[main.js] ✓ Referencia global guardada en window.plasticCollapseGame');
        
    } catch (error) {
        console.error('[main.js] ✗ ERROR creando Phaser:', error);
        console.error('[main.js] Stack:', error.stack);
    }
}

// Ejecutar cuando DOM esté listo
if (document.readyState === 'loading') {
    console.log('[main.js] DOM aún cargando, esperando...');
    document.addEventListener('DOMContentLoaded', initializeGame);
} else {
    console.log('[main.js] DOM ya listo, inicializando ahora...');
    initializeGame();
}

// Handlers globales de error
window.addEventListener('error', (event) => {
    console.error('[ERROR GLOBAL]', event.error);
    console.error('[ERROR] Stack:', event.error.stack);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('[UNHANDLED REJECTION]', event.reason);
});

console.log('%c✓ PLASTIC COLLAPSE Inicializado', 'color: #00ff00; font-weight: bold; font-size: 14px');