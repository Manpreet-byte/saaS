'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/sidebar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { Input, TextArea } from '@/components/ui/input';
import {
  ArrowRight,
  Copy,
  Edit3,
  Inbox,
  Loader2,
  MessageSquare,
  RefreshCw,
  Search,
  Send,
  ShieldAlert,
  Sparkles,
  Star,
} from 'lucide-react';
import {
  generateReviewResponse,
  listReviews,
  ReviewRecord,
  updateReviewResponse,
} from '@/lib/api/reviews';

type InboxReview = ReviewRecord & {
  localStatus: 'needs-feedback' | 'needs-response' | 'in-review' | 'resolved';
  draftResponse?: string;
};

const computeLocalStatus = (review: ReviewRecord): InboxReview['localStatus'] => {
  if (review.rating <= 3) {
    return 'needs-feedback';
  }

  return 'needs-response';
};

const toneByRating = (rating: number) => {
  if (rating <= 2) return 'apologetic';
  if (rating === 3) return 'professional';
  return 'friendly';
};

export default function InboxPage() {
  const router = useRouter();
  const [reviews, setReviews] = useState<InboxReview[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | InboxReview['localStatus']>('all');
  const [loading, setLoading] = useState(true);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadReviews = async () => {
      try {
        setLoading(true);
        const data = await listReviews();

        if (!isMounted) {
          return;
        }

        const nextReviews = data.map((review) => ({
          ...review,
          localStatus: computeLocalStatus(review),
        }));

        setReviews(nextReviews);
        setSelectedId((currentId) => currentId ?? nextReviews[0]?.id ?? null);
        setError(null);
      } catch (loadError) {
        if (isMounted) {
          setError(loadError instanceof Error ? loadError.message : 'Failed to load inbox');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadReviews();

    return () => {
      isMounted = false;
    };
  }, []);

  const selectedReview = useMemo(
    () => reviews.find((review) => review.id === selectedId) ?? null,
    [reviews, selectedId],
  );

  const filteredReviews = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return reviews.filter((review) => {
      const matchesSearch =
        !term ||
        review.comment.toLowerCase().includes(term) ||
        review.id.toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === 'all' || review.localStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [reviews, searchTerm, statusFilter]);

  const stats = useMemo(
    () => ({
      total: reviews.length,
      needsFeedback: reviews.filter((review) => review.localStatus === 'needs-feedback').length,
      needsResponse: reviews.filter((review) => review.localStatus === 'needs-response').length,
      inReview: reviews.filter((review) => review.localStatus === 'in-review').length,
      resolved: reviews.filter((review) => review.localStatus === 'resolved').length,
    }),
    [reviews],
  );

  const handleGenerate = async (review: InboxReview) => {
    try {
      setGeneratingId(review.id);
      const generated = await generateReviewResponse({
        reviewId: review.id,
        rating: review.rating,
        comment: review.comment,
        tone: toneByRating(review.rating),
      });

      setReviews((currentReviews) =>
        currentReviews.map((item) =>
          item.id === review.id
            ? { ...item, draftResponse: generated.responseText, localStatus: 'in-review' }
            : item,
        ),
      );
      setError(null);
    } catch (generateError) {
      setError(generateError instanceof Error ? generateError.message : 'Failed to generate response');
    } finally {
      setGeneratingId(null);
    }
  };

  const handleDraftChange = (reviewId: string, value: string) => {
    setReviews((currentReviews) =>
      currentReviews.map((item) =>
        item.id === reviewId ? { ...item, draftResponse: value } : item,
      ),
    );
  };

  const handleSend = async (review: InboxReview) => {
    if (!review.draftResponse?.trim()) {
      setError('Generate or edit a draft before sending it.');
      return;
    }

    try {
      setSavingId(review.id);
      setError(null);
      await updateReviewResponse({
        reviewId: review.id,
        responseText: review.draftResponse.trim(),
        rating: review.rating,
        comment: review.comment,
        tone: toneByRating(review.rating),
      });

      setReviews((currentReviews) =>
        currentReviews.map((item) =>
          item.id === review.id ? { ...item, localStatus: 'resolved' } : item,
        ),
      );
      setEditingId(null);
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : 'Failed to save reply');
    } finally {
      setSavingId(null);
    }
  };

  const handleCopy = async () => {
    if (!selectedReview?.draftResponse) {
      return;
    }

    await navigator.clipboard.writeText(selectedReview.draftResponse);
  };

  const handleOpenFeedbackForm = () => {
    router.push('/review-funnel');
  };

  return (
    <>
      <Sidebar />
      <main className="min-h-screen bg-slate-50 px-4 py-6 dark:bg-slate-950 sm:px-6 lg:ml-64 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="card overflow-hidden border-cyan-100 bg-gradient-to-r from-white via-cyan-50/70 to-blue-100/70 dark:border-cyan-900/60 dark:from-slate-900 dark:via-slate-900/70 dark:to-cyan-950/30">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="display-font text-xs font-semibold uppercase tracking-[0.14em] text-cyan-700 dark:text-cyan-300">
                  Unified Inbox
                </p>
                <h1 className="display-font mt-2 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
                  Review Inbox
                </h1>
                <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300">
                  Track incoming reviews, generate AI replies, and route low ratings into the private feedback form.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white/80 px-4 py-2 text-sm font-semibold text-cyan-700 dark:border-cyan-800 dark:bg-slate-900/70 dark:text-cyan-300">
                <Inbox size={16} /> {stats.total} reviews
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
            {[
              { label: 'Total', value: stats.total },
              { label: 'Needs feedback', value: stats.needsFeedback },
              { label: 'Needs response', value: stats.needsResponse },
              { label: 'In review', value: stats.inReview },
              { label: 'Resolved', value: stats.resolved },
            ].map((item) => (
              <Card key={item.label}>
                <CardBody className="space-y-2">
                  <p className="text-sm text-slate-500 dark:text-slate-400">{item.label}</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{item.value}</p>
                </CardBody>
              </Card>
            ))}
          </div>

          <Card>
            <CardBody className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Search reviews
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <Input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search by review text or review id"
                    className="pl-9"
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Filter
                </label>
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}
                  className="input-base w-full"
                >
                  <option value="all">All</option>
                  <option value="needs-feedback">Needs feedback</option>
                  <option value="needs-response">Needs response</option>
                  <option value="in-review">In review</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </CardBody>
          </Card>

          {error && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <Card>
              <CardHeader className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">All Reviews</h2>
                {loading && <Loader2 className="animate-spin text-cyan-600" size={18} />}
              </CardHeader>
              <CardBody className="space-y-3">
                {filteredReviews.length === 0 && !loading ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                    No reviews match the current filter.
                  </div>
                ) : (
                  filteredReviews.map((review, index) => {
                    const isSelected = review.id === selectedReview?.id;
                    const actionLabel = review.rating <= 3 ? 'Open feedback' : 'Reply with AI';

                    return (
                      <button
                        key={review.id}
                        onClick={() => setSelectedId(review.id)}
                        className={`w-full rounded-2xl border p-4 text-left transition ${
                          isSelected
                            ? 'border-cyan-400 bg-cyan-50 shadow-sm dark:border-cyan-700 dark:bg-cyan-950/30'
                            : 'border-slate-200 bg-white hover:border-cyan-200 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-cyan-800'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0 flex-1 space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge
                                variant={
                                  review.localStatus === 'needs-feedback'
                                    ? 'error'
                                    : review.localStatus === 'needs-response'
                                      ? 'warning'
                                      : review.localStatus === 'in-review'
                                        ? 'info'
                                        : 'success'
                                }
                              >
                                {review.localStatus.replace('-', ' ')}
                              </Badge>
                              <span className="text-xs text-slate-500 dark:text-slate-400">#{index + 1}</span>
                            </div>
                            <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{review.comment}</p>
                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                              <span>{new Date(review.created_at).toLocaleString()}</span>
                              <span className="flex items-center gap-0.5 text-amber-500">
                                {Array.from({ length: review.rating }).map((_, starIndex) => (
                                  <Star key={starIndex} size={12} fill="currentColor" />
                                ))}
                              </span>
                            </div>
                            <div className="inline-flex items-center gap-1 text-xs font-medium text-cyan-700 dark:text-cyan-300">
                              {actionLabel}
                              <ArrowRight size={14} />
                            </div>
                          </div>
                          <ArrowRight className="mt-1 text-slate-400" size={18} />
                        </div>
                      </button>
                    );
                  })
                )}
              </CardBody>
            </Card>

            <Card>
              <CardHeader className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Review Details</h2>
                {selectedReview && (
                  <Badge
                    variant={
                      selectedReview.localStatus === 'needs-feedback'
                        ? 'error'
                        : selectedReview.localStatus === 'needs-response'
                          ? 'warning'
                          : selectedReview.localStatus === 'in-review'
                            ? 'info'
                            : 'success'
                    }
                  >
                    {selectedReview.localStatus.replace('-', ' ')}
                  </Badge>
                )}
              </CardHeader>
              <CardBody className="space-y-5">
                {!selectedReview ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                    Select a review to inspect and generate an AI reply.
                  </div>
                ) : (
                  <>
                    <div className="space-y-2 rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/80">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-amber-500">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <Star key={index} size={16} fill={index < selectedReview.rating ? 'currentColor' : 'none'} />
                          ))}
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400">ID {selectedReview.id}</span>
                      </div>
                      <p className="text-sm leading-6 text-slate-700 dark:text-slate-200">{selectedReview.comment}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Submitted {new Date(selectedReview.created_at).toLocaleString()}
                      </p>
                    </div>

                    {selectedReview.rating <= 3 && (
                      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-100">
                        <div className="mb-2 flex items-center gap-2 font-semibold">
                          <ShieldAlert size={16} />
                          Low rating detected
                        </div>
                        This item should go through the private feedback form first. Use the button below to open it.
                      </div>
                    )}

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                        <Sparkles size={16} className="text-cyan-600" />
                        {selectedReview.rating <= 3 ? 'Internal follow-up draft' : 'AI draft response'}
                      </div>
                      <TextArea
                        value={selectedReview.draftResponse ?? ''}
                        onChange={(event) => handleDraftChange(selectedReview.id, event.target.value)}
                        readOnly={editingId !== selectedReview.id}
                        rows={8}
                        placeholder={
                          selectedReview.rating <= 3
                            ? 'Open the private feedback form or generate an internal follow-up draft.'
                            : 'Generate a response to view the AI draft here.'
                        }
                      />
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        onClick={() => void handleGenerate(selectedReview)}
                        disabled={generatingId === selectedReview.id}
                      >
                        {generatingId === selectedReview.id ? (
                          <Loader2 className="mr-2 animate-spin" size={16} />
                        ) : (
                          <MessageSquare className="mr-2" size={16} />
                        )}
                        Generate reply
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => setEditingId((current) => (current === selectedReview.id ? null : selectedReview.id))}
                        disabled={!selectedReview.draftResponse}
                      >
                        <Edit3 className="mr-2" size={16} />
                        {editingId === selectedReview.id ? 'Done editing' : 'Edit'}
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => void handleRegenerateForSelected(selectedReview)}
                        disabled={!selectedReview.draftResponse || generatingId === selectedReview.id}
                      >
                        <RefreshCw className="mr-2" size={16} />
                        Regenerate
                      </Button>
                      <Button
                        variant="success"
                        onClick={() => void handleSend(selectedReview)}
                        disabled={savingId === selectedReview.id || !selectedReview.draftResponse}
                      >
                        {savingId === selectedReview.id ? (
                          <Loader2 className="mr-2 animate-spin" size={16} />
                        ) : (
                          <Send className="mr-2" size={16} />
                        )}
                        Send
                      </Button>
                      <Button variant="secondary" onClick={() => void handleCopy()} disabled={!selectedReview.draftResponse}>
                        <Copy className="mr-2" size={16} />
                        Copy draft
                      </Button>
                      {selectedReview.rating <= 3 && (
                        <Button variant="ghost" onClick={handleOpenFeedbackForm}>
                          Open feedback form
                        </Button>
                      )}
                      {selectedReview.localStatus === 'resolved' && (
                        <Button variant="ghost" onClick={() => handleSetStatus(selectedReview.id, 'needs-response')}>
                          Reopen
                        </Button>
                      )}
                    </div>

                    {selectedReview.draftResponse && (
                      <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-sm text-cyan-900 dark:border-cyan-900/60 dark:bg-cyan-950/30 dark:text-cyan-100">
                        Draft ready for review. Mark this item resolved after posting or saving the response in your external review tool.
                      </div>
                    )}
                  </>
                )}
              </CardBody>
            </Card>
          </div>
        </div>
      </main>
    </>
  );

  function handleSetStatus(reviewId: string, localStatus: InboxReview['localStatus']) {
    setReviews((currentReviews) =>
      currentReviews.map((item) =>
        item.id === reviewId ? { ...item, localStatus } : item,
      ),
    );
  }

  async function handleRegenerateForSelected(review: InboxReview) {
    try {
      setGeneratingId(review.id);
      const generated = await generateReviewResponse({
        reviewId: review.id,
        rating: review.rating,
        comment: review.comment,
        tone: toneByRating(review.rating),
      });

      setReviews((currentReviews) =>
        currentReviews.map((item) =>
          item.id === review.id
            ? { ...item, draftResponse: generated.responseText, localStatus: 'in-review' }
            : item,
        ),
      );
      setError(null);
    } catch (generateError) {
      setError(generateError instanceof Error ? generateError.message : 'Failed to generate response');
    } finally {
      setGeneratingId(null);
    }
  }
}
