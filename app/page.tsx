"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import LangToggle from "@/components/LangToggle";
import PixelButton from "@/components/PixelButton";
import PixelAvatar from "@/components/PixelAvatar";
import { PARTY_IDS } from "@/lib/parties";
import { requestGpsOnce } from "@/lib/geo";

export default function Home() {
  const { t } = useI18n();
  const router = useRouter();
  const [asking, setAsking] = useState(false);

  async function handleStart() {
    if (asking) return;
    setAsking(true);
    try {
      await requestGpsOnce(); // resolves whether allowed, denied, or timed out
    } finally {
      router.push("/quiz");
    }
  }

  return (
    <main className="min-h-screen px-4 py-6 flex flex-col">
      <header className="flex justify-between items-center max-w-5xl w-full mx-auto">
        <div className="font-pixel text-[10px] text-pixyellow uppercase tracking-widest">
          ▰ GE16
        </div>
        <LangToggle />
      </header>

      <section className="flex-1 flex flex-col items-center justify-center text-center max-w-3xl mx-auto py-12 gap-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="font-pixel text-[10px] text-pixcyan uppercase tracking-widest mb-3">
            {t("app.subtitle")}
          </div>
          <h1 className="font-pixel text-2xl md:text-4xl text-ink leading-relaxed">
            {t("app.title")}
          </h1>
          <p className="font-mono text-2xl md:text-3xl text-pixyellow mt-4">
            {t("app.tagline")}
          </p>
        </motion.div>

        <div className="flex justify-center gap-3 md:gap-6">
          {PARTY_IDS.map((p, i) => (
            <motion.div
              key={p}
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                delay: i * 0.25,
                ease: "easeInOut",
              }}
            >
              <PixelAvatar party={p} size={96} />
            </motion.div>
          ))}
        </div>

        <PixelButton size="lg" variant="primary" onClick={handleStart} disabled={asking}>
          ▶ {asking ? "…" : t("app.start")}
        </PixelButton>

        <p className="font-mono text-base text-muted max-w-md">
          {t("app.disclaimer")}
        </p>
        <p className="font-mono text-xs text-muted max-w-md opacity-70">
          {t("app.privacy")}
        </p>
      </section>

      <footer className="font-mono text-sm text-muted text-center py-4 max-w-3xl mx-auto">
        {t("app.byline")} · {t("app.footer")}
      </footer>
    </main>
  );
}
