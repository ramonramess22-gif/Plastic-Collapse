/**
 * PLASTIC COLLAPSE - BUSINESSMAN
 * NPC especialista: Empresario que ignora el problema
 */

class Businessman extends NPC {
    constructor(scene, x, y) {
        super(scene, x, y, 'businessman');
        this.profitLevel = 100; // Aumenta con contaminación
        this.stage = GAME_STATE.currentStage;
    }

    /**
     * Actualizar según etapa
     */
    update() {
        super.update();

        const currentStage = GAME_STATE.currentStage;
        if (currentStage !== this.stage) {
            this.updateProfitState(currentStage);
            this.stage = currentStage;
        }
    }

    /**
     * Actualizar nivel de ganancias
     * @param {number} stage
     */
    updateProfitState(stage) {
        this.profitLevel = Math.min(100, stage * 12);
        // Cambiar color añadiendo verde (dinero)
        const greenTint = Math.floor(0x00ff00 * (this.profitLevel / 100));
        this.sprite.setTint(0xffffff);
    }

    /**
     * Obtener diálogo según etapa
     * @returns {string}
     */
    getDialogueByStage() {
        const stage = GAME_STATE.currentStage;
        const dialogueMap = {
            1: 'stage1_businessman_welcome',
            2: 'stage2_businessman_opportunity',
            3: 'stage3_businessman_dismissal',
            4: 'stage4_businessman_denial',
            5: 'stage5_businessman_conflict',
            6: 'stage6_businessman_war',
            7: 'stage7_businessman_empty',
            8: 'stage8_businessman_final'
        };
        return dialogueMap[stage] || null;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Businessman;
}