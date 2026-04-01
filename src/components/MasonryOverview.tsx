"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getStableImageUrl, type MixedPortfolioImage } from "@/lib/portfolio";
import styles from "./MasonryOverview.module.css";

type MasonryOverviewProps = {
  lang: string;
  images: MixedPortfolioImage[];
};

export function MasonryOverview({ lang, images }: MasonryOverviewProps) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let animationFrame = 0;

    const onScroll = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        setScrollY(window.scrollY);
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const imageHeights = useMemo(() => [280, 360, 320, 420, 300, 380], []);

  return (
    <section className={styles.masonry}>
      {images.map((image, idx) => {
        const height = imageHeights[idx % imageHeights.length];
        const innerOffset = Math.sin(scrollY * 0.003 + idx * 0.7) * 14;

        return (
          <Link
            key={`${image.projectSlug}-${image.id}-${idx}`}
            href={`/${lang}/projects/${image.projectSlug}/photo/${image.imageIndex}`}
            className={styles.item}
          >
            <div className={styles.frame} style={{ height: `${height}px` }}>
              <Image
                src={getStableImageUrl(image.projectSlug, image.id, 900, 1200)}
                alt={image.caption}
                width={900}
                height={1200}
                className={styles.image}
                style={{ transform: `translate3d(0, ${innerOffset}px, 0)` }}
              />
            </div>
          </Link>
        );
      })}
    </section>
  );
}
