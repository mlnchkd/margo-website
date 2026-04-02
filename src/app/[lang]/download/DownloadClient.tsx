"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { PresetPack } from "@/lib/presets";
import type { Dictionary } from "../dictionaries";
import styles from "./download.module.css";

type Props = {
  lang: string;
  pack: PresetPack;
  dict: Dictionary["download"];
};

type DownloadState =
  | { status: "verifying" }
  | { status: "error"; message: string }
  | { status: "ready"; token: string; expiresAt: number }
  | { status: "expired" };

export function DownloadClient({ lang, pack, dict }: Props) {
  const [state, setState] = useState<DownloadState>({ status: "verifying" });

  useEffect(() => {
    const invoiceId = sessionStorage.getItem("mono_invoice_id");

    if (!invoiceId) {
      setState({ status: "error", message: dict.error_payment });
      return;
    }

    fetch("/api/invoice/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ invoiceId, preset: pack.slug }),
    })
      .then((res) => res.json())
      .then((data: { token?: string; expiresAt?: number; error?: string }) => {
        if (data.token && data.expiresAt) {
          setState({ status: "ready", token: data.token, expiresAt: data.expiresAt });
          const remaining = data.expiresAt - Date.now();
          if (remaining > 0) {
            setTimeout(() => setState({ status: "expired" }), remaining);
          }
        } else {
          setState({ status: "error", message: dict.error_payment });
        }
      })
      .catch(() => setState({ status: "error", message: dict.error_generic }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const downloadUrl =
    state.status === "ready"
      ? `/api/download?token=${state.token}&preset=${pack.slug}&expires=${state.expiresAt}`
      : "#";

  return (
    <div className={styles.page}>
      <p className={styles.back}>
        <Link href={`/${lang}/presets`}>{dict.back}</Link>
      </p>

      {state.status === "verifying" && (
        <div className={styles.state}>{dict.verifying}</div>
      )}

      {state.status === "error" && (
        <div className={styles.stateError}>
          <p>{state.message}</p>
        </div>
      )}

      {state.status === "expired" && (
        <div className={styles.stateError}>
          <p>{dict.expired}</p>
        </div>
      )}

      {state.status === "ready" && (
        <div className={styles.readyWrap}>
          <h1 className={styles.title}>{dict.ready_title}</h1>
          <p className={styles.warning}>⚠ {dict.warning}</p>
          <a href={downloadUrl} className={styles.downloadButton}>
            {dict.download_button}
          </a>
        </div>
      )}
    </div>
  );
}
