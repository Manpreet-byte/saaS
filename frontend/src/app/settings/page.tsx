'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { mockSettings } from '@/lib/mock-data';
import { CheckCircle, AlertCircle, Settings, Bell, User } from 'lucide-react';

export default function SettingsPage() {
  const [businessProfile, setBusinessProfile] = useState(mockSettings.businessProfile);
  const [notifications, setNotifications] = useState(mockSettings.notifications);
  const [saved, setSaved] = useState(false);

  const handleBusinessChange = (field: string, value: string) => {
    setBusinessProfile({ ...businessProfile, [field]: value });
    setSaved(false);
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotifications({ ...notifications, [field]: value });
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Settings</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Manage your business profile and preferences.
            </p>
          </div>

          {/* Save Notification */}
          {saved && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2">
              <CheckCircle className="text-green-600 dark:text-green-400" size={20} />
              <span className="text-green-900 dark:text-green-100">Settings saved successfully!</span>
            </div>
          )}

          {/* Business Profile */}
          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <User size={20} />
                Business Profile
              </h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Business Name</label>
                <Input
                  value={businessProfile.name}
                  onChange={(e) => handleBusinessChange('name', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input
                    type="email"
                    value={businessProfile.email}
                    onChange={(e) => handleBusinessChange('email', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <Input
                    value={businessProfile.phone}
                    onChange={(e) => handleBusinessChange('phone', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Address</label>
                <Input
                  value={businessProfile.address}
                  onChange={(e) => handleBusinessChange('address', e.target.value)}
                />
              </div>

              <Button onClick={handleSave} className="mt-4">
                Save Changes
              </Button>
            </CardBody>
          </Card>

          {/* Integrations */}
          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Settings size={20} />
                Integrations
              </h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div>
                  <h3 className="font-semibold flex items-center gap-2">
                    <span className="text-xl">🗺️</span>
                    Google Maps
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Sync reviews from your Google Business profile
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="success">✓ Connected</Badge>
                  <Button variant="ghost" size="sm">
                    Reconnect
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Bell size={20} />
                Notification Preferences
              </h2>
            </CardHeader>
            <CardBody className="space-y-4">
              {[
                { id: 'newReviews', label: 'New Reviews', desc: 'Notify me about new reviews' },
                { id: 'suggestions', label: 'AI Suggestions', desc: 'Notify me when AI suggestions are available' },
                { id: 'responses', label: 'Response Reminders', desc: 'Remind me to respond to reviews' },
              ].map((notif) => (
                <div
                  key={notif.id}
                  className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg"
                >
                  <div>
                    <h3 className="font-medium">{notif.label}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{notif.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications[notif.id as keyof typeof notifications] as boolean}
                      onChange={(e) =>
                        handleNotificationChange(
                          notif.id,
                          e.target.checked
                        )
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 dark:bg-slate-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 dark:peer-checked:bg-primary-500"></div>
                  </label>
                </div>
              ))}

              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <h3 className="font-medium mb-4">Notification Method</h3>
                <div className="space-y-3">
                  {[
                    { id: 'email', label: 'Email', icon: '📧' },
                    { id: 'daily', label: 'Daily Digest', icon: '📅' },
                  ].map((method) => (
                    <label key={method.id} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications[method.id as keyof typeof notifications] as boolean}
                        onChange={(e) =>
                          handleNotificationChange(method.id, e.target.checked)
                        }
                        className="w-4 h-4 rounded border-slate-300"
                      />
                      <span className="text-sm font-medium">
                        {method.icon} {method.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <Button onClick={handleSave} className="mt-6">
                Save Preferences
              </Button>
            </CardBody>
          </Card>
        </div>
      </main>
    </>
  );
}
