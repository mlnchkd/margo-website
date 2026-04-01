import styles from "./Ticker.module.css";

const TEXT = "ALL PRESETS MADE WITH LOVE. ";
const REPEAT = 8;

export function Ticker() {
  const content = TEXT.repeat(REPEAT);

  return (
    <div className={styles.wrapper}>
      <div className={styles.track}>
        <span className={styles.content} aria-hidden="true">{content}</span>
        <span className={styles.content}>{content}</span>
      </div>
    </div>
  );
}
