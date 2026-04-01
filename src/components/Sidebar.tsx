"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Sidebar.module.css";
import { projects } from "@/lib/portfolio";
import { presetPacks } from "@/lib/presets";
import type { Dictionary } from "@/app/[lang]/dictionaries";

type SidebarProps = {
  lang: string;
  dict: Dictionary;
};

export function Sidebar({ lang, dict }: SidebarProps) {
  const pathname = usePathname();
  const isPresetsSection = pathname.includes("/presets");

  const alternateLang = lang === "en" ? "uk" : "en";
  const alternateHref = pathname.replace(`/${lang}`, `/${alternateLang}`);

  const mainLinks = [
    { href: `/${lang}`, label: dict.nav.overview },
    { href: `/${lang}/presets`, label: dict.nav.presets },
    { href: `/${lang}/about`, label: dict.nav.about },
  ];

  const isActive = (href: string) => {
    if (href === `/${lang}`) return pathname === `/${lang}`;
    return pathname.startsWith(href);
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>MARGOPHOTOO</div>
      {isPresetsSection && (
        <span className={styles.sectionLabel}>{dict.presets.section_label}</span>
      )}

      <nav className={styles.nav}>
        {mainLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`${styles.link} ${isActive(link.href) ? styles.active : ""}`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className={styles.spacer} />

      <section className={styles.photoshoots}>
        <ul className={styles.shootList}>
          {isPresetsSection
            ? presetPacks.map((pack) => (
                <li key={pack.slug} className={styles.shootName}>
                  <Link
                    href={`/${lang}/presets/${pack.slug}`}
                    className={`${styles.shootLink} ${
                      pathname === `/${lang}/presets/${pack.slug}` ? styles.active : ""
                    }`}
                  >
                    {pack.title}
                  </Link>
                </li>
              ))
            : projects.map((project) => (
                <li key={project.slug} className={styles.shootName}>
                  <Link
                    href={`/${lang}/projects/${project.slug}`}
                    className={`${styles.shootLink} ${
                      pathname.startsWith(`/${lang}/projects/${project.slug}`) ? styles.active : ""
                    }`}
                  >
                    {project.title}
                  </Link>
                </li>
              ))}
        </ul>
      </section>

      <div className={styles.langSpacer} />

      <div className={styles.langSwitch}>
        <span className={lang === "en" ? styles.langActive : styles.langInactive}>EN</span>
        <span className={styles.langDivider}>/</span>
        <Link
          href={alternateHref}
          className={lang === "uk" ? styles.langActive : styles.langInactive}
        >
          UA
        </Link>
      </div>
    </aside>
  );
}
