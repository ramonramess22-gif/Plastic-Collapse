/**
 * PLASTIC COLLAPSE - ASSET LOADER
 * Sistema de carga de assets con generación automática de placeholders
 */

class AssetLoader {
    constructor(scene) {
        this.scene = scene;
        this.loadedAssets = new Set();
        this.placeholderAssets = new Set();
    }
    
    /**
     * Genera un sprite placeholder automáticamente
     * @param {string} key - Identificador único del sprite
     * @param {number} width - Ancho del placeholder (default: 32)
     * @param {number} height - Alto del placeholder (default: 32)
     * @param {string} color - Color del placeholder (default: '#FF00FF')
     */
    createPlaceholder(key, width = 32, height = 32, color = '#FF00FF') {
        if (this.scene.textures.exists(key)) {
            return; // Ya existe
        }
        
        const graphics = this.scene.make.graphics({ x: 0, y: 0, add: false });
        graphics.fillStyle(Phaser.Display.Color.HexStringToColor(color).color, 1);
        graphics.fillRect(0, 0, width, height);
        graphics.lineStyle(2, 0x000000, 1);
        graphics.strokeRect(0, 0, width, height);
        
        // Agregar texto al placeholder
        const text = graphics.context.canvas.toDataURL();
        graphics.generateTexture(key, width, height);
        graphics.destroy();
        
        this.placeholderAssets.add(key);
        console.log(`[PLACEHOLDER] Creado: ${key} (${width}x${height})`);
    }
    
    /**
     * Carga un sprite o genera placeholder si no existe
     * @param {string} key - Identificador del sprite
     * @param {string} url - URL del sprite (opcional)
     * @param {number} width - Ancho (default: 32)
     * @param {number} height - Alto (default: 32)
     */
    loadOrCreatePlaceholder(key, url, width = 32, height = 32) {
        if (this.scene.textures.exists(key)) {
            this.loadedAssets.add(key);
            return;
        }
        
        // Si existe URL, intentar cargar
        if (url) {
            try {
                this.scene.load.image(key, url);
                this.scene.load.once('filecomplete-image-' + key, () => {
                    this.loadedAssets.add(key);
                    console.log(`[ASSET LOADED] ${key}`);
                });
                return;
            } catch (e) {
                console.warn(`[ASSET ERROR] No se pudo cargar ${key}, usando placeholder`);
            }
        }
        
        // Crear placeholder
        this.createPlaceholder(key, width, height);
    }
    
    /**
     * Reemplaza un placeholder con un sprite real
     * @param {string} key - Identificador del sprite
     * @param {string} url - URL del nuevo sprite
     */
    replacePlaceholder(key, url) {
        if (this.placeholderAssets.has(key)) {
            try {
                // Eliminar placeholder anterior
                if (this.scene.textures.exists(key)) {
                    this.scene.textures.remove(key);
                }
                
                // Cargar nuevo asset
                this.scene.load.image(key, url);
                this.scene.load.once('filecomplete-image-' + key, () => {
                    this.loadedAssets.add(key);
                    this.placeholderAssets.delete(key);
                    console.log(`[SPRITE REPLACED] ${key}`);
                });
                this.scene.load.start();
            } catch (e) {
                console.error(`[REPLACEMENT ERROR] ${key}:`, e);
            }
        }
    }
    
    /**
     * Obtiene información sobre un asset
     * @param {string} key - Identificador del sprite
     * @returns {Object} Información del asset
     */
    getAssetInfo(key) {
        return {
            key: key,
            loaded: this.loadedAssets.has(key),
            isPlaceholder: this.placeholderAssets.has(key),
            exists: this.scene.textures.exists(key)
        };
    }
    
    /**
     * Lista todos los assets cargados
     * @returns {Object} Resumen de assets
     */
    getLoadedAssets() {
        return {
            loaded: Array.from(this.loadedAssets),
            placeholders: Array.from(this.placeholderAssets),
            totalLoaded: this.loadedAssets.size,
            totalPlaceholders: this.placeholderAssets.size
        };
    }
}