import { LightningPostFxPipeline } from '../shaders/lightning-post-fx-pipeline';
import { BaseScene } from './base-scene';

export class LightningScene extends BaseScene {
  constructor() {
    super('LightningScene');
  }

  create() {
    const renderer = this.renderer as Phaser.Renderer.WebGL.WebGLRenderer;
    if (!renderer.pipelines.get(LightningPostFxPipeline.name)) {
      renderer.pipelines.addPostPipeline(LightningPostFxPipeline.name, LightningPostFxPipeline);
    }
    const { width, height } = this.cameras.main;

    // Create two rectangle objects to apply the shader to
    const boltRect1 = this.add.rectangle(width / 2, height / 2, width, height).setAlpha(0.001);
    const boltRect2 = this.add.rectangle(width / 2, height / 2, width, height).setAlpha(0.001);

    boltRect1.setPostPipeline(LightningPostFxPipeline.name);
    const pipeline1 = boltRect1.getPostPipeline(LightningPostFxPipeline.name) as LightningPostFxPipeline;
    boltRect2.setPostPipeline(LightningPostFxPipeline.name);
    const pipeline2 = boltRect2.getPostPipeline(LightningPostFxPipeline.name) as LightningPostFxPipeline;

    // Set initial properties for the second bolt to make it different
    pipeline2.x = 0.49;
    // {r: 0.29, g: 0.15, b: 0.01, a: 0.24}
    pipeline2.lightningColor.set(0.29, 0.15, 0.01, 0.24);
    pipeline2.width = 0.05;
    pipeline2.cycle = 6;

    this.createPane('Lightning Shader Controls');

    // --- Bolt 1 Controls ---
    const folder1 = this.pane.addFolder({ title: 'Bolt 1' });
    folder1.addBinding(pipeline1, 'x', { min: 0, max: 1, step: 0.01, label: 'position' });
    folder1.addBinding(pipeline1, 'size', { min: 0, max: 0.1, step: 0.001 });
    folder1.addBinding(pipeline1, 'width', { min: 0, max: 0.1, step: 0.01 });
    folder1.addBinding(pipeline1, 'speed', { min: 0, max: 2, step: 0.1 });
    folder1.addBinding(pipeline1, 'cycle', { min: 0, max: 20, step: 1 });
    folder1.addBinding(pipeline1, 'ratio', { min: 0, max: 2, step: 0.01 });
    folder1.addBinding(pipeline1, 'timeShift', { min: 0, max: 1, step: 0.01 });

    const colorProxy1 = {
      color: {
        r: pipeline1.lightningColor.x,
        g: pipeline1.lightningColor.y,
        b: pipeline1.lightningColor.z,
        a: pipeline1.lightningColor.w,
      },
    };
    folder1.addBinding(colorProxy1, 'color', { color: { type: 'float' } }).on('change', (ev) => {
      pipeline1.lightningColor.set(ev.value.r, ev.value.g, ev.value.b, ev.value.a);
    });

    // --- Bolt 2 Controls ---
    const folder2 = this.pane.addFolder({ title: 'Bolt 2' });
    folder2.addBinding(pipeline2, 'x', { min: 0, max: 1, step: 0.01, label: 'position' });
    folder2.addBinding(pipeline2, 'size', { min: 0, max: 0.1, step: 0.001 });
    folder2.addBinding(pipeline2, 'width', { min: 0, max: 0.1, step: 0.01 });
    folder2.addBinding(pipeline2, 'speed', { min: 0, max: 2, step: 0.1 });
    folder2.addBinding(pipeline2, 'cycle', { min: 0, max: 20, step: 1 });
    folder2.addBinding(pipeline2, 'ratio', { min: 0, max: 2, step: 0.01 });
    folder2.addBinding(pipeline2, 'timeShift', { min: 0, max: 1, step: 0.01 });

    const colorProxy2 = {
      color: {
        r: pipeline2.lightningColor.x,
        g: pipeline2.lightningColor.y,
        b: pipeline2.lightningColor.z,
        a: pipeline2.lightningColor.w,
      },
    };
    folder2.addBinding(colorProxy2, 'color', { color: { type: 'float' } }).on('change', (ev) => {
      pipeline2.lightningColor.set(ev.value.r, ev.value.g, ev.value.b, ev.value.a);
    });
  }
}
