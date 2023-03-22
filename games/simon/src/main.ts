import Phaser from 'phaser';

class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' });
  }

  preload(): void {
    // load in data
  }

  create(): void {
    // Create game objects
  }
}

const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.CANVAS,
  pixelArt: true,
  parent: 'game-container',
  width: 480,
  height: 640,
  backgroundColor: '#5c5b5b',
  scene: [Game],
};

const game = new Phaser.Game(gameConfig);
