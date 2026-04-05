export type PresetPair = {
  index: number;
  name: string;
  aspectRatio: [number, number];
};

export type PresetPack = {
  slug: string;
  title: string;
  priceKopecks: number;
  priceDisplay: string;
  fileBasename: string;
  pairs: { name: string; aspectRatio: [number, number] }[];
};

export const presetPacks: PresetPack[] = [
  {
    slug: "presets",
    title: "ONE pack presets",
    priceKopecks: 49900,
    priceDisplay: "499 ₴",
    fileBasename: "cool-film.zip",
    pairs: [
      { name: "Bloom", aspectRatio: [4016, 6016] },
      { name: "Honeydew", aspectRatio: [3989, 5975] },
      { name: "Sunmilk", aspectRatio: [5913, 3947] },
      { name: "Coconut Glow", aspectRatio: [4016, 6016] },
      { name: "Rosy Mist", aspectRatio: [3024, 4032] },
      { name: "Cloudberry", aspectRatio: [4016, 6016] },
      { name: "Vanilla Wave", aspectRatio: [4284, 5712] },
      { name: "Melon Dust", aspectRatio: [3917, 5867] },
      { name: "Apricot Blur", aspectRatio: [4284, 5712] },
      { name: "Luna Cream", aspectRatio: [3641, 5330] },
    ],
  },
];

export function getPresetPackBySlug(slug: string): PresetPack | undefined {
  return presetPacks.find((pack) => pack.slug === slug);
}

const CLOUDINARY_BASE =
  "https://res.cloudinary.com/duodyvg1h/image/upload/f_auto,q_auto";

export function getPresetPairImageUrl(
  packSlug: string,
  pairIndex: number,
  side: "before" | "after",
): string {
  return `${CLOUDINARY_BASE}/presets/${packSlug}/${pairIndex + 1}-${side}.jpg`;
}

export function getPresetPairs(pack: PresetPack): PresetPair[] {
  return pack.pairs.map((pair, index) => ({
    index,
    name: pair.name,
    aspectRatio: pair.aspectRatio,
  }));
}
