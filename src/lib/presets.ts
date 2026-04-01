export type PresetPair = {
  index: number;
};

export type PresetPack = {
  slug: string;
  title: string;
  buyUrl: string;
  price: string;
  pairCount: number;
};

export const presetPacks: PresetPack[] = [
  {
    slug: "warm-editorial",
    title: "Warm Editorial",
    buyUrl: "https://example.com/buy/warm-editorial",
    price: "$29",
    pairCount: 10,
  },
  {
    slug: "cool-film",
    title: "Cool Film",
    buyUrl: "https://example.com/buy/cool-film",
    price: "$24",
    pairCount: 12,
  }
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
