'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TextArea } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { mockAISuggestions } from '@/lib/mock-data';
import { Sparkles, Edit3, CheckCircle } from 'lucide-react';

export default function AISuggestionsPage() {
  const [suggestions, setSuggestions] = useState(mockAISuggestions);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleApply = (id: string) => {
    setSuggestions(suggestions.map(s => s.id === id ? { ...s, status: 'applied' } : s));
    setEditingId(null);
  };

  const handleEdit = (id: string, text: string) => {
    setEditingId(id);
    setEditValue(text);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">AI Review Suggestions</h1>
            <p className="text-slate-600 dark:text-slate-400">Get AI-powered suggestions for responding to reviews.</p>
          </div>

          {/* Active Editor */}
          {editingId && (
            <Card className="mb-8 border-primary-500">
              <CardHeader>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Edit3 size={20} className="text-primary-600" />
                  Edit Response
                </h2>
              </CardHeader>
              <CardBody className="space-y-4">
                <TextArea
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  placeholder="Edit your response here..."
                  rows={6}
                />
                <div className="flex gap-2 justify-end">
                  <Button variant="secondary" onClick={() => setEditingId(null)}>
                    Cancel
                  </Button>
                  <Button onClick={() => handleApply(editingId)}>
                    <CheckCircle className="mr-2" size={18} />
                    Apply Response
                  </Button>
                </div>
              </CardBody>
            </Card>
          )}

          {/* Suggestions List */}
          <div className="space-y-4">
            {suggestions.map((suggestion) => (
              <Card key={suggestion.id}>
                <CardBody className="space-y-4">
                  {/* Original vs Suggested */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Original</h4>
                      <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                        <p className="text-sm text-slate-900 dark:text-slate-100">{suggestion.original}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                        <Sparkles size={16} className="inline mr-1 text-primary-600" />
                        AI Suggestion
                      </h4>
                      <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded border border-primary-200 dark:border-primary-800">
                        <p className="text-sm text-slate-900 dark:text-slate-100">{suggestion.suggested}</p>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <Badge variant={suggestion.status === 'applied' ? 'success' : 'info'}>
                        {suggestion.status === 'applied' ? '✓ Applied' : '⏱ Pending'}
                      </Badge>
                      <span className="text-sm text-slate-600 dark:text-slate-400">{suggestion.date}</span>
                    </div>

                    {suggestion.status === 'pending' && (
                      <div className="flex gap-2 w-full sm:w-auto">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(suggestion.id, suggestion.suggested)}
                        >
                          <Edit3 size={16} className="mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleApply(suggestion.id)}
                        >
                          <CheckCircle size={16} className="mr-1" />
                          Apply
                        </Button>
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
