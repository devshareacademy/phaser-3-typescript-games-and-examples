import Phaser from 'phaser';
import { LoadingScene } from './scenes/loading-scene';
import { SCENE_KEYS } from './common';
import { PaletteCyclingScene } from './scenes/palette-cycling-scene';

const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  pixelArt: false,
  scale: {
    parent: 'game-container',
    width: 800,
    height: 600,
    zoom: 1,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  backgroundColor: '#5c5b5b',
};

const game = new Phaser.Game(gameConfig);
game.scene.add(SCENE_KEYS.LOADING_SCENE, LoadingScene);
game.scene.add(SCENE_KEYS.PALETTE_CYCLING_SCENE, PaletteCyclingScene);
game.scene.start(SCENE_KEYS.LOADING_SCENE);
