import { ANIMATION_KEY } from '../schema/data-schema';
import { AUDIO_ASSET_KEYS, SPRITE_SHEET_ASSET_KEYS } from '../assets/asset-keys';
import GameScene from '../scenes/game-scene';
import { ButtonPoweredObject } from './button-powered-object';
import { playSoundFx } from '../utils/sound-utils';

type DoorConfig = {
  scene: GameScene;
  x: number;
  y: number;
  flipX: boolean;
  id: number;
  isLevelEntrance: boolean;
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
  #isLevelEntrance: boolean;

  constructor(config: DoorConfig) {
    this.#id = config.id;
    this.#scene = config.scene;
    this.#isLevelEntrance = config.isLevelEntrance;
    this.#doorState = DOOR_STATE.CLOSED;
    this.#sprite = config.scene.physics.add
      .sprite(config.x, config.y, SPRITE_SHEET_ASSET_KEYS.DOOR, 0)
      .setFlipX(config.flipX)
      .setOrigin(0, 0.5);
    this.#setTexture();
    if (this.#isLevelEntrance) {
      this.#doorState = DOOR_STATE.OPEN;
      this.#setTexture();
      this.#scene.physics.world.once(Phaser.Physics.Arcade.Events.WORLD_STEP, () => {
        this.#sprite.body.enable = true;
      });
    }
  }

  get sprite(): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {
    return this.#sprite;
  }

  get id(): number {
    return this.#id;
  }

  get isLevelEntrance(): boolean {
    return this.#isLevelEntrance;
  }

  public async closeDoor(): Promise<void> {
    return new Promise((resolve) => {
      this.#sprite.play(ANIMATION_KEY.DOOR_OPEN_TO_CLOSED);
      this.#sprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + ANIMATION_KEY.DOOR_OPEN_TO_CLOSED, () => {
        resolve();
      });
    });
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
        playSoundFx(this.#scene, AUDIO_ASSET_KEYS.DOOR_CLOSE);
        return;
      }
      if (currentState === DOOR_STATE.PARTIAL1) {
        this.#sprite.play(ANIMATION_KEY.DOOR_PARTIAL1_OPEN_TO_CLOSED);
        playSoundFx(this.#scene, AUDIO_ASSET_KEYS.DOOR_CLOSE);
        return;
      }
      this.#sprite.play(ANIMATION_KEY.DOOR_OPEN_TO_CLOSED);
      playSoundFx(this.#scene, AUDIO_ASSET_KEYS.DOOR_CLOSE);
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
