import * as Phaser from 'phaser';

export class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' });
  }

  public preload(): void {
    this.load.setBaseURL('https://devshareacademy.github.io/cdn/images/asset-packs/finalbosslbues');
    this.load.spritesheet('characters', 'characters.png', { frameWidth: 26, frameHeight: 36 });
    this.load.image('bg', 'town.png');

    // to use the animation loader, you need to uncomment the line below and comment out the
    // animation creation code in the create method
    // load and create animations
    // this.load.animation('characterAnimations', 'assets/data/animations.json');
  }

  public create(): void {
    this.anims.create({
      key: 'npc_1_walk_down',
      frames: [{ frame: 0 }, { frame: 1 }, { frame: 2 }, { frame: 1 }],
      defaultTextureKey: 'characters',
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: 'npc_2_walk_down',
      frames: [{ frame: 3 }, { frame: 4 }, { frame: 5 }, { frame: 4 }],
      defaultTextureKey: 'characters',
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: 'npc_3_walk_down',
      frames: [{ frame: 6 }, { frame: 7 }, { frame: 8 }, { frame: 7 }],
      defaultTextureKey: 'characters',
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: 'npc_4_walk_down',
      frames: [{ frame: 9 }, { frame: 10 }, { frame: 11 }, { frame: 10 }],
      defaultTextureKey: 'characters',
      frameRate: 6,
      repeat: -1,
    });

    // code duplicated for example
    // this.anims.create({
    //   key: 'npc_1_walk_down',
    //   frames: [{ frame: 0 }, { frame: 1 }, { frame: 2 }, { frame: 1 }],
    //   defaultTextureKey: 'characters',
    //   frameRate: 6,
    //   repeat: -1,
    // });

    // this.anims.create({
    //   key: 'npc_2_walk_down',
    //   frames: [{ frame: 3 }, { frame: 4 }, { frame: 5 }, { frame: 4 }],
    //   defaultTextureKey: 'characters',
    //   frameRate: 6,
    //   repeat: -1,
    // });

    // this.anims.create({
    //   key: 'npc_3_walk_down',
    //   frames: [{ frame: 6 }, { frame: 7 }, { frame: 8 }, { frame: 7 }],
    //   defaultTextureKey: 'characters',
    //   frameRate: 6,
    //   repeat: -1,
    // });

    // this.anims.create({
    //   key: 'npc_4_walk_down',
    //   frames: [{ frame: 9 }, { frame: 10 }, { frame: 11 }, { frame: 10 }],
    //   defaultTextureKey: 'characters',
    //   frameRate: 6,
    //   repeat: -1,
    // });

    // create characters & map
    this.add.image(0, 0, 'bg').setOrigin(0);
    this.add.sprite(200, 164, 'characters', 0).play('npc_1_walk_down');
    this.add.sprite(280, 100, 'characters', 0).play('npc_2_walk_down');
    this.add.sprite(400, 140, 'characters', 0).play('npc_3_walk_down');
    this.add.sprite(280, 200, 'characters', 0).play('npc_4_walk_down');
  }
}

const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  pixelArt: true,
  scale: {
    parent: 'game-container',
    width: 688,
    height: 544,
    zoom: 3,
  },
  scene: [Game],
};

new Phaser.Game(gameConfig);
