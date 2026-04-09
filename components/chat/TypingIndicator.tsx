'use client';

export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 animate-fade-in-up">
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-dawn-navy flex items-center justify-center shrink-0 mt-0.5">
        <span className="text-white font-serif text-xs font-bold">D</span>
      </div>

      {/* Bubble */}
      <div className="bg-white rounded-2xl rounded-tl-sm border border-dawn-border shadow-sm px-4 py-3 flex items-center gap-3">
        <div className="flex gap-1 items-center">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-dawn-teal animate-[typing-dot_1.2s_ease-in-out_infinite]"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
        <span className="text-xs text-gray-400">DAWN is thinking…</span>
      </div>
    </div>
  );
}
