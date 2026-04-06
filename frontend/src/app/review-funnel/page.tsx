'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { QrCode, CheckCircle, Clock, Zap } from 'lucide-react';
import { mockReviewFunnelData } from '@/lib/mock-data';

const REVIEW_LINK = 'https://g.page/r/YourBusinessName/review';


export default function ReviewFunnelPage() {
  const [showQRCode, setShowQRCode] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

    const handleCopyReviewLink = async () => {
    try {
      await navigator.clipboard.writeText(REVIEW_LINK);
      setCopyFeedback('Link copied to clipboard.');
      return;
    } catch (_) {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = REVIEW_LINK;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopyFeedback('Link copied to clipboard.');
        return;
      } catch (error) {
        setCopyFeedback('Copy failed. Please select and copy manually.');
      }
    }
  };

   useEffect(() => {
    if (!copyFeedback) return;
    const timeout = window.setTimeout(() => setCopyFeedback(null), 3000);
    return () => window.clearTimeout(timeout);
  }, [copyFeedback]);


    return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Review Funnel</h1>
            <p className="text-slate-600 dark:text-slate-400">Collect reviews through QR codes and direct links.</p>
          </div>

               {/* QR Code Section */}
          <Card className="mb-8">
            <CardHeader>
              <h2 className="text-xl font-semibold">QR Code Scan Workflow</h2>
            </CardHeader>
            <CardBody className="space-y-6">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                {/* QR Code Placeholder */}
                <div className="flex-1 flex justify-center">
                  {showQRCode ? (
                    <div className="w-48 h-48 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-400 dark:border-slate-600">
                      <div className="text-center">
                        <QrCode size={64} className="mx-auto mb-2 text-slate-500" />
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">QR Code Placeholder</p>
                      </div>
                    </div>
                  ) : (
                    <Button onClick={() => setShowQRCode(true)} variant="primary" size="lg">
                      <QrCode className="mr-2" />
                      Generate QR Code
                    </Button>
                  )}      
                </div>

                 <div className="flex-1 space-y-4">
                  <h3 className="font-semibold text-lg">How it works</h3>
                  <ol className="space-y-3 text-sm">
                    {[
                      'Display QR code in your business location',
                      'Customer scans with their mobile device',
                      'Review form opens automatically',
                      'Customer submits review directly to Google',
                    ].map((step, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="font-semibold text-primary-600 dark:text-primary-400 flex-shrink-0">
                          {i + 1}.
                        </span>
                        <span className="text-slate-600 dark:text-slate-400">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </CardBody>
          </Card>
        <Card className="mb-8">
            <CardHeader>
              <h2 className="text-xl font-semibold">Direct Review Link</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Share this link in emails, social media, or SMS to collect reviews directly.
              </p>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={REVIEW_LINK}
                  readOnly
                  className="flex-1"
                />
                <Button variant="secondary" type="button" onClick={handleCopyReviewLink}>
                  {copyFeedback ? 'Copied' : 'Copy'}
                </Button>
              </div>

                {copyFeedback && (
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  {copyFeedback}
                </p>
              )}
            </CardBody>
          </Card>

           <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Review Funnel Progress</h2>
            </CardHeader>
            <CardBody className="space-y-6">
              {mockReviewFunnelData.steps.map((step, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-slate-900 dark:text-white">{step.name}</span>
                    <Badge>{step.completed.toLocaleString()}</Badge>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-primary-500 to-primary-600 h-full transition-all duration-500"
                      style={{ width: `${step.percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">{step.percentage}% completion</div>
                </div>
              ))}
            </CardBody>
          </Card>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: '📧', title: 'Email Campaign', desc: 'Send review requests via email' },
              { icon: '📱', title: 'SMS Campaign', desc: 'Send links via text message' },
              { icon: '🌐', title: 'Social Media', desc: 'Share on Facebook & Instagram' },
            ].map((item, i) => (
              <button
                key={i}
                className="card hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-700 transition-all"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{item.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}