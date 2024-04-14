import { ANIMATION_KEY } from '../../schema/data-schema';
import { SPRITE_SHEET_ASSET_KEYS } from '../assets/asset-keys';
import GameScene from '../scenes/game-scene';

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

const NPC_VELOCITY = 50;

type NpcConfig = {
  scene: GameScene;
  x: number;
  y: number;
};

export class NPC {
  #scene: GameScene;
  #sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  #state: NpcState;
  #direction: Direction;
  #hasEnteredExit: boolean;
  #hasLeftScene: boolean;
  #colliders: Phaser.Physics.Arcade.Collider[];

  constructor(config: NpcConfig) {
    this.#scene = config.scene;
    this.#sprite = config.scene.physics.add
      .sprite(config.x, config.y, SPRITE_SHEET_ASSET_KEYS.NPC_1_IDLE, 0)
      .setOrigin(0, 1)
      .setInteractive();
    this.#sprite.body.setSize(20, 30, true).setOffset(5, 18);
    this.#state = NPC_STATE.IDLE;
    this.#sprite.play(ANIMATION_KEY.NPC_1_IDLE);
    this.#direction = DIRECTION.RIGHT;
    this.#hasEnteredExit = false;
    this.#hasLeftScene = false;
    this.#colliders = [];

    this.#sprite.on(Phaser.Input.Events.POINTER_DOWN, () => {
      this.#handlePlayerClick();
    });
  }

  get sprite(): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {
    return this.#sprite;
  }

  get hasExitedLevel(): boolean {
    return this.#hasLeftScene;
  }

  public update(): void {
    if (this.#state === NPC_STATE.IDLE) {
      return;
    }
    if (this.#hasLeftScene) {
      return;
    }
    if (this.#sprite.x >= this.#scene.cameras.main.worldView.width) {
      this.#sprite.destroy();
      this.#hasLeftScene = true;
      this.#scene.npcHasLeftScene();
    }
  }

  public addCollider(collider: Phaser.Physics.Arcade.Collider): void {
    this.#colliders.push(collider);
  }

  public collidedWithWall(): void {
    if (this.#direction === DIRECTION.LEFT) {
      this.#moveRight();
      return;
    }
    this.#moveLeft();
  }

  public hasEnteredExit(): void {
    if (this.#hasEnteredExit) {
      return;
    }
    this.#hasEnteredExit = true;
    this.#sprite.removeInteractive();
    this.#colliders.forEach((collider) => {
      collider.destroy();
    });
  }

  #moveRight(): void {
    this.#direction = DIRECTION.RIGHT;
    this.#sprite.setX(this.#sprite.x + 20);
    this.#sprite.setVelocityX(NPC_VELOCITY);
    this.#sprite.setFlipX(false);
    this.#sprite.body.setOffset(5, 18);
  }

  #moveLeft(): void {
    this.#direction = DIRECTION.LEFT;
    this.#sprite.setX(this.#sprite.x - 20);
    this.#sprite.setVelocityX(NPC_VELOCITY * -1);
    this.#sprite.setFlipX(true);
    this.#sprite.body.setOffset(22, 18);
  }

  #switchStates(): void {
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

  #handlePlayerClick(): void {
    // TODO: see if npc is within range of speaker
    this.#switchStates();
  }
}
