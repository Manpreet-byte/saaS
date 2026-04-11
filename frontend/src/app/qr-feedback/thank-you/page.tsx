'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Star, Sparkles } from 'lucide-react';

export default function FeedbackThankYouPage() {
  const searchParams = useSearchParams();
  const rating = Number(searchParams?.get('rating') || 0);
  const isHighRating = rating >= 4;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_10%_10%,rgba(168,85,247,0.14),transparent_40%),radial-gradient(circle_at_90%_0%,rgba(236,72,153,0.16),transparent_36%),#f6f0fb] px-4 py-10">
      <section className="mx-auto w-full max-w-xl rounded-3xl border border-white/60 bg-white p-8 text-center shadow-[0_24px_50px_-28px_rgba(91,33,182,0.4)] sm:p-10">
        <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 size={30} />
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-purple-700">
          <Sparkles size={14} />
          Feedback Received
        </div>

        <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900">
          {isHighRating ? 'We Value Your Feedback!' : 'Thanks For Helping Us Improve'}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-base leading-7 text-slate-600">
          {isHighRating
            ? 'Thank you for the positive rating. Your response helps us grow and serve even better.'
            : 'Thank you for sharing your experience. We have noted your feedback and will work on improvements.'}
        </p>

        {rating > 0 && (
          <div className="mt-6 flex items-center justify-center gap-1">
            {[1, 2, 3, 4, 5].map((item) => (
              <Star
                key={item}
                size={24}
                className={item <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
              />
            ))}
          </div>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href={isHighRating ? '/review-funnel' : '/dashboard'}
            className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-purple-500 hover:text-purple-700"
          >
            {isHighRating ? 'Open Review Funnel' : 'Go to Dashboard'}
          </Link>
          <Link
            href="/qr-feedback"
            className="rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/25 transition hover:translate-y-[-1px] hover:shadow-xl"
          >
            {isHighRating ? 'Rate Again' : 'Submit Another Response'}
          </Link>
        </div>
      </section>
    </main>
  );
}
