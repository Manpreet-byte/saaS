import Link from "next/link";
import { ArrowRight, BarChart3, Bot, Settings, Sparkles, QrCode } from "lucide-react";


export default function Home() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-14 sm:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_25%_20%,rgba(14,165,233,0.2),transparent_40%),radial-gradient(circle_at_75%_10%,rgba(250,204,21,0.17),transparent_32%)]" />
      <div className="mx-auto w-full max-w-5xl animate-fade-in">
        <div className="soft-panel mb-8 flex flex-wrap items-center justify-between gap-3">
          <p className="display-font text-sm font-semibold uppercase tracking-[0.16em] text-cyan-700 dark:text-cyan-300">
            Google Review Automation v1.0
          </p>
          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300">
            <Sparkles size={14} />
            AI-first response workflow
          </div>
        </div>

        <div className="mb-10 text-center">
          <h1 className="display-font mb-5 text-5xl font-bold leading-tight text-slate-900 sm:text-6xl dark:text-white">
            Review Automation
            <span className="block bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Built For Real Teams
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-300">
            Track review health, generate AI replies, and keep your Google profile active from one clean control center.
          </p>
        </div>

        <div className="mb-12 flex flex-wrap justify-center gap-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:translate-y-[-1px] hover:shadow-xl"
          >
            Open Dashboard
            <ArrowRight size={20} />
          </Link>
          <Link
            href="/settings"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white/85 px-6 py-3 font-semibold text-slate-800 transition hover:border-cyan-500 hover:text-cyan-700 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:text-cyan-300"
          >
            Configure Workspace
          </Link>
          <Link
            href="/qr-landing"
            className="inline-flex items-center gap-2 rounded-xl border border-cyan-200/80 bg-white/80 px-6 py-3 font-semibold text-cyan-700 shadow-sm transition hover:border-cyan-500 hover:text-cyan-600 dark:border-cyan-500/50 dark:bg-slate-900/80 dark:text-cyan-300"
          >
            Preview QR Landing
          </Link>
        </div>

        <div className="mb-12 rounded-2xl border border-cyan-200/70 bg-white/90 p-5 shadow-[0_10px_28px_-18px_rgba(2,132,199,0.4)] dark:border-cyan-900/60 dark:bg-slate-900/70">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="inline-flex rounded-xl bg-cyan-100 p-2.5 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300">
                <QrCode size={18} />
              </div>
              <div>
                <p className="display-font text-lg font-semibold text-slate-900 dark:text-white">New: QR Scan Landing</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Posters aur offline touchpoints ke liye dedicated scan flow ab live hai.
                </p>
              </div>
            </div>
            <Link
              href="/qr-scan"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:translate-y-[-1px] hover:shadow-xl"
            >
              Open QR Landing
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {[
            {
              title: "Performance Dashboard",
              desc: "Live KPI cards and trend analytics for your review performance.",
              icon: BarChart3,
            },
            {
              title: "AI Suggestions",
              desc: "Generate and refine context-aware responses before posting.",
              icon: Bot,
            },
            {
              title: "Workflow Settings",
              desc: "Tune integrations, alerts, and business profile defaults.",
              icon: Settings,
            },
          ].map((item, i) => (
            <div key={i} className="card group text-left">
              <div className="mb-4 inline-flex rounded-xl bg-cyan-100 p-2.5 text-cyan-700 transition group-hover:bg-cyan-600 group-hover:text-white dark:bg-cyan-900/40 dark:text-cyan-300">
                <item.icon size={18} />
              </div>
              <h3 className="display-font mb-2 text-xl font-semibold">{item.title}</h3>
              <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
