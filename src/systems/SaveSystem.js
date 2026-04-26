/**
 * PLASTIC COLLAPSE - SAVE SYSTEM
 * Sistema de guardado y carga de juego
 */

class SaveSystem {
    constructor() {
        this.saveSlots = 3;
        this.storagePrefix = 'plastic-collapse_';
    }
    
    /**
     * Guardar juego en un slot
     * @param {number} slotNumber - Número del slot (1-3)
     * @returns {boolean} Éxito de guardado
     */
    save(slotNumber = 1) {
        try {
            if (slotNumber < 1 || slotNumber > this.saveSlots) {
                console.warn(`[SAVE] Slot inválido: ${slotNumber}`);
                return false;
            }
            
            const saveData = {
                timestamp: new Date().toISOString(),
                gameState: GAME_STATE.toJSON()
            };
            
            const key = `${this.storagePrefix}save_${slotNumber}`;
            localStorage.setItem(key, JSON.stringify(saveData));
            
            console.log(`[SAVE] Juego guardado en slot ${slotNumber}`);
            GLOBAL_EVENT_BUS.emit(EVENTS.GAME_SAVE, { slot: slotNumber });
            
            return true;
        } catch (error) {
            console.error(`[SAVE ERROR]`, error);
            return false;
        }
    }
    
    /**
     * Cargar juego desde un slot
     * @param {number} slotNumber - Número del slot (1-3)
     * @returns {Object|null} Datos guardados o null
     */
    load(slotNumber = 1) {
        try {
            const key = `${this.storagePrefix}save_${slotNumber}`;
            const saveData = localStorage.getItem(key);
            
            if (!saveData) {
                console.warn(`[LOAD] No hay datos en slot ${slotNumber}`);
                return null;
            }
            
            const data = JSON.parse(saveData);
            GAME_STATE.fromJSON(data.gameState);
            
            console.log(`[LOAD] Juego cargado desde slot ${slotNumber}`);
            GLOBAL_EVENT_BUS.emit(EVENTS.GAME_LOAD, { slot: slotNumber });
            
            return data;
        } catch (error) {
            console.error(`[LOAD ERROR]`, error);
            return null;
        }
    }
    
    /**
     * Obtener información de un slot
     * @param {number} slotNumber - Número del slot
     * @returns {Object|null} Info del slot o null
     */
    getSlotInfo(slotNumber = 1) {
        try {
            const key = `${this.storagePrefix}save_${slotNumber}`;
            const saveData = localStorage.getItem(key);
            
            if (!saveData) return null;
            
            const data = JSON.parse(saveData);
            return {
                hasData: true,
                timestamp: data.timestamp,
                stage: data.gameState.currentStage,
                position: data.gameState.playerPosition
            };
        } catch (error) {
            console.error(`[SLOT INFO ERROR]`, error);
            return null;
        }
    }
    
    /**
     * Listar todos los slots disponibles
     * @returns {Array} Array con información de slots
     */
    listSlots() {
        const slots = [];
        for (let i = 1; i <= this.saveSlots; i++) {
            slots.push({
                slotNumber: i,
                info: this.getSlotInfo(i)
            });
        }
        return slots;
    }
    
    /**
     * Eliminar un slot
     * @param {number} slotNumber - Número del slot
     * @returns {boolean} Éxito de eliminación
     */
    deleteSlot(slotNumber = 1) {
        try {
            const key = `${this.storagePrefix}save_${slotNumber}`;
            localStorage.removeItem(key);
            console.log(`[DELETE] Slot ${slotNumber} eliminado`);
            return true;
        } catch (error) {
            console.error(`[DELETE ERROR]`, error);
            return false;
        }
    }
    
    /**
     * Limpiar todos los saves
     * @returns {boolean} Éxito de limpieza
     */
    clearAllSaves() {
        try {
            for (let i = 1; i <= this.saveSlots; i++) {
                this.deleteSlot(i);
            }
            console.log(`[CLEAR] Todos los saves eliminados`);
            return true;
        } catch (error) {
            console.error(`[CLEAR ERROR]`, error);
            return false;
        }
    }
}

// Crear instancia global
const SAVE_SYSTEM = new SaveSystem();