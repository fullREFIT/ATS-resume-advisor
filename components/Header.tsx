"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ApiKeyDialog } from "@/components/ApiKeyDialog";
import { loadByokKey } from "@/lib/storage";

export function Header() {
  const [open, setOpen] = useState(false);
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    setHasKey(Boolean(loadByokKey()));
  }, [open]);

  return (
    <>
      <header className="w-full border-b border-soft-gray bg-pure-white">
        <div className="mx-auto flex max-w-[720px] items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <Link href="/" className="flex flex-col">
            <span className="text-base font-semibold tracking-tight text-carbon-core sm:text-lg">
              AI Resume Advisor
            </span>
            <span className="hidden text-[0.75rem] text-echo sm:block">
              Honest diagnosis. No fabrication. ATS-optimized.
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex min-h-11 items-center px-2 text-xs font-medium text-echo hover:text-carbon-core"
              aria-label="Bring your own API key"
            >
              {hasKey ? "Your key · BYOK" : "Use my own key"}
            </button>
            <Link
              href="/about"
              className="inline-flex min-h-11 items-center text-sm font-medium text-forge-red hover:text-forge-red-hover"
            >
              How it works
            </Link>
          </div>
        </div>
      </header>
      <ApiKeyDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}
