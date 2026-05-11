import type { TailoredBullet } from "@/lib/types";

const NEW_FROM_INTAKE = /^new from intake$/i;

export function TailoredBullets({ bullets }: { bullets: TailoredBullet[] }) {
  return (
    <ol className="flex flex-col gap-3">
      {bullets.map((b, i) => {
        const isNew = NEW_FROM_INTAKE.test((b.original ?? "").trim());
        return (
          <li
            key={i}
            className="rounded-lg border border-soft-gray bg-pure-white p-4"
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-carbon-core font-mono text-[0.625rem] font-bold text-pure-white">
                {i + 1}
              </span>
              {isNew && (
                <span className="font-mono text-[0.625rem] uppercase tracking-[0.1em] text-forge-red">
                  New from intake
                </span>
              )}
            </div>
            {!isNew && (
              <p className="mb-2 text-xs leading-relaxed text-echo line-through">
                {b.original}
              </p>
            )}
            <p className="text-sm leading-relaxed text-carbon-core">
              {b.rewritten}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
