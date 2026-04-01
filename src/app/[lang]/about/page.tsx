import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries";
import styles from "@/app/[lang]/about/About.module.css";

const TELEGRAM_URL = "https://t.me/yourusername";
const INSTAGRAM_URL = "https://instagram.com/yourusername";
const PHONE_DISPLAY = "+1 (555) 000-0000";
const PHONE_TEL = "+15550000000";

type Props = { params: Promise<{ lang: string }> };

export default async function AboutPage({ params }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  const t = dict.about;

  return (
    <div className={styles.page}>
      <div className={styles.intro}>
        <h1>{t.heading}</h1>
        <p>{t.bio1}</p>
        <p>{t.bio2}</p>
      </div>

      <section className={styles.contacts} aria-labelledby="contacts-heading">
        <h2 id="contacts-heading" className={styles.contactsTitle}>
          {t.contact_heading}
        </h2>
        <ul className={styles.contactList}>
          <li>
            <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer">
              Telegram
            </a>
          </li>
          <li>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          </li>
          <li>
            <a href={`tel:${PHONE_TEL}`}>{PHONE_DISPLAY}</a>
          </li>
        </ul>
      </section>

      <p className={styles.mainCta}>
        {t.cta.split("\n").map((line, i) => (
          <span key={i}>
            {line}
            <br />
          </span>
        ))}
      </p>
    </div>
  );
}
