/**
 * @file Player.js
 * @description Clase del jugador. Movimiento top-down en 4 direcciones,
 *              detección de NPCs cercanos e interacción.
 *
 * SEGURIDAD:
 *   - Sin eval(), sin new Function(), sin setTimeout con strings.
 *   - Inputs leídos de Phaser.Input.Keyboard (API estándar del motor).
 *   - Compatible con CSP strict.
 *
 * USO:
 *   // En una escena Phaser:
 *   this.player = new Player(this, 400, 300);
 *   // En update():
 *   this.player.update();
 */

import EventBus       from '../systems/EventBus.js';
import DialogueSystem from '../systems/DialogueSystem.js';
import { EVENTS, KEYS, GAME, DEPTHS } from '../utils/Constants.js';

export default class Player {

  /**
   * @param {Phaser.Scene} scene - Escena Phaser que contiene al jugador
   * @param {number}       x     - Posición X inicial (px)
   * @param {number}       y     - Posición Y inicial (px)
   */
  constructor(scene, x, y) {
    this.scene = scene;

    // ── Sprite del jugador ────────────────────────────────────────────────────
    this.sprite = scene.physics.add.sprite(x, y, 'player_idle');
    this.sprite.setDepth(DEPTHS.PLAYER);
    this.sprite.setCollideWorldBounds(true);

    // Hitbox reducida para mejor navegación en tiles
    this.sprite.body.setSize(18, 20);
    this.sprite.body.setOffset(7, 26);

    // ── Teclado ───────────────────────────────────────────────────────────────
    this._keys = scene.input.keyboard.addKeys({
      up:       KEYS.UP,
      down:     KEYS.DOWN,
      left:     KEYS.LEFT,
      right:    KEYS.RIGHT,
      w:        KEYS.W,
      a:        KEYS.A,
      s:        KEYS.S,
      d:        KEYS.D,
      interact: KEYS.INTERACT,
      space:    KEYS.SPACE,
    });

    // ── Estado interno ────────────────────────────────────────────────────────
    this._canMove    = true;    // false durante diálogos
    this._direction  = 'down';  // 'up' | 'down' | 'left' | 'right'
    this._nearNPC    = null;    // NPC más cercano en rango de interacción

    // ── Tecla de interacción (just-pressed) ───────────────────────────────────
    this._interactKey = scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.E
    );
    this._spaceKey = scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    // Escuchar eventos de diálogo para bloquear/desbloquear movimiento
    EventBus.on(EVENTS.DIALOGUE_START, this._onDialogueStart, this);
    EventBus.on(EVENTS.DIALOGUE_END,   this._onDialogueEnd,   this);

    // Animación inicial
    this.sprite.play('player_idle_anim');
  }

  // ─── HANDLERS DE EVENTOS ─────────────────────────────────────────────────────

  _onDialogueStart() {
    this._canMove = false;
    this.sprite.body.setVelocity(0, 0);
    this.sprite.play('player_idle_anim');
  }

  _onDialogueEnd() {
    this._canMove = true;
  }

  // ─── UPDATE ──────────────────────────────────────────────────────────────────

  /**
   * Llamar cada frame desde la escena: this.player.update()
   */
  update() {
    this._handleMovement();
    this._handleInteraction();
  }

  // ─── MOVIMIENTO ──────────────────────────────────────────────────────────────

  _handleMovement() {
    if (!this._canMove) return;

    const keys  = this._keys;
    const body  = this.sprite.body;
    const speed = GAME.PLAYER_SPEED;

    const goUp    = keys.up.isDown    || keys.w.isDown;
    const goDown  = keys.down.isDown  || keys.s.isDown;
    const goLeft  = keys.left.isDown  || keys.a.isDown;
    const goRight = keys.right.isDown || keys.d.isDown;

    // Resetear velocidad
    body.setVelocity(0, 0);

    // Aplicar velocidad según dirección presionada
    if (goLeft)  { body.setVelocityX(-speed); this._direction = 'left';  }
    if (goRight) { body.setVelocityX(+speed); this._direction = 'right'; }
    if (goUp)    { body.setVelocityY(-speed); this._direction = 'up';    }
    if (goDown)  { body.setVelocityY(+speed); this._direction = 'down';  }

    // Normalizar velocidad diagonal para que no sea más rápida
    if ((goLeft || goRight) && (goUp || goDown)) {
      body.velocity.normalize().scale(speed);
    }

    // Actualizar animación
    this._updateAnimation(goUp, goDown, goLeft, goRight);
  }

  /**
   * Selecciona la animación correcta según la dirección y movimiento.
   * Usa un switch estático — sin eval ni acceso por string dinámico.
   */
  _updateAnimation(goUp, goDown, goLeft, goRight) {
    const isMoving = goUp || goDown || goLeft || goRight;

    if (!isMoving) {
      if (this.sprite.anims.currentAnim?.key !== 'player_idle_anim') {
        this.sprite.play('player_idle_anim');
      }
      return;
    }

    let animKey;
    switch (this._direction) {
      case 'up':    animKey = 'player_walk_up_anim';    break;
      case 'down':  animKey = 'player_walk_down_anim';  break;
      case 'left':  animKey = 'player_walk_left_anim';  break;
      case 'right': animKey = 'player_walk_right_anim'; break;
      default:      animKey = 'player_idle_anim';
    }

    if (this.sprite.anims.currentAnim?.key !== animKey) {
      this.sprite.play(animKey);
    }
  }

  // ─── INTERACCIÓN ─────────────────────────────────────────────────────────────

  _handleInteraction() {
    // Avanzar diálogo con SPACE
    if (Phaser.Input.Keyboard.JustDown(this._spaceKey)) {
      if (DialogueSystem.isActive()) {
        DialogueSystem.advance();
        return;
      }
    }

    // Interactuar con NPC cercano con E
    if (Phaser.Input.Keyboard.JustDown(this._interactKey)) {
      if (DialogueSystem.isActive()) {
        DialogueSystem.advance();
      } else if (this._nearNPC) {
        this._nearNPC.interact();
      }
    }
  }

  /**
   * Registra el NPC más cercano en rango (llamado por las escenas).
   * @param {NPC|null} npc
   */
  setNearbyNPC(npc) {
    this._nearNPC = npc;
    if (npc) {
      EventBus.emit(EVENTS.INTERACTION_SHOW, {
        x: npc.sprite.x,
        y: npc.sprite.y,
      });
    } else {
      EventBus.emit(EVENTS.INTERACTION_HIDE);
    }
  }

  // ─── GETTERS ─────────────────────────────────────────────────────────────────

  get x()         { return this.sprite.x; }
  get y()         { return this.sprite.y; }
  get canMove()   { return this._canMove; }
  get direction() { return this._direction; }

  /**
   * Teletransporta al jugador a una posición (al cambiar de mapa).
   * @param {number} x
   * @param {number} y
   */
  setPosition(x, y) {
    this.sprite.setPosition(x, y);
  }

  // ─── LIMPIEZA ─────────────────────────────────────────────────────────────────

  /**
   * Destruir el jugador y limpiar listeners del EventBus.
   * Llamar en Scene.shutdown() o Scene.destroy().
   */
  destroy() {
    EventBus.off(EVENTS.DIALOGUE_START, this._onDialogueStart, this);
    EventBus.off(EVENTS.DIALOGUE_END,   this._onDialogueEnd,   this);
    this.sprite.destroy();
  }
}