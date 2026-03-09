import { getSharedAssetDisplay } from '../../data/sharedAssetMetadata';
import type { AssetDefinition } from '@/simulation/types';

/**
 * Returns display name and description for an asset, preferring shared metadata
 * from Classic mode when the ticker matches (for consistency across modes).
 */
export function getAssetDisplay(asset: AssetDefinition, lang: 'et' | 'en'): { name: string; description: string } {
  const shared = getSharedAssetDisplay(asset.ticker, lang);
  if (shared) return shared;
  return {
    name: asset.name,
    description: asset.description || `${asset.name} — ${asset.sector} sector asset.`,
  };
}
