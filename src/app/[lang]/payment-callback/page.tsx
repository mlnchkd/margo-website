"use client";
import { Suspense, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";

function PaymentCallbackInner() {
  const params = useParams();
  const searchParams = useSearchParams();

  useEffect(() => {
    const lang = params.lang as string;
    const preset = searchParams.get("preset") ?? "";
    const downloadUrl = `/${lang}/download?preset=${encodeURIComponent(preset)}`;

    // Monobank redirects the iframe to this page after payment.
    // Since this page is same-origin as the parent, we can navigate
    // the parent window directly to the download page.
    if (window.top && window !== window.top) {
      window.top.location.href = downloadUrl;
    } else {
      window.location.href = downloadUrl;
    }
  }, [params.lang, searchParams]);

  return null;
}

export default function PaymentCallbackPage() {
  return (
    <Suspense>
      <PaymentCallbackInner />
    </Suspense>
  );
}
