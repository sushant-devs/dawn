'use client';

import { useState } from 'react';
import { X, Plus, Trash2, BookOpen, Star, Search, ThumbsUp, ThumbsDown, Sparkles, Copy, Check } from 'lucide-react';
import { MEDICAL_PROMPTS } from '@/lib/mockData';
import type { MedicalPrompt } from '@/lib/types';

interface ManualBriefInputModalProps {
  onConfirm: () => void;
  onClose: () => void;
}

interface BriefItem {
  id: string;
  title: string;
  content: string;
}

type ViewMode = 'form' | 'library';

export default function ManualBriefInputModal({ onConfirm, onClose }: ManualBriefInputModalProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('form');
  const [briefs, setBriefs] = useState<BriefItem[]>([
    { id: '1', title: 'Primary Efficacy Claim', content: 'Hemlibra achieved a median ABR of 0.0 in HAVEN 4 study with monthly dosing, with 56% of patients experiencing zero treated bleeds.' },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [favorites, setFavorites] = useState<Set<string>>(new Set(['efficacy-1', 'safety-1', 'moa-1', 'dosing-2']));
  const [selectedPrompt, setSelectedPrompt] = useState<MedicalPrompt | null>(null);
  const [promptVariables, setPromptVariables] = useState<Record<string, string>>({});
  const [generatedContent, setGeneratedContent] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [copied, setCopied] = useState(false);

  const categories = ['All', 'Efficacy', 'Safety', 'MOA', 'Dosing', 'Patient Support', 'Custom'];

  const filteredPrompts = MEDICAL_PROMPTS.filter((prompt) => {
    const matchesSearch = prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prompt.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || prompt.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addBrief = () => {
    setBriefs([...briefs, { id: Date.now().toString(), title: '', content: '' }]);
  };

  const removeBrief = (id: string) => {
    if (briefs.length > 1) {
      setBriefs(briefs.filter((b) => b.id !== id));
    }
  };

  const updateBrief = (id: string, field: 'title' | 'content', value: string) => {
    setBriefs(briefs.map((b) => (b.id === id ? { ...b, [field]: value } : b)));
  };

  const toggleFavorite = (promptId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(promptId)) {
      newFavorites.delete(promptId);
    } else {
      newFavorites.add(promptId);
    }
    setFavorites(newFavorites);
  };

  const selectPrompt = (prompt: MedicalPrompt) => {
    setSelectedPrompt(prompt);
    const initialVariables: Record<string, string> = {};
    prompt.variables.forEach(v => {
      // Pre-fill with default values
      if (v === 'CAMPAIGN_NAME') initialVariables[v] = 'Hemlibra Prophylaxis Advocacy 2026';
      else if (v === 'MARKETS') initialVariables[v] = 'US, EMEA, Germany';
      else if (v === 'AUDIENCE') initialVariables[v] = 'Hematologists, Rheumatologists';
      else if (v === 'DELIVERABLES') initialVariables[v] = 'Congress Poster, HCP Email (US), HCP Email (DE), Patient Leaflet, Digital Detail Aid, Social Assets';
      else if (v === 'STUDY_NAME') initialVariables[v] = 'HAVEN 4';
      else initialVariables[v] = '';
    });
    setPromptVariables(initialVariables);
    setGeneratedContent('');
    setShowFeedback(false);
  };

  const generateContent = () => {
    if (!selectedPrompt) return;

    let content = selectedPrompt.prompt;
    Object.keys(promptVariables).forEach(variable => {
      content = content.replace(`{${variable}}`, promptVariables[variable] || `[${variable}]`);
    });

    setGeneratedContent(content);
  };

  const addGeneratedToBrief = () => {
    if (generatedContent && selectedPrompt) {
      setBriefs([...briefs, {
        id: Date.now().toString(),
        title: selectedPrompt.title,
        content: generatedContent
      }]);
      setViewMode('form');
      setSelectedPrompt(null);
      setGeneratedContent('');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const canConfirm = briefs.some((b) => b.title.trim() && b.content.trim());

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative ml-auto w-full max-w-5xl bg-white h-full flex flex-col animate-slide-in-right shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-dawn-border bg-white">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-dawn-navy rounded flex items-center justify-center">
              <span className="text-white font-serif text-xs font-bold">D</span>
            </div>
            <div>
              <h2 className="font-serif text-dawn-navy text-lg">Manual Brief Input</h2>
              <p className="text-xs text-gray-400">Add your campaign briefs or use Medical Prompt Library</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-dawn-navy transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* View Mode Toggle */}
        <div className="px-6 py-3 bg-dawn-sky/30 border-b border-dawn-teal/20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode('form')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'form'
                  ? 'bg-dawn-teal text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-dawn-border hover:border-dawn-teal'
              }`}
            >
              <Plus size={16} />
              Manual Entry
            </button>
            <button
              onClick={() => setViewMode('library')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'library'
                  ? 'bg-dawn-teal text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-dawn-border hover:border-dawn-teal'
              }`}
            >
              <BookOpen size={16} />
              Medical Prompt Library
            </button>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            {viewMode === 'form'
              ? 'Add your campaign briefs directly below. Each brief should include a title and detailed content.'
              : 'Use predefined or custom prompts tailored for medical content generation. Save favorites and provide feedback to improve responses.'}
          </p>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden flex">
          {viewMode === 'form' ? (
            // Manual Entry Form
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              {briefs.map((brief, index) => (
                <div key={brief.id} className="border border-dawn-border rounded-lg p-4 bg-white">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-dawn-navy text-white text-xs flex items-center justify-center font-semibold">
                        {index + 1}
                      </span>
                      <span className="text-xs font-medium text-gray-500">Brief {index + 1}</span>
                    </div>
                    {briefs.length > 1 && (
                      <button
                        onClick={() => removeBrief(brief.id)}
                        className="text-gray-400 hover:text-dawn-red transition-colors"
                        title="Remove brief"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    {/* Title */}
                    <div>
                      <label className="block text-xs font-medium text-dawn-navy mb-1">
                        Brief Title
                      </label>
                      <input
                        type="text"
                        value={brief.title}
                        onChange={(e) => updateBrief(brief.id, 'title', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-dawn-border rounded-lg focus:outline-none focus:ring-2 focus:ring-dawn-teal/30 focus:border-dawn-teal"
                      />
                    </div>

                    {/* Content */}
                    <div>
                      <label className="block text-xs font-medium text-dawn-navy mb-1">
                        Brief Content
                      </label>
                      <textarea
                        value={brief.content}
                        onChange={(e) => updateBrief(brief.id, 'content', e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 text-sm border border-dawn-border rounded-lg focus:outline-none focus:ring-2 focus:ring-dawn-teal/30 focus:border-dawn-teal resize-none"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        {brief.content.length} characters
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Brief Button */}
              <button
                onClick={addBrief}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-dawn-teal hover:text-dawn-teal transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                Add Another Brief
              </button>

              {/* Examples Section */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="text-xs font-semibold text-dawn-navy mb-2">Examples:</h4>
                <div className="space-y-2 text-xs text-gray-600">
                  <div>
                    <span className="font-medium text-dawn-navy">Title:</span> "Primary Efficacy Claim"<br />
                    <span className="font-medium text-dawn-navy">Content:</span> "Hemlibra achieved a median ABR of 0.0 in HAVEN 4 study with monthly dosing, with 56% of patients experiencing zero treated bleeds."
                  </div>
                  <div>
                    <span className="font-medium text-dawn-navy">Title:</span> "Treatment Burden Reduction"<br />
                    <span className="font-medium text-dawn-navy">Content:</span> "Monthly subcutaneous dosing reduces annual treatments from 156 IV infusions to just 13 SC injections per year."
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Medical Prompt Library
            <div className="flex-1 flex">
              {/* Prompt List */}
              <div className="w-1/2 border-r border-dawn-border overflow-y-auto">
                {/* Search and Filters */}
                <div className="p-4 border-b border-dawn-border bg-white sticky top-0 z-10">
                  <div className="relative mb-3">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search prompts by title, description, or tags..."
                      className="w-full pl-9 pr-3 py-2 text-sm border border-dawn-border rounded-lg focus:outline-none focus:ring-2 focus:ring-dawn-teal/30 focus:border-dawn-teal"
                    />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                          selectedCategory === cat
                            ? 'bg-dawn-teal text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Prompt Cards */}
                <div className="p-4 space-y-2">
                  {filteredPrompts.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <BookOpen size={32} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No prompts found</p>
                    </div>
                  ) : (
                    filteredPrompts.map(prompt => (
                      <div
                        key={prompt.id}
                        onClick={() => selectPrompt(prompt)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedPrompt?.id === prompt.id
                            ? 'border-dawn-teal bg-dawn-teal/5 shadow-sm'
                            : 'border-dawn-border hover:border-dawn-teal/50 bg-white'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="text-sm font-semibold text-dawn-navy">{prompt.title}</h4>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(prompt.id);
                            }}
                            className="shrink-0"
                          >
                            <Star
                              size={14}
                              className={favorites.has(prompt.id) ? 'fill-dawn-amber text-dawn-amber' : 'text-gray-300'}
                            />
                          </button>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{prompt.description}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                            prompt.category === 'Efficacy' ? 'bg-blue-100 text-blue-700' :
                            prompt.category === 'Safety' ? 'bg-red-100 text-red-700' :
                            prompt.category === 'MOA' ? 'bg-purple-100 text-purple-700' :
                            prompt.category === 'Dosing' ? 'bg-green-100 text-green-700' :
                            prompt.category === 'Patient Support' ? 'bg-amber-100 text-amber-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {prompt.category}
                          </span>
                          {prompt.usageCount && (
                            <span className="text-[10px] text-gray-400">
                              Used {prompt.usageCount} times
                            </span>
                          )}
                        </div>
                        {prompt.tags && prompt.tags.length > 0 && (
                          <div className="flex gap-1 mt-2">
                            {prompt.tags.map(tag => (
                              <span key={tag} className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Prompt Editor */}
              <div className="w-1/2 overflow-y-auto bg-gray-50">
                {selectedPrompt ? (
                  <div className="p-6 space-y-4">
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-base font-serif font-semibold text-dawn-navy">{selectedPrompt.title}</h3>
                        <button
                          onClick={() => toggleFavorite(selectedPrompt.id)}
                          className="shrink-0"
                        >
                          <Star
                            size={18}
                            className={favorites.has(selectedPrompt.id) ? 'fill-dawn-amber text-dawn-amber' : 'text-gray-400'}
                          />
                        </button>
                      </div>
                      <p className="text-xs text-gray-600">{selectedPrompt.description}</p>
                    </div>

                    <div className="bg-white border border-dawn-border rounded-lg p-3">
                      <p className="text-xs font-medium text-gray-500 mb-2">Prompt Template:</p>
                      <p className="text-xs text-gray-700 leading-relaxed font-mono bg-gray-50 p-2 rounded">
                        {selectedPrompt.prompt}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <p className="text-xs font-semibold text-dawn-navy">Fill in Variables:</p>
                      {selectedPrompt.variables.map(variable => (
                        <div key={variable}>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            {variable.replace(/_/g, ' ')}
                          </label>
                          <input
                            type="text"
                            value={promptVariables[variable] || ''}
                            onChange={(e) => setPromptVariables({...promptVariables, [variable]: e.target.value})}
                            className="w-full px-3 py-2 text-sm border border-dawn-border rounded-lg focus:outline-none focus:ring-2 focus:ring-dawn-teal/30 focus:border-dawn-teal"
                          />
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={generateContent}
                      className="w-full py-2.5 bg-dawn-teal text-white text-sm font-medium rounded-lg hover:bg-dawn-teal/90 transition-all shadow-sm flex items-center justify-center gap-2"
                    >
                      <Sparkles size={16} />
                      Generate Content
                    </button>

                    {generatedContent && (
                      <div className="space-y-3">
                        <div className="bg-white border border-dawn-border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-semibold text-dawn-navy">Generated Content:</p>
                            <button
                              onClick={copyToClipboard}
                              className="flex items-center gap-1 text-xs text-dawn-teal hover:text-dawn-teal/80"
                            >
                              {copied ? <Check size={12} /> : <Copy size={12} />}
                              {copied ? 'Copied!' : 'Copy'}
                            </button>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {generatedContent}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={addGeneratedToBrief}
                            className="flex-1 py-2 bg-dawn-navy text-white text-sm font-medium rounded-lg hover:bg-dawn-navy/90 transition-all"
                          >
                            Add to Brief
                          </button>
                          <button
                            onClick={() => setShowFeedback(!showFeedback)}
                            className="px-4 py-2 border border-dawn-border text-sm text-gray-600 rounded-lg hover:bg-gray-50 transition-all"
                          >
                            Feedback
                          </button>
                        </div>

                        {showFeedback && (
                          <div className="bg-dawn-sky/30 border border-dawn-teal/20 rounded-lg p-4 space-y-3">
                            <p className="text-xs font-semibold text-dawn-navy">How was this output?</p>
                            <div className="flex gap-2">
                              <button className="flex items-center gap-2 px-3 py-2 bg-white border border-dawn-border rounded-lg text-xs hover:bg-gray-50 transition-all">
                                <ThumbsUp size={14} />
                                Good
                              </button>
                              <button className="flex items-center gap-2 px-3 py-2 bg-white border border-dawn-border rounded-lg text-xs hover:bg-gray-50 transition-all">
                                <ThumbsDown size={14} />
                                Needs Improvement
                              </button>
                            </div>
                            <textarea
                              placeholder="Optional: Share specific feedback to improve future responses..."
                              rows={2}
                              className="w-full px-3 py-2 text-xs border border-dawn-border rounded-lg focus:outline-none focus:ring-2 focus:ring-dawn-teal/30 focus:border-dawn-teal resize-none"
                            />
                            <button className="w-full py-1.5 bg-dawn-teal text-white text-xs font-medium rounded-lg hover:bg-dawn-teal/90 transition-all">
                              Submit Feedback
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-center p-8">
                    <div>
                      <BookOpen size={48} className="mx-auto mb-3 text-gray-300" />
                      <p className="text-sm text-gray-500 mb-1">Select a prompt to get started</p>
                      <p className="text-xs text-gray-400">Choose from predefined medical prompts or create your own</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-dawn-border bg-white">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-gray-500">
              {briefs.filter((b) => b.title.trim() && b.content.trim()).length} of {briefs.length} briefs completed
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-500 hover:text-dawn-navy border border-dawn-border rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={!canConfirm}
              className="px-5 py-2 bg-dawn-teal text-white text-sm font-medium rounded-lg hover:bg-dawn-teal/90 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm Briefs & Continue →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
