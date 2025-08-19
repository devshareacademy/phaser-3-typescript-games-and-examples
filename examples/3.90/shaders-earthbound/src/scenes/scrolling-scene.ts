import { BackgroundScrollingPostFxPipeline } from '../shaders/background-scrolling-post-fx-pipeline';
import { BaseScene } from './base-scene';

export class ScrollingScene extends BaseScene {
  private scrollingPipeline!: BackgroundScrollingPostFxPipeline;

  constructor() {
    super({ key: 'ScrollingScene' });
  }

  create(): void {
    const renderer = this.renderer as Phaser.Renderer.WebGL.WebGLRenderer;
    if (!renderer.pipelines.get(BackgroundScrollingPostFxPipeline.name)) {
      renderer.pipelines.addPostPipeline(BackgroundScrollingPostFxPipeline.name, BackgroundScrollingPostFxPipeline);
    }

    this.bgImage = this.add
      .image(this.cameras.main.width / 2, this.cameras.main.height / 2, this.backgroundTextureKey)
      .setDisplaySize(this.cameras.main.width, this.cameras.main.height);
    this.bgImage.setPostPipeline(BackgroundScrollingPostFxPipeline.name);

    this.scrollingPipeline = this.bgImage.getPostPipeline(
      BackgroundScrollingPostFxPipeline.name,
    ) as BackgroundScrollingPostFxPipeline;

    this.createPane();

    const centerX = this.cameras.main.width / 2;
    const startY = 50;

    this.add
      .text(centerX, startY, 'Background Scrolling', {
        fontSize: '24px',
        fontFamily: '"Arial Black", Gadget, sans-serif',
      })
      .setOrigin(0.5);
  }

  protected createPane(): void {
    super.createPane('Scrolling Controls');

    this.pane.addBinding(this.scrollingPipeline.speed, 'x', {
      min: -0.5,
      max: 0.5,
      step: 0.01,
      label: 'Speed X',
    });

    this.pane.addBinding(this.scrollingPipeline.speed, 'y', {
      min: -0.5,
      max: 0.5,
      step: 0.01,
      label: 'Speed Y',
    });
  }
}
