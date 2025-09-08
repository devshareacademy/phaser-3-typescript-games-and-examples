import * as Phaser from 'phaser';
import { ASSET_KEYS, SCENE_KEYS } from '../common';

const TRACK_WIDTH_TILES = 25;
const TRACK_HEIGHT_TILES = 20;
const TILE_SIZE = 32;

export class GameScene extends Phaser.Scene {
  private car!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private lapText!: Phaser.GameObjects.Text;
  private checkpoints: Phaser.GameObjects.Zone[] = [];
  private passedCheckpoints: boolean[] = [];
  private lap = 0;

  constructor() {
    super({ key: SCENE_KEYS.GAME_SCENE });
  }

  public create(): void {
    const trackLayer = this.createTrack();
    this.createCar();
    this.createLapSystem();

    this.physics.add.collider(this.car, trackLayer, () => {
        this.car.setDrag(0.95);
    });

    this.cursors = this.input.keyboard!.createCursorKeys();
    this.cameras.main.setBounds(0, 0, TRACK_WIDTH_TILES * TILE_SIZE, TRACK_HEIGHT_TILES * TILE_SIZE);
    this.cameras.main.startFollow(this.car, true);

    this.lapText = this.add.text(10, 10, 'Lap: 0', { fontSize: '32px', color: '#fff' }).setScrollFactor(0);
  }

  public update(): void {
    this.handlePlayerInput();
    this.car.setDrag(0.9);
  }

  private createTrack(): Phaser.Tilemaps.TilemapLayer {
    const trackLayout = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1],
        [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
        [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
        [1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1],
        [1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
        [1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
        [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
        [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
        [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
        [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
        [1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
        [1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
        [1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1],
        [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
        [1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ];

    const tilemap = this.make.tilemap({ data: trackLayout, tileWidth: TILE_SIZE, tileHeight: TILE_SIZE });
    const roadTiles = tilemap.addTilesetImage(ASSET_KEYS.ROAD, ASSET_KEYS.ROAD);
    const grassTiles = tilemap.addTilesetImage(ASSET_KEYS.GRASS, ASSET_KEYS.GRASS);

    const layer = tilemap.createLayer(0, [roadTiles!, grassTiles!], 0, 0);
    layer.setCollision(1);
    return layer;
  }

  private createCar(): void {
    this.car = this.physics.add.sprite(200, 150, ASSET_KEYS.CAR).setOrigin(0.5, 0.5);
    this.car.setCollideWorldBounds(true);
    this.car.setDrag(0.9);
    this.car.setAngularDrag(400);
    this.car.setMaxVelocity(300);
  }

  private createLapSystem(): void {
    const checkpointPositions = [
      { x: 200, y: 400 },
      { x: 600, y: 400 },
      { x: 600, y: 150 },
    ];

    checkpointPositions.forEach((pos, index) => {
      const checkpoint = this.add.zone(pos.x, pos.y, 100, 100);
      this.physics.world.enable(checkpoint);
      (checkpoint.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
      (checkpoint.body as Phaser.Physics.Arcade.Body).moves = false;
      this.checkpoints.push(checkpoint);
      this.passedCheckpoints.push(false);

      this.physics.add.overlap(this.car, checkpoint, () => this.passCheckpoint(index));
    });

    const finishLine = this.add.zone(200, 150, 100, 10);
    this.physics.world.enable(finishLine);
    (finishLine.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
    (finishLine.body as Phaser.Physics.Arcade.Body).moves = false;
    this.physics.add.overlap(this.car, finishLine, this.finishLap, undefined, this);
  }

  private passCheckpoint(index: number): void {
    this.passedCheckpoints[index] = true;
  }

  private finishLap(): void {
    if (this.passedCheckpoints.every(p => p)) {
      this.lap++;
      this.lapText.setText(`Lap: ${this.lap}`);
      this.passedCheckpoints.fill(false);
    }
  }

  private handlePlayerInput(): void {
    const acceleration = 200;
    const angularVelocity = 200;

    if (this.cursors.up.isDown) {
      this.physics.velocityFromRotation(this.car.rotation - Math.PI / 2, 200, (this.car.body as Phaser.Physics.Arcade.Body).acceleration);
    } else if (this.cursors.down.isDown) {
      this.physics.velocityFromRotation(this.car.rotation - Math.PI / 2, -100, (this.car.body as Phaser.Physics.Arcade.Body).acceleration);
    } else {
        (this.car.body as Phaser.Physics.Arcade.Body).setAcceleration(0, 0);
    }

    if (this.cursors.left.isDown) {
      this.car.setAngularVelocity(-angularVelocity);
    } else if (this.cursors.right.isDown) {
      this.car.setAngularVelocity(angularVelocity);
    } else {
      this.car.setAngularVelocity(0);
    }
  }
}