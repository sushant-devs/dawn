'use client';

import { useState } from 'react';
import { X, FileText, Upload, CheckCircle2, Sparkles } from 'lucide-react';
import { GENERATED_ASSETS, PLS_SCORES, PLS_PREVIEW } from '@/lib/mockData';

interface PLSGeneratorModalProps {
  onClose: () => void;
}

type TabType = 'select' | 'upload';

export default function PLSGeneratorModal({ onClose }: PLSGeneratorModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('select');
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPLS, setGeneratedPLS] = useState<string | null>(null);
  const [plsScores, setPLSScores] = useState<typeof PLS_SCORES | null>(null);

  const availableDocs = GENERATED_ASSETS.map((asset) => ({
    id: asset.id,
    title: asset.title,
    wordCount: asset.wordCount,
  }));

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setSelectedDoc(null);
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate generation
    setTimeout(() => {
      setGeneratedPLS(PLS_PREVIEW);
      setPLSScores(PLS_SCORES);
      setIsGenerating(false);
    }, 2000);
  };

  const canGenerate = (activeTab === 'select' && selectedDoc) || (activeTab === 'upload' && uploadedFile);

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative ml-auto w-full max-w-4xl bg-white h-full flex flex-col animate-slide-in-right shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-dawn-border bg-white">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-dawn-navy rounded flex items-center justify-center">
              <span className="text-white font-serif text-xs font-bold">D</span>
            </div>
            <div>
              <h2 className="font-serif text-dawn-navy text-lg">PLS Generator</h2>
              <p className="text-xs text-gray-400">Generate Plain Language Summary for your documents</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-dawn-navy transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-dawn-border">
          <button
            onClick={() => setActiveTab('select')}
            className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === 'select'
                ? 'border-dawn-teal text-dawn-teal'
                : 'border-transparent text-gray-500 hover:text-dawn-navy'
            }`}
          >
            Select from Campaign Documents
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === 'upload'
                ? 'border-dawn-teal text-dawn-teal'
                : 'border-transparent text-gray-500 hover:text-dawn-navy'
            }`}
          >
            Upload Your Own Document
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'select' ? (
            <div className="px-6 py-5">
              <p className="text-sm text-gray-600 mb-4">
                Select a document from your campaign to generate a plain language summary.
              </p>

              <div className="space-y-2">
                {availableDocs.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => setSelectedDoc(doc.id)}
                    className={`w-full text-left rounded-lg border p-4 transition-all cursor-pointer ${
                      selectedDoc === doc.id
                        ? 'border-dawn-teal bg-dawn-teal/5 shadow-sm'
                        : 'border-dawn-border hover:border-dawn-teal/50 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 shrink-0 ${selectedDoc === doc.id ? 'text-dawn-teal' : 'text-gray-300'}`}>
                        <CheckCircle2 size={20} fill={selectedDoc === doc.id ? 'currentColor' : 'none'} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <FileText size={16} className="text-gray-400" />
                          <h4 className="text-sm font-semibold text-dawn-navy">{doc.title}</h4>
                        </div>
                        <p className="text-xs text-gray-500">{doc.wordCount} words</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="px-6 py-5">
              <p className="text-sm text-gray-600 mb-4">
                Upload your own document to generate a plain language summary. Supported formats: PDF, DOCX, TXT
              </p>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-dawn-teal transition-colors">
                <input
                  type="file"
                  id="file-upload"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Upload size={24} className="text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-dawn-navy mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PDF, DOCX, or TXT (max 10MB)</p>
                </label>
              </div>

              {uploadedFile && (
                <div className="mt-4 p-4 bg-dawn-teal/5 border border-dawn-teal/30 rounded-lg flex items-center gap-3">
                  <FileText size={20} className="text-dawn-teal" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-dawn-navy">{uploadedFile.name}</p>
                    <p className="text-xs text-gray-500">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <button
                    onClick={() => setUploadedFile(null)}
                    className="text-gray-400 hover:text-dawn-red transition-colors cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Generated PLS Section */}
          {generatedPLS && plsScores && (
            <div className="px-6 py-5 border-t border-dawn-border bg-gray-50">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={16} className="text-dawn-teal" />
                <h3 className="text-sm font-semibold text-dawn-navy">Generated Plain Language Summary</h3>
              </div>

              {/* Scores */}
              <div className="grid grid-cols-5 gap-3 mb-4">
                {plsScores.map((score) => (
                  <div key={score.dimension} className="text-center">
                    <div className="text-xl font-bold text-dawn-navy">{score.score}</div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-wide">{score.dimension}</div>
                    <div className="mt-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-dawn-green transition-all"
                        style={{ width: `${score.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Preview */}
              <div className="bg-white border border-dawn-border rounded-lg p-4">
                <p className="text-xs text-gray-700 leading-relaxed">{generatedPLS}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                <button className="flex-1 px-4 py-2 text-sm border border-dawn-border rounded-lg hover:bg-white transition-colors cursor-pointer">
                  Copy to Clipboard
                </button>
                <button className="flex-1 px-4 py-2 text-sm bg-dawn-teal text-white rounded-lg hover:bg-dawn-teal/90 transition-colors cursor-pointer">
                  Download as PDF
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-dawn-border bg-white flex justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-500 hover:text-dawn-navy border border-dawn-border rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={handleGenerate}
            disabled={!canGenerate || isGenerating}
            className="px-5 py-2 bg-dawn-teal text-white text-sm font-medium rounded-lg hover:bg-dawn-teal/90 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Generate PLS
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
