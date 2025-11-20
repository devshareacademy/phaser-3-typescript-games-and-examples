import * as Phaser from 'phaser';
import { ConnectFour } from '@devshareacademy/connect-four';
import { Player } from '@devshareacademy/connect-four/dist/types';

const ASSET_KEY = 'spritesheet';
const SCALE_SIZE = 2;
const FRAME_SIZE = 32;
const SCALED_FRAME_SIZE = SCALE_SIZE * FRAME_SIZE;
const GAME_HEIGHT = SCALED_FRAME_SIZE * 6;
const GAME_WIDTH = SCALED_FRAME_SIZE * 7;

class Game extends Phaser.Scene {
  private connectFour!: ConnectFour;

  constructor() {
    super({ key: 'Game' });
  }

  public init(): void {
    this.connectFour = new ConnectFour();
  }

  public preload(): void {
    // load in data
    this.load.spritesheet(ASSET_KEY, 'https://devshareacademy.github.io/cdn/images/spritesheets/custom/connect-four.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  public create(): void {
    // Create game objects
    this.createBoard();
    this.createInputColumns();
  }

  private createBoard(): void {
    for (let i = 0; i < this.connectFour.board[0].length; i++) {
      for (let j = 0; j < this.connectFour.board.length; j++) {
        const x = i * SCALED_FRAME_SIZE;
        const y = j * SCALED_FRAME_SIZE;
        this.add.image(x, y, ASSET_KEY, 2).setOrigin(0).setScale(SCALE_SIZE).setDepth(2);
      }
    }
  }

  private createInputColumns(): void {
    const columnIndexKey = 'columnIndex';

    // create the columns for the game and make them interactive
    for (let i = 0; i < this.connectFour.board[0].length; i++) {
      const x = i * SCALED_FRAME_SIZE;
      const rect = this.add.rectangle(x, 0, SCALED_FRAME_SIZE, GAME_HEIGHT, 0xffff00).setOrigin(0).setInteractive();
      rect.setAlpha(0.01);
      rect.setData(columnIndexKey, i);
      rect.on(Phaser.Input.Events.POINTER_OVER as string, () => {
        if (this.connectFour.isGameOver) {
          return;
        }
        rect.setAlpha(0.2);
      });
      rect.on(Phaser.Input.Events.POINTER_OUT as string, () => {
        rect.setAlpha(0.01);
      });
      rect.on(Phaser.Input.Events.POINTER_DOWN as string, () => {
        if (this.connectFour.isGameOver) {
          return;
        }

        const currentPlayer = this.connectFour.playersTurn;
        const coordinate = this.connectFour.makeMove(rect.getData(columnIndexKey) as number);
        this.addGamePiece(coordinate.row, coordinate.col, currentPlayer);
      });
    }
  }

  private addGamePiece(row: number, col: number, player: string): void {
    const gamePieceFrame = player === Player.ONE ? 0 : 1;
    const x = col * SCALED_FRAME_SIZE;
    const y = row * SCALED_FRAME_SIZE;
    this.add.image(x, y, ASSET_KEY, gamePieceFrame).setOrigin(0).setScale(SCALE_SIZE).setDepth(1);
    this.checkForGameOver();
  }

  private checkForGameOver(): void {
    if (!this.connectFour.isGameOver) {
      return;
    }

    this.add
      .rectangle(20, GAME_HEIGHT / 3, GAME_WIDTH - 40, GAME_HEIGHT / 4, 0x000000)
      .setOrigin(0)
      .setDepth(4)
      .setInteractive()
      .once(Phaser.Input.Events.POINTER_DOWN as string, () => {
        this.scene.restart();
      });

    let winText = 'Draw';
    if (this.connectFour.gameWinner) {
      winText = `Player ${this.connectFour.gameWinner} Wins!`;
    }

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 3 + 30, winText, { fontSize: '32px' })
      .setOrigin(0.5)
      .setDepth(5);
    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 15, 'Click here to play again!')
      .setOrigin(0.5)
      .setDepth(5);
  }
}

const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.CANVAS,
  pixelArt: true,
  scale: {
    parent: 'game-container',
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
  },
  backgroundColor: '#5c5b5b',
  scene: [Game],
};

const game = new Phaser.Game(gameConfig);
