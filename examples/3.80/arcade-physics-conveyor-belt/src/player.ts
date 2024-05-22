import * as Phaser from 'phaser';
import { Belt } from './belt';

export class Player {
  #sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  #cursor: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
  #belt: Belt;

  constructor(scene: Phaser.Scene, floor: Phaser.GameObjects.Zone, belt: Belt) {
    this.#belt = belt;
    this.#createAnimations(scene);
    this.#sprite = scene.physics.add.sprite(32, 170, 'PUNK_IDLE', 0).play('PUNK_IDLE');
    this.#sprite.body.setSize(24, 48, false).setOffset(0, 0);
    this.#sprite.setCollideWorldBounds(true);
    scene.physics.add.collider(this.#sprite, floor);

    // add overlap with conveyor belt that will help move the sprite game object
    scene.physics.add.overlap(this.#sprite, belt.container, () => {
      this.#sprite.body.position.add(this.#belt.speed);
    });

    this.#cursor = scene.input.keyboard?.createCursorKeys();
  }

  public update(): void {
    if (this.#cursor === undefined) {
      return;
    }

    if (this.#cursor.left.isDown) {
      this.#sprite.body.setVelocityX(-100);
      if (!this.#sprite.flipX) {
        this.#sprite.flipX = true;
        this.#sprite.body.setOffset(24, 0);
        this.#sprite.x -= 24;
      }
      if (this.#sprite.anims.getName() !== 'PUNK_RUN') {
        this.#sprite.anims.play('PUNK_RUN');
      }
      return;
    }

    if (this.#cursor.right.isDown) {
      this.#sprite.setVelocityX(100);
      if (this.#sprite.flipX) {
        this.#sprite.flipX = false;
        this.#sprite.body.setOffset(0, 0);
        this.#sprite.x += 24;
      }
      if (this.#sprite.anims.getName() !== 'PUNK_RUN') {
        this.#sprite.anims.play('PUNK_RUN');
      }
      return;
    }

    this.#sprite.setVelocityX(0);
    if (this.#sprite.anims.getName() !== 'PUNK_IDLE') {
      this.#sprite.anims.play('PUNK_IDLE');
    }
  }

  #createAnimations(scene: Phaser.Scene): void {
    scene.anims.create({
      key: 'PUNK_RUN',
      frames: scene.anims.generateFrameNumbers('PUNK_RUN'),
      frameRate: 6,
      repeat: -1,
    });
    scene.anims.create({
      key: 'PUNK_IDLE',
      frames: scene.anims.generateFrameNumbers('PUNK_IDLE'),
      frameRate: 6,
      repeat: -1,
    });
  }
}
