import { AUDIO_ASSET_KEYS, IMAGE_ASSET_KEYS } from '../assets/asset-keys';
import { playBackgroundMusic } from '../utils/sound-utils';
import { SceneKeys } from './scene-keys';

export default class TitleScene extends Phaser.Scene {
  #bg1!: Phaser.GameObjects.TileSprite;
  #bg2!: Phaser.GameObjects.TileSprite;
  #bg3!: Phaser.GameObjects.TileSprite;
  #bg4!: Phaser.GameObjects.TileSprite;
  #bg5!: Phaser.GameObjects.TileSprite;
  #bgOverlay!: Phaser.GameObjects.TileSprite;
  #fullScreenKey: Phaser.Input.Keyboard.Key | undefined;

  constructor() {
    super({ key: SceneKeys.TitleScene });
  }

  public create(): void {
    const { height, width } = this.scale;
    this.cameras.main.fadeIn(1000, 0, 0, 0);
    this.#bg1 = this.add.tileSprite(0, 0, width, height, IMAGE_ASSET_KEYS.TITLE_BG_1).setOrigin(0);
    this.#bg2 = this.add.tileSprite(0, 0, width, height, IMAGE_ASSET_KEYS.TITLE_BG_2).setOrigin(0);
    this.#bg3 = this.add.tileSprite(0, 0, width, height, IMAGE_ASSET_KEYS.TITLE_BG_3).setOrigin(0);
    this.#bg4 = this.add.tileSprite(0, 0, width, height, IMAGE_ASSET_KEYS.TITLE_BG_4).setOrigin(0);
    this.#bg5 = this.add.tileSprite(0, 0, width, height, IMAGE_ASSET_KEYS.TITLE_BG_5).setOrigin(0);
    this.#bgOverlay = this.add.tileSprite(0, 0, width, height, IMAGE_ASSET_KEYS.OVERLAY_28).setOrigin(0).setAlpha(0.2);
    this.add.image(width / 2, 80, IMAGE_ASSET_KEYS.TITLE_TEXT_1, 0);
    const startText = this.add.image(width / 2, 200, IMAGE_ASSET_KEYS.TITLE_TEXT_2, 0).setScale(0.5);
    this.tweens.add({
      targets: startText,
      scaleX: 0.4,
      scaleY: 0.4,
      yoyo: true,
      repeat: -1,
      ease: Phaser.Math.Easing.Sine.InOut,
    });

    // full screen support
    this.#fullScreenKey = this.input?.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.F);
    // add full screen button
    this.add
      .image(5, 5, IMAGE_ASSET_KEYS.FULLSCREEN_BUTTON)
      .setOrigin(0)
      .setScale(0.75)
      .setDepth(4)
      .setInteractive()
      .on(Phaser.Input.Events.POINTER_DOWN, () => {
        this.scale.toggleFullscreen();
      });

    this.input.once(Phaser.Input.Events.POINTER_DOWN, () => {
      this.cameras.main.fadeOut(1000, 0, 0, 0, (camera, progress) => {
        if (progress === 1) {
          this.scene.start(SceneKeys.GameScene);
        }
      });
    });

    playBackgroundMusic(this, AUDIO_ASSET_KEYS.BG_2);
  }

  public update(): void {
    this.#bg1.tilePositionX += 0.2;
    this.#bg2.tilePositionX += 0.3;
    this.#bg3.tilePositionX += 0.5;
    this.#bg4.tilePositionX += 0.65;
    this.#bg5.tilePositionX += 0.8;
    this.#bgOverlay.tilePositionX += 1;

    if (this.#wasFullScreenKeyPressed()) {
      this.scale.toggleFullscreen();
    }
  }

  #wasFullScreenKeyPressed() {
    if (this.#fullScreenKey === undefined) {
      return false;
    }
    return Phaser.Input.Keyboard.JustDown(this.#fullScreenKey);
  }
}
