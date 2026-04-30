'use client';

import { useEffect, useMemo, useState } from 'react';
import { Settings, Search, FileText, Edit3, Image, Shield, BookOpen, Send, BarChart2, Check } from 'lucide-react';
import { useDAWN } from '@/context/DAWNContext';
import type { Stage } from '@/lib/types';
import type { UserProfile } from '@/lib/authApi';

const STAGES: { id: Stage; label: string; icon: React.ElementType; index: number }[] = [
  { id: 'setup',              label: 'Campaign Setup',     icon: Settings,   index: 0 },
  { id: 'finder',             label: 'Content Finder',     icon: Search,     index: 1 },
  { id: 'briefMode',          label: 'Brief Mode',         icon: FileText,   index: 2 },
  { id: 'brief',              label: 'Brief Builder',      icon: FileText,   index: 3 },
  { id: 'templateSelection',  label: 'Template Selection', icon: BookOpen,   index: 4 },
  { id: 'creator',            label: 'Content Creator',    icon: Edit3,      index: 5 },
  { id: 'imagegen',           label: 'Image Generator',    icon: Image,      index: 6 },
  { id: 'mlr',                label: 'MLR Review',         icon: Shield,     index: 7 },
  { id: 'distribution',       label: 'Distribution',       icon: Send,       index: 8 },
  { id: 'effectiveness',      label: 'Effectiveness',      icon: BarChart2,  index: 9 },
];

export default function Sidebar() {
  const { state } = useDAWN();
  const [userName, setUserName] = useState('User');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('dawn_user');
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as UserProfile;
      if (parsed.full_name?.trim()) {
        setUserName(parsed.full_name.trim());
      }
      if (parsed.email?.trim()) {
        setUserEmail(parsed.email.trim());
      }
    } catch {
      setUserName('User');
    }
  }, []);

  const userInitial = useMemo(() => {
    const names = userName.trim().split(' ');
    if (names.length >= 2) {
      return (names[0].charAt(0) + names[1].charAt(0)).toUpperCase();
    }
    return userName.trim().charAt(0).toUpperCase() || 'U';
  }, [userName]);

  return (
    <aside className="w-60 bg-dawn-navy flex flex-col h-full shrink-0">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-white/10">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 bg-dawn-teal rounded-lg flex items-center justify-center">
            <span className="text-white font-serif text-sm font-bold">D</span>
          </div>
          <span className="font-serif text-white text-xl">DAWN</span>
        </div>
        <p className="text-white/40 text-[10px] leading-tight ml-10">
          Digital Agentic Workflow Navigator
        </p>
      </div>

      {/* Campaign chip */}
      <div className="px-5 py-3 border-b border-white/10">
        <span className="inline-flex items-center gap-1.5 bg-dawn-amber/20 text-dawn-amber border border-dawn-amber/30 rounded-full px-2.5 py-1 text-xs font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-dawn-amber" />
          DAWN-HEM-2026-0042
        </span>
      </div>

      {/* Stage Progress */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {STAGES.map((stage) => {
          const isCompleted = state.completedStages.includes(stage.id);
          const isActive = state.currentStage === stage.id && state.hasStarted;
          const isPending = !isCompleted && !isActive;
          const Icon = stage.icon;

          return (
            <div
              key={stage.id}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-dawn-teal/20 text-white'
                  : isCompleted
                  ? 'text-white/70 hover:bg-white/5 cursor-pointer'
                  : 'text-white/30'
              }`}
            >
              {/* Step indicator */}
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-all duration-300 ${
                  isCompleted
                    ? 'bg-dawn-teal text-white'
                    : isActive
                    ? 'bg-dawn-teal text-white'
                    : 'border border-white/20 text-white/30'
                } ${isActive ? 'ring-2 ring-dawn-teal/40 ring-offset-1 ring-offset-dawn-navy' : ''}`}
              >
                {isCompleted ? <Check size={12} /> : stage.index}
              </div>

              {/* Label */}
              <div className="flex flex-col min-w-0">
                <span className={`text-xs font-medium leading-tight ${isPending ? '' : 'text-current'}`}>
                  {stage.label}
                </span>
                {isActive && (
                  <span className="text-[10px] text-dawn-teal/80 mt-0.5">In progress</span>
                )}
                {isCompleted && (
                  <span className="text-[10px] text-white/40 mt-0.5">Completed</span>
                )}
              </div>

              {/* Active dot */}
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-dawn-teal animate-pulse" />
              )}
            </div>
          );
        })}
      </nav>

      {/* User profile */}
      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-dawn-navy via-dawn-teal to-blue-600 flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-semibold">{userInitial}</span>
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-medium truncate">{userName}</p>
            <p className="text-white/40 text-[10px] truncate">{userEmail || 'Active Session'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
