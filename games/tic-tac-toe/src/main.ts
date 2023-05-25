import Phaser from 'phaser';

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
