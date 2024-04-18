import { IMAGE_ASSET_KEYS, SPRITE_SHEET_ASSET_KEYS } from '../assets/asset-keys';
import GameScene from '../scenes/game-scene';

type SpeakerConfig = {
  scene: GameScene;
  x: number;
  y: number;
  flipX: boolean;
  startingEnergy: number;
  id: number;
};

export class Speaker {
  #scene: GameScene;
  #sprite: Phaser.GameObjects.Sprite;
  #energyLevel: number;
  #maxEnergy: number;
  #id: number;
  #speakerRange: Phaser.GameObjects.Image;
  #speakerRangeTween: Phaser.Tweens.Tween | undefined;
  #inTutorial: boolean;

  constructor(config: SpeakerConfig) {
    this.#inTutorial = false;
    this.#id = config.id;
    this.#scene = config.scene;
    this.#maxEnergy = 3;
    this.#energyLevel = config.startingEnergy;
    this.#sprite = config.scene.add
      .sprite(config.x, config.y, SPRITE_SHEET_ASSET_KEYS.SPEAKER, 0)
      .setFlipX(config.flipX)
      .setOrigin(0, 1)
      .setInteractive();
    this.#setTexture();

    const center = this.#sprite.getCenter();
    this.#speakerRange = this.#scene.add.image(center.x, center.y, IMAGE_ASSET_KEYS.DASH_CIRCLE).setAlpha(0);
    this.#scene.physics.world.once(Phaser.Physics.Arcade.Events.WORLD_STEP, () => {
      this.#scene.physics.world.enable(this.#speakerRange);
      const body = this.#speakerRange.body as Phaser.Physics.Arcade.Body;
      body.setCircle(body.halfWidth, 0, body.halfHeight - body.halfWidth).setAllowGravity(false);
      this.#speakerRange.setScale(0.01);
      this.#displaySpeakerRange(false);
    });

    this.#sprite.on(Phaser.Input.Events.POINTER_DOWN, () => {
      this.handlePlayerClick();
    });
  }

  get sprite(): Phaser.GameObjects.Sprite {
    return this.#sprite;
  }

  get speakerRange(): Phaser.GameObjects.Image {
    return this.#speakerRange;
  }

  get currentEnergy(): number {
    return this.#energyLevel;
  }

  set inTutorial(val: boolean) {
    this.#inTutorial = val;
  }

  public update(): void {
    if (this.#speakerRange.alpha === 0) {
      return;
    }
    this.#speakerRange.angle += 0.5;
  }

  public handlePlayerClick(): void {
    if (this.#inTutorial) {
      return;
    }
    if (this.#scene.currentEnergy === 0 && this.#energyLevel === 0) {
      return;
    }
    // if we are below max energy, and there is available energy, bump usage here
    if (this.#energyLevel < this.#maxEnergy && this.#scene.currentEnergy > 0) {
      this.#energyLevel += 1;
      this.#scene.updateEnergy(-1);
    } else {
      // if we are below or at max, then take energy from here and move to global store
      this.#scene.updateEnergy(this.#energyLevel);
      this.#energyLevel = 0;
    }

    this.#setTexture();
    this.#displaySpeakerRange(true);
  }

  #setTexture(): void {
    this.#sprite.setAlpha(1);
    return;
    if (this.#energyLevel === 0) {
      this.#sprite.setAlpha(0.25);
      return;
    }
    if (this.#energyLevel === 1) {
      this.#sprite.setAlpha(0.5);
      return;
    }
    if (this.#energyLevel === 2) {
      this.#sprite.setAlpha(0.75);
      return;
    }
    this.#sprite.setAlpha(1);
  }

  #displaySpeakerRange(show: boolean): void {
    if (this.#energyLevel === 0) {
      this.#speakerRange.setScale(0.01);
      return;
    }
    if (this.#energyLevel === 1) {
      this.#speakerRange.setScale(0.4);
    } else if (this.#energyLevel === 2) {
      this.#speakerRange.setScale(0.75);
    } else {
      this.#speakerRange.setScale(1.2);
    }
    if (!show) {
      return;
    }

    this.#speakerRange.setAlpha(0.5);
    if (this.#speakerRangeTween !== undefined && !this.#speakerRangeTween.isDestroyed()) {
      this.#speakerRangeTween.destroy();
    }
    this.#speakerRangeTween = this.#scene.tweens.add({
      targets: this.#speakerRange,
      alpha: 0,
      duration: 500,
      delay: 750,
    });
  }
}
