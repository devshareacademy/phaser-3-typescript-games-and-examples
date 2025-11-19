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
        from: 0,
        start: 0,
        to: 2.5,
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

class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
  }

  public preload(): void {
    this.load.image('BACKGROUND', 'https://devshareacademy.github.io/cdn/images/asset-packs/ansimuz/starfighter/background.png');
    this.load.spritesheet('SHIP', 'https://devshareacademy.github.io/cdn/images/asset-packs/ansimuz/warped-vehicle/ship.png', {
      frameWidth: 176,
      frameHeight: 96,
    });
  }

  public create(): void {
    const { height, width } = this.scale;
    this.add.image(0, 0, 'BACKGROUND', 0).setOrigin(0);
    this.#createShip();

    // create a basic shape object that uses the Phaser Graphics Game Object, this will be used for the mask
    const shape = this.add.circle(width / 2, height / 2, height / 2).setVisible(false);
    // for the geometry mask, you can also create your own game object by using the Phaser.GameObjects.Graphics class
    const mask = shape.createGeometryMask();
    // update the camera to use the mask
    this.cameras.main.setMask(mask);

    addScaleUpEffectOnSceneStart(this, shape)
      .then(() => {
        console.log('scene transition done');
        // when the transition is done, start your game logic, cleanup mask objects, etc
      })
      .catch(() => undefined);
  }

  #createShip(): void {
    this.anims.create({
      key: 'SHIP_IDLE',
      frames: this.anims.generateFrameNumbers('SHIP'),
      frameRate: 6,
      repeat: -1,
    });
    const { height, width } = this.scale;
    const ship = this.add.sprite(0, height / 2, 'SHIP', 0);
    ship.play('SHIP_IDLE');

    this.tweens.add({
      targets: ship,
      x: width + 100,
      duration: 6000,
      onComplete: () => {
        this.scene.restart();
      },
    });
  }
}

window.onload = () => {
  const gameConfig: Phaser.Types.Core.GameConfig = {
    type: Phaser.CANVAS,
    pixelArt: true,
    scale: {
      zoom: 3,
      parent: 'game-container',
      width: 420,
      height: 240,
    },
    backgroundColor: '#000000',
    scene: MainScene,
  };

  new Phaser.Game(gameConfig);
};
