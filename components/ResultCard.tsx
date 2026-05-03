"use client";
import { forwardRef } from "react";
import { ScoreResult } from "@/lib/scoring";
import { PARTIES, PartyId } from "@/lib/parties";
import { useI18n } from "@/lib/i18n";
import PixelAvatar from "./PixelAvatar";

interface Props {
  result: ScoreResult;
}

const PARTY_ORDER: PartyId[] = ["ph", "bn", "pn"];

const ResultCard = forwardRef<HTMLDivElement, Props>(function ResultCard({ result }, ref) {
  const { t } = useI18n();
  const winner = PARTIES[result.winner];
  const winPct = result.percent[result.winner];

  return (
    <div
      ref={ref}
      className="w-full max-w-md mx-auto bg-bg border-4 border-black shadow-pixellg p-6"
      style={{ background: "linear-gradient(180deg, #0a0e27 0%, #13183a 100%)" }}
    >
      <div className="text-center font-pixel text-[8px] text-muted uppercase tracking-widest mb-2">
        {t("app.subtitle")}
      </div>
      <div className="text-center font-pixel text-[10px] text-pixyellow uppercase tracking-widest mb-4">
        {t("result.heading")}
      </div>

      <div className="flex flex-col items-center mb-5">
        <div className="text-3xl mb-1">👑</div>
        <PixelAvatar party={winner.id} size={144} />
        <div
          className="mt-3 font-pixel text-base uppercase text-center px-4 py-1 border-4 border-black"
          style={{ background: winner.color, color: winner.accent }}
        >
          {winner.shortName} {winner.emoji}
        </div>
        <div className="font-mono text-2xl text-ink mt-2">{t(winner.fullKey)}</div>
        <div className="font-mono text-base text-muted">{t(winner.leaderKey)}</div>
        <div className="font-pixel text-sm text-pixyellow mt-2">
          {t("result.matchPercent", { percent: winPct })}
        </div>
      </div>

      <div className="font-pixel text-[8px] text-muted uppercase tracking-widest mb-2">
        {t("result.breakdown")}
      </div>
      <div className="space-y-2">
        {PARTY_ORDER.map((p) => {
          const party = PARTIES[p];
          const pct = result.percent[p];
          return (
            <div key={p} className="flex items-center gap-2">
              <div
                className="w-12 font-pixel text-[10px] py-1 px-1 text-center border-2 border-black"
                style={{ background: party.color, color: party.accent }}
              >
                {party.shortName}
              </div>
              <div className="flex-1 h-5 bg-bgalt border-2 border-black relative">
                <div
                  className="h-full"
                  style={{ width: `${pct}%`, background: party.color }}
                />
              </div>
              <div className="w-12 font-pixel text-[10px] text-ink text-right">
                {pct}%
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 text-center font-mono text-sm text-muted">
        ge16-quiz · #MyVoteMyFuture
      </div>
    </div>
  );
});

export default ResultCard;
