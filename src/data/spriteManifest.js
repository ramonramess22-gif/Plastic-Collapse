/**
 * @file spriteManifest.js
 * @description Registro completo de todos los sprites del proyecto.
 *
 * Documento único de referencia para:
 *   - Diseñadores de arte al crear los sprites
 *   - Desarrolladores al referenciar assets
 *   - Validación de que todos los archivos esperados existen
 *
 * SEGURIDAD: Sólo datos estáticos. Object.freeze(). Sin eval().
 */

export const SPRITE_MANIFEST = Object.freeze({

  player: Object.freeze([
    {
      file:      'assets/sprites/player/player_idle.png',
      key:       'player_idle',
      frames:    4,
      frameSize: { w: 32, h: 48 },
      represents: 'Protagonista del juego en estado de reposo',
      function:   'Animación base cuando el jugador no se mueve',
      usedIn:    ['Todas las etapas'],
    },
    {
      file:      'assets/sprites/player/player_walk_down.png',
      key:       'player_walk_down',
      frames:    4,
      frameSize: { w: 32, h: 48 },
      represents: 'Protagonista caminando hacia abajo (sur)',
      function:   'Movimiento hacia el sur',
      usedIn:    ['Todas las etapas'],
    },
    {
      file:      'assets/sprites/player/player_walk_up.png',
      key:       'player_walk_up',
      frames:    4,
      frameSize: { w: 32, h: 48 },
      represents: 'Protagonista caminando hacia arriba (norte)',
      function:   'Movimiento hacia el norte',
      usedIn:    ['Todas las etapas'],
    },
    {
      file:      'assets/sprites/player/player_walk_left.png',
      key:       'player_walk_left',
      frames:    4,
      frameSize: { w: 32, h: 48 },
      represents: 'Protagonista caminando hacia la izquierda (oeste)',
      function:   'Movimiento hacia el oeste',
      usedIn:    ['Todas las etapas'],
    },
    {
      file:      'assets/sprites/player/player_walk_right.png',
      key:       'player_walk_right',
      frames:    4,
      frameSize: { w: 32, h: 48 },
      represents: 'Protagonista caminando hacia la derecha (este)',
      function:   'Movimiento hacia el este',
      usedIn:    ['Todas las etapas'],
    },
  ]),

  npcs: Object.freeze([
    {
      file:      'assets/sprites/npcs/scientist_idle.png',
      key:       'scientist_idle',
      frames:    2,
      frameSize: { w: 32, h: 48 },
      represents: 'Dr. García — científico que advierte sobre el daño del plástico',
      function:   'NPC estático interactuable con diálogos de advertencia científica',
      usedIn:    ['Stage3_Warning', 'Stage7_Animals'],
    },
    {
      file:      'assets/sprites/npcs/scientist_talk.png',
      key:       'scientist_talk',
      frames:    4,
      frameSize: { w: 32, h: 48 },
      represents: 'Dr. García hablando activamente',
      function:   'Animación durante las secuencias de diálogo del científico',
      usedIn:    ['Stage3_Warning', 'Stage7_Animals'],
    },
    {
      file:      'assets/sprites/npcs/businessman_idle.png',
      key:       'businessman_idle',
      frames:    2,
      frameSize: { w: 32, h: 48 },
      represents: 'CEO Vargas — empresario que ignora las advertencias científicas',
      function:   'NPC que rechaza los datos del científico, simboliza la inacción corporativa',
      usedIn:    ['Stage2_Factory', 'Stage3_Warning', 'Stage5_SocialImpact'],
    },
    {
      file:      'assets/sprites/npcs/businessman_reject.png',
      key:       'businessman_reject',
      frames:    3,
      frameSize: { w: 32, h: 48 },
      represents: 'CEO Vargas rechazando/descartando la advertencia',
      function:   'Animación de rechazo que se reproduce al interactuar con el empresario',
      usedIn:    ['Stage3_Warning'],
    },
    {
      file:      'assets/sprites/npcs/worker_idle.png',
      key:       'worker_idle',
      frames:    2,
      frameSize: { w: 32, h: 48 },
      represents: 'Trabajador de la fábrica en estado precario',
      function:   'Ambiente de precariedad laboral en la fábrica y la ciudad',
      usedIn:    ['Stage2_Factory', 'Stage5_SocialImpact'],
    },
    {
      file:      'assets/sprites/npcs/worker_revolt.png',
      key:       'worker_revolt',
      frames:    6,
      frameSize: { w: 32, h: 48 },
      represents: 'Trabajador en revuelta activa',
      function:   'Muestra el conflicto laboral que escala hacia la guerra',
      usedIn:    ['Stage5_SocialImpact', 'Stage6_War'],
    },
  ]),

  animals: Object.freeze([
    {
      file:      'assets/sprites/animals/bird_healthy.png',
      key:       'bird_healthy',
      frames:    4,
      frameSize: { w: 24, h: 24 },
      represents: 'Pájaro sano en el ecosistema intacto',
      function:   'Representa biodiversidad alta y ecosistema sano en etapa 1',
      usedIn:    ['Stage1_NaturalWorld'],
    },
    {
      file:      'assets/sprites/animals/bird_sick.png',
      key:       'bird_sick',
      frames:    2,
      frameSize: { w: 24, h: 24 },
      represents: 'Pájaro enfermo por contaminación — plumaje deteriorado',
      function:   'Muestra el daño ambiental en la fauna alada',
      usedIn:    ['Stage4_Consequences', 'Stage7_Animals', 'Stage8_FinalWorld'],
    },
    {
      file:      'assets/sprites/animals/fish_healthy.png',
      key:       'fish_healthy',
      frames:    4,
      frameSize: { w: 28, h: 20 },
      represents: 'Pez sano en agua cristalina',
      function:   'Ecosistema acuático saludable, cadena trófica intacta',
      usedIn:    ['Stage1_NaturalWorld'],
    },
    {
      file:      'assets/sprites/animals/fish_sick.png',
      key:       'fish_sick',
      frames:    2,
      frameSize: { w: 28, h: 20 },
      represents: 'Pez con microplásticos visibles, comportamiento errático',
      function:   'Muestra contaminación de ecosistemas acuáticos por microplásticos',
      usedIn:    ['Stage4_Consequences', 'Stage7_Animals', 'Stage8_FinalWorld'],
    },
    {
      file:      'assets/sprites/animals/deer_healthy.png',
      key:       'deer_healthy',
      frames:    4,
      frameSize: { w: 40, h: 48 },
      represents: 'Ciervo sano en hábitat natural',
      function:   'Fauna terrestre en ecosistema intacto, patrulla libre',
      usedIn:    ['Stage1_NaturalWorld'],
    },
    {
      file:      'assets/sprites/animals/deer_stressed.png',
      key:       'deer_stressed',
      frames:    3,
      frameSize: { w: 40, h: 48 },
      represents: 'Ciervo en hábitat fragmentado, estresado y desorientado',
      function:   'Muestra fragmentación de hábitat y disrupción endocrina en fauna',
      usedIn:    ['Stage4_Consequences', 'Stage7_Animals'],
    },
    {
      file:      'assets/sprites/animals/bee_healthy.png',
      key:       'bee_healthy',
      frames:    4,
      frameSize: { w: 16, h: 16 },
      represents: 'Abeja polinizadora sana',
      function:   'Simboliza la cadena trófica y la polinización — clave del ecosistema',
      usedIn:    ['Stage1_NaturalWorld'],
    },
    {
      file:      'assets/sprites/animals/bee_dying.png',
      key:       'bee_dying',
      frames:    3,
      frameSize: { w: 16, h: 16 },
      represents: 'Abeja muriendo por disruptores endocrinos y pesticidas',
      function:   'Representa el colapso de la cadena trófica y la polinización',
      usedIn:    ['Stage4_Consequences', 'Stage7_Animals'],
    },
  ]),

  environment: Object.freeze([
    { file: 'assets/sprites/environment/tree_healthy.png',    key: 'tree_healthy',    represents: 'Árbol con follaje abundante',      usedIn: ['Stage1', 'Stage7'] },
    { file: 'assets/sprites/environment/tree_dead.png',       key: 'tree_dead',       represents: 'Árbol muerto/seco',               usedIn: ['Stage4', 'Stage7', 'Stage8'] },
    { file: 'assets/sprites/environment/water_clean.png',     key: 'water_clean',     represents: 'Agua cristalina',                 usedIn: ['Stage1'] },
    { file: 'assets/sprites/environment/water_polluted.png',  key: 'water_polluted',  represents: 'Agua tóxica contaminada',         usedIn: ['Stage4', 'Stage8'] },
    { file: 'assets/sprites/environment/soil_healthy.png',    key: 'soil_healthy',    represents: 'Suelo fértil y oscuro',           usedIn: ['Stage1'] },
    { file: 'assets/sprites/environment/soil_dead.png',       key: 'soil_dead',       represents: 'Suelo estéril y agrietado',      usedIn: ['Stage4', 'Stage8'] },
  ]),

  factory: Object.freeze([
    { file: 'assets/sprites/factory/factory_exterior.png', key: 'factory_exterior', represents: 'Exterior de la fábrica',          usedIn: ['Stage1 (en horizonte)', 'Stage2'] },
    { file: 'assets/sprites/factory/factory_interior.png', key: 'factory_interior', represents: 'Interior industrial de la fábrica', usedIn: ['Stage2'] },
    { file: 'assets/sprites/factory/oil_pump.png',          key: 'oil_pump',          represents: 'Bomba de extracción de petróleo',   usedIn: ['Stage2'] },
    { file: 'assets/sprites/factory/chemical_tank.png',     key: 'chemical_tank',     represents: 'Tanque de químicos industriales',   usedIn: ['Stage2'] },
    { file: 'assets/sprites/factory/conveyor_belt.png',     key: 'conveyor_belt',     represents: 'Cinta transportadora animada',      usedIn: ['Stage2'] },
    { file: 'assets/sprites/factory/smoke_stack.png',       key: 'smoke_stack',       represents: 'Chimenea emitiendo humo',           usedIn: ['Stage2'] },
  ]),

  ui: Object.freeze([
    { file: 'assets/sprites/ui/hud_bar.png',         key: 'hud_bar',         represents: 'Barra del HUD genérica',               usedIn: ['HUD global'] },
    { file: 'assets/sprites/ui/dialogue_box.png',    key: 'dialogue_box',    represents: 'Fondo de la caja de diálogo',          usedIn: ['DialogueSystem'] },
    { file: 'assets/sprites/ui/arrow_indicator.png', key: 'arrow_indicator', represents: 'Flecha indicadora de interacción',     usedIn: ['HUDManager (interaction hint)'] },
    { file: 'assets/sprites/ui/menu_background.png', key: 'menu_background', represents: 'Imagen de fondo del menú principal',   usedIn: ['MainMenuScene'] },
  ]),
});