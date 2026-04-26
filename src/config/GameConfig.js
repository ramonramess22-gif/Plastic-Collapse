/**
 * PLASTIC COLLAPSE - GAME CONFIG
 * Configuración de Phaser
 */

const GameConfig = {
    type: Phaser.AUTO,
    width: CONSTANTS.GAME_WIDTH,
    height: CONSTANTS.GAME_HEIGHT,
    parent: 'game-container',
    render: {
        pixelArt: true,
        antialias: false
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
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
    ]
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameConfig;
}