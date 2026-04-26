/**
 * @file Businessman.js
 * @description NPC del empresario que ignora las advertencias.
 * Etapas 2, 3 y 5.
 */

import NPC    from './NPC.js';
import { DEPTHS } from '../utils/Constants.js';

export class Businessman extends NPC {
  constructor(scene, config) {
    super(scene, {
      textureKey:   'businessman_idle',
      idleAnim:     'businessman_idle_anim',
      speakerName:  config.speakerName ?? 'CEO Vargas',
      depth:        DEPTHS.NPC_BELOW,
      ...config,
    });

    // Tint gris-verde — dinero, frialdad
    this.sprite.setTint(0xbbddbb);
  }

  /**
   * Al interactuar, el empresario reproduce la animación de rechazo
   * y luego vuelve a idle — no cambia a talk.
   */
  interact() {
    if (this.scene.anims.exists('businessman_reject_anim')) {
      this.sprite.play('businessman_reject_anim');
      this.sprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
        if (this.scene.anims.exists(this._idleAnim)) {
          this.sprite.play(this._idleAnim);
        }
      });
    }

    super.interact();
  }
}