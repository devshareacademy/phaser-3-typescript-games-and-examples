import { z } from 'zod';
import { SPRITE_SHEET_ASSET_KEYS } from '../game/assets/asset-keys';

export const ANIMATION_KEY = {
  NPC_1_IDLE: 'NPC_1_IDLE',
  NPC_1_WALK: 'NPC_1_WALK',
  DOOR_CLOSED_TO_PARTIAL1_OPEN: 'DOOR_CLOSED_TO_PARTIAL1_OPEN',
  DOOR_PARTIAL1_OPEN_TO_PARTIAL2_OPEN: 'DOOR_PARTIAL1_OPEN_TO_PARTIAL2_OPEN',
  DOOR_PARTIAL2_OPEN_TO_OPEN: 'DOOR_PARTIAL2_OPEN_TO_OPEN',
  DOOR_OPEN_TO_CLOSED: 'DOOR_OPEN_TO_CLOSED',
  DOOR_PARTIAL2_OPEN_TO_CLOSED: 'DOOR_PARTIAL2_OPEN_TO_CLOSED',
  DOOR_PARTIAL1_OPEN_TO_CLOSED: 'DOOR_PARTIAL1_OPEN_TO_CLOSED',
} as const;
export const AnimationKeySchema = z.nativeEnum(ANIMATION_KEY);
export type AnimationKeyEnum = z.infer<typeof AnimationKeySchema>;

export const SpriteAssetKeyEnumSchema = z.nativeEnum(SPRITE_SHEET_ASSET_KEYS);
export type SpriteAssetKeyEnum = z.infer<typeof SpriteAssetKeyEnumSchema>;

export const AnimationSchema = z.object({
  key: AnimationKeySchema,
  frames: z.array(z.number()).optional(),
  frameRate: z.number(),
  repeat: z.number(),
  delay: z.number(),
  assetKey: SpriteAssetKeyEnumSchema,
  yoyo: z.boolean(),
});
export type Animation = z.infer<typeof AnimationSchema>;

export const AnimationDataSchema = z.array(AnimationSchema);
export type AnimationData = z.infer<typeof AnimationDataSchema>;
