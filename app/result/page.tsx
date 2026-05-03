"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { decodeAnswers, score } from "@/lib/scoring";
import { QUESTIONS } from "@/lib/questions";
import LangToggle from "@/components/LangToggle";
import ResultCard from "@/components/ResultCard";
import ShareButtons from "@/components/ShareButtons";
import PixelButton from "@/components/PixelButton";

export default function ResultPage() {
  const { t } = useI18n();
  const [hash, setHash] = useState<string>("");
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setHash(window.location.hash.replace("#", ""));
    const onHash = () => setHash(window.location.hash.replace("#", ""));
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const result = useMemo(() => {
    if (!hash) return null;
    const ans = decodeAnswers(hash);
    if (ans.length !== QUESTIONS.length) return null;
    return score(ans);
  }, [hash]);

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

      <section className="flex-1 flex flex-col items-center justify-center gap-6 max-w-3xl w-full mx-auto">
        {!result ? (
          <div className="text-center">
            <p className="font-pixel text-sm text-pixyellow mb-6">
              No result found. Take the quiz first.
            </p>
            <Link href="/quiz">
              <PixelButton variant="primary">{t("app.start")}</PixelButton>
            </Link>
          </div>
        ) : (
          <>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 120, damping: 12 }}
            >
              <ResultCard ref={cardRef} result={result} />
            </motion.div>

            <ShareButtons cardRef={cardRef} result={result} />

            <Link href="/quiz">
              <PixelButton variant="ghost" size="sm">
                {t("result.retake")}
              </PixelButton>
            </Link>

            <p className="font-mono text-sm text-muted text-center max-w-md mt-4">
              {t("app.disclaimer")}
            </p>
          </>
        )}
      </section>

      <footer className="font-mono text-sm text-muted text-center py-4">
        {t("app.footer")}
      </footer>
    </main>
  );
}
