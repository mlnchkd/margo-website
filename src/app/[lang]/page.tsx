import { MasonryOverview } from "@/components/MasonryOverview";
import { getMixedOverviewImages } from "@/lib/portfolio";

type Props = { params: Promise<{ lang: string }> };

export default async function Home({ params }: Props) {
  const { lang } = await params;
  const mixedImages = getMixedOverviewImages();
  return (
    <div>
      <MasonryOverview lang={lang} images={mixedImages} />
    </div>
  );
}
