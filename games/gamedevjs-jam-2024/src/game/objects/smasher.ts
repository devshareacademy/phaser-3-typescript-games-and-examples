import { SPRITE_SHEET_ASSET_KEYS } from '../assets/asset-keys';
import { TILE_SIZE } from '../config';
import GameScene from '../scenes/game-scene';
import { ANIMATION_KEY } from '../schema/data-schema';
import { sleep } from '../utils/sleep';

type SmasherConfig = {
  scene: GameScene;
  x: number;
  y: number;
  id: number;
  delayFromSceneStart: number;
  delayBetweenAttacks: number;
};

export class Smasher {
  #scene: GameScene;
  #id: number;
  #baseSprite!: Phaser.GameObjects.Sprite;
  #mainSprite!: Phaser.GameObjects.Sprite;
  #delayBetweenAttacks: number;

  constructor(config: SmasherConfig) {
    this.#delayBetweenAttacks = config.delayBetweenAttacks;
    this.#scene = config.scene;
    this.#id = config.id;
    this.#baseSprite = this.#scene.add.sprite(config.x, config.y, SPRITE_SHEET_ASSET_KEYS.HAMMER, 2).setOrigin(0, 0.5);
    this.#baseSprite.setCrop(0, 0, TILE_SIZE, TILE_SIZE);
    this.#mainSprite = this.#scene.add.sprite(config.x, config.y, SPRITE_SHEET_ASSET_KEYS.HAMMER, 0).setOrigin(0, 0.5);
    this.#scene.physics.world.once(Phaser.Physics.Arcade.Events.WORLD_STEP, () => {
      this.#scene.physics.world.enable(this.#mainSprite);
      (this.#mainSprite.body as Phaser.Physics.Arcade.Body)
        .setOffset(0, TILE_SIZE * -1)
        .setImmovable(true)
        .setAllowGravity(false);
      this.#mainSprite.on(
        Phaser.Animations.Events.ANIMATION_UPDATE,
        (animation: Phaser.Animations.Animation, frame: Phaser.Animations.AnimationFrame) => {
          (this.#mainSprite.body as Phaser.Physics.Arcade.Body).setOffset(0, TILE_SIZE * -1 + (frame.index - 1) * 10);
        },
      );
    });
    this.#scene.time.delayedCall(config.delayFromSceneStart, () => {
      this.#attack().catch(() => undefined);
    });
  }

  get sprite(): Phaser.GameObjects.Sprite {
    return this.#mainSprite;
  }

  async #attack(): Promise<void> {
    // shift main sprite down 1 tile
    await this.#moveSpriteForAttack(this.#mainSprite.y + TILE_SIZE);
    // when done, play animation and update sprite body
    await this.#attackPart1();
    // small delay
    await sleep(1000);
    // do reverse
    await this.#attackPart2();
    await this.#moveSpriteForAttack(this.#mainSprite.y - TILE_SIZE);
    await sleep(this.#delayBetweenAttacks);
    await this.#attack();
  }

  async #moveSpriteForAttack(targetYPosition: number): Promise<void> {
    return new Promise((resolve) => {
      this.#scene.tweens.add({
        targets: this.#mainSprite,
        y: targetYPosition,
        duration: 500,
        onComplete: () => {
          resolve(undefined);
        },
      });
    });
  }

  async #attackPart1(): Promise<void> {
    return new Promise((resolve) => {
      this.#mainSprite.play(ANIMATION_KEY.HAMMER_DOWN);
      this.#mainSprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + ANIMATION_KEY.HAMMER_DOWN, () => {
        resolve(undefined);
      });
    });
  }

  async #attackPart2(): Promise<void> {
    return new Promise((resolve) => {
      this.#mainSprite.playReverse(ANIMATION_KEY.HAMMER_DOWN);
      this.#mainSprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + ANIMATION_KEY.HAMMER_DOWN, () => {
        resolve(undefined);
      });
    });
  }
}
