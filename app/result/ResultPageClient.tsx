"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { CopyButton } from "@/components/CopyButton";
import { InfoBlock } from "@/components/ui/InfoBlock";
import { InterviewPrep } from "@/components/InterviewPrep";
import { TailoredBullets } from "@/components/TailoredBullets";
import { clearSession, loadSession } from "@/lib/storage";
import type { SessionState, TailoredOutput } from "@/lib/types";

export function ResultPageClient() {
  const router = useRouter();
  const [tailored, setTailored] = useState<TailoredOutput | null>(null);
  const [session, setSession] = useState<SessionState | null>(null);

  useEffect(() => {
    const s = loadSession();
    if (!s.tailored) {
      router.replace("/");
      return;
    }
    setTailored(s.tailored);
    setSession(s);
  }, [router]);

  if (!tailored || !session) {
    return <p className="text-sm text-echo">Loading your result…</p>;
  }

  function onStartOver() {
    clearSession();
    router.push("/");
  }

  return (
    <>
      <div className="card-layer-1 flex flex-col gap-2">
        <p className="section-label">Step 4 — Result</p>
        <h1 className="text-2xl font-semibold tracking-tight text-carbon-core sm:text-3xl">
          Your tailored resume + interview prep.
        </h1>
        <p className="text-base text-carbon-core">
          Bullets are ATS-optimized and verified against your inputs. Nothing
          fabricated.
        </p>
      </div>

      <section className="card-surface flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="section-label">Professional summary</p>
          <CopyButton text={tailored.summary} />
        </div>
        <p className="text-base leading-relaxed text-carbon-core">
          {tailored.summary}
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <p className="section-label">Tailored bullets</p>
        <TailoredBullets bullets={tailored.tailoredBullets} />
      </section>

      {tailored.keywordsIntegrated.length > 0 && (
        <section className="card-surface">
          <p className="section-label mb-2">Keywords integrated</p>
          <div className="flex flex-wrap gap-2">
            {tailored.keywordsIntegrated.map((k, i) => (
              <span
                key={i}
                className="inline-flex items-center rounded-full border border-soft-gray bg-ash-white px-3 py-1 font-mono text-xs uppercase tracking-[0.06em] text-carbon-core"
              >
                {k}
              </span>
            ))}
          </div>
        </section>
      )}

      <section className="flex flex-col gap-3">
        <p className="section-label">Interview prep</p>
        <InterviewPrep prep={tailored.interviewPrep} />
      </section>

      <InfoBlock tone="gold">
        <strong>LinkedIn consistency check.</strong> Before you submit through a
        Workday or iCIMS portal, verify your LinkedIn job titles and dates
        match the resume exactly. Both vendors cross-reference and a mismatch
        downgrades your score.
      </InfoBlock>

      <div className="flex flex-col gap-3 sm:flex-row">
        <DownloadDocxButton
          tailored={tailored}
          resume={session.resume}
        />
        <Button
          variant="secondary"
          onClick={onStartOver}
          className="sm:w-auto"
        >
          Start over with a new resume
        </Button>
      </div>
    </>
  );
}

function DownloadDocxButton({
  tailored,
  resume,
}: {
  tailored: TailoredOutput;
  resume: string;
}) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onClick() {
    setBusy(true);
    setErr(null);
    try {
      const { buildResumeDocx, suggestFileName } = await import(
        "@/lib/generate-docx"
      );
      const { blob, fileName } = await buildResumeDocx({
        tailored,
        originalResume: resume,
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName ?? suggestFileName(resume);
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Download failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-1">
      <Button onClick={onClick} disabled={busy} fullWidth>
        {busy ? "Building .docx…" : "Download as .docx"}
      </Button>
      {err && (
        <p className="text-xs text-forge-red" role="alert">
          {err}
        </p>
      )}
    </div>
  );
}
