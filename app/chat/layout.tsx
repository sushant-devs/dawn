'use client';

import { DAWNProvider } from '@/context/DAWNContext';

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <DAWNProvider>
      <div className="flex h-screen overflow-hidden bg-[url('/home-bg.jpg')] bg-cover bg-center bg-no-repeat">
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {children}
        </div>
      </div>
    </DAWNProvider>
  );
}
