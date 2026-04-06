'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { QrCode } from 'lucide-react';
import { mockReviewFunnelData } from '@/lib/mock-data';
import { QRCodeCanvas } from 'qrcode.react';
import { api } from '@/lib/axios';

const REVIEW_LINK = 'https://g.page/r/YourBusinessName/review';

export default function ReviewFunnelPage() {
  const [showQRCode, setShowQRCode] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [qrData, setQrData] = useState<any>(null);
  const [loading, setLoading] = useState(false);


  const handleCopyReviewLink = async () => {
    try {
      const text = qrData?.qrUrl || REVIEW_LINK;
      await navigator.clipboard.writeText(text);
      setCopyFeedback('Link copied to clipboard.');
    } catch {
      setCopyFeedback('Copy failed. Please copy manually.');
    }
  };


  useEffect(() => {
    if (!copyFeedback) return;
    const timeout = setTimeout(() => setCopyFeedback(null), 3000);
    return () => clearTimeout(timeout);
  }, [copyFeedback]);

  const generateQRCode = async () => {
    try {
      setLoading(true);

      setQrData({ qrUrl: REVIEW_LINK });

      setShowQRCode(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 py-8">

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Review Funnel</h1>
            <p className="text-slate-600">
              Collect reviews through QR codes and direct links.
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <h2 className="text-xl font-semibold">QR Code Scan Workflow</h2>
            </CardHeader>

            <CardBody className="space-y-6">
              <div className="flex flex-col md:flex-row gap-8 items-center">

                <div className="flex-1 flex justify-center">
                  {showQRCode ? (
                    <QRCodeCanvas
                      value={qrData?.qrUrl || REVIEW_LINK}
                      size={200}
                    />
                  ) : (
                    <Button onClick={generateQRCode} size="lg">
                      <QrCode className="mr-2" />
                      {loading ? 'Generating...' : 'Generate QR Code'}
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
                        <span className="font-semibold">{i + 1}.</span>
                        <span>{step}</span>
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
              <div className="flex gap-2">
                <Input
                  value={qrData?.qrUrl || REVIEW_LINK}
                  readOnly
                />
                <Button onClick={handleCopyReviewLink}>
                  {copyFeedback ? 'Copied' : 'Copy'}
                </Button>
              </div>

              {copyFeedback && (
                <p className="text-sm text-green-600">
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
                  <div className="flex justify-between mb-2">
                    <span>{step.name}</span>
                    <Badge>{step.completed}</Badge>
                  </div>

                  <div className="w-full bg-gray-200 h-3 rounded">
                    <div
                      className="bg-blue-500 h-3 rounded"
                      style={{ width: `${step.percentage}%` }}
                    />
                  </div>

                  <p className="text-xs mt-1">
                    {step.percentage}% complete
                  </p>
                </div>
              ))}
            </CardBody>
          </Card>

        </div>
      </main>
    </>
  );
}