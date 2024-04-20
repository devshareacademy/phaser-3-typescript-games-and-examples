import { ANIMATION_KEY } from '../schema/data-schema';
import { SPRITE_SHEET_ASSET_KEYS } from '../assets/asset-keys';
import GameScene from '../scenes/game-scene';
import { Speaker } from './speaker';
import { explode, fadeOut, flash, shake } from '../utils/juice-utils';

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
  speakers: Speaker[];
};

export class NPC {
  #scene: GameScene;
  #sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  #state: NpcState;
  #direction: Direction;
  #hasEnteredExit: boolean;
  #hasDied: boolean;
  #hasLeftScene: boolean;
  #colliders: Phaser.Physics.Arcade.Collider[];
  #speakers: Speaker[];
  #targetPosition: number | undefined;
  #waitForNpcToReachTargetPositionCallback: (() => void) | undefined;
  #inTutorial: boolean;
  #isEnteringLevel: boolean;

  constructor(config: NpcConfig) {
    this.#scene = config.scene;
    this.#sprite = config.scene.physics.add
      .sprite(config.x, config.y, SPRITE_SHEET_ASSET_KEYS.NPC_1_IDLE, 0)
      .setOrigin(0, 1)
      .setInteractive();
    (this.#sprite.body as Phaser.Physics.Arcade.Body).setSize(20, 30, true).setOffset(5, 18).setAllowGravity(true);
    this.#state = NPC_STATE.IDLE;
    this.#sprite.play(ANIMATION_KEY.NPC_1_IDLE);
    this.#direction = DIRECTION.RIGHT;
    this.#hasEnteredExit = false;
    this.#hasLeftScene = false;
    this.#hasDied = false;
    this.#colliders = [];
    this.#speakers = config.speakers;
    this.#inTutorial = false;
    this.#isEnteringLevel = false;

    this.#sprite.on(Phaser.Input.Events.POINTER_DOWN, () => {
      this.handlePlayerClick();
    });
  }

  get sprite(): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {
    return this.#sprite;
  }

  get hasExitedLevel(): boolean {
    return this.#hasLeftScene;
  }

  set inTutorial(val: boolean) {
    this.#inTutorial = val;
  }

  public update(): void {
    if (
      this.#waitForNpcToReachTargetPositionCallback !== undefined &&
      this.#targetPosition !== undefined &&
      this.#sprite.x >= this.#targetPosition
    ) {
      this.#waitForNpcToReachTargetPositionCallback();
      return;
    }
    if (this.#state === NPC_STATE.IDLE) {
      return;
    }
    if (this.#hasLeftScene) {
      return;
    }
    if (this.#hasDied) {
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
    if (this.#isEnteringLevel) {
      return;
    }
    if (this.#direction === DIRECTION.LEFT) {
      this.#moveRight();
      return;
    }
    this.#moveLeft();
  }

  public collideWithBridgeWall(): void {
    this.handlePlayerClick();
  }

  public hasEnteredExit(): void {
    if (this.#hasEnteredExit) {
      return;
    }
    this.#hasEnteredExit = true;
    this.#sprite.removeInteractive();
    (this.#sprite.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
    this.#colliders.forEach((collider) => {
      collider.destroy();
    });
  }

  public isOnBelt(speed: Phaser.Math.Vector2): void {
    this.#sprite.body.position.add(speed);
  }

  public died(): void {
    if (this.#hasDied) {
      return;
    }
    this.#hasDied = true;
    this.#sprite.removeInteractive();
    this.#colliders.forEach((collider) => {
      collider.destroy();
    });
    this.#sprite.setVelocityX(0);
    this.#sprite.anims.stop();
    // shake and emitter
    shake(this.#scene, this.#sprite);
    flash(this.#scene, this.#sprite);
    this.#scene.time.delayedCall(500, () => {
      fadeOut(this.#scene, this.#sprite);
      explode(
        this.#scene,
        {
          x: this.#sprite.x + 10,
          y: this.#sprite.y - 12,
        },
        () => {
          this.#scene.triggerGameOver();
        },
      );
    });
  }

  public async moveToPosition(x: number): Promise<void> {
    return new Promise((resolve) => {
      this.#targetPosition = x;
      this.#waitForNpcToReachTargetPositionCallback = () => {
        this.#waitForNpcToReachTargetPositionCallback = undefined;
        this.#targetPosition = undefined;
        this.#switchStates();
        resolve();
      };
      this.#switchStates();
      this.#sprite.setVelocityX(20);
    });
  }

  public async playEnterLevel(): Promise<void> {
    return new Promise((resolve) => {
      this.#isEnteringLevel = true;
      (this.#sprite.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
      this.#sprite.setVelocityX(0);
      this.#sprite.play(ANIMATION_KEY.NPC_1_WALK);
      const originalX = this.#sprite.x;
      this.#sprite.setX(-30);
      this.#scene.tweens.add({
        targets: this.#sprite,
        x: originalX,
        duration: 1200,
        onComplete: () => {
          (this.#sprite.body as Phaser.Physics.Arcade.Body).setAllowGravity(true);
          this.#sprite.play(ANIMATION_KEY.NPC_1_IDLE);
          this.#isEnteringLevel = true;
          resolve();
        },
      });
    });
  }

  #switchStates(): void {
    if (this.#state === NPC_STATE.IDLE) {
      this.#state = NPC_STATE.WALKING;
      this.#sprite.play(ANIMATION_KEY.NPC_1_WALK);
      if (this.#direction === DIRECTION.RIGHT) {
        this.#moveRight();
      } else {
        this.#moveLeft();
      }
      return;
    }

    this.#state = NPC_STATE.IDLE;
    this.#sprite.play(ANIMATION_KEY.NPC_1_IDLE);
    this.#sprite.setVelocityX(0);
  }

  #moveRight(): void {
    if (this.#direction !== DIRECTION.RIGHT) {
      this.#direction = DIRECTION.RIGHT;
      this.#sprite.setX(this.#sprite.x + 22);
    } else {
      this.#sprite.setX(this.#sprite.x - 5);
    }
    this.#sprite.setVelocityX(NPC_VELOCITY);
    this.#sprite.setFlipX(false);
    this.#sprite.body.setOffset(5, 18);
  }

  #moveLeft(): void {
    if (this.#direction !== DIRECTION.LEFT) {
      this.#direction = DIRECTION.LEFT;
      this.#sprite.setX(this.#sprite.x - 22);
    } else {
      this.#sprite.setX(this.#sprite.x + 5);
    }
    this.#sprite.setVelocityX(NPC_VELOCITY * -1);
    this.#sprite.setFlipX(true);
    this.#sprite.body.setOffset(22, 18);
  }

  public handlePlayerClick(): void {
    if (this.#inTutorial) {
      return;
    }

    const npcBodyRect: Phaser.Geom.Rectangle = new Phaser.Geom.Rectangle(0, 0, 0, 0);
    this.#sprite.body.getBounds(npcBodyRect);

    const isOverlapWithSpeaker = this.#speakers.some((speaker) => {
      const speakerBody = speaker.speakerRange.body as Phaser.Physics.Arcade.Body;

      const speakerBodyBounds: Phaser.Geom.Circle = new Phaser.Geom.Circle(
        speakerBody.x,
        speakerBody.y,
        speakerBody.halfWidth,
      );
      speakerBody.getBounds(speakerBodyBounds);
      return Phaser.Geom.Intersects.CircleToRectangle(speakerBodyBounds, npcBodyRect);
    });
    if (isOverlapWithSpeaker) {
      this.#switchStates();
    }
  }
}
