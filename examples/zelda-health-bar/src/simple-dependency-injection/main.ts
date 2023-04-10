import Phaser from 'phaser';
import { Ui } from './scenes/ui';
import { Game } from './scenes/game';
import Health from './components/health';

const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.CANVAS,
  pixelArt: true,
  scale: {
    parent: 'game-container',
    width: 800,
    height: 600,
  },
  backgroundColor: '#5c5b5b',
};

const game = new Phaser.Game(gameConfig);
const customEmitter = new Phaser.Events.EventEmitter();
const customHealthComponent = new Health(customEmitter);

game.scene.add('Game', new Game(customHealthComponent));
game.scene.add('Ui', new Ui(customEmitter, customHealthComponent));
game.scene.start('Game');
