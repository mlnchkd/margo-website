export type PresetPair = {
  index: number;
};

export type PresetPack = {
  slug: string;
  title: string;
  priceKopecks: number;
  priceDisplay: string;
  fileBasename: string;
  pairCount: number;
};

export const presetPacks: PresetPack[] = [
  {
    slug: "warm-editorial",
    title: "Warm Editorial",
    priceKopecks: 49900,
    priceDisplay: "499 ₴",
    fileBasename: "warm-editorial.zip",
    pairCount: 10,
  },
  {
    slug: "cool-film",
    title: "Cool Film",
    priceKopecks: 49900,
    priceDisplay: "499 ₴",
    fileBasename: "cool-film.zip",
    pairCount: 12,
  },
];

export function getPresetPackBySlug(slug: string): PresetPack | undefined {
  return presetPacks.find((pack) => pack.slug === slug);
}

export function getPresetPairImageUrl(
  packSlug: string,
  pairIndex: number,
  side: "before" | "after",
  width: number,
  height: number,
): string {
  return `https://picsum.photos/seed/${packSlug}-${side}-${pairIndex}/${width}/${height}`;
}

export function getPresetPairs(pack: PresetPack): PresetPair[] {
  return Array.from({ length: pack.pairCount }, (_, index) => ({ index }));
}
