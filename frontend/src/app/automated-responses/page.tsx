'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { mockAutomatedResponses } from '@/lib/mock-data';
import { Send, Edit3, Clock, MessageSquare, Search } from 'lucide-react';

export default function AutomatedResponsesPage() {
  const [responses, setResponses] = useState(mockAutomatedResponses);
  const [selectedResponse, setSelectedResponse] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingText, setEditingText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleApprove = (id: string) => {
    setResponses(
      responses.map((r) => (r.id === id ? { ...r, status: 'posted' } : r))
    );
    setModalOpen(false);
  };

  const handleSchedule = (id: string) => {
    setResponses(
      responses.map((r) => (r.id === id ? { ...r, status: 'scheduled' } : r))
    );
    setModalOpen(false);
  };

  const handleEdit = (response: any) => {
    setSelectedResponse(response);
    setEditingText(response.suggested);
    setModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (!selectedResponse) return;

    setResponses(
      responses.map((response) =>
        response.id === selectedResponse.id
          ? { ...response, suggested: editingText, status: 'draft' }
          : response
      )
    );
    setModalOpen(false);
  };

  const handleRegenerate = () => {
    if (!selectedResponse) return;

    const reviewText = String(selectedResponse.review || '').toLowerCase();
    const rating = Number(selectedResponse.rating || 0);

    const regeneratedText =
      rating <= 2
        ? 'We are sorry for the inconvenience. Please contact us so we can review this and make it right.'
        : reviewText.includes('great') || reviewText.includes('excellent')
          ? 'Thank you so much for your kind words. We are glad our team could deliver a great experience for you.'
          : 'Thank you for sharing your feedback. We appreciate it and will continue working to improve our service.';

    setEditingText(regeneratedText);
  };

  const filteredResponses = responses.filter((response) => {
    const matchesSearch =
      response.reviewer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      response.review.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || response.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'posted':
        return 'success';
      case 'scheduled':
        return 'warning';
      default:
        return 'info';
    }
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

          <Card className="mb-6">
            <CardBody className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Search reviews
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by reviewer or review text"
                    className="pl-9"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Filter by status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="input-base w-full"
                >
                  <option value="all">All</option>
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="posted">Posted</option>
                </select>
              </div>
            </CardBody>
          </Card>

          {/* Responses Table */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Pending Responses</h2>
            </CardHeader>
            <CardBody className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reviewer</TableHead>
                    <TableHead>Review</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <tbody>
                  {filteredResponses.map((response) => (
                    <TableRow key={response.id}>
                      <TableCell className="font-medium">{response.reviewer}</TableCell>
                      <TableCell className="max-w-xs">
                        <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                          {response.review}
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
                        <Badge variant={getBadgeVariant(response.status)}>
                          {response.status === 'posted'
                            ? '✓ Posted'
                            : response.status === 'scheduled'
                            ? '⏱ Scheduled'
                            : '📝 Draft'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(response)}
                          >
                            <MessageSquare size={16} />
                          </Button>
                          {response.status === 'draft' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleApprove(response.id)}
                              >
                                <Send size={16} className="mr-1" />
                                Send
                              </Button>
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => {
                                  setSelectedResponse(response);
                                  setModalOpen(true);
                                }}
                              >
                                <Edit3 size={16} />
                              </Button>
                            </>
                          )}
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
            onClose={() => setModalOpen(false)}
            title={`Response for ${selectedResponse?.reviewer}`}
            footer={
              selectedResponse && (
                <>
                  <Button
                    variant="secondary"
                    onClick={() => setModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSaveEdit}>
                    <Edit3 size={16} className="mr-1" />
                    Save Edit
                  </Button>
                  <Button variant="ghost" onClick={handleRegenerate}>
                    Regenerate
                  </Button>
                  {selectedResponse.status === 'draft' && (
                    <Button onClick={() => handleApprove(selectedResponse.id)}>
                      <Send size={16} className="mr-1" />
                      Post Now
                    </Button>
                  )}
                  {selectedResponse.status !== 'posted' && (
                    <Button
                      variant="ghost"
                      onClick={() => handleSchedule(selectedResponse.id)}
                    >
                      <Clock size={16} className="mr-1" />
                      Schedule
                    </Button>
                  )}
                </>
              )
            }
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
                    <p className="text-sm">{selectedResponse.review}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2 text-slate-600 dark:text-slate-400">
                    AI-Suggested Response
                  </h4>
                  <textarea
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    rows={6}
                    className="input-base w-full resize-none"
                    placeholder="Edit the suggested response here..."
                  />
                </div>

                {selectedResponse.status === 'scheduled' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Schedule for
                    </label>
                    <Input type="datetime-local" />
                  </div>
                )}
              </div>
            )}
          </Modal>
        </div>
      </main>
    </>
  );
}
