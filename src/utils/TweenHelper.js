/**
 * @file utils/TweenHelper.js
 * @description Funciones de animación reutilizables para las escenas del juego.
 *
 * Centraliza tweens comunes para evitar repetición de código en las escenas:
 *   - Fade in/out de objetos Phaser
 *   - Pulso (scale ping-pong)
 *   - Flotación vertical (idle animation)
 *   - Shake (vibración de cámara o sprite)
 *   - Entrada desde fuera de pantalla
 *   - Texto que aparece letra por letra (sin setInterval)
 *   - Secuencia de tweens en cadena
 *
 * SEGURIDAD: Sin eval(), sin new Function(). Compatible con CSP strict.
 * Todas las funciones reciben callbacks como funciones — nunca strings.
 *
 * USO:
 *   import { fadeIn, pulse, floatUpDown } from '../utils/TweenHelper.js';
 *   fadeIn(scene, sprite, { duration: 500, onComplete: () => {} });
 */

// ─── FADE ─────────────────────────────────────────────────────────────────────

/**
 * Fade in: objeto aparece progresivamente.
 *
 * @param {Phaser.Scene}        scene
 * @param {Phaser.GameObjects.GameObject|GameObject[]} target
 * @param {Object}  [opts]
 * @param {number}  [opts.duration=400]
 * @param {number}  [opts.delay=0]
 * @param {number}  [opts.from=0]     - Alpha inicial
 * @param {number}  [opts.to=1]       - Alpha final
 * @param {string}  [opts.ease='Power2']
 * @param {Function}[opts.onComplete]
 * @returns {Phaser.Tweens.Tween}
 */
export function fadeIn(scene, target, opts = {}) {
  const targets = Array.isArray(target) ? target : [target];

  // Establecer alpha inicial
  for (const t of targets) {
    if (typeof t.setAlpha === 'function') t.setAlpha(opts.from ?? 0);
  }

  return scene.tweens.add({
    targets,
    alpha:      opts.to ?? 1,
    duration:   opts.duration ?? 400,
    delay:      opts.delay    ?? 0,
    ease:       opts.ease     ?? 'Power2',
    onComplete: typeof opts.onComplete === 'function' ? opts.onComplete : undefined,
  });
}

/**
 * Fade out: objeto desaparece progresivamente.
 *
 * @param {Phaser.Scene} scene
 * @param {*}            target
 * @param {Object}       [opts]
 * @param {number}       [opts.duration=400]
 * @param {number}       [opts.delay=0]
 * @param {Function}     [opts.onComplete]
 * @returns {Phaser.Tweens.Tween}
 */
export function fadeOut(scene, target, opts = {}) {
  return scene.tweens.add({
    targets:    Array.isArray(target) ? target : [target],
    alpha:      0,
    duration:   opts.duration ?? 400,
    delay:      opts.delay    ?? 0,
    ease:       opts.ease     ?? 'Power2',
    onComplete: typeof opts.onComplete === 'function' ? opts.onComplete : undefined,
  });
}

// ─── PULSO ────────────────────────────────────────────────────────────────────

/**
 * Pulso de escala (scale ping-pong): útil para botones y NPCs importantes.
 *
 * @param {Phaser.Scene} scene
 * @param {*}            target
 * @param {Object}       [opts]
 * @param {number}       [opts.scaleX=1.08]
 * @param {number}       [opts.scaleY=1.08]
 * @param {number}       [opts.duration=600]
 * @param {number}       [opts.repeat=-1]   - -1 = infinito
 * @returns {Phaser.Tweens.Tween}
 */
export function pulse(scene, target, opts = {}) {
  return scene.tweens.add({
    targets:  Array.isArray(target) ? target : [target],
    scaleX:   opts.scaleX   ?? 1.08,
    scaleY:   opts.scaleY   ?? 1.08,
    duration: opts.duration ?? 600,
    ease:     'Sine.InOut',
    yoyo:     true,
    repeat:   opts.repeat   ?? -1,
  });
}

// ─── FLOTACIÓN ────────────────────────────────────────────────────────────────

/**
 * Flotación vertical suave (idle loop): para NPCs y objetos UI.
 *
 * @param {Phaser.Scene} scene
 * @param {*}            target
 * @param {Object}       [opts]
 * @param {number}       [opts.amount=6]    - Píxeles de desplazamiento
 * @param {number}       [opts.duration=1800]
 * @returns {Phaser.Tweens.Tween}
 */
export function floatUpDown(scene, target, opts = {}) {
  const amount = opts.amount ?? 6;
  const base   = target.y;

  return scene.tweens.add({
    targets:  Array.isArray(target) ? target : [target],
    y:        base - amount,
    duration: opts.duration ?? 1800,
    ease:     'Sine.InOut',
    yoyo:     true,
    repeat:   -1,
  });
}

// ─── ENTRADA ──────────────────────────────────────────────────────────────────

