/**
 * PLASTIC COLLAPSE - ANIMAL NPC
 * NPCs animales con comportamiento natural
 */

class AnimalNPC extends NPC {
    constructor(scene, x, y, animalType = 'bird') {
        super(scene, x, y, 'animal');
        this.animalType = animalType;
        this.health = 100;
        this.stage = GAME_STATE.currentStage;
        this.moveInterval = Phaser.Math.Between(1000, 3000); // Más activos
    }

    /**
     * Actualizar animal según etapa (enfermedad progresiva)
     */
    update() {
        super.update();

        const currentStage = GAME_STATE.currentStage;
        if (currentStage !== this.stage) {
            this.updateHealth(currentStage);
            this.stage = currentStage;
        }
    }

    /**
     * Actualizar salud del animal
     * @param {number} stage
     */
    updateHealth(stage) {
        // La salud empeora con cada etapa
        this.health = Math.max(0, 100 - (stage * 12));

        if (this.health > 75) {
            this.sprite.setTint(0xffffff);
        } else if (this.health > 50) {
            this.sprite.setTint(0xffcc99);
        } else if (this.health > 25) {
            this.sprite.setTint(0xffaa66);
        } else {
            this.sprite.setTint(0xff6666);
        }

        // Si la salud es 0, desaparecer
        if (this.health <= 0) {
            this.disappear();
        }
    }

    /**
     * Hacer que el animal desaparezca
     */
    disappear() {
        this.scene.tweens.add({
            targets: this.sprite,
            alpha: 0,
            duration: 2000,
            ease: 'Linear',
            onComplete: () => {
                this.destroy();
            }
        });
    }

    /**
     * Obtener diálogo según tipo de animal
     * @returns {string}
     */
    getDialogue() {
        // Los animales no hablan, pero pueden tener sonidos/reacciones
        return null;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimalNPC;
}