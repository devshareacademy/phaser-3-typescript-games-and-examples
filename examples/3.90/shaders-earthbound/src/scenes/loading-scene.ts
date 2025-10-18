import { ASSETS } from '../assets';

export class LoadingScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LoadingScene' });
  }

  preload(): void {
    for (const [key, path] of Object.entries(ASSETS.indexed)) {
      this.load.image(key, path);
    }
    for (const [key, path] of Object.entries(ASSETS.palettes)) {
      this.load.image(key, path);
    }
  }

  create(): void {
    this.scene.start('BattleScene');
    //this.scene.start('TransparencyScene');
  }
}
