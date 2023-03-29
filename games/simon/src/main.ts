import Phaser from 'phaser';

const ASSET_KEYS = {
  SOUND1: 'SOUND1',
  SOUND2: 'SOUND2',
  SOUND3: 'SOUND3',
  SOUND4: 'SOUND4',
} as const;

class Game extends Phaser.Scene {
  #buttons!: Phaser.GameObjects.Rectangle[];

  constructor() {
    super({ key: 'Game' });
  }

  public init() {
    this.#buttons = [];
  }

  public preload(): void {
    this.load.audio(ASSET_KEYS.SOUND1, 'assets/audio/simonSound1.mp3');
    this.load.audio(ASSET_KEYS.SOUND2, 'assets/audio/simonSound2.mp3');
    this.load.audio(ASSET_KEYS.SOUND3, 'assets/audio/simonSound3.mp3');
    this.load.audio(ASSET_KEYS.SOUND4, 'assets/audio/simonSound4.mp3');
  }

  public create(): void {
    // game width =
    const redButton = this.#createButton(20, 20, 0xdb0a8b, 0xf535aa, 0, ASSET_KEYS.SOUND1);
    const greenButton = this.#createButton(230, 20, 0x08c418, 0x16f529, 1, ASSET_KEYS.SOUND2);
    const yellowButton = this.#createButton(20, 230, 0xe6e600, 0xffff33, 2, ASSET_KEYS.SOUND3);
    const blueButton = this.#createButton(230, 230, 0x0066cc, 0x1589ff, 3, ASSET_KEYS.SOUND4);
    this.#buttons = [redButton, greenButton, yellowButton, blueButton];
  }

  #createButton(
    x: number,
    y: number,
    color: number,
    hoverColor: number,
    buttonId: number,
    audioAssetKey: string,
  ): Phaser.GameObjects.Rectangle {
    // create Phaser rectangle game object that is a little transparent and that is interactive (allows for player interaction)
    const button = this.add.rectangle(x, y, 200, 200, color).setOrigin(0).setAlpha(0.4).setInteractive();

    // set custom data attribute to track hover and original color
    button.setDataEnabled();
    button.data.set({ color, hoverColor, id: buttonId, audioAssetKey }, undefined);

    // add event listener for pointer over event (mouse hovers over element), when event fires update color and fill
    button.on(Phaser.Input.Events.POINTER_OVER as string, () => {
      button.fillColor = hoverColor;
      button.setAlpha(1);
    });

    // add event listener for pointer out event (mouse was hovering over element and then leaves), when event fires update color and fill
    button.on(Phaser.Input.Events.POINTER_OUT as string, () => {
      button.fillColor = color;
      button.setAlpha(0.4);
    });

    return button;
  }
}

const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.CANVAS,
  pixelArt: true,
  parent: 'game-container',
  width: 450,
  height: 450,
  backgroundColor: '#5c5b5b',
  scene: [Game],
};

const game = new Phaser.Game(gameConfig);
