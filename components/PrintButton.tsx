"use client";

import { Button } from "@/components/ds/buttons/Button";

export function PrintButton({ label = "Printen" }: { label?: string }) {
  return (
    <Button type="button" variant="secondary" size="sm" onDark onClick={() => window.print()}>
      {label}
    </Button>
  );
}
