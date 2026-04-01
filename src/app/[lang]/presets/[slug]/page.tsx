import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPresetPackBySlug,
  getPresetPairs,
  getPresetPairImageUrl,
  presetPacks,
} from "@/lib/presets";
import { getDictionary, hasLocale } from "../../dictionaries";
import styles from "@/app/[lang]/presets/[slug]/pack.module.css";

type Props = {
  params: Promise<{ lang: string; slug: string }>;
};

export function generateStaticParams() {
  const langs = ["en", "uk"];
  return langs.flatMap((lang) =>
    presetPacks.map((pack) => ({ lang, slug: pack.slug }))
  );
}

export default async function PresetPackPage({ params }: Props) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();

  const pack = getPresetPackBySlug(slug);
  if (!pack) notFound();

  const dict = await getDictionary(lang);
  const t = dict.presets;
  const pairs = getPresetPairs(pack);

  return (
    <div>
      <p className={styles.back}>
        <Link href={`/${lang}/presets`}>{t.back}</Link>
      </p>

      <div className={styles.header}>
        <h1 className={styles.title}>{pack.title}</h1>
        <a href={pack.buyUrl} className={styles.buyButton} target="_blank" rel="noopener noreferrer">
          <span>{t.buy}</span>
          <span className={styles.buyPrice}>{pack.price}</span>
        </a>
      </div>

      <div className={styles.pairs}>
        {pairs.map((pair) => (
          <article key={pair.index} className={styles.pair}>
            <div className={styles.pairRow}>
              <figure className={styles.figure}>
                <span className={styles.label}>{t.before}</span>
                <div className={styles.imageWrap}>
                  <Image
                    src={getPresetPairImageUrl(pack.slug, pair.index, "before", 900, 650)}
                    alt={`${t.before} — ${pack.title} ${pair.index + 1}`}
                    width={900}
                    height={650}
                    className={styles.image}
                  />
                </div>
              </figure>
              <figure className={styles.figure}>
                <span className={styles.label}>{t.after}</span>
                <div className={styles.imageWrap}>
                  <Image
                    src={getPresetPairImageUrl(pack.slug, pair.index, "after", 900, 650)}
                    alt={`${t.after} — ${pack.title} ${pair.index + 1}`}
                    width={900}
                    height={650}
                    className={styles.image}
                  />
                </div>
              </figure>
            </div>
          </article>
        ))}
      </div>

        <div className={styles.footer}>
            <a href={pack.buyUrl} className={styles.buyButton} target="_blank" rel="noopener noreferrer">
                <span>{t.buy}</span>
                <span className={styles.buyPrice}>{pack.price}</span>
            </a>

            <h1 className={styles.title}>{pack.title}</h1>
        </div>
    </div>
  );
}
