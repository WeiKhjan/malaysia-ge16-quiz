"use client";
import { RefObject, useState } from "react";
import { toPng } from "html-to-image";
import { useI18n } from "@/lib/i18n";
import { PARTIES } from "@/lib/parties";
import { ScoreResult } from "@/lib/scoring";
import PixelButton from "./PixelButton";

interface Props {
  cardRef: RefObject<HTMLDivElement | null>;
  result: ScoreResult;
}

export default function ShareButtons({ cardRef, result }: Props) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  const partyName = t(PARTIES[result.winner].fullKey);
  const caption = t("result.shareCaption", { party: partyName });
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  async function handleDownload() {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#0a0e27",
      });
      // Try Web Share API w/ file first (mobile)
      try {
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], "ge16-result.png", { type: "image/png" });
        if (
          typeof navigator !== "undefined" &&
          (navigator as Navigator & { canShare?: (d: ShareData) => boolean }).canShare?.({ files: [file] })
        ) {
          await navigator.share({ files: [file], title: caption, text: caption });
          return;
        }
      } catch {
        /* fallthrough to download */
      }
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "ge16-result.png";
      link.click();
    } catch (e) {
      console.error(e);
      alert("Could not generate image. Try again.");
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(`${caption} ${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    caption,
  )}&url=${encodeURIComponent(shareUrl)}`;
  const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const waUrl = `https://wa.me/?text=${encodeURIComponent(`${caption} ${shareUrl}`)}`;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="font-pixel text-[10px] uppercase text-pixyellow tracking-widest">
        {t("result.share")}
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <PixelButton onClick={handleDownload} variant="primary">
          {t("result.download")}
        </PixelButton>
        <PixelButton onClick={handleCopy} variant="secondary">
          {copied ? t("result.copied") : t("result.copy")}
        </PixelButton>
      </div>
      <div className="flex gap-3 mt-1">
        <a
          href={tweetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-pixel text-[10px] px-3 py-2 border-4 border-black shadow-pixelsm bg-black text-pixyellow hover:bg-bgalt"
          aria-label="Share on X"
        >
          X
        </a>
        <a
          href={fbUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-pixel text-[10px] px-3 py-2 border-4 border-black shadow-pixelsm bg-[#1877f2] text-white hover:opacity-90"
          aria-label="Share on Facebook"
        >
          FB
        </a>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-pixel text-[10px] px-3 py-2 border-4 border-black shadow-pixelsm bg-[#25d366] text-white hover:opacity-90"
          aria-label="Share on WhatsApp"
        >
          WA
        </a>
      </div>
    </div>
  );
}
