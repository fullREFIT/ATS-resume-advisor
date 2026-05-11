export type Verdict = "GO" | "FIX_FIRST" | "PASS";

export interface Diagnosis {
  matchScore: number;
  verdict: Verdict;
  verdictReasoning: string;
  topMatches: string[];
  criticalGaps: string[];
  atsParsingFlags: string[];
  trajectoryNote: string;
}

export interface Question {
  id: string;
  category: string;
  question: string;
  why: string;
}

export interface QuestionsResponse {
  questions: Question[];
}

export interface TailoredBullet {
  original: string;
  rewritten: string;
}

export interface InterviewPrep {
  likelyQuestions: string[];
  starStoriesToPrep: string[];
  weakSpotResponses: string[];
}

export interface TailoredOutput {
  summary: string;
  tailoredBullets: TailoredBullet[];
  keywordsIntegrated: string[];
  interviewPrep: InterviewPrep;
}

export type AtsVendor =
  | "Workday"
  | "Greenhouse"
  | "Lever"
  | "iCIMS"
  | "Taleo"
  | "SmartRecruiters"
  | "Don't know";

export interface IntakeData {
  resume: string;
  jd: string;
  atsVendor?: AtsVendor;
}

export interface SessionState {
  resume: string;
  jd: string;
  atsVendor?: AtsVendor;
  diagnosis?: Diagnosis;
  questions?: QuestionsResponse;
  answers: Record<string, string>;
  tailored?: TailoredOutput;
  updatedAt: number;
}

export const EMPTY_SESSION: SessionState = {
  resume: "",
  jd: "",
  answers: {},
  updatedAt: 0,
};
