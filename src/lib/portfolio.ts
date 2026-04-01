export type PortfolioImage = {
  id: number;
  caption: string;
};

export type PortfolioProject = {
  slug: string;
  title: string;
  images: PortfolioImage[];
};

export type MixedPortfolioImage = PortfolioImage & {
  projectSlug: string;
  projectTitle: string;
  imageIndex: number;
};

function buildImages(startId: number, topic: string): PortfolioImage[] {
  return Array.from({ length: 28 }, (_, idx) => {
    const number = idx + 1;
    return {
      id: startId + idx,
      caption: `${topic} - Frame ${number}`,
    };
  });
}

export const projects: PortfolioProject[] = [
  {
    slug: "netflix-four-seasons",
    title: "Netflix x The Four Seasons",
    images: buildImages(101, "Netflix x The Four Seasons"),
  },
  {
    slug: "jessica-chastain-marie-claire",
    title: "Jessica Chastain for Marie Claire",
    images: buildImages(121, "Jessica Chastain for Marie Claire"),
  },
  {
    slug: "taika-waititi-wired",
    title: "Taika Waititi for WIRED",
    images: buildImages(141, "Taika Waititi for WIRED"),
  },
  {
    slug: "steve-aoki-billboard",
    title: "Steve Aoki for Billboard",
    images: buildImages(161, "Steve Aoki for Billboard"),
  },
  {
    slug: "selena-gomez-fast-company",
    title: "Selena Gomez for Fast Company",
    images: buildImages(181, "Selena Gomez for Fast Company"),
  },
  {
    slug: "open-ai-wired",
    title: "Open AI for WIRED",
    images: buildImages(201, "Open AI for WIRED"),
  },
  {
    slug: "shogun-deadline",
    title: "Shogun for Deadline",
    images: buildImages(221, "Shogun for Deadline"),
  },
  {
    slug: "hacks-deadline",
    title: "Hacks for Deadline",
    images: buildImages(241, "Hacks for Deadline"),
  },
];

export function getProjectBySlug(slug: string): PortfolioProject | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getMixedOverviewImages(): MixedPortfolioImage[] {
  const maxLength = Math.max(...projects.map((project) => project.images.length));
  const mixed: MixedPortfolioImage[] = [];

  for (let imageIndex = 0; imageIndex < maxLength; imageIndex += 1) {
    projects.forEach((project) => {
      const image = project.images[imageIndex];
      if (!image) {
        return;
      }

      mixed.push({
        ...image,
        projectSlug: project.slug,
        projectTitle: project.title,
        imageIndex,
      });
    });
  }

  return mixed;
}

export function getStableImageUrl(
  projectSlug: string,
  imageId: number,
  width: number,
  height: number,
): string {
  return `https://picsum.photos/seed/${projectSlug}-${imageId}/${width}/${height}`;
}
