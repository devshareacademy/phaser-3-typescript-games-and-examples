import { ConcaveDistortionPostFxPipeline } from '../shaders/concave-distortion-post-fx-pipeline';
import { BaseScene } from './base-scene';

const TUNNEL_BG_ASSET = 'TUNNEL_BG_ASSET';

export class ConcaveDistortionScene extends BaseScene {
  private pipeline!: ConcaveDistortionPostFxPipeline;

  constructor() {
    super({ key: 'ConcaveDistortionScene' });
  }

  preload(): void {
    this.load.image(TUNNEL_BG_ASSET, 'assets/images/shader/original.png');
  }

  create(): void {
    const renderer = this.renderer as Phaser.Renderer.WebGL.WebGLRenderer;
    if (!renderer.pipelines.get(ConcaveDistortionPostFxPipeline.name)) {
      renderer.pipelines.addPostPipeline(ConcaveDistortionPostFxPipeline.name, ConcaveDistortionPostFxPipeline);
    }

    this.bgImage = this.add
      .image(this.cameras.main.width / 2, this.cameras.main.height / 2, TUNNEL_BG_ASSET)
      .setDisplaySize(this.cameras.main.width, this.cameras.main.height);

    this.bgImage.setPostPipeline(ConcaveDistortionPostFxPipeline.name);

    this.pipeline = this.bgImage.getPostPipeline(
      ConcaveDistortionPostFxPipeline.name,
    ) as ConcaveDistortionPostFxPipeline;

    this.createPane();

    this.add
      .text(this.cameras.main.width / 2, 50, 'Concave Distortion', {
        fontSize: '24px',
        fontFamily: '"Arial Black", Gadget, sans-serif',
      })
      .setOrigin(0.5);
  }

  protected createPane(): void {
    super.createPane('Concave Distortion Controls');

    this.pane.addBinding(this.pipeline, 'strength', {
      min: 0,
      max: 5,
      step: 0.01,
      label: 'Strength',
    });

    this.pane.addBinding(this.pipeline, 'scrollSpeed', {
      min: -1,
      max: 1,
      step: 0.01,
      label: 'Scroll Speed',
    });

    this.pane.addBinding(this.pipeline, 'curve', {
      min: 1.0,
      max: 5.0,
      step: 0.1,
      label: 'Curve',
    });
  }
}
