"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getImageUrl, type PortfolioImage } from "@/lib/portfolio";
import styles from "./ProjectMasonry.module.css";

type ProjectMasonryProps = {
  lang: string;
  projectSlug: string;
  images: PortfolioImage[];
};

export function ProjectMasonry({ lang, projectSlug, images }: ProjectMasonryProps) {
  const [scrollY, setScrollY] = useState(0);
  const dramaticHeights = [230, 360, 520, 310, 660, 280, 470, 610, 340];

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

  return (
    <section className={styles.masonry}>
      {images.map((image, index) => {
        const height = dramaticHeights[index % dramaticHeights.length];
        const innerOffset = Math.sin(scrollY * 0.003 + index * 0.7) * 14;

        return (
          <Link key={index} href={`/${lang}/projects/${projectSlug}/photo/${index}`} className={styles.item}>
            <div className={styles.frame} style={{ height: `${height}px` }}>
              <Image
                src={getImageUrl(image.url, 900)}
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
