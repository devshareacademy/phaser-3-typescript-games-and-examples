import * as Phaser from 'phaser';

export class Belt {
  #beltSpriteContainer: Phaser.GameObjects.Container;
  #midSprite!: Phaser.GameObjects.Sprite;
  #midTileSprite!: Phaser.GameObjects.TileSprite;
  #surfaceSpeed: Phaser.Math.Vector2;

  constructor(scene: Phaser.Scene) {
    this.#surfaceSpeed = new Phaser.Math.Vector2(0.8, 0);
    this.#beltSpriteContainer = scene.add.container(96, 192, []).setSize(352, 16);
    scene.physics.world.enable(this.#beltSpriteContainer);
    (this.#beltSpriteContainer.body as Phaser.Physics.Arcade.Body)
      .setOffset(176, 7)
      .setImmovable(true)
      .setAllowGravity(false);
    this.#createAnimations(scene);
    this.#createSprites(scene);
  }

  get container(): Phaser.GameObjects.Container {
    return this.#beltSpriteContainer;
  }

  get speed(): Phaser.Math.Vector2 {
    return this.#surfaceSpeed;
  }

  public update(): void {
    this.#midTileSprite.setFrame(this.#midSprite.frame.name);
  }

  #createSprites(scene: Phaser.Scene): void {
    const startSprite = scene.add.sprite(0, 0, 'BELT', 0).setOrigin(0).play('BELT_LEFT');
    this.#midSprite = scene.add.sprite(32, 0, 'BELT', 4).setVisible(false).play('BELT_MID');
    this.#midTileSprite = scene.add.tileSprite(32, 0, 288, 32, 'BELT', 4).setOrigin(0);
    const endSprite = scene.add.sprite(320, 0, 'BELT', 8).setOrigin(0).play('BELT_RIGHT');
    this.#beltSpriteContainer.add([startSprite, this.#midSprite, this.#midTileSprite, endSprite]);
  }

  #createAnimations(scene: Phaser.Scene): void {
    scene.anims.create({
      key: 'BELT_LEFT',
      frames: scene.anims.generateFrameNumbers('BELT', { frames: [0, 1, 2, 3] }),
      frameRate: 6,
      repeat: -1,
    });
    scene.anims.create({
      key: 'BELT_MID',
      frames: scene.anims.generateFrameNumbers('BELT', { frames: [4, 5, 6, 7] }),
      frameRate: 6,
      repeat: -1,
    });
    scene.anims.create({
      key: 'BELT_RIGHT',
      frames: scene.anims.generateFrameNumbers('BELT', { frames: [8, 9, 10, 11] }),
      frameRate: 6,
      repeat: -1,
    });
  }
}
