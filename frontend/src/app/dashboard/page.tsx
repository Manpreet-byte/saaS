import React from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/layout/sidebar';  
import { Header } from '@/components/layout/header';
import { KPICard } from '@/components/dashboard/kpi-card';
import { ReviewTrendChart, RatingDistributionChart, SentimentChart } from '@/components/dashboard/charts';
import { ReviewList } from '@/components/dashboard/review-list';
import { mockDashboardData } from '@/lib/mock-data';
import { ArrowRight, QrCode } from 'lucide-react';

export const metadata = {
  title: 'Dashboard | Review Automation',
};

export default function DashboardPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="card mb-8 overflow-hidden border-cyan-100 bg-gradient-to-r from-white/90 via-cyan-50/80 to-blue-100/70 dark:border-cyan-900/60 dark:from-slate-900/90 dark:via-slate-900/70 dark:to-cyan-950/30">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="display-font text-xs font-semibold uppercase tracking-[0.14em] text-cyan-700 dark:text-cyan-300">Business Pulse</p>
                <h1 className="display-font mt-2 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">Dashboard</h1>
                <p className="mt-2 max-w-xl text-slate-600 dark:text-slate-300">Welcome back. Your review health is trending up this week with improved response velocity.</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white/80 px-4 py-2 text-sm font-semibold text-cyan-700 dark:border-cyan-800 dark:bg-slate-900/70 dark:text-cyan-300">
                +12.8% this month
              </div>
            </div>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {mockDashboardData.kpis.map((kpi, i) => (
              <KPICard
                key={i}
                icon={kpi.icon}
                label={kpi.label}
                value={kpi.value}
                change={kpi.change}
                trend={kpi.trend}
              />
            ))}
          </div>

          <div className="card mb-8 border-cyan-100 bg-gradient-to-r from-cyan-50/80 via-white to-blue-50/70 dark:border-cyan-900/60 dark:from-slate-900/90 dark:via-slate-900/70 dark:to-cyan-950/30">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="inline-flex rounded-xl bg-cyan-100 p-2.5 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300">
                  <QrCode size={18} />
                </div>
                <div>
                  <h2 className="display-font text-lg font-semibold text-slate-900 dark:text-white">QR Scan Landing Live</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Create offline-to-online review journeys with a dedicated scan page.</p>
                </div>
              </div>
              <Link
                href="/qr-scan"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:translate-y-[-1px] hover:shadow-xl"
              >
                Open QR Page
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ReviewTrendChart data={mockDashboardData.trendData} />
            <RatingDistributionChart data={mockDashboardData.ratingData} />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ReviewList reviews={mockDashboardData.reviews} />
            </div>
            <div>
              <SentimentChart data={mockDashboardData.sentimentData} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
