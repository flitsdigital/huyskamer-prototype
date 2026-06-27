"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { LOCALES, LOCALE_LABELS, LOCALE_NAMES } from "@/lib/i18n";
import { useLocale } from "@/components/LocaleProvider";
import { setLocale } from "@/lib/actions/locale";

export function LanguageSwitcher() {
  const current = useLocale();
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <div className="lang" role="group" aria-label="Taal / Language">
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          className={`lang-btn ${current === l ? "active" : ""}`}
          aria-pressed={current === l}
          aria-label={LOCALE_NAMES[l]}
          disabled={pending}
          onClick={() =>
            start(async () => {
              await setLocale(l);
              router.refresh();
            })
          }
        >
          {LOCALE_LABELS[l]}
        </button>
      ))}
    </div>
  );
}
