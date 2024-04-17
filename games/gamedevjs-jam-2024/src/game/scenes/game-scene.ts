import Phaser from 'phaser';
import { SceneKeys } from './scene-keys';
import { IMAGE_ASSET_KEYS } from '../assets/asset-keys';
import { TILED_LAYER_NAMES, TILED_OBJECT_LAYER_NAMES } from '../assets/tiled-keys';
import * as TiledSchema from '../schema/tiled-schema';
import { NPC } from '../objects/npc';
import { Speaker } from '../objects/speaker';
import { Button } from '../objects/button';
import { Door } from '../objects/door';
import { Belt } from '../objects/belt';
import { Smasher } from '../objects/smasher';
import { Bridge } from '../objects/bridge';
import { setupTutorial } from '../tutorial/tutorial-utils';
import { Dialog } from '../objects/dialog';

type GameSceneData = {
  level: number;
};

export default class GameScene extends Phaser.Scene {
  #npcs: NPC[];
  #speakers: Speaker[];
  #buttons: Button[];
  #doors: Door[];
  #belts: Belt[];
  #smashers: Smasher[];
  #bridges: Bridge[];
  #doorGroup!: Phaser.Physics.Arcade.Group;
  #smasherGroup!: Phaser.GameObjects.Group;
  #currentEnergy: number;
  #maxEnergy: number;
  #energyText!: Phaser.GameObjects.Text;
  #exitZone!: Phaser.GameObjects.Zone;
  #currentLevel: number;
  #npcDialogModal!: Dialog;
  #mainDialogModal!: Dialog;

  constructor() {
    super({ key: SceneKeys.GameScene });
    this.#npcs = [];
    this.#speakers = [];
    this.#buttons = [];
    this.#doors = [];
    this.#belts = [];
    this.#smashers = [];
    this.#bridges = [];
    this.#currentEnergy = 0;
    this.#maxEnergy = 0;
    this.#currentLevel = 1;
  }

  get currentEnergy(): number {
    return this.#currentEnergy;
  }

  public init(data: GameSceneData): void {
    if (Object.keys(data).length === 0) {
      return;
    }
    this.#currentLevel = data.level;
    if (this.#currentLevel === 5) {
      this.#currentLevel = 1;
    }
  }

