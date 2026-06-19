/**
 * lib/apiClient.ts
 * ────────────────
 * Shared fetch wrapper used by every typed API client (authApi, chatApi,
 * workspaceApi). Adds a single behavior the raw `fetch` doesn't:
 *
 *   - On a 401, call POST /auth/refresh once. If the refresh succeeds,
 *     retry the original request. If it fails (or the retry still 401s),
 *     redirect the user to the login page with `?next=<current path>`.
 *
 * The refresh flight is shared: many concurrent requests can all 401 at
 * once (e.g. on tab focus); we collapse them onto a single in-flight
 * /refresh promise so we only mint one new token pair.
 */

import { API_BASE_URL } from '@/lib/constants';

export interface ApiRequestOptions {
  method?: string;
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined | null>;
  /** When true, do NOT attempt refresh-and-retry on 401 (used by /auth/refresh itself). */
  skipAuthRetry?: boolean;
  /** Override Content-Type / extra headers. */
  headers?: Record<string, string>;
}

export class ApiError extends Error {
  status: number;
  data: unknown;
  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

/** Friendly message used when fetch itself fails (network down, CORS, DNS, ECONNREFUSED). */
export const FRIENDLY_NETWORK_ERROR =
  "We couldn't reach the server. Please check your connection and try again.";

/**
 * Map an HTTP status code to a user-friendly message.
 *
 * Used as the single source of truth so users never see technical strings
 * like "Request failed with status 500" anywhere in the UI.
 */
export function friendlyStatusMessage(status: number): string {
  switch (status) {
    case 400:
      return "We couldn't process your request. Please check your input and try again.";
    case 401:
      return 'Your session has expired. Please sign in again.';
    case 403:
      return "You don't have permission to perform this action.";
    case 404:
      return "We couldn't find what you were looking for.";
    case 408:
      return 'The request took too long. Please try again.';
    case 409:
      return 'There was a conflict with your request. Please refresh and try again.';
    case 413:
      return "The data you're trying to send is too large.";
    case 422:
      return 'Some of the information provided is invalid. Please review and try again.';
    case 429:
      return "You're doing that too often. Please wait a moment and try again.";
    case 500:
      return 'Something went wrong on our end. Please try again in a moment.';
    case 502:
      return "We're having trouble reaching the server. Please try again shortly.";
    case 503:
      return 'The service is temporarily unavailable. Please try again shortly.';
    case 504:
      return 'The server took too long to respond. Please try again.';
    default:
      if (status === 0) return FRIENDLY_NETWORK_ERROR;
      if (status >= 500) {
        return 'Something went wrong on our end. Please try again in a moment.';
      }
      if (status >= 400) {
        return "We couldn't complete that request. Please try again.";
      }
      return 'Something went wrong. Please try again.';
  }
}

/**
 * Pick the best user-facing message for a failed response.
 *
 * Strategy:
 *   - For 5xx, always show a friendly message (server detail strings are
 *     usually internal/technical — e.g. "Internal Server Error", stack hints).
 *   - For 4xx, prefer the backend's `detail`/`message` if present (those are
 *     usually written for end users — validation errors etc.); otherwise fall
 *     back to the friendly message for that status.
 */
export function getFriendlyErrorMessage(status: number, data?: unknown): string {
  const friendly = friendlyStatusMessage(status);
  if (status >= 500) return friendly;

  const fromBody = (data as { detail?: unknown; message?: unknown } | null) ?? null;
  const detail = typeof fromBody?.detail === 'string' ? fromBody.detail.trim() : '';
  const message = typeof fromBody?.message === 'string' ? fromBody.message.trim() : '';
  return detail || message || friendly;
}

let refreshInFlight: Promise<boolean> | null = null;

/**
 * Run a single shared /auth/refresh flight. Exposed so non-JSON callers (e.g.
 * the SSE chat-features stream, which can't use ``request``) can reuse the
 * same refresh-and-retry behaviour on a 401.
 */
export async function runRefresh(): Promise<boolean> {
  if (refreshInFlight) return refreshInFlight;
  refreshInFlight = (async () => {
    try {
      const r = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });
      return r.ok;
    } catch {
      return false;
    } finally {
      // Clear the flight reference on the next microtask so concurrent
      // callers all observe the final boolean before a new flight can start.
      setTimeout(() => {
        refreshInFlight = null;
      }, 0);
    }
  })();
  return refreshInFlight;
}

export function redirectToLogin(): void {
  if (typeof window === 'undefined') return;
  // Avoid loop: if we're already on the landing/login page, don't push again.
  const path = window.location.pathname;
  if (path === '/' || path.startsWith('/login') || path.startsWith('/register')) {
    return;
  }
  const next = encodeURIComponent(path + window.location.search);
  window.location.assign(`/?auth=login&next=${next}`);
}

function buildUrl(path: string, query?: ApiRequestOptions['query']): string {
  let url = `${API_BASE_URL}${path}`;
  if (query) {
    const search = new URLSearchParams();
    for (const [k, v] of Object.entries(query)) {
      if (v === undefined || v === null) continue;
      search.set(k, String(v));
    }
    const qs = search.toString();
    if (qs) url += `?${qs}`;
  }
  return url;
}

async function doFetch(
  url: string,
  init: RequestInit,
): Promise<{ response: Response; data: unknown }> {
  let response: Response;
  try {
    response = await fetch(url, init);
  } catch {
    // Network error (DNS, CORS, offline, ECONNREFUSED on the dev proxy, etc.)
    // Surface a single, friendly ApiError so the toast layer doesn't show
    // raw "TypeError: Failed to fetch" text to the user.
    throw new ApiError(FRIENDLY_NETWORK_ERROR, 0, null);
  }
  const ct = response.headers.get('content-type') ?? '';
  const data = ct.includes('application/json')
    ? await response.json().catch(() => null)
    : null;
  return { response, data };
}

export async function request<T>(path: string, opts: ApiRequestOptions = {}): Promise<T> {
  const { method = 'GET', body, query, skipAuthRetry = false, headers } = opts;
  const url = buildUrl(path, query);
  const init: RequestInit = {
    method,
    credentials: 'include',
    headers: {
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(headers ?? {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  };

  const { response, data } = await doFetch(url, init);

  if (response.status !== 401 || skipAuthRetry) {
    if (!response.ok) {
      const message = getFriendlyErrorMessage(response.status, data);
      throw new ApiError(message, response.status, data);
    }
    return data as T;
  }

  // 401 path: try one refresh + retry.
  const refreshed = await runRefresh();
  if (!refreshed) {
    redirectToLogin();
    throw new ApiError('Your session has expired. Please sign in again.', 401, data);
  }

  const retried = await doFetch(url, init);
  if (retried.response.status === 401) {
    redirectToLogin();
    throw new ApiError(
      'Your session has expired. Please sign in again.',
      401,
      retried.data,
    );
  }
  if (!retried.response.ok) {
    const message = getFriendlyErrorMessage(retried.response.status, retried.data);
    throw new ApiError(message, retried.response.status, retried.data);
  }
  return retried.data as T;
}
