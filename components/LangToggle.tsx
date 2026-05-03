"use client";
import { Lang, LANG_LABEL, useI18n } from "@/lib/i18n";

const LANGS: Lang[] = ["en", "ms", "zh"];

export default function LangToggle() {
  const { lang, setLang, t } = useI18n();
  return (
    <div className="flex items-center gap-1 font-pixel text-[8px]">
      <span className="text-muted mr-1">{t("lang.label")}</span>
      {LANGS.map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`px-2 py-1 border-2 border-black transition-all
            ${
              lang === l
                ? "bg-pixyellow text-bg shadow-pixelsm"
                : "bg-bgalt text-ink hover:bg-bg"
            }`}
        >
          {LANG_LABEL[l]}
        </button>
      ))}
    </div>
  );
}
