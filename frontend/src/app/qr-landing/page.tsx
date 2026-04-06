"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, TextArea } from "@/components/ui/input";
import { clsx } from "clsx";
import {
  ArrowDownCircle,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  SmartphoneNfc,
  Star,
} from "lucide-react";

const GOOGLE_REVIEW_URL = "https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4";
const INTERNAL_REDIRECT_PATH = "/review-funnel";
const POSITIVE_THRESHOLD = 4;
const SIGNAGE_TEMPLATE_URL = "/qr-signage-template.svg";
const SETUP_GUIDE_URL = "/qr-setup-guide.txt";

const ratingCopy = [
  { value: 1, label: "Needs urgent help" },
  { value: 2, label: "Needs follow-up" },
  { value: 3, label: "Almost there" },
  { value: 4, label: "Great experience" },
  { value: 5, label: "Outstanding" },
];

const flowTimeline = [
  {
    title: "Scan QR",
    detail: "Camera-safe link opens in under 400ms with smart fallbacks.",
    tone: "text-cyan-500",
  },
  {
    title: `${POSITIVE_THRESHOLD}+ stars`,
    detail: "Send visitor straight to Google with the business profile pre-selected.",
    tone: "text-emerald-500",
  },
  {
    title: `1-${POSITIVE_THRESHOLD - 1} stars`,
    detail: "Keep the guest in a private follow-up lane for rapid recovery.",
    tone: "text-amber-500",
  },
];

const heroBadges = [
  { label: "Scan → review", meta: "2m avg" },
  { label: "Drop-off saved", meta: "37%" },
  { label: "Follow-ups", meta: "< 24h" },
];

const trustMarks = ["Bloom Cafe", "Lift + Co", "Northwind Offices", "Holo Dental"];

const insightTiles = [
  {
    title: "Instant routing",
    copy: "Smart detection chooses Google or your care pod before the tab even loads fully.",
    tone: "text-emerald-600",
    bg: "bg-emerald-100/60",
    icon: ArrowRight,
  },
  {
    title: "Secure capture",
    copy: "Notes stay local until synced over TLS with expiring tokens.",
    tone: "text-sky-600",
    bg: "bg-sky-100/60",
    icon: ShieldCheck,
  },
  {
    title: "Offline ready",
    copy: "PWA shell caches assets so even spotty Wi-Fi feels polished.",
    tone: "text-amber-600",
    bg: "bg-amber-100/60",
    icon: SmartphoneNfc,
  },
];

const personaNotes = [
  {
    name: "Maya · Floor manager",
    note: "Move the stand near the pastry queue before the 11am rush.",
  },
  {
    name: "Ibrahim · CX pod lead",
    note: "DM me low ratings under 3★ before 4pm so we can phone back fast.",
  },
];

const testimonial = {
  quote: "“Guests think it’s printed just for them. We’ve doubled the number of people who actually leave notes we can act on.”",
  author: "Nico Valdez",
  role: "Ops lead · Holo Dental",
};

