import Phaser from 'phaser';

const AssetKeys = {
  BACKGROUND: 'BACKGROUND',
  FOG: 'FOG',
  FOREGROUND: 'FOREGROUND',
  TREES: 'TREES',
} as const;

class Game extends Phaser.Scene {
  private bg!: Phaser.GameObjects.TileSprite;
  private fog!: Phaser.GameObjects.TileSprite;
  private fg!: Phaser.GameObjects.TileSprite;
  private trees!: Phaser.GameObjects.TileSprite;

  constructor() {
    super({ key: 'Game' });
  }

  preload(): void {
    this.load.setBaseURL('https://devshareacademy.github.io/cdn/images/asset-packs/ansimuz/silent-hill-style-assets');
    this.load.image(AssetKeys.BACKGROUND, 'background.png');
    this.load.image(AssetKeys.FOG, 'fog.png');
    this.load.image(AssetKeys.FOREGROUND, 'foreground.png');
    this.load.image(AssetKeys.TREES, 'trees.png');
  }

  create(): void {
    const { height, width } = this.scale;

    this.bg = this.add.tileSprite(0, 0, width, height, AssetKeys.BACKGROUND).setScale(2);
    this.trees = this.add.tileSprite(0, 0, width, height, AssetKeys.TREES).setScale(2);
    this.fg = this.add.tileSprite(0, 0, width, height, AssetKeys.FOREGROUND).setScale(2);
    this.fog = this.add.tileSprite(0, 0, width, height, AssetKeys.FOG).setScale(2);
  }

  update(): void {
    this.bg.tilePositionX += 0.1;
    this.trees.tilePositionX += 0.14;
    this.fg.tilePositionX += 0.2;
    this.fog.tilePositionX += 0.7;
  }
}

const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.CANVAS,
  pixelArt: true,
  scale: {
    parent: 'game-container',
    width: 640,
    height: 416,
  },
  backgroundColor: '#5c5b5b',
  scene: [Game],
};

const game = new Phaser.Game(gameConfig);
