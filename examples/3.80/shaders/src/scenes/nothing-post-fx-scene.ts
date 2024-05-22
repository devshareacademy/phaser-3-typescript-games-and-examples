import Phaser from 'phaser';
import { NothingPostFxPipeline } from '../shaders/nothing-post-fx-pipeline';

const IMAGE_ASSET_KEY = 'BG';

export class NothingPostFxScene extends Phaser.Scene {
  constructor() {
    super({ key: 'NothingPostFxScene' });
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
      'NothingPostFxPipeline',
      NothingPostFxPipeline,
    );
    // update camera to use post pipeline
    this.cameras.main.setPostPipeline(NothingPostFxPipeline);

    this.input.keyboard?.once('keydown-SPACE', () => {
      this.scene.start('ColorPostFxScene');
    });
  }
}
