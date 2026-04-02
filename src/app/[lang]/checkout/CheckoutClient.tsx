"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { PresetPack } from "@/lib/presets";
import type { Dictionary } from "../dictionaries";
import styles from "./checkout.module.css";

type Props = {
  lang: string;
  pack: PresetPack;
  dict: Dictionary["checkout"];
};

type InvoiceState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; pageUrl: string };

export function CheckoutClient({ lang, pack, dict }: Props) {
  const [invoice, setInvoice] = useState<InvoiceState>({ status: "loading" });

  useEffect(() => {
    fetch("/api/invoice/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ preset: pack.slug, lang }),
    })
      .then((res) => res.json())
      .then((data: { pageUrl?: string; invoiceId?: string; error?: string }) => {
        if (data.pageUrl && data.invoiceId) {
          sessionStorage.setItem("mono_invoice_id", data.invoiceId);
          setInvoice({ status: "ready", pageUrl: data.pageUrl });
        } else {
          setInvoice({ status: "error" });
        }
      })
      .catch(() => setInvoice({ status: "error" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.page}>
      <p className={styles.back}>
        <Link href={`/${lang}/presets/${pack.slug}`}>{dict.back}</Link>
      </p>

      <h1 className={styles.title}>{pack.title}</h1>

      {invoice.status === "loading" && (
        <div className={styles.state}>{dict.loading}</div>
      )}

      {invoice.status === "error" && (
        <div className={styles.stateError}>{dict.error}</div>
      )}

      {invoice.status === "ready" && (
        <div className={styles.frameWrap}>
          <iframe
            id="payFrame"
            title="monopay"
            src={invoice.pageUrl}
            allow="payment *"
            width="576"
            height="576"
            style={{ borderRadius: "24px", border: "none" }}
          />
        </div>
      )}
    </div>
  );
}
