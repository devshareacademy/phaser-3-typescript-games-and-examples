import Phaser from 'phaser';
import { DynamicColorPostFxPipeline } from '../shaders/dynamic-color-post-fx-pipeline';

const IMAGE_ASSET_KEY = 'BG';

export class DynamicColorPostFxScene extends Phaser.Scene {
  constructor() {
    super({ key: 'DynamicColorPostFxScene' });
  }

  preload(): void {
    // load in data
    this.load.image(IMAGE_ASSET_KEY, 'https://devshareacademy.github.io/cdn/images/asset-packs/monster-tamer/misc/background.png');
  }

  create(): void {
    // Create game objects
    this.add.image(0, 0, IMAGE_ASSET_KEY).setOrigin(0);

    // example for adding post-fx pipeline
    // add the pipeline to our renderer
    (this.renderer as Phaser.Renderer.WebGL.WebGLRenderer).pipelines.addPostPipeline(
      'DynamicColorPostFxPipeline',
      DynamicColorPostFxPipeline,
    );
    // update camera to use post pipeline
    this.cameras.main.setPostPipeline(DynamicColorPostFxPipeline);

    this.tweens.add({
      targets: this.cameras.main.getPostPipeline(DynamicColorPostFxPipeline),
      progress: 1,
      duration: 2000,
      delay: 1000,
      repeat: -1,
      yoyo: true,
    });

    this.input.keyboard?.once('keydown-SPACE', () => {
      this.scene.start('WipePostFxScene');
    });
  }
}
