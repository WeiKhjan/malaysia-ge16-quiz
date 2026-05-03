"use client";
import { motion } from "framer-motion";
import { Question, AnswerKey } from "@/lib/questions";
import { useI18n } from "@/lib/i18n";

interface Props {
  q: Question;
  onAnswer: (a: AnswerKey) => void;
}

const OPTIONS: { key: AnswerKey; tone: string }[] = [
  { key: "sa", tone: "bg-green-400 hover:bg-green-300" },
  { key: "a", tone: "bg-pixcyan hover:bg-cyan-300" },
  { key: "d", tone: "bg-pixpink hover:bg-pink-300" },
  { key: "sd", tone: "bg-red-500 hover:bg-red-400 text-ink" },
];

export default function QuestionCard({ q, onAnswer }: Props) {
  const { t } = useI18n();

  return (
    <motion.div
      key={q.id}
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.25 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="font-pixel text-[10px] text-pixyellow uppercase mb-3 tracking-widest">
        {t(`quiz.theme.${q.theme}`)}
      </div>
      <div className="bg-bgalt border-4 border-black shadow-pixellg p-6 md:p-8 mb-6">
        <p className="font-mono text-2xl md:text-3xl leading-snug text-ink">
          {t(q.statementKey)}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {OPTIONS.map((o) => (
          <button
            key={o.key}
            onClick={() => onAnswer(o.key)}
            className={`font-pixel text-[10px] uppercase tracking-wider px-4 py-4 border-4 border-black shadow-pixel
              transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-pixelsm
              text-bg ${o.tone}`}
          >
            {t(`answer.${o.key}`)}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
