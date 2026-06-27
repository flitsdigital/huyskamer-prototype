"use client";

import { Button } from "@/components/ds/buttons/Button";
import { useToast } from "@/components/Toast";

export function CopyButton({ value, label, copiedLabel = "Gekopieerd!" }: { value: string; label: string; copiedLabel?: string }) {
  const toast = useToast();
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          toast(copiedLabel);
        } catch {
          toast("Kopiëren niet gelukt", "error");
        }
      }}
    >
      {label}
    </Button>
  );
}
