/**
 * PLASTIC COLLAPSE - DIALOGUES
 * ========================================
 * AQUÍ EDITAS TODOS LOS DIÁLOGOS DEL JUEGO
 * ========================================
 * 
 * ESTRUCTURA:
 * -----------
 * const DIALOGUES = {
 *   'dialogue_id': {
 *       npc: 'Nombre del NPC',
 *       pages: [
 *           { text: 'Primera página del diálogo' },
 *           { text: 'Segunda página del diálogo' },
 *           { text: '...' }
 *       ]
 *   }
 * };
 * 
 * CÓMO ASIGNAR A UN NPC:
 * ----------------------
 * En la clase NPC, en el método initialize():
 *   this.dialogueKey = 'dialogue_id';
 * 
 * CÓMO LLAMAR EL DIÁLOGO:
 * -----------------------
 * dialogueSystem.startDialogue(npcId, 'dialogue_id');
 */

const DIALOGUES = {
    // ETAPA 1: Mundo Natural
    'stage1_npc_welcome': {
        npc: 'Guardabosques',
        pages: [
            { text: 'Bienvenido. Este bosque ha sido nuestro hogar durante siglos. La naturaleza prospera aquí, en perfecto equilibrio.' },
            { text: '¿Ves esos árboles? Son viejos, sabios. El agua está limpia, los animales pacen en paz.' },
            { text: 'Disfruta de este momento. El mundo así es hermoso.' }
        ]
    },

    'stage1_npc_animal': {
        npc: 'Observador de Fauna',
        pages: [
            { text: 'Mira cómo los pájaros cantan sin preocupación. Los ciervos beben del río con libertad.' },
            { text: 'La vida aquí es simple y perfecta. Cada criatura conoce su lugar en el ciclo.' }
        ]
    },

    // ETAPA 2: Fábrica
    'stage2_npc_factory': {
        npc: 'Capataz de Fábrica',
        pages: [
            { text: 'Bienvenido a la nueva era. Esta fábrica traerá progreso, empleo, modernidad.' },
            { text: 'Sí, hay algo de humo. Pero mira cuánta gente hay trabajando. ¿No es esto lo que queremos?' },
            { text: 'Un poco de sacrificio ambiental por el bien del pueblo. Es un precio justo.' }
        ]
    },

    'stage2_npc_worried': {
        npc: 'Ciudadano Preocupado',
        pages: [
            { text: 'No me gusta esto... El bosque está cambiando. Los pájaros ya no cantan como antes.' },
            { text: 'Dicen que es "progreso", pero yo siento que algo está mal.' }
        ]
    },

    // ETAPA 3: Advertencia
    'stage3_npc_scientist': {
        npc: 'Científico',
        pages: [
            { text: 'He estudiado los cambios. Los datos no mienten: contaminación, pérdida de biodiversidad, cambio climático.' },
            { text: 'Presenté mis hallazgos a los líderes. Esperaba acción. Pero nadie escucha.' },
            { text: 'Es demasiado incómodo admitir que tenemos un problema.' }
        ]
    },

    'stage3_npc_denier': {
        npc: 'Político',
        pages: [
            { text: 'Las teorías sobre "colapso ambiental" son exageradas. La economía va bien, eso es lo importante.' },
            { text: 'Siempre ha habido preocupaciones sobre la naturaleza. El mundo está más fuerte que nunca.' },
            { text: 'No vamos a frenar el progreso por miedo.' }
        ]
    },

    // ETAPA 4: Consecuencias
    'stage4_npc_farmer': {
        npc: 'Granjero',
        pages: [
            { text: 'Las cosechas están fallando. El agua que bebo tiene un sabor extraño. Los animales están enfermos.' },
            { text: 'Esto no es normal. Algo se rompió en la naturaleza.' }
        ]
    },

    'stage4_npc_sick': {
        npc: 'Persona Enferma',
        pages: {
            text: 'Todos enferman aquí ahora. Los niños con asma. La gente mayor con problemas respiratorios. ¿Alguien notó que el aire se oscureció?'
        }
    },

    // ETAPA 5: Impacto Social
    'stage5_npc_protester': {
        npc: 'Activista',
        pages: [
            { text: '¡Exigimos cambio! Durante años dijimos que esto pasaría, ¡Y NADIE HIZO NADA!' },
            { text: 'Ahora es tarde. La gente sufre. Pero algunos aún quieren ignorar la realidad.' },
            { text: 'Está generando conflicto. Tensión. Ira.' }
        ]
    },

    'stage5_npc_businessman': {
        npc: 'Empresario',
        pages: [
            { text: 'Los negocios siguen. Aunque el mundo arda, el dinero encontrará su camino.' },
            { text: 'No es mi culpa que la gente no se adaptó a tiempo.' }
        ]
    },

    // ETAPA 6: Guerra
    'stage6_npc_soldier': {
        npc: 'Soldado',
        pages: [
            { text: 'Los recursos escasean. Ahora es guerra. Lucha por agua, alimentos, tierra.' },
            { text: 'No importa contra quién luches... todos perdemos.' }
        ]
    },

    // ETAPA 7: Colapso
    'stage7_npc_survivor': {
        npc: 'Superviviente',
        pages: [
            { text: '...' },
            { text: 'Ya no hay nada que decir.' }
        ]
    },

    // ETAPA 8: Fin
    'stage8_reflection': {
        npc: 'Voz',
        pages: [
            { text: 'Mirando atrás... todo era evitable.' },
            { text: 'Una pequeña decisión. Un poco de progreso. Señales ignoradas.' },
            { text: 'Avances lógicos que, poco a poco, se convirtieron en colapso irreversible.' },
            { text: 'No fue el fin del mundo. Fue el fin de una forma de vivir.' },
            { text: 'Y nosotros fuimos testigos de cada paso hacia el abismo.' }
        ]
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = DIALOGUES;
}