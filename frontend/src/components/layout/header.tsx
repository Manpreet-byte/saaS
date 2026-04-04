'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Moon, Sun, Bell, LayoutDashboard, Sparkles, MessageSquare, Filter, SlidersHorizontal, LogOut } from 'lucide-react';
import { useAuth } from '@/components/providers/auth-provider';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Review Funnel', href: '/review-funnel', icon: Filter },
  { name: 'AI Suggestions', href: '/ai-suggestions', icon: Sparkles },
  { name: 'Responses', href: '/automated-responses', icon: MessageSquare },
  { name: 'Settings', href: '/settings', icon: SlidersHorizontal },
];

export function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuth();

  React.useEffect(() => {
    setDarkMode(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleDarkMode = () => {
    const nextTheme = !darkMode;
    setDarkMode(nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme);
    window.localStorage.setItem('review-auto-theme', nextTheme ? 'dark' : 'light');
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/40 bg-white/70 backdrop-blur-xl dark:border-primary-700/70 dark:bg-primary-900/70">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-lg shadow-primary-500/20">
              <LayoutDashboard size={18} />
            </div>
            <div>
              <p className="display-font text-lg font-bold leading-none">ReviewMaster</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition-all ${
                  active
                    ? 'bg-cyan-100/80 text-cyan-800 shadow-sm dark:bg-cyan-900/40 dark:text-cyan-300'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                }`}
              >
                <Icon size={15} /> {item.name}
              </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button className="relative rounded-xl p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
              <Bell size={20} />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-rose-500"></span>
            </button>

            <button
              onClick={toggleDarkMode}
              className="rounded-xl p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-xl p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {isAuthenticated ? (
              <button
                onClick={logout}
                className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-rose-300 hover:text-rose-600 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:text-rose-400 sm:flex"
              >
                <LogOut size={16} />
                Logout
              </button>
            ) : (
              <button className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-cyan-300 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200 sm:flex">
                <div className="h-7 w-7 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600" />
                Blue Bottle Cafe
              </button>
            )}
          </div>
        </div>

        {sidebarOpen && (
          <div className="animate-slide-in space-y-2 border-t border-slate-200/70 p-4 dark:border-slate-800 lg:hidden">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${
                    active
                      ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300'
                      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon size={15} /> {item.name}
                </Link>
              );
            })}
          </div>
        )}
      </header>
    </>
  );
}
