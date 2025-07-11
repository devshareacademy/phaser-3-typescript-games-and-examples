import Phaser from 'phaser';
import { Pane } from 'tweakpane';
import { NoisePostFxPipeline } from '../shaders/noise-post-fx-pipeline';

const IMAGE_ASSET_KEY = 'BG';
const SHADER_ASSET_KEY = 'NOISE';

export class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
  }

  preload(): void {
    // load in data
    this.load.image(IMAGE_ASSET_KEY, 'assets/images/bg.png');
    this.load.image(SHADER_ASSET_KEY, 'assets/images/shader/noise.png');
  }

  create(): void {
    // Create game objects
    this.add.image(0, 0, IMAGE_ASSET_KEY).setOrigin(0);

    // example for adding post-fx pipeline
    // add the pipeline to our renderer & update camera to use post pipeline
    (this.renderer as Phaser.Renderer.WebGL.WebGLRenderer).pipelines.addPostPipeline(
      NoisePostFxPipeline.name,
      NoisePostFxPipeline,
    );
    this.cameras.main.setPostPipeline(NoisePostFxPipeline);

    this.#createPane();
  }

  #createPane(): void {
    const pane = new Pane();

    pane.addBinding(this.cameras.main.getPostPipeline(NoisePostFxPipeline) as NoisePostFxPipeline, 'scale', {
      min: 0.1,
      max: 10.0,
    });
    pane.addBinding(this.cameras.main.getPostPipeline(NoisePostFxPipeline) as NoisePostFxPipeline, 'blend', {
      min: 0.0,
      max: 1.0,
    });
  }
}
