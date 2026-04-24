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

  const scrollToBottom = () => {
    const container = containerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  const handleContentExpand = () => {
    if (shouldAutoScroll) {
      requestAnimationFrame(() => {
        scrollToBottom();
      });
    }
  };

  // Check if user has scrolled up manually
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShouldAutoScroll(isNearBottom);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-scroll with improved timing
  useEffect(() => {
    if (shouldAutoScroll) {
      // Use requestAnimationFrame for better timing
      requestAnimationFrame(() => {
        scrollToBottom();
      });
    }
  }, [visibleMessages, isTyping, activeStreamIndex, shouldAutoScroll]);

  // Force scroll when new content appears (like document cards, images)
  useEffect(() => {
    if (shouldAutoScroll) {
      const timer = setTimeout(() => {
        scrollToBottom();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [messages.length, shouldAutoScroll]);

  // Continuous scroll during streaming - check every 100ms
  useEffect(() => {
    if (!shouldAutoScroll || activeStreamIndex === -1) return;

    const scrollInterval = setInterval(() => {
      const container = containerRef.current;
      if (container) {
        const { scrollTop, scrollHeight, clientHeight } = container;
        const isAtBottom = scrollHeight - scrollTop - clientHeight < 10;

        // Only scroll if not at bottom (content is growing)
        if (!isAtBottom) {
          scrollToBottom();
        }
      }
    }, 100);

    return () => clearInterval(scrollInterval);
  }, [shouldAutoScroll, activeStreamIndex]);

  // Watch for content changes and auto-scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !shouldAutoScroll) return;

    const observer = new MutationObserver(() => {
      // Content has changed, scroll to bottom
      scrollToBottom();
    });

    observer.observe(container, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => observer.disconnect();
  }, [shouldAutoScroll]);

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
