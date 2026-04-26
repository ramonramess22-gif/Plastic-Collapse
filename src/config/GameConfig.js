/**
 * PLASTIC COLLAPSE - GAME CONFIG
 * Configuración central de Phaser 3
 */

const CONFIG = {
    type: Phaser.AUTO,
    width: CONSTANTS.GAME_WIDTH,
    height: CONSTANTS.GAME_HEIGHT,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    render: {
        pixelArt: true,
        antialias: false,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [
        BootScene,
        PreloadScene,
        MainMenuScene,
        Stage1_NaturalWorld,
        Stage2_Factory,
        Stage3_Warning,
        Stage4_Consequences,
        Stage5_SocialImpact,
        Stage6_War,
        Stage7_Animals,
        Stage8_FinalWorld,
        EndScene
    ],
    input: {
        keyboard: true,
        mouse: true
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}