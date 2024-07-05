import * as Phaser from 'phaser';

export class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' });
  }

  public preload(): void {
    this.load.setPath('assets/images/axulart/character');
    this.load.spritesheet('player', 'custom.png', { frameWidth: 64, frameHeight: 88 });

    this.load.setPath('assets/images/monster-tamer/battle-backgrounds');
    this.load.image('forest', 'forest-background.png');

    this.load.setPath('assets/images/monster-tamer/monsters');
    this.load.image('carnodusk', 'carnodusk.png');
    this.load.image('iguanignite', 'iguanignite.png');
    this.load.image('aquavalor', 'aquavalor.png');
    this.load.image('frostsaber', 'frostsaber.png');
    this.load.image('ignivolt', 'ignivolt.png');
    this.load.image('parazoid', 'parazoid.png');
    this.load.image('jivy', 'jivy.png');

    this.load.setPath('assets/data');
    this.load.json('item_data', 'items.json');

    this.load.setPath('assets/audio/xDeviruchi');
    this.load.audio('title_theme', 'Title-Theme.wav');

    // duplicated for example
    this.load.setPath('assets/images/axulart/character');
    this.load.spritesheet('player2', 'custom.png', { frameWidth: 64, frameHeight: 88 });

    this.load.setPath('assets/images/monster-tamer/battle-backgrounds');
    this.load.image('forest2', 'forest-background.png');

    this.load.setPath('assets/images/monster-tamer/monsters');
    this.load.image('carnodusk2', 'carnodusk.png');
    this.load.image('iguanignite2', 'iguanignite.png');
    this.load.image('aquavalor2', 'aquavalor.png');
    this.load.image('frostsaber2', 'frostsaber.png');
    this.load.image('ignivolt2', 'ignivolt.png');
    this.load.image('parazoid2', 'parazoid.png');
    this.load.image('jivy2', 'jivy.png');

    this.load.setPath('assets/data');
    this.load.json('item_data2', 'items.json');

    this.load.setPath('assets/audio/xDeviruchi');
    this.load.audio('title_theme2', 'Title-Theme.wav');

    // uncomment this line and comment out code above for example
    // asset pack example
    // this.load.pack('asset_pack', 'assets/data/assets.json');
  }

  public create(): void {
    this.add.image(0, 0, 'forest').setOrigin(0);
    this.add.image(30, 450, 'ignivolt').setOrigin(0).setScale(0.5);
    this.add.image(540, 450, 'carnodusk').setOrigin(0).setScale(0.5);
    this.add.image(420, 450, 'iguanignite').setOrigin(0).setScale(0.5);
    this.add.image(290, 450, 'aquavalor').setOrigin(0).setScale(0.5);
    this.add.image(160, 450, 'frostsaber').setOrigin(0).setScale(0.5);
    this.add.image(680, 450, 'parazoid').setOrigin(0).setScale(0.5);
    this.add.image(810, 450, 'jivy').setOrigin(0).setScale(0.5);
    this.add.image(0, 0, 'player', 0).setOrigin(0);
    this.add.image(0, 100, 'player', 1).setOrigin(0);
    this.add.image(0, 200, 'player', 2).setOrigin(0);
    this.add.image(0, 300, 'player', 3).setOrigin(0);
    this.add.image(100, 0, 'player', 4).setOrigin(0);
    this.add.image(200, 0, 'player', 5).setOrigin(0);
    this.add.image(300, 0, 'player', 6).setOrigin(0);
    this.sound.play('title_theme', {
      loop: true,
      volume: 0.1,
    });
  }
}

const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  pixelArt: true,
  scale: {
    parent: 'game-container',
    width: 1024,
    height: 576,
  },
  scene: [Game],
};

new Phaser.Game(gameConfig);
