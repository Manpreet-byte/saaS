'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Modal } from '@/components/ui/modal';
import { listReviews, ReviewRecord } from '@/lib/api/reviews';
import { MessageSquare, Loader2, RefreshCw, Eye } from 'lucide-react';

type ResponseRow = ReviewRecord & {
  reviewer: string;
  suggested: string;
};

const getDefaultTone = (rating: number) => {
  if (rating <= 2) return 'apologetic';
  if (rating === 3) return 'professional';
  return 'friendly';
};

const toInputDateTime = (isoDate?: string | null) => {
  if (!isoDate) return '';

  const date = new Date(isoDate);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
  return local.toISOString().slice(0, 16);
};

const toResponseRow = (review: ReviewRecord): ResponseRow => ({
  ...review,
  reviewer: `Customer ${review.id.slice(0, 8)}`,
  suggested: String(review.response_text ?? '').trim(),
});

export default function AutomatedResponsesPage() {
  const [responses, setResponses] = useState<ResponseRow[]>([]);
  const [selectedResponseId, setSelectedResponseId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const selectedResponse = useMemo(
    () => responses.find((response) => response.id === selectedResponseId) ?? null,
    [responses, selectedResponseId],
  );

  const loadResponses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const reviews = await listReviews();
      setResponses(reviews.map(toResponseRow));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load review responses');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadResponses();
  }, []);

  const openModal = (response: ResponseRow) => {
    setSelectedResponseId(response.id);
    setModalOpen(true);
    setError(null);
  };

  const applyUpdatedReview = (review: ReviewRecord) => {
    const updated = toResponseRow(review);
    setResponses((current) => current.map((item) => (item.id === review.id ? updated : item)));
    setSelectedResponseId(updated.id);
  };

  return (
    <>
      <Sidebar />
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 lg:ml-64">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Automated Responses
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Review AI suggestions and manage responses.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200">
              {error}
            </div>
          )}

          {/* Responses Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold">Past Reviews & Responses</h2>
                <Button variant="secondary" size="sm" onClick={() => void loadResponses()} disabled={isLoading}>
                  {isLoading ? <Loader2 size={16} className="mr-1 animate-spin" /> : <RefreshCw size={16} className="mr-1" />}
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardBody className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reviewer</TableHead>
                    <TableHead>Review</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <tbody>
                  {isLoading && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-slate-500 dark:text-slate-400">
                        Loading past reviews...
                      </TableCell>
                    </TableRow>
                  )}
                  {!isLoading && responses.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-slate-500 dark:text-slate-400">
                        No reviews found.
                      </TableCell>
                    </TableRow>
                  )}
                  {responses.map((response) => (
                    <TableRow key={response.id}>
                      <TableCell className="font-medium">{response.reviewer}</TableCell>
                      <TableCell className="max-w-xs">
                        <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                          {response.comment}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span
                              key={i}
                              className={
                                i < response.rating
                                  ? 'text-yellow-400'
                                  : 'text-slate-300 dark:text-slate-600'
                              }
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => openModal(response)}
                          >
                            <Eye size={16} className="mr-1" />
                            Review
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </Table>
            </CardBody>
          </Card>

          {/* Response Preview Modal */}
          <Modal
            isOpen={modalOpen}
            onClose={() => {
              setModalOpen(false);
              setError(null);
            }}
            title={`Review for ${selectedResponse?.reviewer}`}
          >
            {selectedResponse && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2 text-slate-600 dark:text-slate-400">
                    Customer Review
                  </h4>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                    <div className="flex gap-0.5 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={
                            i < selectedResponse.rating
                              ? 'text-yellow-400'
                              : 'text-slate-300 dark:text-slate-600'
                          }
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="text-sm">{selectedResponse.comment}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2 text-slate-600 dark:text-slate-400">
                    AI-Suggested Response
                  </h4>
                  <textarea
                    value={selectedResponse.suggested || 'No AI response has been generated yet.'}
                    readOnly
                    rows={6}
                    className="input-base w-full resize-none bg-slate-50 dark:bg-slate-800"
                    placeholder="No AI response available yet."
                  />
                </div>
              </div>
            )}
          </Modal>
        </div>
      </main>
    </>
  );
}
