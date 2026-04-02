"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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
  const [isOpen, setIsOpen] = useState(false);

  const isPresetsSection = pathname.includes("/presets");
  const alternateLang = lang === "en" ? "uk" : "en";
  const alternateHref = pathname.replace(`/${lang}`, `/${alternateLang}`);

  const mainLinks = [
    { href: `/${lang}`, label: dict.nav.overview },
    { href: `/${lang}/presets`, label: dict.nav.presets },
    { href: `/${lang}/about`, label: dict.nav.about },
  ];

  const subLinks = isPresetsSection
    ? presetPacks.map((pack) => ({
        href: `/${lang}/presets/${pack.slug}`,
        label: pack.title,
        active: pathname === `/${lang}/presets/${pack.slug}`,
      }))
    : projects.map((project) => ({
        href: `/${lang}/projects/${project.slug}`,
        label: project.title,
        active: pathname.startsWith(`/${lang}/projects/${project.slug}`),
      }));

  const isActive = (href: string) => {
    if (href === `/${lang}`) return pathname === `/${lang}`;
    return pathname.startsWith(href);
  };

  useEffect(() => { setIsOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      {/* Mobile header — always visible, hidden behind panel when open */}
      <header className={styles.mobileHeader}>
        <div className={styles.mobileLogo}>MARGOPHOTOO</div>
        <button
          className={styles.burger}
          onClick={() => setIsOpen(true)}
          aria-label="Open menu"
        >
          <span className={styles.burgerLine} />
          <span className={styles.burgerLine} />
          <span className={styles.burgerLine} />
        </button>
      </header>

      {/* Full-screen mobile panel */}
      <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`}>

        {/* Desktop logo */}
        <div className={styles.desktopLogo}>MARGOPHOTOO</div>

        {/* Panel top row (mobile only) */}
        <div className={styles.panelTop}>
          <div className={styles.mobilePanelLogo}>MARGOPHOTOO</div>
          <button
            className={styles.closeBtn}
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* Desktop section label */}
        {isPresetsSection && (
          <span className={styles.sectionLabel}>{dict.presets.section_label}</span>
        )}

        {/* Main nav */}
        <nav className={styles.nav}>
          {mainLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.link} ${isActive(link.href) ? styles.active : ""}`}
              style={isOpen ? { animationDelay: `${0.1 + i * 0.07}s` } : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Divider + sub-links */}
        <div
          className={styles.subSection}
          style={isOpen ? { animationDelay: "0.32s" } : undefined}
        >
          <div className={styles.divider} />
          <p className={styles.subLabel}>
            {isPresetsSection ? dict.presets.section_label : "Work"}
          </p>
          <ul className={styles.shootList}>
            {subLinks.map((item, i) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`${styles.shootLink} ${item.active ? styles.active : ""}`}
                  style={isOpen ? { animationDelay: `${0.36 + i * 0.05}s` } : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Lang switcher */}
        <div
          className={styles.langSwitch}
          style={isOpen ? { animationDelay: "0.45s" } : undefined}
        >
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
    </>
  );
}
