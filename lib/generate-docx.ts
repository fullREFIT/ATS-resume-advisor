"use client";

import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
  type IRunOptions,
} from "docx";
import type { TailoredOutput } from "./types";

interface BuildArgs {
  tailored: TailoredOutput;
  originalResume: string;
}

interface ContactInfo {
  name: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  location?: string;
}

const FONT = "Calibri";
const BODY_PT = 11;
const HEADING_PT = 14;

const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/;
const PHONE_RE = /(?:\+?\d[\s\-().]?){7,}\d/;
const LINKEDIN_RE = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/[A-Za-z0-9_\-/]+/i;
const LOCATION_RE = /\b([A-Z][a-zA-Z]+(?:\s[A-Z][a-zA-Z]+)*),\s?([A-Z]{2})\b/;

function extractContact(resume: string): ContactInfo {
  const lines = resume.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const first = lines[0] ?? "Candidate";
  const top = lines.slice(0, 6).join(" \n ");
  const email = top.match(EMAIL_RE)?.[0];
  const phone = top.match(PHONE_RE)?.[0];
  const linkedin = top.match(LINKEDIN_RE)?.[0];
  const locMatch = top.match(LOCATION_RE);
  const location = locMatch ? `${locMatch[1]}, ${locMatch[2]}` : undefined;
  // Name = first line if it doesn't look like contact data
  const name =
    EMAIL_RE.test(first) || PHONE_RE.test(first) || LINKEDIN_RE.test(first)
      ? "Candidate"
      : first.replace(/[|•·]+.*$/, "").trim() || "Candidate";
  return { name, email, phone, linkedin, location };
}

function bodyRun(text: string, opts: Partial<IRunOptions> = {}) {
  return new TextRun({
    text,
    font: FONT,
    size: BODY_PT * 2,
    ...opts,
  });
}

function headingPara(text: string) {
  return new Paragraph({
    spacing: { before: 240, after: 80 },
    children: [
      new TextRun({
        text,
        font: FONT,
        size: HEADING_PT * 2,
        bold: true,
      }),
    ],
    heading: HeadingLevel.HEADING_2,
  });
}

function bulletPara(text: string) {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 80 },
    children: [bodyRun(text)],
  });
}

function plainPara(text: string, opts: { bold?: boolean; center?: boolean } = {}) {
  return new Paragraph({
    alignment: opts.center ? AlignmentType.CENTER : AlignmentType.LEFT,
    spacing: { after: 40 },
    children: [bodyRun(text, { bold: opts.bold })],
  });
}

export function suggestFileName(resume: string): string {
  const { name } = extractContact(resume);
  const safe = name.replace(/[^A-Za-z\s-]/g, "").trim();
  const parts = safe.split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0]}_${parts[parts.length - 1]}_Resume.docx`;
  }
  return `${safe || "Candidate"}_Resume.docx`;
}

export async function buildResumeDocx({
  tailored,
  originalResume,
}: BuildArgs): Promise<{ blob: Blob; fileName: string }> {
  const contact = extractContact(originalResume);
  const fileName = suggestFileName(originalResume);

  const children: Paragraph[] = [];
  // Contact info in document BODY (not Word header).
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
      children: [
        bodyRun(contact.name, { bold: true, size: 18 * 2 }),
      ],
    }),
  );
  const contactLine = [contact.location, contact.phone, contact.email, contact.linkedin]
    .filter(Boolean)
    .join("  |  ");
  if (contactLine) {
    children.push(plainPara(contactLine, { center: true }));
  }

  // Professional summary
  children.push(headingPara("PROFESSIONAL SUMMARY"));
  children.push(
    new Paragraph({
      spacing: { after: 120 },
      children: [bodyRun(tailored.summary)],
    }),
  );

  // Work experience (tailored bullets)
  children.push(headingPara("WORK EXPERIENCE"));
  for (const b of tailored.tailoredBullets) {
    children.push(bulletPara(b.rewritten));
  }

  // Skills — derived from keywords
  if (tailored.keywordsIntegrated.length > 0) {
    children.push(headingPara("SKILLS"));
    children.push(
      new Paragraph({
        spacing: { after: 120 },
        children: [bodyRun(tailored.keywordsIntegrated.join(", "))],
      }),
    );
  }

  const doc = new Document({
    creator: contact.name,
    title: `${contact.name} Resume`,
    description: "ATS-optimized resume",
    styles: {
      default: {
        document: {
          run: { font: FONT, size: BODY_PT * 2 },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, bottom: 720, left: 720, right: 720 },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  return { blob, fileName };
}
