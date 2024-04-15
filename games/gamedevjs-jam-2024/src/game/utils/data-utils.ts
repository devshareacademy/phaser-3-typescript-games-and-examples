import { AnimationData, AnimationDataSchema } from '../schema/data-schema';
import { DATA_ASSET_KEYS } from '../assets/asset-keys';

export class DataUtils {
  /**
   * Utility function for retrieving the Animation objects from the animations.json data file.
   */
  static getAnimations(scene: Phaser.Scene): AnimationData {
    const rawData: unknown = scene.cache.json.get(DATA_ASSET_KEYS.ANIMATIONS);
    const parsedData = AnimationDataSchema.safeParse(rawData);
    if (!parsedData.success) {
      console.warn(`[${DataUtils.name}:#getAnimations] encountered error while parsing json data`, parsedData.error);
      return [];
    }
    return parsedData.data;
  }
}
