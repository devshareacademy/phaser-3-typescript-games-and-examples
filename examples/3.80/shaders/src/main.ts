import Phaser from 'phaser';
import { NothingPostFxScene } from './scenes/nothing-post-fx-scene';
import { ColorPostFxScene } from './scenes/color-post-fx-scene';
import { GreyScalePostFxScene } from './scenes/grey-scale-post-fx-scene';
import { WipePostFxScene } from './scenes/wipe-post-fx-scene';
import { BuiltInFxScene } from './scenes/built-in-fx-scene';
import { DynamicColorPostFxScene } from './scenes/dynamic-color-post-fx-scene';

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
game.scene.add('NothingPostFxScene', NothingPostFxScene);
game.scene.add('ColorPostFxScene', ColorPostFxScene);
game.scene.add('GreyScalePostFxScene', GreyScalePostFxScene);
game.scene.add('DynamicColorPostFxScene', DynamicColorPostFxScene);
game.scene.add('WipePostFxScene', WipePostFxScene);
game.scene.add('BuiltInFxScene', BuiltInFxScene);
game.scene.start('DynamicColorPostFxScene');
