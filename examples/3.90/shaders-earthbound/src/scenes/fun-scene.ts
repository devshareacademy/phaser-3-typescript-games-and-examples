import { OutlinePostFxPipeline } from '../shaders/glowing-border-post-fx-pipeline';
import { BaseScene } from './base-scene';

const pipeline = OutlinePostFxPipeline;
type PIPELINE = OutlinePostFxPipeline;

export class FunScene extends BaseScene {
  private buttonPipeline!: PIPELINE;
  private playerPipeline!: PIPELINE;

  constructor() {
    super({ key: 'FunScene' });
  }

  preload(): void {
    this.load.setPath('assets/fun');
    this.load.image('button', 'options.png');
    this.load.spritesheet('player', 'idle.png', { frameWidth: 512, frameHeight: 512 });
  }

  create(): void {
    this.anims.create({
      key: 'idle',
      frameRate: 6,
      frames: this.anims.generateFrameNames('player'),
      repeat: -1,
    });
    // Register the pipeline
    const renderer = this.renderer as Phaser.Renderer.WebGL.WebGLRenderer;
    if (!renderer.pipelines.get(pipeline.name)) {
      renderer.pipelines.addPostPipeline(pipeline.name, pipeline);
    }

    // --- Button Effect ---
    const button = this.add
      .image(this.scale.width / 2, this.scale.height * (3 / 4), 'button')
      .setScale(0.25)
      .setPostPipeline(pipeline.name);

    this.buttonPipeline = button.getPostPipeline(pipeline.name) as PIPELINE;
    this.buttonPipeline.thickness = 4;
    this.buttonPipeline.color = new Phaser.Display.Color(0, 255, 255); // Cyan

    // player effect
    const player = this.add
      .sprite(this.scale.width / 2, this.scale.height / 3, 'player', 0)
      .play('idle')
      .setScale(0.5)
      .setPostPipeline(pipeline.name);

    this.playerPipeline = player.getPostPipeline(pipeline.name) as PIPELINE;
    this.playerPipeline.thickness = 4;
    this.playerPipeline.color = new Phaser.Display.Color(255, 0, 255); // purple
  }
}
