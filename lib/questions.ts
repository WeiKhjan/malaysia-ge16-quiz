import type { PartyId } from "./parties";

export type Theme =
  | "economy"
  | "identity"
  | "governance"
  | "education"
  | "foreign";

export interface Question {
  id: string;
  theme: Theme;
  statementKey: string;
  weights: Record<PartyId, number>;
}

// Weights in [-2, +2] reflect how strongly each coalition's *publicly stated*
// platform agrees with the statement. Educational tool — verify against
// official manifestos before launch.
export const QUESTIONS: Question[] = [
  {
    id: "q1",
    theme: "economy",
    statementKey: "q.q1",
    weights: { ph: -2, bn: 1, pn: 2 },
  },
  {
    id: "q2",
    theme: "economy",
    statementKey: "q.q2",
    weights: { ph: 2, bn: 1, pn: 2 },
  },
  {
    id: "q3",
    theme: "identity",
    statementKey: "q.q3",
    weights: { ph: -1, bn: 2, pn: 2 },
  },
  {
    id: "q4",
    theme: "identity",
    statementKey: "q.q4",
    weights: { ph: -2, bn: 0, pn: 2 },
  },
  {
    id: "q5",
    theme: "governance",
    statementKey: "q.q5",
    weights: { ph: 2, bn: -2, pn: 1 },
  },
  {
    id: "q6",
    theme: "governance",
    statementKey: "q.q6",
    weights: { ph: -2, bn: 2, pn: 0 },
  },
  {
    id: "q7",
    theme: "education",
    statementKey: "q.q7",
    weights: { ph: 2, bn: 1, pn: -2 },
  },
  {
    id: "q8",
    theme: "education",
    statementKey: "q.q8",
    weights: { ph: 1, bn: 2, pn: 1 },
  },
  {
    id: "q9",
    theme: "foreign",
    statementKey: "q.q9",
    weights: { ph: 1, bn: 2, pn: -1 },
  },
  {
    id: "q10",
    theme: "foreign",
    statementKey: "q.q10",
    weights: { ph: 1, bn: 1, pn: 2 },
  },
];

// Likert scale value mapping
export const ANSWER_VALUES = {
  sa: 2,   // Strongly Agree
  a: 1,    // Agree
  d: -1,   // Disagree
  sd: -2,  // Strongly Disagree
} as const;

export type AnswerKey = keyof typeof ANSWER_VALUES;
