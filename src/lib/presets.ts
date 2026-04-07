export type PresetPair = {
  index: number;
  fileIndex: number;
  name: string;
  aspectRatio: [number, number];
};

export type PresetPack = {
  slug: string;
  imagesFolder: string;
  title: string;
  priceKopecks: number;
  priceDisplay: string;
  fileBasename: string;
  coverImage: string;
  pairs: { name: string; aspectRatio: [number, number]; fileIndex: number }[];
};

export const presetPacks: PresetPack[] = [
  {
    slug: "film-feel",
    imagesFolder: "film-feel",
    title: "FILM FEEL",
    priceKopecks: 49900,
    priceDisplay: "499 ₴",
    fileBasename: "margophotoo-cool-film.zip",
    coverImage: "https://picsum.photos/seed/cool-film-2/900/1100",
    pairs: [
      { name: "Bloom", aspectRatio: [4016, 6016], fileIndex: 1 },
      { name: "Honeydew", aspectRatio: [3989, 5975], fileIndex: 2 },
      { name: "Sunmilk", aspectRatio: [5913, 3947], fileIndex: 3 },
      { name: "Coconut Glow", aspectRatio: [1200, 1593], fileIndex: 4 },
      { name: "Rosy Mist", aspectRatio: [3024, 4032], fileIndex: 5 },
      { name: "Cloudberry", aspectRatio: [4016, 6016], fileIndex: 6 },
      { name: "Vanilla Wave", aspectRatio: [4284, 5712], fileIndex: 7 },
      { name: "Melon Dust", aspectRatio: [3917, 5867], fileIndex: 8 },
      { name: "Apricot Blur", aspectRatio: [1200, 1600], fileIndex: 9 },
      { name: "Luna Cream", aspectRatio: [736, 1308], fileIndex: 10 },
    ],
  },
];

export function getPresetPackBySlug(slug: string): PresetPack | undefined {
  return presetPacks.find((pack) => pack.slug === slug);
}

const CLOUDINARY_BASE =
  "https://res.cloudinary.com/duodyvg1h/image/upload/f_auto,q_auto";

export function getPresetPairImageUrl(
  pack: PresetPack,
  pair: PresetPair,
  side: "before" | "after",
): string {
  return `${CLOUDINARY_BASE}/presets/${pack.imagesFolder}/${pair.fileIndex}-${side}.jpg`;
}

export function getPresetPairs(pack: PresetPack): PresetPair[] {
  return pack.pairs.map((pair, index) => ({
    index,
    fileIndex: pair.fileIndex,
    name: pair.name,
    aspectRatio: pair.aspectRatio,
  }));
}
