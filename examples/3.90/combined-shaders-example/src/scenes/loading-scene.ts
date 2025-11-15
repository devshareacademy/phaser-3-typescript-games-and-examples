import { ASSET_KEYS, SCENE_KEYS } from '../common';

export class LoadingScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.LOADING_SCENE });
  }

  preload(): void {
    this.load.font(ASSET_KEYS.fonts.PressStart2P, 'assets/fonts/PressStart2P-Regular.ttf');

    this.load.setPath('assets/images');
    this.load.spritesheet(ASSET_KEYS.spritesheets.frog, 'frog.png', {
      frameWidth: 63,
      frameHeight: 68,
    });
    this.load.spritesheet(ASSET_KEYS.spritesheets.wizard, 'wizard.png', {
      frameWidth: 95,
      frameHeight: 133,
    });
    this.load.image(ASSET_KEYS.other.border, 'border.png');

    this.load.setPath('assets/images/backgrounds');
    for (const [key, path] of Object.entries(ASSET_KEYS.backgrounds)) {
      this.load.image(key, path);
    }
    this.load.setPath('assets/images/palette-cycle');
    for (const [key, path] of Object.entries(ASSET_KEYS.gradients)) {
      this.load.image(key, path);
    }
    for (const [key, path] of Object.entries(ASSET_KEYS.palettes)) {
      this.load.image(key, path);
    }
  }

  create(): void {
    this.scene.start(SCENE_KEYS.GAME_SCENE);
  }
}
