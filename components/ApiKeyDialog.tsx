"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { clearByokKey, loadByokKey, saveByokKey } from "@/lib/storage";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function ApiKeyDialog({ open, onClose }: Props) {
  const [value, setValue] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (open) {
      const existing = loadByokKey();
      setValue(existing ?? "");
      setSaved(Boolean(existing));
    }
  }, [open]);

  if (!open) return null;

  function onSave() {
    const trimmed = value.trim();
    if (!trimmed.startsWith("sk-ant-")) {
      setSaved(false);
      return;
    }
    saveByokKey(trimmed);
    setSaved(true);
    onClose();
  }

  function onRemove() {
    clearByokKey();
    setValue("");
    setSaved(false);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-carbon-core/60 p-4 sm:items-center"
      onClick={onClose}
    >
      <div
        className="card-surface w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="section-label mb-2">Bring your own API key</p>
        <h2 className="text-xl font-semibold tracking-tight text-carbon-core">
          Unlimited runs with your Anthropic key.
        </h2>
        <p className="mt-2 text-sm text-carbon-core">
          Your key is stored in this browser tab only (sessionStorage) — never
          sent to any server other than Anthropic. Get one at{" "}
          <a
            href="https://console.anthropic.com/settings/keys"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-forge-red hover:text-forge-red-hover"
          >
            console.anthropic.com
          </a>
          .
        </p>
        <label className="mt-4 block text-xs uppercase tracking-[0.08em] text-echo">
          sk-ant-… key
        </label>
        <input
          type="password"
          autoComplete="off"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="sk-ant-..."
          className="mt-1 min-h-12 w-full rounded-lg border border-soft-gray bg-pure-white px-3 text-base text-carbon-core focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forge-red"
        />
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-between">
          <Button
            variant="secondary"
            onClick={onRemove}
            className="sm:w-auto"
            type="button"
          >
            Remove key
          </Button>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={onClose}
              className="sm:w-auto"
              type="button"
            >
              Cancel
            </Button>
            <Button onClick={onSave} className="sm:w-auto" type="button">
              Save key
            </Button>
          </div>
        </div>
        {saved && (
          <p className="mt-2 text-xs text-echo">Saved for this session.</p>
        )}
      </div>
    </div>
  );
}
