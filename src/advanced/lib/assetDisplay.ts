import type { AssetDefinition } from '@/simulation/types';

/**
 * Returns display name and description for an asset directly from the catalog.
 * Advanced mode assets have their own names (including fractional info).
 */
export function getAssetDisplay(asset: AssetDefinition, _lang: 'et' | 'en'): { name: string; description: string } {
  return {
    name: asset.name,
    description: asset.description || `${asset.name} — ${asset.sector} sector asset.`,
  };
}
