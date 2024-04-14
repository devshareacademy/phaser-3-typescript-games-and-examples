import Phaser from 'phaser';
import { SceneKeys } from './scene-keys';
import { DATA_ASSET_KEYS, IMAGE_ASSET_KEYS, SPRITE_SHEET_ASSET_KEYS, TILED_LEVEL_JSON } from '../assets/asset-keys';
import { DataUtils } from '../utils/data-utils';

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: SceneKeys.PreloadScene });
  }

  public preload(): void {
    // load in data
    this.load.setPath('assets/images/npc1');
    this.load.spritesheet(SPRITE_SHEET_ASSET_KEYS.NPC_1_IDLE, '/Idle.png', {
      frameWidth: 48,
      frameHeight: 48,
    });
    this.load.spritesheet(SPRITE_SHEET_ASSET_KEYS.NPC_1_WALK, '/Walk.png', {
      frameWidth: 48,
      frameHeight: 48,
    });
    this.load.setPath('assets/images/objects');
    this.load.spritesheet(SPRITE_SHEET_ASSET_KEYS.SPEAKER, '/Screen1.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet(SPRITE_SHEET_ASSET_KEYS.BUTTON, '/Screen2.png', {
      frameWidth: 32,
      frameHeight: 42,
    });
    this.load.spritesheet(SPRITE_SHEET_ASSET_KEYS.DOOR, '/Entry.png', {
      frameWidth: 32,
      frameHeight: 64,
    });
    this.load.setPath('assets/levels');
    this.load.image(IMAGE_ASSET_KEYS.LEVEL, '/test_level.png');
    this.load.tilemapTiledJSON(TILED_LEVEL_JSON.TILED_LEVEL, '/test_level.json');
    this.load.setPath('assets/images');
    this.load.image(IMAGE_ASSET_KEYS.COLLISION, '/collision.png');
    this.load.setPath('assets/data');
    this.load.json(DATA_ASSET_KEYS.ANIMATIONS, '/animations.json');
  }

  public create(): void {
    this.#createAnimations();
    this.scene.start(SceneKeys.GameScene);
  }

  #createAnimations(): void {
    const animations = DataUtils.getAnimations(this);
    animations.forEach((animation) => {
      const frames = animation.frames
        ? this.anims.generateFrameNumbers(animation.assetKey, { frames: animation.frames })
        : this.anims.generateFrameNumbers(animation.assetKey);
      this.anims.create({
        key: animation.key,
        frames: frames,
        frameRate: animation.frameRate,
        repeat: animation.repeat,
        delay: animation.delay,
        yoyo: animation.yoyo,
      });
    });
  }
}
