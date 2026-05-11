import type { Diagnosis } from "@/lib/types";
import { VerdictBadge, verdictAccentClass } from "@/components/VerdictBadge";

export function DiagnosisCard({ diagnosis }: { diagnosis: Diagnosis }) {
  const parsingHasIssues =
    diagnosis.atsParsingFlags.length > 0 &&
    !(
      diagnosis.atsParsingFlags.length === 1 &&
      /none/i.test(diagnosis.atsParsingFlags[0])
    );

  return (
    <div className="flex flex-col gap-4">
      <section
        className={`card-surface border-t-[3px] ${verdictAccentClass[diagnosis.verdict]}`}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="section-label mb-1">Match score</p>
            <p className="font-mono text-5xl font-bold leading-none tracking-tight text-carbon-core">
              {diagnosis.matchScore}
              <span className="text-xl font-normal text-echo">/100</span>
            </p>
          </div>
          <VerdictBadge verdict={diagnosis.verdict} />
        </div>
        <p className="mt-4 text-base leading-relaxed text-carbon-core">
          {diagnosis.verdictReasoning}
        </p>
      </section>

      {parsingHasIssues && (
        <section className="card-surface border-l-[3px] border-l-forge-gold">
          <p className="section-label mb-2 text-forge-dark">
            ATS parsing flags — fix these first
          </p>
          <ul className="ml-5 list-disc text-sm leading-relaxed text-carbon-core">
            {diagnosis.atsParsingFlags.map((flag, i) => (
              <li key={i}>{flag}</li>
            ))}
          </ul>
        </section>
      )}

      <div className="grid grid-cols-1 gap-4">
        <section className="card-surface">
          <p className="section-label mb-2">Top matches</p>
          <ul className="ml-5 list-disc text-sm leading-relaxed text-carbon-core">
            {diagnosis.topMatches.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </section>
        <section className="card-surface">
          <p className="section-label mb-2">Critical gaps</p>
          <ul className="ml-5 list-disc text-sm leading-relaxed text-carbon-core">
            {diagnosis.criticalGaps.map((g, i) => (
              <li key={i}>{g}</li>
            ))}
          </ul>
        </section>
      </div>

      {diagnosis.trajectoryNote && (
        <section className="card-surface">
          <p className="section-label mb-2">Career trajectory</p>
          <p className="text-sm leading-relaxed text-carbon-core">
            {diagnosis.trajectoryNote}
          </p>
        </section>
      )}
    </div>
  );
}
