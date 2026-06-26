"use client";

import { Button } from "@/components/ds/buttons/Button";
import { useToast } from "@/components/Toast";

export function ShareButton({
  url,
  text,
  title,
  label,
  variant = "secondary",
  fullWidth,
}: {
  url: string;
  text?: string;
  title?: string;
  label: string;
  variant?: "primary" | "secondary" | "ghost";
  fullWidth?: boolean;
}) {
  const toast = useToast();
  async function share() {
    const nav = navigator as Navigator & { share?: (d: ShareData) => Promise<void> };
    if (nav.share) {
      try {
        await nav.share({ title, text, url });
      } catch {
        /* cancelled */
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        toast("Link gekopieerd");
      } catch {
        toast("Kopiëren niet gelukt", "error");
      }
    }
  }
  return (
    <Button type="button" variant={variant} fullWidth={fullWidth} onClick={share}>
      {label}
    </Button>
  );
}
