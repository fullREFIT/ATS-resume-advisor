"use client";

import { EMPTY_SESSION, type SessionState } from "./types";

const KEY = "ai-resume-advisor-v1";

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
