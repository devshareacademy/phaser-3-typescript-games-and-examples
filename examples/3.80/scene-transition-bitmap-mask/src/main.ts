import Phaser from 'phaser';

/**
 * Creates a simple scaling effect animation on the provided game object. The animation is done by using
 * the built in Phaser 3 Tweens.
 */
function addScaleUpEffectOnSceneStart(scene: Phaser.Scene, gameObject: Phaser.GameObjects.GameObject): Promise<void> {
  return new Promise((resolve) => {
    scene.events.on(Phaser.Scenes.Events.CREATE, () => {
      const propertyConfig = {
        ease: Phaser.Math.Easing.Expo.InOut,
        from: 0.5,
        start: 0.5,
        to: 3,
      };

      scene.tweens.add({
        duration: 3500,
        scaleX: propertyConfig,
        scaleY: propertyConfig,
        targets: gameObject,
        onComplete: () => {
          resolve();
        },
      });
    });
  });
}

/**
 * Creates a simple fade in effect animation on the provided game object. The animation is done by using
 * the built in Phaser 3 Tweens.
 */
function addFadeInEffectOnSceneStart(scene: Phaser.Scene, gameObject: Phaser.GameObjects.GameObject): Promise<void> {
  return new Promise((resolve) => {
    scene.events.on(Phaser.Scenes.Events.CREATE, () => {
      const propertyConfig = {
        ease: Phaser.Math.Easing.Expo.InOut,
        from: 1,
        start: 1,
        to: 0,
      };

      scene.tweens.add({
        duration: 3400,
        alpha: propertyConfig,
        targets: gameObject,
        onComplete: () => {
          resolve();
        },
      });
    });
  });
}

class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
  }

  public preload(): void {
    this.load.image('BACKGROUND', 'assets/images/ansimuz/starfighter/background.png');
    this.load.spritesheet('SHIP', 'assets/images/ansimuz/warped-vehicle/ship.png', {
      frameWidth: 176,
      frameHeight: 96,
    });
  }

  public create(): void {
    this.add.image(0, 0, 'BACKGROUND', 0).setOrigin(0);
    // overlay image to allow us to create a transparent background while we do the scene transition
    const overlay = this.#createOverlayImage();
    const mask = this.#createMask();
    // update the overlay to use the new mask so we only show part of the underlying image
    overlay.setMask(mask);
    Promise.all([
      addScaleUpEffectOnSceneStart(this, mask.bitmapMask as Phaser.GameObjects.GameObject),
      addFadeInEffectOnSceneStart(this, overlay),
    ])
      .then(() => {
        console.log('scene transition done');
        this.time.delayedCall(500, () => this.scene.restart());
      })
      .catch(() => undefined);
  }

  #createOverlayImage(): Phaser.GameObjects.Graphics {
    const { height, width } = this.scale;
    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 1).fillRect(0, 0, width, height);
    return overlay;
  }

  #createMask(): Phaser.Display.Masks.BitmapMask {
    this.anims.create({
      key: 'SHIP_IDLE',
      frames: this.anims.generateFrameNumbers('SHIP'),
      frameRate: 6,
      repeat: -1,
    });
    const { height, width } = this.scale;
    const maskImage = this.add
      .sprite(width / 2, height / 2, 'SHIP', 0)
      .setScale(2)
      .setVisible(false);
    maskImage.play('SHIP_IDLE');
    const mask = new Phaser.Display.Masks.BitmapMask(this, maskImage);
    // This makes the mask show what should normally hide and hide what should normally show.
    mask.invertAlpha = true;
    return mask;
  }
}

window.onload = () => {
  const gameConfig: Phaser.Types.Core.GameConfig = {
    type: Phaser.WEBGL, // to use bitmap images, you need to use the WEBGL game type, otherwise nothing will show on the screen
    pixelArt: true,
    scale: {
      zoom: 3,
      parent: 'game-container',
      width: 420,
      height: 240,
    },
    backgroundColor: '#5c5b5b',
    scene: MainScene,
  };

  new Phaser.Game(gameConfig);
};
