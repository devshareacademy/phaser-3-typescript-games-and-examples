import Phaser from 'phaser';
import { Pane } from 'tweakpane';
import { ASSETS } from '../assets';

const SCENE_SETTINGS = {
  background: 'indexed_radial',
  scene: 'MainScene',
};

const SCENES = [
  'MainScene',
  'ScrollingScene',
  'HorizontalOscillationScene',
  'VerticalOscillationScene',
  'ConcaveDistortionScene',
];

export class BaseScene extends Phaser.Scene {
  protected pane!: Pane;
  protected bgImage!: Phaser.GameObjects.Image | Phaser.GameObjects.TileSprite;

  constructor(config: string | Phaser.Types.Scenes.SettingsConfig) {
    super(config);
  }

  protected createPane(title: string = 'Shader Controls'): void {
    this.pane = new Pane({ title });

    this.pane
      .addBinding(SCENE_SETTINGS, 'scene', {
        view: 'list',
        label: 'Scene',
        options: SCENES.map((s) => ({ text: s, value: s })),
      })
      .on('change', (ev) => {
        this.scene.start(ev.value);
      });

    this.pane
      .addBinding(SCENE_SETTINGS, 'background', {
        view: 'list',
        label: 'Background',
        options: Object.keys(ASSETS.indexed).map((key) => ({ text: key, value: key })),
      })
      .on('change', (ev) => {
        if (this.bgImage) {
          this.bgImage.setTexture(ev.value);
        }
      });
  }

  protected get backgroundTextureKey(): string {
    return SCENE_SETTINGS.background;
  }

  public shutdown(): void {
    if (this.pane) {
      this.pane.dispose();
    }
  }
}
