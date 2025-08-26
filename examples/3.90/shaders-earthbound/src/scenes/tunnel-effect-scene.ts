import { TunnelEffectPostFxPipeline } from '../shaders/tunnel-effect-post-fx-pipeline';
import { BaseScene } from './base-scene';

const TUNNEL_BG_ASSET = 'TUNNEL_BG_ASSET';

export class TunnelEffectScene extends BaseScene {
  private tunnelPipeline!: TunnelEffectPostFxPipeline | Phaser.Renderer.WebGL.Pipelines.PostFXPipeline[];

  constructor() {
    super({ key: 'TunnelEffectScene' });
  }

  preload(): void {
    this.load.image(TUNNEL_BG_ASSET, 'assets/images/shader/tunnel/tunnel.png');
  }

  create(): void {
    const renderer = this.renderer as Phaser.Renderer.WebGL.WebGLRenderer;
    if (!renderer.pipelines.get(TunnelEffectPostFxPipeline.name)) {
      renderer.pipelines.addPostPipeline(TunnelEffectPostFxPipeline.name, TunnelEffectPostFxPipeline);
    }

    this.bgImage = this.add
      .image(this.cameras.main.width / 2, this.cameras.main.height / 2 + 20, TUNNEL_BG_ASSET)
      .setScale(2);
    this.bgImage.setPostPipeline(TunnelEffectPostFxPipeline.name);
    this.tunnelPipeline = this.bgImage.getPostPipeline(TunnelEffectPostFxPipeline.name) as TunnelEffectPostFxPipeline;

    this.createPane();

    this.add
      .text(this.cameras.main.width / 2, 50, 'Tunnel Effect', {
        fontSize: '24px',
        fontFamily: '"Arial Black", Gadget, sans-serif',
      })
      .setOrigin(0.5);
  }

  protected createPane(): void {
    super.createPane('Tunnel Controls');

    if (!this.tunnelPipeline || Array.isArray(this.tunnelPipeline)) {
      return;
    }

    this.pane.addBinding(this.tunnelPipeline, 'spin', {
      min: -1,
      max: 1,
      step: 0.01,
      label: 'Spin',
    });

    this.pane.addBinding(this.tunnelPipeline, 'speed', {
      min: -1,
      max: 1,
      step: 0.01,
      label: 'Speed',
    });
  }
}