/**
 * Entra en pantalla desde abajo con fade in simultáneo.
 * Útil para escenas de crisis (texto aparece desde abajo).
 *
 * @param {Phaser.Scene} scene
 * @param {*}            target
 * @param {Object}       [opts]
 * @param {number}       [opts.fromY]       - Y inicial (por defecto: target.y + 40)
 * @param {number}       [opts.toY]         - Y final (por defecto: target.y)
 * @param {number}       [opts.duration=600]
 * @param {number}       [opts.delay=0]
 * @param {Function}     [opts.onComplete]
 * @returns {Phaser.Tweens.Tween}
 */
export function slideInFromBelow(scene, target, opts = {}) {
  const toY   = opts.toY   ?? target.y;
  const fromY = opts.fromY ?? (toY + 40);

  if (typeof target.setY  === 'function') target.setY(fromY);
  if (typeof target.setAlpha === 'function') target.setAlpha(0);

  return scene.tweens.add({
    targets:  Array.isArray(target) ? target : [target],
    y:        toY,
    alpha:    1,
    duration: opts.duration ?? 600,
    delay:    opts.delay    ?? 0,
    ease:     'Back.Out',
    onComplete: typeof opts.onComplete === 'function' ? opts.onComplete : undefined,
  });
}

// ─── SHAKE ────────────────────────────────────────────────────────────────────

/**
 * Shake de cámara (envuelve camera.shake de Phaser con parámetros seguros).
 *
 * @param {Phaser.Scene} scene
 * @param {Object}       [opts]
 * @param {number}       [opts.duration=250]
 * @param {number}       [opts.intensity=0.004]
 * @param {Function}     [opts.onComplete]
 */
export function shakeCamera(scene, opts = {}) {
  scene.cameras.main.shake(
    opts.duration  ?? 250,
    opts.intensity ?? 0.004,
    false,
    typeof opts.onComplete === 'function' ? opts.onComplete : undefined
  );
}

// ─── PARPADEO ─────────────────────────────────────────────────────────────────

/**
 * Parpadeo de un objeto (útil para indicar peligro crítico).
 *
 * @param {Phaser.Scene} scene
 * @param {*}            target
 * @param {Object}       [opts]
 * @param {number}       [opts.times=4]     - Número de parpadeos
 * @param {number}       [opts.duration=120]- Duración de cada parpadeo
 * @param {Function}     [opts.onComplete]
 * @returns {Phaser.Tweens.Tween}
 */
export function blink(scene, target, opts = {}) {
  return scene.tweens.add({
    targets:  Array.isArray(target) ? target : [target],
    alpha:    0,
    duration: opts.duration ?? 120,
    ease:     'Linear',
    yoyo:     true,
    repeat:   (opts.times ?? 4) - 1,
    onComplete: typeof opts.onComplete === 'function' ? opts.onComplete : undefined,
  });
}

// ─── SECUENCIA EN CADENA ──────────────────────────────────────────────────────

/**
 * Ejecuta una secuencia de tweens uno tras otro.
 * Útil para animaciones narrativas complejas.
 *
 * SEGURIDAD: Los callbacks son funciones definidas — nunca strings.
 *
 * @param {Phaser.Scene}        scene
 * @param {Array<Object>}       steps  - Array de configuraciones de tween
 * @param {Function}            [onAllComplete]
 *
 * @example
 *   tweenSequence(scene, [
 *     { targets: logo, alpha: 1, duration: 500 },
 *     { targets: logo, y: 200,   duration: 800, ease: 'Back.Out' },
 *   ], () => console.log('secuencia completa'));
 */
export function tweenSequence(scene, steps, onAllComplete) {
  if (!Array.isArray(steps) || steps.length === 0) {
    if (typeof onAllComplete === 'function') onAllComplete();
    return;
  }

  let index = 0;

  function runNext() {
    if (index >= steps.length) {
      if (typeof onAllComplete === 'function') onAllComplete();
      return;
    }

    const step = steps[index];
    index++;

    const stepConfig = {
      ...step,
      onComplete: runNext,  // Siempre avanzar al siguiente
    };

    scene.tweens.add(stepConfig);
  }

  runNext();
}

// ─── TINT FLASH ───────────────────────────────────────────────────────────────

/**
 * Flash de color en un sprite (útil para recibir daño o evento importante).
 * Cambia el tint y luego lo restaura.
 *
 * @param {Phaser.Scene}            scene
 * @param {Phaser.GameObjects.Sprite} sprite
 * @param {number}  [flashColor=0xffffff]
 * @param {number}  [duration=200]
 * @param {Function}[onComplete]
 */
export function tintFlash(scene, sprite, flashColor, duration, onComplete) {
  const originalTint = sprite.tintTopLeft; // Guardar tint original

  sprite.setTint(flashColor ?? 0xffffff);

  // SEGURIDAD: setTimeout con función flecha — nunca string
  setTimeout(() => {
    if (sprite && sprite.active) {
      // Restaurar tint original
      if (originalTint === 0xffffff) {
        sprite.clearTint();
      } else {
        sprite.setTint(originalTint);
      }
    }
    if (typeof onComplete === 'function') onComplete();
  }, duration ?? 200);
}