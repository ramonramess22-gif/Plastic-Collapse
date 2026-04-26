/**
 * @file dialogues.js
 * @description Todos los textos de diálogo del juego Plastic Collapse.
 *
 * ESTRUCTURA:
 *   DIALOGUES.<personaje>.<etapa> = string[]
 *
 * SEGURIDAD:
 *   - Objeto completamente estático: sólo literales de string.
 *   - Object.freeze() en todos los niveles.
 *   - Sin código ejecutable, sin eval(), sin interpolación dinámica.
 *   - HUDManager usa textContent para renderizar estos textos — nunca innerHTML.
 *
 * USO:
 *   import { DIALOGUES } from '../data/dialogues.js';
 *   DialogueSystem.start('Dr. García', DIALOGUES.scientist.stage3_warning);
 */

// ─── CIENTÍFICO / ECÓLOGO ─────────────────────────────────────────────────────

const SCIENTIST_DIALOGUES = Object.freeze({

  /** Etapa 3: Advierte a los empresarios sobre el daño del plástico */
  stage3_warning_intro: Object.freeze([
    'Dr. García: Necesito que me escuchen. Llevamos diez años de investigación.',
    'Dr. García: Los químicos usados en la producción de plástico son disruptores endocrinos.',
    'Dr. García: Interfieren con el sistema hormonal de todos los organismos vivos.',
    'Dr. García: Los microplásticos ya están en el agua que bebemos. En el aire que respiramos.',
    'Dr. García: Si no detenemos esto ahora, las consecuencias serán irreversibles.',
  ]),

  stage3_warning_detail: Object.freeze([
    'Dr. García: Los bifenilos policlorados persisten en el ambiente por siglos.',
    'Dr. García: Hemos documentado deterioro cognitivo en poblaciones cercanas a las plantas.',
    'Dr. García: Los ecosistemas acuáticos están colapsando. La cadena trófica se rompe.',
    'Dr. García: Exijo que detengan la producción inmediatamente.',
  ]),

  stage3_ignored: Object.freeze([
    'Dr. García: ¿Por qué no me escuchan? Los datos son irrefutables.',
    'Dr. García: Cada día que pasa es un daño más que no podremos revertir.',
    'Dr. García: La historia los juzgará. Y la naturaleza ya lo está haciendo.',
  ]),

  /** Etapa 7: Habla al jugador sobre lo que fue */
  stage7_reflection: Object.freeze([
    'Dr. García: Te advertí. Le advertí a todos.',
    'Dr. García: Los microplásticos llegaron a cada rincón del planeta.',
    'Dr. García: Los disruptores endocrinos causaron infertilidad masiva en cientos de especies.',
    'Dr. García: La sexta extinción no fue un evento geológico. Fue una decisión económica.',
    'Dr. García: Aún hay vida. Pero el daño tardará mil años en cicatrizar.',
  ]),
});

// ─── EMPRESARIOS ─────────────────────────────────────────────────────────────

const BUSINESSMAN_DIALOGUES = Object.freeze({

  stage3_dismissal_1: Object.freeze([
    'CEO Vargas: Interesante presentación, doctor.',
    'CEO Vargas: Pero nuestros abogados han revisado los estudios.',
    'CEO Vargas: La correlación no implica causalidad.',
    'CEO Vargas: Gracias por su tiempo. Seguridad lo acompañará a la salida.',
  ]),

  stage3_dismissal_2: Object.freeze([
    'Director Mora: Llevamos treinta años operando sin problemas.',
    'Director Mora: Generamos empleos. Pagamos impuestos.',
    'Director Mora: La producción continúa.',
  ]),

  stage5_confronted: Object.freeze([
    'CEO Vargas: ¿Qué quieren los trabajadores ahora?',
    'CEO Vargas: Sus salarios son competitivos para el sector.',
    'CEO Vargas: Si no están conformes, hay miles esperando su puesto.',
  ]),
});

// ─── ANIMALES (Etapa 7) ───────────────────────────────────────────────────────

