/**
 * @file AnimalNPC.js
 * @description NPC animal que explica el impacto de la contaminación.
 * Etapas 1, 4 y 7. Cambia de textura según la salud del ecosistema.
 */

import NPC from './NPC.js';
import { DEPTHS } from '../utils/Constants.js';

export class AnimalNPC extends NPC {
  constructor(scene, config) {
    super(scene, {
      depth: DEPTHS.NPC_BELOW,
      ...config,
    });

    // Movimiento de patrulla simple (sólo en animales sanos de etapa 1)
    this._patrolling  = config.patrol ?? false;
    this._patrolSpeed = 30;
    this._patrolDir   = 1;
    this._patrolRange = config.patrolRange ?? 60;
    this._patrolOriginX = config.x;
  }

  /**
   * Actualizar patrulla simple si está activa.
   * Llamar desde la escena en update().
   */
  update() {
    if (!this._patrolling) return;

    const dx = this.sprite.x - this._patrolOriginX;
    if (dx > this._patrolRange)  this._patrolDir = -1;
    if (dx < -this._patrolRange) this._patrolDir =  1;

    this.sprite.x += this._patrolDir * this._patrolSpeed * (1 / 60);
    this.sprite.refreshBody(); // Actualizar hitbox estática
  }
}