import { notFound } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { TickerBanner } from "@/components/TickerBanner";
import { getDictionary, hasLocale } from "./dictionaries";

type Props = {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
};

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "uk" }];
}

export default async function LangLayout({ children, params }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  return (
    <div className="app-shell">
      <TickerBanner lang={lang} tickerText={dict.ticker} />
      <Sidebar lang={lang} dict={dict} />
      <main className="content-area">{children}</main>
    </div>
  );
}
