import { ANIMATION_KEY } from '../../schema/data-schema';
import { SPRITE_SHEET_ASSET_KEYS } from '../assets/asset-keys';

const DIRECTION = {
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
} as const;
type Direction = keyof typeof DIRECTION;

const NPC_STATE = {
  IDLE: 'IDLE',
  WALKING: 'WALKING',
} as const;
type NpcState = keyof typeof NPC_STATE;

type NpcConfig = {
  scene: Phaser.Scene;
  x: number;
  y: number;
};

export class NPC {
  #sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  #state: NpcState;
  #direction: Direction;

  constructor(config: NpcConfig) {
    this.#sprite = config.scene.physics.add
      .sprite(config.x, config.y, SPRITE_SHEET_ASSET_KEYS.NPC_1_IDLE, 0)
      .setOrigin(0, 1);
    this.#sprite.body.setSize(20, 30, true).setOffset(5, 18);
    this.#state = NPC_STATE.IDLE;
    this.#sprite.play(ANIMATION_KEY.NPC_1_IDLE);
    this.#direction = DIRECTION.RIGHT;
  }

  get sprite(): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {
    return this.#sprite;
  }

  public switchStates(): void {
    if (this.#state === NPC_STATE.IDLE) {
      this.#state = NPC_STATE.WALKING;
      this.#sprite.play(ANIMATION_KEY.NPC_1_WALK);
      this.#moveRight();
      return;
    }

    this.#state = NPC_STATE.IDLE;
    this.#sprite.play(ANIMATION_KEY.NPC_1_IDLE);
    this.#sprite.setVelocityX(0);
  }

  public update(): void {
    if (this.#state === NPC_STATE.IDLE) {
      return;
    }
  }

  public collidedWithWall(): void {
    if (this.#direction === DIRECTION.LEFT) {
      this.#moveRight();
      return;
    }
    this.#moveLeft();
  }

  #moveRight(): void {
    this.#direction = DIRECTION.RIGHT;
    this.#sprite.setX(this.#sprite.x + 20);
    this.#sprite.setVelocityX(30);
    this.#sprite.setFlipX(false);
    this.#sprite.body.setOffset(5, 18);
  }

  #moveLeft(): void {
    this.#direction = DIRECTION.LEFT;
    this.#sprite.setX(this.#sprite.x - 20);
    this.#sprite.setVelocityX(-30);
    this.#sprite.setFlipX(true);
    this.#sprite.body.setOffset(22, 18);
  }
}
