'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  MessageSquare,
  ChevronRight,
  Sun,
  Trash2,
  MoreHorizontal,
} from 'lucide-react';
import type { UserProfile } from '@/lib/authApi';

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
}

interface WorkspaceSidebarProps {
  activeWorkspace: string;
  activeChatId?: string;
  chatSessions: ChatSession[];
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  onClearHistory?: () => void;
  onDeleteChat?: (chatId: string) => void;
}

export default function WorkspaceSidebar({
  activeChatId,
  chatSessions,
  onNewChat,
  onSelectChat,
  onClearHistory,
  onDeleteChat,
}: WorkspaceSidebarProps) {
  const router = useRouter();
  const [userName, setUserName] = useState('User');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openMenuChatId, setOpenMenuChatId] = useState<string | null>(null);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    const stored = localStorage.getItem('dawn_user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as UserProfile;
        if (parsed.full_name?.trim()) {
          setUserName(parsed.full_name.trim());
          return;
        }
      } catch {}
    }
    setUserName('User');
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!profileMenuRef.current) return;
      if (!profileMenuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  useEffect(() => {
    if (!openMenuChatId) return;
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('[data-chat-menu]')) {
        setOpenMenuChatId(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [openMenuChatId]);

  const userFirstName = useMemo(() => {
    return userName.trim().split(' ')[0] || 'User';
  }, [userName]);

  const userInitial = useMemo(() => {
    const names = userName.trim().split(' ');
    if (names.length >= 2) {
      return (names[0].charAt(0) + names[1].charAt(0)).toUpperCase();
    }
    return userName.trim().charAt(0).toUpperCase() || 'U';
  }, [userName]);

  return (
    <aside className="w-[260px] h-full bg-transparent flex flex-col shrink-0">
      {/* Brand */}
      <div className="px-3 pt-3 pb-4 flex items-center justify-between shrink-0">
        <button
          onClick={() => router.push('/workspace')}
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity cursor-pointer"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#8624FF] to-[#B47CFF] flex items-center justify-center shadow-[0_0_18px_rgba(134,36,255,0.35)]">
            <Sun size={14} className="text-white" strokeWidth={2} />
          </div>
          <span className="text-base font-semibold text-zinc-900 tracking-tight">
            DAWN
          </span>
        </button>
      </div>

      {/* New Conversation */}
      <div className="px-3 pb-4">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors cursor-pointer shadow-sm"
        >
          <Plus size={16} strokeWidth={2.5} />
          <span className="text-sm font-semibold">New Conversation</span>
        </button>
      </div>

      {/* Recent Conversations */}
      <div className="flex-1 overflow-y-auto px-3 pb-3">
        <h3 className="text-[12px] font-semibold text-gray-400  tracking-[0.08em] mb-3 px-2">
          Recents
        </h3>
        <div className="space-y-1.5">
          {chatSessions.length === 0 ? (
            <div className="px-3 py-8 text-center">
              <MessageSquare size={20} className="mx-auto text-gray-400 mb-2" />
              <p className="text-xs text-gray-500">No chats yet</p>
            </div>
          ) : (
            chatSessions.slice(0, 15).map((chat) => {
              const isActive = activeChatId === chat.id;
              return (
              <div
                key={chat.id}
                className={`group relative w-full flex items-center gap-1 px-3 py-2.5 rounded-xl transition-all duration-150 ${
                  isActive
                    ? 'bg-purple-50 text-[#8624FF] shadow-md border border-purple-300 ring-1 ring-purple-200/70'
                    : 'bg-white text-[#8624FF] shadow-md border border-zinc-200/50 hover:shadow-lg hover:border-purple-200/60'
                }`}
              >
                <button
                  type="button"
                  onClick={() => onSelectChat(chat.id)}
                  className="flex min-w-0 flex-1 items-center gap-2.5 text-left cursor-pointer"
                  aria-current={isActive ? 'true' : undefined}
                >
                  <MessageSquare
                    size={14}
                    className={`shrink-0 ${isActive ? 'text-purple-600' : 'text-[#8624FF]/70'}`}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span className={`text-sm truncate flex-1 ${isActive ? 'font-semibold' : 'font-medium'}`}>
                    {chat.title}
                  </span>
                </button>

                {onDeleteChat && (
                  <div className="relative shrink-0" data-chat-menu>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuChatId((prev) => (prev === chat.id ? null : chat.id));
                      }}
                      className={`flex h-7 w-7 items-center justify-center rounded-md transition-all cursor-pointer ${
                        isActive
                          ? 'text-purple-500 hover:text-purple-700 hover:bg-purple-100/80'
                          : 'text-gray-400 hover:text-[#8624FF] hover:bg-purple-50'
                      } ${
                        openMenuChatId === chat.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}
                      aria-label="Chat options"
                    >
                      <MoreHorizontal size={16} />
                    </button>

                    {openMenuChatId === chat.id && (
                      <div className="absolute right-0 top-full z-20 mt-1 min-w-[120px] rounded-lg border border-dawn-border bg-white py-1 shadow-lg">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuChatId(null);
                            onDeleteChat(chat.id);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-left text-xs font-medium text-rose-600 hover:bg-rose-50 cursor-pointer"
                        >
                          <Trash2 size={14} className="shrink-0" />
                          <span>Delete chat</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
            })
          )}
        </div>
      </div>

      {/* Profile */}
      <div className="p-3 relative" ref={profileMenuRef}>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="group relative w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all duration-150 bg-white text-[#8624FF] shadow-md border border-zinc-200/50 cursor-pointer hover:shadow-lg"
        >
          <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {userInitial}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-medium truncate">
              {userFirstName}
            </p>
          </div>
          <ChevronRight size={16} />
        </button>

        {isMenuOpen && (
          <div className="absolute bottom-full left-3 right-3 mb-2 rounded-lg border border-dawn-border bg-white shadow-xl overflow-hidden">
            <div className="p-3 border-b border-dawn-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-bold">
                  {userInitial}
                </div>
                <div>
                  <p className="text-sm font-semibold text-dawn-navy">{userName}</p>
                </div>
              </div>
            </div>
            {chatSessions.length > 0 && onClearHistory && (
              <button
                onClick={() => {
                  if (window.confirm('Clear all conversation history? This cannot be undone.')) {
                    setIsMenuOpen(false);
                    onClearHistory();
                  }
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-gray-600 hover:text-rose-600 hover:bg-rose-50 transition-colors  cursor-pointer"
              >
                <Trash2 size={16} />
                <span>Clear all history</span>
              </button>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
