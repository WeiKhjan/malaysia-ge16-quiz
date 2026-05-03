import { ANSWER_VALUES, AnswerKey, QUESTIONS } from "./questions";
import { PARTY_IDS, PartyId } from "./parties";

export interface ScoreResult {
  percent: Record<PartyId, number>;
  winner: PartyId;
  ordered: PartyId[];
}

export function score(answers: AnswerKey[]): ScoreResult {
  const raw: Record<PartyId, number> = { ph: 0, bn: 0, pn: 0 };

  QUESTIONS.forEach((q, i) => {
    const ans = answers[i];
    if (!ans) return;
    const v = ANSWER_VALUES[ans];
    PARTY_IDS.forEach((p) => {
      raw[p] += v * q.weights[p];
    });
  });

  // Theoretical bounds per party: sum(|weight|) * 2
  const maxAbs: Record<PartyId, number> = { ph: 0, bn: 0, pn: 0 };
  QUESTIONS.forEach((q) => {
    PARTY_IDS.forEach((p) => {
      maxAbs[p] += Math.abs(q.weights[p]) * 2;
    });
  });

  // Map raw [-max, +max] → [0, 100]
  const pct: Record<PartyId, number> = { ph: 0, bn: 0, pn: 0 };
  PARTY_IDS.forEach((p) => {
    const m = maxAbs[p] || 1;
    pct[p] = Math.round(((raw[p] + m) / (2 * m)) * 100);
  });

  // Normalize so the three sum to 100 (relative match)
  const total = pct.ph + pct.bn + pct.pn || 1;
  const percent: Record<PartyId, number> = {
    ph: Math.round((pct.ph / total) * 100),
    bn: Math.round((pct.bn / total) * 100),
    pn: Math.round((pct.pn / total) * 100),
  };
  // Fix rounding drift
  const drift = 100 - (percent.ph + percent.bn + percent.pn);
  if (drift !== 0) {
    const top = (PARTY_IDS as PartyId[]).reduce((a, b) =>
      percent[a] >= percent[b] ? a : b,
    );
    percent[top] += drift;
  }

  const ordered = [...PARTY_IDS].sort((a, b) => percent[b] - percent[a]);
  return { percent, winner: ordered[0], ordered };
}

// Compact base64 encoding of answers (for shareable URL hash)
const KEY_TO_CHAR: Record<AnswerKey, string> = {
  sa: "A",
  a: "B",
  d: "C",
  sd: "D",
};
const CHAR_TO_KEY: Record<string, AnswerKey> = {
  A: "sa",
  B: "a",
  C: "d",
  D: "sd",
};

export function encodeAnswers(answers: AnswerKey[]): string {
  return answers.map((a) => KEY_TO_CHAR[a]).join("");
}

export function decodeAnswers(s: string): AnswerKey[] {
  const out: AnswerKey[] = [];
  for (const ch of s.toUpperCase()) {
    if (CHAR_TO_KEY[ch]) out.push(CHAR_TO_KEY[ch]);
  }
  return out;
}
