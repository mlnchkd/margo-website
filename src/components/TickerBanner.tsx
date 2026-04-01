"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import styles from "./TickerBanner.module.css";

type Props = {
  lang: string;
  tickerText: string;
};

const REPEAT = 10;

export function TickerBanner({ lang, tickerText }: Props) {
  const pathname = usePathname();
  const isPresets = pathname.startsWith(`/${lang}/presets`) || pathname === `/${lang}/presets`;

  useEffect(() => {
    if (isPresets) {
      document.documentElement.classList.add("has-ticker");
    } else {
      document.documentElement.classList.remove("has-ticker");
    }
    return () => {
      document.documentElement.classList.remove("has-ticker");
    };
  }, [isPresets]);

  if (!isPresets) return null;

  const content = tickerText.repeat(REPEAT);

  return (
    <div className={styles.wrapper}>
      <div className={styles.track}>
        <span className={styles.content} aria-hidden="true">{content}</span>
        <span className={styles.content}>{content}</span>
      </div>
    </div>
  );
}
