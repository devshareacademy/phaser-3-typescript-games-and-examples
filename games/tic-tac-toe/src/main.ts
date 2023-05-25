import Phaser from 'phaser';

const SPRITE_ASSET_KEY = 'SPRITE_ASSET_KEY';
let isPlayerOneTurn = true;

class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' });
  }

  preload(): void {
    this.load.spritesheet(SPRITE_ASSET_KEY, 'assets/images/blocks.png', {
      frameWidth: 16,
      frameHeight: 16,
    });
  }

  create(): void {
    this.add
      .text(240, 50, 'Tic-Tac-Toe', {
        color: 'purple',
        fontFamily: 'Verdana',
        fontSize: '42px',
      })
      .setOrigin(0.5);

    this.add
      .text(240, 600, 'X turn', {
        color: 'black',
        fontFamily: 'Verdana',
        fontSize: '22px',
      })
      .setOrigin(0.5);

    this.#addGamePiece(0, 0);
    this.#addGamePiece(0, 1);
    this.#addGamePiece(0, 2);

    this.#addGamePiece(1, 0);
    this.#addGamePiece(1, 1);
    this.#addGamePiece(1, 2);

    this.#addGamePiece(2, 0);
    this.#addGamePiece(2, 1);
    this.#addGamePiece(2, 2);

    const graphics = this.add.graphics();
    graphics.lineStyle(12, 0x3e3e3e);
    graphics.lineBetween(170, 120, 170, 540);
    graphics.lineBetween(314, 120, 314, 540);
    graphics.lineBetween(30, 258, 450, 258);
    graphics.lineBetween(30, 402, 450, 402);
  }

  #addGamePiece(x: number, y: number): void {
    const pieceSize = 96;
    const xPos = 50 + (pieceSize + pieceSize / 2) * y;
    const yPos = 140 + (pieceSize + pieceSize / 2) * x;
    const piece = this.add.image(xPos, yPos, SPRITE_ASSET_KEY, 2).setScale(6).setOrigin(0).setInteractive();
    piece.once(Phaser.Input.Events.POINTER_DOWN as string, () => {
      if (isPlayerOneTurn) {
        piece.setFrame(0);
      } else {
        piece.setFrame(1);
      }
      isPlayerOneTurn = !isPlayerOneTurn;
    });
  }
}

const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.CANVAS,
  pixelArt: true,
  scale: {
    parent: 'game-container',
    width: 480,
    height: 640,
  },
  backgroundColor: '#d3d3d3',
  scene: [Game],
};

const game = new Phaser.Game(gameConfig);
