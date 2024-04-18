import { ANIMATION_KEY } from '../schema/data-schema';
import { SPRITE_SHEET_ASSET_KEYS } from '../assets/asset-keys';
import GameScene from '../scenes/game-scene';
import { ButtonPoweredObject } from './button-powered-object';

type DoorConfig = {
  scene: GameScene;
  x: number;
  y: number;
  flipX: boolean;
  id: number;
};

const DOOR_STATE = {
  CLOSED: 'CLOSED',
  PARTIAL1: 'PARTIAL1',
  PARTIAL2: 'PARTIAL2',
  OPEN: 'OPEN',
} as const;
type DoorState = keyof typeof DOOR_STATE;

export class Door implements ButtonPoweredObject {
  #scene: GameScene;
  #sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  #id: number;
  #doorState: DoorState;

  constructor(config: DoorConfig) {
    this.#id = config.id;
    this.#scene = config.scene;
    this.#doorState = DOOR_STATE.CLOSED;
    this.#sprite = config.scene.physics.add
      .sprite(config.x, config.y, SPRITE_SHEET_ASSET_KEYS.DOOR, 0)
      .setFlipX(config.flipX)
      .setOrigin(0, 0.5);
    this.#setTexture();
  }

  get sprite(): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {
    return this.#sprite;
  }

  get id(): number {
    return this.#id;
  }

  /**
   * Sets the initial power level for this object
   * @param powerLevel the amount of power the connected button has, will be between 0 - 3
   */
  public setInitialPowerLevel(powerLevel: number): void {
    if (powerLevel === 0) {
      this.#doorState = DOOR_STATE.CLOSED;
    } else if (powerLevel === 1) {
      this.#doorState = DOOR_STATE.PARTIAL1;
      this.#sprite.play(ANIMATION_KEY.DOOR_CLOSED_TO_PARTIAL1_OPEN);
    } else if (powerLevel === 2) {
      this.#doorState = DOOR_STATE.PARTIAL2;
    } else {
      this.#doorState = DOOR_STATE.OPEN;
    }
    this.#setTexture();
  }

  /**
   *
   * @param powerLevel the amount of power the connected button has, will be between 0 - 3
   */
  public powerLevelChanged(powerLevel: number): void {
    if (!this.#sprite.body.enable) {
      this.#sprite.body.enable = true;
    }
    const currentState = this.#doorState;
    if (powerLevel === 0) {
      this.#doorState = DOOR_STATE.CLOSED;
      if (currentState === DOOR_STATE.PARTIAL2) {
        this.#sprite.play(ANIMATION_KEY.DOOR_PARTIAL2_OPEN_TO_CLOSED);
        return;
      }
      if (currentState === DOOR_STATE.PARTIAL1) {
        this.#sprite.play(ANIMATION_KEY.DOOR_PARTIAL1_OPEN_TO_CLOSED);
        return;
      }
      this.#sprite.play(ANIMATION_KEY.DOOR_OPEN_TO_CLOSED);
      return;
    }
    if (powerLevel === 1) {
      this.#doorState = DOOR_STATE.PARTIAL1;
      this.#sprite.play(ANIMATION_KEY.DOOR_CLOSED_TO_PARTIAL1_OPEN);
      return;
    }
    if (powerLevel === 2) {
      this.#doorState = DOOR_STATE.PARTIAL2;
      this.#sprite.play(ANIMATION_KEY.DOOR_PARTIAL1_OPEN_TO_PARTIAL2_OPEN);
      return;
    }
    this.#doorState = DOOR_STATE.OPEN;
    this.#sprite.play(ANIMATION_KEY.DOOR_PARTIAL2_OPEN_TO_OPEN);
    this.#sprite.body.enable = false;
    return;
  }

  #setTexture(): void {
    if (this.#doorState === DOOR_STATE.CLOSED) {
      this.#sprite.setFrame(0);
      return;
    }
    if (this.#doorState === DOOR_STATE.PARTIAL1) {
      this.#sprite.setFrame(1);
      return;
    }
    if (this.#doorState === DOOR_STATE.PARTIAL2) {
      this.#sprite.setFrame(2);
      return;
    }
    this.#sprite.setFrame(4);
    this.#scene.physics.world.once(Phaser.Physics.Arcade.Events.WORLD_STEP, () => {
      this.#sprite.body.enable = false;
    });
  }
}
