const KEY_PREFIX = /^sk-ant-/;

export function extractBYOKKey(req: Request): string | null {
  const header = req.headers.get("x-api-key");
  if (!header) return null;
  const trimmed = header.trim();
  if (!KEY_PREFIX.test(trimmed)) return null;
  return trimmed;
}
