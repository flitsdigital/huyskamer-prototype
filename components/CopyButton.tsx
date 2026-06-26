"use client";

import { Button } from "@/components/ds/buttons/Button";
import { useToast } from "@/components/Toast";

export function CopyButton({
  value,
  label,
  copiedLabel = "Gekopieerd!",
  variant = "ghost",
  size = "sm",
}: {
  value: string;
  label: string;
  copiedLabel?: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
}) {
  const toast = useToast();
  return (
    <Button
      type="button"
      variant={variant}
      size={size}
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
