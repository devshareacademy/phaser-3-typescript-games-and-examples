import Phaser from 'phaser';
import { WipePostFxPipeline } from '../shaders/wipe-post-fx-pipeline';

const IMAGE_ASSET_KEY = 'BG';

export class WipePostFxScene extends Phaser.Scene {
  constructor() {
    super({ key: 'WipePostFxScene' });
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
      'WipePostFxPipeline',
      WipePostFxPipeline,
    );
    // update camera to use post pipeline
    this.cameras.main.setPostPipeline(WipePostFxPipeline);

    // example with updating variable
    this.tweens.add({
      targets: this.cameras.main.getPostPipeline(WipePostFxPipeline),
      progress: 1,
      duration: 2000,
      delay: 1000,
    });

    this.input.keyboard?.once('keydown-SPACE', () => {
      this.scene.start('BuiltInFxScene');
    });
  }
}
