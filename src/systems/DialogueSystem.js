/**
 * PLASTIC COLLAPSE - DIALOGUE SYSTEM
 * Gestiona diálogos con NPCs
 * 
 * EDITA AQUÍ LOS DIÁLOGOS:
 * Los diálogos están centralizados en src/data/dialogues.js
 * Estructura por acto y personaje
 * Soporta múltiples páginas por diálogo
 */

class DialogueSystem {
    constructor(scene) {
        this.scene = scene;
        this.currentDialogue = null;
        this.currentPageIndex = 0;
        this.dialogueBox = null;
    }

    /**
     * Iniciar un diálogo
     * @param {string} npcId - ID del NPC
     * @param {string} dialogueKey - Clave del diálogo en DIALOGUES
     */
    startDialogue(npcId, dialogueKey) {
        if (!DIALOGUES[dialogueKey]) {
            console.warn(`[DIALOGUE] No existe diálogo: ${dialogueKey}`);
            return;
        }

        this.currentDialogue = DIALOGUES[dialogueKey];
        this.currentPageIndex = 0;
        GAME_STATE.isInDialogue = true;

        GLOBAL_EVENT_BUS.emit(EVENTS.DIALOGUE_START, { npcId, dialogueKey });

        this.showDialoguePage(0);
    }

    /**
     * Mostrar página del diálogo
     * @param {number} pageIndex
     */
    showDialoguePage(pageIndex) {
        if (!this.currentDialogue) return;

        const pages = this.currentDialogue.pages || [{ text: this.currentDialogue.text }];
        const page = pages[pageIndex];

        if (!page) {
            this.endDialogue();
            return;
        }

        // Crear caja de diálogo
        if (!this.dialogueBox) {
            this.dialogueBox = this.createDialogueBox();
        }

        // Actualizar contenido
        const npcName = this.currentDialogue.npc || 'NPC';
        const text = page.text;

        this.dialogueBox.nameText.setText(npcName);
        this.dialogueBox.dialogueText.setText(text);

        // Mostrar indicador de siguiente página
        if (pageIndex < pages.length - 1) {
            this.dialogueBox.nextIndicator.setVisible(true);
        } else {
            this.dialogueBox.nextIndicator.setVisible(false);
        }

        this.currentPageIndex = pageIndex;
        GLOBAL_EVENT_BUS.emit(EVENTS.DIALOGUE_NEXT_PAGE, { pageIndex });
    }

    /**
     * Crear caja de diálogo
     */
    createDialogueBox() {
        const width = this.scene.game.config.width;
        const height = this.scene.game.config.height;
        const boxWidth = width - 40;
        const boxHeight = 120;

        const container = this.scene.add.container(20, height - boxHeight - 20);
        container.setDepth(CONSTANTS.DEPTHS.UI);

        // Fondo
        const bg = this.scene.add.rectangle(
            boxWidth / 2,
            boxHeight / 2,
            boxWidth,
            boxHeight,
            0x2c3e50,
            0.95
        );
        container.add(bg);

        // Borde
        const border = this.scene.add.graphics();
        border.lineStyle(2, 0xecf0f1, 1);
        border.strokeRect(0, 0, boxWidth, boxHeight);
        container.add(border);

        // Nombre del NPC
        const nameText = this.scene.add.text(15, 10, 'NPC', {
            fontSize: '14px',
            fill: '#f39c12',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        });
        container.add(nameText);

        // Texto del diálogo
        const dialogueText = this.scene.add.text(15, 35, '', {
            fontSize: '12px',
            fill: '#ecf0f1',
            fontFamily: 'Arial',
            wordWrap: { width: boxWidth - 30 },
            align: 'left'
        });
        container.add(dialogueText);

        // Indicador de siguiente página
        const nextIndicator = this.scene.add.text(
            boxWidth - 20,
            boxHeight - 15,
            'Presiona E [continuar]',
            {
                fontSize: '10px',
                fill: '#95a5a6',
                fontFamily: 'Arial',
                align: 'right'
            }
        );
        nextIndicator.setOrigin(1, 1);
        container.add(nextIndicator);

        container.nameText = nameText;
        container.dialogueText = dialogueText;
        container.nextIndicator = nextIndicator;

        return container;
    }

    /**
     * Siguiente página del diálogo
     */
    nextPage() {
        if (!this.currentDialogue) return;

        const pages = this.currentDialogue.pages || [{ text: this.currentDialogue.text }];
        const nextIndex = this.currentPageIndex + 1;

        if (nextIndex < pages.length) {
            this.showDialoguePage(nextIndex);
        } else {
            this.endDialogue();
        }
    }

    /**
     * Terminar diálogo
     */
    endDialogue() {
        GAME_STATE.isInDialogue = false;
        GLOBAL_EVENT_BUS.emit(EVENTS.DIALOGUE_END);

        if (this.dialogueBox) {
            this.dialogueBox.destroy();
            this.dialogueBox = null;
        }

        this.currentDialogue = null;
        this.currentPageIndex = 0;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = DialogueSystem;
}