const ANIMAL_DIALOGUES = Object.freeze({

  deer: Object.freeze([
    'Ciervo: Mi bosque desapareció en una generación.',
    'Ciervo: Donde había árboles centenarios, ahora hay tóxicos y silencio.',
    'Ciervo: Los humanos fragmentaron nuestro hábitat hasta hacerlo inhabitable.',
    'Ciervo: Mis crías nacen con niveles de plástico en la sangre.',
  ]),

  bird: Object.freeze([
    'Pájaro: Solíamos guiarnos por las estrellas para migrar.',
    'Pájaro: Ahora los campos magnéticos están alterados.',
    'Pájaro: Los insectos de los que nos alimentamos desaparecieron.',
    'Pájaro: Sin insectos, no hay polinización. Sin polinización, no hay bosques.',
    'Pájaro: Sin bosques, no hay nada.',
  ]),

  fish: Object.freeze([
    'Pez: El océano ya no es azul. Es gris y tóxico.',
    'Pez: Comemos microplásticos porque están en todo el plancton.',
    'Pez: Los químicos de la producción plástica llevan décadas acumulándose.',
    'Pez: La acidificación del agua disolvió los arrecifes de coral.',
    'Pez: Sin corales, el noventa por ciento de la vida marina desapareció.',
  ]),

  bee: Object.freeze([
    'Abeja: Cuando nosotras morimos, el mundo muere.',
    'Abeja: Los pesticidas y los disruptores endocrinos atacaron nuestros sistemas.',
    'Abeja: Sin polinizadores, los cultivos fallaron.',
    'Abeja: El hambre llegó antes que las guerras. Las guerras vinieron después.',
  ]),
});

// ─── TRABAJADORES (Etapa 5) ───────────────────────────────────────────────────

const WORKER_DIALOGUES = Object.freeze({

  precarity: Object.freeze([
    'Obrero: Llevamos tres turnos sin descanso.',
    'Obrero: El salario no alcanza para alimentar a mi familia.',
    'Obrero: Aquí enfermamos. Aquí morimos. Y ellos siguen ganando millones.',
  ]),

  revolt: Object.freeze([
    'Obrero: ¡Ya no más! Nos negamos a seguir envenenando el mundo por su beneficio.',
    'Obrero: Si no nos escuchan en las negociaciones, lo harán en las calles.',
    'Obrero: No hay trabajo en un planeta muerto.',
  ]),
});

// ─── NARRACIÓN DEL JUEGO (voz omnisciente / carteles) ────────────────────────

const NARRATOR_DIALOGUES = Object.freeze({

  stage1_intro: Object.freeze([
    '[ Este es el mundo como debería ser. ]',
    '[ Ecosistemas en equilibrio. Fauna abundante. Aire limpio. ]',
    '[ Pero algo está por cambiar. ]',
  ]),

  stage2_factory_enter: Object.freeze([
    '[ Has entrado a la Fábrica Vargas & Mora S.A. ]',
    '[ El mayor productor de polietileno de la región. ]',
    '[ Aquí se extrae petróleo, se procesan químicos industriales, ]',
    '[ y se fabrica el plástico que inunda el mundo. ]',
  ]),

  stage2_process: Object.freeze([
    '[ Proceso 1: Extracción de petróleo crudo. ]',
    '[ Proceso 2: Craqueo catalítico — separación de fracciones. ]',
    '[ Proceso 3: Polimerización — formación de cadenas plásticas. ]',
    '[ Proceso 4: Aditivos químicos: plastificantes, estabilizadores, colorantes. ]',
    '[ Resultado: Millones de toneladas de plástico al año. ]',
  ]),

  stage4_consequences: Object.freeze([
    '[ La contaminación superó el umbral de recuperación. ]',
    '[ Los microplásticos alcanzaron las capas superiores de la atmósfera. ]',
    '[ El estrés térmico aceleró la microevolución de patógenos. ]',
    '[ La selección artificial creó organismos resistentes a todo menos al plástico. ]',
  ]),

  stage6_war_enter: Object.freeze([
    '[ Cuando los recursos naturales colapsan, ]',
    '[ las sociedades colapsan con ellos. ]',
    '[ Lo que empezó como revueltas laborales ]',
    '[ escaló en un conflicto global por agua, suelo y aire limpio. ]',
  ]),

  stage8_final: Object.freeze([
    '[ Biodiversidad: crítica. ]',
    '[ Ecosistemas funcionales: menos del 12% del planeta. ]',
    '[ Población humana: en declive acelerado. ]',
    '[ Concentración de microplásticos en sangre humana: nivel máximo registrado. ]',
  ]),

  end_message: Object.freeze([
    '[ Si no hay cambios, este será nuestro futuro. ]',
    '[ No es ciencia ficción. ]',
    '[ Es la proyección directa de las tendencias actuales. ]',
    '[ Aún estás a tiempo de que este mundo sea diferente. ]',
  ]),
});

// ─── EXPORT PRINCIPAL ─────────────────────────────────────────────────────────

/**
 * Exportación principal del módulo.
 * Importar así:
 *   import { DIALOGUES } from '../data/dialogues.js';
 */
export const DIALOGUES = Object.freeze({
  scientist:  SCIENTIST_DIALOGUES,
  businessman: BUSINESSMAN_DIALOGUES,
  animals:    ANIMAL_DIALOGUES,
  workers:    WORKER_DIALOGUES,
  narrator:   NARRATOR_DIALOGUES,
});