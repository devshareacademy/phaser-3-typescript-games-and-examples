import { z } from 'zod';
import { SPRITE_SHEET_ASSET_KEYS } from '../game/assets/asset-keys';

export const ANIMATION_KEY = {
  NPC_1_IDLE: 'NPC_1_IDLE',
  NPC_1_WALK: 'NPC_1_WALK',
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
