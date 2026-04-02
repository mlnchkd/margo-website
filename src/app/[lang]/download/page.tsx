import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries";
import { presetPacks } from "@/lib/presets";
import { DownloadClient } from "./DownloadClient";

type Props = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function DownloadPage({ params, searchParams }: Props) {
  const { lang } = await params;
  const { preset } = await searchParams;
  if (!hasLocale(lang)) notFound();

  const presetSlug = Array.isArray(preset) ? preset[0] : preset;
  const pack = presetPacks.find((p) => p.slug === presetSlug);
  if (!pack) notFound();

  const dict = await getDictionary(lang);

  return (
    <DownloadClient
      lang={lang}
      pack={pack}
      dict={dict.download}
    />
  );
}