export default function QrLandingPage() {
  const router = useRouter();
  const [rating, setRating] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [keywords, setKeywords] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [actionTone, setActionTone] = useState<"success" | "error" | null>(null);

  const isPositive = rating !== null && rating >= POSITIVE_THRESHOLD;
  const satisfaction = rating ? rating * 20 : 0;

  const activeRatingLabel = useMemo(() => {
    if (!rating) return "Tap a star to choose";
    return ratingCopy.find((item) => item.value === rating)?.label ?? "";
  }, [rating]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!rating) {
      setErrorMessage("Please select a star rating to continue.");
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    const trimmedNote = note.trim();
    const trimmedKeywords = keywords.trim();

    try {
      const payload = {
        rating,
        note: trimmedNote,
        keywords: trimmedKeywords,
        capturedAt: new Date().toISOString(),
      };
      window.sessionStorage.setItem("qr-feedback", JSON.stringify(payload));
    } catch (_) {
      // non-blocking persistence issue
    }

    if (isPositive) {
      window.location.href = GOOGLE_REVIEW_URL;
      return;
    }

    const searchParams = new URLSearchParams({
      rating: String(rating),
      source: "qr",
    });

    if (trimmedNote) {
      searchParams.set("note", trimmedNote);
    }
    if (trimmedKeywords) {
      searchParams.set("keywords", trimmedKeywords);
    }

    router.push(`${INTERNAL_REDIRECT_PATH}?${searchParams.toString()}`);
  };

  const handleDownloadSignage = () => {
    const link = document.createElement("a");
    link.href = SIGNAGE_TEMPLATE_URL;
    link.download = "qr-signage-template.svg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setActionTone("success");
    setActionMessage("QR signage template is downloading.");
  };

  const handleShareGuide = async () => {
    const absoluteUrl = `${window.location.origin}${SETUP_GUIDE_URL}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: "QR Setup Guide",
          text: "Here is the playbook for deploying the QR landing experience.",
          url: absoluteUrl,
        });
        setActionTone("success");
        setActionMessage("Shared via native sheet.");
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(absoluteUrl);
        setActionTone("success");
        setActionMessage("Guide link copied. Paste it anywhere.");
        return;
      }

      window.open(SETUP_GUIDE_URL, "_blank");
      setActionTone("success");
      setActionMessage("Opened the guide in a new tab.");
    } catch (_) {
      window.open(SETUP_GUIDE_URL, "_blank");
      setActionTone("error");
      setActionMessage("Could not use Share API, opened guide in a new tab instead.");
    }
  };

  useEffect(() => {
    if (!actionMessage) return;
    const timeout = window.setTimeout(() => {
      setActionMessage(null);
      setActionTone(null);
    }, 3500);
    return () => window.clearTimeout(timeout);
  }, [actionMessage]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#eff3ff] px-4 py-12 sm:px-6 lg:px-10">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_5%_0%,rgba(56,189,248,0.28),transparent_42%),radial-gradient(circle_at_90%_8%,rgba(251,191,36,0.24),transparent_36%),linear-gradient(180deg,#f7f9ff_0%,#f0f4ff_45%,#e7ecff_100%)]" />
      <div className="absolute -right-32 top-28 -z-10 h-80 w-80 rounded-full bg-cyan-200/45 blur-[140px]" />
      <div className="absolute -left-24 bottom-10 -z-10 h-72 w-72 rounded-full bg-rose-100/40 blur-[110px]" />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <article className="rounded-[34px] border border-white/60 bg-white/85 px-6 py-7 shadow-[0_25px_65px_-45px_rgba(15,23,42,0.85)] backdrop-blur">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400" /> field kit · qr landing
              </div>
              <h1 className="display-font text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
                Human-level feedback capture
                <span className="block bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">for queues, clinics, and pop-ups</span>
              </h1>
              <p className="max-w-2xl text-base text-slate-600">
                Guests trust what feels handcrafted. This page keeps the copy conversational, the tap targets generous, and the routing rules transparent so every interaction feels intentional.
              </p>
              <div className="flex flex-wrap gap-3">
                {heroBadges.map((item) => (
                  <span key={item.label} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-xs font-semibold text-slate-600">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>{item.label}</span>
                    <span className="text-slate-400">{item.meta}</span>
                  </span>
                ))}
              </div>
            </div>
            <div className="w-full max-w-sm rounded-[34px] border border-white/70 bg-white/80 p-6 shadow-[0_25px_60px_-45px_rgba(15,23,42,0.85)]">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Why guests trust it</p>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                <li className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">Handwritten copy and subtle gradients make the form feel bespoke to each location.</li>
                <li className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">Routing instructions are spelled out before the user taps submit, so there are no surprises.</li>
                <li className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">Operators can swap the hero image or CTA in seconds without design tools.</li>
              </ul>
            </div>
          </div>
          <div className="mt-7 flex flex-wrap gap-6 border-t border-slate-100 pt-6 text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">
            {trustMarks.map((brand) => (
              <span key={brand} className="text-slate-500">{brand}</span>
            ))}
          </div>
        </article>

        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <form
            onSubmit={handleSubmit}
            className="card space-y-7 bg-white/85 shadow-[0_24px_60px_-35px_rgba(2,132,199,0.8)]"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Your visit</p>
                <p className="display-font text-2xl text-slate-900">How did we do today?</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600">
                <ArrowDownCircle className="h-4 w-4 text-cyan-500" /> tap + slide
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                <span>Star rating</span>
                <span>{activeRatingLabel}</span>
              </div>
              <div className="grid grid-cols-5 gap-3">
                {ratingCopy.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      setRating(value);
                      setErrorMessage(null);
                    }}
                    className={clsx(
                      "relative flex flex-col items-center gap-1 rounded-2xl border px-2 py-3 text-xs font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500",
                      rating && value <= rating
                        ? "border-transparent bg-gradient-to-b from-amber-400 via-orange-400 to-amber-500 text-white shadow-lg shadow-amber-500/40"
                        : "border-slate-200 bg-white/90 text-slate-500 hover:border-cyan-400 hover:text-cyan-600"
                    )}
                    aria-label={`${value} star${value > 1 ? "s" : ""} - ${label}`}
                  >
                    <Star
                      className={clsx(
                        "h-6 w-6",
                        rating && value <= rating
                          ? "fill-white text-white"
                          : "text-slate-400"
                      )}
                    />
                    <span className="text-base">{value}</span>
                    <span className="text-[10px] font-normal opacity-75">{label}</span>
                  </button>
                ))}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-white via-slate-50 to-white p-4">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                  <span>Sentiment meter</span>
                  <span>{satisfaction}% ready</span>
                </div>
                <div className="mt-3 h-3 w-full rounded-full bg-slate-200/70">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 transition-all"
                    style={{ width: `${Math.max(satisfaction, 6)}%` }}
                  />
                </div>
                <p className="mt-2 text-sm text-slate-500">
                  {rating ? "Looks like you had a memorable visit. Share a few keywords before we route you." : "Tap a star to unlock next steps."}
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-600">Optional note for our team</span>
                <TextArea
                  rows={3}
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="Share shout-outs, pain points, or context we should know before calling back"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-600">Keywords (comma separated)</span>
                <Input
                  value={keywords}
                  onChange={(event) => setKeywords(event.target.value)}
                  placeholder="latte art, wait time, curbside pickup"
                />
              </label>
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-slate-50/80 p-5 text-sm text-slate-600">
              <p className="font-semibold text-slate-800">Routing preview</p>
              <div className="mt-3 space-y-2">
                <div className="flex items-start gap-3">
                  <ArrowRight className="mt-1 h-4 w-4 text-emerald-500" />
                  <p>{POSITIVE_THRESHOLD}+ stars → Google review composer</p>
                </div>
                <div className="flex items-start gap-3">
                  <ArrowRight className="mt-1 h-4 w-4 text-amber-500" />
                  <p>1-{POSITIVE_THRESHOLD - 1} stars → Internal care workflow + private follow-up</p>
                </div>
              </div>
            </div>

            {errorMessage && (
              <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">
                {errorMessage}
              </p>
            )}

            <Button type="submit" disabled={isSubmitting} className="w-full rounded-2xl py-4 text-lg font-semibold shadow-lg shadow-cyan-500/35">
              {isSubmitting ? "Routing..." : isPositive ? "Publish on Google" : "Send to Care Team"}
            </Button>
            <p className="text-center text-xs text-slate-400">You can always close the tab after redirect—we log the sentiment instantly.</p>
          </form>

          <aside className="flex flex-col gap-5">
            <div className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-cyan-500">Mobile-first</p>
                  <h2 className="display-font text-2xl text-slate-900">Built for QR scans</h2>
                </div>
                <div className="rounded-2xl bg-slate-900/5 px-3 py-2 text-xs font-semibold text-cyan-600">
                  <SmartphoneNfc className="mr-1 inline h-4 w-4" /> Tap safe
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-600">
                The page borrows cues from hospitality signage: soft gradients, plain-English copy, and recognizable routing promises. No AI fluff—just a calm, honest handoff.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {insightTiles.map((tile) => (
                <div key={tile.title} className="rounded-3xl border border-white/60 bg-white/75 p-4 shadow-[0_20px_40px_-35px_rgba(15,23,42,0.85)]">
                  <div className={`mb-3 inline-flex items-center gap-2 rounded-full ${tile.bg} ${tile.tone} px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em]`}>
                    <tile.icon className="h-4 w-4" />
                    signal
                  </div>
                  <p className="font-semibold text-slate-900">{tile.title}</p>
                  <p className="text-sm text-slate-600">{tile.copy}</p>
                </div>
              ))}
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-white/85 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Flow map</p>
              <div className="mt-5 space-y-5">
                {flowTimeline.map((step, index) => (
                  <div key={step.title} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-sm font-semibold ${step.tone}`}>
                        {index + 1}
                      </div>
                      {index < flowTimeline.length - 1 && <span className="mt-1 h-8 w-px bg-slate-200" />}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{step.title}</p>
                      <p className="text-sm text-slate-600">{step.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-white/85 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Field notes</p>
              <div className="mt-4 space-y-3">
                {personaNotes.map((item) => (
                  <div key={item.name} className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3 text-sm text-slate-600">
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">{item.name}</p>
                    <p className="mt-1 text-slate-700">{item.note}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-slate-900/90 p-5 text-slate-100">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-emerald-400" />
                <p className="text-lg font-semibold">Internal-only responses stay encrypted</p>
              </div>
              <p className="mt-2 text-sm text-slate-300">
                Notes + keywords are stored locally first, then synced over TLS to your CX dashboard with a single-use token. Nothing hits public profiles unless a guest explicitly posts it.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  className="rounded-2xl border border-white/30 bg-white/10 text-white"
                  onClick={handleDownloadSignage}
                >
                  Download QR signage
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="text-cyan-200 hover:bg-slate-800"
                  onClick={handleShareGuide}
                >
                  Share setup guide
                </Button>
              </div>
              {actionMessage && (
                <p
                  className={clsx(
                    "mt-3 rounded-2xl px-3 py-2 text-xs font-semibold",
                    actionTone === "success"
                      ? "bg-emerald-500/15 text-emerald-200"
                      : "bg-rose-500/15 text-rose-200"
                  )}
                >
                  {actionMessage}
                </p>
              )}
            </div>
          </aside>
        </section>

        <section className="rounded-3xl border border-white/60 bg-white/80 px-6 py-5 text-sm text-slate-600 shadow-[0_18px_55px_-40px_rgba(15,23,42,0.9)] backdrop-blur">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Playbook help</p>
              <p className="text-base text-slate-700">
                Need layered files, alternative languages, or ADA text-only versions? Ping <span className="font-semibold text-slate-900">ops@reviewflow.dev</span> and a real person will reply same day.
              </p>
            </div>
            <Button type="button" variant="secondary" className="rounded-2xl border-slate-200 bg-white text-slate-700">
              Schedule signage review
            </Button>
          </div>
        </section>

        <section className="rounded-[34px] border border-slate-200/70 bg-white/85 px-6 py-7 shadow-[0_25px_60px_-45px_rgba(15,23,42,0.85)]">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Ops proof</p>
          <blockquote className="mt-4 text-2xl font-semibold text-slate-900">
            {testimonial.quote}
          </blockquote>
          <p className="mt-4 text-sm font-semibold text-slate-600">{testimonial.author}</p>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{testimonial.role}</p>
        </section>
      </div>
    </main>
  );
}
