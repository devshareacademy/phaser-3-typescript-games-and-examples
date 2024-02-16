import { Direction, DIRECTION } from './common';
import { randomNumberBetween } from './utils';

type Coordinate = {
  x: number;
  y: number;
};

type Player = {
  position: Coordinate;
  length: number;
  cells: Coordinate[];
  direction: Direction;
};

type Apple = {
  position: Coordinate;
};

export class Snake {
  #numberOfRows: number;
  #numberOfCols: number;
  #player: Player;
  #apple: Apple;
  #gameOver: boolean;

  constructor() {
    this.#numberOfRows = 20;
    this.#numberOfCols = 20;
    this.#player = {
      cells: [],
      length: 4,
      position: {
        x: 10,
        y: 10,
      },
      direction: DIRECTION.RIGHT,
    };
    for (let i = 0; i < this.#player.length; i += 1) {
      this.#player.cells.push({
        x: this.#player.position.x - i,
        y: this.#player.position.y,
      });
    }
    this.#apple = {
      position: {
        x: 0,
        y: 0,
      },
    };
    this.#spawnApple();
    this.#gameOver = false;
  }

  get player(): Player {
    return this.#player;
  }

  get apple(): Apple {
    return this.#apple;
  }

  get isGameOver(): boolean {
    return this.#gameOver;
  }

  set playerDirection(direction: Direction) {
    this.#player.direction = direction;
  }

  public update(): void {
    this.#movePlayer();
    this.#checkForCollisions();
  }

  #movePlayer(): void {
    // move the snake object
    switch (this.#player.direction) {
      case DIRECTION.DOWN:
        this.#player.position.y += 1;
        break;
      case DIRECTION.UP:
        this.#player.position.y -= 1;
        break;
      case DIRECTION.LEFT:
        this.#player.position.x -= 1;
        break;
      case DIRECTION.RIGHT:
        this.#player.position.x += 1;
        break;
    }

    // wrap snake position horizontally on the edge of the screen
    if (this.#player.position.x < 0) {
      this.#player.position.x = this.#numberOfCols - 1;
    } else if (this.#player.position.x >= this.#numberOfCols) {
      this.#player.position.x = 0;
    }

    // wrap snake position vertically on the edge of the screen
    if (this.#player.position.y < 0) {
      this.#player.position.y = this.#numberOfRows - 1;
    } else if (this.#player.position.y >= this.#numberOfRows) {
      this.#player.position.y = 0;
    }

    // update the snake cells, first cell is the head of the snake
    this.#player.cells.unshift({
      x: this.#player.position.x,
      y: this.#player.position.y,
    });

    // remove the last cell since we added one to the beginning of our array
    if (this.#player.cells.length > this.#player.length) {
      this.#player.cells.pop();
    }
  }

  #checkForCollisions(): void {
    // check for collision with apple
    if (this.#player.position.x === this.#apple.position.x && this.#player.position.y === this.#apple.position.y) {
      // add to the snake body
      this.#player.length += 1;

      // respawn the apple
      this.#spawnApple();
    }

    // check to see if the snake collided with itself
    for (let i = 1; i < this.#player.cells.length; i += 1) {
      if (this.#player.position.x === this.#player.cells[i].x && this.#player.position.y === this.#player.cells[i].y) {
        this.#gameOver = true;
        break;
      }
    }
  }

  #spawnApple(): void {
    this.#apple.position.x = randomNumberBetween(0, this.#numberOfCols - 1);
    this.#apple.position.y = randomNumberBetween(0, this.#numberOfRows - 1);
  }
}
