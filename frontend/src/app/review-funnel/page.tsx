'use client';

import React, { useMemo, useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input, TextArea } from '@/components/ui/input';
import {
  CheckCircle,
  Edit3,
  Loader2,
  MessageSquare,
  QrCode,
  RefreshCw,
  Send,
  ShieldAlert,
  Sparkles,
  Star,
} from 'lucide-react';
import { mockReviewFunnelData } from '@/lib/mock-data';
import {
  generateReviewResponse,
  submitInternalFeedback,
  submitReviewFeedback,
  updateReviewResponse,
} from '@/lib/api/reviews';

export default function ReviewFunnelPage() {
  const [showQRCode, setShowQRCode] = useState(false);
  const [rating, setRating] = useState(3);
  const [publicReview, setPublicReview] = useState('');
  const [issue, setIssue] = useState('');
  const [impact, setImpact] = useState('');
  const [resolution, setResolution] = useState('');
  const [notes, setNotes] = useState('');
  const [submittedReviewId, setSubmittedReviewId] = useState<string | null>(null);
  const [replyDraft, setReplyDraft] = useState('');
  const [isEditingReply, setIsEditingReply] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isSavingReply, setIsSavingReply] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const isLowRating = rating <= 3;

  const feedbackTone = useMemo(() => {
    if (rating <= 2) return 'apologetic';
    if (rating === 3) return 'professional';
    return 'friendly';
  }, [rating]);

  const summaryText = useMemo(() => {
    if (!isLowRating) {
      return publicReview.trim();
    }

    return [
      `Issue: ${issue.trim()}`,
      `Impact: ${impact.trim()}`,
      `Expected fix: ${resolution.trim()}`,
      notes.trim() ? `Notes: ${notes.trim()}` : '',
    ]
      .filter(Boolean)
      .join('\n');
  }, [impact, isLowRating, issue, notes, publicReview, resolution]);

  const resetDraftState = () => {
    setSubmittedReviewId(null);
    setReplyDraft('');
    setIsEditingReply(false);
    setStatusMessage(null);
  };

  const handleStarSelect = (nextRating: number) => {
    setRating(nextRating);
    setFeedbackError(null);
    resetDraftState();
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setFeedbackError(null);
      setStatusMessage(null);

      if (isLowRating) {
        if (!issue.trim() || !impact.trim() || !resolution.trim()) {
          setFeedbackError('Please fill all three feedback questions before saving.');
          return;
        }

        const result = await submitInternalFeedback({
          rating,
          issue: issue.trim(),
          impact: impact.trim(),
          resolution: resolution.trim(),
          notes: notes.trim() || undefined,
        });

        setSubmittedReviewId(result.review.id);
        setReplyDraft(result.responseText);
        setIsEditingReply(false);
        setStatusMessage('Private feedback saved and AI follow-up drafted.');
        return;
      }

      if (!publicReview.trim()) {
        setFeedbackError('Add the customer review before generating the reply.');
        return;
      }

      const review = await submitReviewFeedback({
        rating,
        comment: publicReview.trim(),
      });

      const response = await generateReviewResponse({
        reviewId: review.id,
        rating: review.rating,
        comment: review.comment,
        tone: feedbackTone,
      });

      setSubmittedReviewId(review.id);
      setReplyDraft(response.responseText);
      setIsEditingReply(false);
      setStatusMessage('Review saved and AI reply generated.');
    } catch (error) {
      setFeedbackError(error instanceof Error ? error.message : 'Unable to submit feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegenerate = async () => {
    if (!submittedReviewId) {
      setFeedbackError('Save the review first before regenerating the reply.');
      return;
    }

    if (!summaryText.trim()) {
      setFeedbackError('Add review details before regenerating the reply.');
      return;
    }

    try {
      setIsRegenerating(true);
      setFeedbackError(null);
      setStatusMessage(null);

      const response = await generateReviewResponse({
        reviewId: submittedReviewId,
        rating,
        comment: summaryText,
        tone: feedbackTone,
      });

      setReplyDraft(response.responseText);
      setIsEditingReply(false);
      setStatusMessage('AI reply regenerated.');
    } catch (error) {
      setFeedbackError(error instanceof Error ? error.message : 'Unable to regenerate reply');
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleSendReply = async () => {
    if (!submittedReviewId || !replyDraft.trim()) {
      setFeedbackError('Generate a reply before sending it.');
      return;
    }

    try {
      setIsSavingReply(true);
      setFeedbackError(null);
      await updateReviewResponse({
        reviewId: submittedReviewId,
        responseText: replyDraft.trim(),
        status: isLowRating ? 'draft' : 'posted',
        rating,
        comment: summaryText || publicReview.trim(),
        tone: feedbackTone,
      });
      setIsEditingReply(false);
      setStatusMessage(isLowRating ? 'Private feedback saved.' : 'Reply saved and marked as sent.');
    } catch (error) {
      setFeedbackError(error instanceof Error ? error.message : 'Unable to save reply');
    } finally {
      setIsSavingReply(false);
    }
  };

  return (
    <>
      <Sidebar />
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 lg:ml-64">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8 overflow-hidden rounded-3xl border border-cyan-100 bg-gradient-to-r from-white via-cyan-50/70 to-blue-100/70 p-6 shadow-sm dark:border-cyan-900/60 dark:from-slate-900 dark:via-slate-900/70 dark:to-cyan-950/30 md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="display-font text-xs font-semibold uppercase tracking-[0.14em] text-cyan-700 dark:text-cyan-300">
                  Review Funnel
                </p>
                <h1 className="display-font mt-2 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
                  Public replies for 4-5, private feedback for 1-3
                </h1>
                <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300">
                  High ratings get an AI reply draft. Low ratings open a private feedback form with three focused questions,
                  then the AI prepares a follow-up internally.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white/80 px-4 py-2 text-sm font-semibold text-cyan-700 dark:border-cyan-800 dark:bg-slate-900/70 dark:text-cyan-300">
                {isLowRating ? <ShieldAlert size={16} /> : <Sparkles size={16} />}
                {isLowRating ? 'Private feedback mode' : 'AI reply mode'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold">Review input</h2>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Select the rating first. The form changes automatically for public replies or private complaints.
                      </p>
                    </div>
                    <Badge variant={isLowRating ? 'warning' : 'success'}>
                      {isLowRating ? '1-3 = private feedback' : '4-5 = public reply'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardBody className="space-y-6">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Select star rating
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => handleStarSelect(value)}
                          className={`flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                            rating === value
                              ? 'border-cyan-400 bg-cyan-50 text-cyan-800 dark:border-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-200'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-cyan-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'
                          }`}
                        >
                          <span className="flex items-center gap-0.5 text-amber-500">
                            {Array.from({ length: value }).map((_, index) => (
                              <Star key={index} size={14} fill="currentColor" />
                            ))}
                          </span>
                          {value} star{value > 1 ? 's' : ''}
                        </button>
                      ))}
                    </div>
                  </div>

                  {isLowRating ? (
                    <div className="grid gap-4">
                      {[
                        {
                          label: '1. What went wrong?',
                          placeholder: 'Describe the issue in a few words.',
                          value: issue,
                          onChange: setIssue,
                        },
                        {
                          label: '2. How did this affect the customer?',
                          placeholder: 'Explain the impact on the customer experience.',
                          value: impact,
                          onChange: setImpact,
                        },
                        {
                          label: '3. What should we do next?',
                          placeholder: 'Write the fix, escalation step, or next action.',
                          value: resolution,
                          onChange: setResolution,
                        },
                      ].map((field) => (
                        <div key={field.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
                          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                            {field.label}
                          </label>
                          <Input
                            value={field.value}
                            onChange={(event) => field.onChange(event.target.value)}
                            placeholder={field.placeholder}
                          />
                        </div>
                      ))}

                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                          Optional notes
                        </label>
                        <TextArea
                          value={notes}
                          onChange={(event) => setNotes(event.target.value)}
                          placeholder="Any extra context for the team."
                          rows={4}
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Customer review
                      </label>
                      <TextArea
                        value={publicReview}
                        onChange={(event) => setPublicReview(event.target.value)}
                        placeholder="Paste or type the review here so the AI can draft a reply."
                        rows={6}
                      />
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3">
                    <Button onClick={() => void handleSubmit()} disabled={isSubmitting}>
                      {isSubmitting ? <Loader2 className="mr-2 animate-spin" size={16} /> : <Sparkles className="mr-2" size={16} />}
                      {isLowRating ? 'Save private feedback' : 'Generate AI reply'}
                    </Button>
                    <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                      Tone: {feedbackTone}
                    </div>
                  </div>

                  {statusMessage && (
                    <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200">
                      <CheckCircle size={16} />
                      {statusMessage}
                    </div>
                  )}

                  {feedbackError && (
                    <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200">
                      {feedbackError}
                    </div>
                  )}
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">QR code workflow</h2>
                </CardHeader>
                <CardBody className="space-y-6">
                  <div className="flex flex-col items-center gap-6 md:flex-row md:items-center md:gap-8">
                    <div className="flex-1 flex justify-center">
                      {showQRCode ? (
                        <div className="flex h-48 w-48 items-center justify-center rounded-2xl border-2 border-dashed border-cyan-300 bg-gradient-to-br from-cyan-50 to-blue-100 dark:border-cyan-700 dark:from-slate-800 dark:to-slate-900">
                          <div className="text-center">
                            <QrCode size={64} className="mx-auto mb-2 text-cyan-600 dark:text-cyan-300" />
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">QR Code Placeholder</p>
                          </div>
                        </div>
                      ) : (
                        <Button onClick={() => setShowQRCode(true)} variant="secondary" size="lg">
                          <QrCode className="mr-2" />
                          Generate QR Code
                        </Button>
                      )}
                    </div>

                    <div className="flex-1 space-y-4">
                      <h3 className="font-semibold text-lg">How it works</h3>
                      <ol className="space-y-3 text-sm">
                        {[
                          'Display QR code at the counter or checkout',
                          'Customer scans and chooses a rating',
                          '4-5 stars open the public reply flow',
                          '1-3 stars open the private feedback form',
                        ].map((step, index) => (
                          <li key={step} className="flex gap-3">
                            <span className="font-semibold text-cyan-600 dark:text-cyan-400 flex-shrink-0">
                              {index + 1}.
                            </span>
                            <span className="text-slate-600 dark:text-slate-400">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-cyan-200 dark:border-cyan-900/60">
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-xl font-semibold">AI reply preview</h2>
                    <Badge variant={isLowRating ? 'warning' : 'success'}>
                      {isLowRating ? 'Private follow-up' : 'Public reply'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardBody className="space-y-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {isLowRating
                      ? 'The AI draft stays internal and helps your team respond to the complaint faster.'
                      : 'The AI draft is ready for edit, send, or regeneration before posting publicly.'}
                  </p>

                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/70">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                        <MessageSquare size={16} className="text-cyan-600" />
                        <span className="font-semibold">Suggested reply</span>
                      </div>
                      {submittedReviewId && <Badge variant="info">Saved #{submittedReviewId}</Badge>}
                    </div>

                    <TextArea
                      value={replyDraft}
                      onChange={(event) => setReplyDraft(event.target.value)}
                      readOnly={!isEditingReply}
                      rows={10}
                      placeholder="Generate a reply to see the AI draft here."
                    />
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button variant="secondary" onClick={() => setIsEditingReply((current) => !current)} disabled={!replyDraft}>
                      <Edit3 className="mr-2" size={16} />
                      {isEditingReply ? 'Done editing' : 'Edit'}
                    </Button>
                    <Button variant="secondary" onClick={() => void handleRegenerate()} disabled={isRegenerating || !submittedReviewId}>
                      {isRegenerating ? <Loader2 className="mr-2 animate-spin" size={16} /> : <RefreshCw className="mr-2" size={16} />}
                      Regenerate
                    </Button>
                    <Button onClick={() => void handleSendReply()} disabled={isSavingReply || !replyDraft}>
                      {isSavingReply ? <Loader2 className="mr-2 animate-spin" size={16} /> : <Send className="mr-2" size={16} />}
                      Send
                    </Button>
                  </div>

                  <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-3 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-400">
                    {isLowRating
                      ? 'Low ratings do not go public. They stay inside the team workflow for private follow-up.'
                      : 'You can edit the draft before sending it to the customer.'}
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Review Funnel Progress</h2>
                </CardHeader>
                <CardBody className="space-y-6">
                  {mockReviewFunnelData.steps.map((step) => (
                    <div key={step.id}>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-medium text-slate-900 dark:text-white">{step.name}</span>
                        <Badge>{step.completed.toLocaleString()}</Badge>
                      </div>
                      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-500"
                          style={{ width: `${step.percentage}%` }}
                        />
                      </div>
                      <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">{step.percentage}% completion</div>
                    </div>
                  ))}
                </CardBody>
              </Card>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              { icon: '📧', title: 'Email Campaign', desc: 'Send review requests via email' },
              { icon: '📱', title: 'SMS Campaign', desc: 'Send links via text message' },
              { icon: '🌐', title: 'Social Media', desc: 'Share on Facebook & Instagram' },
            ].map((item) => (
              <button
                key={item.title}
                className="card transition-all hover:border-primary-300 hover:shadow-lg dark:hover:border-primary-700"
              >
                <div className="mb-3 text-3xl">{item.icon}</div>
                <h3 className="mb-1 font-semibold">{item.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{item.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
