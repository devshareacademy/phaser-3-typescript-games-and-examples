import * as Phaser from 'phaser';
import { CompositeShaderPostFxPipeline } from '../shaders/composite-shader-post-fx-pipeline';

export class CompositeScene extends Phaser.Scene {
  private rt1!: Phaser.GameObjects.RenderTexture;
  private rt2!: Phaser.GameObjects.RenderTexture;
  private pipelineInstance!: CompositeShaderPostFxPipeline;

  constructor() {
    super('CompositeScene');
  }

  preload() {
    this.load.image('logo', 'assets/images/shader/004.png');
    this.load.image('bg', 'assets/images/shader/045.png');
  }

  create() {
    const renderer = this.renderer as Phaser.Renderer.WebGL.WebGLRenderer;
    if (!renderer.pipelines.get(CompositeShaderPostFxPipeline.name)) {
      renderer.pipelines.addPostPipeline(CompositeShaderPostFxPipeline.name, CompositeShaderPostFxPipeline);
    }
    console.log('hit');
    this.rt1 = this.add.renderTexture(0, 0, this.scale.width, this.scale.height).setOrigin(0);
    this.rt2 = this.add.renderTexture(0, 0, this.scale.width, this.scale.height).setOrigin(0);

    this.rt1.draw('bg', 0, 0);
    this.rt2.draw('logo', 0, 0);

    this.cameras.main.setPostPipeline(CompositeShaderPostFxPipeline.name);
    this.pipelineInstance = this.cameras.main.getPostPipeline(
      CompositeShaderPostFxPipeline.name,
    ) as CompositeShaderPostFxPipeline;

    this.pipelineInstance.textureLayer1 = this.rt1.texture.source[0].glTexture;
    this.pipelineInstance.textureLayer2 = this.rt2.texture.source[0].glTexture;
  }
}
