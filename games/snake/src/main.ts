import * as Phaser from 'phaser';
import { Snake } from './lib/snake';
import { DIRECTION } from './lib/common';

const SPRITE_ASSET_KEY = 'SPRITE_ASSET_KEY';
const SPRITE_SIZE = 16;
const SCALE_SIZE = 2;

class Game extends Phaser.Scene {
  #snake!: Snake;
  #snakeGameObjectPool!: Phaser.GameObjects.Group;
  #apple!: Phaser.GameObjects.Image;
  #cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  #movePlayerTimer!: number;
  #speed!: number;

  constructor() {
    super({ key: 'Game' });
  }

  public init(): void {
    this.#snake = new Snake();
    this.#speed = 200;
  }

  public preload(): void {
    this.load.spritesheet(SPRITE_ASSET_KEY, 'assets/images/snake.png', {
      frameWidth: SPRITE_SIZE,
      frameHeight: SPRITE_SIZE,
    });
  }

  public create(): void {
    this.#apple = this.add
      .image(
        this.#snake.apple.position.x * SPRITE_SIZE * SCALE_SIZE,
        this.#snake.apple.position.y * SPRITE_SIZE * SCALE_SIZE,
        SPRITE_ASSET_KEY,
        0,
      )
      .setOrigin(0)
      .setScale(SCALE_SIZE);

    this.#snakeGameObjectPool = this.add.group();
    this.#snake.player.cells.forEach((cell) => {
      const obj = this.#snakeGameObjectPool.get(
        cell.x * SPRITE_SIZE * SCALE_SIZE,
        cell.y * SPRITE_SIZE * SCALE_SIZE,
        SPRITE_ASSET_KEY,
        1,
        true,
      ) as Phaser.GameObjects.Image;
      obj.setScale(SCALE_SIZE).setOrigin(0);
    });

    this.#cursors = this.input.keyboard.createCursorKeys();
  }

  public update(time: number): void {
    if (this.#snake.isGameOver) {
      return;
    }

    if (this.#cursors.left.isDown && this.#snake.player.direction !== DIRECTION.RIGHT) {
      this.#snake.playerDirection = DIRECTION.LEFT;
    } else if (this.#cursors.right.isDown && this.#snake.player.direction !== DIRECTION.LEFT) {
      this.#snake.playerDirection = DIRECTION.RIGHT;
    } else if (this.#cursors.up.isDown && this.#snake.player.direction !== DIRECTION.DOWN) {
      this.#snake.playerDirection = DIRECTION.UP;
    } else if (this.#cursors.down.isDown && this.#snake.player.direction !== DIRECTION.UP) {
      this.#snake.playerDirection = DIRECTION.DOWN;
    }

    if (time < this.#movePlayerTimer) {
      return;
    }

    this.#snake.update();

    this.#snakeGameObjectPool.getChildren().forEach((child) => {
      child.setActive(false);
    });

    this.#snake.player.cells.forEach((cell) => {
      const obj = this.#snakeGameObjectPool.get(
        cell.x * SPRITE_SIZE * SCALE_SIZE,
        cell.y * SPRITE_SIZE * SCALE_SIZE,
        SPRITE_ASSET_KEY,
        1,
        true,
      ) as Phaser.GameObjects.Image;
      obj.setScale(SCALE_SIZE).setOrigin(0).setActive(true);
    });
    this.#apple.setPosition(
      this.#snake.apple.position.x * SPRITE_SIZE * SCALE_SIZE,
      this.#snake.apple.position.y * SPRITE_SIZE * SCALE_SIZE,
    );

    if (this.#snake.isGameOver) {
      console.log('game over');
    }

    this.#movePlayerTimer = time + this.#speed;
  }
}

const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.CANVAS,
  pixelArt: true,
  scale: {
    parent: 'game-container',
    width: 640,
    height: 640,
  },
  backgroundColor: '#5c5b5b',
  scene: [Game],
};

const game = new Phaser.Game(gameConfig);
