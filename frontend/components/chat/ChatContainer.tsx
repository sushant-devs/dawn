'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import type { ChatMessage } from '@/lib/types';

interface ChatContainerProps {
  messages: ChatMessage[];
  isTyping: boolean;
  typingMessage?: string;
}

export default function ChatContainer({ messages, isTyping, typingMessage }: ChatContainerProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [completedMessageIds, setCompletedMessageIds] = useState<Set<string>>(new Set());
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCompletedMessageIds((prev) => {
      const next = new Set<string>();
      const existingIds = new Set(messages.map((m) => m.id));

      prev.forEach((id) => {
        if (existingIds.has(id)) next.add(id);
      });

      return next;
    });
  }, [messages]);

  const activeStreamIndex = useMemo(
    () => messages.findIndex((msg) => !completedMessageIds.has(msg.id)),
    [messages, completedMessageIds]
  );

  const visibleMessages = useMemo(() => {
    if (activeStreamIndex === -1) return messages;
    return messages.slice(0, activeStreamIndex + 1);
  }, [messages, activeStreamIndex]);

  const handleStreamComplete = (messageId: string) => {
    setCompletedMessageIds((prev) => {
      if (prev.has(messageId)) return prev;
      const next = new Set(prev);
      next.add(messageId);
      return next;
    });
  };

  const scrollToBottom = (behavior: ScrollBehavior = 'auto') => {
    const container = containerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior,
      });
    }
  };

  const handleContentExpand = () => {
    if (shouldAutoScroll) {
      scrollToBottom();
    }
  };

  // Track user-initiated scroll vs programmatic scroll
  const isUserScrolling = useRef(false);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      isUserScrolling.current = true;
      // If user scrolls up, immediately disable auto-scroll
      if (e.deltaY < 0) {
        setShouldAutoScroll(false);
      }
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        isUserScrolling.current = false;
      }, 150);
    };

    const handleTouchStart = () => {
      isUserScrolling.current = true;
    };

    const handleTouchEnd = () => {
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        isUserScrolling.current = false;
      }, 150);
    };

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;

      if (isUserScrolling.current && !isNearBottom) {
        setShouldAutoScroll(false);
      } else if (isUserScrolling.current && isNearBottom) {
        setShouldAutoScroll(true);
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: true });
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });
    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, []);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (shouldAutoScroll) {
      scrollToBottom('smooth');
    }
  }, [messages.length, shouldAutoScroll]);

  // Scroll during active streaming
  useEffect(() => {
    if (!shouldAutoScroll || activeStreamIndex === -1) return;

    const scrollInterval = setInterval(() => {
      const container = containerRef.current;
      if (!container) return;
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollHeight - scrollTop - clientHeight > 10) {
        scrollToBottom();
      }
    }, 150);

    return () => clearInterval(scrollInterval);
  }, [shouldAutoScroll, activeStreamIndex]);

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto px-6 py-6">
      <div className="mx-auto w-full max-w-4xl space-y-5 rounded-3xl md:p-6">
        {visibleMessages.map((msg, index) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            shouldStream={index === activeStreamIndex}
            onStreamComplete={handleStreamComplete}
            onContentExpand={handleContentExpand}
          />
        ))}
        {isTyping && activeStreamIndex === -1 && <TypingIndicator message={typingMessage} />}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
