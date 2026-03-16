import { getSharedAssetDisplay } from '../../data/sharedAssetMetadata';
import type { AssetDefinition, Sector } from '@/simulation/types';

const SECTOR_LABELS: Record<'et' | 'en', Record<Sector, string>> = {
  et: { ETF: 'ETFid', STOCK: 'Aktsiad', CRYPTO: 'Krüptoraha', COMMODITY: 'Toorained' },
  en: { ETF: 'ETFs', STOCK: 'Stocks', CRYPTO: 'Crypto', COMMODITY: 'Commodities' },
};

/**
 * Returns display name and description for an asset, preferring shared metadata
 * from Classic mode when the ticker matches (for consistency across modes).
 */
export function getAssetDisplay(asset: AssetDefinition, lang: 'et' | 'en'): { name: string; description: string } {
  const shared = getSharedAssetDisplay(asset.ticker, lang);
  if (shared) return shared;
  const sectorLabel = SECTOR_LABELS[lang][asset.sector] ?? asset.sector;
  const fallbackDesc = lang === 'et'
    ? `${asset.name} — ${sectorLabel} sektori vara.`
    : `${asset.name} — ${sectorLabel} sector asset.`;
  return {
    name: asset.name,
    description: asset.description || fallbackDesc,
  };
}

/** Returns localized sector label for use in badges/modifiers. */
export function getSectorLabel(sector: Sector, lang: 'et' | 'en'): string {
  return SECTOR_LABELS[lang][sector] ?? sector;
}
