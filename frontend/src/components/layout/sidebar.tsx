'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Bell, LayoutDashboard, Sparkles, MessageSquare, Filter, SlidersHorizontal, LogOut, Inbox } from 'lucide-react';
import { useAuth } from '@/components/providers/auth-provider';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Inbox', href: '/inbox', icon: Inbox },
  { name: 'Review Funnel', href: '/review-funnel', icon: Filter },
  { name: 'AI Suggestions', href: '/ai-suggestions', icon: Sparkles },
  { name: 'Responses', href: '/automated-responses', icon: MessageSquare },
  { name: 'Notifications', href: '/notifications', icon: Bell, badge: 3 },
  { name: 'Settings', href: '/settings', icon: SlidersHorizontal },
];

export function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed left-4 top-4 z-50 rounded-xl p-2 bg-white/80 shadow-lg text-slate-600 transition-colors hover:bg-slate-100 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-primary-900 shadow-xl transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-white/10 px-6">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-lg shadow-primary-500/20">
            <LayoutDashboard size={18} />
          </div>
          <div>
            <p className="display-font text-lg font-bold leading-none text-white">ReviewMaster</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  active
                    ? 'bg-primary-700/20 text-white shadow-sm'
                    : 'text-slate-400 hover:bg-primary-700/30 hover:text-white'
                }`}
              >
                <div className="relative">
                  <Icon size={18} />
                  {item.badge && (
                    <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-medium text-white">
                      {item.badge}
                    </span>
                  )}
                </div>
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="border-t border-white/10 p-4">
          {/* Logout button */}
          {isAuthenticated && (
            <button
              onClick={logout}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#8792A2]/30 bg-white/10 px-3 py-2.5 text-sm font-medium text-[#8792A2] transition hover:bg-white/20 hover:text-white"
            >
              <LogOut size={16} />
              Logout
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
