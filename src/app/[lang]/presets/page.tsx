import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { presetPacks } from "@/lib/presets";
import { getDictionary, hasLocale } from "../dictionaries";
import styles from "@/app/[lang]/presets/presets-index.module.css";

type Props = { params: Promise<{ lang: string }> };

const featured = presetPacks.slice(0, 2);

export default async function PresetsIndexPage({ params }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <div className={styles.page}>
      <ul className={styles.grid}>
        {featured.map((pack, i) => (
          <li key={pack.slug} className={styles.card}>
            <Link
              href={`/${lang}/presets/${pack.slug}`}
              className={styles.cardLink}
            >
              <div className={styles.imageWrap}>
                <Image
                  src={pack.coverImage}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className={styles.image}
                  priority
                />
                <div className={styles.overlay} />
              </div>
              <div className={styles.meta}>
                <span className={styles.index}>0{i + 1}</span>
                <span className={styles.cardTitle}>{pack.title}</span>
                <span className={styles.arrow}>→</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
