import { InterleavedOscillationPostFxPipeline } from '../shaders/interleaved-oscillation-post-fx-pipeline';
import { BaseScene } from './base-scene';

export class InterleavedOscillationScene extends BaseScene {
  private oscillationPipeline!: InterleavedOscillationPostFxPipeline;

  constructor() {
    super({ key: 'InterleavedOscillationScene' });
  }

  create(): void {
    const renderer = this.renderer as Phaser.Renderer.WebGL.WebGLRenderer;
    if (!renderer.pipelines.get(InterleavedOscillationPostFxPipeline.name)) {
      renderer.pipelines.addPostPipeline(
        InterleavedOscillationPostFxPipeline.name,
        InterleavedOscillationPostFxPipeline,
      );
    }

    this.bgImage = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, this.backgroundTextureKey);
    this.bgImage.setPostPipeline(InterleavedOscillationPostFxPipeline.name);

    this.oscillationPipeline = this.bgImage.getPostPipeline(
      InterleavedOscillationPostFxPipeline.name,
    ) as InterleavedOscillationPostFxPipeline;

    this.createPane();

    const centerX = this.cameras.main.width / 2;
    const startY = 50;

    this.add
      .text(centerX, startY, 'Interleaved Oscillation', {
        fontSize: '24px',
        fontFamily: '"Arial Black", Gadget, sans-serif',
      })
      .setOrigin(0.5);
  }

  protected createPane(): void {
    super.createPane('Interleaved Oscillation Controls');

    const hFolder = this.pane.addFolder({ title: 'Horizontal Wave' });
    hFolder.addBinding(this.oscillationPipeline, 'speedX', {
      min: 0,
      max: 20,
      step: 1,
      label: 'Speed',
    });
    hFolder.addBinding(this.oscillationPipeline, 'amplitudeX', {
      min: 0,
      max: 0.1,
      step: 0.001,
      label: 'Amplitude',
    });
    hFolder.addBinding(this.oscillationPipeline, 'frequencyX', {
      min: 0,
      max: 100,
      step: 1,
      label: 'Frequency',
    });

    const vFolder = this.pane.addFolder({ title: 'Vertical Wave' });
    vFolder.addBinding(this.oscillationPipeline, 'speedY', {
      min: 0,
      max: 20,
      step: 1,
      label: 'Speed',
    });
    vFolder.addBinding(this.oscillationPipeline, 'amplitudeY', {
      min: 0,
      max: 0.1,
      step: 0.001,
      label: 'Amplitude',
    });
    vFolder.addBinding(this.oscillationPipeline, 'frequencyY', {
      min: 0,
      max: 100,
      step: 1,
      label: 'Frequency',
    });
  }
}
