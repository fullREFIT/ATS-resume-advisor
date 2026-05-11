"use client";

import { EMPTY_SESSION, type SessionState } from "./types";

const KEY = "ai-resume-advisor-v1";
const BYOK_KEY = "ai-resume-advisor-byok";

function isBrowser() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function loadSession(): SessionState {
  if (!isBrowser()) return EMPTY_SESSION;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY_SESSION;
    const parsed = JSON.parse(raw) as SessionState;
    return { ...EMPTY_SESSION, ...parsed };
  } catch {
    return EMPTY_SESSION;
  }
}

export function saveSession(state: SessionState) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(
      KEY,
      JSON.stringify({ ...state, updatedAt: Date.now() }),
    );
  } catch {
    /* quota exceeded or private mode */
  }
}

export function patchSession(partial: Partial<SessionState>): SessionState {
  const current = loadSession();
  const next = { ...current, ...partial };
  saveSession(next);
  return next;
}

export function clearSession() {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

export function loadByokKey(): string | null {
  if (!isBrowser()) return null;
  try {
    return window.sessionStorage.getItem(BYOK_KEY);
  } catch {
    return null;
  }
}

export function saveByokKey(key: string) {
  if (!isBrowser()) return;
  try {
    window.sessionStorage.setItem(BYOK_KEY, key);
  } catch {
    /* ignore */
  }
}

export function clearByokKey() {
  if (!isBrowser()) return;
  try {
    window.sessionStorage.removeItem(BYOK_KEY);
  } catch {
    /* ignore */
  }
}
