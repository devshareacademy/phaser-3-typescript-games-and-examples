import Phaser from 'phaser';
import GameScene from './scenes/game-scene';
import * as CONFIG from './config';
import { SceneKeys } from './scenes/scene-keys';

export default class Game {
  private readonly game: Phaser.Game;

  constructor() {
    const gameConfig: Phaser.Types.Core.GameConfig = {
      type: Phaser.CANVAS,
      pixelArt: true,
      scale: {
        parent: 'game-container',
        width: CONFIG.GAME_WIDTH,
        height: CONFIG.GAME_HEIGHT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        // mode: Phaser.Scale.FIT,
      },
      backgroundColor: '#5c5b5b',
    };

    this.game = new Phaser.Game(gameConfig);

    // add scenes to the game manually so we don't autostart the game
    this.game.scene.add(SceneKeys.GameScene, GameScene);
  }

  public start(): void {
    this.game.scene.start(SceneKeys.GameScene);
  }
}
