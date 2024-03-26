import Phaser from 'phaser';
import { ColorPostFxPipeline } from '../shaders/color-post-fx-pipeline';

const IMAGE_ASSET_KEY = 'BG';

export class ColorPostFxScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ColorPostFxScene' });
  }

  preload(): void {
    // load in data
    this.load.image(IMAGE_ASSET_KEY, 'assets/images/bg.png');
  }

  create(): void {
    // Create game objects
    this.add.image(0, 0, IMAGE_ASSET_KEY).setOrigin(0);

    // example for adding post-fx pipeline
    // add the pipeline to our renderer
    (this.renderer as Phaser.Renderer.WebGL.WebGLRenderer).pipelines.addPostPipeline(
      'ColorPostFxPipeline',
      ColorPostFxPipeline,
    );
    // update camera to use post pipeline
    this.cameras.main.setPostPipeline(ColorPostFxPipeline);

    this.input.keyboard?.once('keydown-SPACE', () => {
      this.scene.start('GreyScalePostFxScene');
    });
  }
}
