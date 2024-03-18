import Phaser from 'phaser';
import { WipeFx, NothingFx, TintPostFx, ColorFx, TintFx } from '../shaders';
import GrayScalePipeline from '../GrayScale';
import HueRotatePostFX from '../HueRotatePostFX';
import CustomFx from '../CustomFx';

const IMAGE_ASSET_KEY = 'BG';
const SPRITE_SHEET_ASSET_KEY = 'CHARACTERS';

export class BasicScene extends Phaser.Scene {
  constructor() {
    super({ key: BasicScene.name });
  }

  preload(): void {
    // load in data
    this.load.image(IMAGE_ASSET_KEY, 'assets/images/bg.png');
    this.load.spritesheet(SPRITE_SHEET_ASSET_KEY, 'assets/images/custom.png', {
      frameWidth: 64,
      frameHeight: 88,
    });
  }

  create(): void {
    // Create game objects
    const bg = this.add.image(0, 0, IMAGE_ASSET_KEY).setOrigin(0);
    this.add.image(487, 310, SPRITE_SHEET_ASSET_KEY, 7);

    // create pipeline
    // just renders out the existing texture
    const fx = new NothingFx(this.game);
    // just renders out a basic color
    // const fx = new ColorFx(this.game);
    // renders out grey tint object
    // const fx = new TintFx(this.game);

    // const fx = new GrayScalePipeline(this.game);
    (this.renderer as Phaser.Renderer.WebGL.WebGLRenderer).pipelines.add('SpecialFx', fx);

    // apply to game object
    //const fx = (this.renderer as Phaser.Renderer.WebGL.WebGLRenderer).pipelines.get('TintFx');
    bg.setPipeline(fx);

    // example for adding post-fx pipeline
    // (this.renderer as Phaser.Renderer.WebGL.WebGLRenderer).pipelines.addPostPipeline('TintPostFx', TintPostFx);
    // this.cameras.main.setPostPipeline(TintPostFx);

    // (this.renderer as Phaser.Renderer.WebGL.WebGLRenderer).pipelines.addPostPipeline('CustomFx', CustomFx);
    // this.cameras.main.setPostPipeline(CustomFx);

    (this.renderer as Phaser.Renderer.WebGL.WebGLRenderer).pipelines.addPostPipeline(
      'HueRotatePostFX',
      HueRotatePostFX,
    );
    this.cameras.main.setPostPipeline(HueRotatePostFX);

    // example for passing a variable
    //(this.renderer as Phaser.Renderer.WebGL.WebGLRenderer).pipelines.addPostPipeline('WipePostFx', WipeFx);
    // this.cameras.main.setPostPipeline('WipePostFx');
    // this.tweens.add({
    //   targets: this.cameras.main.getPostPipeline('WipePostFx'),
    //   progress: 1,
    //   duration: 2000,
    // });

    // Notes: for examples, we can show how camera works with 2 post affects above and we can manually set
    // progress value in the wipfx class. Finally, show how tween can create the transition.

    // for 1 last example, we can show how to load a glsl file, and create basic shader from that
    // for this, we can place in a new file
  }
}
