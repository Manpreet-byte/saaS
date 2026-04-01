'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { QrCode } from 'lucide-react';
import { mockReviewFunnelData } from '@/lib/mock-data';
import { api } from "@/lib/axios";
import { QRCodeCanvas } from "qrcode.react"; // 🔥 NEW
import axios from 'axios';

export default function ReviewFunnelPage() {
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrData, setQrData] = useState<any>(null); // 🔥 NEW
  const [loading, setLoading] = useState(false); // 🔥 NEW

  // 🔥 QR Generate Function
  const handleGenerateQR = async () => {
    try {
      setLoading(true);

      const res = await axios.post("/api/qr/generate", {
        business_id: "550e8400-e29b-41d4-a716-446655440000",
        google_review_link: "https://g.page/r/yourlink/review",
      });

      if (res.data.success) {
        setQrData(res.data);
        setShowQRCode(true);
      }

    } catch (err: any) {
      console.log(err.response?.data || err.message);
      alert("QR generate failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Review Funnel
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Collect reviews through QR codes and direct links.
            </p>
          </div>

          {/* QR Code Section */}
          <Card className="mb-8">
            <CardHeader>
              <h2 className="text-xl font-semibold">QR Code Scan Workflow</h2>
            </CardHeader>

            <CardBody className="space-y-6">
              <div className="flex flex-col md:flex-row gap-8 items-center">

                {/* 🔥 QR AREA */}
                <div className="flex-1 flex justify-center">

                  {showQRCode && qrData ? (
                    <div className="text-center space-y-4">
                      
                      {/* ✅ REAL QR */}
                      <QRCodeCanvas value={qrData.qrUrl} size={200} />

                      <p className="text-sm text-slate-500">
                        Scan to give review
                      </p>

                      {/* 🔗 URL */}
                      <div className="flex gap-2">
                        <Input value={qrData.qrUrl} readOnly />
                        <Button
                          onClick={() => {
                            navigator.clipboard.writeText(qrData.qrUrl);
                            alert("Copied!");
                          }}
                        >
                          Copy
                        </Button>
                      </div>
                    </div>

                  ) : (
                    <Button 
                      onClick={handleGenerateQR} 
                      variant="primary" 
                      size="lg"
                      disabled={loading}
                    >
                      <QrCode className="mr-2" />
                      {loading ? "Generating..." : "Generate QR Code"}
                    </Button>
                  )}

                </div>

                {/* Instructions */}
                <div className="flex-1 space-y-4">
                  <h3 className="font-semibold text-lg">How it works</h3>
                  <ol className="space-y-3 text-sm">
                    {[
                      'Display QR code in your business location',
                      'Customer scans with their mobile device',
                      'Review form opens automatically',
                      'Customer submits review based on rating',
                    ].map((step, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="font-semibold text-primary-600">
                          {i + 1}.
                        </span>
                        <span className="text-slate-600">
                          {step}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>

              </div>
            </CardBody>
          </Card>

          {/* Direct Link Section */}
          <Card className="mb-8">
            <CardHeader>
              <h2 className="text-xl font-semibold">Direct Review Link</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <p className="text-sm text-slate-600">
                Share this link anywhere to collect reviews.
              </p>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={qrData?.qrUrl || "Generate QR first"}
                  readOnly
                  className="flex-1"
                />
                <Button
                  onClick={() => {
                    if (qrData?.qrUrl) {
                      navigator.clipboard.writeText(qrData.qrUrl);
                      alert("Copied!");
                    }
                  }}
                >
                  Copy
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* Funnel Progress (unchanged) */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Review Funnel Progress</h2>
            </CardHeader>
            <CardBody className="space-y-6">
              {mockReviewFunnelData.steps.map((step, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{step.name}</span>
                    <Badge>{step.completed.toLocaleString()}</Badge>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div
                      className="bg-blue-500 h-full"
                      style={{ width: `${step.percentage}%` }}
                    />
                  </div>
                  <div className="text-xs mt-1">
                    {step.percentage}% completion
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>

        </div>
      </main>
    </>
  );
}