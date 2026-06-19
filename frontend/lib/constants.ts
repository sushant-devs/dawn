export const API_BASE_URL = '/api';

/** Client-side path for the DAM BFF proxy (see app/dam-api/[...path]/route.ts). */
export const DAM_API_BASE_URL = '/dam-api';

export const WS_BASE_URL = (() => {
  if (typeof window !== 'undefined') {
    const wsScheme = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${wsScheme}//${window.location.host}`;
  }
  return 'ws://localhost:3000';
})();

export const TZ = 'Asia/Kolkata';

export function formatDateIST(
  date: Date | string,
  options?: Intl.DateTimeFormatOptions,
): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('en-IN', {
    timeZone: TZ,
    ...(options ?? { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
  });
}
