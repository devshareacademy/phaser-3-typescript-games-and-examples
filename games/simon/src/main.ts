import Phaser from 'phaser';
import Simon from './simon';
import { sleep } from './utils';

const ASSET_KEYS = {
  SOUND1: 'SOUND1',
  SOUND2: 'SOUND2',
  SOUND3: 'SOUND3',
  SOUND4: 'SOUND4',
} as const;

type GameState = keyof typeof GAME_STATE;

const GAME_STATE = {
  INITIAL: 'INITIAL',
  PLAYING_PATTERN: 'PLAYING_PATTERN',
  WAITING_FOR_INPUT: 'WAITING_FOR_INPUT',
  DONE: 'DONE',
} as const;

class Game extends Phaser.Scene {
  #gameState!: GameState;
  #simonGame!: Simon;
  #buttons!: Phaser.GameObjects.Rectangle[];

  constructor() {
    super({ key: 'Game' });
  }

  public init() {
    this.#gameState = GAME_STATE.INITIAL;
    this.#buttons = [];
    this.#simonGame = new Simon();
  }

  public preload(): void {
    this.load.setBaseURL('https://devshareacademy.github.io/cdn/audio/misc/simon');
    this.load.audio(ASSET_KEYS.SOUND1, 'simonSound1.mp3');
    this.load.audio(ASSET_KEYS.SOUND2, 'simonSound2.mp3');
    this.load.audio(ASSET_KEYS.SOUND3, 'simonSound3.mp3');
    this.load.audio(ASSET_KEYS.SOUND4, 'simonSound4.mp3');
  }

  public create(): void {
    // game width =
    const redButton = this.#createButton(20, 20, 0xdb0a8b, 0xf535aa, 0, ASSET_KEYS.SOUND1);
    const greenButton = this.#createButton(230, 20, 0x08c418, 0x16f529, 1, ASSET_KEYS.SOUND2);
    const yellowButton = this.#createButton(20, 230, 0xe6e600, 0xffff33, 2, ASSET_KEYS.SOUND3);
    const blueButton = this.#createButton(230, 230, 0x0066cc, 0x1589ff, 3, ASSET_KEYS.SOUND4);
    this.#buttons = [redButton, greenButton, yellowButton, blueButton];

    // play sequence for player to remember and transition to wait for player input
    this.#playSequence().catch(() => {
      // do nothing
    });
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
      if (this.#gameState === GAME_STATE.WAITING_FOR_INPUT) {
        button.fillColor = hoverColor;
        button.setAlpha(1);
      }
    });

    // add event listener for pointer out event (mouse was hovering over element and then leaves), when event fires update color and fill
    button.on(Phaser.Input.Events.POINTER_OUT as string, () => {
      if (this.#gameState === GAME_STATE.WAITING_FOR_INPUT) {
        button.fillColor = color;
        button.setAlpha(0.4);
      }
    });

    // add event listener for click events, when event fires update the player moves in the simon game logic
    button.on(Phaser.Input.Events.POINTER_DOWN as string, () => {
      if (this.#gameState === GAME_STATE.WAITING_FOR_INPUT) {
        this.sound.play(audioAssetKey);
        this.#simonGame.checkPlayerMove(button.data.values.id as number);

        button.fillColor = color;
        button.setAlpha(0.4);

        // check to see if game is over and go to DONE state
        if (this.#simonGame.isGameOver) {
          this.#gameState = GAME_STATE.DONE;
          console.log('Game is over');
          return;
        }

        // check if the player sequence is complete, if so go to the next round
        if (this.#simonGame.isPlayerSequenceComplete) {
          this.#gameState = GAME_STATE.PLAYING_PATTERN;
          this.#simonGame.generateNextSequenceElement();
          this.#playSequence().catch(() => {
            // do nothing
          });
        }
      }
    });
    return button;
  }

  async #playSequence(): Promise<void> {
    await sleep(1000);
    const currentSequence = this.#simonGame.sequence;
    for (const num of currentSequence) {
      this.#buttons[num].fillColor = this.#buttons[num].data.values.hoverColor as number;
      this.#buttons[num].setAlpha(1);
      this.sound.play(this.#buttons[num].data.values.audioAssetKey as string);
      await sleep(1000);
      this.#buttons[num].fillColor = this.#buttons[num].data.values.color as number;
      this.#buttons[num].setAlpha(0.4);
      await sleep(400);
    }

    this.#gameState = GAME_STATE.WAITING_FOR_INPUT;
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
