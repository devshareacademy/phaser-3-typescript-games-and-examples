import Phaser from 'phaser';
import { NothingPostFxScene } from './scenes/nothing-post-fx-scene';
import { ColorPostFxScene } from './scenes/color-post-fx-scene';
import { GreyScalePostFxScene } from './scenes/grey-scale-post-fx-scene';
import { WipePostFxScene } from './scenes/wipe-post-fx-scene';
import { BuiltInFxScene } from './scenes/built-in-fx-scene';

const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  pixelArt: true,
  scale: {
    parent: 'game-container',
    width: 1024,
    height: 576,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  backgroundColor: '#5c5b5b',
};

const game = new Phaser.Game(gameConfig);
game.scene.add(NothingPostFxScene.name, NothingPostFxScene);
game.scene.add(ColorPostFxScene.name, ColorPostFxScene);
game.scene.add(GreyScalePostFxScene.name, GreyScalePostFxScene);
game.scene.add(WipePostFxScene.name, WipePostFxScene);
game.scene.add(BuiltInFxScene.name, BuiltInFxScene);
game.scene.start(NothingPostFxScene.name);
