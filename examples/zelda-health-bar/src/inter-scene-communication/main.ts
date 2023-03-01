import Phaser from 'phaser';
import { Ui } from './scenes/ui';
import { Game } from './scenes/game';

const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.CANVAS,
  pixelArt: true,
  scale: {
    parent: 'game-container',
    width: 800,
    height: 600,
  },
  backgroundColor: '#5c5b5b',
  scene: [Game, Ui],
};

const game = new Phaser.Game(gameConfig);
