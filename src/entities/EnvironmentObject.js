/**
 * PLASTIC COLLAPSE - ENVIRONMENT OBJECT
 * Objetos ambientales que cambian según la etapa
 */

class EnvironmentObject {
    constructor(scene, x, y, objectType = 'tree') {
        this.scene = scene;
        this.gridX = Math.floor(x / CONSTANTS.TILE_SIZE);
        this.gridY = Math.floor(y / CONSTANTS.TILE_SIZE);
        this.objectType = objectType;
        this.stage = GAME_STATE.currentStage;
        this.health = 100;

        // Crear sprite
        this.sprite = scene.add.sprite(x, y, `env_${objectType}_placeholder`);
        this.sprite.setDepth(CONSTANTS.DEPTHS.OBJECTS);
        this.updateAppearance();
    }

    /**
     * Actualizar apariencia según etapa
     */
    update() {
        const currentStage = GAME_STATE.currentStage;
        if (currentStage !== this.stage) {
            this.stage = currentStage;
            this.updateAppearance();
        }
    }

    /**
     * Actualizar apariencia visual
     */
    updateAppearance() {
        const stage = this.stage;
        const health = Math.max(0, 100 - (stage * 12));

        // Cambiar color progresivamente
        if (health > 75) {
            this.sprite.setTint(0xffffff); // Normal
        } else if (health > 50) {
            this.sprite.setTint(0xccaa44); // Amarillento
        } else if (health > 25) {
            this.sprite.setTint(0x996633); // Marrón
        } else if (health > 0) {
            this.sprite.setTint(0x666666); // Gris
        } else {
            this.sprite.setTint(0x333333); // Casi negro
            this.sprite.setAlpha(0.5);
        }

        // Cambiar escala (marchitarse)
        const scaleReduction = 1 - ((100 - health) / 100) * 0.3;
        this.sprite.setScale(scaleReduction);
    }

    /**
     * Aplicar daño ambiental
     * @param {number} damage
     */
    takeDamage(damage = 10) {
        this.health = Math.max(0, this.health - damage);
        this.updateAppearance();
    }

    /**
     * Obtener salud del objeto
     * @returns {number}
     */
    getHealth() {
        return this.health;
    }

    /**
     * Verificar si sigue vivo
     * @returns {boolean}
     */
    isAlive() {
        return this.health > 0;
    }

    /**
     * Destruir objeto
     */
    destroy() {
        if (this.sprite) {
            this.sprite.destroy();
        }
    }
}