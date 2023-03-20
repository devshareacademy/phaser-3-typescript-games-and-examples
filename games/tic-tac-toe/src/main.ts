import Phaser from 'phaser';

const SPRITE_ASSET_KEY = 'SPRITE_ASSET_KEY';

class Game extends Phaser.Scene {
  #playerTurnText!: Phaser.GameObjects.Text;

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
    const t = this.add
      .text(240, 50, 'Tic-Tac-Toe', {
        color: 'purple',
        fontFamily: 'Verdana',
        fontSize: '42px',
      })
      .setOrigin(0.5);
    console.log(t.getBounds());

    // add text object about current players turn
    const d = (this.#playerTurnText = this.add
      .text(240, 600, 'X turn', {
        color: 'black',
        fontFamily: 'Verdana',
        fontSize: '22px',
      })
      .setOrigin(0.5));
    console.log(d.getBounds());

    // draw lines between game spaces
    const graphics = this.add.graphics();
    graphics.lineStyle(12, 0x3e3e3e);
    graphics.lineBetween(170, 120, 170, 540);
    graphics.lineBetween(314, 120, 314, 540);
    graphics.lineBetween(30, 258, 450, 258);
    graphics.lineBetween(30, 402, 450, 402);
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
