'use client';

import { useState, useEffect, useRef } from 'react';

interface TypingIndicatorProps {
  message?: string;
}

export default function TypingIndicator({ message = 'DAWN is thinking…' }: TypingIndicatorProps) {
  // Check if message contains multiple lines (detailed thinking message)
  const isDetailedMessage = message.includes('\n');

  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentTitle, setCurrentTitle] = useState('Working on it...');
  const [isMounted, setIsMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Extract title from the latest displayed lines
  const extractTitle = (lines: string[]): string => {
    // Look through recent lines for section headers (lines ending with colon or containing key phrases)
    for (let i = lines.length - 1; i >= Math.max(0, lines.length - 5); i--) {
      const line = lines[i];
      if (!line) continue;

      // Check if line is a section header (ends with colon)
      if (line.trim().endsWith(':')) {
        return line.trim();
      }

      // Check for specific keywords
      if (line.includes('Loading MLR')) return 'Loading MLR review protocols...';
      if (line.includes('Analyzing your')) return 'Analyzing campaign assets...';
      if (line.includes('Scanning Congress Poster')) return 'Scanning Congress Poster...';
      if (line.includes('Scanning HCP Email - US')) return 'Scanning HCP Email - US...';
      if (line.includes('Scanning HCP Email - Germany')) return 'Scanning HCP Email - Germany...';
      if (line.includes('Scanning Patient Leaflet')) return 'Scanning Patient Leaflet...';
      if (line.includes('Scanning Digital Detail Aid')) return 'Scanning Digital Detail Aid...';
      if (line.includes('Running cross-asset')) return 'Running cross-asset checks...';
      if (line.includes('Fair balance analysis')) return 'Fair balance analysis...';
      if (line.includes('Generating pre-screen')) return 'Generating pre-screen report...';
      if (line.includes('MLR pre-screen complete')) return 'MLR pre-screen complete';
    }
    return 'Working on it...';
  };

  // Handle hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !isDetailedMessage) {
      setDisplayedLines([]);
      return;
    }

    // Split message into lines (keep all lines including empty ones for spacing)
    const lines = message.split('\n');

    // Reset state
    setDisplayedLines([]);
    let currentIndex = 0;

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Progressive reveal: show lines one by one
    intervalRef.current = setInterval(() => {
      if (currentIndex < lines.length) {
        const lineToAdd = lines[currentIndex];
        if (lineToAdd !== undefined) {
          setDisplayedLines((prev) => {
            const newLines = [...prev, lineToAdd];
            // Update title based on new lines
            setCurrentTitle(extractTitle(newLines));
            return newLines;
          });
        }
        currentIndex++;
      } else {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    }, 500); // Show each line every 500ms for slower, more readable progression

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [message, isDetailedMessage, isMounted]);

  // Separate effect for auto-scrolling when lines are added
  useEffect(() => {
    if (scrollRef.current && displayedLines.length > 0) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [displayedLines]);

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
          // Detailed multiline message with progressive reveal
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
              <span className="text-xs font-semibold text-dawn-navy">{currentTitle}</span>
            </div>
            <div
              ref={scrollRef}
              className="text-xs text-gray-700 leading-relaxed"
            >
              {displayedLines.map((line, index) => {
                // Safety check - ensure line is defined and is a string
                if (!line || typeof line !== 'string') {
                  return null;
                }

                // Check if line is a section header (starts with emoji or has special formatting)
                const isHeader = line.match(/^[📄🎨📝🌍✅]/);
                const isEmpty = line.trim() === '';

                return (
                  <div
                    key={`line-${index}-${line.substring(0, 10)}`}
                    className={`transition-opacity duration-300 ${
                      isEmpty ? 'h-2' : isHeader ? 'font-semibold text-dawn-navy mt-3 mb-1' : 'ml-2 text-gray-600'
                    }`}
                    style={{
                      opacity: 1,
                      animation: 'fadeIn 0.3s ease-in'
                    }}
                  >
                    {isEmpty ? '' : line}
                  </div>
                );
              })}
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
