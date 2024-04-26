import Phaser, { Scale } from 'phaser';
import { frag, vtx } from './shader';

class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
  }

  public create(): void {
    const base = new Phaser.Display.BaseShader('simpleTexture', frag, vtx);
    const shader = this.add.shader(base, 0, 0, 0, 0);
    console.log(shader.program);
  }
}

window.onload = () => {
  const canvas = document.createElement('canvas');
  const contextCreationConfig = {
    alpha: false,
    depth: false,
    antialias: true,
    premultipliedAlpha: true,
    stencil: true,
    preserveDrawingBuffer: false,
    failIfMajorPerformanceCaveat: false,
    powerPreference: 'default',
  };
  const ctx = canvas.getContext('webgl2', contextCreationConfig);
  console.log(ctx);
  const canvasContainer = document.getElementById('game-container');
  canvasContainer?.appendChild(canvas);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const gameConfig: any = {
    type: Phaser.WEBGL,
    canvas,
    context: ctx,
    scene: MainScene,
    scale: {
      parent: 'game-container',
      width: 800,
      height: 600,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  new Phaser.Game(gameConfig);
};
