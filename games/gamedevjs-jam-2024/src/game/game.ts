import Phaser from 'phaser';
import OutlinePipelinePlugin from 'phaser3-rex-plugins/plugins/outlinepipeline-plugin.js';
import GameScene from './scenes/game-scene';
import { SceneKeys } from './scenes/scene-keys';
import PreloadScene from './scenes/preload-scene';
import BootScene from './scenes/boot-scene';
import TitleScene from './scenes/title-scene';
import { CreditsScene } from './scenes/credits-scene';

export default class Game {
  private readonly game: Phaser.Game;

  constructor() {
    const gameConfig: Phaser.Types.Core.GameConfig = {
      type: Phaser.WEBGL,
      pixelArt: true,
      scale: {
        parent: 'game-container',
        width: 512,
        height: 288,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        mode: Phaser.Scale.FIT,
      },
      mipmapFilter: 'LINEAR_MIPMAP_LINEAR',
      backgroundColor: '#5c5b5b',
      physics: {
        default: 'arcade',
        arcade: {
          debug: false,
          gravity: {
            y: 800,
          },
        },
      },
      fx: {
        glow: {
          distance: 6,
          quality: 0.1,
        },
      },
      plugins: {
        global: [
          {
            key: 'rexOutlinePipeline',
            plugin: OutlinePipelinePlugin,
            start: true,
          },
        ],
      },
    };

    this.game = new Phaser.Game(gameConfig);

    // add scenes to the game manually so we don't autostart the game
    this.game.scene.add(SceneKeys.BootScene, BootScene);
    this.game.scene.add(SceneKeys.PreloadScene, PreloadScene);
    this.game.scene.add(SceneKeys.TitleScene, TitleScene);
    this.game.scene.add(SceneKeys.GameScene, GameScene);
    this.game.scene.add(SceneKeys.CreditsScene, CreditsScene);
  }

  public start(): void {
    this.game.scene.start(SceneKeys.BootScene);
  }
}
