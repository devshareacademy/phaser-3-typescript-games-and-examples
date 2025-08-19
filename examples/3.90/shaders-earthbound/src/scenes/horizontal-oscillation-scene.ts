import { HorizontalOscillationPostFxPipeline } from '../shaders/horizontal-oscillation-post-fx-pipeline';
import { BaseScene } from './base-scene';

export class HorizontalOscillationScene extends BaseScene {
  private oscillationPipeline!: HorizontalOscillationPostFxPipeline;

  constructor() {
    super({ key: 'HorizontalOscillationScene' });
  }

  create(): void {
    const renderer = this.renderer as Phaser.Renderer.WebGL.WebGLRenderer;
    if (!renderer.pipelines.get(HorizontalOscillationPostFxPipeline.name)) {
      renderer.pipelines.addPostPipeline(HorizontalOscillationPostFxPipeline.name, HorizontalOscillationPostFxPipeline);
    }

    this.bgImage = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, this.backgroundTextureKey);
    //.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
    this.bgImage.setPostPipeline(HorizontalOscillationPostFxPipeline.name);

    this.oscillationPipeline = this.bgImage.getPostPipeline(
      HorizontalOscillationPostFxPipeline.name,
    ) as HorizontalOscillationPostFxPipeline;

    this.createPane();

    const centerX = this.cameras.main.width / 2;
    const startY = 50;

    this.add
      .text(centerX, startY, 'Horizontal Oscillation', {
        fontSize: '24px',
        fontFamily: '"Arial Black", Gadget, sans-serif',
      })
      .setOrigin(0.5);
  }

  protected createPane(): void {
    super.createPane('Oscillation Controls');

    this.pane.addBinding(this.oscillationPipeline, 'speed', {
      min: 0,
      max: 20,
      step: 1,
      label: 'Speed',
    });

    this.pane.addBinding(this.oscillationPipeline, 'amplitude', {
      min: 0,
      max: 0.1,
      step: 0.001,
      label: 'Amplitude',
    });

    this.pane.addBinding(this.oscillationPipeline, 'frequency', {
      min: 0,
      max: 100,
      step: 1,
      label: 'Frequency',
    });
  }
}
