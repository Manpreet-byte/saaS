'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Send, Star, Sparkles } from 'lucide-react';

export default function QrFeedbackPage() {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const router = useRouter();

  const title = useMemo(() => {
    if (rating >= 4) return 'Awesome! Thanks for your support';
    if (rating > 0) return "We're Sorry to Hear That";
    return 'How was your experience?';
  }, [rating]);

  const helperText = useMemo(() => {
    if (rating >= 4) {
      return 'Great to hear that. Please share a short highlight of what you liked most.';
    }
    if (rating > 0) {
      return 'Please tell us what went wrong. Your feedback helps us improve quickly.';
    }
    return 'Tap a star to rate your experience.';
  }, [rating]);

  const submitLabel = useMemo(() => {
    if (rating >= 4) return 'Submit & Continue';
    if (rating > 0) return 'Submit Feedback';
    return 'Submit Feedback';
  }, [rating]);

  const handleSubmit = () => {
    if (rating === 0) return;
    const query = new URLSearchParams({ rating: String(rating), comment: comment.trim() });
    router.push(`/qr-feedback/thank-you?${query.toString()}`);
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_10%_10%,rgba(168,85,247,0.14),transparent_40%),radial-gradient(circle_at_90%_0%,rgba(236,72,153,0.16),transparent_36%),#f6f0fb] px-4 py-10">
      <section className="mx-auto w-full max-w-xl overflow-hidden rounded-3xl border border-white/60 bg-white shadow-[0_24px_50px_-28px_rgba(91,33,182,0.4)]">
        <div className="bg-gradient-to-r from-purple-600 via-fuchsia-600 to-blue-600 px-6 py-10 text-center text-white">
          <Sparkles className="mx-auto mb-4" size={34} />
          <h1 className="text-4xl font-bold tracking-tight">We Value Your Feedback!</h1>
          <p className="mt-2 text-base text-white/90">Your opinion helps us improve our service</p>
        </div>

        <div className="space-y-6 px-6 py-8 sm:px-8">
          <h2 className="text-center text-3xl font-semibold text-slate-900">{title}</h2>

          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => {
              const active = (hovered || rating) >= star;
              return (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  onClick={() => setRating(star)}
                  className="rounded-lg p-1 transition-transform hover:scale-110"
                  aria-label={`Rate ${star} star`}
                >
                  <Star
                    size={42}
                    className={active ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
                  />
                </button>
              );
            })}
          </div>

          <p className="text-center text-sm text-slate-600">{helperText}</p>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">
              {rating >= 4 ? 'What did you like most?' : 'What could we improve?'}
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder={
                rating >= 4
                  ? 'Share what stood out in your experience...'
                  : 'Share your thoughts, suggestions, or concerns...'
              }
              className="w-full rounded-2xl border-2 border-purple-300/80 px-4 py-3 text-slate-700 outline-none transition focus:border-fuchsia-500"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={rating === 0}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 px-5 py-3 text-lg font-semibold text-white shadow-lg shadow-fuchsia-500/25 transition hover:translate-y-[-1px] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send size={18} />
            {submitLabel}
          </button>
        </div>
      </section>
    </main>
  );
}
