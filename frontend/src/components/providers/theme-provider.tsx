'use client';

import React from 'react';

interface ThemeProviderProps {
  children: React.ReactNode;
  attribute?: 'class' | 'data-theme' | 'data-mode';
  defaultTheme?: string;
  enableSystem?: boolean;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  enableSystem = true,
  storageKey = 'review-auto-theme',
}: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);

    const storedTheme = window.localStorage.getItem(storageKey);
    const selectedTheme = storedTheme ?? defaultTheme;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark =
      selectedTheme === 'dark' ||
      (selectedTheme === 'system' && enableSystem && prefersDark);

    document.documentElement.classList.toggle('dark', shouldUseDark);

    if (!storedTheme) {
      window.localStorage.setItem(storageKey, defaultTheme);
    }
  }, [defaultTheme, enableSystem, storageKey]);

  if (!mounted) return <>{children}</>;

  return <>{children}</>;
}
