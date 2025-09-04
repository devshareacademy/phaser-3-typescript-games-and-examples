import { ASSET_KEYS, SCENE_KEYS } from '../common';

export class LoadingScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.LOADING_SCENE });
  }

  preload(): void {
    for (const [key, path] of Object.entries(ASSET_KEYS.indexed)) {
      this.load.image(key, path);
    }
    for (const [key, path] of Object.entries(ASSET_KEYS.palettes)) {
      this.load.image(key, path);
    }
  }

  create(): void {
    this.scene.start(SCENE_KEYS.PALETTE_CYCLING_SCENE);
  }
}
