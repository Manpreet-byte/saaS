'use client';

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, Copy, Download, QrCode, ShieldCheck, Sparkles, Smartphone } from "lucide-react";

const features = [
  {
    title: "Instant Scan Flow",
    description: "Customers open camera and scan in one tap. No app install, no friction.",
    icon: QrCode,
  },
  {
    title: "Secure Redirect",
    description: "Every code is mapped to your verified landing endpoint with safe routing.",
    icon: ShieldCheck,
  },
  {
    title: "Mobile-First Experience",
    description: "Designed for fast interaction on low and high bandwidth devices.",
    icon: Smartphone,
  },
];

export default function QrScanLandingPage() {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const siteBaseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const feedbackUrl = `${siteBaseUrl}/qr-feedback`;

  const qrImageUrl = useMemo(() => {
    if (!feedbackUrl) {
      return "";
    }
    const encoded = encodeURIComponent(feedbackUrl);
    return `https://api.qrserver.com/v1/create-qr-code/?size=520x520&margin=20&data=${encoded}`;
  }, [feedbackUrl]);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(feedbackUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const handleDownloadQr = async () => {
    if (!qrImageUrl) {
      return;
    }
    try {
      setDownloading(true);
      const response = await fetch(qrImageUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch QR image");
      }
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = blobUrl;
      anchor.download = "review-qr-code.png";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(blobUrl);
    } catch {
      // Fallback opens QR image in a new tab if direct download fails.
      window.open(qrImageUrl, "_blank", "noopener,noreferrer");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50 px-4 py-12 sm:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_10%,rgba(6,182,212,0.18),transparent_38%),radial-gradient(circle_at_82%_2%,rgba(37,99,235,0.14),transparent_28%)]" />

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <div className="rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-[0_20px_50px_-24px_rgba(2,132,199,0.3)] backdrop-blur sm:p-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-700">
            <Sparkles size={14} />
            QR Experience Feature
          </div>

          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <h1 className="display-font text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
                Scan. Connect.
                <span className="block bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  Start Your Review Journey
                </span>
              </h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                This landing block introduces a focused QR scan flow so users can quickly reach your review funnel from posters,
                receipts, and offline touch points.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/review-funnel"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:translate-y-[-1px] hover:shadow-xl"
                >
                  Launch Flow
                  <ArrowRight size={17} />
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-cyan-500 hover:text-cyan-700"
                >
                  Go to Dashboard
                </Link>
              </div>
            </div>

            <div className="mx-auto w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_16px_35px_-20px_rgba(15,23,42,0.35)]">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="rounded-xl bg-white p-4">
                  {qrImageUrl ? (
                    <img
                      src={qrImageUrl}
                      alt="Review funnel QR code"
                      className="mx-auto h-56 w-56 rounded-lg object-contain"
                    />
                  ) : (
                    <div className="mx-auto h-56 w-56 animate-pulse rounded-lg bg-slate-100" />
                  )}
                </div>
                <label className="mt-4 block text-sm font-semibold text-slate-700">Feedback URL</label>
                <div className="mt-2 flex items-center gap-2">
                  <input
                    value={feedbackUrl}
                    readOnly
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none"
                  />
                  <button
                    onClick={handleCopyUrl}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700 transition hover:bg-cyan-200"
                    aria-label="Copy feedback URL"
                  >
                    <Copy size={16} />
                  </button>
                </div>
                <button
                  onClick={handleDownloadQr}
                  disabled={downloading}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:translate-y-[-1px] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <Download size={16} />
                  {downloading ? "Downloading..." : "Download QR Code"}
                </button>
                <div className="mt-3 flex items-center justify-between rounded-xl bg-cyan-50 px-3 py-2 text-sm text-cyan-800">
                  <span className="font-medium">{copied ? "URL Copied" : "Ready to Scan"}</span>
                  <CheckCircle2 size={16} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-3">
          {features.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-slate-200/70 bg-white/90 p-5 shadow-[0_8px_24px_-16px_rgba(2,132,199,0.35)]"
            >
              <div className="mb-3 inline-flex rounded-xl bg-cyan-100 p-2 text-cyan-700">
                <item.icon size={18} />
              </div>
              <h2 className="display-font text-xl font-semibold text-slate-900">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}
