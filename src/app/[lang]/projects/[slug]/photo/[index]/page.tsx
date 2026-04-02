import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug, getImageUrl, projects } from "@/lib/portfolio";
import styles from "./photo.module.css";

type Props = {
  params: Promise<{ lang: string; slug: string; index: string }>;
};

export function generateStaticParams() {
  const langs = ["en", "uk"];
  return langs.flatMap((lang) =>
    projects.flatMap((project) =>
      project.images.map((_, index) => ({
        lang,
        slug: project.slug,
        index: String(index),
      }))
    )
  );
}

export default async function ProjectPhotoPage({ params }: Props) {
  const { lang, slug, index } = await params;
  const project = getProjectBySlug(slug);
  const rawIndex = Number(index);

  if (!project || !Number.isInteger(rawIndex)) notFound();

  const currentIndex = Math.min(Math.max(rawIndex, 0), project.images.length - 1);
  const currentImage = project.images[currentIndex];
  const prevIndex = currentIndex === 0 ? project.images.length - 1 : currentIndex - 1;
  const nextIndex = currentIndex === project.images.length - 1 ? 0 : currentIndex + 1;
  const base = `/${lang}/projects/${project.slug}`;

  return (
    <div className={styles.page}>
      <p className={styles.back}>
        <Link href={base}>← {project.title}</Link>
      </p>

      <div className={styles.imageWrap}>
        <Image
          src={getImageUrl(currentImage.url, 1500)}
          alt={currentImage.caption}
          fill
          className={styles.image}
          priority
        />
      </div>

      <div className={styles.footer}>
        <span className={styles.caption}>{currentImage.caption}</span>
        <nav className={styles.nav}>
          <Link href={`${base}/photo/${prevIndex}`} className={styles.navLink}>← Prev</Link>
          <span className={styles.navDivider}>/</span>
          <Link href={`${base}/photo/${nextIndex}`} className={styles.navLink}>Next →</Link>
        </nav>
      </div>
    </div>
  );
}
