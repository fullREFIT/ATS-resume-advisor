"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ATSContextBlock } from "@/components/ATSContextBlock";
import { LocalStorageDisclaimer } from "@/components/LocalStorageDisclaimer";
import { ResumeUpload } from "@/components/ResumeUpload";
import { loadSession, patchSession } from "@/lib/storage";
import type { AtsVendor, Diagnosis } from "@/lib/types";

const ATS_VENDORS: AtsVendor[] = [
  "Workday",
  "Greenhouse",
  "Lever",
  "iCIMS",
  "Taleo",
  "SmartRecruiters",
  "Don't know",
];

export function IntakeForm() {
  const router = useRouter();
  const [resume, setResume] = useState("");
  const [jd, setJd] = useState("");
  const [atsVendor, setAtsVendor] = useState<AtsVendor>("Don't know");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const s = loadSession();
    setResume(s.resume);
    setJd(s.jd);
    if (s.atsVendor) setAtsVendor(s.atsVendor);
    setHydrated(true);
  }, []);

  const canSubmit =
    resume.trim().length >= 50 && jd.trim().length >= 50 && !loading;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/demo/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, jd, atsVendor }),
      });
      const data = (await res.json()) as {
        error?: string;
        diagnosis?: Diagnosis;
      };
      if (!res.ok || !data.diagnosis) {
        throw new Error(data.error ?? "Diagnosis failed.");
      }
      patchSession({
        resume,
        jd,
        atsVendor,
        diagnosis: data.diagnosis,
        answers: {},
        questions: undefined,
        tailored: undefined,
      });
      router.push("/diagnose");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Diagnosis failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      <ATSContextBlock />
      <LocalStorageDisclaimer />

      <div className="flex flex-col gap-2">
        <label htmlFor="resume" className="section-label">
          Your resume (paste plain text or upload)
        </label>
        <ResumeUpload onParsed={setResume} />
        <textarea
          id="resume"
          value={resume}
          onChange={(e) => setResume(e.target.value)}
          placeholder="Paste your current resume here. Plain text works best."
          className="min-h-[200px] w-full rounded-lg border border-soft-gray bg-pure-white p-4 text-base text-carbon-core focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forge-red"
        />
        {hydrated && resume.trim().length > 0 && resume.trim().length < 50 && (
          <p className="text-xs text-echo">
            Add more — at least 50 characters of resume content.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="jd" className="section-label">
          Target job description
        </label>
        <textarea
          id="jd"
          value={jd}
          onChange={(e) => setJd(e.target.value)}
          placeholder="Paste the full job description for the role you're targeting."
          className="min-h-[180px] w-full rounded-lg border border-soft-gray bg-pure-white p-4 text-base text-carbon-core focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forge-red"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="ats" className="section-label">
          Which ATS does this company use? (optional)
        </label>
        <select
          id="ats"
          value={atsVendor}
          onChange={(e) => setAtsVendor(e.target.value as AtsVendor)}
          className="min-h-12 w-full rounded-lg border border-soft-gray bg-pure-white px-3 text-base text-carbon-core focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forge-red"
        >
          {ATS_VENDORS.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-lg border border-forge-red/30 bg-forge-red/10 p-3 text-sm text-forge-red"
        >
          {error}
        </p>
      )}

      <Button type="submit" disabled={!canSubmit} fullWidth>
        {loading ? "Diagnosing…" : "Diagnose fit"}
      </Button>
    </form>
  );
}
