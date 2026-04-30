'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MessageSquare, LogOut, Plus } from 'lucide-react';
import { logout, type UserProfile } from '@/lib/authApi';

interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
}

interface WorkspaceSidebarProps {
  activeWorkspace: string;
  activeChatId?: string;
}

export default function WorkspaceSidebar({ activeWorkspace, activeChatId }: WorkspaceSidebarProps) {
  const router = useRouter();
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [userName, setUserName] = useState('User');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const loadChatSessions = () => {
      if (!activeWorkspace) return;
      
      const storageKey = `dawn_chats_${activeWorkspace.toLowerCase()}`;
      const stored = localStorage.getItem(storageKey);
      const sessions = stored ? JSON.parse(stored) : [];
      setChatSessions(sessions);
    };

    loadChatSessions();
  }, [activeWorkspace]);

  const createNewChat = () => {
    const newChatId = `chat-${Date.now()}`;
    const newChat: ChatSession = {
      id: newChatId,
      title: `Chat ${chatSessions.length + 1}`,
      createdAt: new Date().toISOString()
    };
    
    const updatedSessions = [newChat, ...chatSessions];
    setChatSessions(updatedSessions);
    
    const storageKey = `dawn_chats_${activeWorkspace.toLowerCase()}`;
    localStorage.setItem(storageKey, JSON.stringify(updatedSessions));
    
    router.push(`/chat?workspace=${encodeURIComponent(activeWorkspace)}&chatId=${newChatId}`);
  };
  const userInitial = useMemo(() => userName.trim().charAt(0).toUpperCase() || 'U', [userName]);
  const safeFullName = useMemo(() => userName.trim() || 'User', [userName]);

  useEffect(() => {
    const stored = localStorage.getItem('dawn_user');
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as UserProfile;
      if (parsed.full_name?.trim()) {
        setUserName(parsed.full_name.trim());
      }
    } catch {
      setUserName('User');
    }
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!profileMenuRef.current) return;
      if (!profileMenuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch {
      // proceed local cleanup when API fails
    } finally {
      localStorage.removeItem('dawn_user');
      router.push('/login');
      router.refresh();
      setIsLoggingOut(false);
    }
  };

  return (
    <aside
      onClick={() => setIsCollapsed((prev) => !prev)}
      className={`hidden h-full shrink-0 border-r border-slate-200/50 bg-gradient-to-b from-slate-50/95 via-white/90 to-slate-100/95 backdrop-blur-sm transition-all duration-300 md:flex md:flex-col shadow-xl cursor-pointer ${isCollapsed ? 'w-[80px] px-2 py-4' : 'w-[300px] px-4 py-4'
        }`}
    >
      <div className={`mb-6 flex items-center ${isCollapsed ? 'justify-center' : 'justify-start px-1'}`}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            router.push('/workspace');
          }}
          className={`inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-dawn-navy via-dawn-teal to-blue-600 text-sm font-bold text-white shadow-lg shadow-dawn-navy/25 transition-all duration-200 hover:shadow-xl hover:shadow-dawn-navy/30 hover:scale-105 ${
            isCollapsed ? 'h-12 w-12' : 'h-10 w-10'
          }`}
          title="Back to workspaces"
        >
          D
        </button>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          createNewChat();
        }}
        className={`mb-6 flex items-center rounded-2xl bg-gradient-to-r from-dawn-teal to-blue-500 text-sm font-semibold text-white shadow-lg shadow-dawn-teal/30 transition-all duration-200 hover:shadow-xl hover:shadow-dawn-teal/40 hover:-translate-y-1 hover:from-dawn-teal/90 hover:to-blue-500/90 ${isCollapsed ? 'h-12 w-12 justify-center mx-auto' : 'h-11 gap-3 px-4'
          }`}
        title={isCollapsed ? 'New Chat' : undefined}
      >
        <Plus size={18} strokeWidth={2.5} />
        {!isCollapsed ? 'New Chat' : null}
      </button>

      {!isCollapsed ? (
        <div className="mb-4 px-1">
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Chat History</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
          </div>
        </div>
      ) : null}

      <div className={`min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${isCollapsed ? 'space-y-3' : 'space-y-2 pr-1'}`}>
        {chatSessions.length === 0 ? (
          <div className={`flex flex-col items-center justify-center ${isCollapsed ? 'py-8' : 'py-12'}`}>
            {!isCollapsed && (
              <>
                <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mb-3">
                  <MessageSquare size={20} className="text-slate-400" />
                </div>
                <div className="text-sm font-medium text-slate-500 mb-1">No conversations yet</div>
                <div className="text-xs text-slate-400 text-center">Start a new chat to begin</div>
              </>
            )}
          </div>
        ) : (
          chatSessions.map((chat, index) => {
            const isActive = chat.id === activeChatId;
            return (
              <button
                key={chat.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/chat?workspace=${encodeURIComponent(activeWorkspace)}&chatId=${chat.id}`);
                }}
                className={`group flex w-full items-center transition-all duration-200 ${
                  isCollapsed
                    ? `h-12 w-12 justify-center rounded-2xl border mx-auto ${
                        isActive
                          ? 'border-dawn-teal/40 bg-gradient-to-r from-dawn-sky/60 to-blue-50/80 shadow-md'
                          : 'border-transparent bg-white/50 backdrop-blur-sm hover:border-slate-200/60 hover:bg-white/80 hover:shadow-sm'
                      }`
                    : `gap-3 rounded-2xl border px-3 py-3 text-left ${
                        isActive
                          ? 'border-dawn-teal/40 bg-gradient-to-r from-dawn-sky/60 to-blue-50/80 text-dawn-navy shadow-md'
                          : 'border-transparent bg-white/50 backdrop-blur-sm text-slate-700 hover:border-slate-200/60 hover:bg-white/80 hover:shadow-sm'
                      }`
                }`}
                title={isCollapsed ? chat.title : undefined}
              >
                {!isCollapsed && (
                  <span
                    className={`flex shrink-0 items-center justify-center rounded-xl transition-all duration-200 h-8 w-8 ${
                      isActive
                        ? 'bg-white shadow-sm text-dawn-teal'
                        : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-600'
                    }`}
                  >
                    <MessageSquare size={16} strokeWidth={2} />
                  </span>
                )}
                {!isCollapsed ? (
                  <span className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="block truncate text-sm font-semibold">{chat.title}</span>
                      {isActive && (
                        <div className="w-2 h-2 bg-dawn-teal rounded-full animate-pulse"></div>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {new Date(chat.createdAt).toLocaleDateString()}
                    </div>
                  </span>
                ) : (
                  <span className="text-xs font-bold text-slate-700">
                    {index + 1}
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>

      <div ref={profileMenuRef} className="relative mt-4">
        {!isCollapsed && (
          <div className="mb-3 px-1">
            <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
          </div>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen((prev) => !prev);
          }}
          className={`group flex items-center rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-lg shadow-slate-900/5 transition-all duration-200 hover:border-slate-300/60 hover:bg-white hover:shadow-xl hover:shadow-slate-900/10 ${
            isCollapsed
              ? 'h-12 w-12 justify-center mx-auto'
              : 'w-full gap-3 p-2'
          }`}
          title={isCollapsed ? safeFullName : undefined}
        >
          {isCollapsed ? (
            <div className="relative flex items-center justify-center">
              <span className="flex items-center justify-center rounded-xl bg-gradient-to-br from-dawn-navy via-dawn-teal to-blue-600 font-bold text-white shadow-md h-7 w-7 text-xs">
                {userInitial}
              </span>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
            </div>
          ) : (
            <>
              <div className="relative">
                <span className="flex items-center justify-center rounded-xl bg-gradient-to-br from-dawn-navy via-dawn-teal to-blue-600 font-bold text-white shadow-md h-9 w-9 text-xs">
                  {userInitial}
                </span>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
              </div>
              <span className="min-w-0 text-left flex-1">
                <div className="block truncate text-sm font-semibold text-slate-800">{safeFullName}</div>
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                  Online
                </div>
              </span>
            </>
          )}
        </button>

        {isMenuOpen && (
          <div className={`fixed z-[100] overflow-hidden rounded-2xl border border-slate-200/60 bg-white/95 shadow-2xl shadow-slate-900/20 backdrop-blur-xl w-64 ${
            isCollapsed
              ? 'bottom-20 left-2'
              : 'bottom-20 left-4'
          }`}>
            <div className="bg-gradient-to-br from-dawn-navy/5 to-dawn-teal/5 px-4 py-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-dawn-navy via-dawn-teal to-blue-600 text-sm font-bold text-white shadow-md">
                    {userInitial}
                  </span>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div>
                  <p className="truncate text-sm font-semibold text-slate-800">{safeFullName}</p>
                  <p className="text-xs text-slate-500">Active Agent Session</p>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleLogout();
              }}
              disabled={isLoggingOut}
              className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-rose-600 transition-all duration-200 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <LogOut size={18} />
              <span className="font-medium">{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
