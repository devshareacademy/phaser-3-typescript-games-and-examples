import { SPRITE_SHEET_ASSET_KEYS } from '../assets/asset-keys';
import { TILE_SIZE } from '../config';
import GameScene from '../scenes/game-scene';
import { ANIMATION_KEY } from '../schema/data-schema';
import { ButtonPoweredObject } from './button-powered-object';

const BELT_STATE = {
  OFF: 'OFF',
  SLOW: 'SLOW',
  MED: 'MED',
  FAST: 'FAST',
} as const;
type BeltState = keyof typeof BELT_STATE;

type BeltConfig = {
  scene: GameScene;
  x: number;
  y: number;
  width: number;
  id: number;
};

export class Belt implements ButtonPoweredObject {
  #scene: GameScene;
  #width: number;
  #beltSpriteContainer: Phaser.GameObjects.Container;
  #startSprite!: Phaser.GameObjects.Sprite;
  #midSprite!: Phaser.GameObjects.Sprite;
  #midTileSprite!: Phaser.GameObjects.TileSprite;
  #endSprite!: Phaser.GameObjects.Sprite;
  #id: number;
  #beltState: BeltState;
  #surfaceSpeed: Phaser.Math.Vector2;

  constructor(config: BeltConfig) {
    this.#id = config.id;
    this.#width = config.width;
    this.#scene = config.scene;
    this.#beltState = BELT_STATE.OFF;
    this.#surfaceSpeed = new Phaser.Math.Vector2(0, 0);
    this.#beltSpriteContainer = config.scene.add.container(config.x + TILE_SIZE / 2, config.y, []);
    this.#createSprites();
    this.#beltSpriteContainer.setSize(this.#width, TILE_SIZE);
    this.#scene.physics.world.enable(this.#beltSpriteContainer);
    (this.#beltSpriteContainer.body as Phaser.Physics.Arcade.Body)
      .setOffset(TILE_SIZE * 4, -2)
      .setImmovable(true)
      .setAllowGravity(false);

    // this.#sprite = config.scene.physics.add
    //   .sprite(config.x, config.y, SPRITE_SHEET_ASSET_KEYS.DOOR, 0)
    //   .setOrigin(0, 0.5);
  }

  get spriteContainer(): Phaser.GameObjects.Container {
    return this.#beltSpriteContainer;
  }

  get id(): number {
    return this.#id;
  }

  get speed(): Phaser.Math.Vector2 {
    return this.#surfaceSpeed;
  }

  /**
   * Sets the initial power level for this object
   * @param powerLevel the amount of power the connected button has, will be between 0 - 3
   */
  public setInitialPowerLevel(powerLevel: number): void {
    if (powerLevel === 0) {
      this.#beltState = BELT_STATE.OFF;
    } else if (powerLevel === 1) {
      this.#beltState = BELT_STATE.SLOW;
    } else if (powerLevel === 2) {
      this.#beltState = BELT_STATE.MED;
    } else {
      this.#beltState = BELT_STATE.FAST;
    }
    this.#setTextures();
  }

  /**
   *
   * @param powerLevel the amount of power the connected button has, will be between 0 - 3
   */
  public powerLevelChanged(powerLevel: number): void {
    // TODO
    console.log(powerLevel);
    if (powerLevel === 0) {
      this.#beltState = BELT_STATE.OFF;
    } else if (powerLevel === 1) {
      this.#beltState = BELT_STATE.SLOW;
    } else if (powerLevel === 2) {
      this.#beltState = BELT_STATE.MED;
    } else {
      this.#beltState = BELT_STATE.FAST;
    }
    this.#setTextures();
  }

  public update(): void {
    this.#midTileSprite.setFrame(this.#midSprite.frame.name);
  }

  #createSprites(): void {
    this.#startSprite = this.#scene.add.sprite(0, 0, SPRITE_SHEET_ASSET_KEYS.BELT_START, 0);
    // calculate mid belt width size by taking total width and subtracting the size of the start and end pieces
    const midSpriteWidth = this.#width - TILE_SIZE * 2;
    this.#midSprite = this.#scene.add.sprite(TILE_SIZE, 0, SPRITE_SHEET_ASSET_KEYS.BELT_MID, 0).setVisible(false);
    this.#midTileSprite = this.#scene.add
      .tileSprite(TILE_SIZE / 2, 0, midSpriteWidth, TILE_SIZE, SPRITE_SHEET_ASSET_KEYS.BELT_MID, 0)
      .setOrigin(0, 0.5);
    this.#endSprite = this.#scene.add.sprite(this.#width - TILE_SIZE, 0, SPRITE_SHEET_ASSET_KEYS.BELT_END, 0);
    this.#beltSpriteContainer.add([this.#startSprite, this.#midSprite, this.#midTileSprite, this.#endSprite]);
  }

  #setTextures(): void {
    if (this.#beltState === BELT_STATE.OFF) {
      this.#startSprite.anims.stop();
      this.#midSprite.anims.stop();
      this.#endSprite.anims.stop();
      this.#surfaceSpeed.set(0);
      return;
    }
    let animationSpeed = 20;
    this.#surfaceSpeed.set(-1, 0);
    if (this.#beltState === BELT_STATE.SLOW) {
      animationSpeed = 8;
      this.#surfaceSpeed.set(-0.4, 0);
    } else if (this.#beltState === BELT_STATE.MED) {
      animationSpeed = 12;
      this.#surfaceSpeed.set(-0.7, 0);
    }

    this.#startSprite.playReverse({
      key: ANIMATION_KEY.BELT_START,
      frameRate: animationSpeed,
    });
    this.#midSprite.playReverse({
      key: ANIMATION_KEY.BELT_MID,
      frameRate: animationSpeed,
    });
    this.#endSprite.playReverse({
      key: ANIMATION_KEY.BELT_END,
      frameRate: animationSpeed,
    });
  }
}
