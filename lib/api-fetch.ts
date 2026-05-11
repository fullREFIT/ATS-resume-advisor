"use client";

import { loadByokKey } from "./storage";

type Endpoint = "diagnose" | "questions" | "output";

export interface CallApiArgs<TBody> {
  endpoint: Endpoint;
  body: TBody;
}

export async function callApi<TBody, TResp>({
  endpoint,
  body,
}: CallApiArgs<TBody>): Promise<TResp> {
  const key = loadByokKey();
  const url = key ? `/api/byok/${endpoint}` : `/api/demo/${endpoint}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (key) headers["X-API-Key"] = key;
  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as TResp & { error?: string };
  if (!res.ok) {
    throw new Error(data.error ?? `Request to /${endpoint} failed.`);
  }
  return data;
}
