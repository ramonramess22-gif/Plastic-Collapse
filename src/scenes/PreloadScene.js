/**
 * PLASTIC COLLAPSE - PRELOAD SCENE
 * Escena de precarga - Carga todos los assets
 */

class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }

    init() {
        this.assetLoader = new AssetLoader(this);
    }

    preload() {
        console.log('⏳ PRELOAD: Cargando assets...');

        // Crear barra de progreso
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();

        // Fondo
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 4, height / 2 - 30, width / 2, 60);

        // Texto
        const loadingText = this.add.text(
            width / 2,
            height / 2 - 40,
            'Cargando...',
            { fontSize: '32px', fill: '#ffffff', fontFamily: 'Arial' }
        );
        loadingText.setOrigin(0.5);

        // Evento de progreso
        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0x00ff00, 1);
            progressBar.fillRect(
                width / 4 + 10,
                height / 2 - 20,
                (width / 2 - 20) * value,
                40
            );
        });

        // Cargar sprites (placeholders si no existen)
        this.loadPlayerSprites();
        this.loadNPCSprites();
        this.loadEnvironmentSprites();
    }

    /**
     * Cargar sprites del jugador
     */
    loadPlayerSprites() {
        const spriteData = getSpriteData('player');
        if (spriteData && spriteData.exists) {
            this.load.spritesheet('player', spriteData.path, {
                frameWidth: 32,
                frameHeight: 32
            });
        } else {
            // Generar placeholder
            this.assetLoader.createPlaceholder('player', 32, 32, '#FF00FF');
        }
    }

    /**
     * Cargar sprites de NPCs
     */
    loadNPCSprites() {
        ['villager', 'scientist', 'businessman'].forEach(npcType => {
            const key = `npc_${npcType}`;
            const spriteData = getSpriteData(npcType);
            
            if (spriteData && spriteData.exists) {
                this.load.spritesheet(key, spriteData.path, {
                    frameWidth: 32,
                    frameHeight: 32
                });
            } else {
                this.assetLoader.createPlaceholder(key, 32, 32, '#00FF00');
            }
        });

        // Animales
        ['bird', 'fish', 'rabbit'].forEach(animalType => {
            const key = `animal_${animalType}`;
            this.assetLoader.createPlaceholder(key, 32, 32, '#FFFF00');
        });
    }

    /**
     * Cargar sprites de entorno
     */
    loadEnvironmentSprites() {
        ['tree', 'rock', 'factory', 'door'].forEach(objType => {
            this.assetLoader.createPlaceholder(objType, 32, 32, '#00FFFF');
        });
    }

    create() {
        console.log('✓ PRELOAD: Assets cargados');
        this.scene.start('MainMenuScene');
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = PreloadScene;
}