/**
 * PLASTIC COLLAPSE - TWEEN HELPER
 * Utilidades para animaciones y transiciones
 */

class TweenHelper {
    /**
     * Animación de fade out
     * @param {Phaser.Scene} scene - Escena actual
     * @param {Phaser.GameObjects.Sprite} sprite - Objeto a animar
     * @param {number} duration - Duración en ms (default: 500)
     * @returns {Phaser.Tweens.Tween}
     */
    static fadeOut(scene, sprite, duration = 500) {
        return scene.tweens.add({
            targets: sprite,
            alpha: 0,
            duration: duration,
            ease: 'Linear'
        });
    }
    
    /**
     * Animación de fade in
     * @param {Phaser.Scene} scene - Escena actual
     * @param {Phaser.GameObjects.Sprite} sprite - Objeto a animar
     * @param {number} duration - Duración en ms (default: 500)
     * @returns {Phaser.Tweens.Tween}
     */
    static fadeIn(scene, sprite, duration = 500) {
        sprite.setAlpha(0);
        return scene.tweens.add({
            targets: sprite,
            alpha: 1,
            duration: duration,
            ease: 'Linear'
        });
    }
    
    /**
     * Animación de movimiento suave
     * @param {Phaser.Scene} scene - Escena actual
     * @param {Phaser.GameObjects.Sprite} sprite - Objeto a animar
     * @param {Object} config - Configuración {x, y, duration, ease}
     * @returns {Phaser.Tweens.Tween}
     */
    static moveTo(scene, sprite, config) {
        return scene.tweens.add({
            targets: sprite,
            x: config.x,
            y: config.y,
            duration: config.duration || 500,
            ease: config.ease || 'Linear'
        });
    }
    
    /**
     * Parpadeo rápido
     * @param {Phaser.Scene} scene - Escena actual
     * @param {Phaser.GameObjects.Sprite} sprite - Objeto a animar
     * @param {number} duration - Duración total en ms
     * @returns {Phaser.Tweens.Tween}
     */
    static blink(scene, sprite, duration = 500) {
        return scene.tweens.add({
            targets: sprite,
            alpha: { from: 1, to: 0 },
            duration: duration / 4,
            repeat: 3,
            ease: 'Linear'
        });
    }
    
    /**
     * Escala de entrada
     * @param {Phaser.Scene} scene - Escena actual
     * @param {Phaser.GameObjects.Sprite} sprite - Objeto a animar
     * @param {number} duration - Duración en ms
     * @returns {Phaser.Tweens.Tween}
     */
    static scaleIn(scene, sprite, duration = 300) {
        sprite.setScale(0);
        return scene.tweens.add({
            targets: sprite,
            scaleX: 1,
            scaleY: 1,
            duration: duration,
            ease: 'Back.out'
        });
    }
    
    /**
     * Efecto de "pop" (escala + fade out)
     * @param {Phaser.Scene} scene - Escena actual
     * @param {Phaser.GameObjects.Sprite} sprite - Objeto a animar
     * @param {number} duration - Duración en ms
     * @returns {Phaser.Tweens.Tween}
     */
    static pop(scene, sprite, duration = 300) {
        return scene.tweens.add({
            targets: sprite,
            scaleX: 1.3,
            scaleY: 1.3,
            alpha: 0,
            duration: duration,
            ease: 'Cubic.out',
            onComplete: () => {
                sprite.destroy();
            }
        });
    }
    
    /**
     * Pulsación (scale loop)
     * @param {Phaser.Scene} scene - Escena actual
     * @param {Phaser.GameObjects.Sprite} sprite - Objeto a animar
     * @param {number} minScale - Escala mínima
     * @param {number} maxScale - Escala máxima
     * @returns {Phaser.Tweens.Tween}
     */
    static pulse(scene, sprite, minScale = 0.9, maxScale = 1.1) {
        return scene.tweens.add({
            targets: sprite,
            scaleX: { from: minScale, to: maxScale },
            scaleY: { from: minScale, to: maxScale },
            duration: 500,
            ease: 'Sine.inout',
            repeat: -1,
            yoyo: true
        });
    }
    
    /**
     * Transición de color
     * @param {Phaser.Scene} scene - Escena actual
     * @param {Phaser.GameObjects.Sprite} sprite - Objeto a animar
     * @param {number} fromColor - Color inicial (hex)
     * @param {number} toColor - Color final (hex)
     * @param {number} duration - Duración en ms
     * @returns {Phaser.Tweens.Tween}
     */
    static colorTransition(scene, sprite, fromColor, toColor, duration = 500) {
        return scene.tweens.add({
            targets: sprite,
            tint: toColor,
            duration: duration,
            ease: 'Linear'
        });
    }
}