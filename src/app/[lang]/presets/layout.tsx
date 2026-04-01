import type { ReactNode } from "react";
import styles from "@/app/[lang]/presets/presets-layout.module.css";

export default function PresetsLayout({ children }: { children: ReactNode }) {
  return <div className={styles.presetsShell}>{children}</div>;
}
