import Phaser from 'phaser';

const IMAGE_ASSET_KEY = 'BG';
const SPRITE_SHEET_ASSET_KEY = 'CHARACTERS';

export class BuiltInFxScene extends Phaser.Scene {
  constructor() {
    super({ key: BuiltInFxScene.name });
  }

  preload(): void {
    // load in data
    this.load.image(IMAGE_ASSET_KEY, 'assets/images/bg.png');
    this.load.spritesheet(SPRITE_SHEET_ASSET_KEY, 'assets/images/custom.png', {
      frameWidth: 64,
      frameHeight: 88,
    });
  }

  create(): void {
    // Create game objects
    this.add.image(0, 0, IMAGE_ASSET_KEY).setOrigin(0);
    const character = this.add.image(487, 310, SPRITE_SHEET_ASSET_KEY, 7);
    // example for builtin
    character.preFX?.addGradient(0x0000ff, 0x00ff00, 0);

    this.input.keyboard?.once('keydown-SPACE', () => {
      this.scene.start('NothingPostFxScene');
    });
  }
}
