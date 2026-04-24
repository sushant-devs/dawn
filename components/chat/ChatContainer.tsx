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
  const [completedMessageIds, setCompletedMessageIds] = useState<Set<string>>(new Set());

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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [visibleMessages, isTyping, activeStreamIndex]);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6">
      <div className="mx-auto w-full max-w-4xl space-y-5 rounded-3xl glass-navbar md:p-6">
        {visibleMessages.map((msg, index) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            shouldStream={index === activeStreamIndex}
            onStreamComplete={handleStreamComplete}
          />
        ))}
        {isTyping && activeStreamIndex === -1 && <TypingIndicator message={typingMessage} />}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
