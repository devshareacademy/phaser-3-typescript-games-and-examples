import Phaser from 'phaser';
import { Pane } from 'tweakpane';
import { WipeFx, NothingFx, TintFx, TintPostFx } from './shaders';

const IMAGE_ASSET_KEY = 'BG';

class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' });
  }

  preload(): void {
    // load in data
    this.load.image(IMAGE_ASSET_KEY, 'assets/images/bg.png');

    // example for loading glsl files
    this.load.glsl('fireball', 'assets/shaders/shader0.frag');
    this.load.glsl('wipe', 'assets/shaders/wipe.frag');
  }

  create(): void {
    // Create game objects
    const bg = this.add.image(0, 0, IMAGE_ASSET_KEY).setOrigin(0);

    // example for adding pre-fx pipeline
    // const fx = new WipeFx(this.game);
    // const tintFx = new TintFx(game);
    // (this.renderer as Phaser.Renderer.WebGL.WebGLRenderer).pipelines.add('WipePreFx', fx);
    // (this.renderer as Phaser.Renderer.WebGL.WebGLRenderer).pipelines.add('TintFx', tintFx);
    // // bg.setPipeline(fx);
    // // this.tweens.add({
    // //   targets: fx,
    // //   progress: 1,
    // //   duration: 2000,
    // // });
    // bg.setPipeline(tintFx);

    // example for adding post-fx pipeline
    (this.renderer as Phaser.Renderer.WebGL.WebGLRenderer).pipelines.addPostPipeline('TintPostFx', TintPostFx);
    this.cameras.main.setPostPipeline('TintPostFx');

    //(this.renderer as Phaser.Renderer.WebGL.WebGLRenderer).pipelines.addPostPipeline('WipePostFx', WipeFx);
    //this.cameras.main.setPostPipeline('WipePostFx');
    // this.tweens.add({
    //   targets: this.cameras.main.getPostPipeline('WipePostFx'),
    //   progress: 1,
    //   duration: 2000,
    // });

    // tweakpane
    const pane = new Pane();
  }
}

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
  scene: [Game],
};

const game = new Phaser.Game(gameConfig);
