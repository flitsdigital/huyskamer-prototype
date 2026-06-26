"use client";

import { Button } from "@/components/ds/buttons/Button";

export function PrintButton({ label = "Printen" }: { label?: string }) {
  return (
    <Button type="button" variant="secondary" size="sm" onClick={() => window.print()}>
      {label}
    </Button>
  );
}
