'use client';

interface StatusPillProps {
  status: 'Passed' | 'Pending' | 'Flagged' | 'Rejected';
  size?: 'sm' | 'md';
}

const STATUS_STYLES = {
  Passed: 'bg-green-100 text-green-700 border border-green-200',
  Pending: 'bg-amber-100 text-amber-700 border border-amber-200',
  Flagged: 'bg-red-100 text-red-700 border border-red-200',
  Rejected: 'bg-red-200 text-red-800 border border-red-300',
};

const STATUS_DOTS = {
  Passed: 'bg-green-500',
  Pending: 'bg-amber-500',
  Flagged: 'bg-red-500',
  Rejected: 'bg-red-600',
};

export default function StatusPill({ status, size = 'md' }: StatusPillProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
      } ${STATUS_STYLES[status]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOTS[status]}`} />
      {status}
    </span>
  );
}
