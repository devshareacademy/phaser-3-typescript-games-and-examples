import { VerticalOscillationPostFxPipeline } from '../shaders/vertical-oscillation-post-fx-pipeline';
import { BaseScene } from './base-scene';

export class VerticalOscillationScene extends BaseScene {
  private oscillationPipeline!: VerticalOscillationPostFxPipeline;

  constructor() {
    super({ key: 'VerticalOscillationScene' });
  }

  create(): void {
    const renderer = this.renderer as Phaser.Renderer.WebGL.WebGLRenderer;
    if (!renderer.pipelines.get(VerticalOscillationPostFxPipeline.name)) {
      renderer.pipelines.addPostPipeline(VerticalOscillationPostFxPipeline.name, VerticalOscillationPostFxPipeline);
    }

    this.bgImage = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, this.backgroundTextureKey);
    //.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
    this.bgImage.setPostPipeline(VerticalOscillationPostFxPipeline.name);

    this.oscillationPipeline = this.bgImage.getPostPipeline(
      VerticalOscillationPostFxPipeline.name,
    ) as VerticalOscillationPostFxPipeline;

    this.createPane();

    this.add
      .text(this.cameras.main.width / 2, 50, 'Vertical Oscillation', {
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
