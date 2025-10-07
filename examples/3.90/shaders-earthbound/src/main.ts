import Phaser from 'phaser';
import { ConcaveDistortionScene } from './scenes/concave-distortion-scene';
import { VerticalOscillationScene } from './scenes/vertical-oscillation-scene';
import { HorizontalOscillationScene } from './scenes/horizontal-oscillation-scene';
import { InterleavedOscillationScene } from './scenes/interleaved-oscillation-scene';
import { UbershaderScene } from './scenes/ubershader-scene';
import { MainScene } from './scenes/main-scene';
import { ScrollingScene } from './scenes/scrolling-scene';
import { LoadingScene } from './scenes/loading-scene';
import { BattleScene } from './scenes/battle-scene';
import { LightningScene } from './scenes/lightning-scene';
import { TorchScene } from './scenes/torch-scene';
import { MarvelSnapScene } from './scenes/marvel-snap-scene';
import { FunScene } from './scenes/fun-scene';
// import { TunnelEffectScene } from './scenes/tunnel-effect-scene';

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
game.scene.add('LoadingScene', LoadingScene);
game.scene.add('MainScene', MainScene);
game.scene.add('ScrollingScene', ScrollingScene);
game.scene.add('HorizontalOscillationScene', HorizontalOscillationScene);
game.scene.add('VerticalOscillationScene', VerticalOscillationScene);
game.scene.add('InterleavedOscillationScene', InterleavedOscillationScene);
game.scene.add('ConcaveDistortionScene', ConcaveDistortionScene);
game.scene.add('UbershaderScene', UbershaderScene);
game.scene.add('BattleScene', BattleScene);
game.scene.add('LightningScene', LightningScene);
// game.scene.add('TunnelEffectScene', TunnelEffectScene);
game.scene.add('TorchScene', TorchScene);
game.scene.add('MarvelSnapScene', MarvelSnapScene);
game.scene.add('FunScene', FunScene);
game.scene.start('LoadingScene');
