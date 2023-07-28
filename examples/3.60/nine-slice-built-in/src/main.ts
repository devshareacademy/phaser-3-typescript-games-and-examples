import * as Phaser from 'phaser';

const AssetKeys = {
  PANEL: 'PANEL',
} as const;

class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' });
  }

  preload(): void {
    this.load.image(AssetKeys.PANEL, 'assets/images/glassPanel_corners.png');
  }

  create(): void {
    const { height, width } = this.scale;

    this.add.image(width / 2, height / 2, AssetKeys.PANEL, 0);
  }
}

const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  pixelArt: true,
  scale: {
    parent: 'game-container',
    width: 800,
    height: 600,
  },
  backgroundColor: '#5c5b5b',
  scene: [Game],
};

const game = new Phaser.Game(gameConfig);
