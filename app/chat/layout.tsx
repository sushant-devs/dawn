'use client';

import { DAWNProvider } from '@/context/DAWNContext';

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <DAWNProvider>
      <div className="flex h-screen overflow-hidden bg-[radial-gradient(circle_at_10%_-10%,rgba(0,168,150,0.10),transparent_35%),radial-gradient(circle_at_90%_0%,rgba(13,27,62,0.08),transparent_35%),#f8fafc]">
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {children}
        </div>
      </div>
    </DAWNProvider>
  );
}
