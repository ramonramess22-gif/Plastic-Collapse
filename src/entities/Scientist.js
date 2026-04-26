/**
 * @file Scientist.js
 * @description NPC del científico que advierte sobre el daño del plástico.
 * Etapa 3 y 7. Tiene diálogos extendidos y cambia de tint según la etapa.
 */

import NPC    from './NPC.js';
import { DEPTHS } from '../utils/Constants.js';

export class Scientist extends NPC {
  constructor(scene, config) {
    super(scene, {
      textureKey:   'scientist_idle',
      idleAnim:     'scientist_idle_anim',
      talkAnim:     'scientist_talk_anim',
      speakerName:  config.speakerName ?? 'Dr. García',
      depth:        DEPTHS.NPC_ABOVE,
      ...config,
    });

    // Ligero tint azulado — identidad visual del científico
    this.sprite.setTint(0xccddff);
  }
}