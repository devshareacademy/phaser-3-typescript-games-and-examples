import { ATLAS_ASSET_KEYS } from '../assets/asset-keys';

export function shake(scene: Phaser.Scene, target: { x: number; y: number }): Phaser.Tweens.Tween {
  const shakeTween = scene.tweens.add({
    targets: target,
    x: target.x + 5,
    y: target.y - 5,
    duration: 50,
    yoyo: true,
    repeat: 8,
    ease: Phaser.Math.Easing.Bounce.InOut,
    delay: 0,
    paused: false,
  });
  return shakeTween;
}

export function fadeOut(scene: Phaser.Scene, target: Phaser.GameObjects.Sprite): Phaser.Tweens.Tween {
  const fadeOutTween = scene.tweens.add({
    targets: target,
    alpha: 0,
    duration: 750,
    ease: Phaser.Math.Easing.Circular.Out,
    delay: 0,
    paused: false,
  });
  return fadeOutTween;
}

export function flash(scene: Phaser.Scene, target: Phaser.GameObjects.Sprite): void {
  scene.time.addEvent({
    delay: 450,
    callback: () => {
      target.setTintFill(0xffffff);
      target.setAlpha(0.7);

      scene.time.addEvent({
        delay: 300,
        callback: () => {
          target.setTint(0xffffff);
          target.setAlpha(1);
        },
      });
    },
    startAt: 300,
    repeat: 1,
  });
}

export function explode(scene: Phaser.Scene, target: { x: number; y: number }, callback: () => void = () => {}): void {
  let counter = 0;
  const emitter = scene.add
    .particles(target.x, target.y, ATLAS_ASSET_KEYS.FLARES, {
      frame: ['red'],
      lifespan: 500,
      speed: { min: 100, max: 250 },
      scale: { start: 0.4, end: 0 },
      gravityY: 200,
      blendMode: 'ADD',
      emitting: false,
      deathCallback: () => {
        counter += 1;
        if (counter === 16) {
          callback();
        }
      },
    })
    .setAlpha(0.5);
  emitter.explode(16);
}
