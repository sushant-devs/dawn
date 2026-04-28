'use client';

import { useState, useEffect, useRef } from 'react';
import { TypeAnimation } from 'react-type-animation';

interface TypingIndicatorProps {
  message?: string;
}

const THINKING_STREAM_SPEED = 99;
const THINKING_STREAM_START_DELAY_MS = 300;

function getDynamicThinkingTitle(message: string): string {
  const lines = message
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  // Prefer explicit section-style headings if present.
  const sectionTitle = lines.find((line) => line.endsWith(':'));
  if (sectionTitle) return sectionTitle;

  // Otherwise use the first meaningful line and keep it compact.
  const firstLine = lines[0] ?? '';
  if (!firstLine) return 'Working on it...';

  return firstLine.length > 64 ? `${firstLine.slice(0, 61)}...` : firstLine;
}

export default function TypingIndicator({ message = 'DAWN is thinking…' }: TypingIndicatorProps) {
  // Check if message contains multiple lines (detailed thinking message)
  const isDetailedMessage = message.includes('\n');

  const [isMounted, setIsMounted] = useState(false);
  const [dynamicTitle, setDynamicTitle] = useState('Working on it...');
  const streamingViewportRef = useRef<HTMLDivElement>(null);

  // Handle hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isDetailedMessage) {
      setDynamicTitle('Working on it...');
      return;
    }

    // Derive title from progressively visible content instead of static storyline labels.
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const streamElapsed = Math.max(0, elapsed - THINKING_STREAM_START_DELAY_MS);
      const visibleChars = Math.min(message.length, Math.floor(streamElapsed / THINKING_STREAM_SPEED));
      const visibleText = message.slice(0, visibleChars);

      setDynamicTitle(getDynamicThinkingTitle(visibleText));
    };

    tick();
    const interval = setInterval(tick, 120);
    return () => clearInterval(interval);
  }, [message, isDetailedMessage]);

  // Keep the fixed-height thinking viewport pinned to the latest streamed text.
  useEffect(() => {
    if (!isDetailedMessage) return;

    const interval = setInterval(() => {
      const viewport = streamingViewportRef.current;
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }, 120);

    return () => clearInterval(interval);
  }, [isDetailedMessage, message]);

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
              <span className="text-xs font-semibold text-dawn-navy">{dynamicTitle}</span>
            </div>
            <div
              ref={streamingViewportRef}
              className="max-h-40 overflow-y-auto pr-1 text-xs text-gray-700 leading-relaxed whitespace-pre-line"
            >
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
