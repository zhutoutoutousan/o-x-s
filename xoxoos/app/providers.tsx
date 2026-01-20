'use client';

import { GamificationProvider } from '@/src/context/GamificationContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GamificationProvider>
      {children}
    </GamificationProvider>
  );
}
