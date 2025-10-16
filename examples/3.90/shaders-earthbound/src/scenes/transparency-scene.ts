/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pane } from 'tweakpane';
import { BackgroundScrollingPostFxPipeline } from '../shaders/background-scrolling-post-fx-pipeline';
import { CompositeShaderPostFxPipeline } from '../shaders/composite-shader-post-fx-pipeline';
import { HorizontalOscillationPostFxPipeline } from '../shaders/horizontal-oscillation-post-fx-pipeline';
import { InterleavedOscillationPostFxPipeline } from '../shaders/interleaved-oscillation-post-fx-pipeline';
import { PaletteCyclePostFxPipeline } from '../shaders/palette-cycle-post-fx-pipeline';
import { VerticalOscillationPostFxPipeline } from '../shaders/vertical-oscillation-post-fx-pipeline';
import { BaseScene } from './base-scene';

export class TransparencyScene extends BaseScene {
  private rt1!: Phaser.GameObjects.RenderTexture;
  private rt2!: Phaser.GameObjects.RenderTexture;
  private finalImage!: Phaser.GameObjects.Rectangle;
  private bgImage1!: Phaser.GameObjects.Image;
  private bgImage2!: Phaser.GameObjects.Image;
  private customPipeline!: CompositeShaderPostFxPipeline;
  private backgroundKeys: string[] = [
    '001.png',
    '002.png',
    '003.png',
    '004.png',
    '014.png',
    '015.png',
    '016.png',
    '020.png',
    '021.png',
    '022.png',
    '023.png',
    '045.png',
  ];
  private pipelineOptions!: { name: string; pipeline: unknown }[];

  constructor() {
    super({ key: 'TransparencyScene' });
  }

  preload(): void {
    this.load.setPath('assets/images/complete');
    this.backgroundKeys.forEach((key) => {
      this.load.image(key, `backgrounds/${key}`);
    });
  }

  create(): void {
    const renderer = this.renderer as Phaser.Renderer.WebGL.WebGLRenderer;
    this.pipelineOptions = [
      { name: 'HorizontalOscillation', pipeline: HorizontalOscillationPostFxPipeline },
      { name: 'VerticalOscillation', pipeline: VerticalOscillationPostFxPipeline },
      { name: 'InterleavedOscillation', pipeline: InterleavedOscillationPostFxPipeline },
      { name: 'BackgroundScrolling', pipeline: BackgroundScrollingPostFxPipeline },
    ];

    this.pipelineOptions.forEach(({ name, pipeline }) => {
      if (!renderer.pipelines.get(name)) {
        renderer.pipelines.addPostPipeline(name, pipeline as () => undefined);
      }
    });

    if (!renderer.pipelines.get(PaletteCyclePostFxPipeline.name)) {
      renderer.pipelines.addPostPipeline(PaletteCyclePostFxPipeline.name, PaletteCyclePostFxPipeline);
    }
    if (!renderer.pipelines.get(CompositeShaderPostFxPipeline.name)) {
      renderer.pipelines.addPostPipeline(CompositeShaderPostFxPipeline.name, CompositeShaderPostFxPipeline);
    }

    // create background images needed for the render textures
    this.bgImage1 = this.add
      .image(0, 0, this.backgroundKeys[3])
      .setOrigin(0)
      .setDisplaySize(this.scale.width, this.scale.height);

    this.bgImage2 = this.add
      .image(0, 0, this.backgroundKeys[11])
      .setOrigin(0)
      .setDisplaySize(this.scale.width, this.scale.height);

    // hide the original images
    this.bgImage1.setVisible(false);
    this.bgImage2.setVisible(false);

    // --- Create Render Textures for offscreen buffers ---
    this.rt1 = this.add.renderTexture(0, 0, this.scale.width, this.scale.height).setOrigin(0).setVisible(false);
    this.rt2 = this.add.renderTexture(0, 0, this.scale.width, this.scale.height).setOrigin(0).setVisible(false);

    // --- Final image using composite shader ---
    this.finalImage = this.add.rectangle(0, 0, this.scale.width, this.scale.height).setOrigin(0);
    this.finalImage.setPostPipeline(CompositeShaderPostFxPipeline.name);
    this.customPipeline = this.finalImage.getPostPipeline(
      CompositeShaderPostFxPipeline.name,
    ) as CompositeShaderPostFxPipeline;

    this.#createPane();
  }

  public update(): void {
    // Clear render textures
    this.rt1.clear();
    this.rt2?.clear();

    // Draw background with Oscillation shader into rt1
    this.rt1.draw(this.bgImage1);

    // Draw background with Palette shader into rt2
    this.rt2?.draw(this.bgImage2);

    // update custom pipeline
    if (this.rt1.texture.source[0].glTexture && this.rt2.texture.source[0].glTexture) {
      this.customPipeline.textureLayer1 = this.rt1.texture.source[0].glTexture;
      this.customPipeline.textureLayer2 = this.rt2.texture.source[0].glTexture;
    }
  }

  #createPane() {
    this.pane = new Pane({ title: 'Battle Scene Controls' });

    const params = {
      bg1: this.backgroundKeys[3],
      bg2: this.backgroundKeys[11],
    };

    const bgOptions = this.backgroundKeys.map((key) => ({ text: key, value: key }));

    const bg1Folder = this.pane.addFolder({ title: 'Background 1' });
    bg1Folder.addBinding(params, 'bg1', { label: 'Texture', options: bgOptions }).on('change', (ev) => {
      this.bgImage1.setTexture(ev.value);
    });

    const bg2Folder = this.pane.addFolder({ title: 'Background 2' });
    bg2Folder.addBinding(params, 'bg2', { label: 'Texture', options: bgOptions }).on('change', (ev) => {
      this.bgImage2.setTexture(ev.value);
    });

    const compositeFolder = this.pane.addFolder({ title: 'Composite Shader' });
    compositeFolder.addBinding(this.customPipeline, 'alpha', { min: 0, max: 1, step: 0.01 });
  }
}
