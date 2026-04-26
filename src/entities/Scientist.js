/**
 * PLASTIC COLLAPSE - SCIENTIST
 * NPC especialista: Científico que advierte sobre el colapso
 */

class Scientist extends NPC {
    constructor(scene, x, y) {
        super(scene, x, y, 'scientist');
        this.hasWarnedPlayer = false;
        this.emotionalState = 'normal'; // normal, worried, desperate
        this.stage = GAME_STATE.currentStage;
    }

    /**
     * Actualizar estado del científico según la etapa
     */
    update() {
        super.update();

        // Cambiar expresión según etapa
        const currentStage = GAME_STATE.currentStage;
        if (currentStage !== this.stage) {
            this.updateEmotionalState(currentStage);
            this.stage = currentStage;
        }
    }

    /**
     * Actualizar estado emocional
     * @param {number} stage
     */
    updateEmotionalState(stage) {
        if (stage <= 2) {
            this.emotionalState = 'normal';
        } else if (stage <= 4) {
            this.emotionalState = 'worried';
            // Cambiar tinte
            this.sprite.setTint(0xff9999);
        } else {
            this.emotionalState = 'desperate';
            this.sprite.setTint(0xff0000);
        }
    }

    /**
     * Obtener diálogo según etapa
     * @returns {string}
     */
    getDialogueByStage() {
        const stage = GAME_STATE.currentStage;
        const dialogueMap = {
            1: 'stage1_scientist_observation',
            2: 'stage2_scientist_first_data',
            3: 'stage3_scientist_warning',
            4: 'stage4_scientist_desperate',
            5: 'stage5_scientist_final_plea',
            6: 'stage6_scientist_silence',
            7: 'stage7_scientist_regret',
            8: 'stage8_scientist_reflection'
        };
        return dialogueMap[stage] || null;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Scientist;
}