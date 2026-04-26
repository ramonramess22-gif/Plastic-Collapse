/**
 * PLASTIC COLLAPSE - STAGE DATA
 * Configuración de cada etapa narrativa
 */

const STAGE_DATA = {
    1: {
        name: 'Natural World',
        description: 'El mundo en su estado natural y puro',
        sceneKey: 'Stage1_NaturalWorld',
        environmentalHealth: 100,
        colorProfile: 'stage1',
        musicIntensity: 0.3,
        npcCount: 8,
        cinematicAtStart: true,
        environmentalChanges: {
            vegetationColor: 0x2D8659,
            waterColor: 0x1E90FF,
            skyColor: 0x87CEEB,
            pollutionLevel: 0
        }
    },

    2: {
        name: 'Industrial Birth',
        description: 'La fábrica aparece. El progreso comienza.',
        sceneKey: 'Stage2_Factory',
        environmentalHealth: 80,
        colorProfile: 'stage2',
        musicIntensity: 0.5,
        npcCount: 12,
        cinematicAtStart: true,
        environmentalChanges: {
            vegetationColor: 0x3D9770,
            waterColor: 0x4A9FBF,
            skyColor: 0xA9B5C4,
            pollutionLevel: 20,
            smokeParticles: true
        }
    },

    3: {
        name: 'Warning Signs',
        description: 'Los científicos advierten. Nadie escucha.',
        sceneKey: 'Stage3_Warning',
        environmentalHealth: 65,
        colorProfile: 'stage3',
        musicIntensity: 0.6,
        npcCount: 15,
        cinematicAtStart: false,
        environmentalChanges: {
            vegetationColor: 0x4D8570,
            waterColor: 0x5A7FAA,
            skyColor: 0x8B9DC3,
            pollutionLevel: 40,
            deadPlants: true
        }
    },

    4: {
        name: 'Environmental Consequences',
        description: 'El daño es visible. La enfermedad se expande.',
        sceneKey: 'Stage4_Consequences',
        environmentalHealth: 45,
        colorProfile: 'stage4',
        musicIntensity: 0.7,
        npcCount: 15,
        cinematicAtStart: false,
        environmentalChanges: {
            vegetationColor: 0x5A7D6B,
            waterColor: 0x5A7087,
            skyColor: 0x7A8FAB,
            pollutionLevel: 60,
            ashParticles: true,
            sickAnimals: true
        }
    },

    5: {
        name: 'Social Impact',
        description: 'El conflicto surge. La sociedad se divide.',
        sceneKey: 'Stage5_SocialImpact',
        environmentalHealth: 30,
        colorProfile: 'stage5',
        musicIntensity: 0.8,
        npcCount: 18,
        cinematicAtStart: false,
        environmentalChanges: {
            vegetationColor: 0x6B8B7E,
            waterColor: 0x4A5A7A,
            skyColor: 0x6B7B99,
            pollutionLevel: 75,
            fireOutbreaks: true,
            protestActivity: true
        }
    },

    6: {
        name: 'War',
        description: 'Todo se descontrola. Las ciudades arden.',
        sceneKey: 'Stage6_War',
        environmentalHealth: 15,
        colorProfile: 'stage6',
        musicIntensity: 0.95,
        npcCount: 20,
        cinematicAtStart: false,
        environmentalChanges: {
            vegetationColor: 0x3A4A5A,
            waterColor: 0x3A4A5A,
            skyColor: 0x5A6B8B,
            pollutionLevel: 90,
            explosions: true,
            ruins: true
        }
    },

    7: {
        name: 'Ecological Collapse',
        description: 'El ecosistema está muerto. Solo queda silencio.',
        sceneKey: 'Stage7_Animals',
        environmentalHealth: 5,
        colorProfile: 'stage7',
        musicIntensity: 0.5,
        npcCount: 5,
        cinematicAtStart: false,
        environmentalChanges: {
            vegetationColor: 0x696969,
            waterColor: 0x2F4F4F,
            skyColor: 0x4A5A7A,
            pollutionLevel: 100,
            noAnimals: true,
            ashCoveredWorld: true
        }
    },

    8: {
        name: 'Final World',
        description: 'El fin. Un mundo gris, muerto, sin esperanza.',
        sceneKey: 'Stage8_FinalWorld',
        environmentalHealth: 0,
        colorProfile: 'stage8',
        musicIntensity: 0.2,
        npcCount: 0,
        cinematicAtStart: true,
        environmentalChanges: {
            vegetationColor: 0x222222,
            waterColor: 0x222222,
            skyColor: 0x333333,
            pollutionLevel: 100,
            deathParticles: true,
            completeSilence: true
        }
    }
};

/**
 * Obtener datos de una etapa
 * @param {number} stageNumber
 * @returns {Object}
 */
function getStageData(stageNumber) {
    return STAGE_DATA[stageNumber] || STAGE_DATA[1];
}