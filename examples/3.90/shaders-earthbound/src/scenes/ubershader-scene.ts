import { BaseScene } from './base-scene';
import { UbershaderPostFxPipeline, UbershaderEffect } from '../shaders/transparency-ubershader-post-fx-pipeline';
import { ASSETS } from '../assets';

const SETTINGS = {
  textureB: 'indexed_radial',
};

export class UbershaderScene extends BaseScene {
  private pipeline!: UbershaderPostFxPipeline;

  constructor() {
    super({ key: 'UbershaderScene' });
  }

  create(): void {
    const renderer = this.renderer as Phaser.Renderer.WebGL.WebGLRenderer;
    if (!renderer.pipelines.get(UbershaderPostFxPipeline.name)) {
      renderer.pipelines.addPostPipeline(UbershaderPostFxPipeline.name, UbershaderPostFxPipeline);
    }

    this.bgImage = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, this.backgroundTextureKey);
    this.bgImage.setPostPipeline(UbershaderPostFxPipeline.name);

    this.pipeline = this.bgImage.getPostPipeline(UbershaderPostFxPipeline.name) as UbershaderPostFxPipeline;
    this.pipeline.setSecondaryTexture(SETTINGS.textureB);

    this.createPane();

    this.add
      .text(this.cameras.main.width / 2, 50, 'Ubershader Layering', {
        fontSize: '24px',
        fontFamily: '"Arial Black", Gadget, sans-serif',
      })
      .setOrigin(0.5);
  }

  protected createPane(): void {
    super.createPane('Ubershader Controls');

    // --- GLOBAL CONTROLS ---
    this.pane.addBinding(this.pipeline, 'alpha', { min: 0, max: 1, step: 0.01, label: 'Blend Alpha' });

    this.pane
      .addBinding(SETTINGS, 'textureB', {
        view: 'list',
        label: 'Texture B (BG)',
        options: Object.keys(ASSETS.indexed).map((key) => ({ text: key, value: key })),
      })
      .on('change', (ev) => {
        this.pipeline.setSecondaryTexture(ev.value);
      });

    const effectOptions = Object.keys(UbershaderEffect)
      .filter((v) => isNaN(Number(v)))
      .map((key, index) => ({ text: key, value: index }));

    // --- LAYER A CONTROLS ---
    const folderA = this.pane.addFolder({ title: 'Layer A (Foreground)' });
    folderA.addBinding(this.pipeline, 'effectA', { view: 'list', label: 'Effect', options: effectOptions });
    folderA.addBinding(this.pipeline.paramsA, 'x', { label: 'Speed X', min: 0, max: 20, step: 1 });
    folderA.addBinding(this.pipeline.paramsA, 'y', { label: 'Amplitude X', min: 0, max: 0.1, step: 0.001 });
    folderA.addBinding(this.pipeline.paramsA, 'z', { label: 'Frequency X', min: 0, max: 100, step: 1 });
    folderA.addBinding(this.pipeline.paramsA, 'w', { label: 'Speed Y', min: 0, max: 20, step: 1 });
    folderA.addBinding(this.pipeline.paramsA2, 'x', { label: 'Amplitude Y', min: 0, max: 0.1, step: 0.001 });
    folderA.addBinding(this.pipeline.paramsA2, 'y', { label: 'Frequency Y', min: 0, max: 100, step: 1 });

    // --- LAYER B CONTROLS ---
    const folderB = this.pane.addFolder({ title: 'Layer B (Background)' });
    folderB.addBinding(this.pipeline, 'effectB', { view: 'list', label: 'Effect', options: effectOptions });
    folderB.addBinding(this.pipeline.paramsB, 'x', { label: 'Speed X', min: 0, max: 20, step: 1 });
    folderB.addBinding(this.pipeline.paramsB, 'y', { label: 'Amplitude X', min: 0, max: 0.1, step: 0.001 });
    folderB.addBinding(this.pipeline.paramsB, 'z', { label: 'Frequency X', min: 0, max: 100, step: 1 });
    folderB.addBinding(this.pipeline.paramsB, 'w', { label: 'Speed Y', min: 0, max: 20, step: 1 });
    folderB.addBinding(this.pipeline.paramsB2, 'x', { label: 'Amplitude Y', min: 0, max: 0.1, step: 0.001 });
    folderB.addBinding(this.pipeline.paramsB2, 'y', { label: 'Frequency Y', min: 0, max: 100, step: 1 });
  }
}
