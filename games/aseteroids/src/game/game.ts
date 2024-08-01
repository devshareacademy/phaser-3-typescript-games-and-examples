import * as Phaser from 'phaser';
import PreloadScene from './scenes/preload-scene';
import GameScene from './scenes/game-scene';
import { SceneKeys } from './scenes/scene-keys';

export default class Game {
  private readonly game: Phaser.Game;

  constructor() {
    const gameConfig: Phaser.Types.Core.GameConfig = {
      type: Phaser.CANVAS,
      pixelArt: true,
      scale: {
        parent: 'game-container',
        width: 640,
        height: 480,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        mode: Phaser.Scale.FIT,
      },
      backgroundColor: '#000000',
      physics: {
        arcade: {
          gravity: {
            x: 0,
            y: 0,
          },
          debug: true,
        },
        default: 'arcade',
      },
    };

    this.game = new Phaser.Game(gameConfig);

    // add scenes to the game manually so we don't autostart the game
    this.game.scene.add(SceneKeys.PreloadScene, PreloadScene);
    this.game.scene.add(SceneKeys.GameScene, GameScene);
  }

  public start(): void {
    this.game.scene.start(SceneKeys.PreloadScene);
  }
}
