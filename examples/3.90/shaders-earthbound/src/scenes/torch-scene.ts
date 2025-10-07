import { BaseScene } from './base-scene';

export class TorchScene extends BaseScene {
  constructor() {
    super({ key: 'TorchScene' });
  }

  preload(): void {
    this.load.image('wall1', 'assets/dungeon/wall1.png');
    this.load.image('wall2', 'assets/dungeon/wall1.png');
    this.load.image('torch', 'assets/dungeon/torch.png');
    this.load.image('fire1', 'assets/dungeon/fire.png');
    this.load.image('fire2', 'assets/dungeon/fire_2.png');
    this.load.image('light', 'assets/dungeon/light.png');
  }

  create(): void {
    this.add.image(-280, 0, 'wall1').setOrigin(0);

    const { width, height } = this.cameras.main;

    // Add the torch to the scene, centered
    const torch = this.add.image(width / 2, height / 2 + 150, 'torch').setScale(0.75);

    // Add the glow sprite behind the fire
    const glow = this.add.image(torch.x, torch.y - 80, 'light');
    glow.setBlendMode('ADD');

    // Add a tween to make it flicker
    this.tweens.add({
      targets: glow,
      scale: { from: 0.4, to: 0.44 },
      alpha: { from: 0.08, to: 0.12 },
      duration: 1300,
      ease: 'sine.inout',
      yoyo: true,
      repeat: -1,
    });

    // Create the fire particle emitter, positioned on the torch
    this.add.particles(torch.x, torch.y - 50, 'fire1', {
      lifespan: { min: 600, max: 900 },
      // Add some horizontal speed to make the fire wider
      speedX: { min: -30, max: 30 },
      speedY: { min: -120, max: -150 },
      scale: { start: 8, end: 0 },
      color: [0xfacc22, 0xf89820, 0xf04f23],
      blendMode: 'ADD',
      frequency: 40,
      // Emit from a wider area to give the fire a base
      emitZone: { type: 'random', source: new Phaser.Geom.Rectangle(-10, 0, 30, 1) },
    });

    // Create the smoke particle emitter
    this.add.particles(torch.x, torch.y - 120, 'fire2', {
      lifespan: { min: 1000, max: 1500 },
      speedX: { min: -25, max: 25 },
      speedY: { min: -60, max: -80 },
      scale: { start: 1, end: 3, ease: 'quad.out' },
      alpha: { start: 0.7, end: 0, ease: 'quad.in' },
      tint: 0x444444,
      frequency: 150,
      emitZone: { type: 'random', source: new Phaser.Geom.Rectangle(-10, 0, 30, 1) },
    });
  }
}
