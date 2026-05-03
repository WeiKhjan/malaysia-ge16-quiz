"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { QUESTIONS, AnswerKey } from "@/lib/questions";
import { encodeAnswers } from "@/lib/scoring";
import LangToggle from "@/components/LangToggle";
import ProgressBar from "@/components/ProgressBar";
import QuestionCard from "@/components/QuestionCard";

export default function QuizPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<AnswerKey[]>([]);

  const total = QUESTIONS.length;
  const q = QUESTIONS[idx];

  function handleAnswer(a: AnswerKey) {
    const next = [...answers, a];
    setAnswers(next);
    if (idx + 1 >= total) {
      const code = encodeAnswers(next);
      router.push(`/result#${code}`);
    } else {
      setIdx(idx + 1);
    }
  }

  return (
    <main className="min-h-screen px-4 py-6 flex flex-col">
      <header className="flex justify-between items-center max-w-3xl w-full mx-auto mb-6">
        <Link
          href="/"
          className="font-pixel text-[10px] text-muted hover:text-pixyellow uppercase"
        >
          {t("nav.back")}
        </Link>
        <LangToggle />
      </header>

      <div className="max-w-3xl w-full mx-auto mb-8">
        <div className="font-pixel text-[10px] text-pixyellow uppercase mb-2 tracking-widest">
          {t("quiz.progress", { current: idx + 1, total })}
        </div>
        <ProgressBar current={idx + 1} total={total} />
      </div>

      <section className="flex-1 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <QuestionCard key={q.id} q={q} onAnswer={handleAnswer} />
        </AnimatePresence>
      </section>
    </main>
  );
}