  public create(): void {
    // main background
    this.add.image(this.scale.width / 2, this.scale.height / 2, `LEVEL_${this.#currentLevel}`, 0);
    const tiledMapData = this.make.tilemap({ key: `TILED_LEVEL_${this.#currentLevel}` });
    const exitZone = this.#createExitZone(tiledMapData);
    if (exitZone === undefined) {
      return;
    }
    this.#exitZone = exitZone;
    this.#doorGroup = this.#createDoors(tiledMapData);
    this.#belts = this.#createBelts(tiledMapData);
    this.#bridges = this.#createBridges(tiledMapData);
    this.#buttons = this.#createButtons(tiledMapData);
    this.#speakers = this.#createSpeakers(tiledMapData);
    this.#npcs = this.#createNpcs(tiledMapData);
    this.#smashers = this.#createSmashers(tiledMapData);
    this.#smasherGroup = this.add.group(this.#smashers.map((smasher) => smasher.sprite));
    this.#calculateEnergy(tiledMapData);

    const collisionLayer = this.#createCollisionLayer(tiledMapData);
    if (!collisionLayer) {
      return;
    }
    collisionLayer.setCollision(117, true);
    collisionLayer.setAlpha(0);

    this.#npcs.forEach((npc) => {
      const wallCollider = this.physics.add.collider(npc.sprite, collisionLayer, () => {
        npc.collidedWithWall();
      });
      npc.addCollider(wallCollider);
      const doorCollider = this.physics.add.collider(npc.sprite, this.#doorGroup, () => {
        npc.collidedWithWall();
      });
      npc.addCollider(doorCollider);
      const exitOverlap = this.physics.add.overlap(npc.sprite, this.#exitZone, () => {
        npc.hasEnteredExit();
      });
      npc.addCollider(exitOverlap);
      this.#belts.forEach((belt) => {
        const beltCollider = this.physics.add.overlap(npc.sprite, belt.spriteContainer, () => {
          npc.isOnBelt(belt.speed);
        });
        npc.addCollider(beltCollider);
      });
      const smasherCollider = this.physics.add.overlap(npc.sprite, this.#smasherGroup, () => {
        npc.died();
      });
      npc.addCollider(smasherCollider);
      this.#bridges.forEach((bridge) => {
        const bridgeCollider = this.physics.add.collider(npc.sprite, bridge.collisionZone, () => {
          //npc.collidedWithWall();
        });
        npc.addCollider(bridgeCollider);
        const bridgeCollider2 = this.physics.add.collider(npc.sprite, bridge.bridgeContainer, () => {
          npc.collidedWithWall();
        });
        npc.addCollider(bridgeCollider2);
      });
    });
    // collisionLayer.renderDebug(this.add.graphics());

    this.#energyText = this.add.text(10, 10, '').setOrigin(0);
    this.#updateEnergyUI();

    this.#npcDialogModal = new Dialog({
      scene: this,
      x: 0,
      y: 0,
      uiBackGroundAssetKey: IMAGE_ASSET_KEYS.NPC_MODAL,
      uiProfileAssetKey: IMAGE_ASSET_KEYS.PROFILE_HEAD,
    });

    this.#mainDialogModal = new Dialog({
      scene: this,
      x: 0,
      y: 0,
      uiBackGroundAssetKey: IMAGE_ASSET_KEYS.MAIN_MODAL,
      uiProfileAssetKey: IMAGE_ASSET_KEYS.PROFILE_HEAD,
    });

    setupTutorial({
      scene: this,
      currentLevel: this.#currentLevel,
      npcs: this.#npcs,
      speakers: this.#speakers,
      buttons: this.#buttons,
      mainDialogModal: this.#mainDialogModal,
      npcDialogModal: this.#npcDialogModal,
    });
  }

  public update(): void {
    this.#npcs.forEach((npc) => npc.update());
    this.#speakers.forEach((speaker) => speaker.update());
    this.#belts.forEach((belt) => belt.update());
  }

  public updateEnergy(energyAmount: number): void {
    this.#currentEnergy += energyAmount;
    this.#updateEnergyUI();
  }

  public npcHasLeftScene(): void {
    const hasAllNpcsLeft = this.#npcs.every((npc) => npc.hasExitedLevel);
    if (hasAllNpcsLeft) {
      this.scene.start(SceneKeys.GameScene, { level: (this.#currentLevel += 1) });
    } else {
      console.log('keep playing');
    }
  }

  public triggerGameOver(): void {
    this.scene.pause();
    // TODO: show menu for restarting scene
  }

  #updateEnergyUI(): void {
    this.#energyText.setText(`${this.currentEnergy} / ${this.#maxEnergy}`);
  }

  #createExitZone(tiledMapData: Phaser.Tilemaps.Tilemap): Phaser.GameObjects.Zone | undefined {
    const layerData = tiledMapData.getObjectLayer(TILED_OBJECT_LAYER_NAMES.EXIT);
    if (!layerData || layerData.objects.length > 1) {
      console.warn(`[${GameScene.name}:#createExitZone] encountered error while parsing tiled map data for level exit`);
      return;
    }
    const parsedObject = TiledSchema.TiledExitObjectSchema.safeParse(layerData.objects[0]);
    if (!parsedObject.success) {
      console.warn(
        `[${GameScene.name}:#calculateEnergy] encountered error while parsing tiled map data`,
        parsedObject.error,
      );
      return;
    }
    const obj = parsedObject.data;
    const zone = this.add.zone(obj.x, obj.y, obj.width, obj.height).setOrigin(0, 1);
    this.physics.world.enable(zone);
    return zone;
  }

  #createNpcs(tiledMapData: Phaser.Tilemaps.Tilemap): NPC[] {
    const layerData = tiledMapData.getObjectLayer(TILED_OBJECT_LAYER_NAMES.NPCS);
    const npcs: NPC[] = [];
    if (!layerData) {
      return npcs;
    }
    const rawObjects = layerData.objects;
    for (const rawObject of rawObjects) {
      const parsedObject = TiledSchema.TiledNpcObjectSchema.safeParse(rawObject);
      if (!parsedObject.success) {
        console.warn(
          `[${GameScene.name}:#createNpcs] encountered error while parsing tiled map data`,
          parsedObject.error,
        );
        continue;
      }
      const obj = parsedObject.data;
      const npc = new NPC({ scene: this, x: obj.x, y: obj.y, speakers: this.#speakers });
      npcs.push(npc);
    }
    return npcs;
  }

  #createDoors(tiledMapData: Phaser.Tilemaps.Tilemap): Phaser.Physics.Arcade.Group {
    this.#doors = [];
    const gameObjects = this.physics.add.group({ immovable: true });
    const layerData = tiledMapData.getObjectLayer(TILED_OBJECT_LAYER_NAMES.DOORS);
    if (!layerData) {
      return gameObjects;
    }
    const rawObjects = layerData.objects;
    for (const rawObject of rawObjects) {
      const parsedObject = TiledSchema.TiledDoorObjectSchema.safeParse(rawObject);

      if (!parsedObject.success) {
        console.warn(
          `[${GameScene.name}:#createDoors] encountered error while parsing tiled map data`,
          parsedObject.error,
        );
        continue;
      }
      const obj = parsedObject.data;
      const door = new Door({
        scene: this,
        x: obj.x,
        y: obj.y,
        flipX: this.#shouldFlipGameObject(obj.properties),
        id: this.#getIdFromObject(obj.properties),
      });
      gameObjects.add(door.sprite);
      this.#doors.push(door);
    }
    return gameObjects;
  }

  #createButtons(tiledMapData: Phaser.Tilemaps.Tilemap): Button[] {
    const layerData = tiledMapData.getObjectLayer(TILED_OBJECT_LAYER_NAMES.BUTTONS);
    const gameObjects: Button[] = [];
    if (!layerData) {
      return gameObjects;
    }
    const rawObjects = layerData.objects;
    for (const rawObject of rawObjects) {
      const parsedObject = TiledSchema.TiledButtonObjectSchema.safeParse(rawObject);
      if (!parsedObject.success) {
        console.warn(
          `[${GameScene.name}:#createButtons] encountered error while parsing tiled map data`,
          parsedObject.error,
        );
        continue;
      }
      const obj = parsedObject.data;
      const connectedObject = this.#getButtonConnectedObject(obj.properties);
      if (!connectedObject) {
        console.warn(
          `[${GameScene.name}:#createButtons] was not able to find connected object while parsing tiled data`,
        );
        continue;
      }
      const button = new Button({
        scene: this,
        x: obj.x,
        y: obj.y,
        flipX: this.#shouldFlipGameObject(obj.properties),
        startingEnergy: this.#getEnergyDetailsFromObject(obj.properties),
        id: this.#getIdFromObject(obj.properties),
        connectedObject: connectedObject,
      });
      gameObjects.push(button);
    }
    return gameObjects;
  }

  #getButtonConnectedObject(objectProperties: TiledSchema.TiledObjectProperty[]) {
    // get the object type from the tiled data
    const activeObjectProp = objectProperties.find(
      (prop) => prop.name === TiledSchema.TILED_BUTTON_PROPERTY_NAME.ACTIVE_OBJECT_TYPE,
    );
    if (!activeObjectProp) {
      return;
    }
    const parsedProperty = TiledSchema.TiledObjectActiveObjectTypePropertySchema.safeParse(activeObjectProp);
    if (!parsedProperty.success) {
      return;
    }

    // find the object id from the tiled data
    const targetObjectIdProp = objectProperties.find(
      (prop) => prop.name === TiledSchema.TILED_BUTTON_PROPERTY_NAME.OBJECT_ID,
    );
    if (targetObjectIdProp === undefined) {
      return;
    }
    const parsedTargetObjectIdProperty = TiledSchema.TiledTargetObjectIdPropertySchema.safeParse(targetObjectIdProp);
    if (!parsedTargetObjectIdProperty.success) {
      return;
    }

    // find the matching object in the game objects that have already been created based on the type and id field we found above
    if (parsedProperty.data.value === TiledSchema.BUTTON_ACTIVE_OBJECT_TYPE.DOOR) {
      return this.#doors.find((door) => door.id === parsedTargetObjectIdProperty.data.value);
    }
    if (parsedProperty.data.value === TiledSchema.BUTTON_ACTIVE_OBJECT_TYPE.BELT) {
      return this.#belts.find((belt) => belt.id === parsedTargetObjectIdProperty.data.value);
    }
    if (parsedProperty.data.value === TiledSchema.BUTTON_ACTIVE_OBJECT_TYPE.BRIDGE) {
      return this.#bridges.find((bridge) => bridge.id === parsedTargetObjectIdProperty.data.value);
    }
  }

  #createSpeakers(tiledMapData: Phaser.Tilemaps.Tilemap): Speaker[] {
    const layerData = tiledMapData.getObjectLayer(TILED_OBJECT_LAYER_NAMES.SPEAKERS);
    const gameObjects: Speaker[] = [];
    if (!layerData) {
      return gameObjects;
    }
    const rawObjects = layerData.objects;
    for (const rawObject of rawObjects) {
      const parsedObject = TiledSchema.TiledSpeakerObjectSchema.safeParse(rawObject);
      if (!parsedObject.success) {
        console.warn(
          `[${GameScene.name}:#createSpeakers] encountered error while parsing tiled map data`,
          parsedObject.error,
        );
        continue;
      }
      const obj = parsedObject.data;
      const speaker = new Speaker({
        scene: this,
        x: obj.x,
        y: obj.y,
        flipX: this.#shouldFlipGameObject(obj.properties),
        startingEnergy: this.#getEnergyDetailsFromObject(obj.properties),
        id: this.#getIdFromObject(obj.properties),
      });
      gameObjects.push(speaker);
    }
    return gameObjects;
  }

  #shouldFlipGameObject(objectProperties: TiledSchema.TiledObjectProperty[]): boolean {
    const flipProp = objectProperties.find((prop) => prop.name === TiledSchema.TILED_DOOR_PROPERTY_NAME.FLIP);
    if (!flipProp) {
      return false;
    }
    const parsedProperty = TiledSchema.TiledObjectFlipPropertySchema.safeParse(flipProp);
    if (!parsedProperty.success) {
      return false;
    }
    return parsedProperty.data.value;
  }

  #getEnergyDetailsFromObject(objectProperties: TiledSchema.TiledObjectProperty[]): number {
    const energyProp = objectProperties.find(
      (prop) => prop.name === TiledSchema.TILED_ENERGY_PROPERTY_NAME.CURRENT_ENERGY,
    );
    if (!energyProp) {
      return 0;
    }
    const parsedProperty = TiledSchema.TiledObjectCurrentEnergyPropertySchema.safeParse(energyProp);
    if (!parsedProperty.success) {
      return 0;
    }
    return parsedProperty.data.value;
  }

  #getIdFromObject(objectProperties: TiledSchema.TiledObjectProperty[]): number {
    const idProp = objectProperties.find((prop) => prop.name === TiledSchema.TILED_DOOR_PROPERTY_NAME.ID);
    if (!idProp) {
      return -1;
    }
    const parsedProperty = TiledSchema.TiledObjectIdPropertySchema.safeParse(idProp);
    if (!parsedProperty.success) {
      return 0;
    }
    return parsedProperty.data.value;
  }

  #createCollisionLayer(tiledMapData: Phaser.Tilemaps.Tilemap): Phaser.Tilemaps.TilemapLayer | undefined {
    const collisionTiles = tiledMapData.addTilesetImage(
      IMAGE_ASSET_KEYS.COLLISION.toLowerCase(),
      IMAGE_ASSET_KEYS.COLLISION,
    );
    if (!collisionTiles) {
      console.warn(`[${GameScene.name}:create] encountered error while creating collision tiles from tiled`);
      return;
    }
    const collisionLayer = tiledMapData.createLayer(TILED_LAYER_NAMES.COLLISION, collisionTiles, 0, 0);
    if (!collisionLayer) {
      console.warn(`[${GameScene.name}:create] encountered error while creating collision layer using data from tiled`);
      return;
    }
    return collisionLayer;
  }

  #calculateEnergy(tiledMapData: Phaser.Tilemaps.Tilemap): void {
    const layerData = tiledMapData.getObjectLayer(TILED_OBJECT_LAYER_NAMES.ENERGY);
    if (!layerData || layerData.objects.length > 1) {
      console.warn(
        `[${GameScene.name}:#calculateEnergy] encountered error while parsing tiled map data for starting energy`,
      );
      return;
    }
    const parsedObject = TiledSchema.TiledEnergyObjectSchema.safeParse(layerData.objects[0]);
    if (!parsedObject.success) {
      console.warn(
        `[${GameScene.name}:#calculateEnergy] encountered error while parsing tiled map data`,
        parsedObject.error,
      );
      return;
    }
    // starting energy
    this.#currentEnergy = this.#getEnergyDetailsFromObject(parsedObject.data.properties);
    this.#maxEnergy = this.#currentEnergy;

    let energyUsedByDevices = 0;
    this.#buttons.forEach((button) => (energyUsedByDevices += button.currentEnergy));
    this.#speakers.forEach((speaker) => (energyUsedByDevices += speaker.currentEnergy));
    this.#maxEnergy += energyUsedByDevices;
  }

  #createBelts(tiledMapData: Phaser.Tilemaps.Tilemap): Belt[] {
    const belts: Belt[] = [];
    const layerData = tiledMapData.getObjectLayer(TILED_OBJECT_LAYER_NAMES.BELTS);
    if (!layerData) {
      return belts;
    }
    const rawObjects = layerData.objects;
    for (const rawObject of rawObjects) {
      const parsedObject = TiledSchema.TiledBeltObjectSchema.safeParse(rawObject);
      if (!parsedObject.success) {
        console.warn(
          `[${GameScene.name}:#createBelts] encountered error while parsing tiled map data`,
          parsedObject.error,
        );
        continue;
      }
      const obj = parsedObject.data;
      const belt = new Belt({
        scene: this,
        x: obj.x,
        y: obj.y,
        width: obj.width,
        id: this.#getIdFromObject(obj.properties),
      });
      belts.push(belt);
    }
    return belts;
  }

  #createSmashers(tiledMapData: Phaser.Tilemaps.Tilemap): Smasher[] {
    const smashers: Smasher[] = [];
    const layerData = tiledMapData.getObjectLayer(TILED_OBJECT_LAYER_NAMES.SMASHERS);
    if (!layerData) {
      return smashers;
    }
    const rawObjects = layerData.objects;
    for (const rawObject of rawObjects) {
      const parsedObject = TiledSchema.TiledSmasherObjectSchema.safeParse(rawObject);
      if (!parsedObject.success) {
        console.warn(
          `[${GameScene.name}:#createSmashers] encountered error while parsing tiled map data`,
          parsedObject.error,
        );
        continue;
      }
      const obj = parsedObject.data;
      const smasher = new Smasher({
        scene: this,
        x: obj.x,
        y: obj.y,
        id: this.#getIdFromObject(obj.properties),
        delayBetweenAttacks: 1000,
        delayFromSceneStart: 1000,
      });
      smashers.push(smasher);
    }
    return smashers;
  }

  #createBridges(tiledMapData: Phaser.Tilemaps.Tilemap): Bridge[] {
    const bridges: Bridge[] = [];
    const layerData = tiledMapData.getObjectLayer(TILED_OBJECT_LAYER_NAMES.BRIDGES);
    if (!layerData) {
      return bridges;
    }
    const rawObjects = layerData.objects;
    for (const rawObject of rawObjects) {
      const parsedObject = TiledSchema.TiledBridgeObjectSchema.safeParse(rawObject);
      if (!parsedObject.success) {
        console.warn(
          `[${GameScene.name}:#createBridges] encountered error while parsing tiled map data`,
          parsedObject.error,
        );
        continue;
      }
      const obj = parsedObject.data;
      const bridge = new Bridge({
        scene: this,
        x: obj.x,
        y: obj.y,
        id: this.#getIdFromObject(obj.properties),
        stops: this.#getStopsFromObject(obj.properties),
        width: obj.width,
        height: obj.height,
      });
      bridges.push(bridge);
    }
    return bridges;
  }

  #getStopsFromObject(objectProperties: TiledSchema.TiledObjectProperty[]): number[] {
    const stopsProp = objectProperties.find((prop) => prop.name === TiledSchema.TILED_BRIDGE_PROPERTY_NAME.STOPS);
    if (!stopsProp) {
      return [];
    }
    const parsedProperty = TiledSchema.TiledStopsPropertySchema.safeParse(stopsProp);
    if (!parsedProperty.success) {
      return [];
    }
    return parsedProperty.data.value.split(',').map((val) => parseInt(val, 10));
  }
}
