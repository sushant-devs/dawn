'use client';

import { useState, useEffect } from 'react';
import { TypeAnimation } from 'react-type-animation';

interface TypingIndicatorProps {
  message?: string;
}

const THINKING_STREAM_SPEED = 99;
const THINKING_STREAM_START_DELAY_MS = 300;

export default function TypingIndicator({ message = 'DAWN is thinking…' }: TypingIndicatorProps) {
  // Check if message contains multiple lines (detailed thinking message)
  const isDetailedMessage = message.includes('\n');

  const [isMounted, setIsMounted] = useState(false);

  // Handle hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Prevent hydration mismatch by showing simple loader on server render
  if (!isMounted) {
    return (
      <div className="flex items-start gap-3 max-w-2xl">
        <div className="w-8 h-8 rounded-full bg-dawn-navy flex items-center justify-center shrink-0 mt-0.5">
          <span className="text-white font-serif text-xs font-bold">D</span>
        </div>
        <div className="bg-white rounded-2xl rounded-tl-sm border border-dawn-border shadow-sm px-4 py-3 flex-1">
          <div className="flex items-center gap-3">
            <div className="flex gap-1 items-center">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-dawn-teal animate-[typing-dot_1.2s_ease-in-out_infinite]"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
            <span className="text-xs text-gray-400">{message}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 animate-fade-in-up max-w-2xl">
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-dawn-navy flex items-center justify-center shrink-0 mt-0.5">
        <span className="text-white font-serif text-xs font-bold">D</span>
      </div>

      {/* Bubble */}
      <div className="bg-white rounded-2xl rounded-tl-sm border border-dawn-border shadow-sm px-4 py-3 flex-1">
        {isDetailedMessage ? (
          // Detailed multiline message with streaming type animation
          <div className="space-y-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex gap-1 items-center">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-dawn-teal animate-[typing-dot_1.2s_ease-in-out_infinite]"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-dawn-navy">Generating content...</span>
            </div>
            <div className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
              <TypeAnimation
                key={message}
                sequence={[THINKING_STREAM_START_DELAY_MS, message]}
                speed={THINKING_STREAM_SPEED}
                repeat={0}
                cursor={true}
                style={{ display: 'block', whiteSpace: 'pre-line' }}
              />
            </div>
          </div>
        ) : (
          // Simple single-line message
          <div className="flex items-center gap-3">
            <div className="flex gap-1 items-center">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-dawn-teal animate-[typing-dot_1.2s_ease-in-out_infinite]"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
            <span className="text-xs text-gray-400">{message}</span>
          </div>
        )}
      </div>
    </div>
  );
}
