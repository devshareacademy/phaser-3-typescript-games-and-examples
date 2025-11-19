import * as Phaser from 'phaser';

export class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' });
  }

  public preload(): void {
    console.log('preload invoked');
    console.log(this.load.list);

    this.load.setBaseURL('https://devshareacademy.github.io/cdn/images/asset-packs/ansimuz/starfighter');

    this.load.image('BACKGROUND', 'background.png');
    console.log(this.load.list);

    // fired when all files in the queue are loaded
    this.load.once(Phaser.Loader.Events.COMPLETE, () => {
      console.log('preload - file loading completed');
    });
    // fired anytime a file in the queue is loaded
    this.load.once(Phaser.Loader.Events.FILE_COMPLETE, (key, type, data) => {
      console.log(key, type, data);
    });
    // fired when a single given file is loaded
    this.load.once(Phaser.Loader.Events.FILE_KEY_COMPLETE + 'image' + '-' + 'BACKGROUND', (key, type, data) => {
      console.log(key, type, data);
    });
  }

  public create(): void {
    console.log('create invoked');
    this.add.image(this.scale.width / 2, this.scale.height / 2, 'BACKGROUND', 0);

    // // loading assets
    this.load.image('SHIP', 'ship-a1.png');
    console.log(this.load.list);
    this.load.on(Phaser.Loader.Events.COMPLETE, () => {
      console.log('create - file loading completed');
      // this will be added twice since the event is called twice
      this.add.image(50, 50, 'SHIP');
    });
    this.load.on(Phaser.Loader.Events.FILE_COMPLETE, (key, type, data) => {
      console.log('create - loaded file: ', key, type, data);
    });
    this.load.start();

    // // example of items being added to queue while in progress or after
    this.time.delayedCall(500, () => {
      //   console.log(this.load.list);
      this.load.image('ROCK', 'big-a.png');
      //   console.log(this.load.list);

      this.load.start();
    });
  }
}

const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.CANVAS,
  pixelArt: true,
  scale: {
    parent: 'game-container',
    width: 420,
    height: 240,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    mode: Phaser.Scale.FIT,
  },
  backgroundColor: '#000000',
  scene: [Game],
};

const game = new Phaser.Game(gameConfig);

// https://ansimuz.itch.io/star-fighter

//https://labs.phaser.io/edit.html?src=src\game%20objects\images\single%20image.js
//https://gamedevacademy.org/wp-content/uploads/2018/04/2018-04-08_1617.png.webp
//https://newdocs.phaser.io/docs/3.80.0/Phaser.Loader.LoaderPlugin
