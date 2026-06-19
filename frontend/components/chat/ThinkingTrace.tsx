"use client";

export const THINKING_HEADERS = new Set([
  "Analyzing Query",
  "Parsing request",
  "Preparing Response",
  "Executing Tool",
  "Querying Commercial Database",
  "Searching Clinical Literature",
  "Segmenting HCP Audience",
  "Analysing Content Performance",
  "Validating Promotional Copy",
  "Pulling Competitive Intelligence",
  "Synthesising Results",
]);

function ThinkingInline({ text }: { text: string }) {
  const boldParts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {boldParts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold text-slate-700">
              {part.slice(2, -2)}
            </strong>
          );
        }
        const codeParts = part.split(/([a-z]+(?:_[a-z]+)+)/g);
        return codeParts.map((sub, j) =>
          /^[a-z]+(?:_[a-z]+)+$/.test(sub) ? (
            <code
              key={`${i}-${j}`}
              className="mx-0.5 rounded bg-amber-100/70 px-1.5 py-0.5 font-mono text-[11px] text-amber-700"
            >
              {sub}
            </code>
          ) : (
            <span key={`${i}-${j}`}>{sub}</span>
          ),
        );
      })}
    </>
  );
}

export default function ThinkingTrace({ text }: { text: string }) {
  const lines = text.split("\n").filter((l) => l.trim() !== "");
  return (
    <div className="my-1 ml-1 max-h-80 overflow-y-auto rounded-lg border-l-2 border-amber-300 bg-amber-50/40 py-3 pl-4 pr-3">
      <div className="space-y-0.5">
        {lines.map((line, i) => {
          const trimmed = line.trim();
          const isHeader = THINKING_HEADERS.has(trimmed);
          const isKeyValue = /^(Brand|Market|Period):/.test(trimmed);

          if (isHeader) {
            return (
              <p
                key={i}
                className={`text-[13px] font-semibold text-slate-700 ${i === 0 ? "" : "mt-3"}`}
              >
                {trimmed}
              </p>
            );
          }
          return (
            <p
              key={i}
              className={`text-[12.5px] leading-relaxed text-slate-500 ${isKeyValue ? "pl-8" : "pl-4"}`}
            >
              <ThinkingInline text={trimmed} />
            </p>
          );
        })}
      </div>
    </div>
  );
}
