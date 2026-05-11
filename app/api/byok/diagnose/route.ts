import { NextResponse } from "next/server";
import { callClaude, classifyError, parseJson } from "@/lib/claude";
import { DIAGNOSIS_SYSTEM } from "@/lib/prompts";
import { extractBYOKKey } from "@/lib/byok-helpers";
import type { Diagnosis } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_INPUT_CHARS = 30000;

export async function POST(req: Request) {
  const apiKey = extractBYOKKey(req);
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "Provide your Anthropic API key via the X-API-Key header (starts with sk-ant-).",
      },
      { status: 401 },
    );
  }

  let body: { resume?: string; jd?: string; atsVendor?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const resume = (body.resume ?? "").slice(0, MAX_INPUT_CHARS).trim();
  const jd = (body.jd ?? "").slice(0, MAX_INPUT_CHARS).trim();
  const atsVendor = (body.atsVendor ?? "").slice(0, 50).trim();

  if (resume.length < 50 || jd.length < 50) {
    return NextResponse.json(
      { error: "Resume and job description must each be at least 50 characters." },
      { status: 400 },
    );
  }

  const userPrompt = `Resume:
"""
${resume}
"""

Job description:
"""
${jd}
"""${
    atsVendor && atsVendor !== "Don't know"
      ? `\n\nTarget ATS: ${atsVendor}. Adjust weighting accordingly.`
      : ""
  }

Diagnose the gap. Return STRICT JSON only matching the schema in the system instructions.`;

  try {
    const text = await callClaude({
      apiKey,
      task: "diagnosis",
      system: DIAGNOSIS_SYSTEM,
      user: userPrompt,
    });
    const parsed = parseJson<Diagnosis>(text);
    if (!parsed) {
      return NextResponse.json(
        { error: "Model returned an unparseable response. Try again." },
        { status: 502 },
      );
    }
    return NextResponse.json({ diagnosis: parsed });
  } catch (err) {
    const c = classifyError(err);
    return NextResponse.json({ error: c.message }, { status: c.status });
  }
}
